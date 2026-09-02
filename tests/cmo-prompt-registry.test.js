/**
 * Validates data/cmo-prompt-registry.json — taxonomy for CMO PDF + web.
 * Run: node tests/cmo-prompt-registry.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'data', 'cmo-prompt-registry.json');
const SCENARIOS_PATH = path.join(ROOT, 'public', 'data', 'en-scenarios.json');

const VALID_PHASES = new Set(['Plan', 'Create', 'Check', 'Improve']);

let passed = 0;
let failed = 0;

function ok(msg) {
  console.log('OK  ' + msg);
  passed++;
}
function bad(msg) {
  console.error('FAIL ' + msg);
  failed++;
}
function check(cond, msg) {
  cond ? ok(msg) : bad(msg);
}

const raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
const registry = JSON.parse(raw);
const scenarios = JSON.parse(fs.readFileSync(SCENARIOS_PATH, 'utf8'));
const scenarioIds = new Set(scenarios.map((s) => s.id));

check(registry.version, 'registry has version');
check(
  Array.isArray(registry.freeInteractive) &&
    registry.freeInteractive.join(',') === '1,2,3,5',
  'freeInteractive spine 1,2,3,5'
);
check(Array.isArray(registry.contentOs) && registry.contentOs.length === 4, 'contentOs has 4 steps');
check(Array.isArray(registry.prompts) && registry.prompts.length === 10, 'exactly 10 prompts');

const ids = new Set();
for (const p of registry.prompts) {
  check(p.id && p.slug && p.title, 'prompt ' + p.id + ' has id, slug, title');
  check(VALID_PHASES.has(p.phase), 'prompt ' + p.id + ' phase is valid');
  check(typeof p.timeMin === 'number' && p.timeMin > 0, 'prompt ' + p.id + ' timeMin');
  check(typeof p.starterPage === 'number' && typeof p.proPage === 'number', 'prompt ' + p.id + ' page refs');
  check(!ids.has(p.id), 'prompt id unique: ' + p.id);
  ids.add(p.id);
  if (Array.isArray(p.scenarioIds)) {
    for (const sid of p.scenarioIds) {
      check(scenarioIds.has(sid), 'prompt ' + p.id + ' scenario ' + sid + ' exists in en-scenarios.json');
    }
  }
}

check(registry.starterToc && registry.starterToc.length === 14, 'starterToc has 14 entries');
check(registry.proToc && registry.proToc.length === 27, 'proToc has 27 entries');

for (const s of registry.scenarios) {
  check(scenarioIds.has(s.id), 'registry scenario ' + s.id + ' in en-scenarios.json');
  check(ids.has(s.startPromptId), 'scenario ' + s.id + ' startPromptId valid');
}

check(Array.isArray(registry.paths) && registry.paths.length >= 3, 'paths array populated');

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
