'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const FILES = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'lt', 'index.html'),
  path.join(ROOT, 'en', 'index.html'),
  path.join(ROOT, 'lt', 'privatumas.html'),
  path.join(ROOT, 'en', 'privacy.html')
];

function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}

function linkedStylesheets(html) {
  const hrefs = [];
  const re = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi;
  let match = re.exec(html);
  while (match) {
    const href = /\bhref=["']([^"']+)["']/i.exec(match[0]);
    if (href) hrefs.push(href[1]);
    match = re.exec(html);
  }
  return hrefs;
}

function hasFocusVisibleRule(html, htmlPath) {
  if (html.includes(':focus-visible')) return true;
  const dir = path.dirname(htmlPath);
  const hrefs = linkedStylesheets(html);
  for (let i = 0; i < hrefs.length; i++) {
    const href = hrefs[i];
    if (/^https?:/i.test(href)) continue;
    const cssPath = href.charAt(0) === '/'
      ? path.join(ROOT, href.replace(/^\//, ''))
      : path.resolve(dir, href);
    if (!fs.existsSync(cssPath)) continue;
    const css = fs.readFileSync(cssPath, 'utf8');
    if (css.includes(':focus-visible')) return true;
  }
  return false;
}

function run() {
  for (const file of FILES) {
    const html = fs.readFileSync(file, 'utf8');
    const fileName = path.relative(ROOT, file);
    const isLibraryPage = fileName.endsWith('index.html');

    if (isLibraryPage) {
      assert(html.includes('class="skip-link"'), `${fileName}: missing skip-link`);
      assert(html.includes('href="#main-content"'), `${fileName}: missing skip-link target`);
      assert(html.includes('id="main-content"'), `${fileName}: missing main-content id`);
      assert(html.includes('prefers-reduced-motion'), `${fileName}: missing reduced-motion fallback`);
    } else {
      assert(
        html.includes('class="back"') || html.includes('class="satellite-back"'),
        `${fileName}: missing back navigation`
      );
    }
    assert(hasFocusVisibleRule(html, file), `${fileName}: missing :focus-visible rule in page or linked CSS`);
    assert(html.includes('aria-label='), `${fileName}: missing aria-label attributes`);
  }

  console.log('A11y smoke test passed.');
}

run();
