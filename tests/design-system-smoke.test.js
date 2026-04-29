'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX = path.join(ROOT, 'index.html');
const LT_INDEX = path.join(ROOT, 'lt', 'index.html');
const EN_INDEX = path.join(ROOT, 'en', 'index.html');
const TOKENS = path.join(ROOT, 'styles', 'tokens.css');
const COMPONENTS = path.join(ROOT, 'styles', 'components.css');
const UTILITIES = path.join(ROOT, 'styles', 'utilities.css');
const TOKEN_JSON = path.join(ROOT, 'styles', 'design-tokens.json');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, msg) {
  if (!condition) {
    throw new Error(msg);
  }
}

function run() {
  const html = read(INDEX);
  const ltHtml = read(LT_INDEX);
  const enHtml = read(EN_INDEX);
  const tokensCss = read(TOKENS);
  const componentsCss = read(COMPONENTS);
  const utilitiesCss = read(UTILITIES);
  const tokenJson = JSON.parse(read(TOKEN_JSON));

  assert(html.includes('href="styles/tokens.css"'), 'index.html missing tokens.css import');
  assert(html.includes('href="styles/components.css"'), 'index.html missing components.css import');
  assert(html.includes('href="styles/utilities.css"'), 'index.html missing utilities.css import');
  assert(ltHtml.includes('href="../styles/tokens.css"'), 'lt/index.html missing tokens.css import');
  assert(ltHtml.includes('href="../styles/components.css"'), 'lt/index.html missing components.css import');
  assert(ltHtml.includes('href="../styles/utilities.css"'), 'lt/index.html missing utilities.css import');
  assert(enHtml.includes('href="../styles/tokens.css"'), 'en/index.html missing tokens.css import');
  assert(enHtml.includes('href="../styles/components.css"'), 'en/index.html missing components.css import');
  assert(enHtml.includes('href="../styles/utilities.css"'), 'en/index.html missing utilities.css import');

  assert(tokensCss.includes('--color-brand-primary'), 'tokens.css missing primary brand token');
  assert(tokensCss.includes('--focus-ring-width'), 'tokens.css missing focus ring token');
  assert(componentsCss.includes('.btn'), 'components.css missing button styles');
  assert(componentsCss.includes('.progress-wrap'), 'components.css missing progress styles');
  assert(utilitiesCss.includes('.code-block:focus-visible'), 'utilities.css missing focus-visible rule');
  assert(utilitiesCss.includes('prefers-reduced-motion'), 'utilities.css missing reduced-motion utility');

  assert(Boolean(tokenJson.color && tokenJson.color.brand), 'design-tokens.json missing color.brand group');
  assert(Boolean(tokenJson.spacing), 'design-tokens.json missing spacing scale');
  assert(Boolean(tokenJson.radius), 'design-tokens.json missing radius scale');

  console.log('Design system smoke test passed.');
}

run();
