'use strict';

/**
 * GET /api/fulfillment-followup
 * Vercel Cron: sends due Starter post-purchase follow-up emails (Day 3 / Day 7).
 * CRON_SECRET is required on every call (Bearer match → 401), even when follow-ups are off.
 */

const crypto = require('crypto');
const { processDueFollowups, listMissingFulfillmentEnv } = require('./_lib/fulfillment');

/**
 * Compare SHA-256 digests so a length mismatch cannot skip the constant-time check.
 * @param {string} authHeader
 * @param {string} secret
 * @returns {boolean}
 */
function bearerMatches(authHeader, secret) {
  const expectedHash = crypto.createHash('sha256').update(`Bearer ${secret}`, 'utf8').digest();
  const actualHash = crypto.createHash('sha256').update(String(authHeader || ''), 'utf8').digest();
  return crypto.timingSafeEqual(expectedHash, actualHash);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || !bearerMatches(req.headers.authorization || '', cronSecret)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const missing = listMissingFulfillmentEnv();
  if (missing.length) {
    return res.status(500).json({ error: 'Fulfillment is not configured', missing });
  }

  try {
    const result = await processDueFollowups();
    return res.status(200).json(result);
  } catch (error) {
    console.error('[fulfillment-followup]', error && error.message);
    return res.status(500).json({
      error: 'Follow-up processing failed',
      detail: error && error.message ? String(error.message) : 'unknown'
    });
  }
};
