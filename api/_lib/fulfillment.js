'use strict';

/**
 * Fulfillment library for paid CMO Kit PDFs (starter $3.99, pro $8.99).
 * Ported from DITreneris/teacher (promptanatomy.online) and adapted for
 * promptanatomy.space + CMO Team License copy.
 *
 * Design pillars (memo_pdf.md):
 *  1. One domain (success URL, webhook, Redis, SITE_URL all on .space)
 *  2. Shared Stripe account: fulfill only CMO identity (metadata / payment_link / price id).
 *     Never match on dollar amount. Unknown checkout → ignored (HTTP 200), not 500.
 *  3. Idempotent webhook (Redis lock + fulfillment:cs_* state)
 *  4. Two TTLs: 7 days (email link) / 15 minutes (success page in-page link)
 *  5. Private PDFs only; download route is signed + Cache-Control: private, no-store
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');
const { Resend } = require('resend');

const DOWNLOAD_TOKEN_TTL_SECONDS = Number(
  process.env.DOWNLOAD_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 7
);
const IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS = Number(
  process.env.IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS || 60 * 15
);
const REDIS_STATE_TTL_SECONDS = Number(
  process.env.FULFILLMENT_STATE_TTL_SECONDS || 60 * 60 * 24 * 90
);

const PRODUCTS = {
  starter: {
    id: 'starter',
    publicId: 'cmo-starter-pdf',
    name: 'CMO AI Content System · Starter',
    price: '$3.99',
    amountCents: 399,
    priceEnv: 'STRIPE_PRICE_CMO_STARTER_PDF',
    sourceUrlEnv: 'PDF_CMO_STARTER_SOURCE_URL',
    localFileName: 'cmo-starter.pdf',
    downloadFileName: 'prompt-anatomy-cmo-starter.pdf',
    contentType: 'application/pdf'
  },
  pro: {
    id: 'pro',
    publicId: 'cmo-pro-pdf',
    name: 'CMO AI Content System · Pro',
    price: '$8.99',
    amountCents: 899,
    priceEnv: 'STRIPE_PRICE_CMO_PRO_PDF',
    sourceUrlEnv: 'PDF_CMO_PRO_SOURCE_URL',
    localFileName: 'cmo-pro.pdf',
    downloadFileName: 'prompt-anatomy-cmo-pro.pdf',
    contentType: 'application/pdf',
    includesMd: true
  },
  bundle: {
    id: 'bundle',
    publicId: 'cmo-bundle-pdf',
    name: 'CMO AI Content System · Complete Kit',
    price: '$10.99',
    amountCents: 1099,
    priceEnv: 'STRIPE_PRICE_CMO_BUNDLE_PDF',
    sourceUrlEnv: null,
    localFileName: null,
    downloadFileName: 'cmo-prompt-kit-bundle',
    contentType: 'application/pdf',
    deliverProductIds: ['starter', 'pro'],
    includesMd: true
  },
  'pro-md': {
    id: 'pro-md',
    publicId: 'cmo-pro-md',
    name: 'CMO AI Content System · Pro (Markdown companion)',
    price: '',
    amountCents: 0,
    priceEnv: null,
    sourceUrlEnv: 'PDF_CMO_PRO_MD_SOURCE_URL',
    localFileName: 'cmo-pro-prompts.md',
    downloadFileName: 'cmo-pro-prompts.md',
    contentType: 'text/markdown; charset=utf-8'
  }
};

let redisClient = null;
let resendClient = null;

const FULFILLMENT_REQUIRED_ENV = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'DOWNLOAD_TOKEN_SECRET',
  'RESEND_API_KEY',
  'FULFILLMENT_FROM_EMAIL',
  'PDF_CMO_STARTER_SOURCE_URL',
  'PDF_CMO_PRO_SOURCE_URL'
];

function listMissingFulfillmentEnv() {
  return FULFILLMENT_REQUIRED_ENV.filter((key) => !process.env[key]);
}

function assertFulfillmentConfigured() {
  const missing = listMissingFulfillmentEnv();
  if (missing.length) {
    throw new Error(`Fulfillment env missing on server: ${missing.join(', ')}`);
  }

  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (typeof secret === 'string' && secret.includes(' ') && !secret.includes('+')) {
    throw new Error(
      'DOWNLOAD_TOKEN_SECRET looks corrupted (spaces instead of +). Re-paste the value in Vercel with quotes or use a base64 secret without + characters.'
    );
  }
}

async function checkFulfillmentHealth() {
  const missing = listMissingFulfillmentEnv();
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (missing.length) {
    return { ok: false, missing, redis: 'skipped', blobConfigured };
  }

  try {
    const ping = await getRedis().ping();
    return {
      ok: ping === 'PONG',
      missing: [],
      redis: ping === 'PONG' ? 'ok' : String(ping),
      blobConfigured
    };
  } catch (error) {
    console.error(
      '[fulfillment-health] Redis ping failed:',
      error && error.message ? error.message : error
    );
    return {
      ok: false,
      missing: [],
      redis: 'error',
      blobConfigured
    };
  }
}

function getRedis() {
  if (redisClient) return redisClient;

  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.VERCEL_KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.VERCEL_KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('Redis REST environment variables are not configured.');
  }

  redisClient = new Redis({ url, token });
  return redisClient;
}

function getResend() {
  if (resendClient) return resendClient;
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }
  resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

function getProductById(productId) {
  return (
    Object.values(PRODUCTS).find(
      (product) => product.id === productId || product.publicId === productId
    ) || null
  );
}

function getProductByPriceId(priceId) {
  if (!priceId) return null;
  return (
    Object.values(PRODUCTS).find(
      (product) => product.priceEnv && process.env[product.priceEnv] === priceId
    ) || null
  );
}

const PAYMENT_LINK_ENV = {
  starter: 'STRIPE_PAYMENT_LINK_CMO_STARTER',
  pro: 'STRIPE_PAYMENT_LINK_CMO_PRO',
  bundle: 'STRIPE_PAYMENT_LINK_CMO_BUNDLE'
};

/**
 * Optional allowlist when several products share one Stripe account.
 * Not required for health — price id + metadata already isolate CMO.
 */
