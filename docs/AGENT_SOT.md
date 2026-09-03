# Agent operational SOT — CMO (Spin-off #2)

**Purpose:** Single operational entry for Cursor agents and PR review: paths, build, deploy, commerce, GEO.  
**Not a replacement for:** [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) (DOM/JS contract) or [AGENTS.md](../AGENTS.md) (roles/workflow).

**Last updated:** 2026-09-03 (root `/` → `/en/`; GO_LIVE_RUNBOOK + check:prod; IndexNow after Vercel; `#pro-contents` hub)

---

## 1. Product model

| Aspect | Canon |
|--------|--------|
| Public product | **EN canonical** — `/en/` (`hreflang x-default`) |
| Free EN surface | **Tool-first:** hero → open `#creative-brief` → `#pdf-storefront` (2 cards) → library **1,2,3,5** (display 1–4) → `#cmo-safety` → `#cmo-scenarios` → `#pro-contents`; progress **of 4**; **0** meme slots |
| Design system | [STYLEGUIDE.md](../STYLEGUIDE.md) **1.6.1** Product Operator (Fraunces hero H1; Source Sans 3 UI; JetBrains Mono; warm paper; hero sample image) |
| Pro / data SSOT | Still **10** prompt bodies (`data/en-prompt-bodies.json`); registry `freeInteractive: ["1","2","3","5"]` |
| LT | **Frozen tester snapshot** — `/lt/` shipped; **not** negotiated from `/` (`Accept-Language` / `navigator.language`); build strips `#creative-brief` + `#heroCtaBrief`; no active dev without Orchestrator scope |
| Commerce | EN-only on `promptanatomy.space`; mirror omits `#pdf-storefront` (`MIRROR_NOTE=1`); free brief **does** ship on mirror |
| Fulfillment | Vercel `api/` + Upstash Redis + Resend + Blob |
| **Roadmap** | [roadmap.md](../roadmap.md) R1–R4 (Ambition **A → E → light B → C**); active tracker [todo.md](../todo.md) |
| Go-live checklist (R1 detail) | [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md) — Ambition A ops SSOT |
| JTBD / GEO messaging | Same `/en/` URL: `sot.frontFaq` + `brand-seo` + `storefrontHead` + `llms.txt` hash hubs. Product name stays **Content AI System** ([PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md) §4). No multi-page SEO hub farm without Orchestrator scope. R2 after R1 exit. |

Locale policy: [MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) §0. Free-surface + GEO + R1-support lessons: [AGENTS.md](../AGENTS.md) §10 (esp. 11–13, 16–20).

---

## 2. File map

