/**
 * Renders favicon PNG sizes from favicon.svg (derivative of mother mark, ink + gold).
 * Run: npm run icons:export
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

const { ROOT } = require('./load-brand-config');

const SVG_PATH = path.join(ROOT, 'favicon.svg');

const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

async function main() {
  const svg = fs.readFileSync(SVG_PATH);
  for (const { name, size } of SIZES) {
    const out = path.join(ROOT, name);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log('Wrote', name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
