# Active roadmap tracker

**Canon:** [roadmap.md](roadmap.md) — Ambition **A → E → light B → C** (R1–R4)  
**Active:** **R1 — Ambition A** (close the cash register)  
**R1 ops SSOT:** [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md) (full env matrix — do not duplicate here)  
**Operator sequence:** [docs/GO_LIVE_RUNBOOK.md](docs/GO_LIVE_RUNBOOK.md) (`pdf:upload-blob:dry` → upload → `check:fulfillment` → `check:prod`)  
**UX Conversion Audit:** P0/P1 shipped 2026-09-03 as **R1-support** (does **not** count as R1 exit). Audit P0–P3 ≠ roadmap R1–R4.  
**Last updated:** 2026-09-03 (R1-support 3: tool-first IA; R1 Stripe still open)

---

## R1 — Ambition A (in progress)

Short boxes only; details live in MUST_TODO_STRIPE.

This **is** Audit P3 “complete live purchase drills”. Do not open a separate UI task for it.

- [ ] [PDF pipeline](MUST_TODO_STRIPE.md#pdf-pipeline) — [runbook](docs/GO_LIVE_RUNBOOK.md) steps 1–3: dry-run → `npm run pdf:upload-blob` → paste `PDF_CMO_*_SOURCE_URL` into Vercel Production
- [ ] [Stripe Dashboard](MUST_TODO_STRIPE.md#stripe-dashboard) — success URL, webhook, `price_…` / `whsec_…` confirmed for all three SKUs
- [ ] [Vercel Production env](MUST_TODO_STRIPE.md#vercel-production-env) — all keys from `.env.example`; Redeploy
- [ ] [QA prieš release](MUST_TODO_STRIPE.md#qa-prieš-release) — `npm run check:fulfillment`; `npm run check:prod` → `{ ok: true, missing: [] }`
- [ ] Live purchase drill — Starter $3.99 → email ≤5 min → download; then Pro + Bundle; `success.html` poll
- [ ] Commit + push → Vercel redeploy (after SOT/env complete); production build gate `REQUIRE_STRIPE_LINKS=1 npm run build` per [vercel.json](vercel.json)

**R1 exit:** fulfillment health green + live Starter (then Pro/Bundle) proven. Then unlock R2.

---

## R1-support — /en/ conversion surface (shipped 2026-09-03)

Does not replace Stripe ops. Does not count as R1 exit.

- [x] Hero diagram: larger system visual + product module labels + outputs row
- [x] Primary CTA customer language (superseded by R1-support 3: CTA → `#creative-brief`)
- [x] Trust chips simplified; one credibility line; quiet usage strip
- [x] Lang switcher demoted; type weight on lead/CTA
- [x] Tests + STYLEGUIDE/LEGACY/CHANGELOG sync; `npm test` green
- [x] **EN path cut:** kill pre-spine chrome; collapse context/safety/brief; storefront no comparison table; docs sync
- [x] **EN conversion P0/P1:** lang switcher removed from product UX; sticky `#siteNav` adds Workflows / Brief builder / Pricing; hero names the 30-day Content AI System + price anchor; `#progressJumpPro` now jumps to `#pdf-storefront`; storefront copy reframed as Use · Build · Install maturity ladder.
- [x] **Credibility defects:** EN prompt hover tooltip fixed; EN definitions heading fixed; FAQ no longer shows raw `#cmo-safety` as link text; EN privacy/terms/success/coming-soon use shared DS chrome and back links.

## R1-support 2 — show the product (2026-09-03)

Does not replace Stripe ops. Does not count as R1 exit. Does **not** delete the Pro SKU.

- [x] **CEO IA (superseded by R1-support 3):** do not restore Prompt 1 as first-use
- [x] **Hero sample (superseded):** 30-day table replaced by brief-builder output
- [x] **2-card storefront:** Starter $3.99 + Complete $10.99 (Best value); Pro $8.99 = text link
- [x] **Workbook cards:** title + `<pre>` + Copy + done (no tags / edit-hint / info-box)
- [x] Docs + `tests/structure.test.js` + checkout e2e synced; 2-card UI ≠ SKU delete

### Leftovers (optional, non-blocking)

Copy/ops only. Do not reopen path-cut decisions.

- [x] **Footer / BRAND_SYNC:** shipped EN footer is “Methodology at promptanatomy.app”. Docs match code. Never send checkout to `.app`.
- [x] **Bundle saving:** state `$12.98` separately vs `$10.99` together — copy only, **no** comparison table on page. *(2026-09-03: `compareAtUsd` 12.98 + `separately $12.98` price line)*
- [x] **Analytics (Orchestrator decide):** Vercel Web Analytics events `copy_prompt_1` / `open_brief` / `click_starter` / `success_download` (`js/va-track.js`). Enable the dashboard toggle. Not R1 exit.
- [x] **Root → /en/:** no Accept-Language / navigator.language dump to frozen `/lt/` (2026-09-03). `/lt/` remains direct-URL archive only.

## R1-support 4 — craft atmosphere (2026-09-03)

Does not replace Stripe ops. Does not count as R1 exit. DS 1.6.1, not 1.7.

- [x] Warm paper tokens (`#F6F1E8`); EN hero = Satori sample image + prompt caption
- [x] Builder output pane navy studio; `.cb-tool-silhouette` removed
- [x] Complete card visual weight (2 cards stay)
- [x] Tests + STYLEGUIDE 1.6.1 / LEGACY / CHANGELOG sync

## R1-support 3 — tool-first IA (2026-09-03)

Does not replace Stripe ops. Does not count as R1 exit.

- [x] **True CEO path:** Hero → open `#creative-brief` → 2 PDF cards → library **1/2/3/5** (display 1–4)
- [x] Hero primary `#heroCtaSpine` → `#creative-brief` (*Build my prompt*); sample = brief output
- [x] `#cb-builder` default **open**; `open_brief` on first use, not page load
- [x] Improve card displays **4**, not 5; IDs stay `#block5` / `prompt5`
- [x] Docs + `tests/structure.test.js` + creative-brief e2e synced

### Do not do (audit asked; canon forbids)

Without Orchestrator rewrite of [AGENTS.md](AGENTS.md) §0.1 / §10.7 / §10.15 + LEGACY:

- Redefine „įrankis“ as Prompt 1 Copy
- Render `comparisonTable` on `/en/`
- Dual-primary CTA (builder stays primary on EN)
- Delete the Pro SKU or change Stripe `priceUsd`

Hero **brief-builder sample** is allowed — that is not the old fat pipeline diagram. Open `#cb-builder` **is** canon.

---

## Upcoming (locked until R1 exit)

- [ ] **R2 — Ambition E:** GEO on one `/en/` URL (`frontFaq`, `llms.txt` hubs, IndexNow) — [roadmap.md](roadmap.md#r2--ambition-e-geo--ai-search-distribution). Baseline harden (FAQ answer parity, `#pro-contents` hub, `check:prod` IndexNow + Vercel ping in runbook) shipped; **not** R2 exit.
- [ ] **R3 — Ambition B (light):** exactly one new sessionStorage tool after `#block5` — [roadmap.md](roadmap.md#r3--ambition-b-light-one-more-browser-local-tool)
- [ ] **R4 — Ambition C:** deepen Pro/Bundle Install (workshop / MD vault) — [roadmap.md](roadmap.md#r4--ambition-c-offline-install-depth)

Parked (not in queue): Ambition F (SaaS), D (vertical kits), G (mother brand — full brand-split / Audit RC6), [docs/TEMPLATE_MIGRATION_BACKLOG.md](docs/TEMPLATE_MIGRATION_BACKLOG.md) + Audit P2 CSS dual-layer (inline `<style>` vs `components.css`), Audit P3 persona vs $3.99 (reopen as R4 after converting).

---

## Storefront / PDF regeneration

Commands: [docs/OFFER-ARCHITECTURE.md](docs/OFFER-ARCHITECTURE.md) §4 (`pdf:covers`, `pdf:previews`, `pdf:export`, `build`).

---

## Done (archive)

- PDF covers Starter + Pro + Bundle (Playwright WYSIWYG) — shipped v1.8 / v1.9; SOT `coverPng` for all three SKUs
- Repo commerce prep (done in code) — live Payment Links in SOT; `allowPlaceholderCheckout: false`; structure/e2e gates (ops remaining = R1 above)
- EN conversion P0/P1 (Audit) — sticky Pricing nav, hero outcome + price anchor, Use · Build · Install storefront, satellite DS chrome (2026-09-03)
