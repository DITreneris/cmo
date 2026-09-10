# Creative Brief Builder (`#creative-brief`)

**Status:** shipped (EN free layer) · **Stripe:** out of scope · **Locale:** EN-only (not on `/lt/`) · **Mirror:** yes (free tool)

Companion to [PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md) and [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md). Pattern borrowed from sibling inzinerija `VaizdoGeneratoriusSlide` (static HTML/JS port — no React).

## Promise

Browser-only builder: fill a short creative brief → live image-ready prompt → copy or copy+open an image tool. No account, no POST, no AI API call.

Distinct from `#cmo-context` (text-prompt CONTEXT prepend on Copy). Soft link: Audience may prefill from `sessionStorage` key `cmo.context.v1`.

## Placement

Immediately after the hero, **before** `#pdf-storefront` (tool-first CEO IA). Library 1/2/3/5 and `#pro-contents` sit after the kits. Hero primary `#heroCtaSpine` → `#creative-brief`. Secondary `#heroCtaBrief` is **View kits** → `#pdf-storefront`. Anchor in root `index.html`: `<!-- CMO_CREATIVE_BRIEF -->`. Injected by [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) on EN only (LT strips the anchor, `#heroCtaBrief`, and `#progressJumpCreative`).

**Default UI:** `#cb-builder` **open**. First real use (form input **or** preset / Copy / sample / tool) fires `open_brief` via [`js/va-track.js`](../js/va-track.js) (no-op without Vercel Analytics). Do not fire on page load. Init must not steal focus (`showStep(1)` without `shouldFocus`).

## DOM contract

| ID / selector | Role |
|---------------|------|
| `#creative-brief` | Section |
| `#cb-title` | H2 (always visible teaser) |
| `#cb-builder` | Open builder `<details>` (default **open**) |
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
- [`styles/components.css`](../styles/components.css) — `.creative-brief*` block; output pane is a navy studio (same grammar as `.hero-diagram`). No dashed `.cb-tool-silhouette`.

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
