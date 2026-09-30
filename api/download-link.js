'use strict';

/**
 * GET /api/download-link?session_id=cs_...
 * Returns one of:
 *   200 { status: 'ready', url, downloadUrl, downloads, expiresAt, maskedEmail, productId, productName }
 *     url === downloadUrl (LEGACY {url} alias). downloads[] = one link per file.
 *   202 { status: 'processing' }                   - webhook in progress
 *   403 { error }                                  - revoked or 24h re-mint window closed
 *   404 { error: 'Unknown checkout session' }      - never seen this id
 *   429 { error: 'Too many requests' }             - IP or per-session mint limit
 *   500 { error: 'Fulfillment is not configured' }
 *
 * Used by success.html to poll until fulfillment is ready, then issues a
 * 15-minute in-page download token. Memo §5.2.
 */

const {
  getDownloadUrlBySessionId,
  listMissingFulfillmentEnv,
  getSiteUrl,
  consumeDownloadLinkIpLimit
} = require('./_lib/fulfillment');

function originFromRequest(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0].trim();
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString();
  if (!host) return null;
  return `${proto}://${host}`;
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof raw === 'string' && raw.trim()) {
    return raw.split(',')[0].trim();
  }
  return 'unknown';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const missing = listMissingFulfillmentEnv();
  if (missing.length) {
    return res.status(500).json({ error: 'Fulfillment is not configured' });
  }

  const sessionId =
    (req.query && req.query.session_id) ||
    (req.url ? new URL(req.url, 'http://x').searchParams.get('session_id') : null);

  if (!sessionId || typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return res.status(400).json({ error: 'Missing or invalid session_id' });
  }

  const origin = originFromRequest(req) || getSiteUrl();

  try {
    const ipAllowed = await consumeDownloadLinkIpLimit(clientIp(req));
    if (!ipAllowed) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    const result = await getDownloadUrlBySessionId(sessionId, origin);
    if (result.status === 'processing') {
      return res.status(202).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    const message = error && error.message ? String(error.message) : 'Unknown error';
    const code = error && error.code ? error.code : '';
    if (code === 'UNKNOWN_SESSION' || /Unknown checkout session/i.test(message)) {
      return res.status(404).json({ error: 'Unknown checkout session' });
    }
    if (code === 'REVOKED' || code === 'REMINT_CLOSED') {
      return res.status(403).json({ error: 'Download link is not available' });
    }
    if (code === 'RATE_LIMIT') {
      return res.status(429).json({ error: 'Too many requests' });
    }
    console.error('[download-link] error:', message);
    return res.status(500).json({ error: 'Failed to resolve download link' });
  }
};
