/**
 * Vercel expects a static output directory (default: "public").
 * This script exports the deployable static site into /public after build.
 *
 * It intentionally keeps the repo's canonical structure intact (index.html, lt/, en/, ...),
 * and only mirrors required runtime assets into /public for Vercel deployments.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

/** Vercel Web Analytics (plain HTML): https://vercel.com/docs/analytics/quickstart */
const VERCEL_INSIGHTS_SCRIPT = '/_vercel/insights/script.js';
const VERCEL_WEB_ANALYTICS_SNIPPET = [
  '<script>',
  '  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };',
  '</script>',
  `<script defer src="${VERCEL_INSIGHTS_SCRIPT}"></script>`
].join('\n');

function injectVercelWebAnalytics(html) {
  if (html.includes(VERCEL_INSIGHTS_SCRIPT)) {
    return html;
  }
  const closeBody = '</body>';
  const idx = html.lastIndexOf(closeBody);
  if (idx === -1) {
    return html;
  }
  return html.slice(0, idx) + VERCEL_WEB_ANALYTICS_SNIPPET + '\n' + html.slice(idx);
}

function injectAnalyticsIntoHtmlUnderDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dirPath, ent.name);
    if (ent.isDirectory()) {
      injectAnalyticsIntoHtmlUnderDir(full);
    } else if (ent.name.endsWith('.html')) {
      const raw = fs.readFileSync(full, 'utf8');
      const next = injectVercelWebAnalytics(raw);
      if (next !== raw) {
        fs.writeFileSync(full, next, 'utf8');
      }
    }
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function resetDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  ensureDir(dirPath);
}

function copyFile(srcRel, destRel = srcRel) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(PUBLIC_DIR, destRel);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(srcRel, destRel = srcRel) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(PUBLIC_DIR, destRel);
  ensureDir(path.dirname(dest));
  fs.cpSync(src, dest, { recursive: true });
}

function existsRel(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function assertNoPaidPdfsLeaked() {
  const blockedDirs = [path.join(PUBLIC_DIR, 'api', '_private'), path.join(PUBLIC_DIR, 'paid-pdfs')];
  for (const dir of blockedDirs) {
    if (fs.existsSync(dir)) {
      throw new Error(
        'Refusing to publish: ' + dir + ' must never be inside public/. Paid PDFs are private (Vercel Blob).'
      );
    }
  }
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (/\.pdf$/i.test(ent.name)) {
        throw new Error(
          'Refusing to publish: PDF found at ' + full + '. Paid PDFs must only live in api/_private/ and Vercel Blob.'
        );
      }
    }
  }
  walk(PUBLIC_DIR);
}

function main() {
  resetDir(PUBLIC_DIR);

  // Root entrypoints
  copyFile('index.html');
  if (existsRel('privatumas.html')) copyFile('privatumas.html');

  // Paid PDF storefront supporting pages (EN-only commerce, .space only)
  if (existsRel('success.html')) copyFile('success.html');
  if (existsRel('terms.html')) copyFile('terms.html');
  if (existsRel('coming-soon.html')) copyFile('coming-soon.html');

  // Locales
  copyDir('lt');
  copyDir('en');

  // Assets
  copyDir('styles');
  copyDir('js');
  if (existsRel('data')) copyDir('data');

  // PDF cover thumbnails + watermarked previews (storefront artwork, never the PDFs themselves)
  if (existsRel('assets/pdf-covers')) copyDir('assets/pdf-covers');

  // SEO/robots + Google Search Console HTML verification
  if (existsRel('robots.txt')) copyFile('robots.txt');
  if (existsRel('sitemap.xml')) copyFile('sitemap.xml');
  if (existsRel('google7305663b2567346e.html')) copyFile('google7305663b2567346e.html');

  // Icons & previews
  if (existsRel('favicon.svg')) copyFile('favicon.svg');
  if (existsRel('og.png')) copyFile('og.png');

  // GitHub Pages helper; harmless on Vercel
  if (existsRel('.nojekyll')) copyFile('.nojekyll');

  injectAnalyticsIntoHtmlUnderDir(PUBLIC_DIR);

  // Safety net: never publish anything that could leak the paid PDFs
  assertNoPaidPdfsLeaked();

  console.log('Exported static site to public/');
}

main();

