'use strict';

/**
 * scripts/upload-pdfs-to-blob.js
 *
 * Uploads paid CMO PDFs from api/_private/pdfs/ to Vercel Blob private store.
 * Requires BLOB_READ_WRITE_TOKEN in .env (not needed for --dry-run).
 *
 * Run AFTER `npm run pdf:export`:
 *   node scripts/upload-pdfs-to-blob.js --dry-run
 *   npm run pdf:upload-blob
 *
 * After upload, paste each printed URL into Vercel Production env as
 * PDF_CMO_STARTER_SOURCE_URL / PDF_CMO_PRO_SOURCE_URL / PDF_CMO_PRO_MD_SOURCE_URL,
 * then redeploy.
 *
 * Bundle has no third PDF URL — Complete Kit delivers starter + pro files.
 *
 * Memo §3.3: do NOT commit paid PDFs to git; never serve from public/.
 */

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const ROOT = path.resolve(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === '1';
const BUNDLE_NO_URL_NOTE =
  'Bundle has no third PDF URL — Complete Kit delivers starter + pro files.';

if (fs.existsSync(path.join(ROOT, '.env'))) {
  // Lightweight .env reader (no dotenv dep) for local CLI use.
  const raw = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/i);
    if (m && process.env[m[1]] === undefined) {
      let value = m[2];
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[m[1]] = value;
    }
  }
}

const PDFS = [
  {
    label: 'Starter ($3.99)',
    localPath: path.join(ROOT, 'api', '_private', 'pdfs', 'cmo-starter.pdf'),
    blobPath: 'paid-pdfs/cmo-starter.pdf',
    envName: 'PDF_CMO_STARTER_SOURCE_URL'
  },
  {
    label: 'Pro ($8.99)',
    localPath: path.join(ROOT, 'api', '_private', 'pdfs', 'cmo-pro.pdf'),
    blobPath: 'paid-pdfs/cmo-pro.pdf',
    envName: 'PDF_CMO_PRO_SOURCE_URL'
  },
  {
    label: 'Pro Markdown companion',
    localPath: path.join(ROOT, 'api', '_private', 'prompts', 'cmo-pro-prompts.md'),
    blobPath: 'paid-pdfs/cmo-pro-prompts.md',
    envName: 'PDF_CMO_PRO_MD_SOURCE_URL',
    contentType: 'text/markdown; charset=utf-8',
    optional: true
  }
];

function formatBytes(n) {
  if (n < 1024) return n + ' B';
  return (n / 1024).toFixed(1) + ' KB';
}

function inspectLocal(item) {
  if (!fs.existsSync(item.localPath)) {
    return { exists: false, size: null };
  }
  return { exists: true, size: fs.statSync(item.localPath).size };
}

function printExistingEnvPaste() {
  const lines = [];
  for (const item of PDFS) {
    const value = process.env[item.envName];
    if (value) lines.push(item.envName + '=' + value);
  }
  if (!lines.length) return;
  console.log('\n--- Already in local .env (paste into Vercel if still missing there) ---');
  for (const line of lines) console.log(line);
}

function printPasteFooter(lines) {
  if (!lines.length) return;
  console.log(
    '\n--- Paste these into Vercel Production env (Settings -> Environment Variables) ---'
  );
  for (const line of lines) console.log(line);
  console.log('\n' + BUNDLE_NO_URL_NOTE);
  console.log(
    'After saving, redeploy. Verify with: npm run check:prod'
  );
}

async function uploadOne(item) {
  if (!fs.existsSync(item.localPath)) {
    throw new Error(
      `Missing PDF: ${item.localPath}. Run "npm run pdf:export" first.`
    );
  }
  const body = fs.readFileSync(item.localPath);
  const result = await put(item.blobPath, body, {
    access: 'private',
    addRandomSuffix: true,
    contentType: item.contentType || 'application/pdf'
  });
  return result;
}

function runDryRun() {
  console.log('Blob upload DRY RUN — no files will be uploaded.\n');
  let requiredMissing = false;
  for (const item of PDFS) {
    const info = inspectLocal(item);
    if (info.exists) {
      console.log('[OK]   ' + item.label);
      console.log('       ' + item.envName);
      console.log('       ' + formatBytes(info.size) + '  ' + item.localPath);
    } else if (item.optional) {
      console.log('[WARN] ' + item.label + ' missing (optional Pro companion)');
      console.log('       expected ' + item.envName);
      console.log('       ' + item.localPath);
    } else {
      console.log('[FAIL] ' + item.label + ' missing');
      console.log('       expected ' + item.envName);
      console.log('       Run npm run pdf:export first.');
      requiredMissing = true;
    }
  }
  printExistingEnvPaste();
  console.log('\n' + BUNDLE_NO_URL_NOTE);
  if (requiredMissing) process.exit(1);
}

(async () => {
  if (DRY_RUN) {
    runDryRun();
    return;
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      'BLOB_READ_WRITE_TOKEN is missing. Add it to your .env (from Vercel Storage -> Blob).'
    );
    process.exit(1);
  }

  console.log('Uploading CMO PDFs to Vercel Blob...\n');
  const lines = [];
  for (const item of PDFS) {
    try {
      const result = await uploadOne(item);
      console.log(`[OK] ${item.label}`);
      console.log(`     URL: ${result.url}`);
      lines.push(`${item.envName}=${result.url}`);
    } catch (error) {
      console.error(`[ERROR] ${item.label}: ${error.message}`);
      process.exitCode = 1;
    }
  }

  printPasteFooter(lines);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