function getProductByPaymentLinkId(paymentLinkId) {
  if (!paymentLinkId || typeof paymentLinkId !== 'string') return null;
  for (const id of ['starter', 'pro', 'bundle']) {
    const configured = process.env[PAYMENT_LINK_ENV[id]];
    if (configured && configured === paymentLinkId) return PRODUCTS[id];
  }
  return null;
}

/**
 * Checkout SKU only (not the Markdown companion).
 */
function getCmoCheckoutProductByMetadata(productId) {
  if (!productId || productId === 'pro-md') return null;
  const product = getProductById(productId);
  if (!product || !product.priceEnv) return null;
  return product;
}

function getDeliverableProductIds(product) {
  if (!product) return [];
  if (Array.isArray(product.deliverProductIds) && product.deliverProductIds.length) {
    return product.deliverProductIds.slice();
  }
  if (product.id === 'pro-md') return ['pro-md'];
  return [product.id];
}

function productIncludesMdCompanion(product) {
  return product && (product.includesMd === true || product.id === 'bundle');
}

/**
 * Identify a CMO kit checkout. Returns null for other products on the same
 * Stripe account (do not throw — webhook must ACK those events).
 * Amount / tax totals are not identity: another SKU can share $3.99.
 */
function getProductFromSession(session) {
  if (!session) return null;

  const metadataProduct =
    session.metadata && session.metadata.product
      ? getCmoCheckoutProductByMetadata(session.metadata.product)
      : null;
  if (metadataProduct) return metadataProduct;

  const byPaymentLink = getProductByPaymentLinkId(session.payment_link);
  if (byPaymentLink) return byPaymentLink;

  const lineItems =
    session.line_items && Array.isArray(session.line_items.data)
      ? session.line_items.data
      : [];

  for (const item of lineItems) {
    const priceId = item && item.price ? item.price.id : '';
    const product = getProductByPriceId(priceId);
    if (product) return product;
  }

  return null;
}

