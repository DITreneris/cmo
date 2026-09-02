'use strict';

/**
 * GET /api/download?t=<signed_token>
 * Streams the paid PDF bytes after validating:
 *   - HMAC signature (DOWNLOAD_TOKEN_SECRET)
 *   - jti record present in Redis
 *   - matching fulfillment record with status === 'fulfilled'
 *
 * Cache-Control: private, no-store. Never cache paid PDFs.
 * Memo §6.1.
 */

const {
  resolveDownload,
  loadProductPdf,
  listMissingFulfillmentEnv
} = require('./_lib/fulfillment');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missing = listMissingFulfillmentEnv();
  if (missing.length) {
    return res.status(500).json({
      error: 'Fulfillment is not configured',
      detail: missing
    });
  }

  const token =
    (req.query && req.query.t) ||
    (req.url ? new URL(req.url, 'http://x').searchParams.get('t') : null);

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing token' });
  }

  let resolved;
  try {
    resolved = await resolveDownload(token);
  } catch (error) {
    const message = error && error.message ? String(error.message) : 'Invalid token';
    const status = /expired/i.test(message) ? 410 : 403;
    return res.status(status).json({ error: message });
  }

  let payload;
  try {
    payload = await loadProductPdf(resolved.product);
  } catch (error) {
    console.error('[download] PDF load failed:', error && error.message);
    return res.status(503).json({
      error: 'PDF temporarily unavailable',
      detail: error && error.message ? String(error.message) : 'unknown'
    });
  }

  res.setHeader('Content-Type', payload.contentType || 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${resolved.product.downloadFileName}"`
  );

  if (payload.type === 'buffer') {
    if (payload.body && payload.body.length) {
      res.setHeader('Content-Length', String(payload.body.length));
    }
    return res.status(200).end(payload.body);
  }

  res.status(200);
  await new Promise((resolve, reject) => {
    payload.body.on('error', reject);
    payload.body.on('end', resolve);
    payload.body.pipe(res);
  });
  return undefined;
};
