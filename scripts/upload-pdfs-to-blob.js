'use strict';

/**
 * scripts/upload-pdfs-to-blob.js
 *
 * Uploads paid CMO PDFs from api/_private/pdfs/ to Vercel Blob private store.
 * Requires BLOB_READ_WRITE_TOKEN in .env.
 *
 * Run AFTER `npm run pdf:export`:
 *   npm run pdf:upload-blob
 *
 * After upload, paste each printed URL into Vercel Production env as
 * PDF_CMO_STARTER_SOURCE_URL / PDF_CMO_PRO_SOURCE_URL, then redeploy.
 *
 * Memo §3.3: do NOT commit paid PDFs to git; never serve from public/.
 */

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

const ROOT = path.resolve(__dirname, '..');

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
    contentType: 'text/markdown; charset=utf-8'
  }
];

async function uploadOne(item) {
  if (!fs.existsSync(item.localPath)) {
    throw new Error(
      `Missing PDF: ${item.localPath}. Run "npm run pdf:export" first.`
    );
  }
  const body = fs.readFileSync(item.localPath);
  const result = await put(item.blobPath, body, {
    access: 'public',
    addRandomSuffix: true,
    contentType: item.contentType || 'application/pdf'
  });
  return result;
}

(async () => {
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

  if (lines.length) {
    console.log(
      '\n--- Paste these into Vercel Production env (Settings -> Environment Variables) ---'
    );
    for (const line of lines) console.log(line);
    console.log(
      '\nAfter saving, redeploy. Verify with: GET https://promptanatomy.space/api/fulfillment-health'
    );
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
