/**
 * Build locale pages: generates lt/index.html and en/index.html from root index.html.
 * Also writes js/en-prompt-bodies-inline.js from data/en-prompt-bodies.json (single EN source).
 * LT = Lithuanian (default), EN = English (replacements applied; META LT taken from index <pre>).
 * Run: node scripts/build-locale-pages.js
 * Optional overrides: BASE_PATH and SITE_ORIGIN (defaults: CMO USA site at https://promptanatomy.space/, root path).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { readBrandSeo } = require('./load-brand-config');
const { writeGeoSurfaces } = require('./geo-surfaces');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const DEFAULT_BASE_PATH = '';
const DEFAULT_SITE_ORIGIN = 'https://promptanatomy.space';
const BASE_PATH = (
  process.env.BASE_PATH !== undefined && process.env.BASE_PATH !== null
    ? String(process.env.BASE_PATH)
    : DEFAULT_BASE_PATH
).replace(/\/?$/, '');
const SITE_ORIGIN = (
  process.env.SITE_ORIGIN !== undefined && process.env.SITE_ORIGIN !== null
    ? String(process.env.SITE_ORIGIN)
    : DEFAULT_SITE_ORIGIN
).replace(/\/$/, '');

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

function detectExistingEol(filePath) {
  if (!fs.existsSync(filePath)) return '\n';
  const existing = fs.readFileSync(filePath, 'utf8');
  const crlf = (existing.match(/\r\n/g) || []).length;
  const totalLf = (existing.match(/\n/g) || []).length;
  const lf = totalLf - crlf;
  return crlf > lf ? '\r\n' : '\n';
}

function normalizeEol(content, eol) {
  return String(content).replace(/\r\n|\r|\n/g, eol);
}

function canonicalGeneratedText(content) {
  return String(content).replace(/\s+/g, '');
}

function writeTextFileStable(filePath, content) {
  const eol = detectExistingEol(filePath);
  const normalized = normalizeEol(content, eol);
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf8');
    if (
      existing === normalized ||
      canonicalGeneratedText(existing) === canonicalGeneratedText(normalized)
    ) {
      return;
    }
  }
  fs.writeFileSync(filePath, normalized, 'utf8');
}

const DATA_DIR = path.join(ROOT, 'data');
const EN_PROMPT_BODIES_PATH = path.join(DATA_DIR, 'en-prompt-bodies.json');
const EN_PROMPT_EXPECTED_PATH = path.join(DATA_DIR, 'en-prompt-expected.json');
const EN_SCENARIOS_PATH = path.join(DATA_DIR, 'en-scenarios.json');
const LT_PROMPT_EXPECTED_PATH = path.join(DATA_DIR, 'lt-prompt-expected.json');
const LT_SCENARIOS_PATH = path.join(DATA_DIR, 'lt-scenarios.json');
const COLLAPSIBLE_SUMMARIES_PATH = path.join(DATA_DIR, 'cmo-collapsible-summaries.json');
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

function loadCollapsibleSummaries() {
  const raw = fs.readFileSync(COLLAPSIBLE_SUMMARIES_PATH, 'utf8');
  const data = JSON.parse(raw);
  for (const locale of ['lt', 'en']) {
    if (!data[locale] || typeof data[locale] !== 'object') {
      throw new Error(`cmo-collapsible-summaries.json: missing "${locale}" object`);
    }
    for (let n = 4; n <= 10; n++) {
      const key = String(n);
      if (!data[locale][key] || !String(data[locale][key]).trim()) {
        throw new Error(`cmo-collapsible-summaries.json: missing ${locale}.${key}`);
      }
    }
  }
  return data;
}

loadCollapsibleSummaries(); // keep JSON SSOT validated (Phase A free page has 0 collapsibles)
/** Free interactive spine on the page (Pro data SSOT still has all 10). */
const FREE_SPINE_IDS = [1, 2, 3, 5];
const FREE_TEASER_IDS = [4, 6, 7, 8, 9, 10];

/** Phase A: no collapsible prompt cards; Pro catalog uses data-teaser-prompt rows. */
function applyCollapsibleSummaries(html) {
  return html;
}

function assertCollapsiblePromptContract(html, label) {
  const detailsCount = (html.match(/class="[^"]*\bprompt-details\b[^"]*"/g) || []).length;
  if (detailsCount !== 0) {
    throw new Error(`${label}: expected 0 .prompt-details, found ${detailsCount}`);
  }
  const collapsibleCount = (html.match(/class="[^"]*\bprompt--collapsible\b[^"]*"/g) || []).length;
  if (collapsibleCount !== 0) {
    throw new Error(`${label}: expected 0 .prompt--collapsible, found ${collapsibleCount}`);
  }
  for (const n of FREE_SPINE_IDS) {
    if (!html.includes('id="prompt' + n + '"')) {
      throw new Error(`${label}: missing free spine <pre id="prompt${n}">`);
    }
  }
  if (!html.includes('id="pro-contents"')) {
    throw new Error(`${label}: missing #pro-contents catalog`);
  }
  if (html.includes('prompt--teaser')) {
    throw new Error(`${label}: faux .prompt--teaser cards are not allowed (use #pro-contents)`);
  }
  for (const n of FREE_TEASER_IDS) {
    if (!html.includes('data-teaser-prompt="' + n + '"')) {
      throw new Error(`${label}: missing catalog data-teaser-prompt="${n}"`);
    }
    if (html.includes('id="prompt' + n + '"')) {
      throw new Error(`${label}: Pro catalog prompt ${n} must not expose interactive #prompt${n}`);
    }
  }
  if (!html.includes('openFromHash')) {
    throw new Error(`${label}: missing openFromHash (collapsible hash deep-link)`);
  }
}

/** LT <pre> inner text from free spine prompts (ids 1,2,3,5) for EN string replace pairs. */
function extractLtPreBodiesFromHtml(html) {
  return FREE_SPINE_IDS.map((i) => {
    const re = new RegExp(`<pre class="code-text" id="prompt${i}">([\\s\\S]*?)</pre>`, '');
    const m = html.match(re);
    if (!m) {
      throw new Error(`extractLtPreBodiesFromHtml: missing <pre id="prompt${i}">`);
    }
    return { id: i, lt: m[1].replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd() };
  });
}

function writeEnPromptInlineJs(enBodies) {
  ensureDir(JS_DIR);
  const content =
    "'use strict';\nwindow.__EN_PROMPT_PRE = " +
    JSON.stringify(enBodies) +
    ';\n';
  writeTextFileStable(EN_PROMPT_INLINE_JS_PATH, content);
}

const EN_PROMPT_BODIES = loadEnPromptBodies();
const EN_PROMPT_EXPECTED = loadEnPromptExpected();
const EN_SCENARIOS = loadEnScenarios();
const LT_PROMPT_EXPECTED = loadLtPromptExpected();
const LT_SCENARIOS = loadLtScenarios();
const PKG_VERSION = readPackageVersion();

function injectEnPreBodies(html) {
  let out = html;
  for (const i of FREE_SPINE_IDS) {
    const body = EN_PROMPT_BODIES[i - 1];
    if (typeof body !== 'string') {
      throw new Error('Missing EN prompt body at index ' + (i - 1));
    }
    const re = new RegExp(`(<pre class="code-text" id="prompt${i}">)([\\s\\S]*?)(</pre>)`, '');
    if (!re.test(out)) {
      throw new Error('injectEnPreBodies: missing <pre id="prompt' + i + '">');
    }
    out = out.replace(re, `$1${body}$3`);
  }
  return out;
}

const EN_CONTEXT_BLOCK_HTML =
  '<section class="cmo-context" id="cmo-context" aria-labelledby="cmo-context-title">\n' +
  '            <h2 id="cmo-context-title" class="cmo-context-title">Marketing context (one block, every copy)</h2>\n' +
  '            <p class="cmo-context-intro">Optional. Fills prepend to every Copy. Session-only.</p>\n' +
  '            <details class="cmo-context-details" id="cmo-context-details">\n' +
  '                <summary>Set marketing context</summary>\n' +
  '            <div class="cmo-context-form" id="cmoContextForm">\n' +
  '                <fieldset class="cmo-context-fields">\n' +
  '                    <legend class="cmo-context-legend">Marketing context fields</legend>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxAudience">Audience</label>\n' +
  '                        <input type="text" id="cmoCtxAudience" name="audience" maxlength="160" placeholder="e.g. US B2B marketing leaders, 50-500 FTE">\n' +
  '                    </div>\n' +
  '                    <div class="cmo-context-row">\n' +
  '                        <label for="cmoCtxOffer">Offer / USP</label>\n' +
  '                        <input type="text" id="cmoCtxOffer" name="offer" maxlength="160" placeholder="e.g. weekly LinkedIn + email cadence for B2B leads">\n' +
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
            '            </details>\n' +
  '        </section>\n\n';

function injectEnContextBlock(html) {
  const anchor = '<!-- CMO_CONTEXT -->';
  if (html.indexOf(anchor) === -1) {
    throw new Error('injectEnContextBlock: anchor "<!-- CMO_CONTEXT -->" not found');
  }
  return html.replace(anchor, EN_CONTEXT_BLOCK_HTML);
}

