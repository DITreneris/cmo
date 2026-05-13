/**
 * Renders Open Graph / Twitter preview image (1200×630) from inline SVG.
 * Output: repo root og.png (safe margins for social crops; promptanatomy.space).
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

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'og.png');

/** 2400×1260 viewBox 1200×630 — supersampled export for sharper type */
function buildSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1260" viewBox="0 0 1200 630" shape-rendering="geometricPrecision" text-rendering="optimizeLegibility">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070b10"/>
      <stop offset="55%" stop-color="#121a24"/>
      <stop offset="100%" stop-color="#0d1520"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#2c5282" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#070b10" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Center block: ~560px wide for crop safety -->
  <g font-family="Segoe UI, Inter, Helvetica Neue, Arial, sans-serif" text-anchor="middle">
    <text x="600" y="218" fill="#94a3b8" font-size="26" font-weight="600" letter-spacing="0.12em">PROMPT ANATOMY</text>
    <text x="600" y="312" fill="#f8fafc" font-size="92" font-weight="800" filter="url(#shadow)">CMO Kit</text>
    <text x="600" y="372" fill="#e2e8f0" font-size="30" font-weight="500">10 copy-paste prompts  ·  ~45 min</text>
  </g>
  <rect x="420" y="392" width="360" height="5" rx="2" fill="#f6ad55"/>

  <!-- Domain pill: inset from edges (crop-safe) -->
  <g transform="translate(88, 500)">
    <rect width="400" height="52" rx="13" fill="#1a4731" stroke="#48bb78" stroke-width="1.5"/>
    <text x="200" y="35" text-anchor="middle" fill="#ecfdf5" font-family="Segoe UI, Inter, Helvetica Neue, Arial, sans-serif" font-size="24" font-weight="700">promptanatomy.space</text>
  </g>
</svg>`;
}

async function main() {
  const svg = buildSvg();
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
