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
  const muted = tokens.color.text.secondary;
  const gold = tokens.color.brand.primary;
  const page = tokens.color.surface.page;
  const heroEnd = '#eef2f7';
  const { eyebrow, headline, subline } = brand.ogVisual;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1260" viewBox="0 0 1200 630" shape-rendering="geometricPrecision" text-rendering="optimizeLegibility">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${page}"/>
      <stop offset="100%" stop-color="${heroEnd}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="18%" r="55%">
      <stop offset="0%" stop-color="${gold}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${page}" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <g font-family="Segoe UI, Inter, Helvetica Neue, Arial, sans-serif" text-anchor="middle">
    <text x="600" y="218" fill="${muted}" font-size="26" font-weight="600" letter-spacing="0.12em">${escapeXml(eyebrow)}</text>
    <text x="600" y="312" fill="${ink}" font-size="72" font-weight="800" filter="url(#shadow)">${escapeXml(headline)}</text>
    <text x="600" y="372" fill="${muted}" font-size="30" font-weight="500">${escapeXml(subline)}</text>
  </g>
  <rect x="420" y="392" width="360" height="5" rx="2" fill="${gold}"/>

  <g transform="translate(88, 500)">
    <rect width="400" height="52" rx="13" fill="${ink}" stroke="${gold}" stroke-width="1.5"/>
    <text x="200" y="35" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Inter, Helvetica Neue, Arial, sans-serif" font-size="24" font-weight="700">promptanatomy.space</text>
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