function getCustomerEmail(session) {
  if (session && session.customer_details && session.customer_details.email) {
    return session.customer_details.email;
  }
  if (session && session.customer_email) {
    return session.customer_email;
  }
  throw new Error('Checkout Session has no customer email.');
}

function base64url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function signEncodedPayload(encodedPayload) {
  const secret = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!secret) {
    throw new Error('DOWNLOAD_TOKEN_SECRET is not configured.');
  }
  return crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function createDownloadToken(sessionId, productId, ttlSeconds) {
  const ttl =
    Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : DOWNLOAD_TOKEN_TTL_SECONDS;
  const payload = {
    v: 1,
    sid: sessionId,
    product: productId,
    jti: crypto.randomBytes(18).toString('base64url'),
    exp: Math.floor(Date.now() / 1000) + ttl
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  return {
    token: `${encodedPayload}.${signEncodedPayload(encodedPayload)}`,
    payload
  };
}

function maskEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const atIndex = email.indexOf('@');
  if (atIndex <= 0 || atIndex === email.length - 1) return email;
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length === 1) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

function verifyDownloadToken(token) {
  if (!token || typeof token !== 'string' || token.indexOf('.') === -1) {
    throw new Error('Invalid download token.');
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    throw new Error('Invalid download token.');
  }

  const expectedSignature = signEncodedPayload(parts[0]);
  const actualSignature = parts[1];
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(actualSignature);

  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
    throw new Error('Invalid download token signature.');
  }

  const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Download token has expired.');
  }

  return payload;
}

async function redisGetJson(key) {
  const value = await getRedis().get(key);
  if (!value) return null;
  return typeof value === 'string' ? JSON.parse(value) : value;
}

async function redisSetJson(key, value, ttlSeconds, options) {
  const setOptions = Object.assign(
    {},
    options || {},
    ttlSeconds ? { ex: ttlSeconds } : {}
  );
  return getRedis().set(key, JSON.stringify(value), setOptions);
}

async function acquireLock(key, ttlSeconds) {
  const result = await redisSetJson(
    key,
    { lockedAt: new Date().toISOString() },
    ttlSeconds,
    { nx: true }
  );
  return result === 'OK' || result === true;
}

async function releaseLock(key) {
  await getRedis().del(key);
}

function getSiteUrl(origin) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (origin) return origin.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://promptanatomy.space';
}

function getLocalPdfPath(product) {
  if (product.id === 'pro-md') {
    return path.join(__dirname, '..', '_private', 'prompts', product.localFileName);
  }
  return path.join(__dirname, '..', '_private', 'pdfs', product.localFileName);
}

async function assertProductAssetAvailable(product) {
  if (!product.sourceUrlEnv && product.deliverProductIds) return;
  if (process.env[product.sourceUrlEnv]) return;
  if (product.localFileName && fs.existsSync(getLocalPdfPath(product))) return;
  throw new Error(`${product.name} PDF source is not configured.`);
}

