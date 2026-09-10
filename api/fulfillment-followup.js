'use strict';

/**
 * GET /api/fulfillment-followup
 * Vercel Cron: sends due Starter post-purchase follow-up emails (Day 3 / Day 7).
 * When FULFILLMENT_FOLLOWUP_ENABLED=1, CRON_SECRET is required (Bearer match → 401).
 */

const { processDueFollowups, listMissingFulfillmentEnv } = require('./_lib/fulfillment');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const followupsEnabled = process.env.FULFILLMENT_FOLLOWUP_ENABLED === '1';
  const cronSecret = process.env.CRON_SECRET;
  if (followupsEnabled) {
    if (!cronSecret) {
      return res.status(401).json({ error: 'Unauthorized', detail: 'CRON_SECRET required' });
    }
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  } else if (cronSecret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
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
