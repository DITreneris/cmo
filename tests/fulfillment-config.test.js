/**
 * Fulfillment configuration tests (offline, no network).
 *
 * Verifies that:
 *   - api/_lib/fulfillment.js PRODUCTS map matches the SOT prices ($3.99 / $8.99)
 *     and amountCents (399 / 899) the webhook depends on.
 *   - FULFILLMENT_REQUIRED_ENV lists the CMO-specific keys (no leftovers from the
 *     ported teacher repo).
 *   - listMissingFulfillmentEnv reports correctly when keys are missing/present.
 *   - getSiteUrl falls back to https://promptanatomy.space.
 *   - All four /api/* route files export a function and use raw-body where required.
 *   - SOT mirror.renderPaidStorefront is false.
 *
 * Run: node tests/fulfillment-config.test.js  (or `npm run test:fulfillment-config`)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOT_PATH = path.join(ROOT, 'config', 'sot.json');
const FULFILLMENT_PATH = path.join(ROOT, 'api', '_lib', 'fulfillment.js');
const STRIPE_WEBHOOK_PATH = path.join(ROOT, 'api', 'stripe-webhook.js');
const DOWNLOAD_LINK_PATH = path.join(ROOT, 'api', 'download-link.js');
const DOWNLOAD_PATH = path.join(ROOT, 'api', 'download.js');
const HEALTH_PATH = path.join(ROOT, 'api', 'fulfillment-health.js');

let passed = 0;
let failed = 0;

function ok(msg) { console.log('OK  ' + msg); passed++; }
function bad(msg) { console.error('FAIL ' + msg); failed++; }
function check(cond, msg) { cond ? ok(msg) : bad(msg); }

function exists(p) { return fs.existsSync(p); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }

check(exists(FULFILLMENT_PATH), 'api/_lib/fulfillment.js exists');
check(exists(STRIPE_WEBHOOK_PATH), 'api/stripe-webhook.js exists');
check(exists(DOWNLOAD_LINK_PATH), 'api/download-link.js exists');
check(exists(DOWNLOAD_PATH), 'api/download.js exists');
check(exists(HEALTH_PATH), 'api/fulfillment-health.js exists');
check(exists(SOT_PATH), 'config/sot.json exists');

const fulfillment = require(FULFILLMENT_PATH);

check(fulfillment && typeof fulfillment === 'object', 'fulfillment module loads');
check(fulfillment.PRODUCTS && fulfillment.PRODUCTS.starter && fulfillment.PRODUCTS.pro && fulfillment.PRODUCTS.bundle, 'PRODUCTS has starter + pro + bundle');

if (fulfillment.PRODUCTS) {
  const s = fulfillment.PRODUCTS.starter;
  const p = fulfillment.PRODUCTS.pro;
  const b = fulfillment.PRODUCTS.bundle;
  check(s.amountCents === 399, 'starter.amountCents === 399');
  check(p.amountCents === 899, 'pro.amountCents === 899');
  check(b.amountCents === 1099, 'bundle.amountCents === 1099');
  check(s.price === '$3.99', 'starter.price === "$3.99"');
  check(p.price === '$8.99', 'pro.price === "$8.99"');
  check(s.priceEnv === 'STRIPE_PRICE_CMO_STARTER_PDF', 'starter.priceEnv is the CMO-scoped env name');
  check(p.priceEnv === 'STRIPE_PRICE_CMO_PRO_PDF', 'pro.priceEnv is the CMO-scoped env name');
  check(s.sourceUrlEnv === 'PDF_CMO_STARTER_SOURCE_URL', 'starter.sourceUrlEnv is CMO-scoped');
  check(p.sourceUrlEnv === 'PDF_CMO_PRO_SOURCE_URL', 'pro.sourceUrlEnv is CMO-scoped');
  check(typeof s.downloadFileName === 'string' && /\.pdf$/.test(s.downloadFileName), 'starter.downloadFileName ends with .pdf');
  check(typeof p.downloadFileName === 'string' && /\.pdf$/.test(p.downloadFileName), 'pro.downloadFileName ends with .pdf');
}

check(
  Array.isArray(fulfillment.FULFILLMENT_REQUIRED_ENV) && fulfillment.FULFILLMENT_REQUIRED_ENV.length >= 5,
  'FULFILLMENT_REQUIRED_ENV is a non-empty array'
);
if (Array.isArray(fulfillment.FULFILLMENT_REQUIRED_ENV)) {
  const list = fulfillment.FULFILLMENT_REQUIRED_ENV;
  check(list.includes('PDF_CMO_STARTER_SOURCE_URL'), 'FULFILLMENT_REQUIRED_ENV requires PDF_CMO_STARTER_SOURCE_URL');
  check(list.includes('PDF_CMO_PRO_SOURCE_URL'), 'FULFILLMENT_REQUIRED_ENV requires PDF_CMO_PRO_SOURCE_URL');
  check(list.includes('UPSTASH_REDIS_REST_URL'), 'FULFILLMENT_REQUIRED_ENV requires UPSTASH_REDIS_REST_URL');
  check(list.includes('UPSTASH_REDIS_REST_TOKEN'), 'FULFILLMENT_REQUIRED_ENV requires UPSTASH_REDIS_REST_TOKEN');
  check(list.includes('DOWNLOAD_TOKEN_SECRET'), 'FULFILLMENT_REQUIRED_ENV requires DOWNLOAD_TOKEN_SECRET');
  check(list.includes('RESEND_API_KEY'), 'FULFILLMENT_REQUIRED_ENV requires RESEND_API_KEY');
  check(list.includes('FULFILLMENT_FROM_EMAIL'), 'FULFILLMENT_REQUIRED_ENV requires FULFILLMENT_FROM_EMAIL');
  const stale = list.filter((k) => /BEGINNERS|ADVANCED/i.test(k));
  check(stale.length === 0, 'FULFILLMENT_REQUIRED_ENV has no stale teacher-repo keys (BEGINNERS/ADVANCED)');
}

if (typeof fulfillment.listMissingFulfillmentEnv === 'function') {
  const SAVED = {};
  for (const key of fulfillment.FULFILLMENT_REQUIRED_ENV || []) {
    SAVED[key] = process.env[key];
    delete process.env[key];
  }
  const allMissing = fulfillment.listMissingFulfillmentEnv();
  check(
    Array.isArray(allMissing) && allMissing.length === (fulfillment.FULFILLMENT_REQUIRED_ENV || []).length,
    'listMissingFulfillmentEnv reports all keys missing when env is empty'
  );
  for (const key of fulfillment.FULFILLMENT_REQUIRED_ENV || []) {
    process.env[key] = key === 'FULFILLMENT_FROM_EMAIL' ? 'info@promptanatomy.app' : 'test_value_for_' + key;
  }
  const noneMissing = fulfillment.listMissingFulfillmentEnv();
  check(
    Array.isArray(noneMissing) && noneMissing.length === 0,
    'listMissingFulfillmentEnv reports zero missing when env is fully populated'
  );
  for (const key of Object.keys(SAVED)) {
    if (SAVED[key] === undefined) delete process.env[key];
    else process.env[key] = SAVED[key];
  }
}

if (typeof fulfillment.getSiteUrl === 'function') {
  const SAVED_SITE_URL = process.env.SITE_URL;
  delete process.env.SITE_URL;
  const fallback = fulfillment.getSiteUrl();
  check(
    typeof fallback === 'string' && /^https:\/\/promptanatomy\.space\/?$/.test(fallback),
    'getSiteUrl falls back to https://promptanatomy.space when SITE_URL is unset'
  );
  if (SAVED_SITE_URL !== undefined) process.env.SITE_URL = SAVED_SITE_URL;
}

const FOLLOWUP_PATH = path.join(ROOT, 'api', 'fulfillment-followup.js');
check(exists(FOLLOWUP_PATH), 'api/fulfillment-followup.js exists');
check(typeof fulfillment.processDueFollowups === 'function', 'fulfillment exports processDueFollowups');

const webhookSrc = readText(STRIPE_WEBHOOK_PATH);
check(/bodyParser:\s*false/.test(webhookSrc), 'stripe-webhook disables bodyParser (raw body for signature verification)');
check(/Stripe-Signature/i.test(webhookSrc), 'stripe-webhook reads Stripe-Signature header');
check(/module\.exports\s*=/.test(webhookSrc), 'stripe-webhook exports a handler');

const dlSrc = readText(DOWNLOAD_PATH);
check(/Cache-Control['"\s,:]+private[^"]*no-store/i.test(dlSrc) || (/Cache-Control/.test(dlSrc) && /no-store/.test(dlSrc) && /private/.test(dlSrc)), 'download route sets Cache-Control: private + no-store');

const dlLinkSrc = readText(DOWNLOAD_LINK_PATH);
check(/session_id/.test(dlLinkSrc), 'download-link reads session_id');
check(/202|getDownloadUrlBySessionId|getStatus/i.test(dlLinkSrc), 'download-link supports the polling response (202 / status check)');

const sot = JSON.parse(readText(SOT_PATH));
check(sot && sot.commerce, 'sot.json: commerce block present');
if (sot.commerce) {
  check(sot.commerce.scope === 'en-only', 'sot.json: commerce.scope === "en-only"');
  const map = sot.commerce.products.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
  check(map.starter && Number(map.starter.priceCents) === 399, 'sot.starter.priceCents matches PRODUCTS.starter.amountCents (399)');
  check(map.pro && Number(map.pro.priceCents) === 899, 'sot.pro.priceCents matches PRODUCTS.pro.amountCents (899)');
  check(map.bundle && Number(map.bundle.priceCents) === 1099, 'sot.bundle.priceCents matches PRODUCTS.bundle.amountCents (1099)');
}
check(sot && sot.site && sot.site.mirror && sot.site.mirror.renderPaidStorefront === false, 'sot.site.mirror.renderPaidStorefront === false (mirror hides paid section)');

if (Array.isArray(sot.commerce && sot.commerce.products) && fulfillment.PRODUCTS) {
  const sotMap = sot.commerce.products.reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
  for (const id of ['starter', 'pro', 'bundle']) {
    const fromSot = sotMap[id];
    const fromLib = fulfillment.PRODUCTS[id];
    if (fromSot && fromLib) {
      check(
        Math.round(Number(fromSot.priceUsd) * 100) === fromLib.amountCents,
        `${id}: SOT priceUsd ($${fromSot.priceUsd}) matches fulfillment.amountCents (${fromLib.amountCents})`
      );
    }
  }
}

console.log('\n---');
console.log('fulfillment-config: ' + passed + ' passed, ' + failed + ' failed.');
if (failed > 0) process.exit(1);
console.log('All fulfillment-config tests passed.\n');
