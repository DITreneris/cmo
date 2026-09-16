/**
 * Vercel Web Analytics custom events.
 * No-op kai window.va nėra (local serve / GitHub Pages mirror).
 * Optional data: tik leidžiami raktai (sku). Jokio session_id, email, prompt body.
 */
(function (global) {
  'use strict';

  var ALLOWED_SKU = {
    starter: true,
    bundle: true,
    pro: true
  };

  /**
   * @param {*} data
   * @returns {{sku: string}|null}
   */
  function sanitizeEventData(data) {
    if (!data || typeof data !== 'object') return null;
    var sku = data.sku;
    if (typeof sku !== 'string' || !ALLOWED_SKU[sku]) return null;
    return { sku: sku };
  }

  /**
   * @param {string} name
   * @param {{sku?: string}|undefined} data
   * @returns {void}
   */
  function trackEvent(name, data) {
    try {
      if (!name || typeof global.va !== 'function') return;
      var payload = { name: name };
      var clean = sanitizeEventData(data);
      if (clean) payload.data = clean;
      global.va('event', payload);
    } catch (_e) {
      /* swallow */
    }
  }

  function bindCheckoutClicks() {
    if (typeof document === 'undefined' || !document.addEventListener) return;
    if (global.__cmoCheckoutTrackBound) return;
    global.__cmoCheckoutTrackBound = true;
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var cta = target.closest('.pdf-card-cta[data-product-id]');
      if (!cta) return;
      var sku = cta.getAttribute('data-product-id');
      if (!ALLOWED_SKU[sku]) return;
      trackEvent('click_checkout', { sku: sku });
    });
  }

  global.trackEvent = trackEvent;
  bindCheckoutClicks();
})(typeof window !== 'undefined' ? window : globalThis);
