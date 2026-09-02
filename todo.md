# Active roadmap tracker

**Canon:** [roadmap.md](roadmap.md) — Ambition **A → E → light B → C** (R1–R4)  
**Active:** **R1 — Ambition A** (close the cash register)  
**R1 ops SSOT:** [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md) (full env matrix — do not duplicate here)  
**Last updated:** 2026-08-11

---

## R1 — Ambition A (in progress)

Short boxes only; details live in MUST_TODO_STRIPE.

- [ ] [PDF pipeline](MUST_TODO_STRIPE.md#pdf-pipeline) — `npm run pdf:upload-blob` → paste `PDF_CMO_*_SOURCE_URL` into Vercel Production
- [ ] [Stripe Dashboard](MUST_TODO_STRIPE.md#stripe-dashboard) — success URL, webhook, `price_…` / `whsec_…` confirmed for all three SKUs
- [ ] [Vercel Production env](MUST_TODO_STRIPE.md#vercel-production-env) — all keys from `.env.example`; Redeploy
- [ ] [QA prieš release](MUST_TODO_STRIPE.md#qa-prieš-release) — `npm run check:fulfillment`; `GET /api/fulfillment-health` → `{ ok: true, missing: [] }`
- [ ] Live purchase drill — Starter $3.99 → email ≤5 min → download; then Pro + Bundle; `success.html` poll
- [ ] Commit + push → Vercel redeploy (after SOT/env complete); production build gate `REQUIRE_STRIPE_LINKS=1 npm test` per [vercel.json](vercel.json)

**R1 exit:** fulfillment health green + live Starter (then Pro/Bundle) proven. Then unlock R2.

---

## R1-support — /en/ conversion surface (parallel, non-blocking)

Does not replace Stripe ops. Does not count as R1 exit.

- [x] Hero diagram: larger system visual + product module labels + outputs row
- [x] Primary CTA customer language → #block1 (keep spine-first)
- [x] Trust chips simplified; one credibility line; quiet usage strip
- [x] Lang switcher demoted; type weight on lead/CTA
- [x] Tests + STYLEGUIDE/LEGACY/CHANGELOG sync; `npm test` green
- [x] **EN path cut:** kill pre-spine chrome; collapse context/safety/brief; storefront no comparison table; docs sync

---

## Upcoming (locked until R1 exit)

- [ ] **R2 — Ambition E:** GEO on one `/en/` URL (`frontFaq`, `llms.txt` hubs, IndexNow) — [roadmap.md](roadmap.md#r2--ambition-e-geo--ai-search-distribution)
- [ ] **R3 — Ambition B (light):** exactly one new sessionStorage tool after `#block5` — [roadmap.md](roadmap.md#r3--ambition-b-light-one-more-browser-local-tool)
- [ ] **R4 — Ambition C:** deepen Pro/Bundle Install (workshop / MD vault) — [roadmap.md](roadmap.md#r4--ambition-c-offline-install-depth)

Parked (not in queue): Ambition F (SaaS), D (vertical kits), G (mother brand), [docs/TEMPLATE_MIGRATION_BACKLOG.md](docs/TEMPLATE_MIGRATION_BACKLOG.md).

---

## Storefront / PDF regeneration

Commands: [docs/OFFER-ARCHITECTURE.md](docs/OFFER-ARCHITECTURE.md) §4 (`pdf:covers`, `pdf:previews`, `pdf:export`, `build`).

---

## Done (archive)

- PDF covers Starter + Pro + Bundle (Playwright WYSIWYG) — shipped v1.8 / v1.9; SOT `coverPng` for all three SKUs
- Repo commerce prep Phase 1a/1b — live Payment Links in SOT; `allowPlaceholderCheckout: false`; structure/e2e gates (ops remaining = R1 above)
