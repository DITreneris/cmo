# Creative Brief Builder (`#creative-brief`)

**Status:** shipped (EN free layer) · **Stripe:** out of scope · **Locale:** EN-only (not on `/lt/`) · **Mirror:** yes (free tool)

Companion to [PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md) and [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md). Pattern borrowed from sibling inzinerija `VaizdoGeneratoriusSlide` (static HTML/JS port — no React).

## Promise

Browser-only builder: fill a short creative brief → live image-ready prompt → copy or copy+open an image tool. No account, no POST, no AI API call.

Distinct from `#cmo-context` (text-prompt CONTEXT prepend on Copy). Soft link: Audience may prefill from `sessionStorage` key `cmo.context.v1`.

## Placement

Immediately after the hero, **before** `#pdf-storefront` (tool-first CEO IA). Library 1/2/3/5 and `#pro-contents` sit after the kits. Hero primary `#heroCtaSpine` → `#creative-brief`. Secondary `#heroCtaBrief` is **See pricing** → `#pdf-storefront`. Anchor in root `index.html`: `<!-- CMO_CREATIVE_BRIEF -->`. Injected by [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) on EN only (LT strips the anchor, `#heroCtaBrief`, and `#progressJumpCreative`). EN `#progressJump` is Plan · Create · Check · Improve.

**Default UI:** `#cb-builder` **open**. The H2 is the landmark. **Try an example** is a label above three equal preset cells. The picked preset is sand with an ink border and no disc. Lists of 3 options are three equal cells; lists of 5 stay two columns, and the fifth cell is one column wide, so a long label wraps inside it. The `<select>` keeps the field id and the value. A picked choice is sand, an ink border, and a 6px ink disc. The three steps are buttons like the presets. The current step is a 2px gold edge with no shadow. Brief readiness is one line with no frame of its own. From 900px, while the builder is open, `.cb-stage` is one viewport (`calc(100dvh - 5.5rem)`): the title and fields scroll in the left pane, the prompt pane scrolls on the right, and the page does not grow with the panel. From 900px the navy sheet fills the right column and the prompt takes the leftover height. A longer prompt scrolls inside the field. A step click focuses the first field without scrolling the page. A filled text field gets an ink border (`--color-text-primary`). Closing the builder drops the stage back to `height: auto`; the prompt stays. The summary is a quiet keyboard row, not a second heading. At 320px the summary stays visible and the stage is one column, not a viewport lock. First real use (form input **or** preset / Copy / tool) fires `open_brief` via [`js/va-track.js`](../js/va-track.js) (no-op without Vercel Analytics). Do not fire on page load. Init must not steal focus (`showStep(1)` without `shouldFocus`).

## DOM contract

| ID / selector | Role |
|---------------|------|
| `#creative-brief` | Section |
| `.cb-stage` | From 900px, the open tool’s viewport. Holds `.cb-stage-main` and `.cb-output-wrap` |
| `.cb-output-sheet` | Navy artifact inside the transparent scrollport. Holds quality, prompt, Copy, and the two tools |
| `#cb-title` | H2 (always visible teaser) |
| `#cb-builder` | Open builder `<details>` (default **open**) |
| `#cb-builder-summary` | Open control |
| `.cb-presets` + `[data-cb-preset]` | The only start: three equal cells. Label **Try an example** sits above. Pressed cell is an ink fill |
| `.cb-choice` | Equal cells. Three options share one row. Five options use two columns, and the fifth spans the row. Pressed cell is an ink fill |
| `.cb-steps` | Three buttons like the presets. The current step is a 2px gold edge with no shadow |
| `#cbForm` | Field grid (no submit action) |
| `#cbCampaignGoal` … `#cbCta` | Inputs (see LEGACY) |
| `#cbQuality` + `#cbQualityHint` | Readiness meter |
| `#cbOutput` | Editable textarea |
| `#cbCopyBtn` | Copy |
| `#cbCharCount` | Character count |
| `.cb-tool-grid` + `[data-cb-tool-url]` | Image tools — **ChatGPT + Ideogram only** |

## SOT keys

[`config/sot.json`](../config/sot.json):

- `copy.creativeBrief` — title, labels, toasts, tips. `lead` and `sampleLabel` are not rendered.
- `creativeBrief.tools[]` — `{ name, url, description }` for the tool grid

## Scripts / styles

- [`js/creative-brief.js`](../js/creative-brief.js) — IIFE; no-ops if `#creative-brief` missing
- [`styles/components.css`](../styles/components.css) — `.creative-brief*` block; `.cb-panel[hidden] { display: none !important }`; output pane is a navy studio (same grammar as `.hero-diagram`). No dashed `.cb-tool-silhouette`.

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
