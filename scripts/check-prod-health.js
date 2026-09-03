'use strict';

/**
 * scripts/check-prod-health.js
 *
 * Production probe (no secrets printed):
 *   1. GET /api/fulfillment-health — fail if ok !== true or missing.length > 0
 *   2. GET /{INDEXNOW_KEY}.txt — fail if body !== key
 *
 *   npm run check:prod
 *   CHECK_PROD_URL=https://promptanatomy.space npm run check:prod
 */

const https = require('https');
const { INDEXNOW_KEY } = require('./geo-surfaces');

const DEFAULT_ORIGIN = 'https://promptanatomy.space';

function resolveOrigin() {
  const raw = String(process.env.CHECK_PROD_URL || DEFAULT_ORIGIN).trim().replace(/\/$/, '');
  if (/\/api\/fulfillment-health$/i.test(raw)) {
    return raw.replace(/\/api\/fulfillment-health$/i, '');
  }
  return raw;
}

/**
 * @param {string} url
 * @param {number} [hops]
 * @returns {Promise<{ status: number, body: string, url: string }>}
 */
function getText(url, hops) {
  const hop = hops || 0;
  return new Promise(function (resolve, reject) {
    if (hop > 5) {
      reject(new Error('Too many redirects'));
      return;
    }
    const req = https.get(
      url,
      {
        headers: { Accept: 'application/json, text/plain, */*' },
        timeout: 15000
      },
      function (res) {
        const code = res.statusCode;
        if (code >= 300 && code < 400 && res.headers.location) {
          res.resume();
          const next = new URL(res.headers.location, url).href;
          getText(next, hop + 1).then(resolve, reject);
          return;
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          body += chunk;
        });
        res.on('end', function () {
          resolve({ status: code, body: body, url: url });
        });
      }
    );
    req.on('timeout', function () {
      req.destroy(new Error('Request timed out: ' + url));
    });
    req.on('error', reject);
  });
}

function status(ok, label, detail) {
  const tag = ok ? '[OK]' : '[FAIL]';
  console.log(tag.padEnd(7) + ' ' + label + (detail ? '  -  ' + detail : ''));
  return ok;
}

(async () => {
  const origin = resolveOrigin();
  const healthUrl = origin + '/api/fulfillment-health';
  const indexNowUrl = origin + '/' + INDEXNOW_KEY + '.txt';
  let allOk = true;

  console.log('Production health check (' + origin + ')\n');

  console.log('--- Fulfillment health ---');
  try {
    const res = await getText(healthUrl);
    let json = null;
    try {
      json = JSON.parse(res.body);
    } catch (_e) {
      json = null;
    }
    if (!json || typeof json !== 'object') {
      status(false, 'fulfillment-health', 'HTTP ' + res.status + ' (not JSON)');
      allOk = false;
    } else {
      const missing = Array.isArray(json.missing) ? json.missing : [];
      const ok = json.ok === true && missing.length === 0;
      let detail;
      if (ok) {
        detail =
          'ok redis=' +
          String(json.redis || '') +
          ' blobConfigured=' +
          String(json.blobConfigured);
      } else if (missing.length) {
        detail = 'missing: ' + missing.join(', ');
      } else {
        detail =
          'ok=' +
          String(json.ok) +
          ' redis=' +
          String(json.redis || '') +
          (json.redisDetail ? ' (' + json.redisDetail + ')' : '');
      }
      if (!status(ok, 'fulfillment-health', detail)) allOk = false;
    }
  } catch (error) {
    status(false, 'fulfillment-health', error.message);
    allOk = false;
  }

  console.log('\n--- IndexNow key file ---');
  try {
    const res = await getText(indexNowUrl);
    const body = String(res.body || '').trim();
    const ok = res.status === 200 && body === INDEXNOW_KEY;
    if (
      !status(
        ok,
        'IndexNow key',
        ok ? 'hosted' : 'HTTP ' + res.status + ' (body mismatch or missing)'
      )
    ) {
      allOk = false;
    }
  } catch (error) {
    status(false, 'IndexNow key', error.message);
    allOk = false;
  }

  console.log('\n---');
  if (allOk) {
    console.log('Production ready. Safe to run the live Starter $3.99 drill.');
    process.exit(0);
  }
  console.log('Production is not ready. Fix Vercel env / redeploy before taking payment.');
  process.exit(1);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
