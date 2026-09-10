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

const BLOCKED_PUBLIC_HTML = new Set(['cmo-starter.html', 'cmo-pro.html', 'cmo-bundle.html']);

function assertNoPaidPdfsLeaked() {
  const blockedDirs = [
    path.join(PUBLIC_DIR, 'api'),
    path.join(PUBLIC_DIR, 'docs'),
    path.join(PUBLIC_DIR, 'docs', 'pdf-source'),
    path.join(PUBLIC_DIR, 'paid-pdfs')
  ];
  for (const dir of blockedDirs) {
    if (fs.existsSync(dir)) {
      throw new Error(
        'Refusing to publish: ' + dir + ' must never be inside public/. Paid PDFs and repo internals stay off the static export.'
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
      } else if (BLOCKED_PUBLIC_HTML.has(ent.name.toLowerCase())) {
        throw new Error(
          'Refusing to publish: paid PDF HTML found at ' + full + '. Interiors are operator-local (see docs/pdf-source/README.md).'
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
  // data/*.json is build input (inlined into pages / js/). Do not publish the folder.

  // PDF cover thumbnails + watermarked previews (storefront artwork, never the PDFs themselves)
  if (existsRel('assets/pdf-covers')) copyDir('assets/pdf-covers');
  if (existsRel('assets/hero')) copyDir('assets/hero');

  // SEO/robots + Google Search Console HTML verification + GEO surfaces
  if (existsRel('robots.txt')) copyFile('robots.txt');
  if (existsRel('sitemap.xml')) copyFile('sitemap.xml');
  if (existsRel('llms.txt')) copyFile('llms.txt');
  if (existsRel('llms-full.txt')) copyFile('llms-full.txt');
  if (existsRel('404.html')) copyFile('404.html');
  if (existsRel('manifest.webmanifest')) copyFile('manifest.webmanifest');
  if (existsRel('a9f3c2e1b8d7a6f5e4c3b2a1f0e9d8c7.txt')) {
    copyFile('a9f3c2e1b8d7a6f5e4c3b2a1f0e9d8c7.txt');
  }
  if (existsRel('google7305663b2567346e.html')) copyFile('google7305663b2567346e.html');

  // Icons & previews
  if (existsRel('favicon.svg')) copyFile('favicon.svg');
  for (const icon of [
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'site.webmanifest'
  ]) {
    if (existsRel(icon)) copyFile(icon);
  }
  if (existsRel('og.png')) copyFile('og.png');

  // GitHub Pages helper; harmless on Vercel
  if (existsRel('.nojekyll')) copyFile('.nojekyll');

  injectAnalyticsIntoHtmlUnderDir(PUBLIC_DIR);

  // Safety net: never publish anything that could leak the paid PDFs
  assertNoPaidPdfsLeaked();

  console.log('Exported static site to public/');
}

main();

