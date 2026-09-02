'use strict';

/**
 * scripts/export-pdf-previews.js
 *
 * Renders watermarked PNG previews of INTERIOR pages 2–4 of each CMO PDF
 * source into assets/pdf-covers/. Page 1 is the cover (see export-pdf-covers.js).
 *
 * Output:
 *   assets/pdf-covers/cmo-starter-preview-1.png  (page 2)
 *   assets/pdf-covers/cmo-starter-preview-2.png  (page 3)
 *   assets/pdf-covers/cmo-starter-preview-3.png  (page 4)
 *   (same for cmo-pro)
 *
 * Run on demand (not part of npm run build, since it requires Playwright
 * Chromium and produces marketing assets that change rarely):
 *   npx playwright install chromium
 *   node scripts/export-pdf-previews.js
 *
 * Memo §6.4: watermarked Preview 3 pages, never full PDF; reduces support load.
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'pdf-covers');

const SOURCES = [
  {
    label: 'starter',
    htmlPath: path.join(ROOT, 'docs', 'pdf-source', 'cmo-starter.html'),
    productName: 'CMO AI Content System Starter'
  },
  {
    label: 'pro',
    htmlPath: path.join(ROOT, 'docs', 'pdf-source', 'cmo-pro.html'),
    productName: 'CMO AI Content System Pro',
    // 1-based source pages: worked example, a full prompt, and a Build page
    // so the Pro thumbnails show the "Build the system" differentiation.
    previewPages: [5, 7, 28]
  }
];

const WATERMARK_STYLE = `
  <style id="cmo-preview-watermark">
    .pdf-page::after {
      content: "PREVIEW - " attr(data-watermark);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 96pt;
      font-weight: 800;
      color: rgba(15, 42, 68, 0.08);
      letter-spacing: 0.2em;
      pointer-events: none;
      white-space: nowrap;
      z-index: 100;
    }
  </style>
`;

function fileUrl(p) {
  const abs = path.resolve(p).replace(/\\/g, '/');
  return abs.startsWith('/') ? `file://${abs}` : `file:///${abs}`;
}

async function exportPreviews(browser, source) {
  if (!fs.existsSync(source.htmlPath)) {
    throw new Error(`Source HTML missing: ${source.htmlPath}`);
  }
  const ctx = await browser.newContext({
    viewport: { width: 816, height: 1056 },
    deviceScaleFactor: 2
  });
  const page = await ctx.newPage();
  await page.goto(fileUrl(source.htmlPath), { waitUntil: 'networkidle' });

  await page.evaluate(
    ({ watermarkText, watermarkStyle }) => {
      const style = document.createElement('style');
      style.textContent = watermarkStyle.replace(/<\/?style[^>]*>/gi, '');
      document.head.appendChild(style);
      const pages = document.querySelectorAll('.pdf-page');
      pages.forEach((p) => p.setAttribute('data-watermark', watermarkText));
    },
    { watermarkText: 'promptanatomy.space', watermarkStyle: WATERMARK_STYLE }
  );

  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  const handles = await page.$$('.pdf-page');
  // Default: interior pages 2-4. Override via source.previewPages (1-based).
  const pageNumbers = Array.isArray(source.previewPages) && source.previewPages.length === 3
    ? source.previewPages
    : [2, 3, 4];
  for (const n of pageNumbers) {
    if (n < 1 || n > handles.length) {
      throw new Error(
        `Preview page ${n} out of range in ${source.htmlPath} (found ${handles.length} pages)`
      );
    }
  }
  for (let i = 0; i < pageNumbers.length; i++) {
    const pageIndex = pageNumbers[i] - 1;
    const out = path.join(OUT_DIR, `cmo-${source.label}-preview-${i + 1}.png`);
    await handles[pageIndex].screenshot({ path: out, type: 'png' });
    console.log(`[OK] ${path.relative(ROOT, out)} (source page ${pageNumbers[i]})`);
  }

  await ctx.close();
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const source of SOURCES) {
      await exportPreviews(browser, source);
    }
  } finally {
    await browser.close();
  }
  console.log('\nDone. Commit the new previews under assets/pdf-covers/.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
