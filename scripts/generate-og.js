/**
 * Renders Open Graph / Twitter preview image (1200×630) from inline SVG.
 * Copy and colors: config/brand-seo.json + styles/design-tokens.json.
 * Output: repo root og.png (promptanatomy.space).
 * Run: npm run generate:og
 */
'use strict';

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (_) {
  console.error('Missing dependency: run npm install (dev: sharp)');
  process.exit(1);
}

const { readBrandSeo, readDesignTokens, ROOT } = require('./load-brand-config');
const OUT = path.join(ROOT, 'og.png');

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 2400×1260 viewBox 1200×630 — supersampled export for sharper type */
function buildSvg(brand, tokens) {
  const ink = tokens.color.brand.dark;
  const gold = tokens.color.brand.primary;
  const page = tokens.color.surface.page;
  const heroEnd = '#ede4d4';
  const { eyebrow, headline, subline } = brand.ogVisual;
  const display = tokens.typography.fontDisplay;
  const ui = tokens.typography.fontUi;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1260" viewBox="0 0 1200 630" shape-rendering="geometricPrecision" text-rendering="optimizeLegibility">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${page}"/>
      <stop offset="100%" stop-color="${heroEnd}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="18%" r="55%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${page}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <text x="600" y="198" text-anchor="middle" fill="${ink}" fill-opacity="0.62" font-family="${escapeXml(ui)}" font-size="22" font-weight="600" letter-spacing="0.18em">${escapeXml(eyebrow)}</text>
  <text x="600" y="318" text-anchor="middle" fill="${ink}" font-family="${escapeXml(display)}" font-size="58" font-weight="700">${escapeXml(headline)}</text>
  <text x="600" y="382" text-anchor="middle" fill="${ink}" fill-opacity="0.78" font-family="${escapeXml(ui)}" font-size="32" font-weight="600">${escapeXml(subline)}</text>
  <rect x="480" y="408" width="240" height="4" rx="2" fill="${gold}"/>

  <g transform="translate(88, 508)">
    <rect width="360" height="56" rx="13" fill="${ink}" stroke="${gold}" stroke-width="1.5"/>
    <text x="180" y="36" text-anchor="middle" fill="#ffffff" font-family="${escapeXml(ui)}" font-size="22" font-weight="700">promptanatomy.space</text>
  </g>
</svg>`;
}

async function main() {
  const brand = readBrandSeo();
  const tokens = readDesignTokens();
  const svg = buildSvg(brand, tokens);
  const buf = await sharp(Buffer.from(svg, 'utf8'))
    .png({ compressionLevel: 9 })
    .toBuffer();
  const output = await sharp(buf)
    .resize(1200, 630, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  if (fs.existsSync(OUT)) {
    if (fs.readFileSync(OUT).equals(output)) {
      console.log('Unchanged', path.relative(ROOT, OUT), '(' + output.length + ' bytes, 1200×630)');
      return;
    }
    if (process.env.UPDATE_OG !== '1') {
      console.log('Keeping existing', path.relative(ROOT, OUT), '(set UPDATE_OG=1 to refresh)');
      return;
    }
  }

  fs.writeFileSync(OUT, output);
  console.log('Wrote', path.relative(ROOT, OUT), '(' + output.length + ' bytes, 1200×630)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
