# Template migration backlog (Phase 4b — deferred)

**Status:** Not scheduled. Separate Orchestrator scope.

## Problem

Dual authoring source:

- DOM structure in [index.html](../index.html) (LT `<pre>` legacy)
- EN prompt bodies in [data/en-prompt-bodies.json](../data/en-prompt-bodies.json)

Personalas uses `templates/index-lt.html` → single build path. CMO agents must know both paths.

## Proposed epic (when approved)

1. Introduce `templates/index-source.html` mirroring Legacy DOM contract.
2. Expand [tests/structure.test.js](../tests/structure.test.js) before file moves.
3. Update [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) §0 explicitly.
4. Keep CMO v2 inject blocks in build — **do not** inline into template.

## Out of scope

- Removing `/lt/` tester snapshot
- EN-only redirects (Personalas model)
- Changing prompt IDs or JS API without QA sign-off

**Reference:** CMO Infrastructure Phases 1–4 plan, Phase 4b.