function getSourceHeaders(sourceUrl) {
  const headers = {};
  if (process.env.PDF_SOURCE_AUTH_HEADER) {
    const separatorIndex = process.env.PDF_SOURCE_AUTH_HEADER.indexOf(':');
    if (separatorIndex > 0) {
      const name = process.env.PDF_SOURCE_AUTH_HEADER.slice(0, separatorIndex).trim();
      const value = process.env.PDF_SOURCE_AUTH_HEADER.slice(separatorIndex + 1).trim();
      if (name && value) headers[name] = value;
    }
  }
  if (process.env.PDF_SOURCE_AUTH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.PDF_SOURCE_AUTH_TOKEN}`;
  }
  if (
    sourceUrl &&
    /blob\.vercel-storage\.com/i.test(sourceUrl) &&
    process.env.BLOB_READ_WRITE_TOKEN &&
    !headers.Authorization
  ) {
    headers.Authorization = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
  }
  return headers;
}

async function loadProductPdf(product) {
  const sourceUrl = process.env[product.sourceUrlEnv];
  if (sourceUrl) {
    const response = await globalThis.fetch(sourceUrl, {
      headers: getSourceHeaders(sourceUrl)
    });
    if (!response.ok) {
      throw new Error(`${product.name} PDF source returned ${response.status}.`);
    }
    return {
      type: 'buffer',
      body: Buffer.from(await response.arrayBuffer()),
      contentType: product.contentType || response.headers.get('content-type') || 'application/pdf'
    };
  }

  const localPath = getLocalPdfPath(product);
  if (!fs.existsSync(localPath)) {
    throw new Error(`${product.name} PDF file is missing.`);
  }

  return {
    type: 'stream',
    body: fs.createReadStream(localPath),
    contentType: product.contentType || 'application/pdf'
  };
}

async function storeDownloadToken(sessionId, productId, email, ttlSeconds, extra) {
  const token = createDownloadToken(sessionId, productId, ttlSeconds);
  const now = new Date().toISOString();
  await redisSetJson(
    `download-token:${token.payload.jti}`,
    Object.assign(
      {
        sessionId,
        productId,
        email,
        createdAt: now,
        expiresAt: new Date(token.payload.exp * 1000).toISOString()
      },
      extra || {}
    ),
    ttlSeconds
  );
  return token;
}

async function scheduleStarterFollowups(sessionId, email) {
  if (process.env.FULFILLMENT_FOLLOWUP_ENABLED !== '1') return;
  const day3 = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3;
  const day7 = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  await redisSetJson(
    `followup:${sessionId}:day3`,
    { sessionId, email, template: 'starter-day3', dueAt: day3 },
    60 * 60 * 24 * 14
  );
  await redisSetJson(
    `followup:${sessionId}:day7`,
    { sessionId, email, template: 'starter-day7-upsell', dueAt: day7 },
    60 * 60 * 24 * 14
  );
}

async function buildDownloadLinksForProduct(sessionId, product, email, origin) {
  const deliverIds = getDeliverableProductIds(product);
  const links = [];
  for (const pid of deliverIds) {
    const deliverable = getProductById(pid);
    if (!deliverable) continue;
    const token = await storeDownloadToken(
      sessionId,
      deliverable.id,
      email,
      DOWNLOAD_TOKEN_TTL_SECONDS
    );
    links.push({
      label: deliverable.name,
      url: buildDownloadUrl(token.token, origin)
    });
  }
  if (productIncludesMdCompanion(product)) {
    const md = getProductById('pro-md');
    const mdUrlEnv = md && md.sourceUrlEnv ? process.env[md.sourceUrlEnv] : null;
    const mdLocal = md && md.localFileName ? fs.existsSync(getLocalPdfPath(md)) : false;
    if (md && (mdUrlEnv || mdLocal)) {
      const mdToken = await storeDownloadToken(
        sessionId,
        md.id,
        email,
        DOWNLOAD_TOKEN_TTL_SECONDS
      );
      links.push({
        label: 'Markdown companion',
        url: buildDownloadUrl(mdToken.token, origin)
      });
    }
  }
  return links;
}

function buildDownloadUrl(token, origin) {
  const url = new URL('/api/download', getSiteUrl(origin));
  url.searchParams.set('t', token);
  return url.toString();
}

function buildEmailText(product, downloadLinks) {
  const links = Array.isArray(downloadLinks) ? downloadLinks : [{ label: product.name, url: downloadLinks }];
  const linkBlock = links.map((item) => `${item.label}: ${item.url}`).join('\n');
  return [
    `Thank you for buying ${product.name}.`,
    '',
    linkBlock,
    '',
    `Secure link(s) expire in ${Math.round(DOWNLOAD_TOKEN_TTL_SECONDS / 86400)} days.`,
    'You also received a Stripe receipt under separate cover.',
    '',
    'Team license: use within your own brand and share with your immediate marketing team.',
    'Do not redistribute the full PDF as-is.',
    'Full license: https://promptanatomy.space/terms.html#paid-pdf-license',
    '',
    '14-day no-questions refund: just reply to this email or to your Stripe receipt.',
    'Need help? Contact info@promptanatomy.app.',
    '',
    'Prompt Anatomy'
  ].join('\n');
}

function buildEmailHtml(product, downloadLinks) {
  const days = Math.round(DOWNLOAD_TOKEN_TTL_SECONDS / 86400);
  const links = Array.isArray(downloadLinks) ? downloadLinks : [{ label: product.name, url: downloadLinks }];
  const buttons = links
    .map(
      (item) =>
        `<p style="margin:0 0 12px;"><a href="${escapeHtml(item.url)}" style="display:inline-block;background:#2F6FED;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">Download ${escapeHtml(item.label)}</a></p>`
    )
    .join('');
  return [
    '<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#1c2b3a;line-height:1.5;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;padding:24px;">',
    `<tr><td><h1 style="font-size:20px;margin:0 0 12px;">Your ${escapeHtml(product.name)}</h1>`,
    '<p style="margin:0 0 16px;">Thank you for your purchase. Use the button(s) below to download.</p>',
    buttons,
    `<p style="margin:0 0 16px;font-size:14px;color:#6b7a8c;">Secure link(s) expire in ${days} days. You also received a Stripe receipt under separate cover.</p>`,
    '<hr style="border:none;border-top:1px solid #e6ecf2;margin:24px 0;">',
    '<p style="margin:0 0 12px;font-size:14px;"><strong>Team license.</strong> Use within your own brand and share with your immediate marketing team. Do not redistribute the full PDF as-is. <a href="https://promptanatomy.space/terms.html#paid-pdf-license">Full license</a>.</p>',
    '<p style="margin:0 0 12px;font-size:14px;"><strong>14-day no-questions refund.</strong> Just reply to this email or to your Stripe receipt. We approve the refund and revoke this link.</p>',
    '<p style="margin:0;font-size:14px;color:#6b7a8c;">Need help? Contact <a href="mailto:info@promptanatomy.app">info@promptanatomy.app</a>.</p>',
    '<p style="margin:16px 0 0;font-size:12px;color:#6b7a8c;">Prompt Anatomy &middot; promptanatomy.space</p>',
    '</td></tr></table></body></html>'
  ].join('');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendFulfillmentEmail(email, product, downloadLinks) {
  if (!process.env.FULFILLMENT_FROM_EMAIL) {
    throw new Error('FULFILLMENT_FROM_EMAIL is not configured.');
  }

  const { data, error } = await getResend().emails.send({
    from: process.env.FULFILLMENT_FROM_EMAIL,
    to: email,
    subject: `Your ${product.name} download`,
    text: buildEmailText(product, downloadLinks),
    html: buildEmailHtml(product, downloadLinks)
  });

  if (error) {
    const detail = error.message || JSON.stringify(error);
    throw new Error(`Resend rejected email: ${detail}`);
  }
  if (!data || !data.id) {
    throw new Error('Resend did not return a message id.');
  }
}

async function fulfillCheckoutSession(stripe, sessionId, origin) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items']
  });
  if (session.payment_status !== 'paid') {
    return { status: 'not_paid', sessionId };
  }

  const product = getProductFromSession(session);
  if (!product) {
    return { status: 'ignored', sessionId, reason: 'unknown_product' };
  }

  const fulfillmentKey = `fulfillment:${session.id}`;
  const existing = await redisGetJson(fulfillmentKey);
  if (existing && existing.status === 'fulfilled') {
    return { status: 'already_fulfilled', sessionId };
  }

  const lockKey = `fulfillment-lock:${session.id}`;
  const locked = await acquireLock(lockKey, 300);
  if (!locked) {
    return { status: 'locked', sessionId };
  }

  try {
    const lockedExisting = await redisGetJson(fulfillmentKey);
    if (lockedExisting && lockedExisting.status === 'fulfilled') {
      return { status: 'already_fulfilled', sessionId };
    }

    const deliverIds = getDeliverableProductIds(product);
    for (const pid of deliverIds) {
      const deliverable = getProductById(pid);
      if (deliverable) await assertProductAssetAvailable(deliverable);
    }
    const email = getCustomerEmail(session);
    const downloadLinks = await buildDownloadLinksForProduct(
      session.id,
      product,
      email,
      origin
    );
    const now = new Date().toISOString();

    await redisSetJson(
      fulfillmentKey,
      {
        status: 'email_pending',
        sessionId: session.id,
        productId: product.id,
        deliverProductIds: deliverIds,
        email,
        createdAt: now
      },
      REDIS_STATE_TTL_SECONDS
    );

    await sendFulfillmentEmail(email, product, downloadLinks);

    await redisSetJson(
      fulfillmentKey,
      {
        status: 'fulfilled',
        sessionId: session.id,
        productId: product.id,
        deliverProductIds: deliverIds,
        email,
        fulfilledAt: new Date().toISOString()
      },
      REDIS_STATE_TTL_SECONDS
    );

    if (product.id === 'starter') {
      await scheduleStarterFollowups(session.id, email);
    }

    return { status: 'fulfilled', sessionId: session.id, productId: product.id };
  } finally {
    await releaseLock(lockKey);
  }
}

async function resolveDownload(token) {
  const payload = verifyDownloadToken(token);
  const product = getProductById(payload.product);
  if (!product) {
    throw new Error('Unknown PDF product.');
  }

  const tokenRecord = await redisGetJson(`download-token:${payload.jti}`);
  if (
    !tokenRecord ||
    tokenRecord.sessionId !== payload.sid ||
    tokenRecord.productId !== product.id
  ) {
    throw new Error('Download token is not active.');
  }

  const fulfillment = await redisGetJson(`fulfillment:${payload.sid}`);
  if (!fulfillment || fulfillment.status !== 'fulfilled') {
    throw new Error('Purchase has not been fulfilled.');
  }
  const allowed =
    Array.isArray(fulfillment.deliverProductIds) && fulfillment.deliverProductIds.length
      ? fulfillment.deliverProductIds.concat(['pro-md'])
      : [fulfillment.productId, 'pro-md'];
  if (allowed.indexOf(product.id) === -1) {
    throw new Error('Purchase has not been fulfilled.');
  }

  return { product, fulfillment };
}

/**
 * Re-mint a short-lived (15-minute) download token for an already-fulfilled
 * Stripe Checkout Session. Used by success.html so the buyer can click
 * "Download" right after redirect, without waiting for the email.
 *
 * Returns:
 *   { status: 'ready', url, downloadUrl, downloads, expiresAt, maskedEmail, productId, productName }
 *   url === downloadUrl (LEGACY {url} + current {downloadUrl})
 *   downloads[] has one entry per deliverProductIds (bundle = Starter + Pro)
 *   { status: 'processing' }   - webhook has not yet completed
 *   throws Error               - unknown session or missing fulfillment record
 */
async function getDownloadUrlBySessionId(sessionId, origin) {
  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('Missing session id.');
  }

  const fulfillment = await redisGetJson(`fulfillment:${sessionId}`);
  if (!fulfillment) {
    throw new Error('Unknown checkout session.');
  }
  if (fulfillment.status !== 'fulfilled') {
    return { status: 'processing' };
  }

  const product = getProductById(fulfillment.productId);
  if (!product) {
    throw new Error('Unknown PDF product on fulfillment record.');
  }

  const deliverIds = getDeliverableProductIds(product);
  const downloads = [];
  let expiresAt = null;
  for (const pid of deliverIds) {
    const deliverable = getProductById(pid);
    if (!deliverable) continue;
    const token = await storeDownloadToken(
      sessionId,
      deliverable.id,
      fulfillment.email,
      IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS,
      { inPage: true }
    );
    downloads.push({
      productId: deliverable.id,
      productName: deliverable.name,
      url: buildDownloadUrl(token.token, origin)
    });
    expiresAt = new Date(token.payload.exp * 1000).toISOString();
  }
  if (!downloads.length) {
    throw new Error('No downloadable files on fulfillment record.');
  }

  const primaryUrl = downloads[0].url;
  return {
    status: 'ready',
    url: primaryUrl,
    downloadUrl: primaryUrl,
    downloads: downloads,
    expiresAt: expiresAt,
    maskedEmail: maskEmail(fulfillment.email),
    productId: product.id,
    productName: product.name
  };
}

function buildFollowupEmail(template, email) {
  const site = getSiteUrl();
  if (template === 'starter-day3') {
    return {
      subject: 'Run Prompt 5 this Friday — CMO Starter',
      text: [
        'Quick tip for your CMO AI Content System · Starter:',
        '',
        'This Friday, run Prompt 5 (Action → Decision) with last week\'s channel metrics.',
        'Name one underperformer, one test, and one pause — with an owner.',
        '',
        `Free interactive library: ${site}/en/`,
        '',
        'Prompt Anatomy'
      ].join('\n'),
      html:
        '<p>Quick tip for your <strong>CMO AI Content System · Starter</strong>:</p>' +
        '<p>This Friday, run <strong>Prompt 5</strong> (Action → Decision) with last week\'s channel metrics. Name one underperformer, one test, and one pause — with an owner.</p>' +
        `<p><a href="${escapeHtml(site)}/en/">Open the free library</a></p>`
    };
  }
  return {
    subject: 'Upgrade to Pro when your team is ready',
    text: [
      'Your Starter kit covers the weekly loop. When you need full prompt bodies, scenario plays, and a team workshop, Pro adds:',
      '',
      '- 30-page operational PDF + Markdown companion',
      '- Expected outputs you can score against',
      '- A Build section for designing your own reusable workflows and tools',
      '- Week-1 quickstart and 90-minute workshop outline',
      '',
      `Compare options: ${site}/en/#pdf-storefront`,
      '',
      'Prompt Anatomy'
    ].join('\n'),
    html:
      '<p>Your Starter kit covers the weekly loop. When you need full prompt bodies, scenario plays, team rollout, and a method for building your own reusable workflows, <strong>Pro</strong> adds the 30-page operational PDF plus Markdown companion.</p>' +
      `<p><a href="${escapeHtml(site)}/en/#pdf-storefront">Compare Starter vs Pro</a></p>`
  };
}

