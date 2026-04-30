/**
 * Build locale pages: generates lt/index.html and en/index.html from root index.html.
 * Also writes js/en-prompt-bodies-inline.js from data/en-prompt-bodies.json (single EN source).
 * LT = Lithuanian (default), EN = English (replacements applied; META LT taken from index <pre>).
 * Run: node scripts/build-locale-pages.js
 * Optional overrides: BASE_PATH and SITE_ORIGIN.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const DEFAULT_BASE_PATH = '/cmo';
const BASE_PATH = (process.env.BASE_PATH || DEFAULT_BASE_PATH).replace(/\/?$/, '');
const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://ditreneris.github.io').replace(/\/$/, '');

function readIndex() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  if (!html) throw new Error('index.html not found or empty');
  return html;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const DATA_DIR = path.join(ROOT, 'data');
const EN_PROMPT_BODIES_PATH = path.join(DATA_DIR, 'en-prompt-bodies.json');
const EN_PROMPT_EXPECTED_PATH = path.join(DATA_DIR, 'en-prompt-expected.json');
const EN_SCENARIOS_PATH = path.join(DATA_DIR, 'en-scenarios.json');
const LT_PROMPT_EXPECTED_PATH = path.join(DATA_DIR, 'lt-prompt-expected.json');
const LT_SCENARIOS_PATH = path.join(DATA_DIR, 'lt-scenarios.json');
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');
const JS_DIR = path.join(ROOT, 'js');
const EN_PROMPT_INLINE_JS_PATH = path.join(JS_DIR, 'en-prompt-bodies-inline.js');

function loadEnPromptBodies() {
  const raw = fs.readFileSync(EN_PROMPT_BODIES_PATH, 'utf8');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr) || arr.length !== 10) {
    throw new Error('data/en-prompt-bodies.json must be a JSON array of exactly 10 strings');
  }
  return arr;
}

function loadEnPromptExpected() {
  const raw = fs.readFileSync(EN_PROMPT_EXPECTED_PATH, 'utf8');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr) || arr.length !== 10) {
    throw new Error('data/en-prompt-expected.json must be a JSON array of exactly 10 entries');
  }
  arr.forEach((bullets, i) => {
    if (!Array.isArray(bullets) || bullets.length < 2) {
      throw new Error(
        'data/en-prompt-expected.json[' + i + '] must be an array of at least 2 strings'
      );
    }
    bullets.forEach((b, j) => {
      if (typeof b !== 'string' || !b.trim()) {
        throw new Error(
          'data/en-prompt-expected.json[' + i + '][' + j + '] must be a non-empty string'
        );
      }
    });
  });
  return arr;
}

function loadEnScenarios() {
  const raw = fs.readFileSync(EN_SCENARIOS_PATH, 'utf8');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr) || arr.length !== 3) {
    throw new Error('data/en-scenarios.json must be a JSON array of exactly 3 scenarios');
  }
  arr.forEach((s, i) => {
    const need = ['id', 'label', 'brief', 'nextAction', 'bottomLine', 'risks', 'questions'];
    for (const k of need) {
      if (s[k] === undefined || s[k] === null) {
        throw new Error('data/en-scenarios.json[' + i + '] missing key: ' + k);
      }
    }
    if (!Array.isArray(s.risks) || !Array.isArray(s.questions)) {
      throw new Error('data/en-scenarios.json[' + i + ']: risks and questions must be arrays');
    }
  });
  return arr;
}

function loadLtPromptExpected() {
  const raw = fs.readFileSync(LT_PROMPT_EXPECTED_PATH, 'utf8');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr) || arr.length !== 10) {
    throw new Error('data/lt-prompt-expected.json must be a JSON array of exactly 10 entries');
  }
  arr.forEach((bullets, i) => {
    if (!Array.isArray(bullets) || bullets.length < 2) {
      throw new Error(
        'data/lt-prompt-expected.json[' + i + '] must be an array of at least 2 strings'
      );
    }
    bullets.forEach((b, j) => {
      if (typeof b !== 'string' || !b.trim()) {
        throw new Error(
          'data/lt-prompt-expected.json[' + i + '][' + j + '] must be a non-empty string'
        );
      }
    });
  });
  return arr;
}

function loadLtScenarios() {
  const raw = fs.readFileSync(LT_SCENARIOS_PATH, 'utf8');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr) || arr.length !== 3) {
    throw new Error('data/lt-scenarios.json must be a JSON array of exactly 3 scenarios');
  }
  arr.forEach((s, i) => {
    const need = ['id', 'label', 'brief', 'nextAction', 'bottomLine', 'risks', 'questions'];
    for (const k of need) {
      if (s[k] === undefined || s[k] === null) {
        throw new Error('data/lt-scenarios.json[' + i + '] missing key: ' + k);
      }
    }
    if (!Array.isArray(s.risks) || !Array.isArray(s.questions)) {
      throw new Error('data/lt-scenarios.json[' + i + ']: risks and questions must be arrays');
    }
  });
  return arr;
}

function readPackageVersion() {
  const raw = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
  const pkg = JSON.parse(raw);
  if (!pkg || typeof pkg.version !== 'string' || !pkg.version.trim()) {
    throw new Error('package.json must contain a non-empty version string');
  }
  return pkg.version.trim();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** LT <pre> inner text from root index.html, prompt1..prompt10 (order). */
function extractLtPreBodiesFromHtml(html) {
  const out = [];
  for (let i = 1; i <= 10; i++) {
    const re = new RegExp(`<pre class="code-text" id="prompt${i}">([\\s\\S]*?)</pre>`, '');
    const m = html.match(re);
    if (!m) {
      throw new Error(`extractLtPreBodiesFromHtml: missing <pre id="prompt${i}">`);
    }
    out.push(m[1].replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd());
  }
  return out;
}

function writeEnPromptInlineJs(enBodies) {
  ensureDir(JS_DIR);
  const content =
    "'use strict';\nwindow.__EN_PROMPT_PRE = " +
    JSON.stringify(enBodies) +
    ';\n';
  fs.writeFileSync(EN_PROMPT_INLINE_JS_PATH, content, 'utf8');
}

const EN_PROMPT_BODIES = loadEnPromptBodies();
const EN_PROMPT_EXPECTED = loadEnPromptExpected();
const EN_SCENARIOS = loadEnScenarios();
const LT_PROMPT_EXPECTED = loadLtPromptExpected();
const LT_SCENARIOS = loadLtScenarios();
const PKG_VERSION = readPackageVersion();

function injectEnPreBodies(html) {
  let out = html;
  for (let i = 1; i <= 10; i++) {
    const body = EN_PROMPT_BODIES[i - 1];
    if (typeof body !== 'string') {
      throw new Error('Missing EN prompt body at index ' + (i - 1));
    }
    const re = new RegExp(`(<pre class="code-text" id="prompt${i}">)([\\s\\S]*?)(</pre>)`, '');
    out = out.replace(re, `$1${body}$3`);
  }
  return out;
}

const EN_CONTEXT_BLOCK_HTML =
  '<section class="cmo-context" id="cmo-context" aria-labelledby="cmo-context-title">\n' +
  '            <h2 id="cmo-context-title" class="cmo-context-title">Marketing context (one block, every copy)</h2>\n' +
  '            <p class="cmo-context-intro">Optional: you can start with empty fields. If you fill once, these five values plus the rules below are auto-prepended every time you click <strong>Copy prompt</strong>. Stored only in this browser session.</p>\n' +
  '            <div class="cmo-context-form" id="cmoContextForm">\n' +
  '                <fieldset class="cmo-context-fields">\n' +
  '                    <legend class="cmo-context-legend">Marketing context fields</legend>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxAudience">Audience</label>\n' +
  '                        <input type="text" id="cmoCtxAudience" name="audience" maxlength="160" placeholder="e.g. US B2B marketing leaders, 50-500 FTE">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxOffer">Offer / USP</label>\n' +
  '                        <input type="text" id="cmoCtxOffer" name="offer" maxlength="160" placeholder="e.g. AI content system that ships 100 assets in 30 days">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxChannels">Channels</label>\n' +
  '                        <input type="text" id="cmoCtxChannels" name="channels" maxlength="160" placeholder="e.g. LinkedIn, email, SEO">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxGoal">Goal (this month)</label>\n' +
  '                        <input type="text" id="cmoCtxGoal" name="goal" maxlength="160" placeholder="e.g. 30 qualified demos">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxConstraint">Main constraint</label>\n' +
  '                        <input type="text" id="cmoCtxConstraint" name="constraint" maxlength="160" placeholder="e.g. 5 hours/week, no design support">\n' +
  '                    </div>\n' +
  '                </fieldset>\n' +
  '                <div class="cmo-context-actions">\n' +
  '                    <button type="button" class="btn cmo-context-clear" id="cmoCtxClear">Clear context</button>\n' +
  '                    <span class="cmo-context-status" id="cmoCtxStatus" aria-live="polite"></span>\n' +
  '                </div>\n' +
  '            </div>\n' +
  '            <div class="cmo-context-rules" id="cmoContextRules" role="note" aria-label="Non-negotiable rules injected on copy">\n' +
  '                <p class="cmo-context-rules-title"><strong>Rules injected on copy (non-negotiable)</strong></p>\n' +
  '                <ul>\n' +
  '                    <li>No generic advice. If context is missing, ask up to 3 targeted questions first.</li>\n' +
  '                    <li>Do not invent numbers, claims, or testimonials. Flag what must be verified.</li>\n' +
  '                    <li>Output must be usable: sections, owner where relevant, next action with deadline.</li>\n' +
  '                </ul>\n' +
  '            </div>\n' +
  '        </section>\n\n' +
  '        <!-- PROMPT 1 -->';

function injectEnContextBlock(html) {
  const anchor = '<!-- PROMPT 1 -->';
  if (html.indexOf(anchor) === -1) {
    throw new Error('injectEnContextBlock: anchor "<!-- PROMPT 1 -->" not found');
  }
  return html.replace(anchor, EN_CONTEXT_BLOCK_HTML);
}

function injectEnExpectedBullets(html) {
  let out = html;
  for (let i = 1; i <= 10; i++) {
    const bullets = EN_PROMPT_EXPECTED[i - 1]
      .map((b) => '                        <li>' + escapeHtml(b) + '</li>')
      .join('\n');
    const block =
      '\n                <ul class="prompt-expected" id="expected' + i + '" aria-label="Expected output for prompt ' + i + '">\n' +
      '                    <li class="prompt-expected-title">Expected output</li>\n' +
      bullets +
      '\n                </ul>';
    const re = new RegExp(
      '(<pre class="code-text" id="prompt' + i + '">[\\s\\S]*?</div>)(\\s*</div>\\s*<div class="prompt-footer">)',
      ''
    );
    if (!re.test(out)) {
      throw new Error('injectEnExpectedBullets: anchor not found for prompt ' + i);
    }
    out = out.replace(re, '$1' + block + '$2');
  }
  return out;
}

