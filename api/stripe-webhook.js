'use strict';

/**
 * POST /api/stripe-webhook
 * Verifies Stripe signature, then triggers idempotent fulfillment.
 *
 * Memo §4.1: STRIPE_WEBHOOK_SECRET proves the event is from Stripe;
 * STRIPE_SECRET_KEY (separate concern) is required for sessions.retrieve.
 * Memo §5.1: response detail must surface fulfillment errors so dashboard
 * shows the root cause (missing env, wrong key, Resend error, etc).
 *
 * Vercel Node runtime: we read the raw request body for signature verification.
 * `bodyParser: false` is critical — Stripe needs the exact bytes Stripe signed.
 */

const Stripe = require('stripe');
const {
  assertFulfillmentConfigured,
  fulfillCheckoutSession,
  listMissingFulfillmentEnv,
  getSiteUrl
} = require('./_lib/fulfillment');

module.exports.config = {
  api: {
    bodyParser: false
  }
};

const RELEVANT_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded'
]);

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured.');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10'
  });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function originFromRequest(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString();
  if (!host) return null;
  return `${proto}://${host}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe signature header' });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({
      error: 'Fulfillment is not configured',
      detail: ['STRIPE_WEBHOOK_SECRET']
    });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (error) {
    return res.status(400).json({
      error: 'Failed to read request body',
      detail: error && error.message ? String(error.message) : 'unknown'
    });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('[stripe-webhook] signature verification failed:', error.message);
    return res.status(400).json({
      error: 'Invalid signature',
      detail: error && error.message ? String(error.message) : 'unknown'
    });
  }

  if (!RELEVANT_EVENTS.has(event.type)) {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  const missing = listMissingFulfillmentEnv();
  if (missing.length || !process.env.STRIPE_SECRET_KEY) {
    const detail = missing.slice();
    if (!process.env.STRIPE_SECRET_KEY) detail.unshift('STRIPE_SECRET_KEY');
    console.error('[stripe-webhook] fulfillment env missing:', detail.join(', '));
    return res.status(500).json({
      error: 'Fulfillment is not configured',
      detail
    });
  }

  try {
    assertFulfillmentConfigured();
  } catch (error) {
    console.error('[stripe-webhook] config error:', error.message);
    return res.status(500).json({
      error: 'Fulfillment is not configured',
      detail: error && error.message ? String(error.message) : 'unknown'
    });
  }

  const session = event.data && event.data.object ? event.data.object : null;
  const sessionId = session && session.id ? session.id : null;
  if (!sessionId) {
    return res.status(400).json({ error: 'Event has no session id' });
  }

  const origin = originFromRequest(req) || getSiteUrl();

  try {
    const result = await fulfillCheckoutSession(getStripe(), sessionId, origin);
    const payload = {
      received: true,
      eventType: event.type,
      fulfillment: result.status,
      sessionId
    };
    if (result.status === 'ignored') {
      console.info('[stripe-webhook] ignored non-CMO checkout', sessionId);
      payload.reason = result.reason || 'unknown_product';
    }
    // locked = another worker holds the Redis NX lock. ACK 200 would stop Stripe
    // retries while the holder may have crashed — return 503 so Stripe retries.
    if (result.status === 'locked') {
      console.warn('[stripe-webhook] fulfillment lock contended', sessionId);
      return res.status(503).json(payload);
    }
    return res.status(200).json(payload);
  } catch (error) {
    console.error('[stripe-webhook] fulfillment error:', error && error.stack ? error.stack : error);
    return res.status(500).json({
      error: 'Fulfillment failed',
      detail: error && error.message ? String(error.message) : 'unknown',
      sessionId
    });
  }
};
