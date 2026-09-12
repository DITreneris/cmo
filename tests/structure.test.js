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
const VERCEL_PATH = path.join(__dirname, '..', 'vercel.json');
const PROD_ORIGIN = 'https://promptanatomy.space';
const PROD_BASE = '';
const PROD_OG_IMAGE_URL = `${PROD_ORIGIN}${PROD_BASE}/og.png`;

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

function assertOgImageContracts(pageHtml, expectedOgImageUrl) {
  return (
    pageHtml.includes(`<meta property="og:image" content="${expectedOgImageUrl}">`) &&
    pageHtml.includes('<meta property="og:image:width" content="1200">') &&
    pageHtml.includes('<meta property="og:image:height" content="630">') &&
    pageHtml.includes('<meta property="og:image:alt" content="') &&
    pageHtml.includes(`<meta name="twitter:image" content="${expectedOgImageUrl}">`) &&
    pageHtml.includes('<meta name="twitter:image:alt" content="')
  );
}

const FREE_SPINE_IDS = [1, 2, 3, 5];
const FREE_TEASER_IDS = [4, 6, 7, 8, 9, 10];

function assertFreeSpineAndTeasers(pageHtml) {
  const detailsCount = (pageHtml.match(/class="[^"]*\bprompt-details\b[^"]*"/g) || []).length;
  const collapsibleCount = (pageHtml.match(/class="[^"]*\bprompt--collapsible\b[^"]*"/g) || []).length;
  const teaserCount = (pageHtml.match(/data-teaser-prompt="/g) || []).length;
  const fauxTeaser = pageHtml.includes('prompt--teaser');
  const spineOk = FREE_SPINE_IDS.every((n) => pageHtml.includes('id="prompt' + n + '"'));
  const teasersOk = FREE_TEASER_IDS.every(
    (n) =>
      pageHtml.includes('data-teaser-prompt="' + n + '"') &&
      !pageHtml.includes('id="prompt' + n + '"')
  );
  return (
    detailsCount === 0 &&
    collapsibleCount === 0 &&
    teaserCount === 6 &&
    !fauxTeaser &&
    pageHtml.includes('id="pro-contents"') &&
    spineOk &&
    teasersOk &&
    !pageHtml.includes('openFromHash')
  );
}

/** Free-value order: brief → PDF → library 1/2/3/5 → safety → catalog → FAQ. */
function assertSpineFirstOrder(pageHtml, briefMarker) {
  const block1 = pageHtml.indexOf('id="block1"');
  const brief = pageHtml.indexOf(briefMarker);
  let storefront = pageHtml.indexOf('id="pdf-storefront"');
  if (storefront === -1) storefront = pageHtml.indexOf('<!-- CMO_PDF_STOREFRONT -->');
  const block2 = pageHtml.indexOf('id="block2"');
  const block5 = pageHtml.indexOf('id="block5"');
  let safety = pageHtml.indexOf('id="cmo-safety"');
  if (safety === -1) safety = pageHtml.indexOf('<!-- CMO_SAFETY -->');
  let scenarios = pageHtml.indexOf('id="cmo-scenarios"');
  if (scenarios === -1) scenarios = pageHtml.indexOf('<!-- CMO_SCENARIOS -->');
  const teaser4 = pageHtml.indexOf('data-teaser-prompt="4"');
  const faq = pageHtml.indexOf('id="faq"');
  const basics = pageHtml.indexOf('id="prompt-basics"');
  return (
    block1 !== -1 &&
    brief !== -1 &&
    storefront !== -1 &&
    block2 !== -1 &&
    block5 !== -1 &&
    safety !== -1 &&
    scenarios !== -1 &&
    teaser4 !== -1 &&
    faq !== -1 &&
    basics !== -1 &&
    brief < storefront &&
    storefront < block1 &&
    block1 < block2 &&
    block2 < block5 &&
    block5 < safety &&
    safety < scenarios &&
    scenarios < teaser4 &&
    teaser4 < faq &&
    faq < basics
  );
}

function assertSpinePrimaryHero(pageHtml) {
  const spinePrimary =
    /<a[^>]*class="cta-button"[^>]*id="heroCtaSpine"/i.test(pageHtml) ||
    /<a[^>]*id="heroCtaSpine"[^>]*class="cta-button"/i.test(pageHtml);
  const spineNotOutline = !/id="heroCtaSpine"[^>]*cta-button-outline/i.test(pageHtml) &&
    !/cta-button-outline[^>]*id="heroCtaSpine"/i.test(pageHtml);
  const briefSecondary =
    /id="heroCtaBrief"[^>]*cta-text-link/i.test(pageHtml) ||
    /cta-text-link[^>]*id="heroCtaBrief"/i.test(pageHtml) ||
    /id="heroCtaBrief"[^>]*cta-button-outline/i.test(pageHtml) ||
    /cta-button-outline[^>]*id="heroCtaBrief"/i.test(pageHtml);
  return spinePrimary && spineNotOutline && briefSecondary;
}

function run() {
  let passed = 0;
  let failed = 0;

  const html = readFile(INDEX_PATH);
  if (!html) {
    console.error('❌ index.html nerastas:', INDEX_PATH);
    process.exit(1);
  }

  // --- Free spine interactive + teaser anchors ---
  for (const i of FREE_SPINE_IDS) {
    if (assert(html.includes(`id="prompt${i}"`), `Spine prompt ${i} ID (prompt${i}) egzistuoja`)) passed++;
    else failed++;
  }
  for (const i of FREE_TEASER_IDS) {
    if (assert(
      html.includes(`data-teaser-prompt="${i}"`) && !html.includes(`id="prompt${i}"`),
      `Teaser ${i}: data-teaser-prompt, be #prompt${i}`
    )) passed++;
    else failed++;
  }
  for (let i = 1; i <= 10; i++) {
    if (assert(html.includes(`id="block${i}"`), `Anchor block${i} egzistuoja`)) passed++;
    else failed++;
  }

  // --- Kopijuoti mygtukai (spine 4) ---
  const copyButtons = (html.match(/<span>Kopijuoti promptą<\/span>/g) || []).length;
  if (assert(copyButtons === 4, `Kopijuoti promptą mygtukų: ${copyButtons} (spine = 4)`)) passed++;
  else failed++;

  // --- Code-block (spine) ---
  const codeBlocks = (html.match(/class="[^"]*code-block[^"]*"/g) || []).length;
  if (assert(codeBlocks === 4, `Code-block elementų: ${codeBlocks} (spine = 4)`)) passed++;
  else failed++;

  // --- Pažymėjau kaip atlikau (spine checkbox) ---
  const checkboxes = (html.match(/class="prompt-done"/g) || []).length;
  if (assert(checkboxes === 4, `Prompt-done checkbox: ${checkboxes} (spine = 4)`)) passed++;
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
    html.includes('id="faq"'),
    'Upgrade sekcijos (what-is-prompt, prompt-anatomy, faq) egzistuoja'
  )) passed++;
  else failed++;
  if (assert(
    !html.includes('id="meme-slot-1"') &&
    !html.includes('id="meme-slot-2"') &&
    !html.includes('id="meme-slot-3"') &&
    !html.includes('id="meme-slot-4"') &&
    !html.includes('id="meme-slot-5"') &&
    !html.includes('id="meme-slot-6"') &&
    !html.includes('class="meme-slot'),
    'Meme slotai pašalinti iš gyvos puslapio'
  )) passed++;
  else failed++;
  if (assert(html.includes('id="prompt-basics"') && html.includes('id="progressJump"') && html.includes('id="stickyPromptBar"'), 'UX: prompt-basics, progress-jump, sticky bar')) passed++;
  else failed++;
  if (assert(assertFreeSpineAndTeasers(html), 'Free spine 1/2/3/5 + #pro-contents catalog 4/6–10 (index.html)')) passed++;
  else failed++;
  if (assert(
    html.includes('id="heroCtaBrief"') &&
    html.includes('id="heroCtaSpine"') &&
    html.includes('<!-- CMO_CREATIVE_BRIEF -->') &&
    html.includes('<!-- CMO_SAFETY -->') &&
    html.includes('<!-- CMO_SCENARIOS -->') &&
    assertSpinePrimaryHero(html) &&
    assertSpineFirstOrder(html, '<!-- CMO_CREATIVE_BRIEF -->') &&
    html.includes('aria-valuemax="4"'),
    'Spine-first hero + free-value order + progress max 4'
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
  if (privatumas && assert(
    privatumas.includes(`hreflang="en" href="${PROD_ORIGIN}${PROD_BASE}/en/privacy/"`) &&
      privatumas.includes('href="/en/privacy/"'),
    'privatumas.html: EN hreflang and English link use /en/privacy/'
  )) passed++;
  else failed++;

  // --- Lang ir prieinamumas ---
  if (assert(html.includes('lang="lt"'), 'HTML lang="lt"')) passed++;
  else failed++;

  // --- Root always → /en/ (LT is archive via direct URL only) ---
  if (assert(
    !html.includes('prefersLithuanianBrowser') &&
      html.includes("var loc = 'en'"),
    'index.html: root redirect is /en/ (no navigator.language LT negotiate)'
  )) passed++;
  else failed++;
  const vercelRaw = readFile(VERCEL_PATH);
  let vercelCfg = null;
  try { vercelCfg = vercelRaw ? JSON.parse(vercelRaw) : null; } catch (_) { vercelCfg = null; }
  if (assert(vercelCfg && Array.isArray(vercelCfg.redirects), 'vercel.json: redirects parse')) passed++;
  else failed++;
  if (vercelCfg && Array.isArray(vercelCfg.redirects)) {
    const ltDest = vercelCfg.redirects.filter(function (r) {
      return String(r.destination || '').indexOf('/lt') !== -1;
    });
    if (assert(ltDest.length === 0, 'vercel.json: no redirect destination /lt/')) passed++;
    else failed++;
    const rootRedirects = vercelCfg.redirects.filter(function (r) { return r.source === '/'; });
    if (assert(
      rootRedirects.length === 1 &&
        rootRedirects[0].destination === '/en/' &&
        !rootRedirects[0].has,
      'vercel.json: / → /en/ unconditionally'
    )) passed++;
    else failed++;
    if (assert(
      vercelCfg.cleanUrls !== true,
      'vercel.json: no cleanUrls (success.html query must stay)'
    )) passed++;
    else failed++;
    const privacyHtmlRedirect = vercelCfg.redirects.filter(function (r) { return r.source === '/en/privacy.html'; });
    const termsHtmlRedirect = vercelCfg.redirects.filter(function (r) { return r.source === '/terms.html'; });
    if (assert(
      privacyHtmlRedirect.length === 1 &&
        privacyHtmlRedirect[0].destination === '/en/privacy/' &&
        privacyHtmlRedirect[0].statusCode === 308 &&
        termsHtmlRedirect.length === 1 &&
        termsHtmlRedirect[0].destination === '/terms/' &&
        termsHtmlRedirect[0].statusCode === 308,
      'vercel.json: 308 .html → slash for privacy and terms'
    )) passed++;
    else failed++;
    const successRedirects = vercelCfg.redirects.filter(function (r) {
      return String(r.source || '').indexOf('success') !== -1 || String(r.source || '').indexOf('coming-soon') !== -1;
    });
    if (assert(successRedirects.length === 0, 'vercel.json: no success/coming-soon pretty-URL redirects')) passed++;
    else failed++;
  }
  if (vercelCfg && Array.isArray(vercelCfg.rewrites)) {
    const privacyRewrite = vercelCfg.rewrites.filter(function (r) { return r.source === '/en/privacy/'; });
    const termsRewrite = vercelCfg.rewrites.filter(function (r) { return r.source === '/terms/'; });
    if (assert(
      privacyRewrite.length === 1 && privacyRewrite[0].destination === '/en/privacy.html' &&
        termsRewrite.length === 1 && termsRewrite[0].destination === '/terms.html',
      'vercel.json: rewrite slash → .html for privacy and terms'
    )) passed++;
    else failed++;
  } else if (vercelCfg) {
    if (assert(false, 'vercel.json: rewrites parse')) passed++;
    else failed++;
  }
  const serveJsonRaw = readFile(path.join(__dirname, '..', 'serve.json'));
  let serveCfg = null;
  try { serveCfg = serveJsonRaw ? JSON.parse(serveJsonRaw) : null; } catch (_) { serveCfg = null; }
  if (assert(
    serveCfg &&
      serveCfg.cleanUrls === false &&
      Array.isArray(serveCfg.rewrites) &&
      serveCfg.rewrites.some(function (r) { return r.source === '/en/privacy/' && r.destination === '/en/privacy.html'; }) &&
      serveCfg.rewrites.some(function (r) { return r.source === '/terms/' && r.destination === '/terms.html'; }),
    'serve.json: slash rewrites, no cleanUrls'
  )) passed++;
  else failed++;

  // --- OG/Twitter preview image contract (root) ---
  if (assert(assertOgImageContracts(html, PROD_OG_IMAGE_URL), `index.html naudoja OG paveikslą ${PROD_OG_IMAGE_URL} (su width/height/alt)`)) passed++;
  else failed++;

  // --- LT/EN locale puslapiai (generuojami per npm run build) ---
  const ltHtml = readFile(LT_INDEX_PATH);
  if (assert(ltHtml !== null && ltHtml.includes('lang="lt"'), 'lt/index.html egzistuoja ir turi lang="lt"')) passed++;
  else failed++;
  const enHtml = readFile(EN_INDEX_PATH);
  if (assert(enHtml !== null && enHtml.includes('lang="en"'), 'en/index.html egzistuoja ir turi lang="en"')) passed++;
  else failed++;
  if (ltHtml && assert(assertFreeSpineAndTeasers(ltHtml), 'Free spine + teasers (lt/)')) passed++;
  else failed++;
  if (enHtml && assert(assertFreeSpineAndTeasers(enHtml), 'Free spine + teasers (en/)')) passed++;
  else failed++;
  if (
    enHtml &&
    assert(enHtml.includes('id="prompt5"') && enHtml.includes('data-teaser-prompt="4"'), 'en/: spine prompt 5 + teaser 4')
  ) passed++;
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

  // --- OG/Twitter preview image contract (lt/en) ---
  if (ltHtml && assert(assertOgImageContracts(ltHtml, PROD_OG_IMAGE_URL), `lt/index.html naudoja OG paveikslą ${PROD_OG_IMAGE_URL} (su width/height/alt)`)) passed++;
  else failed++;
  if (enHtml && assert(assertOgImageContracts(enHtml, PROD_OG_IMAGE_URL), `en/index.html naudoja OG paveikslą ${PROD_OG_IMAGE_URL} (su width/height/alt)`)) passed++;
  else failed++;

  const brandSeoPath = path.join(__dirname, '..', 'config', 'brand-seo.json');
  let brandSeo = null;
  try {
    brandSeo = JSON.parse(fs.readFileSync(brandSeoPath, 'utf8'));
  } catch (_) {
    brandSeo = null;
  }
  const legacyOgAltSnippet = '10 copy-paste prompts (45 min)';
  if (assert(brandSeo !== null && brandSeo.title && brandSeo.ogImageAlt, 'config/brand-seo.json egzistuoja')) passed++;
  else failed++;
  if (enHtml && assert(
    enHtml.includes('href="../site.webmanifest"') &&
    enHtml.includes('href="../favicon-32x32.png"'),
    'en/index.html – icon pack ir webmanifest'
  )) passed++;
  else failed++;
  if (enHtml && brandSeo && assert(
    enHtml.includes(brandSeo.ogImageAlt) &&
    !enHtml.includes(legacyOgAltSnippet),
    'en/index.html – brand SEO alt (be MVP CMO Kit / 45 min slogan)'
  )) passed++;
  else failed++;
  if (enHtml && brandSeo && assert(
    enHtml.includes('<title>' + brandSeo.title + '</title>'),
    'en/index.html – brand SEO title iš config/brand-seo.json'
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
    enPrivacyHtml.includes('Back to library') &&
      !enPrivacyHtml.includes('<nav class="lang-switcher"') &&
      !enPrivacyHtml.includes('../lt/privatumas.html'),
    'en/privacy.html turi grįžimo nuorodą ir neberodo LT jungiklio'
  )) passed++;
  else failed++;
  if (enPrivacyHtml && assert(
    enPrivacyHtml.includes('href="/styles/tokens.css"') &&
      enPrivacyHtml.includes('href="/favicon.svg"') &&
      enPrivacyHtml.includes('href="/terms/#paid-pdf-license"'),
    'en/privacy.html: root-absolute assets and /terms/# hash links'
  )) passed++;
  else failed++;
  if (ltPrivacyHtml && assert(
    assertPageSeoContracts(ltPrivacyHtml, {
      canonical: `${PROD_ORIGIN}${PROD_BASE}/lt/privatumas.html`,
      lt: `${PROD_ORIGIN}${PROD_BASE}/lt/privatumas.html`,
      en: `${PROD_ORIGIN}${PROD_BASE}/en/privacy/`,
      xDefault: `${PROD_ORIGIN}${PROD_BASE}/en/privacy/`
    }),
    'lt/privatumas.html SEO kontraktas atitinka production host/path'
  )) passed++;
  else failed++;
  if (ltPrivacyHtml && assert(
    ltPrivacyHtml.includes('href="/en/privacy/"'),
    'lt/privatumas.html: English switcher uses /en/privacy/'
  )) passed++;
  else failed++;
  if (enPrivacyHtml && assert(
    assertPageSeoContracts(enPrivacyHtml, {
      canonical: `${PROD_ORIGIN}${PROD_BASE}/en/privacy/`,
      lt: `${PROD_ORIGIN}${PROD_BASE}/lt/privatumas.html`,
      en: `${PROD_ORIGIN}${PROD_BASE}/en/privacy/`,
      xDefault: `${PROD_ORIGIN}${PROD_BASE}/en/privacy/`
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
  const vaTrackJs = path.join(__dirname, '..', 'js', 'va-track.js');
  if (assert(fs.existsSync(vaTrackJs), 'js/va-track.js egzistuoja')) passed++;
  else failed++;
  if (assert(html.includes('src="js/va-track.js"'), 'index.html įtraukia js/va-track.js')) passed++;
  else failed++;
  if (assert(enHtml !== null && enHtml.includes('src="../js/va-track.js"'), 'en/index.html – santykinis kelias į va-track.js')) passed++;
  else failed++;
  const successHtmlForTrack = readFile(path.join(__dirname, '..', 'success.html'));
  if (assert(successHtmlForTrack !== null && successHtmlForTrack.includes('src="js/va-track.js"'), 'success.html įtraukia js/va-track.js')) passed++;
  else failed++;
  const briefJs = readFile(path.join(__dirname, '..', 'js', 'creative-brief.js'));
  if (assert(
    briefJs &&
      briefJs.includes("window.trackEvent('open_brief')") &&
      /function showStep\(step,\s*shouldFocus\)/.test(briefJs) &&
      /showStep\(1\);\s*$/m.test(briefJs) &&
      !briefJs.includes('midjourney.com') &&
      !briefJs.includes('leonardo.ai'),
    'js/creative-brief.js: open_brief, init showStep(1) be focus, ChatGPT/Ideogram allowlist'
  )) passed++;
  else failed++;
  if (assert(enHtml !== null && enHtml.includes('href="../styles/tokens.css"'), 'en/index.html – santykinis kelias į design tokens')) passed++;
  else failed++;
  if (assert(ltHtml !== null && ltHtml.includes('href="../styles/tokens.css"'), 'lt/index.html – santykinis kelias į design tokens')) passed++;
  else failed++;

  // --- EN puslapis: regresija – matomas turinys be LT likučių (build + EN_REPLACEMENTS) ---
  if (enHtml) {
    if (assert(
      enHtml.includes('data-teaser-prompt="9"') &&
      enHtml.includes('id="pro-contents"') &&
      enHtml.includes('Pillar + subtopics') &&
      enHtml.includes('Full prompt bodies offline in Pro'),
      'en/index.html: prompt 9 yra Pro catalog EN'
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
      enHtml.includes('Plan → Create → Check → Improve'),
      'en/index.html: upgrade aiškinamieji blokai EN kalba'
    )) passed++;
    else failed++;
    const enMemeSlotCount = (enHtml.match(/id="meme-slot-\d+"/g) || []).length;
    const ltMemeSlotCount = ltHtml ? (ltHtml.match(/id="meme-slot-\d+"/g) || []).length : 0;
    if (assert(
      enHtml.includes('Frequently asked questions') &&
      !enHtml.includes('Frequently asked questions before you start') &&
      enMemeSlotCount === 0 &&
      ltMemeSlotCount === 0 &&
      !enHtml.includes('meme-lesson') &&
      !enHtml.includes('meme-caption') &&
      ltHtml &&
      !ltHtml.includes('meme-lesson') &&
      !ltHtml.includes('meme-caption'),
      `lt/en index.html: 0 meme slotų (LT: ${ltMemeSlotCount}, EN: ${enMemeSlotCount})`
    )) passed++;
    else failed++;
    if (assert(
      enHtml.includes('id="heroCtaBrief"') &&
      enHtml.includes('See pricing') &&
      enHtml.includes('Build my prompt') &&
      /id="heroCtaSpine"[^>]*href="#creative-brief"|href="#creative-brief"[^>]*id="heroCtaSpine"/.test(enHtml) &&
      !enHtml.includes('Start with Prompt 1') &&
      !enHtml.includes('Start your first workflow') &&
      !enHtml.includes('Start the builder') &&
      enHtml.includes('id="heroTrustPill1"') &&
      enHtml.includes('Free to start') &&
      enHtml.includes('No sign-up') &&
      enHtml.includes('Reusable workflows') &&
      enHtml.includes('id="heroProof"') &&
      enHtml.includes('Free below — no account.') &&
      enHtml.includes('hero-diagram') &&
      enHtml.includes('hero-sample') &&
      enHtml.includes('hero-sample-image') &&
      enHtml.includes('hero-diagram__card--photo') &&
      enHtml.includes('brief-sample-satori.png') &&
      enHtml.includes('From brief → image prompt') &&
      !enHtml.includes('hero-diagram__outputs') &&
      !enHtml.includes('cycle-stepper') &&
      !enHtml.includes('cmo-provider-hub') &&
      !enHtml.includes('id="framework-schema"') &&
      !enHtml.includes('id="progressJumpSafety"') &&
      enHtml.includes('id="progressJumpCreative"') &&
      enHtml.includes('Copy → paste into ChatGPT or Claude') &&
      !enHtml.includes('id="howItWorksCta"') &&
      enHtml.includes('You used 0 of 4 workflows') &&
      assertSpinePrimaryHero(enHtml) &&
      assertSpineFirstOrder(enHtml, 'id="creative-brief"') &&
      enHtml.includes('id="pro-contents"') &&
      !enHtml.includes('prompt--teaser') &&
      enHtml.indexOf('id="creative-brief"') < enHtml.indexOf('id="pdf-storefront"') &&
      enHtml.indexOf('id="pdf-storefront"') < enHtml.indexOf('id="block1"') &&
      enHtml.indexOf('id="block1"') < enHtml.indexOf('id="block2"') &&
      enHtml.indexOf('id="pdf-storefront"') < enHtml.indexOf('id="faq"') &&
      !/Iš |Autoriteto/.test(enHtml),
      'en/index.html: tool-first CEO IA — open brief → 2 kits → library 1/2/3/5 + FAQ'
    )) passed++;
    else failed++;
    if (assert(
      /href="#pdf-storefront"\s+id="progressJumpPro"/.test(enHtml) ||
        /id="progressJumpPro"[^>]*href="#pdf-storefront"/.test(enHtml),
      'en/index.html: progressJumpPro uses Pricing link to #pdf-storefront'
    )) passed++;
    else failed++;
    if (assert(
      ltHtml &&
      !ltHtml.includes('id="heroCtaBrief"') &&
      ltHtml.includes('id="heroCtaSpine"') &&
      !ltHtml.includes('id="creative-brief"'),
      'lt/index.html: be hero brief CTA ir #creative-brief; spine CTA lieka'
    )) passed++;
    else failed++;

    // --- Creative brief builder (EN-only free tool; mirror OK) ---
    const creativeBriefCount = (enHtml.match(/id="creative-brief"/g) || []).length;
    if (assert(creativeBriefCount === 1, `en/index.html: tiksliai 1 #creative-brief (rasta: ${creativeBriefCount})`)) passed++;
    else failed++;
    if (assert(
      enHtml.includes('id="cbOutput"') &&
      enHtml.includes('id="cbQuality"') &&
      enHtml.includes('data-cb-preset="ecommerce"') &&
      enHtml.includes('id="progressJumpCreative"') &&
      enHtml.includes('id="cb-builder"') &&
      /id="cb-builder"[^>]*\bopen\b/.test(enHtml) &&
      enHtml.includes('Brief builder') &&
      (enHtml.includes('js/creative-brief.js') || enHtml.includes('../js/creative-brief.js')) &&
      !enHtml.includes('midjourney.com') &&
      !enHtml.includes('leonardo.ai'),
      'en/index.html: creative brief open builder + ChatGPT/Ideogram tools only'
    )) passed++;
    else failed++;
    if (assert(!ltHtml.includes('id="creative-brief"'), 'lt/index.html: NE-turi #creative-brief')) passed++;
    else failed++;

    // --- Spine display number ≠ internal id (Improve is display 4 / #prompt5) ---
    if (assert(
      !html.includes("setText('#prompt1Recommended', 'Start here')") &&
      !html.includes('function renderEditHints') &&
      !html.includes('function renderPromptTags') &&
      !html.includes('initPromptCollapse') &&
      !html.includes('initPdfPreviewLightbox') &&
      html.includes('promptDataById') &&
      html.includes('/^prompt(\\d+)$/') &&
      !/enPromptPre\[num\s*-\s*1\]/.test(html),
      'index.html: spine locale keys by pre.id; dead renderEditHints/Tags/collapse/lightbox gone'
    )) passed++;
    else failed++;
    {
      const p5 = enHtml.indexOf('id="prompt5"');
      const articleStart = p5 === -1 ? -1 : enHtml.lastIndexOf('<article class="prompt"', p5);
      const titleNear = p5 === -1 ? -1 : enHtml.lastIndexOf('Daily analysis (Action→Decision)', p5);
      const number4Near = articleStart === -1 ? -1 : enHtml.indexOf('<div class="number">4</div>', articleStart);
      if (assert(
        p5 !== -1 &&
        articleStart !== -1 &&
        titleNear > articleStart &&
        titleNear < p5 &&
        number4Near > articleStart &&
        number4Near < p5 &&
        enHtml.includes('Workflow 1 of 4') &&
        !enHtml.includes("setText('#prompt1Recommended', 'Start here')"),
        'en/index.html: Improve card is display 4 + #prompt5 Daily analysis; Workflow 1 of 4'
      )) passed++;
      else failed++;
    }

    const rememberHits = (enHtml.match(/Remember to replace/g) || []).length;
    const ecoListMatch = enHtml.match(/<ul class="ecosystem-strip-list"[^>]*>([\s\S]*?)<\/ul>/);
    const ecoLiCount = ecoListMatch ? (ecoListMatch[1].match(/<li\b/g) || []).length : 0;
    const ecoListInner = ecoListMatch ? ecoListMatch[1] : '';
    if (assert(
      html.includes('id="footerSignoff"') &&
      html.includes('id="footerPlaceholderHint"') &&
      html.includes('id="footer-product-link"') &&
      !html.includes("qa('.footer p')") &&
      !enHtml.includes("qa('.footer p')") &&
      !html.includes('footP[0]') &&
      !enHtml.includes('footP[0]') &&
      !html.includes('footH3') &&
      !enHtml.includes('footH3') &&
      html.includes("q('.footer > h3')") &&
      rememberHits === 0 &&
      !enHtml.includes('id="footerSignoff"') &&
      !enHtml.includes('id="footerPlaceholderHint"') &&
      !enHtml.includes('Go win your market') &&
      !/<div class="tags" role="list">/.test(enHtml) &&
      ltHtml.includes('id="footerSignoff"') &&
      !/\bid="footerSignoff"[^>]*\bhidden\b/.test(ltHtml) &&
      ltHtml.includes('Sėkmės rinkodaroje'),
      'EN footer: workbook chrome stripped; LT sign-off stays visible; no p-index overwrite'
    )) passed++;
    else failed++;
    if (assert(
      ecoLiCount === 1 &&
      ecoListInner.includes('promptanatomy.app') &&
      !ecoListInner.includes('t.me/prompt_anatomy') &&
      !ecoListInner.includes('mailto:info@promptanatomy.app') &&
      enHtml.includes('id="community"') &&
      enHtml.includes('t.me/prompt_anatomy') &&
      enHtml.includes('class="footer-email"') &&
      enHtml.includes('mailto:info@promptanatomy.app') &&
      !enHtml.includes('<p class="cmo-footer-crosslink"') &&
      enHtml.includes('ecosystem-strip-related') &&
      enHtml.includes('href="https://ditreneris.github.io/leader/en/"'),
      'EN: ecosystem methodology only; Telegram in community; email in footer; one Leader related'
    )) passed++;
    else failed++;
    if (assert(
      !enHtml.includes('Training material') &&
      /<div class="copyright">[\s\S]*?href="\/en\/privacy\/"/.test(enHtml) &&
      enHtml.includes('Tomas Staniulis. All rights reserved.'),
      'EN copyright: no Training material; Privacy href /en/privacy/'
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
    if (assert(expectedCount === 4, `en/index.html: tiksliai 4 .prompt-expected blokai (spine) (rasta: ${expectedCount})`)) passed++;
    else failed++;
    let allExpectedHaveBullets = true;
    for (const i of FREE_SPINE_IDS) {
      const re = new RegExp(`id="expected${i}"[\\s\\S]*?</ul>`);
      const m = enHtml.match(re);
      const liCount = m ? (m[0].match(/<li/g) || []).length : 0;
      if (liCount < 3) {
        allExpectedHaveBullets = false;
        break;
      }
    }
    if (assert(allExpectedHaveBullets, 'en/index.html: kiekvienas spine .prompt-expected turi >=2 bullet (be antraštės)')) passed++;
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
      enHtml.includes('data-version="' + pkgVer + '"') && enHtml.includes('Content AI System v' + pkgVer),
      'en/index.html: footer versijos žyma sutampa su package.json'
    )) passed++;
    else failed++;
    if (assert(
      enHtml.includes('href="https://ditreneris.github.io/leader/en/"'),
      'en/index.html: kryžminė nuoroda į Leader rinkinį'
    )) passed++;
    else failed++;
    if (assert(
      enHtml.includes('Part of Prompt Anatomy') &&
        enHtml.includes('Methodology at') &&
        enHtml.includes('utm_source=space') &&
        enHtml.includes('utm_medium=entity_footer'),
      'en/index.html: QW1b entity footer + UTM space'
    )) passed++;
    else failed++;
    if (assert(
      !enHtml.includes('Training & checkout'),
      'en/index.html: footer must not send checkout to .app'
    )) passed++;
    else failed++;
    if (assert(
      !enHtml.includes('Spin-off No. 2'),
      'en/index.html: nėra Spin-off No. 2 (entity footer kanonas)'
    )) passed++;
    else failed++;
    if (assert(
      !enHtml.includes('cmo-provider-hub') &&
      !enHtml.includes('gemini.google.com'),
      'en/index.html: provider hub pašalintas (path cut)'
    )) passed++;
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
        ltHtml.includes('data-version="' + pkgVer + '"') && ltHtml.includes('Turinio DI sistema v' + pkgVer),
        'lt/index.html: footer versijos žyma sutampa su package.json'
      )) passed++;
      else failed++;
      if (assert(
        ltHtml.includes('href="https://ditreneris.github.io/leader/en/"'),
        'lt/index.html: kryžminė nuoroda į Leader rinkinį'
      )) passed++;
      else failed++;
      if (assert(
        !ltHtml.includes('cmo-provider-hub') &&
        !ltHtml.includes('gemini.google.com'),
        'lt/index.html: provider hub pašalintas (path cut)'
      )) passed++;
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
    `${PROD_ORIGIN}${PROD_BASE}/en/privacy/`,
    `${PROD_ORIGIN}${PROD_BASE}/terms/`
  ];
  if (assert(robotsTxt !== null && robotsTxt.includes(`Sitemap: ${expectedSitemapUrl}`), 'robots.txt rodo teisingą sitemap URL')) passed++;
  else failed++;
  if (robotsTxt) {
    if (assert(robotsTxt.includes('User-agent: GPTBot'), 'robots.txt: GPTBot policy')) passed++;
    else failed++;
    if (assert(robotsTxt.includes('User-agent: OAI-SearchBot'), 'robots.txt: OAI-SearchBot allow')) passed++;
    else failed++;
    if (assert(robotsTxt.includes('Disallow: /api/'), 'robots.txt: /api/ disallow')) passed++;
    else failed++;
  }
  if (assert(sitemapXml !== null, 'sitemap.xml egzistuoja')) passed++;
  else failed++;
  if (sitemapXml) {
    if (assert(sitemapXml.includes('xmlns:image='), 'sitemap.xml: image namespace')) passed++;
    else failed++;
    if (assert(sitemapXml.includes('<lastmod>'), 'sitemap.xml: lastmod entries')) passed++;
    else failed++;
    if (assert(sitemapXml.includes('/terms/'), 'sitemap.xml: /terms/ URL')) passed++;
    else failed++;
    for (const loc of expectedSitemapLocs) {
      if (assert(sitemapXml.includes(`<loc>${loc}</loc>`), `sitemap.xml turi URL: ${loc}`)) passed++;
      else failed++;
    }
  }

  // --- v1.6.0: paid PDF storefront (EN-only, primary host) ---
  const SUCCESS_PATH = path.join(__dirname, '..', 'success.html');
  const TERMS_PATH = path.join(__dirname, '..', 'terms.html');
  const COMING_SOON_PATH = path.join(__dirname, '..', 'coming-soon.html');
  const SOT_PATH = path.join(__dirname, '..', 'config', 'sot.json');

  const enHtmlForCommerce = readFile(EN_INDEX_PATH);
  const ltHtmlForCommerce = readFile(LT_INDEX_PATH);
  const sotRaw = readFile(SOT_PATH);
  let sot = null;
  try { sot = sotRaw ? JSON.parse(sotRaw) : null; } catch (_) { sot = null; }

  if (assert(sot !== null, 'config/sot.json: yra ir parseable JSON')) passed++;
  else failed++;
  if (sot) {
    if (assert(sot.commerce && sot.commerce.scope === 'en-only', 'sot.json: commerce.scope === "en-only"')) passed++;
    else failed++;
    if (assert(Array.isArray(sot.commerce.products) && sot.commerce.products.length === 3, 'sot.json: products = 3 (starter + pro + bundle)')) passed++;
    else failed++;
    const starter = sot.commerce.products && sot.commerce.products.find((p) => p.id === 'starter');
    const pro = sot.commerce.products && sot.commerce.products.find((p) => p.id === 'pro');
    const bundle = sot.commerce.products && sot.commerce.products.find((p) => p.id === 'bundle');
    if (assert(starter && Number(starter.priceUsd) === 3.99 && Number(starter.priceCents) === 399, 'sot.json: starter price 3.99 / 399 cents')) passed++;
    else failed++;
    if (assert(pro && Number(pro.priceUsd) === 8.99 && Number(pro.priceCents) === 899, 'sot.json: pro price 8.99 / 899 cents')) passed++;
    else failed++;
    if (assert(bundle && Number(bundle.priceUsd) === 10.99 && Number(bundle.priceCents) === 1099, 'sot.json: bundle price 10.99 / 1099 cents')) passed++;
    else failed++;
    if (assert(starter && starter.pages === 14 && pro && pro.pages === 30, 'sot.json: starter 14 pages, pro 30 pages')) passed++;
    else failed++;
    if (assert(sot.commerce.comparisonTable && Array.isArray(sot.commerce.comparisonTable.rows), 'sot.json: comparisonTable.rows')) passed++;
    else failed++;
    if (assert(typeof sot.commerce.allowPlaceholderCheckout === 'boolean', 'sot.json: allowPlaceholderCheckout is boolean')) passed++;
    else failed++;
    if (assert(typeof sot.commerce.placeholderHref === 'string' && sot.commerce.placeholderHref.length > 0, 'sot.json: placeholderHref set')) passed++;
    else failed++;
    if (assert(sot.site && sot.site.host === 'promptanatomy.space', 'sot.json: primary host is promptanatomy.space')) passed++;
    else failed++;
    if (assert(sot.site && sot.site.mirror && sot.site.mirror.renderPaidStorefront === false, 'sot.json: mirror.renderPaidStorefront === false')) passed++;
    else failed++;
  }

  if (enHtmlForCommerce) {
    if (assert(enHtmlForCommerce.includes('id="pdf-storefront"'), 'en/index.html: yra #pdf-storefront')) passed++;
    else failed++;
    if (assert(enHtmlForCommerce.includes('$3.99'), 'en/index.html: storefront rodo $3.99')) passed++;
    else failed++;
    if (assert(enHtmlForCommerce.includes('$8.99'), 'en/index.html: storefront rodo $8.99')) passed++;
    else failed++;
    if (assert(enHtmlForCommerce.includes('$10.99'), 'en/index.html: storefront rodo $10.99')) passed++;
    else failed++;
    if (assert(
      (function () {
        const bundleBlock = enHtmlForCommerce.match(/id="pdf-card-bundle"[\s\S]*?<\/article>/);
        return (
          bundleBlock &&
          bundleBlock[0].includes('$10.99') &&
          bundleBlock[0].includes('separately $12.98') &&
          !bundleBlock[0].includes('was $19.99')
        );
      })(),
      'en/index.html: Complete kit shows $10.99 vs separately $12.98 (not was $19.99)'
    )) passed++;
    else failed++;
    if (assert(
      !enHtmlForCommerce.includes('pdf-comparison-table') &&
      !enHtmlForCommerce.includes('pdf-storefront-compare'),
      'en/index.html: comparison table not rendered (path cut)'
    )) passed++;
    else failed++;
    if (assert(
      /class="pdf-storefront-trust"[\s\S]*?href="\/en\/privacy\/"/.test(enHtmlForCommerce) &&
      !enHtmlForCommerce.includes('../en/privacy.html') &&
      /class="pdf-storefront-trust"[\s\S]*?href="\/terms\/#paid-pdf-license"/.test(enHtmlForCommerce),
      'en/index.html: storefront trust Privacy /en/privacy/; Team license /terms/'
    )) passed++;
    else failed++;
    if (assert(enHtmlForCommerce.includes('class="pdf-card"'), 'en/index.html: bent viena .pdf-card')) passed++;
    else failed++;
    if (assert(
      enHtmlForCommerce.includes('id="pdf-card-starter"') &&
        enHtmlForCommerce.includes('id="pdf-card-pro"') &&
        enHtmlForCommerce.includes('id="pdf-card-bundle"'),
      'en/index.html: dvi matomos kortelės + Pro nuoroda (starter + bundle + pdf-card-pro)'
    )) passed++;
    else failed++;
    const allowPlaceholder = sot && sot.commerce ? sot.commerce.allowPlaceholderCheckout : null;
    const liveStarter = sot && sot.commerce && sot.commerce.stripePaymentLinks ? String(sot.commerce.stripePaymentLinks.starter || '') : '';
    const livePro = sot && sot.commerce && sot.commerce.stripePaymentLinks ? String(sot.commerce.stripePaymentLinks.pro || '') : '';
    const liveBundle = sot && sot.commerce && sot.commerce.stripePaymentLinks ? String(sot.commerce.stripePaymentLinks.bundle || '') : '';
    if (
      allowPlaceholder === true &&
      (!/^https:\/\/buy\.stripe\.com\//.test(liveStarter) ||
        !/^https:\/\/buy\.stripe\.com\//.test(livePro) ||
        !/^https:\/\/buy\.stripe\.com\//.test(liveBundle))
    ) {
      if (assert(enHtmlForCommerce.includes('href="/coming-soon.html"'), 'en/index.html: placeholder režimas - CTA rodo į /coming-soon.html')) passed++;
      else failed++;
      if (assert(!enHtmlForCommerce.includes('https://buy.stripe.com/'), 'en/index.html: placeholder režimas - JOKIŲ buy.stripe.com nuorodų storefronte')) passed++;
      else failed++;
    } else {
      if (assert(/href="https:\/\/buy\.stripe\.com\/[^"]+"/.test(enHtmlForCommerce), 'en/index.html: live režimas - storefront turi buy.stripe.com nuorodas')) passed++;
      else failed++;
      const stripeLinks = enHtmlForCommerce.match(/https:\/\/buy\.stripe\.com\/[^"]+/g) || [];
      if (assert(stripeLinks.length >= 3, 'en/index.html: live režimas - 3 Stripe Payment Links (starter + pro + bundle)')) passed++;
      else failed++;
    }
    if (assert(enHtmlForCommerce.includes('class="no-print"') || enHtmlForCommerce.includes('pdf-storefront no-print'), 'en/index.html: storefront turi no-print klasę')) passed++;
    else failed++;
    if (assert(enHtmlForCommerce.includes('cmo-starter-cover.png'), 'en/index.html: Starter cover PNG (WYSIWYG)')) passed++;
    else failed++;
    if (assert(
      enHtmlForCommerce.includes('class="pdf-pro-alt"') &&
        enHtmlForCommerce.includes('id="pdf-card-pro"') &&
        /buy\.stripe\.com\/[^"]*G0c/.test(enHtmlForCommerce),
      'en/index.html: Pro yra tekstinė nuoroda (ne trečia kortelė), Stripe G0c gyvas'
    )) passed++;
    else failed++;
    if (assert(
      !enHtmlForCommerce.includes('cmo-starter-cover.svg'),
      'en/index.html: Starter nebe naudoja cover SVG'
    )) passed++;
    else failed++;
    if (assert(
      (function () {
        const proBlock = enHtmlForCommerce.match(/id="pdf-card-pro"[\s\S]*?<\/p>/);
        return (
          proBlock &&
          proBlock[0].includes('pdf-pro-alt') &&
          !proBlock[0].includes('cmo-pro-cover.png') &&
          !proBlock[0].includes('<article')
        );
      })(),
      'en/index.html: Pro alt eilutė be cover ir be article kortelės'
    )) passed++;
    else failed++;
    if (assert(
      !/alt="[^"]*cover, \$/.test(enHtmlForCommerce),
      'en/index.html: cover alt neturi kainos'
    )) passed++;
    else failed++;
  }

  if (ltHtmlForCommerce) {
    if (assert(!ltHtmlForCommerce.includes('id="pdf-storefront"'), 'lt/index.html: NE-turi #pdf-storefront (commerce yra EN-only)')) passed++;
    else failed++;
    if (assert((function () {
      const visible = String(ltHtmlForCommerce).replace(/<script[\s\S]*?<\/script>/gi, '');
      return !visible.includes('$3.99') && !visible.includes('$8.99') && !visible.includes('$10.99');
    })(), 'lt/index.html: NE-rodo commerce kainų')) passed++;
    else failed++;
    if (assert(!/buy\.stripe\.com/.test(ltHtmlForCommerce), 'lt/index.html: NE-turi buy.stripe.com nuorodų')) passed++;
    else failed++;
  }

  const successHtml = readFile(SUCCESS_PATH);
  if (assert(successHtml !== null, 'success.html: failas egzistuoja')) passed++;
  else failed++;
  if (successHtml) {
    if (assert(/<meta name="robots" content="noindex/.test(successHtml), 'success.html: noindex robots meta')) passed++;
    else failed++;
    if (assert(successHtml.includes('/api/download-link'), 'success.html: kviečia /api/download-link endpoint\u0105')) passed++;
    else failed++;
    if (assert(successHtml.includes('aria-live'), 'success.html: aria-live region polling statusui')) passed++;
    else failed++;
    if (assert(successHtml.includes('session_id'), 'success.html: skaito session_id iš URL')) passed++;
    else failed++;
    if (assert(
      successHtml.includes('downloadUrl || json.url') || successHtml.includes('json.downloadUrl || json.url'),
      'success.html: bindina downloadUrl arba LEGACY url'
    )) passed++;
    else failed++;
  }

  const termsHtml = readFile(TERMS_PATH);
  if (assert(termsHtml !== null, 'terms.html: failas egzistuoja')) passed++;
  else failed++;
  if (termsHtml) {
    if (assert(termsHtml.includes('id="paid-pdf-license"'), 'terms.html: yra #paid-pdf-license sekcija')) passed++;
    else failed++;
    if (assert(
      termsHtml.includes('href="https://promptanatomy.space/terms/"') &&
        termsHtml.includes('href="/styles/tokens.css"') &&
        termsHtml.includes('href="/en/privacy/"'),
      'terms.html: canonical /terms/; root-absolute assets; Privacy /en/privacy/'
    )) passed++;
    else failed++;
    if (assert(termsHtml.includes('14-day'), 'terms.html: paminėtas 14-day refund')) passed++;
    else failed++;
    if (assert(termsHtml.includes('promptanatomy.space'), 'terms.html: rodomas tikrasis host (promptanatomy.space)')) passed++;
    else failed++;
    if (assert(termsHtml.includes('$3.99') && termsHtml.includes('$8.99'), 'terms.html: produktų kainos $3.99 / $8.99')) passed++;
    else failed++;
  }

  const publicPrivacyIndex = readFile(path.join(__dirname, '..', 'public', 'en', 'privacy', 'index.html'));
  const publicTermsIndex = readFile(path.join(__dirname, '..', 'public', 'terms', 'index.html'));
  if (assert(
    publicPrivacyIndex !== null &&
      publicPrivacyIndex.includes('id="paid-pdf-data"') &&
      publicPrivacyIndex.includes('Stripe'),
    'public/en/privacy/index.html: Pages slash index + paid-pdf-data / Stripe'
  )) passed++;
  else failed++;
  if (assert(
    publicTermsIndex !== null && publicTermsIndex.includes('id="paid-pdf-license"'),
    'public/terms/index.html: Pages slash index + paid-pdf-license'
  )) passed++;
  else failed++;

  const comingSoonHtml = readFile(COMING_SOON_PATH);
  if (assert(comingSoonHtml !== null, 'coming-soon.html: failas egzistuoja')) passed++;
  else failed++;
  if (comingSoonHtml) {
    if (assert(/<meta name="robots" content="noindex/.test(comingSoonHtml), 'coming-soon.html: noindex robots meta')) passed++;
    else failed++;
    if (assert(
      comingSoonHtml.includes('href="/terms/#paid-pdf-license"') &&
        comingSoonHtml.includes('href="/en/privacy/"'),
      'coming-soon.html: legal links use slash URLs'
    )) passed++;
    else failed++;
    if (assert(comingSoonHtml.includes('$3.99') && comingSoonHtml.includes('$8.99'), 'coming-soon.html: rodo $3.99 / $8.99 kainas')) passed++;
    else failed++;
    if (assert(comingSoonHtml.includes('mailto:info@promptanatomy.app'), 'coming-soon.html: notify-me CTA per mailto')) passed++;
    else failed++;
  }

  const enPrivacyForCommerce = readFile(EN_PRIVACY_PATH);
  if (enPrivacyForCommerce) {
    if (assert(enPrivacyForCommerce.includes('id="paid-pdf-data"'), 'en/privacy.html: yra #paid-pdf-data sekcija (paid PDF processors)')) passed++;
    else failed++;
    if (assert(enPrivacyForCommerce.includes('Stripe') && enPrivacyForCommerce.includes('Resend') && enPrivacyForCommerce.includes('Upstash') && enPrivacyForCommerce.includes('Vercel Blob'), 'en/privacy.html: Stripe / Resend / Upstash / Vercel Blob procesoriai išvardinti')) passed++;
    else failed++;
  }
  const ltPrivacyForCommerce = readFile(LT_PRIVACY_PATH);
  if (ltPrivacyForCommerce) {
    if (assert(!/Stripe|Resend|Upstash|Vercel Blob/i.test(ltPrivacyForCommerce), 'lt/privatumas.html: NE-mini Stripe/Resend/Upstash/Vercel Blob (LT lieka nepaliesta)')) passed++;
    else failed++;
  }

  // --- GEO surfaces (llms, IndexNow, manifest, 404) ---
  const INDEXNOW_KEY = 'a9f3c2e1b8d7a6f5e4c3b2a1f0e9d8c7';
  const llmsTxt = readFile(path.join(__dirname, '..', 'llms.txt'));
  const llmsFullTxt = readFile(path.join(__dirname, '..', 'llms-full.txt'));
  const indexNowTxt = readFile(path.join(__dirname, '..', INDEXNOW_KEY + '.txt'));
  const manifestJson = readFile(path.join(__dirname, '..', 'manifest.webmanifest'));
  const notFoundHtml = readFile(path.join(__dirname, '..', '404.html'));

  if (assert(llmsTxt !== null && llmsTxt.includes('/en/privacy/') && llmsTxt.includes('/terms/'), 'llms.txt: Policies slash URLs')) passed++;
  else failed++;
  if (assert(llmsTxt !== null && llmsTxt.includes('Plan → Create → Check → Improve'), 'llms.txt: cycle summary')) passed++;
  else failed++;
  if (assert(llmsTxt !== null && llmsTxt.includes('#cmo-safety') && llmsTxt.includes('#pdf-storefront'), 'llms.txt: hash hubs #cmo-safety + #pdf-storefront')) passed++;
  else failed++;
  if (assert(llmsTxt !== null && llmsTxt.includes('#pro-contents'), 'llms.txt: hash hub #pro-contents')) passed++;
  else failed++;
  if (assert(
    llmsTxt !== null &&
    llmsTxt.indexOf('#creative-brief') !== -1 &&
    llmsTxt.indexOf('#block1') !== -1 &&
    llmsTxt.indexOf('#creative-brief') < llmsTxt.indexOf('#block1') &&
    !llmsTxt.includes('start spine'),
    'llms.txt: tool-first hubs — #creative-brief before #block1'
  )) passed++;
  else failed++;
  if (assert(llmsFullTxt !== null && llmsFullTxt.includes('10 prompts'), 'llms-full.txt: prompt digest')) passed++;
  else failed++;
  if (assert(indexNowTxt !== null && indexNowTxt.trim() === INDEXNOW_KEY, 'IndexNow key file hosted')) passed++;
  else failed++;
  if (assert(manifestJson !== null && manifestJson.includes('"start_url": "/en/"'), 'manifest.webmanifest: start_url /en/')) passed++;
  else failed++;
  if (assert(notFoundHtml !== null && notFoundHtml.includes('noindex,follow'), '404.html: noindex,follow')) passed++;
  else failed++;

  if (enHtmlForCommerce) {
    if (assert(enHtmlForCommerce.includes('"@graph"'), 'en/index.html: JSON-LD @graph')) passed++;
    else failed++;
    if (assert(enHtmlForCommerce.includes('"@type":"Product"'), 'en/index.html: Product schema')) passed++;
    else failed++;
    if (assert(!enHtmlForCommerce.includes('aggregateRating'), 'en/index.html: no fake aggregateRating')) passed++;
    else failed++;
  }

  if (sot && sot.brand) {
    if (assert(sot.brand.publicName === 'Prompt Anatomy', 'sot.json: brand.publicName')) passed++;
    else failed++;
    if (assert(Array.isArray(sot.frontFaq) && sot.frontFaq.length >= 8, 'sot.json: frontFaq >= 8 for GEO JTBD')) passed++;
    else failed++;
    if (assert(Array.isArray(sot.frontFaq) && sot.frontFaq.length === 11, 'sot.json: frontFaq length === 11 (visible EN FAQ)')) passed++;
    else failed++;
    const frontFaqBlob = JSON.stringify(sot.frontFaq);
    if (assert(!/Midjourney/i.test(frontFaqBlob) && !/Pro teasers/i.test(frontFaqBlob), 'sot.json: frontFaq has no Midjourney / Pro teasers')) passed++;
    else failed++;
    if (enHtmlForCommerce) {
      if (assert(!/Midjourney/i.test(enHtmlForCommerce) && !/Pro teasers/i.test(enHtmlForCommerce), 'en/index.html: no Midjourney / Pro teasers')) passed++;
      else failed++;
      const faqSection = enHtmlForCommerce.match(/<section[^>]*id="faq"[^>]*>[\s\S]*?<\/section>/);
      const faqHtml = faqSection ? faqSection[0] : '';
      const missingFaqQs = sot.frontFaq.filter(function (item) {
        return faqHtml.indexOf('<summary>' + item.q + '</summary>') === -1;
      });
      if (assert(missingFaqQs.length === 0, 'en/index.html #faq: every frontFaq.q is a summary')) passed++;
      else failed++;
      const faqText = faqHtml.replace(/<[^>]+>/g, '');
      const missingFaqAs = sot.frontFaq.filter(function (item) {
        return faqText.indexOf(item.a) === -1;
      });
      if (assert(missingFaqAs.length === 0, 'en/index.html #faq: every frontFaq.a appears in FAQ text')) passed++;
      else failed++;
    }
    if (assert(
      html.includes('ChatGPT or Ideogram') &&
        !/ChatGPT, Ideogram, Midjourney/.test(html),
      'index.html applyStaticLocaleText: brief FAQ is Ideogram, not Midjourney'
    )) passed++;
    else failed++;
  }

  if (enHtmlForCommerce) {
    if (assert(enHtmlForCommerce.includes('id="heroCtaSpine"'), 'en/index.html: #heroCtaSpine primary path')) passed++;
    else failed++;
    if (assert(
      enHtmlForCommerce.includes('id="siteNav"') &&
        enHtmlForCommerce.includes('id="navWorkflows"') &&
        enHtmlForCommerce.includes('id="navBrief"') &&
        enHtmlForCommerce.includes('id="navPricing"') &&
        (/<a[^>]*id="navPricing"[^>]*href="#pdf-storefront"/.test(enHtmlForCommerce) ||
          /<a[^>]*href="#pdf-storefront"[^>]*id="navPricing"/.test(enHtmlForCommerce)),
      'en/index.html: sticky site nav exposes Pricing without scroll'
    )) passed++;
    else failed++;
    if (assert(
      (function () {
        const start = enHtmlForCommerce.indexOf('<header class="header">');
        const end = enHtmlForCommerce.indexOf('</header>', start);
        if (start === -1 || end === -1) return false;
        const headerChunk = enHtmlForCommerce.slice(start, end);
        const siteNav = enHtmlForCommerce.indexOf('id="siteNav"');
        return siteNav !== -1 && headerChunk.indexOf('id="siteNav"') === -1 && siteNav < start;
      })(),
      'en/index.html: #siteNav is a sibling above .header, not inside it'
    )) passed++;
    else failed++;
    if (assert(
      ltHtmlForCommerce && !ltHtmlForCommerce.includes('id="siteNav"'),
      'lt/index.html: NE-turi #siteNav'
    )) passed++;
    else failed++;
    if (assert(
      !/4 core interactive prompts \(1,\s*2,\s*3,\s*4,\s*5/.test(enHtmlForCommerce) &&
      !/free interactive (prompts )?10/i.test(enHtmlForCommerce) &&
      !/10 core interactive/i.test(enHtmlForCommerce),
      'en/index.html: does not claim free interactive 10'
    )) passed++;
    else failed++;
    if (assert(enHtmlForCommerce.includes('id="faq-tool-sprawl"') && enHtmlForCommerce.includes('id="faq-brand-voice"'), 'en/index.html: JTBD FAQ ids')) passed++;
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