async function processDueFollowups() {
  if (process.env.FULFILLMENT_FOLLOWUP_ENABLED !== '1') {
    return { ok: true, skipped: true, processed: 0 };
  }
  if (!process.env.FULFILLMENT_FROM_EMAIL || !process.env.RESEND_API_KEY) {
    throw new Error('Follow-up email is not configured.');
  }
  const redis = getRedis();
  const keys = await redis.keys('followup:*');
  const now = Math.floor(Date.now() / 1000);
  let processed = 0;
  for (const key of keys) {
    const job = await redisGetJson(key);
    if (!job || !job.dueAt || job.dueAt > now || job.sentAt) continue;
    const copy = buildFollowupEmail(job.template, job.email);
    const { error } = await getResend().emails.send({
      from: process.env.FULFILLMENT_FROM_EMAIL,
      to: job.email,
      subject: copy.subject,
      text: copy.text,
      html: copy.html
    });
    if (error) {
      throw new Error(`Follow-up send failed for ${key}: ${error.message || JSON.stringify(error)}`);
    }
    await redisSetJson(key, Object.assign({}, job, { sentAt: new Date().toISOString() }), 60 * 60 * 24 * 14);
    processed++;
  }
  return { ok: true, processed };
}

module.exports = {
  PRODUCTS,
  FULFILLMENT_REQUIRED_ENV,
  assertFulfillmentConfigured,
  checkFulfillmentHealth,
  listMissingFulfillmentEnv,
  fulfillCheckoutSession,
  loadProductPdf,
  resolveDownload,
  getDownloadUrlBySessionId,
  maskEmail,
  getSiteUrl,
  getProductFromSession,
  processDueFollowups
};
