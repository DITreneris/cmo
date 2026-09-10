'use strict';

/**
 * scripts/export-pdf-covers.js
 *
 * Renders clean PNG covers (PDF page 1) from docs/pdf-source/*.html into
 * assets/pdf-covers/. Storefront hero = buyer PDF cover (WYSIWYG).
 *
 * Output:
 *   assets/pdf-covers/cmo-starter-cover.png
 *   assets/pdf-covers/cmo-pro-cover.png
 *   assets/pdf-covers/cmo-bundle-cover.png
 *
 * Run on demand (not part of npm run build):
 *   npx playwright install chromium
 *   npm run pdf:covers
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'pdf-covers');
const MISSING_SOURCE_HINT =
  'Paid PDF interiors are operator-local (gitignored). See docs/pdf-source/README.md.';

function requirePdfSource(htmlPath) {
  if (!fs.existsSync(htmlPath)) {
    throw new Error('Source HTML missing: ' + htmlPath + '. ' + MISSING_SOURCE_HINT);
  }
}

const SOURCES = [
  {
    label: 'starter',
    htmlPath: path.join(ROOT, 'docs', 'pdf-source', 'cmo-starter.html')
  },
  {
    label: 'pro',
    htmlPath: path.join(ROOT, 'docs', 'pdf-source', 'cmo-pro.html')
  },
  {
    label: 'bundle',
    htmlPath: path.join(ROOT, 'docs', 'pdf-source', 'cmo-bundle.html')
  }
];

function fileUrl(p) {
  const abs = path.resolve(p).replace(/\\/g, '/');
  return abs.startsWith('/') ? `file://${abs}` : `file:///${abs}`;
}

async function exportCover(browser, source) {
  requirePdfSource(source.htmlPath);
  const ctx = await browser.newContext({
    viewport: { width: 816, height: 1056 },
    deviceScaleFactor: 2
  });
  const page = await ctx.newPage();
  await page.goto(fileUrl(source.htmlPath), { waitUntil: 'networkidle' });

  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  const handles = await page.$$('.pdf-page');
  if (handles.length === 0) {
    throw new Error(`No .pdf-page found in ${source.htmlPath}`);
  }

  const out = path.join(OUT_DIR, `cmo-${source.label}-cover.png`);
  await handles[0].screenshot({ path: out, type: 'png' });
  console.log(`[OK] ${path.relative(ROOT, out)}`);

  await ctx.close();
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const source of SOURCES) {
      await exportCover(browser, source);
    }
  } finally {
    await browser.close();
  }
  console.log('\nDone. Commit the new covers under assets/pdf-covers/.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
