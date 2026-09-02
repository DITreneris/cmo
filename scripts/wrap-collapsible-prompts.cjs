'use strict';

/**
 * One-time helper: wrap prompts 2–10 in index.html with collapsible details.
 * Safe to re-run only if chunks lack prompt-details (idempotent check).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const SUMMARIES_PATH = path.join(ROOT, 'data', 'cmo-collapsible-summaries.json');

const summaries = JSON.parse(fs.readFileSync(SUMMARIES_PATH, 'utf8'));
let html = fs.readFileSync(INDEX_PATH, 'utf8');

for (let n = 2; n <= 10; n++) {
  const start = html.indexOf(`<!-- PROMPT ${n} -->`);
  if (start === -1) {
    throw new Error(`marker PROMPT ${n} not found`);
  }
  const end =
    n < 10
      ? html.indexOf(`<!-- PROMPT ${n + 1} -->`, start)
      : html.indexOf('<details class="upgrade-section prompt-basics-details"', start);
  if (end === -1) {
    throw new Error(`end marker for PROMPT ${n} not found`);
  }

  let chunk = html.slice(start, end);
  if (chunk.includes('prompt-details')) {
    continue;
  }

  chunk = chunk.replace(
    '<article class="prompt">',
    `<article class="prompt prompt--collapsible">\n            <details class="prompt-details" data-prompt="${n}">`
  );

  const descLt = summaries.lt[String(n)];
  chunk = chunk.replace(
    /<p class="prompt-desc">[^<]*<\/p>/,
    `<p class="prompt-desc" id="prompt-desc-${n}">${descLt}</p>`
  );

  chunk = chunk.replace(
    /            <div class="prompt-header">/,
    '                <summary class="prompt-header">\n                    <div class="prompt-header-inner">'
  );

  chunk = chunk.replace(
    /            <\/div>\s*\n            <div class="prompt-body">/,
    '                    </div>\n                    <span class="prompt-chevron" aria-hidden="true">▾</span>\n                </summary>\n            <div class="prompt-body">'
  );

  chunk = chunk.replace(
    /(\s*<\/div>\s*\n)(\s*<\/article>)/,
    '$1\n            </details>$2'
  );

  html = html.slice(0, start) + chunk + html.slice(end);
}

fs.writeFileSync(INDEX_PATH, html, 'utf8');
console.log('Wrapped prompts 2–10 in index.html');
