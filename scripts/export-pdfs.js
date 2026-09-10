'use strict';

/**
 * scripts/export-pdfs.js
 *
 * Generates the two paid CMO PDF guides from docs/pdf-source/*.html via
 * Playwright Chromium. Output goes to api/_private/pdfs/ (gitignored).
 *
 * Reports per-file: page count and KB size. CI gate: page count must match
 * the expected value (14 / 30) - prevents broken pagination on launch
 * (memo_pdf.md best-practice "fixed page counts in CI").
 *
 * Run:
 *   npm run pdf:export
 *
 * Requires:
 *   npm install   (installs @playwright/test as devDep)
 *   npx playwright install chromium   (one-time browser install)
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const MISSING_SOURCE_HINT =
  'Paid PDF interiors are operator-local (gitignored). See docs/pdf-source/README.md.';

function requirePdfSource(htmlPath) {
  if (!fs.existsSync(htmlPath)) {
    throw new Error('Source HTML missing: ' + htmlPath + '. ' + MISSING_SOURCE_HINT);
  }
}

const SOURCES = [
  {
    label: 'Starter',
    expectedPages: 14,
    htmlPath: path.join(ROOT, 'docs', 'pdf-source', 'cmo-starter.html'),
    outPath: path.join(ROOT, 'api', '_private', 'pdfs', 'cmo-starter.pdf')
  },
  {
    label: 'Pro',
    expectedPages: 30,
    htmlPath: path.join(ROOT, 'docs', 'pdf-source', 'cmo-pro.html'),
    outPath: path.join(ROOT, 'api', '_private', 'pdfs', 'cmo-pro.pdf')
  }
];

function fileUrl(p) {
  const abs = path.resolve(p).replace(/\\/g, '/');
  return abs.startsWith('/') ? `file://${abs}` : `file:///${abs}`;
}

function countPdfPages(buffer) {
  const text = buffer.toString('latin1');
  const matches = text.match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

async function exportOne(browser, source) {
  requirePdfSource(source.htmlPath);
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(fileUrl(source.htmlPath), { waitUntil: 'networkidle' });

  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  await page.emulateMedia({ media: 'print' });

  fs.mkdirSync(path.dirname(source.outPath), { recursive: true });

  await page.pdf({
    path: source.outPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    displayHeaderFooter: false
  });

  await ctx.close();

  const buffer = fs.readFileSync(source.outPath);
  const pageCount = countPdfPages(buffer);
  const sizeKb = (buffer.length / 1024).toFixed(1);
  const ok = pageCount === source.expectedPages;
  const status = ok ? 'OK' : 'WARN';

  console.log(
    `[${status}] ${source.label.padEnd(8)} pages=${pageCount} (expected ${source.expectedPages}) size=${sizeKb} KB -> ${path.relative(ROOT, source.outPath)}`
  );

  return ok;
}

(async () => {
  const browser = await chromium.launch();
  let allOk = true;
  try {
    for (const source of SOURCES) {
      const ok = await exportOne(browser, source);
      if (!ok) allOk = false;
    }
  } finally {
    await browser.close();
  }
  if (!allOk) {
    console.warn(
      '\nOne or more PDFs do not match the expected page count. Review the HTML for sections that overflow Letter page boundaries.'
    );
    process.exitCode = 1;
  } else {
    console.log('\nBoth CMO PDFs generated and page counts match (14 / 30).');
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