const EN_CONTEXT_SCRIPT =
  '<script>\n' +
  '        (function () {\n' +
  "            'use strict';\n" +
  "            if (!document.getElementById || !document.getElementById('cmo-context')) return;\n" +
  '\n' +
  "            var STORAGE_KEY = 'cmo.context.v1';\n" +
  '            var FIELDS = [\n' +
  "                { id: 'cmoCtxAudience', label: 'Audience' },\n" +
  "                { id: 'cmoCtxOffer', label: 'Offer / USP' },\n" +
  "                { id: 'cmoCtxChannels', label: 'Channels' },\n" +
  "                { id: 'cmoCtxGoal', label: 'Goal (this month)' },\n" +
  "                { id: 'cmoCtxConstraint', label: 'Main constraint' }\n" +
  '            ];\n' +
  "            var RULES_HEADER = 'RULES (non-negotiable)';\n" +
  '            var RULES = [\n' +
  "                '- No generic advice. If context is missing, ask up to 3 targeted questions first.',\n" +
  "                '- Do not invent numbers, claims, or testimonials. Flag what must be verified.',\n" +
  "                '- Output must be usable: sections, owner where relevant, next action with deadline.'\n" +
  '            ];\n' +
  '\n' +
  '            function readContext() {\n' +
  '                var out = {};\n' +
  '                var anyValue = false;\n' +
  '                FIELDS.forEach(function (f) {\n' +
  '                    var el = document.getElementById(f.id);\n' +
  "                    var v = el ? (el.value || '').trim() : '';\n" +
  '                    out[f.id] = v;\n' +
  '                    if (v) anyValue = true;\n' +
  '                });\n' +
  '                out.__hasAny = anyValue;\n' +
  '                return out;\n' +
  '            }\n' +
  '\n' +
  '            function persistContext() {\n' +
  '                try {\n' +
  '                    var values = {};\n' +
  '                    FIELDS.forEach(function (f) {\n' +
  '                        var el = document.getElementById(f.id);\n' +
  "                        values[f.id] = el ? el.value : '';\n" +
  '                    });\n' +
  '                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));\n' +
  '                } catch (e) { /* ignore */ }\n' +
  '            }\n' +
  '\n' +
  '            function restoreContext() {\n' +
  '                try {\n' +
  '                    var raw = sessionStorage.getItem(STORAGE_KEY);\n' +
  '                    if (!raw) return;\n' +
  '                    var values = JSON.parse(raw);\n' +
  "                    if (!values || typeof values !== 'object') return;\n" +
  '                    FIELDS.forEach(function (f) {\n' +
  '                        var el = document.getElementById(f.id);\n' +
  "                        if (el && typeof values[f.id] === 'string') el.value = values[f.id];\n" +
  '                    });\n' +
  '                } catch (e) { /* ignore */ }\n' +
  '            }\n' +
  '\n' +
  '            function clearContext() {\n' +
  '                FIELDS.forEach(function (f) {\n' +
  '                    var el = document.getElementById(f.id);\n' +
  "                    if (el) el.value = '';\n" +
  '                });\n' +
  '                try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }\n' +
  "                var status = document.getElementById('cmoCtxStatus');\n" +
  "                if (status) status.textContent = 'Context cleared.';\n" +
  '            }\n' +
  '\n' +
  '            window.__CMO_COMPILE = function (promptId, originalText) {\n' +
  '                if (!originalText) return originalText;\n' +
  "                if (promptId === 'promptDemo') return originalText;\n" +
  '                var ctx = readContext();\n' +
  '                var lines = [];\n' +
  '                if (ctx.__hasAny) {\n' +
  "                    lines.push('CONTEXT');\n" +
  '                    FIELDS.forEach(function (f) {\n' +
  '                        var v = ctx[f.id];\n' +
  "                        lines.push('- ' + f.label + ': ' + (v ? v : '[not set]'));\n" +
  '                    });\n' +
  "                    lines.push('');\n" +
  '                }\n' +
  '                lines.push(RULES_HEADER);\n' +
  '                RULES.forEach(function (r) { lines.push(r); });\n' +
  "                lines.push('');\n" +
  "                lines.push('---');\n" +
  "                lines.push('');\n" +
  "                return lines.join('\\n') + originalText;\n" +
  '            };\n' +
  '\n' +
  "            document.addEventListener('DOMContentLoaded', function () {\n" +
  '                restoreContext();\n' +
  '                FIELDS.forEach(function (f) {\n' +
  '                    var el = document.getElementById(f.id);\n' +
  "                    if (el) el.addEventListener('input', persistContext);\n" +
  '                });\n' +
  "                var clearBtn = document.getElementById('cmoCtxClear');\n" +
  "                if (clearBtn) clearBtn.addEventListener('click', clearContext);\n" +
  '            });\n' +
  '        })();\n' +
  '    </script>';

function injectEnContextScript(html) {
  const anchor = '</body>';
  const idx = html.lastIndexOf(anchor);
  if (idx === -1) {
    throw new Error('injectEnContextScript: </body> not found');
  }
  return html.slice(0, idx) + '    ' + EN_CONTEXT_SCRIPT + '\n' + html.slice(idx);
}

function patchEnCopyPromptHook(html) {
  const from = 'const promptText = promptElement.textContent?.trim();';
  const to =
    'const promptText = (window.__CMO_COMPILE ' +
    '? window.__CMO_COMPILE(promptId, promptElement.textContent?.trim()) ' +
    ': promptElement.textContent?.trim());';
  if (html.indexOf(from) === -1) {
    throw new Error('patchEnCopyPromptHook: copyPrompt anchor not found');
  }
  return html.split(from).join(to);
}

const TRUST_BLOCK_ANCHOR = '        <!-- KAS TOLIAU? (S2) -->';

const EN_SAFETY_REVIEWER_TEXT =
  'Act as a marketing risk reviewer. Review this AI-generated content before I publish it: [TEXT].\n' +
  'Audience: [AUDIENCE]. Channel: [CHANNEL]. Return:\n' +
  '1) factual claims to verify (numbers, customer quotes, comparisons),\n' +
  '2) brand/tone risks,\n' +
  '3) legal or trust risks (claims, disclaimers, IP, testimonials),\n' +
  '4) missing context a reader would need before acting,\n' +
  '5) a safer revised version if needed.';

const LT_SAFETY_REVIEWER_TEXT =
  'Veik kaip rinkodaros rizikų recenzentas. Peržiūrėk šį DI sugeneruotą turinį prieš publikuodamas: [TEKSTAS].\n' +
  'Auditorija: [AUDITORIJA]. Kanalas: [KANALAS]. Grąžink:\n' +
  '1) faktinius teiginius, kuriuos reikia patvirtinti (skaičiai, klientų citatos, palyginimai),\n' +
  '2) prekės ženklo / tono rizikas,\n' +
  '3) teisines ar pasitikėjimo rizikas (teiginiai, atsisakymai, intelektinė nuosavybė, atsiliepimai),\n' +
  '4) trūkstamą kontekstą, kurio skaitytojui reikia prieš veikdamas,\n' +
  '5) saugesnę pataisytą versiją, jei reikia.';

function scenarioPanelLines(s, labels) {
  const lines = [s.brief, '', labels.next + ': ' + s.nextAction, labels.bottom + ': ' + s.bottomLine, '', labels.risks + ':'];
  s.risks.forEach(function (r) {
    lines.push('- ' + r);
  });
  lines.push('', labels.questions + ':');
  s.questions.forEach(function (q) {
    lines.push('- ' + q);
  });
  return lines.join('\n');
}

function buildScenarioStripSection(locale) {
  const scenarios = locale === 'en' ? EN_SCENARIOS : LT_SCENARIOS;
  const labels =
    locale === 'en'
      ? {
          title: 'Choose a scenario',
          intro: 'Pick a practice flow. Copy includes your saved marketing context and rules when set.',
          tabLabel: 'Scenario tabs',
          copyBrief: 'Copy scenario brief',
          copyBtn: 'Copy brief',
          next: 'Next action',
          bottom: 'Bottom line',
          risks: 'Risks',
          questions: 'Questions'
        }
      : {
          title: 'Pasirink scenarijų',
          intro: 'Pasirink praktikos eigą. Kopijuojant įtraukiamas išsaugotas rinkodaros kontekstas ir taisyklės, jei užpildyta.',
          tabLabel: 'Scenarijų kortelės',
          copyBrief: 'Kopijuoti scenarijaus santrauką',
          copyBtn: 'Kopijuoti santrauką',
          next: 'Kitas veiksmas',
          bottom: 'Esminė mintis',
          risks: 'Rizikos',
          questions: 'Klausimai'
        };
  const firstText = scenarioPanelLines(scenarios[0], {
    next: labels.next,
    bottom: labels.bottom,
    risks: labels.risks,
    questions: labels.questions
  });
  const tabs = scenarios
    .map(function (s, i) {
      const selected = i === 0 ? 'true' : 'false';
      const tabId = 'cmo-scenario-tab-' + i;
      const pressed = i === 0 ? 'true' : 'false';
      return (
        '                    <button type="button" class="cmo-scenario-tab" role="tab" id="' +
        tabId +
        '" aria-selected="' +
        selected +
        '" aria-controls="cmo-scenario-panel" tabindex="' +
        (i === 0 ? '0' : '-1') +
        '" data-scenario-index="' +
        i +
        '" aria-pressed="' +
        pressed +
        '">' +
        escapeHtml(s.label) +
        '</button>'
      );
    })
    .join('\n');
  return (
    '        <section class="cmo-scenarios" id="cmo-scenarios" aria-labelledby="cmo-scenarios-title">\n' +
    '            <h2 id="cmo-scenarios-title" class="cmo-scenarios-title">' +
    escapeHtml(labels.title) +
    '</h2>\n' +
    '            <p class="cmo-scenarios-intro">' +
    escapeHtml(labels.intro) +
    '</p>\n' +
    '            <div class="cmo-scenarios-tablist" role="tablist" aria-label="' +
    escapeHtml(labels.tabLabel) +
    '">\n' +
    tabs +
    '\n' +
    '            </div>\n' +
    '            <div id="cmo-scenario-panel" class="cmo-scenario-panel" role="tabpanel" tabindex="0" aria-labelledby="cmo-scenario-tab-0">\n' +
    '                <div class="code-block cmo-scenario-code" role="region" aria-label="' +
    escapeHtml(labels.copyBrief) +
    '">\n' +
    '                    <pre class="code-text" id="cmo-scenario-brief">' +
    escapeHtml(firstText) +
    '</pre>\n' +
    '                </div>\n' +
    '                <button type="button" class="btn" data-prompt-id="cmo-scenario-brief" aria-label="' +
    escapeHtml(labels.copyBrief) +
    '">\n' +
    '                    <span aria-hidden="true">📋</span>\n' +
    '                    <span>' +
    escapeHtml(labels.copyBtn) +
    '</span>\n' +
    '                </button>\n' +
    '            </div>\n' +
    '        </section>\n\n'
  );
}

function buildSafetySection(locale) {
  const reviewerText = locale === 'en' ? EN_SAFETY_REVIEWER_TEXT : LT_SAFETY_REVIEWER_TEXT;
  const copyLabel =
    locale === 'en' ? 'Copy reviewer prompt' : 'Kopijuoti recenzento promptą';
  const title = locale === 'en' ? 'Pre-publish safety' : 'Tikrinti prieš publikuojant';
  const intro =
    locale === 'en'
      ? 'Run this reviewer prompt before you publish AI-assisted marketing. Copy includes your session context and rules when set.'
      : 'Paleisk šį recenzento promptą prieš publikuodamas rinkodaros turinį, sukurtą su DI. Kopijuojant įtraukiamas sesijos kontekstas ir taisyklės, jei nustatyta.';
  const checksTitle = locale === 'en' ? 'Quick checks' : 'Greita kontrolė';
  const checks =
    locale === 'en'
      ? ['Facts verified', 'Brand/tone', 'Legal/trust', 'CTA + owner']
      : ['Faktai patvirtinti', 'Prekės ženklas / tonas', 'Teisė / pasitikėjimas', 'CTA + savininkas'];
  const checksLis = checks.map(function (c) {
    return '                    <li>' + escapeHtml(c) + '</li>';
  }).join('\n');
  return (
    '        <section class="cmo-safety" id="cmo-safety" aria-labelledby="cmo-safety-title">\n' +
    '            <h2 id="cmo-safety-title" class="cmo-safety-title">' +
    escapeHtml(title) +
    '</h2>\n' +
    '            <p class="cmo-safety-intro">' +
    escapeHtml(intro) +
    '</p>\n' +
    '            <div class="cmo-safety-copy">\n' +
    '                <div class="code-block cmo-safety-pre-wrap" role="region" aria-label="' +
    escapeHtml(copyLabel) +
    '">\n' +
    '                    <pre class="code-text" id="cmo-safety-reviewer-prompt">' +
    escapeHtml(reviewerText) +
    '</pre>\n' +
    '                </div>\n' +
    '                <button type="button" class="btn" data-prompt-id="cmo-safety-reviewer-prompt" aria-label="' +
    escapeHtml(copyLabel) +
    '">\n' +
    '                    <span aria-hidden="true">📋</span>\n' +
    '                    <span>' +
    escapeHtml(copyLabel) +
    '</span>\n' +
    '                </button>\n' +
    '            </div>\n' +
    '            <div class="cmo-safety-checks">\n' +
    '                <p class="cmo-safety-checks-title">' +
    escapeHtml(checksTitle) +
    '</p>\n' +
    '                <ul role="list">\n' +
    checksLis +
    '\n' +
    '                </ul>\n' +
    '            </div>\n' +
    '        </section>\n\n'
  );
}

