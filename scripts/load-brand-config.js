'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function readBrandSeo() {
  const raw = fs.readFileSync(path.join(ROOT, 'config', 'brand-seo.json'), 'utf8');
  return JSON.parse(raw);
}

function readDesignTokens() {
  const raw = fs.readFileSync(path.join(ROOT, 'styles', 'design-tokens.json'), 'utf8');
  return JSON.parse(raw);
}

module.exports = { readBrandSeo, readDesignTokens, ROOT };