function injectEnExpectedBullets(html) {
  let out = html;
  for (const i of FREE_SPINE_IDS) {
    const bullets = EN_PROMPT_EXPECTED[i - 1]
      .map((b) => '                        <li>' + escapeHtml(b) + '</li>')
      .join('\n');
    const openAttr = '';
    const block =
      '\n                <details class="faq-item prompt-expected-details"' + openAttr + ' id="expected-details-' + i + '">\n' +
      '                    <summary>Expected output</summary>\n' +
      '                <ul class="prompt-expected" id="expected' + i + '" aria-label="Expected output for prompt ' + i + '">\n' +
      '                    <li class="prompt-expected-title">Expected output</li>\n' +
      bullets +
      '\n                </ul>\n' +
      '                </details>';
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

const SAFETY_ANCHOR = '        <!-- CMO_SAFETY -->';
const SCENARIOS_ANCHOR = '        <!-- CMO_SCENARIOS -->';

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
    '        <details class="cmo-scenarios-details">\n' +
    '            <summary class="cmo-scenarios-summary">' +
    escapeHtml(labels.title) +
    '</summary>\n' +
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
    '        </section>\n' +
    '        </details>\n\n'
  );
}

function buildSafetySection(locale) {
  const reviewerText = locale === 'en' ? EN_SAFETY_REVIEWER_TEXT : LT_SAFETY_REVIEWER_TEXT;
  const copyLabel =
    locale === 'en' ? 'Copy reviewer prompt' : 'Kopijuoti recenzento promptą';
  const reviewerSummary =
    locale === 'en' ? 'Reviewer prompt (copy)' : 'Recenzento promptas (kopijuoti)';
  const title = locale === 'en' ? 'Pre-publish safety' : 'Tikrinti prieš publikuojant';
  const intro =
    locale === 'en'
      ? 'Run a risk review before you publish.'
      : 'Paleisk šį recenzento promptą prieš publikuodamas rinkodaros turinį, sukurtą su DI. Kopijuojant įtraukiamas sesijos kontekstas ir taisyklės, jei nustatyta.';
  const detailsSummary =
    locale === 'en' ? 'Open safety checks' : reviewerSummary;
  const checksTitle = locale === 'en' ? 'Quick checks' : 'Greita kontrolė';
  const checks =
    locale === 'en'
      ? ['Facts verified', 'Brand/tone', 'Legal/trust', 'CTA + owner']
      : ['Faktai patvirtinti', 'Prekės ženklas / tonas', 'Teisė / pasitikėjimas', 'CTA + savininkas'];
  const checksLis = checks.map(function (c) {
    return '                    <li>' + escapeHtml(c) + '</li>';
  }).join('\n');
  // EN: one collapsed details for prompt + checks. LT freeze: keep prior nested shape (reviewer details only).
  if (locale === 'en') {
    return (
      '        <section class="cmo-safety" id="cmo-safety" aria-labelledby="cmo-safety-title">\n' +
      '            <h2 id="cmo-safety-title" class="cmo-safety-title">' +
      escapeHtml(title) +
      '</h2>\n' +
      '            <p class="cmo-safety-intro">' +
      escapeHtml(intro) +
      '</p>\n' +
      '            <details class="faq-item cmo-safety-reviewer-details" id="cmo-safety-details">\n' +
      '                <summary>' +
      escapeHtml(detailsSummary) +
      '</summary>\n' +
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
      '            </details>\n' +
      '        </section>\n\n'
    );
  }
  return (
    '        <section class="cmo-safety" id="cmo-safety" aria-labelledby="cmo-safety-title">\n' +
    '            <h2 id="cmo-safety-title" class="cmo-safety-title">' +
    escapeHtml(title) +
    '</h2>\n' +
    '            <p class="cmo-safety-intro">' +
    escapeHtml(intro) +
    '</p>\n' +
    '            <div class="cmo-safety-copy">\n' +
    '                <details class="faq-item cmo-safety-reviewer-details">\n' +
    '                    <summary>' +
    escapeHtml(reviewerSummary) +
    '</summary>\n' +
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
    '                </details>\n' +
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

function injectSafetySection(html, locale) {
  if (html.indexOf(SAFETY_ANCHOR) === -1) {
    throw new Error('injectSafetySection: anchor <!-- CMO_SAFETY --> not found');
  }
  return html.replace(SAFETY_ANCHOR, buildSafetySection(locale));
}

function injectScenariosSection(html, locale) {
  if (html.indexOf(SCENARIOS_ANCHOR) === -1) {
    throw new Error('injectScenariosSection: anchor <!-- CMO_SCENARIOS --> not found');
  }
  return html.replace(SCENARIOS_ANCHOR, buildScenarioStripSection(locale));
}

const LT_CONTEXT_BLOCK_HTML =
  '<section class="cmo-context" id="cmo-context" aria-labelledby="cmo-context-title">\n' +
  '            <h2 id="cmo-context-title" class="cmo-context-title">Rinkodaros kontekstas (vienas blokas, kiekvienam kopijavimui)</h2>\n' +
  '            <p class="cmo-context-intro">Neprivaloma: gali pradėti ir tuščiais laukais. Jei užpildai vieną kartą, penkios reikšmės ir taisyklės žemiau pridedamos kiekvieną kartą paspaudus <strong>Kopijuoti promptą</strong>. Saugojama tik šios naršyklės sesijoje.</p>\n' +
  '            <details class="cmo-context-details" id="cmo-context-details">\n' +
  '                <summary>Neprivaloma: rinkodaros kontekstas (pagerina kiekvieną kopijavimą)</summary>\n' +
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
            '            </details>\n' +
  '        </section>\n\n';

function injectLtContextBlock(html) {
  const anchor = '<!-- CMO_CONTEXT -->';
  if (html.indexOf(anchor) === -1) {
    throw new Error('injectLtContextBlock: anchor "<!-- CMO_CONTEXT -->" not found');
  }
  return html.replace(anchor, LT_CONTEXT_BLOCK_HTML);
}

function injectLtExpectedBullets(html) {
  let out = html;
  for (const i of FREE_SPINE_IDS) {
    const bullets = LT_PROMPT_EXPECTED[i - 1]
      .map((b) => '                        <li>' + escapeHtml(b) + '</li>')
      .join('\n');
    const openAttr = i === 1 ? ' open' : '';
    const block =
      '\n                <details class="faq-item prompt-expected-details"' + openAttr + ' id="expected-details-' + i + '">\n' +
      '                    <summary>Tikėtinas atsakymas</summary>\n' +
      '                <ul class="prompt-expected" id="expected' +
      i +
      '" aria-label="Tikėtinas atsakymas promptui ' +
      i +
      '">\n' +
      '                    <li class="prompt-expected-title">Tikėtinas atsakymas</li>\n' +
      bullets +
      '\n                </ul>\n' +
      '                </details>';
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

/** Provider hub removed from free path (path cut); do not inject per-prompt provider rows. */
function injectProviderRows(html) {
  return html;
}

function injectFooterSuite(html, locale) {
  const leaderUrl = 'https://ditreneris.github.io/leader/en/';
  const cross =
    locale === 'en'
      ? 'Related sister kit: <a href="' +
        leaderUrl +
        '" target="_blank" rel="noopener noreferrer">Prompt Anatomy Leader</a> (CEO/COO)'
      : 'Reikia CEO/COO rinkinio? <a href="' +
        leaderUrl +
        '" target="_blank" rel="noopener noreferrer">Atidaryti Prompt Anatomy Leader</a>';
  const badge =
    locale === 'en'
      ? 'Content AI System v' + PKG_VERSION
      : 'Turinio DI sistema v' + PKG_VERSION;
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

/* ----------------------------------------------------------------------- */
/* EN-only paid PDF storefront (#pdf-storefront).                           */
/*                                                                          */
/* Read from config/sot.json. Injected only when locale === 'en' and        */
/* MIRROR_NOTE !== '1'. The mirror (GitHub Pages) build sets MIRROR_NOTE=1  */
/* in .github/workflows/deploy.yml so the section is omitted there because  */
/* checkout/webhook/downloads only exist on promptanatomy.space.            */
/* ----------------------------------------------------------------------- */
const SOT_PATH = path.join(ROOT, 'config', 'sot.json');
const MIRROR_NOTE = process.env.MIRROR_NOTE === '1';
/** Set during main() for EN JSON-LD @graph injection */
let geoJsonLdInject = null;

function loadSot() {
  if (!fs.existsSync(SOT_PATH)) {
    throw new Error('config/sot.json missing - cannot build paid storefront');
  }
  const raw = fs.readFileSync(SOT_PATH, 'utf8');
  const sot = JSON.parse(raw);
  if (!sot || !sot.commerce || !Array.isArray(sot.commerce.products)) {
    throw new Error('config/sot.json: commerce.products must be a non-empty array');
  }
  if (sot.commerce.products.length !== 3) {
    throw new Error('config/sot.json: commerce.products must contain exactly 3 entries (starter, pro, bundle)');
  }
  for (const p of sot.commerce.products) {
    const need = ['id', 'name', 'subtitle', 'priceUsd', 'pages', 'format', 'bullets'];
    for (const k of need) {
      if (p[k] === undefined || p[k] === null) {
        throw new Error('config/sot.json product[' + p.id + '] missing key: ' + k);
      }
    }
    if (!p.coverPng && !p.coverSvg) {
      throw new Error('config/sot.json product[' + p.id + '] missing coverPng or coverSvg');
    }
  }
  return sot;
}

function assertRequireStripeLinks(sot) {
  if (process.env.REQUIRE_STRIPE_LINKS !== '1') return;
  if (sot.commerce.allowPlaceholderCheckout === true) {
    throw new Error(
      'REQUIRE_STRIPE_LINKS=1: set commerce.allowPlaceholderCheckout to false before production deploy'
    );
  }
  for (const id of ['starter', 'pro', 'bundle']) {
    const link =
      sot.commerce.stripePaymentLinks && sot.commerce.stripePaymentLinks[id]
        ? String(sot.commerce.stripePaymentLinks[id]).trim()
        : '';
    if (!/^https:\/\/buy\.stripe\.com\//.test(link)) {
      throw new Error('REQUIRE_STRIPE_LINKS=1: missing live Payment Link for ' + id);
    }
  }
}

function resolveCheckoutHref(sot, productId) {
  const allowPlaceholder = sot.commerce.allowPlaceholderCheckout === true;
  const liveLink =
    sot.commerce.stripePaymentLinks &&
    typeof sot.commerce.stripePaymentLinks[productId] === 'string'
      ? sot.commerce.stripePaymentLinks[productId].trim()
      : '';
  if (liveLink && /^https:\/\/buy\.stripe\.com\//.test(liveLink)) {
    return { href: liveLink, isPlaceholder: false };
  }
  if (allowPlaceholder) {
    const placeholder =
      typeof sot.commerce.placeholderHref === 'string' && sot.commerce.placeholderHref.trim()
        ? sot.commerce.placeholderHref.trim()
        : '/coming-soon.html';
    return { href: placeholder, isPlaceholder: true };
  }
  throw new Error(
    'sot.commerce.stripePaymentLinks.' +
      productId +
      ' is empty and allowPlaceholderCheckout is false. Either set the live Payment Link or enable placeholder mode.'
  );
}

function buildPdfCard(sot, product) {
  const route = resolveCheckoutHref(sot, product.id);
  const priceText = '$' + Number(product.priceUsd).toFixed(2);
  const compareText =
    product.compareAtUsd != null
      ? '<span class="pdf-card-was">' +
        (product.id === 'bundle' ? 'separately $' : 'was $') +
        Number(product.compareAtUsd).toFixed(2) +
        '</span>'
      : '';
  const bullets = product.bullets
    .map((b) => '                    <li>' + escapeHtml(b) + '</li>')
    .join('\n');
  const placeholderBadge = route.isPlaceholder
    ? '\n                <p class="pdf-card-coming" role="note">Live checkout opens soon. Add your email and we will notify you.</p>'
    : '';
  const ctaLabel = route.isPlaceholder
    ? 'Notify me when available'
    : product.ctaLabel || ('Get ' + product.tierTag + ' kit · ' + priceText);
  const coverSrc = '../' + (product.coverPng || product.coverSvg);
  const recommendedBadge =
    product.recommended === true
      ? '\n                <p class="pdf-card-badge" role="note">Best for teams</p>'
      : '';
  const tierBadge = product.tierTag
    ? '\n                    <p class="pdf-card-tier" role="note">' + escapeHtml(product.tierTag) + '</p>'
    : '';
  const previewPngs = Array.isArray(product.previewPngs) ? product.previewPngs : [];
  const previewFigures =
    previewPngs.length > 0
      ? '\n                <figure class="pdf-card-previews" aria-label="Watermarked preview pages">\n' +
        previewPngs
          .map(function (src, idx) {
            return (
              '                    <img src="../' +
              escapeHtml(src) +
              '" alt="' +
              escapeHtml(product.name + ' preview page ' + (idx + 1) + ' (watermarked)') +
              '" loading="lazy" decoding="async" width="72" height="93" class="pdf-card-preview-thumb">'
            );
          })
          .join('\n') +
        '\n                </figure>'
      : '';
  return (
    '            <article class="pdf-card" id="pdf-card-' +
    escapeHtml(product.id) +
    '" aria-labelledby="pdf-card-title-' +
    escapeHtml(product.id) +
    '">\n' +
    '                <figure class="pdf-card-cover">\n' +
    '                    <img src="' +
    coverSrc +
    '" alt="' +
    escapeHtml(product.name + ' cover, ' + product.pages + ' pages, English') +
    '" loading="lazy" decoding="async" width="220" height="285">\n' +
    '                </figure>\n' +
    previewFigures +
    '                <div class="pdf-card-body">\n' +
    recommendedBadge +
    tierBadge +
    '                    <h3 id="pdf-card-title-' +
    escapeHtml(product.id) +
    '" class="pdf-card-title">' +
    escapeHtml(product.name) +
    '</h3>\n' +
    '                    <p class="pdf-card-subtitle">' +
    escapeHtml(product.subtitle) +
    '</p>\n' +
    '                    <p class="pdf-card-price"><span class="pdf-card-amount">' +
    escapeHtml(priceText) +
    '</span> ' +
    compareText +
    '</p>\n' +
    '                    <ul class="pdf-card-bullets" role="list">\n' +
    bullets +
    '\n' +
    '                    </ul>\n' +
    '                    <p class="pdf-card-meta">' +
    escapeHtml(product.pages + ' pages \u00b7 ' + product.format) +
    '</p>' +
    placeholderBadge +
    '\n' +
    '                    <a class="btn pdf-card-cta" href="' +
    escapeHtml(route.href) +
    '"' +
    (route.isPlaceholder ? '' : ' target="_blank" rel="noopener noreferrer"') +
    ' data-product-id="' +
    escapeHtml(product.id) +
    '" data-placeholder="' +
    (route.isPlaceholder ? 'true' : 'false') +
    '" aria-label="' +
    escapeHtml(ctaLabel + ' - ' + product.name) +
    '">' +
    escapeHtml(ctaLabel) +
    '</a>\n' +
    '                </div>\n' +
    '            </article>\n'
  );
}

function buildPdfStorefrontSection(sot) {
  const cards = sot.commerce.products.map((p) => buildPdfCard(sot, p)).join('');
  // Path cut: comparison table not rendered (SOT comparisonTable kept for later).
  const head = sot.commerce.storefrontHead || {};
  const eyebrow = escapeHtml(head.eyebrow || 'Printable kits');
  const title = escapeHtml(head.title || 'Take the kit offline');
  const lead = escapeHtml(
    head.lead ||
      'Printable PDFs for marketing leaders. Same prompts as the free library, formatted for offline planning.'
  );
  const outcomeLine = head.outcomeLine
    ? '                <p class="pdf-storefront-outcome">' + escapeHtml(head.outcomeLine) + '</p>\n'
    : '';
  const buyerFaq = Array.isArray(sot.buyerFaq)
    ? sot.buyerFaq
        .map(
          (item) =>
            '                <details class="faq-item">\n' +
            '                    <summary>' +
            escapeHtml(item.q) +
            '</summary>\n' +
            '                    <p>' +
            escapeHtml(item.a) +
            '</p>\n' +
            '                </details>'
        )
        .join('\n')
    : '';
  const delivery = escapeHtml(
    sot.commerce.deliveryPromise || 'Email delivery within 5 minutes.'
  );
  const faqDetails = buyerFaq
    ? '            <details class="pdf-storefront-details" open>\n' +
      '                <summary class="pdf-storefront-details-summary">Buyer FAQ &amp; delivery details</summary>\n' +
      '                <p class="pdf-storefront-delivery"><strong>Delivery:</strong> ' +
      delivery +
      '</p>\n' +
      '            <div class="pdf-storefront-faq" aria-labelledby="pdf-storefront-faq-title">\n' +
      '                <h3 id="pdf-storefront-faq-title" class="pdf-storefront-faq-title">Buyer FAQ</h3>\n' +
      buyerFaq +
      '\n' +
      '            </div>\n' +
      '            </details>\n'
    : '';

  return (
    '        <section class="upgrade-section pdf-storefront no-print" id="pdf-storefront" aria-labelledby="pdf-storefront-title">\n' +
    '            <div class="pdf-storefront-teaser">\n' +
    '                <p class="pdf-storefront-eyebrow">' +
    eyebrow +
    '</p>\n' +
    '                <h2 id="pdf-storefront-title">' +
    title +
    '</h2>\n' +
    '                <p class="pdf-storefront-lead">' +
    lead +
    '</p>\n' +
    outcomeLine +
    '                <p class="pdf-storefront-delivery"><strong>Delivery:</strong> ' +
    delivery +
    '</p>\n' +
    '            </div>\n' +
    '            <div class="pdf-storefront-grid" role="list">\n' +
    cards +
    '            </div>\n' +
    faqDetails +
    '            <p class="pdf-storefront-trust">Secure checkout via Stripe. Receipts and downloads delivered by email. <a href="../terms.html#paid-pdf-license">Team license</a> \u00b7 <a href="../en/privacy.html">Privacy</a>.</p>\n' +
    '        </section>\n\n'
  );
}

function injectPdfStorefront(html, locale) {
  if (locale !== 'en') return html;
  if (MIRROR_NOTE) {
    console.log('[build] MIRROR_NOTE=1 - skipping #pdf-storefront on EN build (mirror target)');
    return html;
  }
  const sot = loadSot();
  if (sot.commerce.scope !== 'en-only') {
    throw new Error('config/sot.json: commerce.scope must be "en-only" for this repo');
  }
  const anchor = '<section class="upgrade-section" id="faq"';
  if (html.indexOf(anchor) === -1) {
    throw new Error('injectPdfStorefront: anchor for #faq not found');
  }
  const block = buildPdfStorefrontSection(sot);
  return html.replace(anchor, block + '        ' + anchor);
}

/* EN-only free Creative brief builder (#creative-brief). Ships on mirror too. */
function buildCreativeBriefSelect(id, fieldKey, label, options, firstEmptyLabel) {
  const opts = [
    '                        <option value="">' + escapeHtml(firstEmptyLabel) + '</option>'
  ].concat(
    options.map(function (opt) {
      return '                        <option value="' + escapeHtml(opt) + '">' + escapeHtml(opt) + '</option>';
    })
  );
  /* name uses cb- prefix to avoid form-dup-name vs #cmo-context fields */
  const nameAttr = 'cb-' + fieldKey;
  return (
    '                    <div class="cb-field">\n' +
    '                        <label for="' +
    id +
    '">' +
    escapeHtml(label) +
    '</label>\n' +
    '                        <select id="' +
    id +
    '" name="' +
    nameAttr +
    '" data-cb-field="' +
    fieldKey +
    '">\n' +
    opts.join('\n') +
    '\n                        </select>\n' +
    '                    </div>\n'
  );
}

function buildCreativeBriefTextField(id, fieldKey, label, placeholder, multiline) {
  const nameAttr = 'cb-' + fieldKey;
  const tag = multiline
    ? '                        <textarea id="' +
      id +
      '" name="' +
      nameAttr +
      '" data-cb-field="' +
      fieldKey +
      '" rows="2" maxlength="280" placeholder="' +
      escapeHtml(placeholder) +
      '"></textarea>\n'
    : '                        <input type="text" id="' +
      id +
      '" name="' +
      nameAttr +
      '" data-cb-field="' +
      fieldKey +
      '" maxlength="160" placeholder="' +
      escapeHtml(placeholder) +
      '">\n';
  return (
    '                    <div class="cb-field">\n' +
    '                        <label for="' +
    id +
    '">' +
    escapeHtml(label) +
    '</label>\n' +
    tag +
    '                    </div>\n'
  );
}

function buildCreativeBriefSection(sot, options) {
  const opts = options && typeof options === 'object' ? options : {};
  const isMirror = !!opts.mirror;
  const copy =
    sot.copy && sot.copy.creativeBrief && typeof sot.copy.creativeBrief === 'object'
      ? sot.copy.creativeBrief
      : {};
  const title = typeof copy.title === 'string' ? copy.title : 'Creative brief builder';
  const lead =
    typeof copy.lead === 'string'
      ? copy.lead
      : 'Turn a short marketing brief into an image-ready prompt.';
  const presetsLabel = typeof copy.presetsLabel === 'string' ? copy.presetsLabel : 'Quick starts';
  const sampleLabel = typeof copy.sampleLabel === 'string' ? copy.sampleLabel : 'Try sample';
  const stepsContext = typeof copy.stepsContext === 'string' ? copy.stepsContext : 'Context';
  const stepsVisual = typeof copy.stepsVisual === 'string' ? copy.stepsVisual : 'Visual';
  const stepsText = typeof copy.stepsText === 'string' ? copy.stepsText : 'Text';
  const qualityLabel = typeof copy.qualityLabel === 'string' ? copy.qualityLabel : 'Brief readiness';
  const outputLabel = typeof copy.outputLabel === 'string' ? copy.outputLabel : 'Generated image prompt';
  const copyLabel = typeof copy.copyLabel === 'string' ? copy.copyLabel : 'Copy prompt';
  const toolsTitle = typeof copy.toolsTitle === 'string' ? copy.toolsTitle : 'Open an image tool';
  const toolsDesc =
    typeof copy.toolsDesc === 'string' ? copy.toolsDesc : 'Opens in a new tab and copies your prompt.';
  const emptyPlaceholder =
    typeof copy.emptyPlaceholder === 'string'
      ? copy.emptyPlaceholder
      : 'Start with a subject or load a preset — your image prompt builds here.';
  const tipsTitle = typeof copy.tipsTitle === 'string' ? copy.tipsTitle : 'Expert tips';
  const proTeaser =
    typeof copy.proTeaser === 'string'
      ? copy.proTeaser
      : 'Want the method to build more tools like this for your team? See Pro below.';
  const tips = Array.isArray(copy.tips) ? copy.tips : [];
  const tools =
    sot.creativeBrief && Array.isArray(sot.creativeBrief.tools) ? sot.creativeBrief.tools : [];

  const tipItems = tips
    .slice(0, 3)
    .map(function (tip) {
      const t = tip && typeof tip.title === 'string' ? tip.title : '';
      const b = tip && typeof tip.body === 'string' ? tip.body : '';
      return (
        '                    <li><strong>' + escapeHtml(t) + ':</strong> ' + escapeHtml(b) + '</li>\n'
      );
    })
    .join('');

  // Path cut: keep ChatGPT + Ideogram only (no tool-catalog wall).
  const slimTools = tools.filter(function (tool) {
    const url = tool && typeof tool.url === 'string' ? tool.url : '';
    return /chatgpt\.com/i.test(url) || /ideogram\.ai/i.test(url);
  }).slice(0, 2);
  const toolCards = slimTools
    .map(function (tool) {
      const name = tool && typeof tool.name === 'string' ? tool.name : '';
      const url = tool && typeof tool.url === 'string' ? tool.url : '';
      const desc = tool && typeof tool.description === 'string' ? tool.description : '';
      if (!name || !url) return '';
      return (
        '                <button type="button" class="cb-tool-btn" data-cb-tool-url="' +
        escapeHtml(url) +
        '" aria-label="Copy prompt and open ' +
        escapeHtml(name) +
        '">\n' +
        '                    <span class="cb-tool-name">' +
        escapeHtml(name) +
        '</span>\n' +
        '                    <span class="cb-tool-desc">' +
        escapeHtml(desc) +
        '</span>\n' +
        '                </button>\n'
      );
    })
    .join('');

  return (
    '<section class="upgrade-section creative-brief no-print" id="creative-brief" aria-labelledby="cb-title">\n' +
    '            <p class="cb-eyebrow">Free browser builder</p>\n' +
    '            <h2 id="cb-title">' +
    escapeHtml(title) +
    '</h2>\n' +
    '            <p class="cb-lead">' +
    escapeHtml(lead) +
    '</p>\n' +
    '            <details class="cb-builder-details" id="cb-builder">\n' +
    '                <summary id="cb-builder-summary">Open brief builder</summary>\n' +
    '            <div class="cb-presets" role="group" aria-label="' +
    escapeHtml(presetsLabel) +
    '">\n' +
    '                <span class="cb-presets-label">' +
    escapeHtml(presetsLabel) +
    '</span>\n' +
    '                <button type="button" class="btn cb-preset-btn" data-cb-preset="ecommerce">Ecommerce</button>\n' +
    '                <button type="button" class="btn cb-preset-btn" data-cb-preset="brand">Brand</button>\n' +
    '                <button type="button" class="btn cb-preset-btn" data-cb-preset="social">Social</button>\n' +
    '                <button type="button" class="btn cb-preset-btn cb-sample-btn" id="cbSampleBtn">' +
    escapeHtml(sampleLabel) +
    '</button>\n' +
    '            </div>\n' +
    '            <div class="cb-steps" role="group" aria-label="Brief steps">\n' +
    '                <button type="button" class="cb-step is-active" data-cb-step="1" aria-pressed="true">1. ' +
    escapeHtml(stepsContext) +
    '</button>\n' +
    '                <button type="button" class="cb-step" data-cb-step="2" aria-pressed="false">2. ' +
    escapeHtml(stepsVisual) +
    '</button>\n' +
    '                <button type="button" class="cb-step" data-cb-step="3" aria-pressed="false">3. ' +
    escapeHtml(stepsText) +
    '</button>\n' +
    '            </div>\n' +
    '            <div class="cb-layout">\n' +
    '                <div class="cb-form" id="cbForm">\n' +
    '                    <fieldset class="cb-panel" data-cb-panel="1" id="cbPanelContext">\n' +
    '                        <legend class="cb-legend">Context</legend>\n' +
    buildCreativeBriefSelect(
      'cbCampaignGoal',
      'campaignGoal',
      'Campaign goal',
      ['Awareness', 'Engagement', 'Conversion'],
      'Select goal'
    ) +
    buildCreativeBriefTextField('cbAudience', 'audience', 'Audience', 'e.g. US B2B marketing leaders') +
    buildCreativeBriefSelect(
      'cbPlatform',
      'platform',
      'Platform',
      ['Instagram', 'LinkedIn', 'Facebook', 'Web banner', 'Outdoor advertising (Print)'],
      'Select platform'
    ) +
    buildCreativeBriefSelect(
      'cbTone',
      'tone',
      'Tone',
      ['Premium (Luxurious)', 'Bold (Daring)', 'Minimalist', 'Playful', 'Expert'],
      'Select tone'
    ) +
    '                    </fieldset>\n' +
    '                    <fieldset class="cb-panel" data-cb-panel="2" id="cbPanelVisual" hidden>\n' +
    '                        <legend class="cb-legend">Visual</legend>\n' +
    buildCreativeBriefTextField(
      'cbObject',
      'object',
      'Subject / object',
      'e.g. Leather handbag on light stone',
      true
    ) +
    buildCreativeBriefSelect(
      'cbStyle',
      'style',
      'Style',
      [
        'Realistic photo',
        '3D render (Studio)',
        'Cinematic style',
        'Fashion magazine style',
        'Minimalist illustration'
      ],
      'Select style'
    ) +
    buildCreativeBriefSelect(
      'cbLighting',
      'lighting',
      'Lighting',
      ['Cinematic lighting', 'Soft daylight', 'Golden Hour', 'Studio lighting', 'Neon lighting'],
      'Select lighting'
    ) +
    buildCreativeBriefSelect(
      'cbCamera',
      'camera',
      'Camera',
      ['Close-up', 'Eye level', 'Top-down (Flatlay)', 'Wide angle', 'Low angle (Hero shot)'],
      'Select camera'
    ) +
    buildCreativeBriefSelect(
      'cbAspect',
      'aspectRatio',
      'Aspect ratio',
      ['1:1', '16:9', '9:16'],
      'Select ratio'
    ) +
    buildCreativeBriefTextField('cbColor', 'color', 'Color palette', 'e.g. Warm golden tones') +
    '                    </fieldset>\n' +
    '                    <fieldset class="cb-panel" data-cb-panel="3" id="cbPanelText" hidden>\n' +
    '                        <legend class="cb-legend">Text on image</legend>\n' +
    buildCreativeBriefTextField('cbHeadline', 'headline', 'Headline', 'Optional headline on the image') +
    buildCreativeBriefTextField('cbCta', 'cta', 'Call to action', 'Optional CTA') +
    '                    </fieldset>\n' +
    '                </div>\n' +
    '                <div class="cb-output-wrap">\n' +
    '                    <div class="cb-quality" id="cbQuality" aria-live="polite">\n' +
    '                        <span class="cb-quality-label">' +
    escapeHtml(qualityLabel) +
    '</span>\n' +
    '                        <span class="cb-quality-badge" id="cbQualityBadge" data-level="weak">0/9 — weak</span>\n' +
    '                        <p class="cb-quality-hint" id="cbQualityHint">Add a subject to start.</p>\n' +
    '                    </div>\n' +
    '                    <label class="cb-output-label" for="cbOutput">' +
    escapeHtml(outputLabel) +
    '</label>\n' +
    '                    <textarea id="cbOutput" class="cb-output" rows="8" placeholder="' +
    escapeHtml(emptyPlaceholder) +
    '" aria-label="' +
    escapeHtml(outputLabel) +
    ' — you can edit"></textarea>\n' +
    '                    <div class="cb-output-actions">\n' +
    '                        <button type="button" class="btn btn-primary" id="cbCopyBtn" disabled>' +
    escapeHtml(copyLabel) +
    '</button>\n' +
    '                        <span class="cb-char-count" id="cbCharCount" aria-live="polite">0 characters</span>\n' +
    '                    </div>\n' +
    '                    <div class="cb-tools" aria-labelledby="cb-tools-title">\n' +
    '                        <h3 id="cb-tools-title" class="cb-tools-title">' +
    escapeHtml(toolsTitle) +
    '</h3>\n' +
    '                        <p class="cb-tools-desc">' +
    escapeHtml(toolsDesc) +
    '</p>\n' +
    '                        <div class="cb-tool-grid" role="group" aria-label="Image generation tools">\n' +
    toolCards +
    '                        </div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <details class="cb-tips" id="cbTips">\n' +
    '                <summary>' +
    escapeHtml(tipsTitle) +
    '</summary>\n' +
    '                <ul>\n' +
    tipItems +
    '                </ul>\n' +
    '            </details>\n' +
    '            </details>\n' +
    '            <p class="cb-pro-teaser">' +
    escapeHtml(proTeaser) +
    (isMirror
      ? ' <a href="https://promptanatomy.space/en/#pdf-storefront">CMO AI Content System kits</a></p>\n'
      : ' <a href="#pdf-storefront">CMO AI Content System kits</a></p>\n') +
    '            <script src="js/creative-brief.js" defer></script>\n' +
    '        </section>\n\n'
  );
}

function injectCreativeBrief(html, locale) {
  const anchor = '<!-- CMO_CREATIVE_BRIEF -->';
  if (html.indexOf(anchor) === -1) {
    throw new Error('injectCreativeBrief: anchor "<!-- CMO_CREATIVE_BRIEF -->" not found');
  }
  if (locale !== 'en') {
    return html
      .replace(anchor, '')
      .replace(/\s*<nav class="site-nav no-print" id="siteNav"[\s\S]*?<\/nav>\s*/, '\n')
      .replace(
        /\s*<a href="#creative-brief"[^>]*id="heroCtaBrief"[^>]*>[\s\S]*?<\/a>\s*/,
        '\n'
      )
      .replace(
        /\s*<span class="progress-jump-sep"[^>]*>·<\/span>\s*<a href="#creative-brief"[^>]*id="progressJumpCreative"[^>]*>[\s\S]*?<\/a>/,
        ''
      )
      .replace(
        'href="#pro-contents" id="progressJumpPro"',
        'href="https://promptanatomy.space/en/#pdf-storefront" id="progressJumpPro"'
      );
  }
  const sot = loadSot();
  let out = html.replace(anchor, buildCreativeBriefSection(sot, { mirror: !!MIRROR_NOTE }));
  // Spine-first: ensure primary/secondary CTA classes after EN text replacements.
  out = out
    .replace(
      /<a href="#block1"[^>]*id="heroCtaSpine"[^>]*>/i,
      '<a href="#block1" class="cta-button" id="heroCtaSpine" aria-label="Start your first workflow – go to workflow 1">'
    )
    .replace(
      /<a href="#creative-brief"[^>]*id="heroCtaBrief"[^>]*>/i,
      '<a href="#creative-brief" class="cta-text-link" id="heroCtaBrief" aria-label="Build a creative brief – go to the brief builder">'
    );
  const courseFaq =
    '<details class="faq-item">\n' +
    '                    <summary>Is this a course or a tool?</summary>';
  if (out.indexOf(courseFaq) !== -1 && out.indexOf('id="faq-creative-brief"') === -1) {
    out = out.replace(
      courseFaq,
      '<details class="faq-item" id="faq-creative-brief">\n' +
        '                    <summary>What is the creative brief builder?</summary>\n' +
        '                    <p>A free browser tool on this page: fill a short marketing brief and get an image-ready prompt to copy into ChatGPT or Ideogram. No account. It demonstrates the same tool-building idea Pro teaches for teams.</p>\n' +
        '                </details>\n' +
        '                ' +
        courseFaq
    );
  }
  if (out.indexOf('id="faq-tool-sprawl"') === -1) {
    const whoFaq =
      '<details class="faq-item">\n' +
      '                    <summary>Who is this for?</summary>';
    const jtbdFaqs =
      '<details class="faq-item" id="faq-tool-sprawl">\n' +
      '                    <summary>Why use this instead of more AI tools?</summary>\n' +
      '                    <p>It is a portable prompt system you run on ChatGPT or Claude — not another SaaS seat. Structured workflows replace random chats and reduce tool sprawl.</p>\n' +
      '                </details>\n' +
      '                <details class="faq-item" id="faq-brand-voice">\n' +
      '                    <summary>How do you protect brand voice before publishing?</summary>\n' +
      '                    <p>Set session context and non-negotiable rules, then run the <a href="#cmo-safety">pre-publish safety reviewer</a> to check facts, tone, legal/trust risk, and CTA ownership before you ship.</p>\n' +
      '                </details>\n' +
      '                ' +
      whoFaq;
    if (out.indexOf(whoFaq) !== -1) {
      out = out.replace(whoFaq, jtbdFaqs);
    }
  }
  return out;
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
  /** EN is the product surface; LT remains an archive/CI snapshot without paid-price SEO. */
  const ogLocale = 'en_US';
  const brandSeo = readBrandSeo();
  const title = brandSeo.title;
  const description =
    locale === 'en'
      ? brandSeo.description
      : 'Prompt Anatomy archive snapshot. The canonical Content AI System product surface is the English page.';
  const ogImageUrl = makeAbsoluteUrl('/og.png');
  const ogImageAlt =
    locale === 'en'
      ? brandSeo.ogImageAlt
      : 'Prompt Anatomy Content AI System archive snapshot';
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
  const withSeo = cleanHtml.replace(
    /<meta name="viewport" content="[^"]*">/,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    ' + insert
  );
  return withSeo.replace(
    /<title>[\s\S]*?<\/title>/,
    '<title>' + escapeHtml(title) + '</title>'
  );
}

function stripLtArchivePaidStrings(html) {
  return html
    .replace(
      "setText('#heroProof', '4 workflows free on this page. Full 10-prompt system kits start at $3.99.');",
      "setText('#heroProof', '4 workflows free on this page. Full 10-prompt system kits are on the English product surface.');"
    )
    .replace(
      "setText('#heroTrustPill3', 'Full kit from $3.99');",
      "setText('#heroTrustPill3', 'Full kit on /en/');"
    );
}

/** Fix asset paths for pages inside lt/ or en/ */
function fixAssetPaths(html) {
  return html
    .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"')
    .replace(/href="favicon-32x32\.png"/g, 'href="../favicon-32x32.png"')
    .replace(/href="favicon-16x16\.png"/g, 'href="../favicon-16x16.png"')
    .replace(/href="apple-touch-icon\.png"/g, 'href="../apple-touch-icon.png"')
    .replace(/href="site\.webmanifest"/g, 'href="../site.webmanifest"')
    .replace(/href="privatumas\.html"/g, 'href="../privatumas.html"')
    .replace(/href="styles\//g, 'href="../styles/')
    .replace(/src="js\//g, 'src="../js/')
    .replace(/src="data\//g, 'src="../data/')
    .replace(/src="assets\//g, 'src="../assets/')
    .replace(/src="favicon\.svg"/g, 'src="../favicon.svg"');
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
  // Footer product link (before generic "Promptų anatomija" so full paragraph matches)
  [
    '<p class="footer-product-link">Spin-off Nr. 2 (Prompt Anatomy). Pilnas mokymas, metodika ir brand centras: <a href="https://promptanatomy.app/" target="_blank" rel="noopener noreferrer">promptanatomy.app</a>. Paskutinis atnaujinimas: 2026-04-30.</p>',
    '<p class="footer-product-link">Part of Prompt Anatomy · Methodology at <a href="https://www.promptanatomy.app/?utm_source=space&amp;utm_medium=entity_footer&amp;utm_campaign=ecosystem" target="_blank" rel="noopener noreferrer">promptanatomy.app</a></p>'
  ],
  ['<span id="footer-email-label">El. paštas:</span>', '<span id="footer-email-label">Email:</span>'],
  ['<span id="footer-address-label">Pašto adresas:</span>', '<span id="footer-address-label">Mailing address:</span>'],
  // Exact strings with "Promptų anatomija" before global replace below (order matters)
  ['aria-label="Atidaryti Promptų anatomija Telegram grupę naujame lange"', 'aria-label="Open Prompt Anatomy Telegram group in new tab"'],
  ['Promptų anatomija', 'Prompt Anatomy'],
  ['Turinio DI sistema<br>rinkodaros vadovams', 'Build a 30-day Content AI System your team can reuse'],
  [
    '<p class="header-lead" id="heroLead">Kartok rinkodaros workflow vietoj tuščio prompto kiekvieną kartą.</p>',
    '<p class="header-lead" id="heroLead">Copy the Plan → Create → Check → Improve workflow into ChatGPT or Claude, then take the full kit offline when your team needs the system.</p>'
  ],
  [
    '<p class="header-proof" id="heroProof">Nuo kampanijos plano iki kokybės patikros – viena kartojama sistema.</p>',
    '<p class="header-proof" id="heroProof">4 workflows free on this page. Full 10-prompt system kits start at $3.99.</p>'
  ],
  ['id="hero-diagram-label">Planuok → Kurk → Tikrink → Tobulink</', 'id="hero-diagram-label">Plan → Create → Check → Improve</'],
  ['<span class="hero-diagram__module-title">Planuok</span>', '<span class="hero-diagram__module-title">Plan</span>'],
  ['<span class="hero-diagram__module-title">Kurk</span>', '<span class="hero-diagram__module-title">Create</span>'],
  ['<span class="hero-diagram__module-title">Tikrink</span>', '<span class="hero-diagram__module-title">Check</span>'],
  ['<span class="hero-diagram__module-title">Tobulink</span>', '<span class="hero-diagram__module-title">Improve</span>'],
  ['<span class="hero-diagram__module-desc">Briefas + auditorija</span>', '<span class="hero-diagram__module-desc">Brief + audience</span>'],
  ['<span class="hero-diagram__module-desc">Kanalų turinys</span>', '<span class="hero-diagram__module-desc">Channel-ready content</span>'],
  ['<span class="hero-diagram__module-desc">Prekės ženklas + kokybė</span>', '<span class="hero-diagram__module-desc">Brand + quality</span>'],
  ['<span class="hero-diagram__module-desc">Atsiliepimai → perrašymas</span>', '<span class="hero-diagram__module-desc">Feedback → rewrite</span>'],
  [
    '<li class="trust-pill" id="heroTrustPill1">Be paskyros</li>',
    '<li class="trust-pill" id="heroTrustPill1">4 workflows free</li>'
  ],
  [
    '<li class="trust-pill" id="heroTrustPill2">ChatGPT ir Claude</li>',
    '<li class="trust-pill" id="heroTrustPill2">Brief builder included</li>'
  ],
  [
    '<li class="trust-pill" id="heroTrustPill3">4 workflow nemokamai</li>',
    '<li class="trust-pill" id="heroTrustPill3">Full kit from $3.99</li>'
  ],
  [
    'class="cta-text-link" id="heroCtaBrief" aria-label="Kurti kūrybinį briefą – pereiti prie brief builder"',
    'class="cta-text-link" id="heroCtaBrief" aria-label="Build a creative brief – go to the brief builder"'
  ],
  ['Kurti kūrybinį briefą', 'Build a creative brief'],
  [
    'aria-label="Pradėti pirmą workflow – pereiti prie workflow 1"',
    'aria-label="Start your first workflow – go to workflow 1"'
  ],
  ['Pradėti pirmą workflow', 'Start your first workflow'],
  ['<span class="prompt-recommended" id="prompt1Recommended">Pradėk nuo čia</span>', '<span class="prompt-recommended" id="prompt1Recommended">Start here</span>'],
  [
    '<p class="prompt-path-hint" id="prompt1PathHint">Kopijuok Promptą 1 → įklijuok į ChatGPT arba Claude.</p>',
    '<p class="prompt-path-hint" id="prompt1PathHint">Copy Prompt 1 → paste into ChatGPT or Claude.</p>'
  ],
  // Usage strip (executive-summary)
  [
    '<h2 id="executive-summary-title" class="visually-hidden">Kaip naudoti</h2>',
    '<h2 id="executive-summary-title" class="visually-hidden">How to use</h2>'
  ],
  [
    '<p class="usage-strip" id="howItWorksLead">Kopijuok → įklijuok į ChatGPT arba Claude.</p>',
    '<p class="usage-strip" id="howItWorksLead">Copy → paste into ChatGPT or Claude.</p>'
  ],
  ['<summary id="prompt-basics-summary">Promptų pagrindai (1 min)</summary>', '<summary id="prompt-basics-summary">Prompt basics (1 min)</summary>'],
  ['aria-label="Greita navigacija per promptus"', 'aria-label="Quick jump between prompts"'],
  ['href="#pro-contents" id="progressJumpPro">Pro</a>', 'href="#pdf-storefront" id="progressJumpPro">Pricing</a>'],
  ['<a href="#faq" id="progressJumpFaq">DUK</a>', '<a href="#faq" id="progressJumpFaq">FAQ</a>'],
  ['<p class="sticky-prompt-bar-label" id="stickyPromptBarLabel">Promptas</p>', '<p class="sticky-prompt-bar-label" id="stickyPromptBarLabel">Prompt</p>'],
  ['<span id="stickyPromptBarCopyText">Kopijuoti</span>', '<span id="stickyPromptBarCopyText">Copy</span>'],
  ['aria-label="Kopijuoti dabartinį promptą"', 'aria-label="Copy current prompt"'],
  ['<a href="#block2" class="sticky-prompt-bar-next" id="stickyPromptBarNext">Kitas →</a>', '<a href="#block2" class="sticky-prompt-bar-next" id="stickyPromptBarNext">Next →</a>'],
  // Copy tips
  ['Kopijavimo patarimai', 'Copy tips'],
  ['aria-label="Orientacinis laikas: 3–5 min per žingsnį"', 'aria-label="Estimated time: 3–5 min per step"'],
  ['Pasirink promptą ir spausk ant jo – tekstas pažymėsis', 'Select a prompt and click it to auto-select the text'],
  // Use same quote chars as in index.html: „ (U+201E) and " (U+201C) so replacement matches
  ['Spausk <strong>„Kopijuoti promptą\u201C</strong> arba <code>Ctrl+C</code> / <code>Cmd+C</code>', 'Click <strong>"Copy prompt"</strong> or <code>Ctrl+C</code> / <code>Cmd+C</code>'],
  ['~3–5 min', '~3–5 min'],
  ['Įklijuok į ChatGPT, Claude ar kitą DI (dirbtinio intelekto) įrankį', 'Paste into ChatGPT, Claude or another AI tool'],
  ['Pakeisk <code>[auditorija]</code>, <code>[galvos skausmas]</code>, <code>[unikalus pardavimo pasiūlymas]</code>, <code>[kanalas]</code> ir kitus laukus savo duomenimis – ir gauk rezultatą', 'Replace <code>[audience]</code>, <code>[pain point]</code>, <code>[unique selling proposition]</code>, <code>[channel]</code>, and any city or budget placeholders with your real data'],
  ['<h2 id="what-is-prompt-title">Kas yra prompt?</h2>', '<h2 id="what-is-prompt-title">What is a prompt?</h2>'],
  ['Promptas yra aiški instrukcija DI įrankiui: ką daryti, kam daryti ir kokiu formatu grąžinti rezultatą.', 'A prompt is an engineered instruction — Context + Goal + Constraints + Format — not a one-line chat gamble.'],
  ['Kuo promptas tikslesnis, tuo mažiau taisymų po pirmo atsakymo.', 'Engineered prompts cut rework after the first answer; random prompting is gambling.'],
  ['Kontekstas + Tikslas + Ribos + Formatas', 'Context + Goal + Constraints + Format'],
  ['Kas yra Prompt Anatomy?', 'What is Prompt Anatomy?'],
  ['Prompt Anatomy yra struktūra, kuri padeda rašyti promptus taip, kad rezultatas būtų nuoseklus ir pakartojamas.', 'Prompt Anatomy standardizes prompt structure so team outputs stay consistent and repeatable.'],
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
  [
    'alt="Daug DI įrankių neišsprendžia chaotiškos instrukcijos"',
    'alt="More AI tools do not fix chaotic instructions"'
  ],
  [
    'alt="Atsitiktinis promptinimas yra lošimas, struktūruotas promptinimas yra inžinerija"',
    'alt="Random prompting is gambling; structured prompting is engineering"'
  ],
  ['<summary>Daugiau klausimų</summary>', '<summary>More questions</summary>'],
  // FAQPage JSON-LD is emitted from sot.frontFaq + buyerFaq in geo-surfaces.js — do not keep a second 8-item blob here.
  // Progress
  ['Panaudojai 0 iš 4 workflow', 'You used 0 of 4 workflows'],
  ['aria-label="Progresas: 0 iš 4 workflow"', 'aria-label="Progress: 0 of 4 workflows"'],
  ['Žiūrėti Pro rinkinį', 'See Pro kit'],
  ['<h2 id="pro-contents-title">Dar 6 workflow Pro rinkinyje</h2>', '<h2 id="pro-contents-title">Also in the Pro kit</h2>'],
  [
    '<p class="pro-contents-lead" id="pro-contents-lead">Pilni promptų kūnai offline Pro rinkinyje.</p>',
    '<p class="pro-contents-lead" id="pro-contents-lead">Full prompt bodies offline in Pro.</p>'
  ],
  ['id="pro-contents-job-4">Video</', 'id="pro-contents-job-4">Video</'],
  ['id="pro-contents-job-6">Prieštaravimai</', 'id="pro-contents-job-6">Objections</'],
  ['id="pro-contents-job-7">Lead gen</', 'id="pro-contents-job-7">Lead gen</'],
  ['id="pro-contents-job-8">Istorija</', 'id="pro-contents-job-8">Story</'],
  ['id="pro-contents-job-9">SEO</', 'id="pro-contents-job-9">SEO</'],
  ['id="pro-contents-job-10">Valdymas</', 'id="pro-contents-job-10">Control</'],
  [
    'id="prompt-desc-4">30 s video su kabliuku ir CTA</',
    'id="prompt-desc-4">30s video with hook and CTA</'
  ],
  [
    'id="prompt-desc-6">10 vienetų prieštaravimams</',
    'id="prompt-desc-6">10 assets for objections</'
  ],
  [
    'id="prompt-desc-7">Lead postas + DM seka</',
    'id="prompt-desc-7">Lead post + DM sequence</'
  ],
  [
    'id="prompt-desc-8">Case study struktūra</',
    'id="prompt-desc-8">Case-study structure</'
  ],
  [
    'id="prompt-desc-9">Pillar + subtemos</',
    'id="prompt-desc-9">Pillar + subtopics</'
  ],
  [
    'id="prompt-desc-10">Control-center planas</',
    'id="prompt-desc-10">Control-center plan</'
  ],
];

const EN_REPLACEMENTS_SUFFIX = [
  // Prompt 1 (Plan)
  ['<div class="category">Planuok</div>', '<div class="category">Plan</div>'],
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
  // Prompt 2 (Create)
  ['<div class="category">Kurk</div>', '<div class="category">Create</div>'],
  ['<h2 class="prompt-title">Viena idėja → 7 formatai</h2>', '<h2 class="prompt-title">One idea → 7 formats</h2>'],
  [
    '<p class="prompt-desc" id="prompt-desc-2">Iš vienos idėjos – 7 kanalų vienetai per ~5–10 min</p>',
    '<p class="prompt-desc" id="prompt-desc-2">From one idea — 7 channel units in ~5–10 min</p>'
  ],
  ['aria-label="Pasirinkti ir kopijuoti promptą 2"', 'aria-label="Select and copy prompt 2"'],
  ['aria-label="Informacija: promptas 2"', 'aria-label="Information: prompt 2"'],
  ['<strong>Vienos idėjos daug formatų:</strong>', '<strong>One idea, many formats:</strong>'],
  ['<p>1 idėja = 7 vienetų. Laikas sutaupomas, nuoseklumas išlaikomas.</p>', '<p>1 idea = 7 units. Time saved, consistency kept.</p>'],
  ['Įklijuok į ChatGPT arba Claude ir pakeisk laukus savo duomenimis.', 'Paste into ChatGPT or Claude and replace placeholders with your data.'],
  ['aria-label="Kopijuoti promptą 2 į darbinių atmintinę"', 'aria-label="Copy prompt 2 to clipboard"'],
  // Prompt 3 (Check)
  ['<div class="category">Tikrink</div>', '<div class="category">Check</div>'],
  ['<h2 class="prompt-title">LinkedIn Autoriteto Kūrimas</h2>', '<h2 class="prompt-title">LinkedIn authority building</h2>'],
  [
    '<p class="prompt-desc" id="prompt-desc-3">Autoriteto LinkedIn postas su įrodymais per ~3–5 min</p>',
    '<p class="prompt-desc" id="prompt-desc-3">Authority LinkedIn post with proof in ~3–5 min</p>'
  ],
  ['aria-label="Pasirinkti ir kopijuoti promptą 3"', 'aria-label="Select and copy prompt 3"'],
  ['aria-label="Informacija: promptas 3"', 'aria-label="Information: prompt 3"'],
  ['<strong>Autoritetas:</strong>', '<strong>Authority:</strong>'],
  ['<p>Įrodymai + konkretūs punktai = pasitikėjimas ir reakcija.</p>', '<p>Proof + concrete points = trust and engagement.</p>'],
  ['aria-label="Kopijuoti promptą 3 į darbinių atmintinę"', 'aria-label="Copy prompt 3 to clipboard"'],
  // Prompt 5 (Improve)
  ['<div class="category">Tobulink</div>', '<div class="category">Improve</div>'],
  ['<h2 class="prompt-title">Kasdienė analizė (Veikla→Sprendimas)</h2>', '<h2 class="prompt-title">Daily analysis (Action→Decision)</h2>'],
  [
    '<p class="prompt-desc" id="prompt-desc-5">Iš rodiklių — 4 veiksmai rytojui per ~3–5 min</p>',
    '<p class="prompt-desc" id="prompt-desc-5">From metrics — 4 actions for tomorrow in ~3–5 min</p>'
  ],
  ['aria-label="Pasirinkti ir kopijuoti promptą 5"', 'aria-label="Select and copy prompt 5"'],
  ['aria-label="Informacija: promptas 5"', 'aria-label="Information: prompt 5"'],
  ['<strong>Uždaras ciklas:</strong>', '<strong>Closed loop:</strong>'],
  ['<p>Rodikliai be veiksmų = stovėjimas vietoje. Duomenys → sprendimai.</p>', '<p>Metrics without action = standing still. Data → decisions.</p>'],
  ['aria-label="Kopijuoti promptą 5 į darbinių atmintinę"', 'aria-label="Copy prompt 5 to clipboard"'],
  // FAQ
  ['Dažniausi klausimai', 'Frequently asked questions'],
  ['<summary>Ar tinka pradedančiajam?</summary>', '<summary>Is this for beginners?</summary>'],
  [
    '<p>Taip, jei pildai laukus savo situacija, ne bendrais žodžiais.</p>',
    '<p>Yes, if you fill placeholders with your real context — then copy, paste, and run.</p>'
  ],
  ['<summary>Ar būtina naudoti visus 10?</summary>', '<summary>Do I need all 10 prompts?</summary>'],
  [
    '<p>Ne, pradėk nuo 1–3 ir plėskis pagal poreikį.</p>',
    '<p>No. Free: 4 workflows (prompts 1, 2, 3, 5) plus the creative brief builder. The Pro kit lists the rest — full META/INPUT/OUTPUT bodies offline (full 10).</p>'
  ],
  ['<summary>Kuo tai geriau nei random promptas?</summary>', '<summary>Why is this better than random prompts?</summary>'],
  [
    '<p>Čia turi nuoseklią seką, aiškų tikslą ir vertinimą.</p>',
    '<p>You get a repeatable Plan → Create → Check → Improve workflow with clear fields and evaluation — structured prompting, not prompt gambling.</p>'
  ],
  ['<summary>Kiek laiko skirti kasdien?</summary>', '<summary>How much time daily?</summary>'],
  ['<p>20–30 min pakanka, jei dirbi ciklu „Kurk → Tikrink → Tobulink“.</p>', '<p>20–30 minutes is enough if you run Create → Check → Improve.</p>'],
  ['<summary>Ar tai kursas ar įrankis?</summary>', '<summary>Is this a course or a tool?</summary>'],
  [
    '<p>Tai interaktyvi promptų biblioteka + framework. Gali naudoti iškart (kopijuok → įklijuok → paleisk).</p>',
    '<p>A copy-paste Content AI System you can use immediately — not a long course. Free spine + brief in the browser; depth offline in the kits.</p>'
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
  // Community
  ['<h2 id="community-title">Nori daugiau?<br>Prisijunk prie Telegram grupės.</h2>', '<h2 id="community-title">Want more?<br>Join our US-focused Telegram group.</h2>'],
  ['<p>Bendros diskusijos, patarimai ir naujienos apie promptus ir DI.</p>', '<p>Get playbooks, real examples, and prompt updates for US-market execution.</p>'],
  ['Prisijungti prie Telegram grupės', 'Join Telegram group'],
  // Footer
  ['<h3>Sėkmės rinkodaroje <span aria-hidden="true">🚀</span></h3>', '<h3>Go win your market <span aria-hidden="true">🚀</span></h3>'],
  ['<p>Nepamiršk pakeisti <strong>[auditorija]</strong>, <strong>[galvos skausmas]</strong>, <strong>[unikalus pardavimo pasiūlymas]</strong>, <strong>[kanalas]</strong> ir kitus laukus savo duomenimis</p>', '<p>Remember to replace <strong>[audience]</strong>, <strong>[pain point]</strong>, <strong>[unique selling proposition]</strong>, <strong>[channel]</strong> and other placeholders with your data</p>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Rinkodara</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Marketing</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 10 promptų</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 4 free workflows</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Veiksmų fokusas</span>', '<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Action focus</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Potencialūs klientai ir rodikliai</span>', '<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Full 10 in Pro</span>'],
  ['<p>&copy; 2026 Tomas Staniulis. Mokymų medžiaga. Visos teisės saugomos. <a href="privatumas.html">Privatumas</a></p>', '<p>&copy; 2026 Tomas Staniulis. Training material. All rights reserved. <a href="../en/privacy.html">Privacy</a></p>'],
  ['<h2 id="ecosystem-strip-title">Prompt Anatomy ekosistema</h2>', '<h2 id="ecosystem-strip-title">Prompt Anatomy ecosystem</h2>'],
  [
    '<p class="ecosystem-strip-intro">Viena vieta: metodika, bendruomenė, el. paštas ir susiję rinkiniai.</p>',
    '<p class="ecosystem-strip-intro">Methodology and community. Checkout stays on this page.</p>'
  ],
  [
    '<p class="ecosystem-strip-related">Susijęs: <a href="https://ditreneris.github.io/leader/en/" target="_blank" rel="noopener noreferrer">Prompt Anatomy Leader</a> (CEO/COO rinkinys)</p>',
    '<p class="ecosystem-strip-related">Related: <a href="https://ditreneris.github.io/leader/en/" target="_blank" rel="noopener noreferrer">Prompt Anatomy Leader</a> (CEO/COO kit)</p>'
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
  return ltBodies.map(({ id, lt }) => {
    const en = EN_PROMPT_BODIES[id - 1];
    if (typeof en !== 'string') {
      throw new Error('Missing EN prompt body at index ' + (id - 1));
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
  for (const i of FREE_SPINE_IDS) {
    if (html.indexOf('id="expected' + i + '"') === -1) {
      throw new Error('EN locale: missing prompt-expected slot for spine prompt ' + i);
    }
  }
  for (const i of FREE_TEASER_IDS) {
    if (html.indexOf('id="expected' + i + '"') !== -1) {
      throw new Error('EN locale: teaser prompt ' + i + ' must not have expected output');
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
  if (html.indexOf('id="creative-brief"') === -1) {
    throw new Error('EN locale: missing #creative-brief section');
  }
  if (html.indexOf('id="cbOutput"') === -1) {
    throw new Error('EN locale: missing #cbOutput in creative brief');
  }
  if (html.indexOf('data-cb-preset') === -1) {
    throw new Error('EN locale: missing creative brief presets');
  }
  if (html.indexOf('id="cbQuality"') === -1) {
    throw new Error('EN locale: missing creative brief quality meter');
  }
  if (html.indexOf('js/creative-brief.js') === -1 && html.indexOf('../js/creative-brief.js') === -1) {
    throw new Error('EN locale: missing creative-brief.js script');
  }
  if (html.indexOf('id="progressJumpCreative"') === -1) {
    throw new Error('EN locale: missing #progressJumpCreative link');
  }
  if (MIRROR_NOTE) {
    if (html.indexOf('id="pdf-storefront"') !== -1) {
      throw new Error('EN locale (mirror build): #pdf-storefront must be omitted when MIRROR_NOTE=1');
    }
  } else {
    if (html.indexOf('id="pdf-storefront"') === -1) {
      throw new Error('EN locale: missing #pdf-storefront section');
    }
    if (html.indexOf('$3.99') === -1 || html.indexOf('$8.99') === -1 || html.indexOf('$10.99') === -1) {
      throw new Error('EN locale: storefront must reference $3.99, $8.99, and $10.99 prices');
    }
    if (html.indexOf('pdf-comparison-table') !== -1) {
      throw new Error('EN locale: storefront must not render comparison table (path cut)');
    }
    if (html.indexOf('id="cb-builder"') === -1) {
      throw new Error('EN locale: missing collapsed #cb-builder details');
    }
    if (html.indexOf('class="pdf-card"') === -1) {
      throw new Error('EN locale: storefront must contain at least one .pdf-card');
    }
  }
}

function assertLtLocaleAdditions(html) {
  if (html.indexOf('id="cmo-context"') === -1) {
    throw new Error('LT locale: missing #cmo-context section');
  }
  for (const i of FREE_SPINE_IDS) {
    if (html.indexOf('id="expected' + i + '"') === -1) {
      throw new Error('LT locale: missing prompt-expected slot for spine prompt ' + i);
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
  if (html.indexOf('id="pdf-storefront"') !== -1) {
    throw new Error('LT locale: #pdf-storefront must NEVER appear on LT pages (commerce is EN-only)');
  }
  if (html.indexOf('id="creative-brief"') !== -1) {
    throw new Error('LT locale: #creative-brief must NEVER appear on LT pages (EN-only free builder)');
  }
  if (html.indexOf('CMO_CREATIVE_BRIEF') !== -1) {
    throw new Error('LT locale: creative brief anchor must be removed');
  }
}

function buildLocale(locale) {
  let html = readIndex();
  html = html.replace(/<html lang="lt">/, '<html lang="' + locale + '">');
  if (locale === 'en') {
    html = applyEnReplacements(html);
    html = applyCollapsibleSummaries(html);
    html = injectEnPreBodies(html);
    html = injectEnContextBlock(html);
    html = injectEnExpectedBullets(html);
    html = injectProviderRows(html);
    html = injectSafetySection(html, 'en');
    html = injectCreativeBrief(html, 'en');
    html = injectScenariosSection(html, 'en');
    html = injectPdfStorefront(html, 'en');
    html = patchEnCopyPromptHook(html);
    html = injectEnContextScript(html);
    html = injectScenariosTabScript(html, 'en');
  } else if (locale === 'lt') {
    html = applyCollapsibleSummaries(html);
    html = injectLtContextBlock(html);
    html = injectLtExpectedBullets(html);
    html = injectProviderRows(html);
    html = injectSafetySection(html, 'lt');
    html = injectCreativeBrief(html, 'lt');
    html = injectScenariosSection(html, 'lt');
    html = patchLtCopyPromptHook(html);
    html = injectLtContextScript(html);
    html = injectScenariosTabScript(html, 'lt');
    html = stripLtArchivePaidStrings(html);
  }
  html = insertSeo(html, locale);
  if (locale === 'en' && geoJsonLdInject) {
    html = geoJsonLdInject(html);
  }
  html = fixAssetPaths(html);
  html = injectFooterSuite(html, locale);
  if (locale === 'en') {
    assertEnLocaleAdditions(html);
  }
  if (locale === 'lt') {
    assertLtLocaleAdditions(html);
  }
  assertCollapsiblePromptContract(html, locale + ' locale');
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
  const sot = loadSot();
  assertRequireStripeLinks(sot);
  writeEnPromptInlineJs(EN_PROMPT_BODIES);
  const geo = writeGeoSurfaces({
    root: ROOT,
    siteOrigin: SITE_ORIGIN,
    sot: sot,
    promptBodies: EN_PROMPT_BODIES
  });
  geoJsonLdInject = geo.injectEnJsonLdGraph;
  ensureDir(path.join(ROOT, 'lt'));
  ensureDir(path.join(ROOT, 'en'));
  const ltHtml = buildLocale('lt');
  const enHtml = buildLocale('en');
  geoJsonLdInject = null;
  assertLocaleStructure(ltHtml, 'lt');
  assertLocaleStructure(enHtml, 'en');
  writeTextFileStable(path.join(ROOT, 'lt', 'index.html'), ltHtml);
  writeTextFileStable(path.join(ROOT, 'en', 'index.html'), enHtml);
  assertPrivacySeo();
  console.log(
    'Built lt/index.html, en/index.html, js/en-prompt-bodies-inline.js, GEO surfaces (+ privacy SEO checks)'
  );
}

main();