function injectTrustBlocksBeforeNextSteps(html, locale) {
  if (html.indexOf(TRUST_BLOCK_ANCHOR) === -1) {
    throw new Error('injectTrustBlocksBeforeNextSteps: anchor not found');
  }
  const block = buildScenarioStripSection(locale) + buildSafetySection(locale) + TRUST_BLOCK_ANCHOR;
  return html.replace(TRUST_BLOCK_ANCHOR, block);
}

const LT_CONTEXT_BLOCK_HTML =
  '<section class="cmo-context" id="cmo-context" aria-labelledby="cmo-context-title">\n' +
  '            <h2 id="cmo-context-title" class="cmo-context-title">Rinkodaros kontekstas (vienas blokas, kiekvienam kopijavimui)</h2>\n' +
  '            <p class="cmo-context-intro">Neprivaloma: gali pradėti ir tuščiais laukais. Jei užpildai vieną kartą, penkios reikšmės ir taisyklės žemiau pridedamos kiekvieną kartą paspaudus <strong>Kopijuoti promptą</strong>. Saugojama tik šios naršyklės sesijoje.</p>\n' +
  '            <div class="cmo-context-form" id="cmoContextForm">\n' +
  '                <fieldset class="cmo-context-fields">\n' +
  '                    <legend class="cmo-context-legend">Rinkodaros konteksto laukai</legend>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxAudience">Auditorija</label>\n' +
  '                        <input type="text" id="cmoCtxAudience" name="audience" maxlength="160" placeholder="pvz. B2B rinkodaros vadovai Europoje, 50–500 FTE">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxOffer">Pasiūlymas / UPP</label>\n' +
  '                        <input type="text" id="cmoCtxOffer" name="offer" maxlength="160" placeholder="pvz. AI turinio sistema: 100 vienetų per 30 d.">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxChannels">Kanalai</label>\n' +
  '                        <input type="text" id="cmoCtxChannels" name="channels" maxlength="160" placeholder="pvz. LinkedIn, el. paštas, SEO">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxGoal">Tikslas (šis mėnuo)</label>\n' +
  '                        <input type="text" id="cmoCtxGoal" name="goal" maxlength="160" placeholder="pvz. 30 kvalifikuotų demo">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxConstraint">Pagrindinis apribojimas</label>\n' +
  '                        <input type="text" id="cmoCtxConstraint" name="constraint" maxlength="160" placeholder="pvz. 5 val./sav., nėra dizaino pagalbos">\n' +
  '                    </div>\n' +
  '                </fieldset>\n' +
  '                <div class="cmo-context-actions">\n' +
  '                    <button type="button" class="btn cmo-context-clear" id="cmoCtxClear">Išvalyti kontekstą</button>\n' +
  '                    <span class="cmo-context-status" id="cmoCtxStatus" aria-live="polite"></span>\n' +
  '                </div>\n' +
  '            </div>\n' +
  '            <div class="cmo-context-rules" id="cmoContextRules" role="note" aria-label="Privalomos taisyklės įterpiamos kopijuojant">\n' +
  '                <p class="cmo-context-rules-title"><strong>TAISYKLĖS (privalomos)</strong></p>\n' +
  '                <ul>\n' +
  '                    <li>Be bendro patarimo. Jei trūksta konteksto, pirmiausia užduok iki 3 tikslinių klausimų.</li>\n' +
  '                    <li>Nesugalvok skaičių, teiginių ar atsiliepimų. Pažymėk, ką reikia patvirtinti.</li>\n' +
  '                    <li>Išvestis turi būti naudojama: skyriai, savininkas kur tinkama, kitas veiksmas su terminu.</li>\n' +
  '                </ul>\n' +
  '            </div>\n' +
  '        </section>\n\n' +
  '        <!-- PROMPT 1 -->';

function injectLtContextBlock(html) {
  const anchor = '<!-- PROMPT 1 -->';
  if (html.indexOf(anchor) === -1) {
    throw new Error('injectLtContextBlock: anchor "<!-- PROMPT 1 -->" not found');
  }
  return html.replace(anchor, LT_CONTEXT_BLOCK_HTML);
}

function injectLtExpectedBullets(html) {
  let out = html;
  for (let i = 1; i <= 10; i++) {
    const bullets = LT_PROMPT_EXPECTED[i - 1]
      .map((b) => '                        <li>' + escapeHtml(b) + '</li>')
      .join('\n');
    const block =
      '\n                <ul class="prompt-expected" id="expected' +
      i +
      '" aria-label="Tikėtinas atsakymas promptui ' +
      i +
      '">\n' +
      '                    <li class="prompt-expected-title">Tikėtinas atsakymas</li>\n' +
      bullets +
      '\n                </ul>';
    const re = new RegExp(
      '(<pre class="code-text" id="prompt' + i + '">[\\s\\S]*?</div>)(\\s*</div>\\s*<div class="prompt-footer">)',
      ''
    );
    if (!re.test(out)) {
      throw new Error('injectLtExpectedBullets: anchor not found for prompt ' + i);
    }
    out = out.replace(re, '$1' + block + '$2');
  }
  return out;
}

/** Single provider row lives in root index.html (cmo-provider-hub); do not inject per prompt. */
function injectProviderRows(html) {
  return html;
}

function injectFooterSuite(html, locale) {
  const leaderUrl = 'https://ditreneris.github.io/leader/en/';
  const cross =
    locale === 'en'
      ? 'Need the CEO/COO kit? <a href="' +
        leaderUrl +
        '" target="_blank" rel="noopener noreferrer">Open Prompt Anatomy Leader</a>'
      : 'Reikia CEO/COO rinkinio? <a href="' +
        leaderUrl +
        '" target="_blank" rel="noopener noreferrer">Atidaryti Prompt Anatomy Leader</a>';
  const badge =
    locale === 'en'
      ? 'Prompt Anatomy CMO Kit v' + PKG_VERSION
      : 'Prompt Anatomy CMO rinkinys v' + PKG_VERSION;
  const insert =
    '            <div class="cmo-footer-meta print-muted">\n' +
    '                <p class="cmo-footer-crosslink">' +
    cross +
    '</p>\n' +
    '                <p class="cmo-kit-version" data-version="' +
    escapeHtml(PKG_VERSION) +
    '">' +
    escapeHtml(badge) +
    '</p>\n' +
    '            </div>\n';
  if (html.indexOf('<footer class="footer">') === -1) {
    throw new Error('injectFooterSuite: footer not found');
  }
  return html.replace('<footer class="footer">', '<footer class="footer">\n' + insert);
}

function buildScenariosTabScript(locale) {
  const scenarios = locale === 'en' ? EN_SCENARIOS : LT_SCENARIOS;
  const labels =
    locale === 'en'
      ? { next: 'Next action', bottom: 'Bottom line', risks: 'Risks', questions: 'Questions' }
      : { next: 'Kitas veiksmas', bottom: 'Esminė mintis', risks: 'Rizikos', questions: 'Klausimai' };
  const jsonScenarios = JSON.stringify(scenarios);
  const jsonLabels = JSON.stringify(labels);
  return (
    '<script>\n' +
    '        (function () {\n' +
    "            'use strict';\n" +
    '            var SCENARIOS = ' +
    jsonScenarios +
    ';\n' +
    '            var L = ' +
    jsonLabels +
    ';\n' +
    "            function panelText(s) {\n" +
    '                var lines = [s.brief, "", L.next + ": " + s.nextAction, L.bottom + ": " + s.bottomLine, "", L.risks + ":"];\n' +
    '                s.risks.forEach(function (r) { lines.push("- " + r); });\n' +
    '                lines.push("", L.questions + ":");\n' +
    '                s.questions.forEach(function (q) { lines.push("- " + q); });\n' +
    "                return lines.join('\\n');\n" +
    '            }\n' +
    "            document.addEventListener('DOMContentLoaded', function () {\n" +
    "                var tabs = document.querySelectorAll('.cmo-scenario-tab');\n" +
    "                var pre = document.getElementById('cmo-scenario-brief');\n" +
    "                var panel = document.getElementById('cmo-scenario-panel');\n" +
    '                if (!tabs.length || !pre) return;\n' +
    '                function activate(index) {\n' +
    '                    var s = SCENARIOS[index];\n' +
    '                    if (!s) return;\n' +
    '                    pre.textContent = panelText(s);\n' +
    '                    tabs.forEach(function (btn, i) {\n' +
    '                        var on = i === index;\n' +
    "                        btn.setAttribute('aria-selected', on ? 'true' : 'false');\n" +
    "                        btn.setAttribute('aria-pressed', on ? 'true' : 'false');\n" +
    "                        btn.setAttribute('tabindex', on ? '0' : '-1');\n" +
    '                        if (panel && on) panel.setAttribute("aria-labelledby", btn.id);\n' +
    '                    });\n' +
    '                }\n' +
    '                tabs.forEach(function (btn, i) {\n' +
    "                    btn.addEventListener('click', function () {\n" +
    '                        activate(i);\n' +
    '                    });\n' +
    "                    btn.addEventListener('keydown', function (e) {\n" +
    '                        var max = tabs.length - 1;\n' +
    "                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {\n" +
    '                            e.preventDefault();\n' +
    '                            var n = i < max ? i + 1 : 0;\n' +
    '                            tabs[n].focus();\n' +
    '                            activate(n);\n' +
    "                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {\n" +
    '                            e.preventDefault();\n' +
    '                            var p = i > 0 ? i - 1 : max;\n' +
    '                            tabs[p].focus();\n' +
    '                            activate(p);\n' +
    '                        }\n' +
    '                    });\n' +
    '                });\n' +
    '            });\n' +
    '        })();\n' +
    '    </script>'
  );
}

