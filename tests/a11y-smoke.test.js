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

function hasFocusVisibleRule(html) {
  return html.includes(':focus-visible');
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
      assert(html.includes('class="back"'), `${fileName}: missing back navigation`);
      assert(html.includes(':focus-visible'), `${fileName}: missing focus-visible styles`);
    }
    assert(hasFocusVisibleRule(html), `${fileName}: missing focus-visible styles`);
    assert(html.includes('aria-label='), `${fileName}: missing aria-label attributes`);
  }

  console.log('A11y smoke test passed.');
}

run();
