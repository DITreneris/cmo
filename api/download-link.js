'use strict';

/**
 * GET /api/download-link?session_id=cs_...
 * Returns one of:
 *   200 { status: 'ready', url, downloadUrl, downloads, expiresAt, maskedEmail, productId, productName }
 *     url === downloadUrl (LEGACY {url} alias). downloads[] = one link per file.
 *   202 { status: 'processing' }                   - webhook in progress
 *   404 { error: 'Unknown checkout session' }      - never seen this id
 *   500 { error: 'Fulfillment is not configured', detail: [...] }
 *
 * Used by success.html to poll until fulfillment is ready, then issues a
 * 15-minute in-page download token. Memo §5.2.
 */

const {
  getDownloadUrlBySessionId,
  listMissingFulfillmentEnv,
  getSiteUrl
} = require('./_lib/fulfillment');

function originFromRequest(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString();
  if (!host) return null;
  return `${proto}://${host}`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

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

  const sessionId =
    (req.query && req.query.session_id) ||
    (req.url ? new URL(req.url, 'http://x').searchParams.get('session_id') : null);

  if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return res.status(400).json({ error: 'Missing or invalid session_id' });
  }

  const origin = originFromRequest(req) || getSiteUrl();

  try {
    const result = await getDownloadUrlBySessionId(sessionId, origin);
    if (result.status === 'processing') {
      return res.status(202).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    const message = error && error.message ? String(error.message) : 'Unknown error';
    if (/Unknown checkout session/i.test(message)) {
      return res.status(404).json({ error: message });
    }
    console.error('[download-link] error:', message);
    return res.status(500).json({ error: 'Failed to resolve download link', detail: message });
  }
};