const LT_CONTEXT_SCRIPT =
  '<script>\n' +
  '        (function () {\n' +
  "            'use strict';\n" +
  "            if (!document.getElementById || !document.getElementById('cmo-context')) return;\n" +
  '\n' +
  "            var STORAGE_KEY = 'cmo.context.v1';\n" +
  '            var FIELDS = [\n' +
  "                { id: 'cmoCtxAudience', label: 'Auditorija' },\n" +
  "                { id: 'cmoCtxOffer', label: 'Pasiūlymas / UPP' },\n" +
  "                { id: 'cmoCtxChannels', label: 'Kanalai' },\n" +
  "                { id: 'cmoCtxGoal', label: 'Tikslas (šis mėnuo)' },\n" +
  "                { id: 'cmoCtxConstraint', label: 'Pagrindinis apribojimas' }\n" +
  '            ];\n' +
  "            var RULES_HEADER = 'TAISYKLĖS (privalomos)';\n" +
  '            var RULES = [\n' +
  "                '- Be bendro patarimo. Jei trūksta konteksto, pirmiausia užduok iki 3 tikslinių klausimų.',\n" +
  "                '- Nesugalvok skaičių, teiginių ar atsiliepimų. Pažymėk, ką reikia patvirtinti.',\n" +
  "                '- Išvestis turi būti naudojama: skyriai, savininkas kur tinkama, kitas veiksmas su terminu.'\n" +
  '            ];\n' +
  '\n' +
  '            function readContext() {\n' +
  '                var out = {};\n' +
  '                var anyValue = false;\n' +
  '                FIELDS.forEach(function (f) {\n' +
  '                    var el = document.getElementById(f.id);\n' +
  "                    var v = el ? (el.value || '').trim() : '';\n" +
  '                    out[f.id] = v;\n' +
  '                    if (v) anyValue = true;\n' +
  '                });\n' +
  '                out.__hasAny = anyValue;\n' +
  '                return out;\n' +
  '            }\n' +
  '\n' +
  '            function persistContext() {\n' +
  '                try {\n' +
  '                    var values = {};\n' +
  '                    FIELDS.forEach(function (f) {\n' +
  '                        var el = document.getElementById(f.id);\n' +
  "                        values[f.id] = el ? el.value : '';\n" +
  '                    });\n' +
  '                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));\n' +
  '                } catch (e) { /* ignore */ }\n' +
  '            }\n' +
  '\n' +
  '            function restoreContext() {\n' +
  '                try {\n' +
  '                    var raw = sessionStorage.getItem(STORAGE_KEY);\n' +
  '                    if (!raw) return;\n' +
  '                    var values = JSON.parse(raw);\n' +
  "                    if (!values || typeof values !== 'object') return;\n" +
  '                    FIELDS.forEach(function (f) {\n' +
  '                        var el = document.getElementById(f.id);\n' +
  "                        if (el && typeof values[f.id] === 'string') el.value = values[f.id];\n" +
  '                    });\n' +
  '                } catch (e) { /* ignore */ }\n' +
  '            }\n' +
  '\n' +
  '            function clearContext() {\n' +
  '                FIELDS.forEach(function (f) {\n' +
  '                    var el = document.getElementById(f.id);\n' +
  "                    if (el) el.value = '';\n" +
  '                });\n' +
  '                try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }\n' +
  "                var status = document.getElementById('cmoCtxStatus');\n" +
  "                if (status) status.textContent = 'Kontekstas išvalytas.';\n" +
  '            }\n' +
  '\n' +
  '            window.__CMO_COMPILE = function (promptId, originalText) {\n' +
  '                if (!originalText) return originalText;\n' +
  "                if (promptId === 'promptDemo') return originalText;\n" +
  '                var ctx = readContext();\n' +
  '                var lines = [];\n' +
  '                if (ctx.__hasAny) {\n' +
  "                    lines.push('KONTEKSTAS');\n" +
  '                    FIELDS.forEach(function (f) {\n' +
  '                        var v = ctx[f.id];\n' +
  "                        lines.push('- ' + f.label + ': ' + (v ? v : '[nenurodyta]'));\n" +
  '                    });\n' +
  "                    lines.push('');\n" +
  '                }\n' +
  '                lines.push(RULES_HEADER);\n' +
  '                RULES.forEach(function (r) { lines.push(r); });\n' +
  "                lines.push('');\n" +
  "                lines.push('---');\n" +
  "                lines.push('');\n" +
  "                return lines.join('\\n') + originalText;\n" +
  '            };\n' +
  '\n' +
  "            document.addEventListener('DOMContentLoaded', function () {\n" +
  '                restoreContext();\n' +
  '                FIELDS.forEach(function (f) {\n' +
  '                    var el = document.getElementById(f.id);\n' +
  "                    if (el) el.addEventListener('input', persistContext);\n" +
  '                });\n' +
  "                var clearBtn = document.getElementById('cmoCtxClear');\n" +
  "                if (clearBtn) clearBtn.addEventListener('click', clearContext);\n" +
  '            });\n' +
  '        })();\n' +
  '    </script>';

function injectLtContextScript(html) {
  const anchor = '</body>';
  const idx = html.lastIndexOf(anchor);
  if (idx === -1) {
    throw new Error('injectLtContextScript: </body> not found');
  }
  return html.slice(0, idx) + '    ' + LT_CONTEXT_SCRIPT + '\n' + html.slice(idx);
}

function patchLtCopyPromptHook(html) {
  return patchEnCopyPromptHook(html);
}

function injectScenariosTabScript(html, locale) {
  const anchor = '</body>';
  const idx = html.lastIndexOf(anchor);
  if (idx === -1) {
    throw new Error('injectScenariosTabScript: </body> not found');
  }
  return html.slice(0, idx) + '    ' + buildScenariosTabScript(locale) + '\n' + html.slice(idx);
}

function makeAbsoluteUrl(relativePath) {
  return `${SITE_ORIGIN}${BASE_PATH}${relativePath}`;
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

/** Insert canonical + hreflang + core metadata after viewport meta */
function insertSeo(html, locale) {
  let cleanHtml = html
    .replace(/\n\s*<link rel="canonical" href="[^"]*">/g, '')
    .replace(/\n\s*<link rel="alternate" hreflang="lt" href="[^"]*">/g, '')
    .replace(/\n\s*<link rel="alternate" hreflang="en" href="[^"]*">/g, '')
    .replace(/\n\s*<link rel="alternate" hreflang="x-default" href="[^"]*">/g, '')
    .replace(/\n\s*<meta name="robots" content="[^"]*">/g, '')
    .replace(/\n\s*<meta name="description" content="[^"]*">/g, '')
    .replace(/\n\s*<meta property="og:[^"]+" content="[^"]*">/g, '')
    .replace(/\n\s*<meta name="twitter:[^"]+" content="[^"]*">/g, '');

  const canonicalPath = locale === 'lt' ? '/lt/' : '/en/';
  const ltUrl = makeAbsoluteUrl('/lt/');
  const enUrl = makeAbsoluteUrl('/en/');
  const canonical = makeAbsoluteUrl(canonicalPath);
  const ogLocale = locale === 'lt' ? 'lt_LT' : 'en_US';
  const title =
    locale === 'lt'
      ? 'Prompt Anatomy CMO: 10 promptų (~45 min)'
      : 'Prompt Anatomy CMO Kit: 10 copy‑paste prompts (45 min)';
  const description =
    locale === 'lt'
      ? 'Prompt Anatomy CMO rinkinys: 10 promptų, kurie padeda susidėlioti 30 d. planą, 1→7 formatus ir KPI ciklą. Kopijuok, įklijuok, paleisk. Be registracijos.'
      : 'Prompt Anatomy CMO Kit: 10 prompts to build a 30‑day plan, repurpose 1→7 formats, and run a KPI loop. Copy, paste, run. No sign‑up.';
  const ogImageUrl = makeAbsoluteUrl('/og.png');
  const ogImageAlt =
    locale === 'lt'
      ? 'Prompt Anatomy CMO rinkinys: 10 promptų (~45 min) – peržiūros paveikslas'
      : 'Prompt Anatomy CMO Kit: 10 copy-paste prompts (45 min) – preview image';
  const insert = [
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" hreflang="lt" href="${ltUrl}">`,
    `<link rel="alternate" hreflang="en" href="${enUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${enUrl}">`,
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    `<meta name="description" content="${description}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:site_name" content="Prompt Anatomy">`,
    `<meta property="og:locale" content="${ogLocale}">`,
    `<meta property="og:image" content="${ogImageUrl}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${ogImageAlt}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${ogImageUrl}">`,
    `<meta name="twitter:image:alt" content="${ogImageAlt}">`
  ].join('\n    ');
  return cleanHtml.replace(
    /<meta name="viewport" content="[^"]*">/,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    ' + insert
  );
}

