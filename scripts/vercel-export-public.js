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

function main() {
  resetDir(PUBLIC_DIR);

  // Root entrypoints
  copyFile('index.html');
  if (existsRel('privatumas.html')) copyFile('privatumas.html');

  // Locales
  copyDir('lt');
  copyDir('en');

  // Assets
  copyDir('styles');
  copyDir('js');
  if (existsRel('data')) copyDir('data');

  // SEO/robots
  if (existsRel('robots.txt')) copyFile('robots.txt');
  if (existsRel('sitemap.xml')) copyFile('sitemap.xml');

  // Icons & previews
  if (existsRel('favicon.svg')) copyFile('favicon.svg');
  if (existsRel('og.png')) copyFile('og.png');

  // GitHub Pages helper; harmless on Vercel
  if (existsRel('.nojekyll')) copyFile('.nojekyll');

  console.log('Exported static site to public/');
}

main();

