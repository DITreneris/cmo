# Creative Brief Builder (`#creative-brief`)

**Status:** shipped (EN free layer) · **Stripe:** out of scope · **Locale:** EN-only (not on `/lt/`) · **Mirror:** yes (free tool)

Companion to [PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md) and [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md). Pattern borrowed from sibling inzinerija `VaizdoGeneratoriusSlide` (static HTML/JS port — no React).

## Promise

Browser-only builder: fill a short creative brief → live image-ready prompt → copy or copy+open an image tool. No account, no POST, no AI API call.

Distinct from `#cmo-context` (text-prompt CONTEXT prepend on Copy). Soft link: Audience may prefill from `sessionStorage` key `cmo.context.v1`.

## Placement

After `#cmo-safety` (post-spine free loop), before `#cmo-scenarios` and `#pro-contents` catalog (`data-teaser-prompt` 4, 6–10). Secondary hero CTA on EN (`#heroCtaBrief`); primary is `#heroCtaSpine` → `#block1`. Anchor in root `index.html`: `<!-- CMO_CREATIVE_BRIEF -->`. Injected by [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) on EN only (LT strips the anchor, `#heroCtaBrief`, and `#progressJumpCreative`).

**Default UI:** teaser only (eyebrow + H2 + lead). Full builder lives in closed `<details id="cb-builder">` (“Open brief builder”) so the free path is not a mini-app wall after safety.

## DOM contract

| ID / selector | Role |
|---------------|------|
| `#creative-brief` | Section |
| `#cb-title` | H2 (always visible teaser) |
| `#cb-builder` | Collapsed builder `<details>` (default closed) |
| `#cb-builder-summary` | Open control |
| `.cb-presets` + `[data-cb-preset]` | ecommerce / brand / social (inside builder) |
| `.cb-steps` | Context / Visual / Text focus chips |
| `#cbForm` | Field grid (no submit action) |
| `#cbCampaignGoal` … `#cbCta` | Inputs (see LEGACY) |
| `#cbQuality` + `#cbQualityHint` | Readiness meter |
| `#cbOutput` | Editable textarea |
| `#cbCopyBtn` | Copy |
| `#cbSampleBtn` | Apply sample preset |
| `#cbCharCount` | Character count |
| `.cb-tool-grid` + `[data-cb-tool-url]` | Image tools — **ChatGPT + Ideogram only** |
| `#cbTips` | Expert tips `<details>` |

## SOT keys

[`config/sot.json`](../config/sot.json):

- `copy.creativeBrief` — title, lead, labels, toasts, tips
- `creativeBrief.tools[]` — `{ name, url, description }` for the tool grid

## Scripts / styles

- [`js/creative-brief.js`](../js/creative-brief.js) — IIFE; no-ops if `#creative-brief` missing
- [`styles/components.css`](../styles/components.css) — `.creative-brief*` block

## Storage

| Key | Where | Purpose |
|-----|-------|---------|
| `cmo.creativeBrief.v1` | sessionStorage | Draft restore (size-capped) |
| `cmo.context.v1` | sessionStorage | Read-only audience prefill |

## Out of scope

- I2V clip builder, Consistency Lock Lab
- React / Tailwind port from inzinerija
- LT UI / `data/lt-*.json`
- Stripe / paid storefront changes
- **Sibling browser tools** — Ambition B / Roadmap **R3** only after **R1** exit ([roadmap.md](../roadmap.md)); still no account / SaaS. Pattern for the next tool stays this file + sessionStorage.

## Quality gates

```bash
npm test
npm run test:e2e   # includes tests/e2e/creative-brief.spec.js
```
