/**
 * Struktūriniai testai – index.html
 * Tikrina, kad puslapyje yra visi būtini elementai (10 promptų, a11y, nuorodos).
 * Paleisti: node tests/structure.test.js (arba npm test)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const PRIVATUMAS_PATH = path.join(__dirname, '..', 'privatumas.html');
const LT_INDEX_PATH = path.join(__dirname, '..', 'lt', 'index.html');
const EN_INDEX_PATH = path.join(__dirname, '..', 'en', 'index.html');
const EN_PROMPT_BODIES_JSON = path.join(__dirname, '..', 'data', 'en-prompt-bodies.json');
const EN_PROMPT_INLINE_JS = path.join(__dirname, '..', 'js', 'en-prompt-bodies-inline.js');

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ${message}`);
    return false;
  }
  console.log(`✅ ${message}`);
  return true;
}

function run() {
  let passed = 0;
  let failed = 0;

  const html = readFile(INDEX_PATH);
  if (!html) {
    console.error('❌ index.html nerastas:', INDEX_PATH);
    process.exit(1);
  }

  // --- 10 promptų ---
  for (let i = 1; i <= 10; i++) {
    if (assert(html.includes(`id="prompt${i}"`), `Prompt ${i} ID (prompt${i}) egzistuoja`)) passed++;
    else failed++;
  }
  for (let i = 1; i <= 10; i++) {
    if (assert(html.includes(`id="block${i}"`), `Anchor block${i} egzistuoja`)) passed++;
    else failed++;
  }

  // --- Kopijuoti mygtukai (10) ---
  const copyButtons = (html.match(/Kopijuoti promptą/g) || []).length;
  if (assert(copyButtons >= 10, `Kopijuoti promptą mygtukų: ${copyButtons} (>= 10)`)) passed++;
  else failed++;

  // --- Code-block (10) ---
  const codeBlocks = (html.match(/class="[^"]*code-block[^"]*"/g) || []).length;
  if (assert(codeBlocks >= 10, `Code-block elementų: ${codeBlocks} (>= 10)`)) passed++;
  else failed++;

  // --- Pažymėjau kaip atlikau (10 checkbox) ---
  const checkboxes = (html.match(/class="[^"]*prompt-done[^"]*"/g) || []).length;
  if (assert(checkboxes >= 10, `Prompt-done checkbox: ${checkboxes} (>= 10)`)) passed++;
  else failed++;

  // --- Prieinamumas / semantika ---
  if (assert(html.includes('href="#main-content"') && html.includes('skip-link'), 'Skip link į main-content')) passed++;
  else failed++;
  if (assert(html.includes('id="main-content"') && html.includes('<main'), 'Main region (main-content)')) passed++;
  else failed++;
  if (assert(html.includes('id="progressText"') && html.includes('id="progressBarFill"'), 'Progreso indikatorius')) passed++;
  else failed++;
  if (assert(html.includes('id="toast"') && html.includes('role="status"'), 'Toast pranešimas')) passed++;
  else failed++;
  if (assert(html.includes('privatumas.html'), 'Nuoroda į privatumas.html')) passed++;
  else failed++;

  // --- Konfigūracija ir kritinės funkcijos ---
  if (assert(html.includes('copyPrompt') && html.includes('selectText'), 'Kopijavimo funkcijos apibrėžtos')) passed++;
  else failed++;
  if (assert(html.includes('localStorage') && html.includes('di_prompt_done_'), 'localStorage progresui')) passed++;
  else failed++;
  if (assert(html.includes('hiddenTextarea'), 'Fallback textarea kopijavimui')) passed++;
  else failed++;

  // --- Privatumas.html egzistuoja ---
  const privatumas = readFile(PRIVATUMAS_PATH);
  if (assert(privatumas !== null && privatumas.length > 0, 'privatumas.html egzistuoja')) passed++;
  else failed++;

  // --- Lang ir prieinamumas ---
  if (assert(html.includes('lang="lt"'), 'HTML lang="lt"')) passed++;
  else failed++;

  // --- LT/EN locale puslapiai (generuojami per npm run build) ---
  const ltHtml = readFile(LT_INDEX_PATH);
  if (assert(ltHtml !== null && ltHtml.includes('lang="lt"'), 'lt/index.html egzistuoja ir turi lang="lt"')) passed++;
  else failed++;
  const enHtml = readFile(EN_INDEX_PATH);
  if (assert(enHtml !== null && enHtml.includes('lang="en"'), 'en/index.html egzistuoja ir turi lang="en"')) passed++;
  else failed++;
  if (ltHtml && assert(ltHtml.includes('rel="canonical"') && ltHtml.includes('hreflang="lt"'), 'lt/index.html turi canonical ir hreflang')) passed++;
  else failed++;
  if (enHtml && assert(enHtml.includes('rel="canonical"') && enHtml.includes('hreflang="en"'), 'en/index.html turi canonical ir hreflang')) passed++;
  else failed++;

  // --- Vienas šaltinis EN promptų kūnams (data + generuojamas JS) ---
  const enBodiesRaw = readFile(EN_PROMPT_BODIES_JSON);
  let enBodiesArr = null;
  if (enBodiesRaw) {
    try {
      enBodiesArr = JSON.parse(enBodiesRaw);
    } catch (_) {
      enBodiesArr = null;
    }
  }
  if (assert(enBodiesArr !== null && Array.isArray(enBodiesArr) && enBodiesArr.length === 10, 'data/en-prompt-bodies.json – masyvas iš 10 eilučių')) passed++;
  else failed++;
  const enInlineJs = readFile(EN_PROMPT_INLINE_JS);
  if (assert(
    enInlineJs !== null && enInlineJs.includes('window.__EN_PROMPT_PRE') && enInlineJs.includes("'use strict'"),
    'js/en-prompt-bodies-inline.js egzistuoja (npm run build)'
  )) passed++;
  else failed++;
  if (assert(html.includes('src="js/en-prompt-bodies-inline.js"'), 'index.html įtraukia js/en-prompt-bodies-inline.js')) passed++;
  else failed++;
  if (assert(enHtml !== null && enHtml.includes('src="../js/en-prompt-bodies-inline.js"'), 'en/index.html – santykinis kelias į en-prompt-bodies-inline.js')) passed++;
  else failed++;
  if (assert(ltHtml !== null && ltHtml.includes('src="../js/en-prompt-bodies-inline.js"'), 'lt/index.html – santykinis kelias į en-prompt-bodies-inline.js')) passed++;
  else failed++;

  // --- EN puslapis: regresija – matomas turinys be LT likučių (build + EN_REPLACEMENTS) ---
  if (enHtml) {
    if (assert(
      !enHtml.includes('Pagrindinė tema + subtemos = pasiekiamumas'),
      'en/index.html: prompt 9 info be LT pastraipos'
    )) passed++;
    else failed++;
    if (assert(
      enHtml.includes('Main topic + subtopics = reach and expert position'),
      'en/index.html: prompt 9 info EN pastraipa'
    )) passed++;
    else failed++;
    if (assert(
      enHtml.includes('aria-label="Open Prompt Anatomy Telegram group in new tab"'),
      'en/index.html: Telegram CTA pilnas EN aria-label'
    )) passed++;
    else failed++;
  }

  console.log('\n---');
  console.log(`Rezultatas: ${passed} praeina, ${failed} nepraeina.`);
  if (failed > 0) {
    process.exit(1);
  }
  console.log('Visi struktūriniai testai praeina.\n');
}

run();
