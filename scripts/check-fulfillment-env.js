'use strict';

/**
 * scripts/check-fulfillment-env.js
 *
 * Local pre-launch probe for fulfillment env. Reports:
 *   - which required env keys are missing
 *   - Redis ping (Upstash)
 *   - Stripe key validity (memo §4.1: signature alone does not prove
 *     STRIPE_SECRET_KEY actually works - we make a real low-cost API call)
 *   - Blob token presence
 *   - optional Resend send drill (TEST_SEND=1)
 *
 * Run:
 *   npm run check:fulfillment
 *   TEST_SEND=1 TEST_FULFILLMENT_EMAIL=you@example.com npm run check:fulfillment
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

if (fs.existsSync(path.join(ROOT, '.env'))) {
  const raw = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/i);
    if (m && process.env[m[1]] === undefined) {
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[m[1]] = value;
    }
  }
}

const REQUIRED = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_CMO_STARTER_PDF',
  'STRIPE_PRICE_CMO_PRO_PDF',
  'STRIPE_PRICE_CMO_BUNDLE_PDF',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'DOWNLOAD_TOKEN_SECRET',
  'RESEND_API_KEY',
  'FULFILLMENT_FROM_EMAIL',
  'BLOB_READ_WRITE_TOKEN',
  'PDF_CMO_STARTER_SOURCE_URL',
  'PDF_CMO_PRO_SOURCE_URL',
  'SITE_URL'
];

function status(ok, label, detail) {
  const tag = ok ? '[OK]' : '[FAIL]';
  console.log(`${tag.padEnd(7)} ${label}${detail ? '  -  ' + detail : ''}`);
  return ok;
}

(async () => {
  console.log('Fulfillment env check (CMO Kit, promptanatomy.space)\n');

  let allOk = true;

  console.log('--- Required env keys ---');
  for (const key of REQUIRED) {
    const present = Boolean(process.env[key]);
    const ok = status(present, key, present ? 'present' : 'MISSING');
    if (!ok) allOk = false;
  }

  console.log('\n--- DOWNLOAD_TOKEN_SECRET sanity ---');
  const tokenSecret = process.env.DOWNLOAD_TOKEN_SECRET || '';
  if (tokenSecret.includes(' ') && !tokenSecret.includes('+')) {
    status(
      false,
      'DOWNLOAD_TOKEN_SECRET shape',
      'spaces present but no + - looks corrupted (Vercel UI sometimes splits + characters). Re-paste with quotes.'
    );
    allOk = false;
  } else {
    status(true, 'DOWNLOAD_TOKEN_SECRET shape', `${tokenSecret.length} chars`);
  }

  console.log('\n--- Upstash Redis ping ---');
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Redis } = require('@upstash/redis');
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN
      });
      const pong = await redis.ping();
      const ok = pong === 'PONG';
      status(ok, 'Redis ping', String(pong));
      if (!ok) allOk = false;
    } catch (error) {
      status(false, 'Redis ping', error.message);
      allOk = false;
    }
  } else {
    status(false, 'Redis ping', 'skipped (env missing)');
    allOk = false;
  }

  console.log('\n--- Stripe API key validity ---');
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const Stripe = require('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-04-10'
      });
      const list = await stripe.checkout.sessions.list({ limit: 1 });
      status(
        true,
        'Stripe sessions.list',
        `ok (${list.data.length} session${list.data.length === 1 ? '' : 's'} returned)`
      );
    } catch (error) {
      status(false, 'Stripe sessions.list', error.message);
      allOk = false;
    }
  } else {
    status(false, 'Stripe sessions.list', 'skipped (STRIPE_SECRET_KEY missing)');
    allOk = false;
  }

  if (process.env.TEST_SEND === '1') {
    console.log('\n--- Resend test send (TEST_SEND=1) ---');
    const to = process.env.TEST_FULFILLMENT_EMAIL;
    if (!to) {
      status(false, 'Resend send', 'TEST_FULFILLMENT_EMAIL is required');
      allOk = false;
    } else if (!process.env.RESEND_API_KEY || !process.env.FULFILLMENT_FROM_EMAIL) {
      status(false, 'Resend send', 'RESEND_API_KEY or FULFILLMENT_FROM_EMAIL missing');
      allOk = false;
    } else {
      try {
        const { Resend } = require('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const result = await resend.emails.send({
          from: process.env.FULFILLMENT_FROM_EMAIL,
          to,
          subject: 'Prompt Anatomy CMO Kit - Resend drill',
          text: 'This is a Resend drill from check-fulfillment-env.js. If you received it, the sender domain is verified and the API key works.'
        });
        if (result.error) {
          status(false, 'Resend send', result.error.message || 'unknown');
          allOk = false;
        } else {
          status(true, 'Resend send', `delivered, id=${result.data && result.data.id}`);
        }
      } catch (error) {
        status(false, 'Resend send', error.message);
        allOk = false;
      }
    }
  }

  console.log('\n---');
  if (allOk) {
    console.log('All checks passed. Safe to deploy.');
    process.exit(0);
  } else {
    console.log('One or more checks failed. Fix the env in Vercel before paying buyers can hit the live webhook.');
    process.exit(1);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
