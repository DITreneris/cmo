'use strict';

/**
 * GET /api/fulfillment-health
 * Pre-launch + post-deploy probe (memo §3.2):
 *   { ok: true,  missing: [],     redis: 'ok',    blobConfigured: true }   - ready
 *   { ok: false, missing: [...],  redis: 'skipped' | 'error', ... }       - misconfigured
 *
 * Public endpoint by design (no secrets leaked, only env-key names that are missing).
 */

const { checkFulfillmentHealth } = require('./_lib/fulfillment');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await checkFulfillmentHealth();
    return res.status(result.ok ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Health check failed',
      detail: error && error.message ? String(error.message) : 'unknown'
    });
  }
};
