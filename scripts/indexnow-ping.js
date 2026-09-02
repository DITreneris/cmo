/**
 * IndexNow ping — submits sitemap URLs (or diff since HEAD) to IndexNow API.
 * Key must match scripts/geo-surfaces.js INDEXNOW_KEY and hosted {key}.txt file.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');
const { INDEXNOW_KEY } = require('./geo-surfaces');

const ROOT = path.join(__dirname, '..');
const INDEXNOW_HOST = 'api.indexnow.org';
const INDEXNOW_PATH = '/IndexNow';
const DRY_RUN = process.env.INDEXNOW_DRY_RUN === '1';

function readSitemapUrls() {
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    throw new Error('sitemap.xml not found — run npm run build first');
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const u = m[1].trim();
    if (u) locs.push(u);
  }
  return locs;
}

function fileToUrls(file, origin) {
  const map = {
    'index.html': [origin + '/', origin + '/en/'],
    'config/sot.json': [origin + '/en/', origin + '/en/privacy.html'],
    'config/brand-seo.json': [origin + '/en/'],
    'data/en-prompt-bodies.json': [origin + '/en/'],
    'en/index.html': [origin + '/en/'],
    'en/privacy.html': [origin + '/en/privacy.html'],
    'lt/index.html': [origin + '/lt/'],
    'terms.html': [origin + '/terms.html'],
    'robots.txt': [origin + '/en/'],
    'llms.txt': [origin + '/en/'],
    'sitemap.xml': readSitemapUrls()
  };
  if (file === 'sitemap.xml') return readSitemapUrls();
  return map[file] || [];
}

function urlsChangedSinceHead(allUrls) {
  let changed;
  try {
    const out = execFileSync('git', ['diff', '--name-only', 'HEAD~1', 'HEAD'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
    changed = out.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  } catch (_e) {
    console.warn('IndexNow: git diff failed — falling back to all sitemap URLs');
    return allUrls;
  }
  if (!changed.length) return [];
  const origin = new URL(allUrls[0]).origin;
  const set = new Set();
  changed.forEach(function (f) {
    fileToUrls(f.replace(/\\/g, '/'), origin).forEach(function (u) { set.add(u); });
  });
  return Array.from(set);
}

function postIndexNow(urlList) {
  if (!urlList.length) {
    console.log('IndexNow: no URLs to submit');
    return Promise.resolve({ status: 200, body: 'noop' });
  }
  const origin = new URL(urlList[0]).origin;
  const host = new URL(urlList[0]).host;
  const body = JSON.stringify({
    host: host,
    key: INDEXNOW_KEY,
    keyLocation: origin + '/' + INDEXNOW_KEY + '.txt',
    urlList: urlList
  });

  if (DRY_RUN) {
    console.log('IndexNow DRY RUN — would POST:', body);
    return Promise.resolve({ status: 200, body: 'dry-run' });
  }

  return new Promise(function (resolve, reject) {
    const req = https.request(
      {
        host: INDEXNOW_HOST,
        path: INDEXNOW_PATH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
          'User-Agent': 'PromptAnatomy-IndexNow/1.0 (+https://promptanatomy.space/)'
        },
        timeout: 15000
      },
      function (res) {
        let chunks = '';
        res.setEncoding('utf8');
        res.on('data', function (d) { chunks += d; });
        res.on('end', function () { resolve({ status: res.statusCode, body: chunks }); });
      }
    );
    req.on('timeout', function () { req.destroy(new Error('IndexNow request timed out')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const sinceHead = process.argv.includes('--since-head');
  const allUrls = readSitemapUrls();
  const targets = sinceHead ? urlsChangedSinceHead(allUrls) : allUrls;
  console.log('IndexNow: submitting ' + targets.length + ' URL(s)');
  targets.forEach(function (u) { console.log(' - ' + u); });
  try {
    const res = await postIndexNow(targets);
    console.log('IndexNow response: status=' + res.status);
    if (res.status >= 400) process.exit(1);
  } catch (e) {
    console.error('IndexNow ping failed:', e && e.message ? e.message : e);
    process.exit(1);
  }
}

main();
