/**
 * Creative brief builder — EN #creative-brief (browser-only image prompt assembly).
 * No POST / no AI API. Drafts in sessionStorage. Prefills audience from cmo.context.v1 when present.
 */
(function () {
  'use strict';

  var section = document.getElementById('creative-brief');
  if (!section) return;

  var DRAFT_KEY = 'cmo.creativeBrief.v1';
  var CONTEXT_KEY = 'cmo.context.v1';
  var MAX_DRAFT_CHARS = 4000;
  var TRACKED_KEYS = [
    'object',
    'campaignGoal',
    'audience',
    'color',
    'style',
    'lighting',
    'camera',
    'aspectRatio',
    'platform'
  ];
  var HINT_PRIORITY = [
    'object',
    'campaignGoal',
    'audience',
    'color',
    'aspectRatio',
    'style',
    'lighting',
    'camera',
    'platform'
  ];
  var FIELD_LABELS = {
    object: 'subject',
    campaignGoal: 'campaign goal',
    audience: 'audience',
    color: 'color palette',
    style: 'style',
    lighting: 'lighting',
    camera: 'camera',
    aspectRatio: 'aspect ratio',
    platform: 'platform'
  };
  var AI_TOOL_ALLOWED_HOSTS = {
    'chatgpt.com': true,
    'www.chatgpt.com': true,
    'ideogram.ai': true,
    'www.ideogram.ai': true,
    'www.midjourney.com': true,
    'midjourney.com': true,
    'www.adobe.com': true,
    'adobe.com': true,
    'leonardo.ai': true,
    'www.leonardo.ai': true,
    'blackforestlabs.ai': true,
    'www.blackforestlabs.ai': true
  };

  var PRESETS = {
    ecommerce: {
      campaignGoal: 'Conversion',
      audience: '25–40 e-commerce shoppers',
      platform: 'Instagram',
      tone: 'Premium (Luxurious)',
      object: 'Luxury leather handbag on a light stone surface',
      style: 'Realistic photo',
      lighting: 'Studio lighting',
      camera: 'Close-up',
      aspectRatio: '1:1',
      color: 'Warm golden tones',
      headline: 'The new collection is here',
      cta: 'Shop now'
    },
    brand: {
      campaignGoal: 'Awareness',
      audience: 'Creative urban professionals',
      platform: 'Web banner',
      tone: 'Expert',
      object: 'Minimal product on a transparent glass podium',
      style: 'Fashion magazine style',
      lighting: 'Soft daylight',
      camera: 'Eye level',
      aspectRatio: '16:9',
      color: 'Deep indigo with amber accents',
      headline: 'Recognize premium quality',
      cta: 'Learn more'
    },
    social: {
      campaignGoal: 'Engagement',
      audience: 'Gen Z and young families',
      platform: 'Facebook',
      tone: 'Playful',
      object: 'A joyful couple with the product in an urban setting',
      style: 'Realistic photo',
      lighting: 'Golden Hour',
      camera: 'Top-down (Flatlay)',
      aspectRatio: '1:1',
      color: 'Bright coral with soft blue',
      headline: 'Feel the new energy',
      cta: 'Try it now'
    }
  };

  var formRoot = document.getElementById('cbForm');
  var outputEl = document.getElementById('cbOutput');
  var copyBtn = document.getElementById('cbCopyBtn');
  var sampleBtn = document.getElementById('cbSampleBtn');
  var qualityBadge = document.getElementById('cbQualityBadge');
  var qualityHint = document.getElementById('cbQualityHint');
  var charCount = document.getElementById('cbCharCount');
  var suppressDraft = false;

  function isFilled(value) {
    return String(value == null ? '' : value).trim().length > 0;
  }

  function getFieldEls() {
    if (!formRoot) return [];
    return Array.prototype.slice.call(formRoot.querySelectorAll('[data-cb-field]'));
  }

  function readFormData() {
    var data = {};
    getFieldEls().forEach(function (el) {
      var key = el.getAttribute('data-cb-field');
      if (key) data[key] = el.value;
    });
    return data;
  }

  function writeFormData(data) {
    if (!data || typeof data !== 'object') return;
    getFieldEls().forEach(function (el) {
      var key = el.getAttribute('data-cb-field');
      if (key && Object.prototype.hasOwnProperty.call(data, key)) {
        el.value = data[key] == null ? '' : String(data[key]);
      }
    });
  }

  function countFilledTracked(data) {
    return TRACKED_KEYS.filter(function (key) {
      return isFilled(data[key]);
    }).length;
  }

  function getQualityLevel(filled) {
    var total = TRACKED_KEYS.length;
    if (filled <= 2) return 'weak';
    if (filled <= 4) return 'medium';
    if (filled <= total - 2) return 'good';
    return 'premium';
  }

  function getHintMissing(data) {
    var missing = {};
    TRACKED_KEYS.forEach(function (key) {
      if (!isFilled(data[key])) missing[key] = true;
    });
    return HINT_PRIORITY.filter(function (key) {
      return missing[key];
    });
  }

  function buildImagePrompt(data) {
    var object = isFilled(data.object) ? data.object.trim() : '[Subject]';
    var style = isFilled(data.style) ? data.style.trim() : 'Professional marketing visual';
    var parts = [];
    parts.push(style + ', ' + object + '.');

    var technical = [];
    if (isFilled(data.camera)) technical.push(data.camera.trim());
    if (isFilled(data.lighting)) technical.push(data.lighting.trim());
    if (isFilled(data.color)) technical.push(data.color.trim() + ' color palette');
    technical.push('ultra-detailed, highest quality, professional composition');
    if (isFilled(data.aspectRatio)) technical.push('Aspect ratio: ' + data.aspectRatio.trim());
    parts.push(technical.join(', ') + '.');

    if (
      isFilled(data.campaignGoal) ||
      isFilled(data.audience) ||
      isFilled(data.platform) ||
      isFilled(data.tone)
    ) {
      var purpose = isFilled(data.campaignGoal) ? data.campaignGoal.trim() : 'advertisement';
      var audience = isFilled(data.audience) ? data.audience.trim() : 'target audience';
      var platform = isFilled(data.platform) ? data.platform.trim() : 'social';
      var tone = isFilled(data.tone) ? data.tone.trim() : 'professional';
      parts.push(
        'Created for marketing purpose: ' +
          purpose +
          ', targeting ' +
          audience +
          ' on ' +
          platform +
          '. Mood: ' +
          tone +
          '.'
      );
    }

    if (isFilled(data.headline) || isFilled(data.cta)) {
      var textParts = [];
      if (isFilled(data.headline)) textParts.push('headline "' + data.headline.trim() + '"');
      if (isFilled(data.cta)) textParts.push('call-to-action "' + data.cta.trim() + '"');
      parts.push(
        'Advertising mock-up with ' +
          textParts.join(' and ') +
          '. Clean negative space around text for readability.'
      );
    }

    return parts.join(' ');
  }

  function hasAnyInput(data) {
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      if (isFilled(data[keys[i]])) return true;
    }
    return false;
  }

  function updateQuality(data) {
    var filled = countFilledTracked(data);
    var level = getQualityLevel(filled);
    var missing = getHintMissing(data);
    if (qualityBadge) {
      qualityBadge.textContent = filled + '/' + TRACKED_KEYS.length + ' — ' + level;
      qualityBadge.setAttribute('data-level', level);
    }
    if (qualityHint) {
      if (level === 'premium' || missing.length === 0) {
        qualityHint.textContent = 'Ready to copy into your image tool.';
      } else {
        var labels = missing.slice(0, 3).map(function (key) {
          return FIELD_LABELS[key] || key;
        });
        var joined =
          labels.length === 1
            ? labels[0]
            : labels.length === 2
              ? labels[0] + ' and ' + labels[1]
              : labels.slice(0, -1).join(', ') + ', and ' + labels[labels.length - 1];
        qualityHint.textContent =
          filled <= 4 ? 'Add ' + joined + ' to strengthen the brief.' : 'Improve with ' + joined + '.';
      }
    }
  }

  function syncCopyEnabled(prompt) {
    if (!copyBtn) return;
    copyBtn.disabled = !prompt || !String(prompt).trim();
  }

  function updateOutput() {
    if (!outputEl) return;
    var data = readFormData();
    var prompt = hasAnyInput(data) ? buildImagePrompt(data) : '';
    if (document.activeElement !== outputEl) {
      outputEl.value = prompt;
    } else if (!outputEl.value && prompt) {
      outputEl.value = prompt;
    }
    var text = outputEl.value || '';
    if (charCount) charCount.textContent = text.length + ' characters';
    syncCopyEnabled(text);
    updateQuality(data);
    saveDraft(data, text);
  }

  function saveDraft(data, text) {
    if (suppressDraft) return;
    try {
      var payload = JSON.stringify({ data: data, output: text, savedAt: Date.now() });
      if (payload.length > MAX_DRAFT_CHARS) return;
      sessionStorage.setItem(DRAFT_KEY, payload);
    } catch (_) {
      /* ignore quota / private mode */
    }
  }

  function loadDraft() {
    try {
      var raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function prefillAudienceFromContext() {
    try {
      var raw = sessionStorage.getItem(CONTEXT_KEY);
      if (!raw) return;
      var ctx = JSON.parse(raw);
      var audienceEl = document.getElementById('cbAudience');
      if (!audienceEl || isFilled(audienceEl.value)) return;
      if (ctx && isFilled(ctx.audience)) audienceEl.value = String(ctx.audience).slice(0, 160);
    } catch (_) {
      /* ignore */
    }
  }

  function fallbackCopy(text) {
    var ta = document.getElementById('hiddenTextarea');
    if (!ta) {
      ta = document.createElement('textarea');
      ta.setAttribute('aria-hidden', 'true');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
    }
    ta.value = text;
    ta.select();
    try {
      document.execCommand('copy');
    } catch (_) {
      /* ignore */
    }
  }

  function showToast(message) {
    if (typeof window.showToast === 'function') {
      window.showToast(message);
      return;
    }
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  function copyPromptText() {
    if (!outputEl) return;
    var text = outputEl.value.trim();
    if (!text) return;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(
        function () {
          showToast('Image prompt copied — paste into your image tool.');
          if (copyBtn) {
            var original = copyBtn.textContent;
            copyBtn.textContent = 'Copied';
            setTimeout(function () {
              copyBtn.textContent = original;
            }, 1800);
          }
        },
        function () {
          fallbackCopy(text);
          showToast('Image prompt copied — paste into your image tool.');
        }
      );
    } else {
      fallbackCopy(text);
      showToast('Image prompt copied — paste into your image tool.');
    }
  }

  function isAllowedToolUrl(url) {
    try {
      var u = new URL(url);
      if (u.protocol !== 'https:') return false;
      return !!AI_TOOL_ALLOWED_HOSTS[u.hostname.toLowerCase()];
    } catch (_) {
      return false;
    }
  }

  function openToolAndCopy(url) {
    if (!isAllowedToolUrl(url)) {
      showToast('That tool link is not available.');
      return;
    }
    var opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    copyPromptText();
  }

  function applyPreset(id) {
    var preset = PRESETS[id];
    if (!preset) return;
    suppressDraft = true;
    writeFormData(preset);
    suppressDraft = false;
    if (outputEl) outputEl.value = buildImagePrompt(preset);
    updateOutput();
    showStep(1);
  }

  function showStep(step) {
    var n = Number(step) || 1;
    section.querySelectorAll('.cb-panel').forEach(function (panel) {
      var id = Number(panel.getAttribute('data-cb-panel'));
      panel.hidden = id !== n;
    });
    section.querySelectorAll('.cb-step').forEach(function (btn) {
      var active = Number(btn.getAttribute('data-cb-step')) === n;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    var panel = section.querySelector('.cb-panel[data-cb-panel="' + n + '"]');
    if (panel) {
      var focusable = panel.querySelector('input, select, textarea');
      if (focusable) focusable.focus();
    }
  }

  function onFormInput() {
    updateOutput();
  }

  if (formRoot) {
    formRoot.addEventListener('input', onFormInput);
    formRoot.addEventListener('change', onFormInput);
  }

  if (outputEl) {
    outputEl.addEventListener('input', function () {
      var text = outputEl.value || '';
      if (charCount) charCount.textContent = text.length + ' characters';
      syncCopyEnabled(text);
      saveDraft(readFormData(), text);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      copyPromptText();
    });
  }

  if (sampleBtn) {
    sampleBtn.addEventListener('click', function () {
      applyPreset('brand');
    });
  }

  section.querySelectorAll('[data-cb-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyPreset(btn.getAttribute('data-cb-preset'));
    });
  });

  section.querySelectorAll('.cb-step').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showStep(btn.getAttribute('data-cb-step'));
    });
  });

  section.querySelectorAll('[data-cb-tool-url]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openToolAndCopy(btn.getAttribute('data-cb-tool-url'));
    });
  });

  var draft = loadDraft();
  if (draft && draft.data) {
    suppressDraft = true;
    writeFormData(draft.data);
    if (outputEl && typeof draft.output === 'string') outputEl.value = draft.output;
    suppressDraft = false;
  } else {
    prefillAudienceFromContext();
  }
  updateOutput();
  showStep(1);
})();
