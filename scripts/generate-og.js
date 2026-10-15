/**
 * Renders the Open Graph / Twitter preview card (1200×630 JPEG) from inline SVG.
 * Copy + output file: config/brand-seo.json (`ogImage`, `ogVisual`); colors: styles/design-tokens.json.
 * Fonts come only from assets/fonts/og (system fonts off) so Windows and Linux builds match.
 * Run: npm run generate:og (UPDATE_OG=1 overwrites an existing file).
 */
'use strict';

const fs = require('fs');
const path = require('path');

let sharp;
let Resvg;
try {
  sharp = require('sharp');
  ({ Resvg } = require('@resvg/resvg-js'));
} catch (_) {
  console.error('Missing dependency: run npm install (dev: sharp, @resvg/resvg-js)');
  process.exit(1);
}

const { readBrandSeo, readDesignTokens, ROOT } = require('./load-brand-config');

const FONT_DIR = path.join(ROOT, 'assets', 'fonts', 'og');
const FONT_FILES = [
  'Fraunces-Bold.ttf',
  'SourceSans3-SemiBold.ttf',
  'SourceSans3-Bold.ttf',
  'SourceSans3-Black.ttf'
].map((name) => path.join(FONT_DIR, name));
const SAMPLE_IMAGE = path.join(ROOT, 'assets', 'hero', 'brief-sample-satori.png');
/** Same bolt as favicon.svg (32×32 viewBox) — keep in sync with mother brand mark. */
const BOLT_PATH = 'M13.5 1.5 4.5 14.25h6L8.25 22.5 19.5 9.75h-6L13.5 1.5z';
const OG_FILE_PATTERN = /^og-v\d+\.jpg$/;

const SAMPLE_BOX = { x: 696, y: 136, width: 408, height: 318 };
/** Šiek tiek šviesesnis už kortelę – prompto panelis atrodo kaip UI laukas. */
const PANEL_FILL = '#182335';
/** SVG neturi teksto matavimo – plotis parinktas `badge` tekstui (Source Sans 3 Bold 30px) + 24px paraštės. */
const BADGE_WIDTH = 462;

/**
 * @param {string} s
 * @returns {string}
 */
function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Cover-crops the hero sample so the card shows the product shot, not letterboxing.
 * @returns {Promise<string>} data URI (PNG)
 */
async function loadSampleDataUri() {
  const buf = await sharp(SAMPLE_IMAGE)
    .resize(SAMPLE_BOX.width * 2, SAMPLE_BOX.height * 2, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer();
  return 'data:image/png;base64,' + buf.toString('base64');
}

/**
 * @param {object} brand config/brand-seo.json
 * @param {object} tokens styles/design-tokens.json
 * @param {string} sampleUri
 * @returns {string} SVG (viewBox 1200×630)
 */
function buildSvg(brand, tokens, sampleUri) {
  const ink = tokens.color.brand.dark;
  const gold = tokens.color.brand.primary;
  const page = tokens.color.surface.page;
  const heroEnd = '#ede4d4';
  const { headlineLines, badge, cardLabel, promptLines, domain } = brand.ogVisual;
  const display = 'Fraunces';
  const ui = 'Source Sans 3';
  const [labelFrom, labelTo] = cardLabel.toUpperCase().split('→').map((s) => s.trim());

  const headline = headlineLines
    .map(
      (line, i) =>
        `<text x="92" y="${226 + i * 82}" fill="${ink}" font-family="${display}" font-size="74" font-weight="700">${escapeXml(line)}</text>`
    )
    .join('\n  ');

  const prompt = promptLines
    .map(
      (line, i) =>
        `<text x="714" y="${505 + i * 28}" fill="#ffffff" fill-opacity="0.92" font-family="${ui}" font-size="17" font-weight="600">${escapeXml(line)}</text>`
    )
    .join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${page}"/>
      <stop offset="100%" stop-color="${heroEnd}"/>
    </linearGradient>
    <radialGradient id="glow" cx="74%" cy="50%" r="45%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${page}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="sampleClip">
      <rect x="${SAMPLE_BOX.x}" y="${SAMPLE_BOX.y}" width="${SAMPLE_BOX.width}" height="${SAMPLE_BOX.height}" rx="12"/>
    </clipPath>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <g transform="translate(64 56)">
    <rect width="56" height="56" rx="14" fill="${ink}"/>
    <path fill="${gold}" transform="scale(1.75) translate(4 3)" d="${BOLT_PATH}"/>
    <text x="72" y="38" fill="${ink}" font-family="${ui}" font-size="30" font-weight="900">Prompt Anatomy</text>
  </g>

  <rect x="64" y="166" width="6" height="250" rx="3" fill="${gold}"/>
  ${headline}

  <rect x="64" y="460" width="${BADGE_WIDTH}" height="58" rx="14" fill="${gold}"/>
  <text x="88" y="499" fill="${ink}" font-family="${ui}" font-size="30" font-weight="700">${escapeXml(badge)}</text>
  <text x="64" y="580" fill="${ink}" fill-opacity="0.7" font-family="${ui}" font-size="26" font-weight="600">${escapeXml(domain)}</text>

  <g>
    <rect x="656" y="60" width="484" height="514" rx="26" fill="${ink}" stroke="${gold}" stroke-width="2"/>
    <rect x="656" y="86" width="6" height="462" rx="3" fill="${gold}"/>
    <text x="696" y="114" font-family="${ui}" font-size="27" font-weight="700" letter-spacing="1.5"><tspan fill="${gold}">${escapeXml(labelFrom)} →</tspan><tspan fill="#ffffff"> ${escapeXml(labelTo)}</tspan></text>
    <image x="${SAMPLE_BOX.x}" y="${SAMPLE_BOX.y}" width="${SAMPLE_BOX.width}" height="${SAMPLE_BOX.height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#sampleClip)" xlink:href="${sampleUri}"/>
    <rect x="696" y="472" width="408" height="78" rx="12" fill="${PANEL_FILL}"/>
    ${prompt}
    <g fill="none" stroke="${gold}" stroke-width="2">
      <rect x="1080" y="489" width="15" height="18" rx="3"/>
      <rect x="1074" y="495" width="15" height="18" rx="3" fill="${PANEL_FILL}"/>
    </g>
  </g>
</svg>`;
}

async function main() {
  const brand = readBrandSeo();
  const tokens = readDesignTokens();
  const { file, width, height } = brand.ogImage;
  if (!OG_FILE_PATTERN.test(file)) {
    throw new Error('brand-seo.json ogImage.file must match og-vN.jpg (versioned for immutable cache)');
  }
  const out = path.join(ROOT, file);

  const svg = buildSvg(brand, tokens, await loadSampleDataUri());
  const rendered = new Resvg(svg, {
    fitTo: { mode: 'width', value: width * 2 },
    font: {
      fontFiles: FONT_FILES,
      loadSystemFonts: false,
      defaultFontFamily: 'Source Sans 3'
    }
  })
    .render()
    .asPng();

  const output = await sharp(rendered)
    .resize(width, height, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .flatten({ background: tokens.color.surface.page })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  if (fs.existsSync(out)) {
    if (fs.readFileSync(out).equals(output)) {
      console.log('Unchanged', file, '(' + output.length + ' bytes, ' + width + '×' + height + ')');
      return;
    }
    if (process.env.UPDATE_OG !== '1') {
      console.log('Keeping existing', file, '(set UPDATE_OG=1 to refresh)');
      return;
    }
  }

  fs.writeFileSync(out, output);
  console.log('Wrote', file, '(' + output.length + ' bytes, ' + width + '×' + height + ')');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