/** Fix asset paths for pages inside lt/ or en/ */
function fixAssetPaths(html) {
  return html
    .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"')
    .replace(/href="privatumas\.html"/g, 'href="../privatumas.html"')
    .replace(/href="styles\//g, 'href="../styles/')
    .replace(/src="js\//g, 'src="../js/')
    .replace(/src="data\//g, 'src="../data/');
}

function assertLocaleStructure(html, locale) {
  const requiredSnippets = [
    'href="../styles/tokens.css"',
    'href="../styles/components.css"',
    'href="../styles/utilities.css"',
    'id="main-content"',
    'class="code-block"',
    'class="btn"',
    'class="prompt-done"'
  ];
  for (const snippet of requiredSnippets) {
    if (!html.includes(snippet)) {
      throw new Error(`Locale ${locale}: missing required snippet -> ${snippet}`);
    }
  }
}

/** EN static text replacements (META blocks come from index LT + data/en-prompt-bodies.json) */
const EN_REPLACEMENTS_PREFIX = [
  // Skip & meta
  ['Pereiti prie turinio', 'Skip to content'],
  [
    '<title>Prompt Anatomy CMO: 10 promptų (~45 min)</title>',
    '<title>Prompt Anatomy CMO Kit: 10 copy‑paste prompts (45 min)</title>'
  ],
  // Hero
  ['aria-label="Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)"', 'aria-label="Full Prompt Anatomy – interactive training (opens in new tab)"'],
  [
    '<span class="badge badge-spinoff" role="status" aria-label="10 CMO promptų biblioteka naršyklėje, be registracijos">Nemokama biblioteka</span>',
    '<span class="badge badge-spinoff" role="status" aria-label="10 CMO prompts in your browser, no sign-up required">Free library</span>'
  ],
  // Footer product link (before generic "Promptų anatomija" so full paragraph matches)
  [
    '<p class="footer-product-link">Spin-off Nr. 2 (Prompt Anatomy). Pilnas mokymas, metodika ir brand centras: <a href="https://promptanatomy.app/" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>. Paskutinis atnaujinimas: 2026-04-30.</p>',
    '<p class="footer-product-link">Spin-off No. 2 (Prompt Anatomy). Full training, methodology, and brand hub: <a href="https://promptanatomy.app/" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>. Last updated: 2026-04-30.</p>'
  ],
  ['<span id="footer-email-label">El. paštas:</span>', '<span id="footer-email-label">Email:</span>'],
  // Exact strings with "Promptų anatomija" before global replace below (order matters)
  ['aria-label="Atidaryti Promptų anatomija Telegram grupę naujame lange"', 'aria-label="Open Prompt Anatomy Telegram group in new tab"'],
  ['Promptų anatomija', 'Prompt Anatomy'],
  ['Turinio DI sistema<br>rinkodaros vadovams', 'Content AI System<br>for Marketing Leaders'],
  [
    '10 CMO promptų naršyklėje: per ~45 min. susiformuos planas ir kasdienis turinio ciklas.',
    '10 CMO prompts in your browser: in ~45 minutes you get a plan and a daily content rhythm.'
  ],
  [
    '<li class="trust-pill" id="heroTrustPill1"><span aria-hidden="true">🔒</span> Be duomenų rinkimo</li>',
    '<li class="trust-pill" id="heroTrustPill1"><span aria-hidden="true">🔒</span> No data collection</li>'
  ],
  [
    '<li class="trust-pill" id="heroTrustPill2"><span aria-hidden="true">🧩</span> 10 promptų seka</li>',
    '<li class="trust-pill" id="heroTrustPill2"><span aria-hidden="true">🧩</span> 10-step prompt sequence</li>'
  ],
  [
    '<li class="trust-pill" id="heroTrustPill3"><span aria-hidden="true">⏱</span> ~45 min rezultatas</li>',
    '<li class="trust-pill" id="heroTrustPill3"><span aria-hidden="true">⏱</span> ~45 min outcome</li>'
  ],
  ['<span class="prompt-recommended" id="prompt1Recommended">Pradėk nuo čia</span>', '<span class="prompt-recommended" id="prompt1Recommended">Start here</span>'],
  ['aria-label="Pradėti nuo pirmo prompto – pereiti prie bibliotekos"', 'aria-label="Start with prompt 1 – go to the library"'],
  ['Pradėti nuo 1-o prompto', 'Start with prompt 1'],
  [
    '<p class="header-cta-note"><a href="#community" class="cta-secondary" aria-label="Prisijunk prie bendruomenės – pereiti prie Telegram">Bendruomenė: Telegram</a></p>',
    '<p class="header-cta-note"><a href="#community" class="cta-secondary" aria-label="Join the community – go to Telegram">Community: Telegram</a></p>'
  ],
  ['<span id="heroDemoTitle">Išbandyk be registracijos</span>', '<span id="heroDemoTitle">Try without signing up</span>'],
  ['aria-label="Nukopijuoti mini-promptą į darbinių atmintinę"', 'aria-label="Copy mini-prompt to clipboard"'],
  ['<span id="heroDemoCopyBtnText">Nukopijuoti mini-promptą</span>', '<span id="heroDemoCopyBtnText">Copy mini-prompt</span>'],
  [
    `<pre id="promptDemo">META: Tu esi rinkodaros strategas.
INPUT: Auditorija [ ], tikslas [ ].
OUTPUT: 5 idėjos su kabliuku + CTA + KPI.</pre>`,
    `<pre id="promptDemo">META: You are a marketing strategist.
INPUT: Audience [ ], goal [ ].
OUTPUT: 5 ideas with hook + CTA + KPI.</pre>`
  ],
  // Objectives
  ['<span aria-hidden="true">🎯</span> Ką realiai gausi', '<span aria-hidden="true">🎯</span> What you get'],
  ['Per 3/4 val. turėsi aiškią turinio sistemą, 100 turinio vienetų ir 30 d. planą', 'In 45 minutes, you get a clear content system, 100 content assets, and a 30-day plan'],
  ['Generuosi turinį pagal 4 principus', 'Generate content with 4 proven pillars'],
  ['Testuosi ir optimizuosi pagal aiškius matavimo rodiklius', 'Test and optimize with clear KPIs'],
  ['Dirbsi uždaru ciklu: Planuok → Kurk → Platink → Matuok → Spręsk', 'Run a closed loop: Plan → Create → Distribute → Measure → Decide'],
  ['<strong>Apibrėžimas CMO lygmeniui</strong>', '<strong>CMO-level definition</strong>'],
  ['<p>Prompt Anatomy yra praktinė AI operacinė sistema komandai: mažiau spėjimų, daugiau kontrolės ir aiškus sprendimų ciklas.</p>', '<p>Prompt Anatomy is a practical AI operating system for teams: less guesswork, more control, and a clear decision loop.</p>'],
  ['<strong>Kada naudoti</strong>', '<strong>When to use</strong>'],
  ['<p>Naudok, kai reikia greičiau paleisti turinį, sumažinti komandų trintį ir išlaikyti vienodą kokybę per kanalus.</p>', '<p>Use it when you need faster content execution, less team friction, and consistent quality across channels.</p>'],
  [
    '<p class="objectives-eco-hint">Oficiali metodika, kursai ir kontaktai – <a href="#ecosystem-strip">skiltis „Ekosistema“ žemiau</a>.</p>',
    '<p class="objectives-eco-hint">Official methodology, courses, and contacts – <a href="#ecosystem-strip">Ecosystem section below</a>.</p>'
  ],
  // Executive summary (GEO/AI block)
  ['<span aria-hidden="true">🧭</span> Executive santrauka', '<span aria-hidden="true">🧭</span> Executive summary'],
  ['<strong>Kas tai yra</strong>', '<strong>What this is</strong>'],
  [
    '<p><strong>Prompt Anatomy CMO rinkinys</strong> – struktūruota promptų sistema (framework + seka), skirta rinkodaros vadovams ir komandoms greičiau priimti turinio sprendimus.</p>',
    '<p><strong>Prompt Anatomy CMO Kit</strong> is a structured prompting system (framework + sequence) for marketing leaders and teams to make faster content decisions.</p>'
  ],
  ['<strong>Kur panaudosi</strong>', '<strong>Use it for</strong>'],
  ['30 d. turinio planas ir prioritetai', 'A 30-day content plan and priorities'],
  ['1 idėja → 7 formatai (cross-channel nuoseklumas)', 'One idea → 7 formats (cross-channel consistency)'],
  ['KPI ciklas: matuok → spręsk → tobulink', 'A KPI loop: measure → decide → improve'],
  ['<strong>Kuo skiriasi</strong>', '<strong>How it differs</strong>'],
  ['„Random promptai“ → chaosas ir nepastovi kokybė', 'Random prompts → chaos and inconsistent quality'],
  ['„Prompt engineering tips“ → žinios, bet ne vykdymo ritmas', 'Prompt tips → knowledge, but no execution cadence'],
  ['<strong>Prompt Anatomy seka</strong> → pakartojamas operacinis ciklas', '<strong>Prompt Anatomy sequence</strong> → repeatable operating cadence'],
  [
    '<p class="objectives-eco-hint"><strong>Žr. greitai:</strong> <a href="#block1">30 d. planas</a> · <a href="#block5">analizė pagal KPI</a> · <a href="#block9">temų grupė</a> · <a href="#cmo-safety">tikrinti prieš publikuojant</a> · <a href="#ecosystem-strip">ekosistema</a>.</p>',
    '<p class="objectives-eco-hint"><strong>See:</strong> <a href="#block1">30-day plan</a> · <a href="#block5">KPI analysis</a> · <a href="#block9">topic cluster</a> · <a href="#cmo-safety">pre-publish safety</a> · <a href="#ecosystem-strip">ecosystem</a>.</p>'
  ],
  // Instructions
  ['Kaip naudoti šią biblioteką', 'How to use this library'],
  ['aria-label="Orientacinis laikas: 3–5 min per žingsnį"', 'aria-label="Estimated time: 3–5 min per step"'],
  ['Pasirink promptą ir spausk ant jo – tekstas pažymėsis', 'Select a prompt and click it to auto-select the text'],
  // Use same quote chars as in index.html: „ (U+201E) and " (U+201C) so replacement matches
  ['Spausk <strong>„Kopijuoti promptą\u201C</strong> arba <code>Ctrl+C</code> / <code>Cmd+C</code>', 'Click <strong>"Copy prompt"</strong> or <code>Ctrl+C</code> / <code>Cmd+C</code>'],
  ['~3–5 min per žingsnį', '~3–5 min per step'],
  ["content: '💡 Spausk čia ir nukopijuok';", "content: '💡 Click to select and copy';"],
  ['Įklijuok į ChatGPT, Claude ar kitą DI (dirbtinio intelekto) įrankį', 'Paste into ChatGPT, Claude or another AI tool'],
  ['Pakeisk <code>[auditorija]</code>, <code>[galvos skausmas]</code>, <code>[unikalus pardavimo pasiūlymas]</code>, <code>[kanalas]</code> ir kitus laukus savo duomenimis – ir gauk rezultatą', 'Replace <code>[audience]</code>, <code>[pain point]</code>, <code>[unique selling proposition]</code>, <code>[channel]</code>, and any city or budget placeholders with your real data'],
  // Upgrade layer: explain blocks
  ['Kas yra prompt?', 'What is a prompt?'],
  // Preflight strip (under hero)
  ['Prieš kopijuojant (1 min)', 'Before you copy (1 min)'],
  ['Aiški instrukcija DI įrankiui: kontekstas + tikslas + ribos + formatas.', 'A clear instruction for an AI tool: context + goal + constraints + format.'],
  ['Struktūra, kuri padaro rezultatą nuoseklų ir pakartojamą.', 'A structure that makes outputs consistent and repeatable.'],
  ['Eik per žingsnius ir dirbk ciklu: Planuok → Kurk → Tikrink → Tobulink.', 'Go step by step and run the loop: Plan → Create → Check → Improve.'],
  ['Pilnas paaiškinimas', 'Full explanation'],
  ['<a href="#framework-schema">Schema</a>', '<a href="#framework-schema">Framework</a>'],
  ['<p class="objectives-eco-hint"><a href="#block1"><strong>Praleisti → Promptas 1</strong></a></p>', '<p class="objectives-eco-hint"><a href="#block1"><strong>Skip → Prompt 1</strong></a></p>'],
  ['Promptas yra aiški instrukcija DI įrankiui: ką daryti, kam daryti ir kokiu formatu grąžinti rezultatą.', 'A prompt is a clear instruction to an AI tool: what to do, for whom, and in which format.'],
  ['Kuo promptas tikslesnis, tuo mažiau taisymų po pirmo atsakymo.', 'The clearer the prompt, the fewer fixes you need after the first answer.'],
  ['Kontekstas + Tikslas + Ribos + Formatas', 'Context + Goal + Constraints + Format'],
  ['aria-label="Meme vieta 1"', 'aria-label="Meme slot 1"'],
  ['Meme vieta #1: Kai parašai vieną neaiškų sakinį ir tikiesi tobulo plano.', 'Meme slot #1: When you write one vague sentence and expect a perfect plan.'],
  [
    '<figcaption class="meme-caption">Meme #1 — kai parašai vieną neaiškų sakinį ir tikiesi tobulo plano.</figcaption>',
    '<figcaption class="meme-caption">Meme #1 — when you write one vague sentence and expect a perfect plan.</figcaption>'
  ],
  ['Kas yra Prompt Anatomy?', 'What is Prompt Anatomy?'],
  ['Prompt Anatomy yra struktūra, kuri padeda rašyti promptus taip, kad rezultatas būtų nuoseklus ir pakartojamas.', 'Prompt Anatomy is a structure that helps you write prompts with consistent and repeatable results.'],
  // Definitions (tiny GEO/AI module)
  ['Sąvokos (1 min)', 'Definitions (1 min)'],
  [
    '<p><strong>Promptas:</strong> aiški instrukcija DI įrankiui su kontekstu, tikslu ir pageidaujamu formatu.</p>',
    '<p><strong>Prompt:</strong> a clear instruction for an AI tool with context, a goal, and a required format.</p>'
  ],
  [
    '<p><strong>Prompt Anatomy:</strong> framework, kuris suvienodina promptų struktūrą ir padaro rezultatą pakartojamą.</p>',
    '<p><strong>Prompt Anatomy:</strong> a framework that standardizes prompt structure and makes outputs repeatable.</p>'
  ],
  [
    '<p><strong>Turinio DI sistema:</strong> procesas + promptų seka, kuri paverčia „idėjas“ į planą, publikavimą ir matuojamus veiksmus.</p>',
    '<p><strong>Content AI system:</strong> a process + prompt sequence that turns “ideas” into a plan, publishing, and measurable actions.</p>'
  ],
  ['Rolė: kas kalba ir kokio lygio ekspertika.', 'Role: who is speaking and at what expertise level.'],
  ['Kontekstas: situacija, auditorija ir apribojimai.', 'Context: situation, audience, and limits.'],
  ['Tikslas: vienas aiškus rezultatas.', 'Goal: one clear result.'],
  ['Ribos: tonas, ilgis, kas neleidžiama.', 'Constraints: tone, length, what is not allowed.'],
  ['Formatas: kaip turi atrodyti atsakymas.', 'Format: how the response must look.'],
  ['Vertinimas: pagal ką spręsti ar atsakymas geras.', 'Evaluation: how to judge response quality.'],
  ['aria-label="Meme vieta 2"', 'aria-label="Meme slot 2"'],
  [
    'Meme vieta #2: Kai iš „parašyk kažką“ pereini į aiškią struktūrą ir rezultatas pagaliau normalus.',
    'Meme slot #2: When you move from "write something" to a clear structure and the output is finally solid.'
  ],
  [
    '<figcaption class="meme-caption">Meme #2 — kai iš „parašyk kažką“ pereini į aiškią struktūrą ir rezultatas pagaliau normalus.</figcaption>',
    '<figcaption class="meme-caption">Meme #2 — when you move from “write something” to a clear structure and the output is finally solid.</figcaption>'
  ],
  ['Schema: kaip dirbti su šia biblioteka', 'Framework: how to work with this library'],
  ['Planuok: pasirink vieną tikslą ir vieną auditoriją.', 'Plan: choose one goal and one audience.'],
  ['Kurk: paleisk promptą su savo duomenimis.', 'Create: run the prompt with your real data.'],
  ['Tikrink: įvertink rezultatą pagal matavimo rodiklius.', 'Check: evaluate output by your metrics.'],
  ['Tobulink: pakoreguok promptą ir kartok ciklą.', 'Improve: refine the prompt and repeat the cycle.'],
  [
    'alt="Meme apie neaiškų promptą ir netikslų rezultatą"',
    'alt="Meme: a vague one-line prompt and a messy AI result"'
  ],
  [
    'alt="Meme apie perėjimą nuo chaoso prie aiškios promptų struktūros"',
    'alt="Meme: from chaotic prompts to a clear structure that works"'
  ],
  [
    'alt="Meme apie tai, kad problema buvo ne AI, o neaiški instrukcija"',
    'alt="Meme: bad output came from vague instructions, not from AI"'
  ],
  [
    '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Ar tinka pradedančiajam?","acceptedAnswer":{"@type":"Answer","text":"Taip, jei pildai laukus savo situacija, ne bendrais žodžiais."}},{"@type":"Question","name":"Ar būtina naudoti visus 10?","acceptedAnswer":{"@type":"Answer","text":"Ne, pradėk nuo 1–3 ir plėskis pagal poreikį."}},{"@type":"Question","name":"Kuo tai geriau nei random promptas?","acceptedAnswer":{"@type":"Answer","text":"Čia turi nuoseklią seką, aiškų tikslą ir vertinimą."}},{"@type":"Question","name":"Kiek laiko skirti kasdien?","acceptedAnswer":{"@type":"Answer","text":"20–30 min pakanka, jei dirbi ciklu „Kurk → Tikrink → Tobulink“."}},{"@type":"Question","name":"Ar tai kursas ar įrankis?","acceptedAnswer":{"@type":"Answer","text":"Tai interaktyvi promptų biblioteka + framework. Gali naudoti iškart (kopijuok → įklijuok → paleisk)."}},{"@type":"Question","name":"Kam tai skirta?","acceptedAnswer":{"@type":"Answer","text":"CMO, rinkodaros vadovams, produktų/augimo komandoms ir vadovams, kuriems reikia greito, pakartojamo turinio ciklo."}},{"@type":"Question","name":"Kuo skiriasi nuo promptų šablonų?","acceptedAnswer":{"@type":"Answer","text":"Čia turi seką, aiškius laukus, vertinimą ir KPI ciklą – ne vieną vienkartinį tekstą."}},{"@type":"Question","name":"Ar tinka B2B SaaS, paslaugoms ir e. komercijai?","acceptedAnswer":{"@type":"Answer","text":"Taip. Tiesiog pakeisk auditoriją, pasiūlymą, kanalus ir metrikas – struktūra išlieka ta pati."}}]}',
    '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Is this for beginners?","acceptedAnswer":{"@type":"Answer","text":"Yes, if you fill placeholders with your real context."}},{"@type":"Question","name":"Do I need all 10 prompts?","acceptedAnswer":{"@type":"Answer","text":"No, start with 1–3 and expand when needed."}},{"@type":"Question","name":"Why is this better than random prompts?","acceptedAnswer":{"@type":"Answer","text":"You get a clear sequence, goal, and evaluation."}},{"@type":"Question","name":"How much time daily?","acceptedAnswer":{"@type":"Answer","text":"20–30 minutes is enough if you run Create → Check → Improve."}},{"@type":"Question","name":"Is this a course or a tool?","acceptedAnswer":{"@type":"Answer","text":"It’s an interactive prompt library + framework. You can use it immediately (copy → paste → run)."}},{"@type":"Question","name":"Who is this for?","acceptedAnswer":{"@type":"Answer","text":"CMOs, marketing leads, product/growth teams, and leaders who need a fast, repeatable content cadence."}},{"@type":"Question","name":"How is this different from prompt templates?","acceptedAnswer":{"@type":"Answer","text":"You get a sequence, clear fields, evaluation, and a KPI loop — not a one-off output."}},{"@type":"Question","name":"Does this work for B2B SaaS, services, and ecommerce?","acceptedAnswer":{"@type":"Answer","text":"Yes. Swap the audience, offer, channels, and metrics — the structure stays the same."}}]}'
  ],
  [
    '<figcaption class="meme-caption">Meme #3 — kai supranti, kad problema buvo ne DI, o neaiški instrukcija.</figcaption>',
    '<figcaption class="meme-caption">Meme #3 — when you realize the issue wasn’t AI, it was the vague instruction.</figcaption>'
  ],
  // Progress
  ['Panaudojai 0 iš 10 promptų', 'You used 0 of 10 prompts'],
  ['aria-label="Progresas: 0 iš 10 promptų"', 'aria-label="Progress: 0 of 10 prompts"'],
  [
    '<p class="cmo-provider-hub-title" id="cmo-provider-hub-title">DI įrankiai (naujame skirtuke)</p>',
    '<p class="cmo-provider-hub-title" id="cmo-provider-hub-title">AI tools (new tab)</p>'
  ],
  [
    '<div class="cmo-provider-row" role="group" aria-label="Atidaryti trečiųjų šalių DI puslapius naujame skirtuke">',
    '<div class="cmo-provider-row" role="group" aria-label="Open third-party AI provider sites in a new tab">'
  ],
  ['Atidaryti ChatGPT', 'Open ChatGPT'],
  ['Atidaryti Claude', 'Open Claude'],
  ['Atidaryti Gemini', 'Open Gemini']
];

const EN_REPLACEMENTS_SUFFIX = [
  // Prompt 1
  ['<div class="category">Pradžia</div>', '<div class="category">Start</div>'],
  // Breath moments (non-ID breaks)
  [
    '<p><strong>Įkvėpk (10 s):</strong> ar čia yra konkretus <strong>kabliukas</strong> + <strong>įrodymas</strong> + <strong>vienas CTA</strong>? Jei ne – patikslink 1 eilute ir paleisk dar kartą.</p>',
    '<p><strong>Breathe (10 sec):</strong> do you have a clear <strong>hook</strong> + <strong>proof</strong> + <strong>one CTA</strong>? If not, refine one line and run again.</p>'
  ],
  [
    '<p><strong>Reset (10 s):</strong> surašyk 3 tikrus prieštaravimus kaip cituoja klientai. Tada paleisk šį promptą dar kartą – rezultatas bus 2× taiklesnis.</p>',
    '<p><strong>Reset (10 sec):</strong> write down 3 real objections in the customer’s own words. Run the prompt again — the output will be much sharper.</p>'
  ],
  ['<h2 class="prompt-title">30 dienų turinio sistema</h2>', '<h2 class="prompt-title">30-day content system</h2>'],
  ['<p class="prompt-desc">Sukurk 30 dienų turinio planą pagal 4 turinio principus</p>', '<p class="prompt-desc">Create a 30-day content plan using 4 content principles</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 1"', 'aria-label="Select and copy prompt 1"'],
  ['aria-label="Informacija: promptas 1"', 'aria-label="Information: prompt 1"'],
  ['<strong>Branduolys:</strong>', '<strong>Core:</strong>'],
  ['<p>4 principai = balansas: autoritetas, problema, įrodymas, pasiūlymas.</p>', '<p>4 principles = balance: authority, problem, proof, offer.</p>'],
  [
    'Nukopijuok ir įklijuok į ChatGPT arba Claude – tai šio žingsnio tikslas.',
    'Copy this prompt into ChatGPT or Claude, fill in the brackets, and run it.'
  ],
  ['aria-label="Kopijuoti promptą 1 į darbinių atmintinę"', 'aria-label="Copy prompt 1 to clipboard"'],
  ['<span>Kopijuoti promptą</span>', '<span>Copy prompt</span>'],
  ['aria-label="Pažymėti, kad atlikai šį žingsnį"', 'aria-label="Mark as done"'],
  ['<span>Pažymėjau kaip atlikau</span>', '<span>Mark as done</span>'],
  // Prompt 2
  ['<h2 class="prompt-title">Viena idėja → 7 formatai</h2>', '<h2 class="prompt-title">One idea → 7 formats</h2>'],
  ['<p class="prompt-desc">Vieną idėją paversk į 7 skirtingus formatus</p>', '<p class="prompt-desc">Turn one idea into 7 different formats</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 2"', 'aria-label="Select and copy prompt 2"'],
  ['aria-label="Informacija: promptas 2"', 'aria-label="Information: prompt 2"'],
  ['<strong>Vienos idėjos daug formatų:</strong>', '<strong>One idea, many formats:</strong>'],
  ['<p>1 idėja = 7 vienetų. Laikas sutaupomas, nuoseklumas išlaikomas.</p>', '<p>1 idea = 7 units. Time saved, consistency kept.</p>'],
  ['Įklijuok į ChatGPT arba Claude ir pakeisk laukus savo duomenimis.', 'Paste into ChatGPT or Claude and replace placeholders with your data.'],
  ['aria-label="Kopijuoti promptą 2 į darbinių atmintinę"', 'aria-label="Copy prompt 2 to clipboard"'],
  // Prompt 3
  ['<h2 class="prompt-title">LinkedIn Autoriteto Kūrimas</h2>', '<h2 class="prompt-title">LinkedIn authority building</h2>'],
  ['<p class="prompt-desc">150–200 žodžių postas su įžanginiu kabliuku, 3 punktais, pavyzdžiu ir raginimu veikti</p>', '<p class="prompt-desc">150–200 word post with hook, 3 points, example and call to action</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 3"', 'aria-label="Select and copy prompt 3"'],
  ['aria-label="Informacija: promptas 3"', 'aria-label="Information: prompt 3"'],
  ['<strong>Autoritetas:</strong>', '<strong>Authority:</strong>'],
  ['<p>Įrodymai + konkretūs punktai = pasitikėjimas ir reakcija.</p>', '<p>Proof + concrete points = trust and engagement.</p>'],
  ['aria-label="Kopijuoti promptą 3 į darbinių atmintinę"', 'aria-label="Copy prompt 3 to clipboard"'],
  // Prompt 4
  ['<h2 class="prompt-title">30 sek. video scenarijus</h2>', '<h2 class="prompt-title">30 sec video script</h2>'],
  ['<p class="prompt-desc">Sukurti video – lengviau dar nebuvo!</p>', '<p class="prompt-desc">Write a 30-second video script with a clear hook and CTA</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 4"', 'aria-label="Select and copy prompt 4"'],
  ['aria-label="Informacija: promptas 4"', 'aria-label="Information: prompt 4"'],
  ['<strong>Trumpas formatas:</strong>', '<strong>Short format:</strong>'],
  ['<p>2 sekundės = liks arba slinks toliau. Įžūgis – esmė.</p>', '<p>2 seconds = stay or scroll. The hook is key.</p>'],
  [
    'Nukopijuok, įklijuok į DI įrankį ir pakeisk [tema], [pavyzdys] savo duomenimis.',
    'Copy, paste into your AI tool, and replace [topic] and [example] with your data.'
  ],
  ['aria-label="Kopijuoti promptą 4 į darbinių atmintinę"', 'aria-label="Copy prompt 4 to clipboard"'],
  // Prompt 5
  ['<h2 class="prompt-title">Kasdienė analizė (Veikla→Sprendimas)</h2>', '<h2 class="prompt-title">Daily analysis (Action→Decision)</h2>'],
  [
    '<p class="prompt-desc">Iš rodiklių suprask: kas neveikia, kodėl, ką daryti</p>',
    '<p class="prompt-desc">Use metrics to understand what isn’t working, why, and what to do next</p>'
  ],
  ['aria-label="Pasirinkti ir kopijuoti promptą 5"', 'aria-label="Select and copy prompt 5"'],
  ['aria-label="Informacija: promptas 5"', 'aria-label="Information: prompt 5"'],
  ['<strong>Uždaras ciklas:</strong>', '<strong>Closed loop:</strong>'],
  ['<p>Rodikliai be veiksmų = stovėjimas vietoje. Duomenys → sprendimai.</p>', '<p>Metrics without action = standing still. Data → decisions.</p>'],
  ['aria-label="Kopijuoti promptą 5 į darbinių atmintinę"', 'aria-label="Copy prompt 5 to clipboard"'],
  // Prompt 6
  ['<div class="category">Įgūdžiai</div>', '<div class="category">Skills</div>'],
  ['<h2 class="prompt-title">Prieštaravimų apdorojimo įrankis</h2>', '<h2 class="prompt-title">Objection handling tool</h2>'],
  ['<p class="prompt-desc">Iš klientų prieštaravimų sukurk turinį, kuris juos neutralizuoja</p>', '<p class="prompt-desc">Turn customer objections into content that neutralizes them</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 6"', 'aria-label="Select and copy prompt 6"'],
  ['aria-label="Informacija: promptas 6"', 'aria-label="Information: prompt 6"'],
  ['<strong>Konversija:</strong>', '<strong>Conversion:</strong>'],
  ['<p>Realūs klausimai + atsakymai = mažesnė trintis, didesnis pasitikėjimas.</p>', '<p>Real questions + answers = less friction, more trust.</p>'],
  ['Įklijuok į ChatGPT arba Claude – pakeisk prieštaravimus ir kontekstą.', 'Paste into ChatGPT or Claude – replace objections and context.'],
  ['aria-label="Kopijuoti promptą 6 į darbinių atmintinę"', 'aria-label="Copy prompt 6 to clipboard"'],
  // Prompt 7
  ['<h2 class="prompt-title">Lead generator postas + DM seka</h2>', '<h2 class="prompt-title">Lead generator post + DM sequence</h2>'],
  ['<p class="prompt-desc">Lead generator postas + 4 žinučių seka</p>', '<p class="prompt-desc">Lead generator post + 4-message sequence</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 7"', 'aria-label="Select and copy prompt 7"'],
  ['aria-label="Informacija: promptas 7"', 'aria-label="Information: prompt 7"'],
  ['<strong>Potencialūs klientai:</strong>', '<strong>Leads:</strong>'],
  ['<p>Seka: sekėjas → klientas. Struktūra didina konversiją.</p>', '<p>Sequence: follower → customer. Structure increases conversion.</p>'],
  ['aria-label="Kopijuoti promptą 7 į darbinių atmintinę"', 'aria-label="Copy prompt 7 to clipboard"'],
  // Prompt 8
  ['<h2 class="prompt-title">Kliento istorijos struktūra</h2>', '<h2 class="prompt-title">Customer story structure</h2>'],
  ['<p class="prompt-desc">Iš duomenų sukurk kliento istoriją</p>', '<p class="prompt-desc">Turn data into a customer story</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 8"', 'aria-label="Select and copy prompt 8"'],
  ['aria-label="Informacija: promptas 8"', 'aria-label="Information: prompt 8"'],
  ['<strong>Įrodymai:</strong>', '<strong>Proof:</strong>'],
  ['<p>Skaičiai + procesas = kredibilitetas ir konversija.</p>', '<p>Numbers + process = credibility and conversion.</p>'],
  ['Nukopijuok ir įklijuok – įrašyk kliento duomenis ir gauk struktūrizuotą istoriją.', 'Copy and paste – enter customer data and get a structured story.'],
  ['aria-label="Kopijuoti promptą 8 į darbinių atmintinę"', 'aria-label="Copy prompt 8 to clipboard"'],
  // Prompt 9
  ['<div class="category">Plėtra</div>', '<div class="category">Growth</div>'],
  ['<h2 class="prompt-title">Temų grupė</h2>', '<h2 class="prompt-title">Topic cluster</h2>'],
  ['<p class="prompt-desc">Pagrindinė tema + 8 subtemos, vidinės nuorodos</p>', '<p class="prompt-desc">Main topic + 8 subtopics, internal links</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 9"', 'aria-label="Select and copy prompt 9"'],
  ['aria-label="Informacija: promptas 9"', 'aria-label="Information: prompt 9"'],
  ['<p>Pagrindinė tema + subtemos = pasiekiamumas ir eksperto pozicija.</p>', '<p>Main topic + subtopics = reach and expert position.</p>'],
  ['aria-label="Kopijuoti promptą 9 į darbinių atmintinę"', 'aria-label="Copy prompt 9 to clipboard"'],
  // Prompt 10
  ['<div class="category">Viskas kartu</div>', '<div class="category">All together</div>'],
  ['<h2 class="prompt-title">Pagrindinis promptas (valdymo centras)</h2>', '<h2 class="prompt-title">Main prompt (control center)</h2>'],
  ['<p class="prompt-desc">Vienas integruotas planas: turinys, vienos idėjos daug formatų, testavimas, veiksmai</p>', '<p class="prompt-desc">One integrated plan: content, one idea many formats, testing, actions</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 10"', 'aria-label="Select and copy prompt 10"'],
  ['aria-label="Informacija: promptas 10"', 'aria-label="Information: prompt 10"'],
  ['<strong>Valdymo centras:</strong>', '<strong>Control center:</strong>'],
  ['<p>Viskas vienoje vietoje: 30 d. planas, 1→7, testavimas, prioritetai.</p>', '<p>Everything in one place: 30-day plan, 1→7, testing, priorities.</p>'],
  [
    'Šis promptas apima viską – nukopijuok, įklijuok ir pildyk savo verslo laukus.',
    'This prompt covers everything—copy, paste, and fill in your business fields.'
  ],
  ['aria-label="Kopijuoti promptą 10 į darbinių atmintinę"', 'aria-label="Copy prompt 10 to clipboard"'],
  // Next steps
  ['<h2 id="next-steps-title">Kas toliau?</h2>', '<h2 id="next-steps-title">What next?</h2>'],
  ['Geriausia eiti iš eilės nuo 1 iki 10. Paspaudę nuorodą pereisi prie atitinkamo prompto.', 'Best to go in order from 1 to 10. Click a link to jump to that prompt.'],
  [
    '<summary class="next-steps-summary" id="next-steps-jump">Šuolis į promptą (1–10)</summary>',
    '<summary class="next-steps-summary" id="next-steps-jump">Jump to prompt (1–10)</summary>'
  ],
  ['<a href="#block1">1. 30 dienų turinio sistema</a>', '<a href="#block1">1. 30-day content system</a>'],
  ['<a href="#block2">2. Viena idėja → 7 formatai</a>', '<a href="#block2">2. One idea → 7 formats</a>'],
  ['<a href="#block3">3. LinkedIn Autoriteto Kūrimas</a>', '<a href="#block3">3. LinkedIn authority building</a>'],
  ['<a href="#block4">4. 30 sek. video scenarijus</a>', '<a href="#block4">4. 30 sec video script</a>'],
  ['<a href="#block5">5. Kasdienė analizė (Veikla→Sprendimas)</a>', '<a href="#block5">5. Daily analysis (Action→Decision)</a>'],
  ['<a href="#block6">6. Prieštaravimų apdorojimas</a>', '<a href="#block6">6. Objection handling</a>'],
  ['<a href="#block7">7. Lead generator postas + DM seka</a>', '<a href="#block7">7. Lead generator post + DM sequence</a>'],
  ['<a href="#block8">8. Kliento istorijos struktūra</a>', '<a href="#block8">8. Customer story structure</a>'],
  ['<a href="#block9">9. Temų grupė</a>', '<a href="#block9">9. Topic cluster</a>'],
  ['<a href="#block10">10. Pagrindinis promptas (valdymo centras)</a>', '<a href="#block10">10. Main prompt (control center)</a>'],
  // FAQ + meme slot
  ['Dažniausi klausimai prieš startą', 'Frequently asked questions before you start'],
  ['<summary>Ar tinka pradedančiajam?</summary>', '<summary>Is this for beginners?</summary>'],
  ['<p>Taip, jei pildai laukus savo situacija, ne bendrais žodžiais.</p>', '<p>Yes, if you fill placeholders with your real context.</p>'],
  ['<summary>Ar būtina naudoti visus 10?</summary>', '<summary>Do I need all 10 prompts?</summary>'],
  ['<p>Ne, pradėk nuo 1–3 ir plėskis pagal poreikį.</p>', '<p>No, start with 1–3 and expand when needed.</p>'],
  ['<summary>Kuo tai geriau nei random promptas?</summary>', '<summary>Why is this better than random prompts?</summary>'],
  ['<p>Čia turi nuoseklią seką, aiškų tikslą ir vertinimą.</p>', '<p>You get a clear sequence, goal, and evaluation.</p>'],
  ['<summary>Kiek laiko skirti kasdien?</summary>', '<summary>How much time daily?</summary>'],
  ['<p>20–30 min pakanka, jei dirbi ciklu „Kurk → Tikrink → Tobulink“.</p>', '<p>20–30 minutes is enough if you run Create → Check → Improve.</p>'],
  ['<summary>Ar tai kursas ar įrankis?</summary>', '<summary>Is this a course or a tool?</summary>'],
  [
    '<p>Tai interaktyvi promptų biblioteka + framework. Gali naudoti iškart (kopijuok → įklijuok → paleisk).</p>',
    '<p>It’s an interactive prompt library + framework. You can use it immediately (copy → paste → run).</p>'
  ],
  ['<summary>Kam tai skirta?</summary>', '<summary>Who is this for?</summary>'],
  [
    '<p>CMO, rinkodaros vadovams, produktų/augimo komandoms ir vadovams, kuriems reikia greito, pakartojamo turinio ciklo.</p>',
    '<p>CMOs, marketing leads, product/growth teams, and leaders who need a fast, repeatable content cadence.</p>'
  ],
  ['<summary>Kuo skiriasi nuo promptų šablonų?</summary>', '<summary>How is this different from prompt templates?</summary>'],
  [
    '<p>Čia turi seką, aiškius laukus, vertinimą ir KPI ciklą – ne vieną vienkartinį tekstą.</p>',
    '<p>You get a sequence, clear fields, evaluation, and a KPI loop — not a one-off output.</p>'
  ],
  ['<summary>Ar tinka B2B SaaS, paslaugoms ir e. komercijai?</summary>', '<summary>Does this work for B2B SaaS, services, and ecommerce?</summary>'],
  [
    '<p>Taip. Tiesiog pakeisk auditoriją, pasiūlymą, kanalus ir metrikas – struktūra išlieka ta pati.</p>',
    '<p>Yes. Swap the audience, offer, channels, and metrics — the structure stays the same.</p>'
  ],
  [
    '<p class="faq-eco-hint">Pilnai metodikai ir vadovų kontekstui naudok <a href="#ecosystem-strip">ekosistemos skiltį</a> – ten suvestos nuorodos.</p>',
    '<p class="faq-eco-hint">For full methodology and executive context, use the <a href="#ecosystem-strip">ecosystem section</a> – all links in one place.</p>'
  ],
  ['aria-label="Meme vieta 3"', 'aria-label="Meme slot 3"'],
  [
    'Meme vieta #3: Kai supranti, kad problema buvo ne DI, o neaiški instrukcija.',
    'Meme slot #3: When you realize AI was not the issue, the vague instruction was.'
  ],
  // Community
  ['<h2 id="community-title">Nori daugiau?<br>Prisijunk prie Telegram grupės.</h2>', '<h2 id="community-title">Want more?<br>Join our US-focused Telegram group.</h2>'],
  ['<p>Bendros diskusijos, patarimai ir naujienos apie promptus ir DI.</p>', '<p>Get playbooks, real examples, and prompt updates for US-market execution.</p>'],
  ['Prisijungti prie Telegram grupės', 'Join Telegram group'],
  // Footer
  ['<h3>Sėkmės rinkodaroje <span aria-hidden="true">🚀</span></h3>', '<h3>Go win your market <span aria-hidden="true">🚀</span></h3>'],
  ['<p>Nepamiršk pakeisti <strong>[auditorija]</strong>, <strong>[galvos skausmas]</strong>, <strong>[unikalus pardavimo pasiūlymas]</strong>, <strong>[kanalas]</strong> ir kitus laukus savo duomenimis</p>', '<p>Remember to replace <strong>[audience]</strong>, <strong>[pain point]</strong>, <strong>[unique selling proposition]</strong>, <strong>[channel]</strong> and other placeholders with your data</p>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Rinkodara</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Marketing</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 10 promptų</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 10 prompts</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Veiksmų fokusas</span>', '<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Action focus</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Potencialūs klientai ir rodikliai</span>', '<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Leads and metrics</span>'],
  ['<p>&copy; 2026 Tomas Staniulis. Mokymų medžiaga. Visos teisės saugomos. <a href="privatumas.html">Privatumas</a></p>', '<p>&copy; 2026 Tomas Staniulis. Training material. All rights reserved. <a href="../en/privacy.html">Privacy</a></p>'],
  ['<h2 id="ecosystem-strip-title">Prompt Anatomy ekosistema</h2>', '<h2 id="ecosystem-strip-title">Prompt Anatomy ecosystem</h2>'],
  [
    '<p class="ecosystem-strip-intro">Viena vieta: metodika, bendruomenė, el. paštas ir susiję rinkiniai.</p>',
    '<p class="ecosystem-strip-intro">One place: methodology, community, email, and related kits.</p>'
  ],
  [
    '<li role="listitem"><a href="https://promptanatomy.app/" target="_blank" rel="noopener noreferrer">Oficiali metodika (promptanatomy.app)</a></li>',
    '<li role="listitem"><a href="https://promptanatomy.app/" target="_blank" rel="noopener noreferrer">Official methodology (promptanatomy.app)</a></li>'
  ],
  [
    '<li role="listitem"><a href="https://t.me/prompt_anatomy" target="_blank" rel="noopener noreferrer">Telegram grupė</a></li>',
    '<li role="listitem"><a href="https://t.me/prompt_anatomy" target="_blank" rel="noopener noreferrer">Telegram group</a></li>'
  ],
  // Toast & hidden
  ['aria-label="Kopijavimo pranešimas"', 'aria-label="Copy notification"'],
  ['<span>Nukopijuota.</span>', '<span>Copied</span>'],
  ['aria-label="Kopijuojamo teksto laukas"', 'aria-label="Text to copy field"'],
  // Lang switcher
  ['aria-label="Kalbos pasirinkimas"', 'aria-label="Language selection"'],
  ['aria-label="Perjungti į lietuvių kalbą"', 'aria-label="Switch to Lithuanian"'],
  [
    "var privacyHref = (/\\/lt(?:\\/|$)/.test(path) || /\\/en(?:\\/|$)/.test(path)) ? '../privatumas.html' : 'privatumas.html';",
    "var privacyHref = locale === 'en' ? '../en/privacy.html' : ((/\\/lt(?:\\/|$)/.test(path) || /\\/en(?:\\/|$)/.test(path)) ? '../privatumas.html' : 'privatumas.html');"
  ],
  // EN JS messaging refinements
  ["uiText('Klaida: trūksta parametrų', 'Error: missing parameters')", "uiText('Klaida: trūksta parametrų', 'Something went wrong. Try copying again.')"],
  ["uiText('Promptas nerastas', 'Prompt not found')", "uiText('Promptas nerastas', 'Prompt not available. Try another card.')"],
  ["uiText('Promptas tuščias', 'Prompt is empty')", "uiText('Promptas tuščias', 'Prompt has no text yet. Try another card.')"],
  ["uiText('Kopijavimas nepavyko', 'Copy failed')", "uiText('Kopijavimas nepavyko', 'Copy did not work. Select the text and use Ctrl+C (or Cmd+C).')"],
  ["uiText('Nepavyko. Pažymėk tekstą ranka ir nukopijuok.', 'Failed. Select the text manually and copy.')", "uiText('Nepavyko. Pažymėk tekstą ranka ir nukopijuok.', 'Copy did not work. Select the text and use Ctrl+C (or Cmd+C).')"],
  ["uiText('Nukopijuota!', 'Copied!')", "uiText('Nukopijuota!', 'Copied')"],
  ["uiText('Klaida: ', 'Error: ') + errorMessage", "uiText('Klaida: ', 'Copy issue: ') + errorMessage"],
  ['* Kopijuoti promptą į darbinių atmintinę', '* Copy prompt to clipboard'],
  ["'Kopijuoti promptą ' + n + ' į darbinių atmintinę'", "'Copy prompt ' + n + ' to clipboard'"],
  ['neutralises', 'neutralizes'],
  ['control centre', 'control center'],
  ['Control centre', 'Control center']
  ,["ts.textContent = 'Copied.'", "ts.textContent = 'Copied'"]
];

function buildMetaReplacementsFromIndex(html) {
  const ltBodies = extractLtPreBodiesFromHtml(html);
  return ltBodies.map((lt, i) => {
    const en = EN_PROMPT_BODIES[i];
    if (typeof en !== 'string') {
      throw new Error('Missing EN prompt body at index ' + i);
    }
    return [lt, en];
  });
}

function getEnReplacementsForHtml(html) {
  return [
    ...EN_REPLACEMENTS_PREFIX,
    ...buildMetaReplacementsFromIndex(html),
    ...EN_REPLACEMENTS_SUFFIX
  ];
}

function applyEnReplacements(html) {
  const list = getEnReplacementsForHtml(html);
  // Normalize line endings so template matches are stable across OS/checkout settings.
  let out = String(html).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const missingCritical = [];
  for (const [from, to] of list) {
    const hits = countOccurrences(out, from);
    if (hits === 0 && from.includes('<') && from.length > 24) {
      missingCritical.push(from.slice(0, 80));
    }
    out = out.split(from).join(to);
  }
  if (missingCritical.length > 0) {
    throw new Error(
      `EN replacement safety check failed. Missing critical templates: ${missingCritical.length}\n` +
        missingCritical.join('\n')
    );
  }
  return out;
}

function assertEnLocaleAdditions(html) {
  if (html.indexOf('id="cmo-context"') === -1) {
    throw new Error('EN locale: missing #cmo-context section');
  }
  for (let i = 1; i <= 10; i++) {
    if (html.indexOf('id="expected' + i + '"') === -1) {
      throw new Error('EN locale: missing prompt-expected slot for prompt ' + i);
    }
  }
  if (html.indexOf('RULES (non-negotiable)') === -1) {
    throw new Error('EN locale: missing RULES (non-negotiable) literal in injected script');
  }
  if (html.indexOf('window.__CMO_COMPILE') === -1) {
    throw new Error('EN locale: copyPrompt was not patched to call window.__CMO_COMPILE');
  }
  if (html.indexOf('id="cmo-scenarios"') === -1) {
    throw new Error('EN locale: missing #cmo-scenarios section');
  }
  if (html.indexOf('id="cmo-safety"') === -1) {
    throw new Error('EN locale: missing #cmo-safety section');
  }
  if (html.indexOf('cmo-safety-reviewer-prompt') === -1) {
    throw new Error('EN locale: missing safety reviewer prompt block');
  }
}

function assertLtLocaleAdditions(html) {
  if (html.indexOf('id="cmo-context"') === -1) {
    throw new Error('LT locale: missing #cmo-context section');
  }
  for (let i = 1; i <= 10; i++) {
    if (html.indexOf('id="expected' + i + '"') === -1) {
      throw new Error('LT locale: missing prompt-expected slot for prompt ' + i);
    }
  }
  if (html.indexOf('TAISYKLĖS (privalomos)') === -1) {
    throw new Error('LT locale: missing TAISYKLĖS (privalomos) in injected script');
  }
  if (html.indexOf('window.__CMO_COMPILE') === -1) {
    throw new Error('LT locale: copyPrompt was not patched to call window.__CMO_COMPILE');
  }
  if (html.indexOf('id="cmo-scenarios"') === -1) {
    throw new Error('LT locale: missing #cmo-scenarios section');
  }
  if (html.indexOf('id="cmo-safety"') === -1) {
    throw new Error('LT locale: missing #cmo-safety section');
  }
}

function buildLocale(locale) {
  let html = readIndex();
  html = html.replace(/<html lang="lt">/, '<html lang="' + locale + '">');
  if (locale === 'en') {
    html = applyEnReplacements(html);
    html = injectEnPreBodies(html);
    html = injectEnContextBlock(html);
    html = injectEnExpectedBullets(html);
    html = injectProviderRows(html);
    html = injectTrustBlocksBeforeNextSteps(html, 'en');
    html = patchEnCopyPromptHook(html);
    html = injectEnContextScript(html);
    html = injectScenariosTabScript(html, 'en');
  } else if (locale === 'lt') {
    html = injectLtContextBlock(html);
    html = injectLtExpectedBullets(html);
    html = injectProviderRows(html);
    html = injectTrustBlocksBeforeNextSteps(html, 'lt');
    html = patchLtCopyPromptHook(html);
    html = injectLtContextScript(html);
    html = injectScenariosTabScript(html, 'lt');
  }
  html = insertSeo(html, locale);
  html = fixAssetPaths(html);
  html = injectFooterSuite(html, locale);
  if (locale === 'en') {
    assertEnLocaleAdditions(html);
  }
  if (locale === 'lt') {
    assertLtLocaleAdditions(html);
  }
  return html;
}

function assertPrivacySeo() {
  const privacyChecks = [
    {
      locale: 'lt',
      filePath: path.join(ROOT, 'lt', 'privatumas.html'),
      canonical: makeAbsoluteUrl('/lt/privatumas.html'),
      alternate: makeAbsoluteUrl('/en/privacy.html')
    },
    {
      locale: 'en',
      filePath: path.join(ROOT, 'en', 'privacy.html'),
      canonical: makeAbsoluteUrl('/en/privacy.html'),
      alternate: makeAbsoluteUrl('/lt/privatumas.html')
    }
  ];

  for (const check of privacyChecks) {
    if (!fs.existsSync(check.filePath)) {
      throw new Error(`Missing privacy page: ${check.filePath}`);
    }
    const html = fs.readFileSync(check.filePath, 'utf8');
    if (!html.includes(`<link rel="canonical" href="${check.canonical}">`)) {
      throw new Error(`Privacy ${check.locale}: canonical mismatch`);
    }
    if (!html.includes(`<link rel="alternate" hreflang="${check.locale}" href="${check.canonical}">`)) {
      throw new Error(`Privacy ${check.locale}: self hreflang mismatch`);
    }
    if (!html.includes(`<link rel="alternate" hreflang="${check.locale === 'lt' ? 'en' : 'lt'}" href="${check.alternate}">`)) {
      throw new Error(`Privacy ${check.locale}: alternate hreflang mismatch`);
    }
  }
}

function main() {
  writeEnPromptInlineJs(EN_PROMPT_BODIES);
  ensureDir(path.join(ROOT, 'lt'));
  ensureDir(path.join(ROOT, 'en'));
  const ltHtml = buildLocale('lt');
  const enHtml = buildLocale('en');
  assertLocaleStructure(ltHtml, 'lt');
  assertLocaleStructure(enHtml, 'en');
  fs.writeFileSync(path.join(ROOT, 'lt', 'index.html'), ltHtml, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'en', 'index.html'), enHtml, 'utf8');
  assertPrivacySeo();
  console.log('Built lt/index.html, en/index.html, js/en-prompt-bodies-inline.js (+ privacy SEO checks)');
}

main();
