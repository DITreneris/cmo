'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const LT_INDEX = path.join(ROOT, 'lt', 'index.html');
const EN_INDEX = path.join(ROOT, 'en', 'index.html');
const TOKENS = path.join(ROOT, 'styles', 'tokens.css');
const COMPONENTS = path.join(ROOT, 'styles', 'components.css');
const UTILITIES = path.join(ROOT, 'styles', 'utilities.css');
const TOKEN_JSON = path.join(ROOT, 'styles', 'design-tokens.json');
const FAVICON_SVG = path.join(ROOT, 'favicon.svg');
const WEBMANIFEST = path.join(ROOT, 'site.webmanifest');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}

function run() {
  const html = read(INDEX);
  const ltHtml = read(LT_INDEX);
  const enHtml = read(EN_INDEX);
  const tokensCss = read(TOKENS);
  const componentsCss = read(COMPONENTS);
  const utilitiesCss = read(UTILITIES);
  const tokenJson = JSON.parse(read(TOKEN_JSON));

  assert(html.includes('href="styles/tokens.css"'), 'index.html missing tokens.css import');
  assert(html.includes('href="styles/components.css"'), 'index.html missing components.css import');
  assert(html.includes('href="styles/utilities.css"'), 'index.html missing utilities.css import');
  assert(ltHtml.includes('href="../styles/tokens.css"'), 'lt/index.html missing tokens.css import');
  assert(ltHtml.includes('href="../styles/components.css"'), 'lt/index.html missing components.css import');
  assert(ltHtml.includes('href="../styles/utilities.css"'), 'lt/index.html missing utilities.css import');
  assert(enHtml.includes('href="../styles/tokens.css"'), 'en/index.html missing tokens.css import');
  assert(enHtml.includes('href="../styles/components.css"'), 'en/index.html missing components.css import');
  assert(enHtml.includes('href="../styles/utilities.css"'), 'en/index.html missing utilities.css import');

  assert(tokensCss.includes('--color-brand-primary'), 'tokens.css missing primary brand token');
  assert(tokensCss.includes('--focus-ring-width'), 'tokens.css missing focus ring token');
  assert(tokensCss.includes('--font-display'), 'tokens.css missing --font-display');
  assert(tokensCss.includes('--font-ui'), 'tokens.css missing --font-ui');
  assert(tokensCss.includes('--font-mono'), 'tokens.css missing --font-mono');
  assert(tokensCss.includes('--measure-prose'), 'tokens.css missing --measure-prose');
  assert(componentsCss.includes('.btn'), 'components.css missing button styles');
  assert(componentsCss.includes('.progress-wrap'), 'components.css missing progress styles');
  assert(
    /\.header-bar\s*\{[\s\S]*?position:\s*sticky/.test(componentsCss),
    'components.css .header-bar must be page-level sticky'
  );
  assert(componentsCss.includes('.surface-panel'), 'components.css missing surface-panel');
  assert(componentsCss.includes('.surface-accent'), 'components.css missing surface-accent');
  assert(componentsCss.includes('100vw'), 'components.css missing full-bleed hero width');
  assert(utilitiesCss.includes('.code-block:focus-visible'), 'utilities.css missing focus-visible rule');
  assert(utilitiesCss.includes('prefers-reduced-motion'), 'utilities.css missing reduced-motion utility');

  assert(Boolean(tokenJson.color && tokenJson.color.brand), 'design-tokens.json missing color.brand group');
  assert(Boolean(tokenJson.spacing), 'design-tokens.json missing spacing scale');
  assert(Boolean(tokenJson.radius), 'design-tokens.json missing radius scale');
  assert(Boolean(tokenJson.typography && tokenJson.typography.fontDisplay), 'design-tokens.json missing typography.fontDisplay');
  assert(Boolean(tokenJson.typography && tokenJson.typography.fontUi), 'design-tokens.json missing typography.fontUi');

  const faviconSvg = read(FAVICON_SVG).toLowerCase();
  assert(!faviconSvg.includes('#008579'), 'favicon.svg must not use legacy teal #008579');
  assert(
    faviconSvg.includes('#0b1320') || faviconSvg.includes('#cfa73a'),
    'favicon.svg must use mother-aligned ink or gold'
  );

  const primary = (tokenJson.color.brand.primary || '').toLowerCase();
  assert(primary === '#cfa73a', 'design-tokens.json brand.primary must be #CFA73A');
  assert(tokensCss.toLowerCase().includes(primary), 'tokens.css must include brand.primary hex');

  const bodySize = (tokenJson.typography.body || '').toLowerCase();
  assert(bodySize === '17px' || bodySize === '18px', 'design-tokens.json typography.body must be 17px or 18px');
  assert(tokensCss.includes('--font-size-body: ' + bodySize) || tokensCss.includes('--font-size-body:' + bodySize),
    'tokens.css --font-size-body must match design-tokens.json typography.body');

  const ctaShadow = tokenJson.shadow && tokenJson.shadow.cta;
  assert(Boolean(ctaShadow), 'design-tokens.json missing shadow.cta');
  assert(tokensCss.includes(ctaShadow.split(',')[0].trim()) || tokensCss.includes('rgba(11, 19, 32'),
    'tokens.css CTA shadow should be ink-tinted (synced with design-tokens.json)');

  assert(!/\.prompt\s*\{[^}]*border:\s*3px/s.test(componentsCss), 'components.css .prompt must not use border: 3px');
  assert(!/\.code-block\s*\{[^}]*border:\s*3px/s.test(componentsCss), 'components.css .code-block must not use border: 3px');
  assert(!html.includes("family=Inter"), 'index.html must not load Inter as primary font');
  assert(html.includes('Fraunces') || html.includes('family=Fraunces'), 'index.html must load Fraunces');
  assert(html.includes('Source+Sans+3') || html.includes('Source Sans 3'), 'index.html must load Source Sans 3');
  assert(enHtml.includes('header-visual') || html.includes('header-visual'), 'hero product visual missing');
  assert(
    html.includes('hero-diagram') || enHtml.includes('hero-diagram'),
    'hero workflow diagram (.hero-diagram) missing'
  );
  assert(
    enHtml.includes('hero-sample-image') &&
      enHtml.includes('brief-sample-satori.png') &&
      enHtml.includes('brief-sample-satori.webp') &&
      enHtml.includes('fetchpriority="high"'),
    'EN hero must show the Satori sample image with WebP and fetchpriority'
  );
  const pageHex = (tokenJson.color.surface.page || '').toLowerCase();
  assert(pageHex === '#f6f1e8', 'design-tokens.json surface.page must be warm paper #F6F1E8');
  assert(tokensCss.toLowerCase().includes('#f6f1e8'), 'tokens.css must include warm paper #F6F1E8');
  assert(!html.includes('cmo-pro-cover.png') || html.includes('hero-diagram'),
    'hero should prefer workflow diagram over PDF cover as primary visual');
  assert(
    html.includes('id="heroTrustPill1"') &&
      html.includes('id="heroTrustPill2"') &&
      html.includes('id="heroTrustPill3"'),
    'trust pill IDs must remain (1–3)'
  );
  assert(html.includes('id="heroProof"'), 'hero credibility line #heroProof missing');
  assert(!html.includes('hero-diagram__outputs'), 'hero diagram outputs row must be removed (path cut)');
  assert(!html.includes('cycle-stepper'), 'cycle-stepper must be removed from index.html (path cut)');
  assert(!html.includes('cmo-provider-hub'), 'provider hub must be removed from index.html (path cut)');
  assert(!componentsCss.includes('.cycle-stepper'), 'components.css must not keep dead .cycle-stepper');
  assert(!componentsCss.includes('.cmo-provider-hub'), 'components.css must not keep dead .cmo-provider-hub');
  assert(!html.includes('🔒') && !html.includes('📖'), 'decorative emoji chrome must be removed from index.html markup');
  assert(!html.includes('💡') && !html.includes('📋'), 'emoji chrome (info/copy) must be removed from index.html markup');
  assert(componentsCss.includes('.hero-diagram'), 'components.css missing .hero-diagram');
  assert(tokensCss.includes('--shadow-hero-diagram'), 'tokens.css missing --shadow-hero-diagram');
  assert(tokensCss.includes('--radius-xl: 16px') || tokensCss.includes('--radius-xl:16px'),
    'DS 1.6: --radius-xl must be 16px');

  const goldLinkOffenders = [
    '.progress-jump a',
    '.faq-more-details summary',
    '.value-grid-details summary',
    '.instructions-faq-hint a',
    '.cmo-footer-crosslink a',
    '.pdf-storefront-trust a',
    '.ecosystem-strip-list a',
    '.footer-product-link a',
    '.footer-email a',
    '.pdf-card-badge'
  ];
  goldLinkOffenders.forEach(function (sel) {
    const escaped = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped.replace(/\s+/g, '\\s*') + '\\s*\\{[^}]*color:\\s*var\\(--color-brand-primary\\)', 's');
    assert(!re.test(componentsCss), 'DS 1.6: ' + sel + ' must not use gold as text/link color');
  });
  const ecoLinkBlock = html.match(/\.ecosystem-strip-list a\s*\{[^}]+\}/);
  assert(
    ecoLinkBlock &&
      !/color:\s*var\(--accent-primary\)/.test(ecoLinkBlock[0]) &&
      !/color:\s*var\(--color-brand-primary\)/.test(ecoLinkBlock[0]),
    'index.html .ecosystem-strip-list a must not use gold as link color'
  );

  const tokensLinkIdx = html.indexOf('href="styles/tokens.css"');
  assert(tokensLinkIdx !== -1, 'index.html missing tokens.css link for inline-style parse');
  const styleBeforeTokens = html.slice(0, tokensLinkIdx);
  const styleOpen = styleBeforeTokens.lastIndexOf('<style>');
  const styleClose = styleBeforeTokens.indexOf('</style>', styleOpen);
  assert(styleOpen !== -1 && styleClose !== -1, 'index.html missing large <style> before tokens.css');
  const inlineSheet = styleBeforeTokens.slice(styleOpen, styleClose);
  assert(
    !/\.header\s*\{[^}]*border-radius:\s*(20px|16px)/.test(inlineSheet),
    'inline <style> must not restate .header card border-radius 20px/16px'
  );
  assert(
    !/\.trust-pill\s*\{[^}]*(9999px|backdrop-filter)/.test(inlineSheet),
    'inline <style> must not restate pill .trust-pill chrome'
  );
  assert(
    !/\.container\s*\{[^}]*max-width:\s*1160px/.test(inlineSheet),
    'inline <style> must not restate .container max-width 1160px'
  );
  assert(
    /\.lang-switcher\s*\{/.test(componentsCss),
    'components.css must keep .lang-switcher (LT freeze widget)'
  );
  const ltPrivacy = read(path.join(ROOT, 'lt', 'privatumas.html'));
  assert(
    ltPrivacy.includes('class="lang-switcher"'),
    'lt/privatumas.html must keep the language switcher'
  );

  const manifest = JSON.parse(read(WEBMANIFEST));
  assert(manifest.theme_color === '#0B1320', 'site.webmanifest theme_color must be #0B1320');

  console.log('Design system smoke test passed.');
}

run();
