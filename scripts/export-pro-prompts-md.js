'use strict';

/**
 * scripts/export-pro-prompts-md.js
 * Builds Markdown companion for Pro PDF from en-prompt-bodies.json + registry.
 * Output: api/_private/prompts/cmo-pro-prompts.md (gitignored)
 *
 * Run: node scripts/export-pro-prompts-md.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const bodiesPath = path.join(ROOT, 'data', 'en-prompt-bodies.json');
const registryPath = path.join(ROOT, 'data', 'cmo-prompt-registry.json');
const outPath = path.join(ROOT, 'api', '_private', 'prompts', 'cmo-pro-prompts.md');

const bodies = JSON.parse(fs.readFileSync(bodiesPath, 'utf8'));
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

const lines = [
  '# CMO AI Content System · Pro — Markdown companion',
  '',
  'Copy-paste prompt bodies for ChatGPT, Claude, or Gemini. Pair with the Pro PDF at promptanatomy.space.',
  '',
  '## Marketing context block (paste above any prompt)',
  '',
  '```',
  'CONTEXT:',
  '- Audience: [specific role + market + pain]',
  '- Offer: [what we sell, outcome it produces]',
  '- Channels: [primary, secondary, constraint per channel]',
  '- Goal: [one KPI + target window]',
  '- Constraint: [brand voice, legal, time, budget]',
  '',
  'RULES (non-negotiable):',
  '- Mark any unsupported claim with [VERIFY].',
  '- Do not invent customer names, numbers, or quotes.',
  '- Stay inside the constraints above.',
  '```',
  ''
];

registry.prompts.forEach(function (meta, index) {
  const body = bodies[index] || '';
  lines.push(`## Prompt ${meta.id} — ${meta.title}`);
  lines.push('');
  lines.push(`- Phase: ${meta.phase}`);
  lines.push(`- Time: ~${meta.timeMin} min`);
  lines.push('');
  lines.push('```');
  lines.push(body.trim());
  lines.push('```');
  lines.push('');
});

lines.push('---');
lines.push('');
lines.push('© Prompt Anatomy · Team license: promptanatomy.space/terms/#paid-pdf-license');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('[OK] Wrote', outPath, '(' + lines.length + ' lines)');
