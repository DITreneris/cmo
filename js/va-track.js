/**
 * Vercel Web Analytics custom events.
 * No-op when window.va is missing (local serve / GitHub Pages mirror).
 * Never attach properties — no session_id, email, or prompt body.
 */
(function (global) {
  'use strict';

  /**
   * @param {string} name
   * @returns {void}
   */
  function trackEvent(name) {
    try {
      if (!name || typeof global.va !== 'function') return;
      global.va('event', { name: name });
    } catch (_e) {
      /* swallow */
    }
  }

  global.trackEvent = trackEvent;
})(typeof window !== 'undefined' ? window : globalThis);
