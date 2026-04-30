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
const LT_PRIVACY_PATH = path.join(__dirname, '..', 'lt', 'privatumas.html');
const EN_PRIVACY_PATH = path.join(__dirname, '..', 'en', 'privacy.html');
const ROBOTS_PATH = path.join(__dirname, '..', 'robots.txt');
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');
const EN_PROMPT_BODIES_JSON = path.join(__dirname, '..', 'data', 'en-prompt-bodies.json');
const EN_PROMPT_INLINE_JS = path.join(__dirname, '..', 'js', 'en-prompt-bodies-inline.js');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const PROD_ORIGIN = 'https://ditreneris.github.io';
const PROD_BASE = '/cmo';

function readPackageVersion() {
  const raw = readFile(PACKAGE_JSON_PATH);
  if (!raw) return null;
  try {
    return JSON.parse(raw).version;
  } catch (_) {
    return null;
  }
}

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

function assertPageSeoContracts(pageHtml, expected) {
  return (
    pageHtml.includes(`<link rel="canonical" href="${expected.canonical}">`) &&
    pageHtml.includes(`<link rel="alternate" hreflang="lt" href="${expected.lt}">`) &&
    pageHtml.includes(`<link rel="alternate" hreflang="en" href="${expected.en}">`) &&
    pageHtml.includes(`<link rel="alternate" hreflang="x-default" href="${expected.xDefault}">`)
  );
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
  if (assert(
    html.includes('id="what-is-prompt"') &&
    html.includes('id="prompt-anatomy"') &&
    html.includes('id="framework-schema"') &&
    html.includes('id="faq"'),
    'Upgrade sekcijos (what-is-prompt, prompt-anatomy, framework-schema, faq) egzistuoja'
  )) passed++;
  else failed++;
  if (assert(
    html.includes('id="meme-slot-1"') &&
    html.includes('id="meme-slot-2"') &&
    html.includes('id="meme-slot-3"'),
    'Meme slotai (1-3) egzistuoja'
  )) passed++;
  else failed++;
  if (assert(html.includes('id="toast"') && html.includes('role="status"'), 'Toast pranešimas')) passed++;
  else failed++;
  if (assert(html.includes('privatumas.html'), 'Nuoroda į privatumas.html')) passed++;
  else failed++;

  // --- Konfigūracija ir kritinės funkcijos ---
  if (assert(html.includes('copyPrompt') && html.includes('selectText'), 'Kopijavimo funkcijos apibrėžtos')) passed++;
  else failed++;
  if (assert(
    html.includes('href="styles/tokens.css"') &&
    html.includes('href="styles/components.css"') &&
    html.includes('href="styles/utilities.css"'),
    'index.html įtraukia design system CSS sluoksnius'
  )) passed++;
  else failed++;
  if (assert(!html.includes('onclick="') && !html.includes('onkeydown="'), 'Markup nenaudoja inline event handlerių')) passed++;
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
  if (ltHtml && assert(
    assertPageSeoContracts(ltHtml, {
      canonical: `${PROD_ORIGIN}${PROD_BASE}/lt/`,
      lt: `${PROD_ORIGIN}${PROD_BASE}/lt/`,
      en: `${PROD_ORIGIN}${PROD_BASE}/en/`,
      xDefault: `${PROD_ORIGIN}${PROD_BASE}/en/`
    }),
    'lt/index.html SEO kontraktas atitinka production host/path'
  )) passed++;
  else failed++;
  if (enHtml && assert(
    assertPageSeoContracts(enHtml, {
      canonical: `${PROD_ORIGIN}${PROD_BASE}/en/`,
      lt: `${PROD_ORIGIN}${PROD_BASE}/lt/`,
      en: `${PROD_ORIGIN}${PROD_BASE}/en/`,
      xDefault: `${PROD_ORIGIN}${PROD_BASE}/en/`
    }),
    'en/index.html SEO kontraktas atitinka production host/path'
  )) passed++;
  else failed++;

  // --- Privacy parity + SEO ---
  const ltPrivacyHtml = readFile(LT_PRIVACY_PATH);
  const enPrivacyHtml = readFile(EN_PRIVACY_PATH);
  if (assert(ltPrivacyHtml !== null && ltPrivacyHtml.includes('lang="lt"'), 'lt/privatumas.html egzistuoja ir turi lang="lt"')) passed++;
  else failed++;
  if (assert(enPrivacyHtml !== null && enPrivacyHtml.includes('lang="en"'), 'en/privacy.html egzistuoja ir turi lang="en"')) passed++;
  else failed++;
  if (ltPrivacyHtml && assert(
    ltPrivacyHtml.includes('id="back-link"') && ltPrivacyHtml.includes('id="back-link-footer"'),
    'lt/privatumas.html turi viršutinę ir apatinę grįžimo nuorodą'
  )) passed++;
  else failed++;
  if (enPrivacyHtml && assert(
    enPrivacyHtml.includes('← Back to library') && enPrivacyHtml.includes('<nav class="lang-switcher"'),
    'en/privacy.html turi kalbos jungiklį ir grįžimo nuorodą'
  )) passed++;
  else failed++;
  if (ltPrivacyHtml && assert(
    assertPageSeoContracts(ltPrivacyHtml, {
      canonical: `${PROD_ORIGIN}${PROD_BASE}/lt/privatumas.html`,
      lt: `${PROD_ORIGIN}${PROD_BASE}/lt/privatumas.html`,
      en: `${PROD_ORIGIN}${PROD_BASE}/en/privacy.html`,
      xDefault: `${PROD_ORIGIN}${PROD_BASE}/en/privacy.html`
    }),
    'lt/privatumas.html SEO kontraktas atitinka production host/path'
  )) passed++;
  else failed++;
  if (enPrivacyHtml && assert(
    assertPageSeoContracts(enPrivacyHtml, {
      canonical: `${PROD_ORIGIN}${PROD_BASE}/en/privacy.html`,
      lt: `${PROD_ORIGIN}${PROD_BASE}/lt/privatumas.html`,
      en: `${PROD_ORIGIN}${PROD_BASE}/en/privacy.html`,
      xDefault: `${PROD_ORIGIN}${PROD_BASE}/en/privacy.html`
    }),
    'en/privacy.html SEO kontraktas atitinka production host/path'
  )) passed++;
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
  if (assert(enHtml !== null && enHtml.includes('href="../styles/tokens.css"'), 'en/index.html – santykinis kelias į design tokens')) passed++;
  else failed++;
  if (assert(ltHtml !== null && ltHtml.includes('href="../styles/tokens.css"'), 'lt/index.html – santykinis kelias į design tokens')) passed++;
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
    if (assert(
      enHtml.includes('What is a prompt?') &&
      enHtml.includes('What is Prompt Anatomy?') &&
      enHtml.includes('Framework: how to work with this library'),
      'en/index.html: upgrade aiškinamieji blokai EN kalba'
    )) passed++;
    else failed++;
    if (assert(
      enHtml.includes('Frequently asked questions before you start') &&
      enHtml.includes('Meme #3 — when you realize AI was not the issue, the vague instruction was.'),
      'en/index.html: FAQ ir meme slotai EN kalba'
    )) passed++;
    else failed++;

    // --- v1: sister-site adoption (context block + rules + expected output) ---
    const cmoContextCount = (enHtml.match(/id="cmo-context"/g) || []).length;
    if (assert(cmoContextCount === 1, `en/index.html: tiksliai 1 #cmo-context sekcija (rasta: ${cmoContextCount})`)) passed++;
    else failed++;
    if (assert(
      enHtml.includes('Marketing context (one block, every copy)') &&
      enHtml.includes('id="cmoCtxAudience"') &&
      enHtml.includes('id="cmoCtxOffer"') &&
      enHtml.includes('id="cmoCtxChannels"') &&
      enHtml.includes('id="cmoCtxGoal"') &&
      enHtml.includes('id="cmoCtxConstraint"'),
      'en/index.html: konteksto blokas turi 5 privalomus laukus'
    )) passed++;
    else failed++;
    const expectedCount = (enHtml.match(/class="prompt-expected"/g) || []).length;
    if (assert(expectedCount === 10, `en/index.html: tiksliai 10 .prompt-expected blokų (rasta: ${expectedCount})`)) passed++;
    else failed++;
    let allExpectedHaveBullets = true;
    for (let i = 1; i <= 10; i++) {
      const re = new RegExp(`id="expected${i}"[\\s\\S]*?</ul>`);
      const m = enHtml.match(re);
      const liCount = m ? (m[0].match(/<li/g) || []).length : 0;
      if (liCount < 3) {
        allExpectedHaveBullets = false;
        break;
      }
    }
    if (assert(allExpectedHaveBullets, 'en/index.html: kiekvienas .prompt-expected turi >=2 bullet (be antraštės)')) passed++;
    else failed++;
    if (assert(enHtml.includes('RULES (non-negotiable)'), 'en/index.html: injected script turi "RULES (non-negotiable)" stringą')) passed++;
    else failed++;
    if (assert(enHtml.includes('window.__CMO_COMPILE'), 'en/index.html: copyPrompt patched, kviečia window.__CMO_COMPILE')) passed++;
    else failed++;

    // --- v2.0 EN: safety + scenarios ---
    if (assert(enHtml.includes('id="cmo-safety"'), 'en/index.html: yra #cmo-safety')) passed++;
    else failed++;
    if (assert(enHtml.includes('id="cmo-scenarios"'), 'en/index.html: yra #cmo-scenarios')) passed++;
    else failed++;
    if (assert(enHtml.includes('Pre-publish safety'), 'en/index.html: safety antraštė EN')) passed++;
    else failed++;
    if (assert(
      enHtml.includes('Act as a marketing risk reviewer'),
      'en/index.html: safety reviewer prompt tekstas'
    )) passed++;
    else failed++;

    const pkgVer = readPackageVersion();
    if (pkgVer && assert(
      enHtml.includes('data-version="' + pkgVer + '"') && enHtml.includes('Prompt Anatomy CMO Kit v' + pkgVer),
      'en/index.html: footer versijos žyma sutampa su package.json'
    )) passed++;
    else failed++;
    if (assert(
      enHtml.includes('href="https://ditreneris.github.io/leader/en/"'),
      'en/index.html: kryžminė nuoroda į Leader rinkinį'
    )) passed++;
    else failed++;
    const enGemini = (enHtml.match(/gemini\.google\.com/g) || []).length;
    if (assert(enGemini >= 1, `en/index.html: Gemini provider nuoroda (bendras hub, rasta: ${enGemini})`)) passed++;
    else failed++;

    // --- v2.1 LT: parity su EN kontekstu, tikėtinu atsakymu, safety, scenarios ---
    if (ltHtml) {
      if (assert(ltHtml.includes('id="cmo-context"'), 'lt/index.html: yra #cmo-context')) passed++;
      else failed++;
      if (assert(ltHtml.includes('class="prompt-expected"'), 'lt/index.html: yra .prompt-expected blokai')) passed++;
      else failed++;
      if (assert(ltHtml.includes('Tikėtinas atsakymas'), 'lt/index.html: tikėtino atsakymo antraštė')) passed++;
      else failed++;
      if (assert(ltHtml.includes('KONTEKSTAS'), 'lt/index.html: compile script naudoja KONTEKSTAS')) passed++;
      else failed++;
      if (assert(ltHtml.includes('TAISYKLĖS (privalomos)'), 'lt/index.html: TAISYKLĖS (privalomos)')) passed++;
      else failed++;
      if (assert(ltHtml.includes('window.__CMO_COMPILE'), 'lt/index.html: copyPrompt su window.__CMO_COMPILE')) passed++;
      else failed++;
      if (assert(ltHtml.includes('id="cmo-safety"'), 'lt/index.html: yra #cmo-safety')) passed++;
      else failed++;
      if (assert(ltHtml.includes('id="cmo-scenarios"'), 'lt/index.html: yra #cmo-scenarios')) passed++;
      else failed++;
      if (assert(ltHtml.includes('Pasirink scenarijų'), 'lt/index.html: scenarijų antraštė LT')) passed++;
      else failed++;
      if (pkgVer && assert(
        ltHtml.includes('data-version="' + pkgVer + '"') && ltHtml.includes('Prompt Anatomy CMO rinkinys v' + pkgVer),
        'lt/index.html: footer versijos žyma sutampa su package.json'
      )) passed++;
      else failed++;
      if (assert(
        ltHtml.includes('href="https://ditreneris.github.io/leader/en/"'),
        'lt/index.html: kryžminė nuoroda į Leader rinkinį'
      )) passed++;
      else failed++;
      const ltGemini = (ltHtml.match(/gemini\.google\.com/g) || []).length;
      if (assert(ltGemini >= 1, `lt/index.html: Gemini provider nuoroda (bendras hub, rasta: ${ltGemini})`)) passed++;
      else failed++;
    }
  }

  // --- robots.txt + sitemap.xml consistency with canonical host/path ---
  const robotsTxt = readFile(ROBOTS_PATH);
  const sitemapXml = readFile(SITEMAP_PATH);
  const expectedSitemapUrl = `${PROD_ORIGIN}${PROD_BASE}/sitemap.xml`;
  const expectedSitemapLocs = [
    `${PROD_ORIGIN}${PROD_BASE}/`,
    `${PROD_ORIGIN}${PROD_BASE}/lt/`,
    `${PROD_ORIGIN}${PROD_BASE}/en/`,
    `${PROD_ORIGIN}${PROD_BASE}/lt/privatumas.html`,
    `${PROD_ORIGIN}${PROD_BASE}/en/privacy.html`
  ];
  if (assert(robotsTxt !== null && robotsTxt.includes(`Sitemap: ${expectedSitemapUrl}`), 'robots.txt rodo teisingą sitemap URL')) passed++;
  else failed++;
  if (assert(sitemapXml !== null, 'sitemap.xml egzistuoja')) passed++;
  else failed++;
  if (sitemapXml) {
    for (const loc of expectedSitemapLocs) {
      if (assert(sitemapXml.includes(`<loc>${loc}</loc>`), `sitemap.xml turi URL: ${loc}`)) passed++;
      else failed++;
    }
  }

  console.log('\n---');
  console.log(`Rezultatas: ${passed} praeina, ${failed} nepraeina.`);
  if (failed > 0) {
    process.exit(1);
  }
  console.log('Visi struktūriniai testai praeina.\n');
}

run();