| Edit (source) | Generated / do not hand-edit |
|---------------|------------------------------|
| [index.html](../index.html) (DOM structure) | `lt/index.html`, `en/index.html` via build |
| [styles/design-tokens.json](../styles/design-tokens.json), [styles/*.css](../styles/) | Shared LT/EN CSS; DS 1.6.1 in STYLEGUIDE |
| [data/en-*.json](../data/) | EN prompt bodies (10), expected, scenarios |
| [data/cmo-prompt-registry.json](../data/cmo-prompt-registry.json) | Prompt TOC + `freeInteractive` spine ids |
| [config/sot.json](../config/sot.json) | Commerce, brand, GEO (`frontFaq`, `knowsAbout`), storefront, `copy.creativeBrief` |
| [config/brand-seo.json](../config/brand-seo.json) | Title, description, OG alt / JTBD meta |
| [scripts/build-locale-pages.js](../scripts/build-locale-pages.js) | Locale build + FAQ inject + GEO emit |
| [index.html](../index.html) `applyStaticLocaleText` | EN runtime FAQ/hero strings — must sync with `frontFaq` / inject |
| [scripts/geo-surfaces.js](../scripts/geo-surfaces.js) | robots, sitemap, llms (+ hash hubs), 404, manifest, JSON-LD |
| [scripts/check-prod-health.js](../scripts/check-prod-health.js) | Production fulfillment-health + IndexNow key (`npm run check:prod`) |
| [js/va-track.js](../js/va-track.js) | Named conversion events (no PII) |
| [api/_lib/fulfillment.js](../api/_lib/fulfillment.js) | Stripe fulfillment |
| [success.html](../success.html), [terms.html](../terms.html) | Hand-edit; sync trust address with SOT |

After content changes: **`npm run build`** or **`npm test`**.

---

## 3. Build and test sequence

```bash
npm install
npm run build   # favicons + og + locale + geo + public/
npm test        # build + structure + registry + smoke + lint
```

`npm test` is the merge gate. Optional: `npm run test:e2e`, `npm run check:fulfillment`, `npm run check:prod`. Go-live command order: [GO_LIVE_RUNBOOK.md](GO_LIVE_RUNBOOK.md).

**Production build gate (after Stripe go-live):** Vercel Build Command → `REQUIRE_STRIPE_LINKS=1 npm run build` (Stripe links asserted in the locale build). Full `npm test` stays on GitHub CI.

---

## 4. Commerce (summary)

- Products: Starter $3.99, Pro $8.99, Bundle $10.99 — [config/sot.json](../config/sot.json)
- Placeholder mode: `allowPlaceholderCheckout: true` → CTAs → `/coming-soon.html`
- Live mode: all three `stripePaymentLinks.*` + `allowPlaceholderCheckout: false`
- Env matrix: [DEPLOYMENT.md](../DEPLOYMENT.md) §2.5
- Operator sequence: [GO_LIVE_RUNBOOK.md](GO_LIVE_RUNBOOK.md) (`pdf:upload-blob:dry` → upload → `check:fulfillment` → `check:prod`)

---

## 5. GEO / AI crawler contract

Emitted by [scripts/geo-surfaces.js](../scripts/geo-surfaces.js) on every build:

| File | Purpose |
|------|---------|
| `robots.txt` | Per-AI-bot allow/disallow; `/api/` blocked for default `*` |
| `sitemap.xml` | `lastmod`, `xmlns:image`, `/en/`, `/lt/`, terms |
| `llms.txt` / `llms-full.txt` | AI-friendly site map + `/en/#…` hash hubs (`#block1`, `#creative-brief`, `#cmo-safety`, `#pro-contents`, `#faq`, `#pdf-storefront`, `#prompt-basics`); full-10 digest = **Pro/system**, not free interactive claim |
| `{INDEXNOW_KEY}.txt` | IndexNow verification |
| `404.html` | EN noindex → `/en/` |
| `manifest.webmanifest` | PWA-lite, `start_url: /en/` |
| EN JSON-LD `@graph` | WebSite, Organization, Person, FAQPage (`frontFaq`+`buyerFaq`), 3× Product |

**JTBD SSOT:** `sot.frontFaq` / `brand-seo` / `storefrontHead` — on `/en/` only; no extra landing hubs by default ([AGENTS.md](../AGENTS.md) §10.11–13).

**Forbidden:** `aggregateRating` / fake Review schema; `SoftwareApplication` login product; inventing ROI/stack stats as claims.

IndexNow: the **real signal** is `npm run seo:indexnow` after a **Vercel** production deploy (primary host). GitHub Pages `seo:indexnow:diff` on `main` is non-blocking and is not sufficient. `npm run check:prod` asserts the hosted `{INDEXNOW_KEY}.txt` file.

Language/brand: [language-guidelines-en-lt.md](language-guidelines-en-lt.md).

---

## 6. Deploy and QA URLs

| Target | URL |
|--------|-----|
| Primary | https://promptanatomy.space/en/ |
| Mirror | https://ditreneris.github.io/cmo/en/ (no storefront) |

Post-deploy QA: [TESTAVIMAS.md](TESTAVIMAS.md) — **release acceptance on `/en/` only**.

Pa11y (CI): `/lt/`, `/en/`, privacy pages.

---

## 7. Related docs

- [roadmap.md](../roadmap.md) — product roadmap R1–R4
- [todo.md](../todo.md) — active R1 tracker
- [docs/INDEX.md](INDEX.md) — navigation by role
- [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) — structure contract
- [PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md) — paid layer copy
- [BRAND_SYNC.md](BRAND_SYNC.md) — mother brand tokens + QW1b entity footer
- [STYLEGUIDE.md](../STYLEGUIDE.md) — DS **1.6.1** Product Operator
- [security.md](security.md) — headers, CSP, secrets
- [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md) — Stripe go-live (R1)
