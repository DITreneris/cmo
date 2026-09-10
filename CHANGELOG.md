# Changelog

Visi reikšmingi projekto pakeitimai dokumentuojami šiame faile.

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Pataisyta
- **[Fix] Shared Stripe isolation (Ambition A):** webhook ACKs other-account checkouts with `200` `{ fulfillment: "ignored" }` instead of `500`. Match only `metadata.product`, optional `plink_…`, or `STRIPE_PRICE_CMO_*` — never dollar amount. Does not exit R1.
- **[Fix] Download-link contract (Ambition A):** `success.html` binds `downloadUrl || url`. API returns both keys plus `downloads[]` (Complete Kit = Starter + Pro in-page). Does not exit R1. No SemVer bump.
- **[Fix] Brief first-use:** `#cb-builder` init no longer autofocuses Campaign goal. `open_brief` fires on form input or preset/copy/tool. ChatGPT + Ideogram allowlist only.
- **[QA] Fulfillment-health:** public JSON omits `redisDetail` and raw `error.message`.
- **[UI] Hero LCP + EN meta:** WebP + `fetchpriority="high"` on the Satori sample; `brand-seo.json` mentions the open brief and 4 workflows / `$3.99`.

### Prideta
- **[Commerce] R1 ops companion (Ambition A):** Blob `--dry-run` + `npm run check:prod` (fulfillment-health + IndexNow key) + [docs/GO_LIVE_RUNBOOK.md](docs/GO_LIVE_RUNBOOK.md). Does not exit R1. No SemVer bump.
- **[UI] Conversion events:** `js/va-track.js` — `copy_prompt_1`, `open_brief`, `click_starter`, `success_download` (no PII; no-op without Vercel Analytics).
- **[Content/QA] GEO baseline harden (Ambition E waiver, not R2 exit):** `llms.txt` `#pro-contents` hub; FAQ answer parity vs `frontFaq`; IndexNow after Vercel documented.
- **[Docs/QA] Docs↔code↔rules sync (Parked / R1-support):** FAQ triple sync — `frontFaq`×11, no Midjourney / „Pro teasers“, brand-voice `#cmo-safety` link via `innerHTML`, dropped leftover EN_REPLACEMENTS FAQPage blob. LEGACY §2/§3.4/§7.5 match live spine + storefront-before-FAQ. Gold text → ink on live eyebrows/links. Page counts 14/30/44. INDEX inventory complete; PR template Ambition checkbox. No SemVer bump.
- **[Docs/Orchestrator] Agents v1.5.5 lesson §10.21:** Root never negotiates LT (`/` → `/en/`).
- **[Docs/Orchestrator] Agents v1.5.4 lessons §10.16–20:** Audit P ≠ roadmap R; offer math honesty (`separately $12.98`); footer Methodology at (never Training & checkout); gold = surface not link text; ecosystem demotion. INDEX / DOCUMENTATION / AGENT_SOT / `.cursorrules` pointers. No new repo-local Cursor skill.
- **[Docs/Orchestrator] UX Conversion Audit → tracker:** Audit P0/P1 = shipped **R1-support** (not R1 exit). [todo.md](todo.md) leftovers + do-not-do; [roadmap.md](roadmap.md) mapping table (P2 CSS parked with template migration, P3 drills = R1, persona/price = R4, brand-split = G).
- **[UI] Creative brief builder (`#creative-brief`):** EN-only free browser tool (after spine, before teasers) — A/E/C brief → live image prompt, presets, quality meter, copy + open image tools. SOT: `copy.creativeBrief` + `creativeBrief.tools`. Logic: [`js/creative-brief.js`](js/creative-brief.js). Docs: [`docs/CREATIVE_BRIEF_BUILDER.md`](docs/CREATIVE_BRIEF_BUILDER.md). Ships on GitHub Pages mirror; absent on `/lt/`. E2E: [`tests/e2e/creative-brief.spec.js`](tests/e2e/creative-brief.spec.js).

### Pakeista
- **[UI] R1-support 4 — craft atmosphere (Ambition A):** DS **1.6.1** warm paper (`#F6F1E8`); EN hero shows a Satori sample image + prompt caption (IDs kept); brief builder output pane is a navy studio; Complete card is visually heavier. Not R1 Stripe exit. No SemVer bump.
- **[UI/Curriculum] R1-support 3 — tool-first IA (Ambition A):** `/en/` is Hero → **open** `#creative-brief` → **2** PDF cards → library **1/2/3/5** (display 1–4; Improve shows 4, IDs stay `#block5`). Primary CTA *Start the builder* → `#creative-brief`. Hero sample = brief output. Buyer FAQ closed. `open_brief` on first use, not page load. Does **not** redefine įrankis as Prompt 1. Not R1 Stripe exit. Docs: AGENTS v1.5.7, STYLEGUIDE §0.4, LEGACY, OFFER, todo.
- **[UI/Curriculum] R1-support 2 — show the product (Ambition A):** CEO IA on `/en/`: Hero (sample 30-day output) → Prompt 1 + brief teaser → **2** PDF cards (Starter + Complete; Pro `$8.99` = text link) → library 2/3/5 + `#pro-contents` → FAQ. Prompt cards cut to title + `<pre>` + Copy. Hero secondary = View kits. Not R1 Stripe exit; not SKU delete. Docs: AGENTS v1.5.6, STYLEGUIDE §0.4, LEGACY, OFFER, todo.
- **[Fix] Root → `/en/`:** Vercel `/` no longer matches `Accept-Language: .*lt.*` into frozen `/lt/`. JS `prefersLithuanianBrowser()` removed; `redirectRootToLocale` always `/en/`. `/lt/` remains direct-URL archive only. Docs: [MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) §2.
- **[UI/Content] R1-support closeout:** Bundle Complete card shows `$10.99` vs `separately $12.98` (not `was $19.99`); storefront outcome line states the saving; gold no longer used as link/body text on progress jump, FAQ summaries, footer crosslink, or storefront trust links; ecosystem strip demotes Leader to a quiet related line and says checkout stays on this page; BRAND_SYNC + language-guidelines match shipped “Methodology at” footer.
- **[UI/Content] EN conversion P0/P1:** `/en/` hero perrašytas į aiškų outcome + kainos anchor („30-day Content AI System“, full kits from `$3.99`); pridėtas sticky `#siteNav` su Workflows / Brief builder / Pricing; `#progressJumpPro` dabar veda tiesiai į `#pdf-storefront`; trust chips pakeisti į free/brief/paid ribą; storefront SOT perrašytas į Use · Build · Install maturity ladder su outcome CTA („Get Starter/Pro/Complete“) ir atidarytu Buyer FAQ.
- **[UI/QA] EN-only UX cleanup:** pašalintas kalbos jungiklis iš produkto UX; `/lt/` paliktas tik archive/CI; EN prompt hover tooltip ir `#definitions-title` LT likučiai pataisyti; FAQ link text neberodo raw `#cmo-safety`; `en/privacy.html`, `terms.html`, `success.html`, `coming-soon.html` perkelti į bendrą DS chrome (`tokens.css` / `components.css` / `utilities.css`) be Inter/inline CSS.
- **[Fix] Vercel buildCommand:** `REQUIRE_STRIPE_LINKS=1 npm run build` (not `npm test`). Skip Playwright/Puppeteer browser download on install — deploy was hanging after `npm install`. Stripe link gate stays in the locale build; `npm test` remains CI.
- **[QA] Pre-launch claim + QA checklist sync:** `#cmoCtxOffer` placeholder no longer says „100 assets in 30 days“; README lead matches free surface (4 workflows + brief); [STYLEGUIDE.md](STYLEGUIDE.md) §0.4 and [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) UX checklist match path cut (no outputs row / cycle-stepper / comparison table).
- **[UI/Curriculum] EN path cut (Ambition A / R1 conversion):** Cut pre-spine chrome (cycle-stepper, provider hub, `#framework-schema`, hero outputs/tagline); jump = 1·2·3·5 · Pro · Brief · FAQ; short closed `#cmo-context` + thin `#cmo-safety`; creative brief = teaser + closed `#cb-builder` (ChatGPT + Ideogram only); storefront keeps 3 cards, **no** comparison table; trimmed SOT lead/bullets. LEGACY / AGENTS / OFFER / CREATIVE_BRIEF / STYLEGUIDE / structure + e2e updated.
- **[UI/Curriculum] Pro contents catalog + free-value reorder (Ambition A):** Replaced 6× `.prompt--teaser` cards with one `#pro-contents` outcome list; order is spine → `#cmo-safety` → EN `#creative-brief` → `#cmo-scenarios` → catalog → `#pdf-storefront` → FAQ → `#prompt-basics`. Build anchors `<!-- CMO_SAFETY -->` / `<!-- CMO_SCENARIOS -->`; `#progressJumpPro` → `#pro-contents`. LEGACY / OFFER / AGENTS / CREATIVE_BRIEF / STYLEGUIDE / structure tests updated.
- **[UI] Hero v02 (Ambition A conversion surface):** Larger `.hero-diagram` + product module descs + outputs row; EN primary CTA **Start your first workflow** → `#block1` (spine-first kept); three trust chips; `#heroProof`; quiet usage strip (no second CTA); demoted lang switcher. Tracker: [todo.md](todo.md) R1-support. Docs: STYLEGUIDE §0.4 / §2, LEGACY, OFFER §1.0.
- **[Content/UI] EN IA glossary:** Locked Prompt Anatomy / Content AI System / workflow / prompt / brief / Pro kit; hero drops status pills + eyebrow; tier line; `#heroCtaBrief` text link; slim diagram; usage sentence replaces Pick/Copy/Run ritual; progress „of 4 workflows“ (fix of-10 init). Docs: OFFER-ARCHITECTURE §1.0, STYLEGUIDE §0.4, LEGACY.
- **[UI] Design system 1.5 → 1.6 (Product Operator):** Fraunces **hero H1 only**; Source Sans 3 for product UI; hero PDF cover → navy Plan→Create→Check→Improve diagram (blog grammar); gold/shadow/radius restraint; dual prompt-chrome kill; compact `#executive-summary` how-it-works; brief presets neutral until selected. [`STYLEGUIDE.md`](STYLEGUIDE.md) **1.6**; LEGACY / BRAND_SYNC / AGENTS v1.5.2.
- **[Docs/Orchestrator] Agents v1.5.1:** [AGENTS.md](AGENTS.md) lessons §10.11–13 (JTBD ≠ rename, GEO on one URL, FAQ triple sync); Content/QA roles + commit prefiksai; [AGENT_SOT.md](docs/AGENT_SOT.md) / [INDEX.md](docs/INDEX.md) / [DOCUMENTATION.md](docs/DOCUMENTATION.md) — no new repo-local Cursor skills.
- **[Content/UI] Report A+B messaging + on-page GEO:** EN JTBD language (structured workflows vs prompt gambling, prompts-over-LLM, brand voice / pre-publish) in [`config/brand-seo.json`](config/brand-seo.json), [`config/sot.json`](config/sot.json) (`frontFaq`×10, `knowsAbout`, storefront head, bullets, buyer FAQ “PDF ≠ live app”), EN replacements + `applyStaticLocaleText`, safety intro. [`scripts/geo-surfaces.js`](scripts/geo-surfaces.js): `llms.txt` **On this page** hash hubs (`#block1`, `#creative-brief`, `#cmo-safety`, `#faq`, `#pdf-storefront`, `#prompt-basics`). No new routes; Content AI System name kept. Docs: PRODUCT-POSITIONING §4, AGENT_SOT, OFFER-ARCHITECTURE.
- **[UI] Design system 1.3 → 1.5 (Editorial Operator):** Fraunces + Source Sans 3 + JetBrains Mono; body 17px / prose 70ch; ink-tinted CTA shadows; full-bleed hero with brand mark + Pro cover visual; trust as muted text (IDs kept); surface-page/panel/accent; open non-interactive sections; Plan→Create→Check→Improve stepper; prompt path hint; creative-brief lead tightened; hero/prompt chrome authoritative in [`styles/components.css`](styles/components.css); [`STYLEGUIDE.md`](STYLEGUIDE.md) **1.5**; design-system smoke asserts font tokens + JSON↔CSS sync + no Inter/3px/emoji chrome.
- **[Docs] DS 1.5 alignment:** README, LEGACY, TESTAVIMAS, BRAND_SYNC, DOCUMENTATION, INDEX, AGENT_SOT, AGENTS, `.cursorrules` – Inter/trust-pills/card-stack references removed; STYLEGUIDE 1.5 + hero/cycle/path-hint kontraktai.
- **[UI] Hero badge:** EN `.badge-spinoff` **Free library** → **4 core workflows** (honest free surface; not full 10).
- **[UI] Frontpage copy trim (~50w):** Removed hero-echo `#objectives-title` lead and „How it differs“ value card from `#executive-summary`; value grid summary → 2 points. EN `#heroCtaSpine` → **Start with Prompt 1** (aligns with 30-day Prompt 1). Prompt 1 `#expected-details-1` closed by default (shorter path to Copy).
- **[UI/Curriculum] Spine-first journey (P0–P1):** Hero primary `#heroCtaSpine` → `#block1`; secondary `#heroCtaBrief`. Contiguous spine **1→2→3→5**, then `#creative-brief`, then teasers **4, 6–10**. EN prompt-desc 2/3/5 locale bleed fixed; claims aligned to free surface; spine categories Plan/Create/Check/Improve; FAQ title shortened; `#progressJumpPro` relative `#pdf-card-pro`. LEGACY / AGENTS v1.5 / AGENT_SOT / CREATIVE_BRIEF / OFFER funnel updated.
- **[Docs] Lessons + QA sync:** [AGENTS.md](AGENTS.md) §10 expanded (distance-to-Copy, no mid-spine teaser, EN build pairs, one primary path); pedagogy journey, INDEX, TESTAVIMAS, PRODUCT-POSITIONING, DOCUMENTATION, `.cursorrules` — spine-first. No new repo-local Cursor skills (lesson 6).
- **[UI] Phase B frontpage:** Meme slotai pašalinti iš gyvos UI; `#creative-brief` perkeltas po `#cmo-context` (prieš progress); hero dual CTA; promptai 1–3 atviri / 4–10 collapsible (superseded by Phase A / spine-first below).
- **[UI]/Curriculum] Phase A tool-first spine:** Free interactive prompts **1, 2, 3, 5** + creative brief; teasers **4, 6–10** → Pro; progress „of 4“ (superseded by spine-first: brief after spine, hero spine primary).
- **[Docs] Agents sync:** [AGENTS.md](AGENTS.md) v1.5 (§0.1 spine-first, §10 lessons), [docs/AGENT_SOT.md](docs/AGENT_SOT.md), [docs/INDEX.md](docs/INDEX.md), [.cursorrules](.cursorrules).

## [1.9.0] - 2026-05-31

### Prideta

- **[Orchestrator] CMO Infrastructure Phases 1–4:** Stripe go-live checklist ([`MUST_TODO_STRIPE.md`](MUST_TODO_STRIPE.md)), production `REQUIRE_STRIPE_LINKS=1` build gate ([`vercel.json`](vercel.json) `buildCommand`), Vercel security headers + CSP Report-Only. GEO emitters ([`scripts/geo-surfaces.js`](scripts/geo-surfaces.js)): per-AI-bot `robots.txt`, `sitemap.xml` (image + lastmod), `llms.txt` / `llms-full.txt`, IndexNow key, `404.html`, `manifest.webmanifest`, EN JSON-LD `@graph` (Product + FAQ). Ops docs: [`docs/AGENT_SOT.md`](docs/AGENT_SOT.md), [`docs/security.md`](docs/security.md), [`docs/language-guidelines-en-lt.md`](docs/language-guidelines-en-lt.md). IndexNow post-deploy ([`scripts/indexnow-ping.js`](scripts/indexnow-ping.js)). PDF preview lightbox on storefront. Template migration backlog ([`docs/TEMPLATE_MIGRATION_BACKLOG.md`](docs/TEMPLATE_MIGRATION_BACKLOG.md)).
- **[Commerce] SOT brand + frontFaq** laukai GEO schemai ([`config/sot.json`](config/sot.json)).

### Pakeista

- **[Commerce] Live checkout (Phase 1b):** `config/sot.json` — `allowPlaceholderCheckout: false`; live Stripe Payment Links Starter / Pro / Complete Kit ant `/en/` storefront.
- **[QA]** Structure tests + e2e: bundle Payment Link branch, GEO surface asserts (168+). `check:fulfillment` — privalomas `STRIPE_PRICE_CMO_BUNDLE_PDF`.

## [1.8.0] - 2026-05-31

### Pakeista

- **[Commerce] CMO AI Content System repozicija (v2):** Mokami produktai perpozicionuoti iš „CMO Prompt Kit" į **CMO AI Content System** su Use · Build · Install pakopų laiptais. Public pavadinimai: *Starter (Use)*, *Pro (Build)*, *Complete Kit (Install)*. SOT (`config/sot.json`) gauna `tierTag` / `tierPromise`, naują storefront antraštę („Offline system kits"), palyginimo eilutę „Build reusable workflow templates", ir reframe'intą Buyer FAQ. Vidiniai ID, Stripe metadata, blob keliai ir kainos (`$3.99 / $8.99 / $10.99`) nepakeisti. [`config/sot.json`](config/sot.json), [`config/brand-seo.json`](config/brand-seo.json), [`api/_lib/fulfillment.js`](api/_lib/fulfillment.js), [`terms.html`](terms.html), [`coming-soon.html`](coming-soon.html).
- **[Content] Pro PDF 27 → 30 p.:** Pridėtos 3 „Build" pakopos puslapiai – reusable prompt sistemų dizainas, workflow šablonų biblioteka, ir worked custom-tool pavyzdys ([`docs/pdf-source/cmo-pro.html`](docs/pdf-source/cmo-pro.html)). Export gate atnaujintas į 14 / 30 ([`scripts/export-pdfs.js`](scripts/export-pdfs.js)). Cover ir footer'iai – nauja pavadinimų sistema.
- **[UI] Storefront UX:** Produktų kortelės + palyginimo lentelė dabar matomos be `<details>` (anksčiau paslėptos); Use/Build/Install pakopų pill'ai (`.pdf-card-tier`); Buyer FAQ lieka `<details>`. [`scripts/build-locale-pages.js`](scripts/build-locale-pages.js), [`styles/components.css`](styles/components.css). EN LT leak ištaisytas („Pilnas paaiškinimas" → „Full explanation").

### Prideta

- **[Commerce] Bundle cover art:** [`docs/pdf-source/cmo-bundle.html`](docs/pdf-source/cmo-bundle.html) (stacked Use/Build/Install, dual-tone gradientas) → `cmo-bundle-cover.png`; [`scripts/export-pdf-covers.js`](scripts/export-pdf-covers.js) ir [`scripts/export-pdf-previews.js`](scripts/export-pdf-previews.js) išplėsti. SOT bundle naudoja `coverPng` (nebe `coverSvg`).
- **[Orchestrator] Pozicionavimo dokumentai:** [`docs/PRODUCT-POSITIONING.md`](docs/PRODUCT-POSITIONING.md) (Use · Build · Install laiptai, ką teigiame / ko ne, pavadinimų nuoroda) ir [`docs/OFFER-ARCHITECTURE.md`](docs/OFFER-ARCHITECTURE.md) (free vs paid matrica, funnel, copy cascade, regeneration komandos).

## [1.7.2] - 2026-05-31

### Pakeista

- **[UI] Brand sync su mother repo ([DITreneris/promptanatomy](https://github.com/DITreneris/promptanatomy)):** Derivative `favicon.svg` (ink `#0B1320` + gold žymė), PNG icon pack (`npm run icons:export`), `site.webmanifest`; SEO/OG copy per [`config/brand-seo.json`](config/brand-seo.json) – „Content AI for Marketing Leaders“ (ne MVP „CMO Kit / 10 prompts (45 min)“); [`scripts/generate-og.js`](scripts/generate-og.js) naudoja brand tokenus; [`STYLEGUIDE.md`](STYLEGUIDE.md) atnaujintas (gold/ink). Dokumentacija: [`docs/BRAND_SYNC.md`](docs/BRAND_SYNC.md).

### Prideta

- **[UI]** [`config/brand-seo.json`](config/brand-seo.json), [`scripts/load-brand-config.js`](scripts/load-brand-config.js), [`scripts/export-favicons.js`](scripts/export-favicons.js), `npm run icons:export`.

### Pakeista (anksčiau Unreleased)

- **[Orchestrator] Locale politika:** **EN (`/en/`) – kanoninė versija** (turinys, UX, Commerce, SEO `x-default`, release QA). **`/lt/` užšaldyta** – tik tester snapshot; build/CI lieka, bet LT turinio sinchronizacija nebereikalaujama. Atnaujinta: [`docs/MULTILINGUAL_STRUCTURE.md`](docs/MULTILINGUAL_STRUCTURE.md) §0, [`AGENTS.md`](AGENTS.md), [`.cursorrules`](.cursorrules), [`docs/INDEX.md`](docs/INDEX.md), [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md), [`docs/LEGACY_GOLDEN_STANDARD.md`](docs/LEGACY_GOLDEN_STANDARD.md) §0, [`README.md`](README.md), [`docs/TESTAVIMAS.md`](docs/TESTAVIMAS.md).

## [1.7.1] - 2026-05-31

### Pakeista

- **[UI] Frontpage UX compression (all phases):** Sujungtas `#preflight` + `#executive-summary` į vieną `#executive-summary.objectives--skim` (`.preflight-list` + `<details class="value-grid-details">`); `#framework-schema` perkeltas į `<details>` viduje `#instructions`; `#cmo-context` build inject **prieš** `#progressIndicator`; pašalinti `#next-steps`, hero mini-prompt demo, hero Telegram antrinis CTA; FAQ – 3 matomi + `<details class="faq-more-details">`; meme `meme-slot-6` pašalintas (liko 2); EN `#pdf-storefront` – teaser + `<details class="pdf-storefront-details">`; scenarios/safety inject anchor `<!-- CMO_TRUST_BLOCKS -->`. CSS: [`styles/components.css`](styles/components.css). E2E: [`tests/e2e/checkout.spec.js`](tests/e2e/checkout.spec.js) atidaro storefront details.

### Prideta

- **[UI] PDF cover pipeline (Starter + Pro):** `scripts/export-pdf-covers.js`, `npm run pdf:covers` — Playwright WYSIWYG PNG from PDF page 1; [`todo.md`](todo.md) tracks scope.

### Pakeista (anksčiau Unreleased)

- **[UI] Storefront covers:** Starter + Pro use `coverPng` from [`config/sot.json`](config/sot.json); no price on cover art; alt text without price ([`scripts/build-locale-pages.js`](scripts/build-locale-pages.js)).
- **[UI] Cover pages:** Redesigned page 1 in [`docs/pdf-source/cmo-starter.html`](docs/pdf-source/cmo-starter.html) and [`cmo-pro.html`](docs/pdf-source/cmo-pro.html).
- **[UI] Preview thumbs:** [`scripts/export-pdf-previews.js`](scripts/export-pdf-previews.js) exports interior pages 2–4 (not cover duplicate).

## [1.7.0] - 2026-05-31

### Prideta

- **[Content] CMO PDF v1.1:** Starter 14 p. (TOC, worked example); Pro 27 p. (TOC, worked example, week-1 quickstart) – [`docs/pdf-source/`](docs/pdf-source/).
- **[Curriculum] Prompt taxonomy registry** – [`data/cmo-prompt-registry.json`](data/cmo-prompt-registry.json) + [`tests/cmo-prompt-registry.test.js`](tests/cmo-prompt-registry.test.js).
- **[Commerce] Bundle SKU** ($10.99), Pro Markdown companion, storefront comparison table, preview thumbnails, outcome-led copy – [`config/sot.json`](config/sot.json), [`scripts/build-locale-pages.js`](scripts/build-locale-pages.js).
- **[Commerce] Starter follow-up emails** (Day 3 / Day 7, feature-flagged) – [`api/fulfillment-followup.js`](api/fulfillment-followup.js), Vercel Cron.
- **[QA] PDF a11y checklist** – [`docs/PDF_A11Y_CHECKLIST.md`](docs/PDF_A11Y_CHECKLIST.md).

### Pakeista

- **[Commerce] Fulfillment** palaiko bundle (du PDF linkai) ir optional `.md` – [`api/_lib/fulfillment.js`](api/_lib/fulfillment.js).
- **[Commerce] Export gate** 14 / 27 pages – [`scripts/export-pdfs.js`](scripts/export-pdfs.js).
- **Dokumentacija:** [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) §7.2 (3 SKU, page counts).

---

## [1.6.0] - 2026-05-17

### Prideta

- **Mokama CMO PDF tarpinė (EN-only, tik `promptanatomy.space`):** Du atsisiunčiami PDF produktai – *CMO Prompt Kit · Starter* ($3.99, 12 p.) ir *CMO Prompt Kit · Pro* ($8.99, 24 p.). Originalūs HTML šaltiniai – [`docs/pdf-source/cmo-starter.html`](docs/pdf-source/cmo-starter.html), [`docs/pdf-source/cmo-pro.html`](docs/pdf-source/cmo-pro.html). Komandos licencija + 14 d. grąžinimo politika.
- **Fulfillment stack (Vercel serverless):** [`api/_lib/fulfillment.js`](api/_lib/fulfillment.js), [`api/stripe-webhook.js`](api/stripe-webhook.js), [`api/download-link.js`](api/download-link.js), [`api/download.js`](api/download.js), [`api/fulfillment-health.js`](api/fulfillment-health.js). Stripe Payment Links → webhook → Upstash Redis state → Resend email su pasirašyta nuoroda → Vercel Blob privatus PDF saugojimas. Dvi TTL: 7 d. (el. paštas) / 15 min. (success page in-page link).
- **EN-only `#pdf-storefront` blokas** `en/index.html` (po `#faq`, prieš `#ecosystem-strip`): 2 produktai, $3.99 / $8.99, kortelės + Buyer FAQ + 14-day refund. LT (`lt/index.html`) lieka NEPALIESTA – jokio storefronto, jokių kainų, jokių Stripe nuorodų.
- **Storefront pagalbiniai puslapiai:** [`success.html`](success.html) (polling UX su `aria-live`, `noindex`), [`terms.html#paid-pdf-license`](terms.html) (komandos licencija + 14 d. refund), [`coming-soon.html`](coming-soon.html) (placeholder režimo CTA tikslas).
- **Konfigūracija `config/sot.json`:** Single source of truth – produktai, kainos, Stripe Payment Link slots, `allowPlaceholderCheckout`, `placeholderHref`, mirror policy (`renderPaidStorefront: false`), Buyer FAQ.
- **Build / export skriptai:** `scripts/export-pdfs.js` (Playwright Letter + page-count gate 12/24), `scripts/export-pdf-previews.js` (3-puslapių PNG preview su watermark), `scripts/upload-pdfs-to-blob.js` (Vercel Blob privatus įkėlimas), `scripts/check-fulfillment-env.js` (env probe + Stripe key drill + Redis ping + opcionaliai Resend send drill).
- **Cover thumbnails:** [`assets/pdf-covers/cmo-starter-cover.svg`](assets/pdf-covers/cmo-starter-cover.svg), [`assets/pdf-covers/cmo-pro-cover.svg`](assets/pdf-covers/cmo-pro-cover.svg).
- **GitHub Pages mirror politika:** `.github/workflows/deploy.yml` nustato `MIRROR_NOTE=1` build žingsniui – `#pdf-storefront` IŠVIS NERENDERIUOJAMAS GitHub Pages versijoje. Pirkėjai visada keliami į `https://promptanatomy.space`.
- **EN privacy update:** [`en/privacy.html#paid-pdf-data`](en/privacy.html) – Stripe / Resend / Upstash / Vercel Blob procesoriai išvardinti, ne marketingo sąrašas. `lt/privatumas.html` LIEKA NEPALIESTA.
- **Vercel headers:** `vercel.json` – `Cache-Control: no-store, max-age=0` `/api/*` ir `/success.html` (jokios CDN cache aukos pasirašytoms URL).
- **Testai:** `tests/structure.test.js` praplėstas (134 teiginiai – EN storefront $3.99/$8.99 ir placeholder href, LT žiūrintį „nieko paid“ kontroliuoja, success/terms/coming-soon esinis); `tests/fulfillment-config.test.js` (43 teiginiai – PRODUCTS map, FULFILLMENT_REQUIRED_ENV, getSiteUrl fallback, /api raw-body, SOT consistency); `tests/e2e/smoke.spec.js`, `tests/e2e/checkout.spec.js`, `playwright.config.js`. Naujos npm komandos: `pdf:export`, `pdf:previews`, `pdf:upload-blob`, `check:fulfillment`, `test:fulfillment-config`, `test:smoke`, `test:e2e`, `test:a11y`.
- **Dependencies:** `stripe`, `@upstash/redis`, `@vercel/blob`, `resend` (runtime); `@playwright/test`, `start-server-and-test` (dev).

### Pakeista

- **`scripts/build-locale-pages.js`:** Naujas EN-only `#pdf-storefront` injektorius, skaitantis SOT; `MIRROR_NOTE=1` praleidžia bloką (mirror build); `assertEnLocaleAdditions` reikalauja `#pdf-storefront`, `$3.99`, `$8.99`, `.pdf-card` (kai NE-mirror); `assertLtLocaleAdditions` reikalauja, kad `#pdf-storefront` NEBŪTŲ LT pusėje.
- **`scripts/vercel-export-public.js`:** Kopijuoja `success.html`, `terms.html`, `coming-soon.html`, `assets/pdf-covers/`. Pridėtas `assertNoPaidPdfsLeaked()` – atsisako publikuoti, jei `api/_private/`, `paid-pdfs/` arba bet koks `.pdf` patenka į `public/`.
- **`styles/components.css`:** `.pdf-storefront`, `.pdf-card`, `.pdf-card-cover`, `.pdf-card-bullets`, `.pdf-card-cta`, `.pdf-storefront-faq`. `no-print` paslepia naršyklės Print režime.
- **`package.json`:** Versija `1.6.0`. `lint:html` apima `success.html`, `terms.html`, `coming-soon.html`. `npm test` papildomai paleidžia `tests/fulfillment-config.test.js`.
- **`.gitignore`:** `api/_private/`, `assets/paid-pdfs/`, `docs/pdf-source/*.pdf`, `test-results/`, `playwright-report/`, `playwright/.cache/`. Aiškiai NE-ignoruoja `assets/pdf-covers/`.

### Saugumas

- **Privatūs PDF:** Niekada negulimi į `public/`, niekada `git`-uojami. `assertNoPaidPdfsLeaked()` `vercel-export-public.js` blokuoja netyčinius leakus.
- **Webhook signature:** `bodyParser: false` `api/stripe-webhook.js` – raw body Stripe parašui patikrinti.
- **Pasirašytos atsisiuntimo URL:** HMAC SHA256 + Redis `download-token:jti` metaduomenys; default 7 d. el. pašto link / 15 min. in-page polling link.
- **Atskira EN scope:** Visa komercija – tik `en/index.html`, tik `promptanatomy.space`. LT (`lt/index.html`) ir GitHub Pages mirror neturi nei storefront, nei API.

---

## [1.5.0] - 2026-05-15

### Prideta

- **Mobilus sticky CTA (`#stickyPromptBar`):** Fiksuota juosta ≤768px po pirmo prompto – kopijuoti aktyvų promptą, nuoroda „Kitas →“; `body.sticky-bar-visible` padding; `IntersectionObserver` seka aktyvų kortelę.
- **Greita navigacija (`#progressJump`):** Nuorodos 1–10, `#cmo-safety`, `#faq` po progreso indikatoriaus.
- **Instrukcijų FAQ nuorodos:** `.instructions-faq-hint` → `#faq-beginner`, `#faq-all-ten`, `#faq`.
- **CSS komponentai:** `.header-demo-details`, `.executive-summary-lead`, `.instructions-faq-hint`, `.progress-jump`, `.sticky-prompt-bar`, `.meme-slot--compact`, `scroll-margin-top` ant `.prompt`; mobilus padding trim `@media (max-width: 480px)`.

### Pakeista

- **[UI] UX scroll compression (fazės 1–4):** Sumažintas scroll iki `#block1` ir promptų ciklo metu.
  - **Fazė 1:** Hero – 2 trust pills („Be duomenų rinkimo“, „10 promptų · ~45 min“); mini-promptas `<details class="header-demo-details">` (uždarytas pagal nutylėjimą). Preflight – `.preflight-list` (3 punktai + nuorodos). Executive summary + objectives sujungti į vieną `#executive-summary` su `.value-grid` (3 `.value-card`). Meme #1 perkeltas po Prompt 1 (`.meme-slot--compact`).
  - **Fazė 2:** `#what-is-prompt`, `#prompt-anatomy`, `#definitions` – viename `<details id="prompt-basics">` (privalomi ID viduje išlaikyti). Build: `.prompt-expected` `<details>` (prompt 1 `open`), `#cmo-context` forma + taisyklės – `<details id="cmo-context-details">`. Meme slotai **6 → 3** (`meme-slot-1`, `meme-slot-2`, `meme-slot-6`); pašalinti `.breath-break` ir slotai 3–5.
  - **Fazė 3:** Build – `#cmo-scenarios` `<details class="cmo-scenarios-details">`; safety recenzento `pre` – `<details>` su santrauka; checklist lieka matomas.
  - **Fazė 4:** `docs/TESTAVIMAS.md` – rankinis UX v1.5.0 checklist; `npm test` (97 struktūriniai teiginiai) + lint + a11y smoke.
- **EN paritetas:** `EN_REPLACEMENTS` ir `applyStaticLocaleText()` – value grid, preflight, hero summary, progress jump, sticky bar, prompt-basics; pašalinti pasenusios objectives / breath moment šablonai.
- **Dokumentacija:** [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) – 3 meme slotai, `#prompt-basics`, collapsible CMO blokai; [tests/structure.test.js](tests/structure.test.js) – meme skaičius pagal `id="meme-slot-N"`.

### Pašalinta

- Antra hero trust pill (`#heroTrustPill3`) ir atskira `#objectives-title` sekcija (turinys – value grid).
- Meme slotai `meme-slot-3`, `meme-slot-4`, `meme-slot-5`; meme iš preflight.
- „Įkvėpk“ / „Reset“ breath-break pastraipos tarp promptų.

---

## [1.3.5] - 2026-05-15

### Pašalinta

- Meme slotų „galerijos“ UI: matomi užrašai „Meme #1–3“, apačios `.meme-caption` juosta po vaizdu, `aria-label="Meme N"`. Inline `.meme-slot` / `.meme-caption` taisyklės iš `index.html` (stilius tik per `styles/components.css`).

### Pakeista

- **[UI] Meme slotai → premium lesson komponentas (Variant C):** Visi 3 `#meme-slot-*` (preflight, `#prompt-anatomy`, `#faq`) perrašyti į mokymų kortelę: `.meme-lesson-header` su `.meme-lesson-title` + `.meme-lesson-lead` virš vaizdo; `aria-labelledby` vietoje `aria-label`. LT: „Klaida 1–3“ + lead; EN: „Error 1–3“ (build + `applyStaticLocaleText`). `alt` be žodžio „Meme“. Vaizdas: `object-fit: contain`, `height: auto` — be `aspect-ratio`, `cover` ir `max-height` crop. Atnaujinta: `index.html`, `styles/components.css`, `scripts/build-locale-pages.js`, `docs/LEGACY_GOLDEN_STANDARD.md`, `tests/structure.test.js`.

---

## [Nereleisuota]

### Pašalinta

- **Negyvi failai ir formos likučiai (2026-05-15):** Pašalinta visa neaktyvios kontaktų / atsiliepimų formos infrastruktūra ir senų planavimo dokumentų liekanos.
  - `google-apps-script.js` (3 KB) – Google Apps Script formai, kurios produktas nebenaudoja.
  - `INTEGRACIJA.md` (8 KB) – „vėlesniems etapams" instrukcijos formai; sprendimas: nereikės.
  - `feedback-schema.md` (2.9 KB) – duomenų schema tai pačiai formai.
  - `MUST_TODO.md` (9 KB), `MVP_ROADMAP.md` (13 KB) – self-deklaruoti „Historical / Deprecated"; istorija lieka Git'e.
  - `data/Untitled design (23).png` (~2 MB) – nenaudojamas joks kodas.
  - `index.html`: išvalyti komentarai apie buvusią kontaktų formą / Google Sheets (CSS antraštė + JS pastaba); modal stilius palikti kaip bendrąjį komponentą.
  - `.eslintrc.json`: pašalinti Google Apps Script globals (`SpreadsheetApp`, `ContentService`, `MailApp`, `Logger`) ir `google-apps-script.js` override; pridėtas `public/` į ignore.
  - `package.json`: nereikalinga `html-validator-cli` (`^7.0.0`) devDependency pašalinta (`lint:html` naudoja `html-validate`, ne šį paketą).

### Pakeista

- **Meme sluoksnis be matomų paaiškinimų (2026-05-15):** Meme kortelės supaprastintos iki paveikslo-only pattern break: pašalinti `.meme-lesson-header`, `.meme-lesson-title`, `.meme-lesson-lead` ir bet koks matomas „Klaida / Error“ tekstas virš paveikslo. Puslapyje dabar 6 statiniai meme slotai (`meme-slot-1`…`meme-slot-6`) tarp turinio blokų; prasmė lieka pačiame paveiksle ir `alt` tekste. Pridėti nauji assetai `meme-random-prompting-gambling.webp`, `meme-output-control.png`, `meme-team-ahead.png`; nenaudojami numeruoti assetai neversijuojami. Atnaujinti `index.html`, `styles/components.css`, `scripts/build-locale-pages.js`, `tests/structure.test.js`, `docs/LEGACY_GOLDEN_STANDARD.md`.
- **Meme paveikslų vardai (2026-05-15):** Pervadinti į semantinius pavadinimus: `data/Untitled design (35).png` → `data/meme-error-1-no-context.png`, `(36).png` → `meme-error-2-generic.png`, `(22).png` → `meme-error-3-blame-tool.png`. Atnaujinti `<img src>` [index.html](index.html) `meme-slot-1`, `meme-slot-2`, `meme-slot-3`. Locale build'as juos regeneruoja į `lt/`, `en/`, `public/`.
- Pasenusios ar dubliuojančios dokumentų bylos: root `KODO_BAZES_ANALIZE.md`, `LT_EN_UI_UX_REPORT.md`, `VARIANTU_PALYGINIMAS.md`; `docs/GILI_ANALIZE_LT_EN_TERMINOLOGIJA.md`, `docs/MICROCOPY_AUDIT_EN.md`, `docs/TURINIO_AUDITAS_DETALUS.md`, `docs/DESIGN_SYSTEM_BASELINE.md`; dublikatai `docs/archive/`. Nuorodos sutvarkytos į `docs/MULTILINGUAL_STRUCTURE.md`, `docs/LEGACY_GOLDEN_STANDARD.md`, `npm test`.

### Pakeista

- **Dokumentacijos konsolidacija pagal valymą (2026-05-15):** Po formos likučių pašalinimo (žr. „Pašalinta") dokumentacija perrašyta į vieną tiesos šaltinį.
  - [`.cursorrules`](.cursorrules) sutrumpintas ~50% (~16 KB → ~7 KB): pašalinti Google Apps Script, kontaktų formos, CAPTCHA, EmailJS, formos GDPR skyriai; palikti tik aktyvūs kokybės, a11y, agentų, commit reikalavimai.
  - [`docs/LEGACY_GOLDEN_STANDARD.md`](docs/LEGACY_GOLDEN_STANDARD.md) atnaujintas į **v1.7**: pridėtas naujas §0 „Šaltinio modelis" (`index.html` + `data/*.json` + build inject), CMO v2 kontraktas (`#cmo-context`, `.prompt-expected`, `#cmo-safety`, `#cmo-scenarios`, `window.__CMO_COMPILE`, `data-version`), pašalintos pasenusios `onclick`/`onkeydown` schemos (kodas naudoja `addEventListener`), suvienodintas `BASE_PATH` (default `''` primary, `/cmo` mirror).
  - [`docs/INDEX.md`](docs/INDEX.md) ir [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md): pipeline diagrama atspindi tris build žingsnius (`generate-og` → `build-locale-pages` → `vercel-export-public`); inventoriuje pridėti `data/*.json`, `scripts/{generate-og,vercel-export-public}.js`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `og.png`, `public/`. Pašalintos nuorodos į trinamus failus.
  - [`DEPLOYMENT.md`](DEPLOYMENT.md) perrašytas: §0 lentelė rodanti primary (Vercel, `promptanatomy.space`) + mirror (GitHub Pages, `ditreneris.github.io/cmo`); aiškus `BASE_PATH` paaiškinimas; Vercel troubleshooting.
  - [`README.md`](README.md): struktūros medis atspindi realią repo struktūrą (data/, scripts/, public/, .pa11yrc.json, .htmlvalidate.json, .eslintrc.json, .nojekyll); abu production URL; pašalintas „Kontaktų rinkimas (vėlesniems etapams)" skyrius.
  - [`AGENTS.md`](AGENTS.md) **v1.2**: Curriculum/QA įvestyse pašalinti istoriniai planai, pridėti `data/*.json` šaltiniai; §8 „Susiję dokumentai" be `MUST_TODO`, `MVP_ROADMAP`, `feedback-schema`.
  - [`docs/TESTAVIMAS.md`](docs/TESTAVIMAS.md): abu URL (primary + mirror); CMO v2 scenarijai pridėti į checklist'ą; pa11y nurodytas į `/lt/`, `/en/`.
  - [`docs/QA_STANDARTAS.md`](docs/QA_STANDARTAS.md): pa11y pavyzdys atnaujintas į `/lt/` ir `/en/` (sutampa su CI).

- **Frontpage „premium SaaS“ productizacija (2026-04-30):** LT/EN frontpage perstruktūruotas iš „dokumento su dėžėmis“ į „įrankio / sistemos“ patirtį: hero iš karto seka naujas **Setup** modulis (kontekstas + progresas + DI įrankių nuorodos), pridėta **How it works** sekcija su vizualiu ciklu ir prieinamais tab’ais (`.system-map`, `.how-tab`), „Executive summary“ ir „Ką gausi / What you get“ pakeisti į kompaktiškas **value grid** korteles (`.value-grid`), pridėtas **Proof / Įrodymas** blokas (`.output-proof`) su before/after + kokybės kriterijais. Preflight perrašytas į skim-first sąrašą su unikaliomis nuorodomis (`.preflight-list`). Meme #1 demotuotas: perkeltas po Prompt 1 ir apribotas aukštis (nebėra „antras hero“). Pagrindinis vizualinis sluoksnis suvienodintas į 1px border + subtilus elevation per `styles/components.css` (užgožia senus 3px inline rėmelius). Pakeitimai: `lt/index.html`, `en/index.html`, `styles/components.css`. `npm test` praeina.

- **SEO + GEO micro-optimizacijos (AI discoverability, 2026-04-30):** `scripts/build-locale-pages.js` `insertSeo()` atnaujintas su aukštesnio ketinimo LT/EN `<title>` ir suvienodintais aprašymais (`meta description`, `og:*`, `twitter:*`). `index.html` pridėta trumpa `#executive-summary` santrauka (kas tai yra / use-cases / compared-to + vidinės nuorodos į `#block1`, `#block5`, `#block9`, `#cmo-safety`, `#ecosystem-strip`) ir kompaktiškas sąvokų blokas `#definitions` (3 aiškios definicijos LLM citavimui). Išplėstas FAQ (+4 klausimai) ir `FAQPage` JSON‑LD atnaujintas, kad tiksliai sutaptų su matomu turiniu tiek LT, tiek EN locale.
- **OG preview paveikslas FB/LinkedIn (2026-04-30):** `og:image` ir `twitter:image` suvienodinti į self-hosted `og.png` (1200×630) per `scripts/build-locale-pages.js` `insertSeo()` ir root `index.html`. Pridėti stabilumą gerinantys tag’ai: `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image:alt`. `tests/structure.test.js` papildytas kontraktu, kad OG URL būtų `https://promptanatomy.space/og.png` (primary host).
- **Vercel deploy: statinis output į `public/` (2026-04-30):** `npm run build` papildytas `scripts/vercel-export-public.js`, kuris sukuria `public/` ir sukopijuoja deploy reikalingus failus (root `index.html`, `lt/`, `en/`, `styles/`, `js/`, `data/`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `og.png`, privatumas). `public/` pridėtas į `.gitignore`, kad nebūtų komituojamas build artefaktas. Pataiso Vercel klaidą „No Output Directory named `public`“.
- **EN stop-ship lokalizacijos pataisymai + microcopy polish (2026-04-30):** Pašalinti LT nutekėjimai EN puslapyje: hero demo mini-prompt (`#promptDemo`) ir meme `figcaption` tekstai dabar statiniai EN (ne vien runtime). `scripts/build-locale-pages.js` papildytas tiksliomis LT→EN poromis, taip pat pašalintos likusios LT eilutės EN generuojamame JS (pvz. „Kopijuoti…“ komentarai/aria-label dalys), kad `en/index.html` neturėtų LT tokenų. Papildomai sutvarkytos kelios aukšto poveikio EN frazės promptų kortelėse (gramatika + US-native formuluotės) ir suvienodinta CTA instrukcija be „templated“ tono; `index.html` EN `promptData` atnaujintas, kad runtime EN režimas atitiktų build output.
- **CMO CRO uplift – „system, not prompts“ + paid-first CTA (2026-04-30):** `en/index.html` hero perrašytas į „operacinę sistemą“ (prognozuojamas rezultatas), primary CTA nukreiptas į `promptanatomy.app`, demo CTA paliktas kaip antrinis („Try prompt 1“). Virš pirmo scroll pridėtos dvi autoriteto sekcijos: `#system-map` (Inputs/Controls/Outputs + vykdymo ciklas) ir `#output-proof` (Before/After + rezultatų kriterijų checklist) su nuosekliais paid→demo CTA. Instrukcijos perrašytos į „skim-first“ (3 bullet) + pilnas checklist po `<details>`, sumažinant kognityvinį krūvį. `styles/components.css` pridėti `system-map`, `output-proof`, `section-cta`, `instructions-details` komponentai. `lt/index.html` sutapatintas su EN struktūra ir CTA logika; bendruomenės blokas pakeistas į paid-first (Telegram – optional).
- **IA: hierarchinė nuorodų tvarka ir vienas „hub“ (2026-04-30):** Sumažintas pakartojančių išorinių nuorodų triukšmas: hero – vienas PA ženkliukas (`promptanatomy.app`), pašalinta antra hero nuoroda į metodiką; `quoteable-block` be dubliuojančių `<a>`; `.objectives-eco-hint` ir FAQ `.faq-eco-hint` veda į `#ecosystem-strip`; nauja sekcija `#ecosystem-strip` (metodika, Telegram, el. paštas, Leader); bendruomenės blokas – tik Telegram CTA; footer – viena `.footer-product-link` eilutė. Viena DI tiekėjų juosta `.cmo-provider-hub` po `progressIndicator`; `injectProviderRows` build’e no-op (nebe 10×). „Kas toliau?“ – nuorodos po `<details>` su `summary#next-steps-jump`. `applyStaticLocaleText` ir `EN_REPLACEMENTS` sinchronizuoti; spaudai `styles/components.css` print taisyklėse paslėpta `.ecosystem-strip` ir `.cmo-provider-hub`; struktūros testas: Gemini nuoroda ≥1. Atnaujinta `docs/LEGACY_GOLDEN_STANDARD.md`. Versija **1.3.4**.
- **Dokumentacija ir agentų modelis (2026-04-30):** Pridėtas [docs/INDEX.md](docs/INDEX.md) (navigacija pagal rolę, užduotį ir kodą). Atnaujinti [AGENTS.md](AGENTS.md) (Curriculum/QA įvestys, release scope, nuorodos į Legacy ir `npm test`), [.cursorrules](.cursorrules) (projekto apžvalga, testai, docs sąrašas, Skills pastaba), [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md), [README.md](README.md) (medis), PR šablonas – nuorodos į indeksą ir golden standard.
- **LT/EN kalbos kokybė, EN statinis paritetas, SEO x-default (2026-04-30):** LT šaltinyje pataisyta hero gramatika („susiformuos planas…“), `aria-label` kopijavimui (**darbinių atmintinė** vietoje klaidingo „mainų“), saugumo įžanga (DI sugeneruotas turinys), FAQ `JSON-LD` sutapdintas su matomu FAQ (en dash, ciklas). `scripts/build-locale-pages.js`: EN keitinių papildymas (hero trust pills, oficiali metodika, „Start here“, meme `alt` ir `figcaption` šablonai sutapdinti su `index.html`, FAQ `FAQPage` anglų JSON), `hreflang x-default` → `/en/`; LT saugumo bloko intro taisymas. `applyStaticLocaleText` suvienodintas su build (objectives, instrukcijos, bendruomenė, footer h3, meme `img alt`, „Official methodology“). Atnaujinti `docs/LEGACY_GOLDEN_STANDARD.md`, `docs/TESTAVIMAS.md`, `docs/BULLET_PROOF_PROMPTS.md`, `tests/structure.test.js` (x-default kontraktas). Versija **1.3.3**.
- **CRO fazė 3.2 – edukacinių blokų eiliškumas (2026-04-30):** `index.html` sekcijos `#what-is-prompt` ir `#prompt-anatomy` perkeltos **po** visų 10 promptų (prieš „Kas toliau?“), kad kelias iki `#block1` būtų trumpesnis; `#framework-schema` palikta po instrukcijų ir prieš progresą. Atnaujinta `docs/LEGACY_GOLDEN_STANDARD.md` schema ir checklist. Versija **1.3.2**.
- **Hero CRO / clarity (2026-04-30):** Primary CTA pervadintas į veiksmą („Pradėti nuo 1-o prompto“), hero antrinis CTA pakeistas į tekstinę nuorodą „Bendruomenė: Telegram“; žyma „Spin-off Nr. 2“ → „Nemokama biblioteka“; poantraukė, demo antraštė ir mini kopijavimo mygtukas aiškiau komunikuoja formatą ir registracijos nereikalavimą; `insertSeo` aprašymai LT/EN; EN `applyStaticLocaleText` sinchronizuotas su build (nebe „Get free“ / „Get started free“ skirtumas). CMO konteksto įžanga LT/EN: pažymima, kad forma neprivaloma. `docs/LEGACY_GOLDEN_STANDARD.md` hero eilutė atnaujinta. Versija **1.3.1**.
- **Premium dizaino sistema (Prompt Anatomy DNR, 2026-04-30):** `styles/tokens.css` ir `styles/design-tokens.json` suvienodinti su motininės svetainės palete (auksinis akcentas `#CFA73A`, ink `#0B1320`, ekosistemos teal `#2E9E7E`, šviesūs paviršiai `#F8FAFC` / `#F1F5F9`, rėmeliai `#E2E8F0`), pridėti šešėlių lygiai (`elevation1` / `elevation2`, CTA, modal), tipografijos ir hero kintamieji (`--hero-bg`, `--hero-ink`), legacy alias (`--accent-*`, `--bg`, …) perkelti į vieną `:root` šaltinį – dubliuojantis inline `:root` pašalintas iš `index.html`. Hero pertvarkytas į šviesų kortelės stilių su tamsiu tekstu; h1 skalė 40px (48px nuo 768px); CTA gradientas ir tamsus tekstas dėl kontrasto; `body` 16px. `styles/components.css`: `.prompt` ir CMO blokai naudoja `--shadow-elevation-*`, CMO rėmeliai 1px + kairinis 4px brand akcentas, progreso juosta suderinta. Versija **1.3.0**.

### Prideta

- **Vercel Web Analytics (2026-05-01):** Priklausomybė `@vercel/analytics`; `scripts/vercel-export-public.js` po failų kopijavimo į `public/` įterpia oficialų Web Analytics snippet'ą (`window.va` + `defer` skriptas į `/_vercel/insights/script.js`) į visus ten esančius `.html` failus. Repo šaltinio HTML nekeičiamas, kad kiti hostai (pvz. GitHub Pages) nesikreiptų į neegzistuojantį `/_vercel/` kelią. Analytics duomenims rodyti projekte Vercel reikia įjungti Web Analytics dashboard'e ir redeploy'inti.

- **CMO sister adoption v2 – trust + LT parity + scale (2026-04-30):** Po v1 papildyta pagal planą `cmo_sister_adoption_v2_phased`. **v2.0 (EN):** `data/en-scenarios.json` – 3 scenarijai (savaitės apžvalga, kampanijos startas, stakeholderių atnaujinimas); build įterpia **Clarity practice** juostą su skirtukais (`role="tab"`, rodyklės), kopijuojama santrauka per `window.__CMO_COMPILE`; **Pre-publish safety** blokas su kopijuojamu rizikų recenzento promptu ir 4 greitos kontrolės punktais. **v2.1 (LT):** `data/lt-prompt-expected.json` ir `data/lt-scenarios.json`; LT puslapyje tas pats konteksto blokas, „Tikėtinas atsakymas“, saugumo ir scenarijų sekcijos lietuviškai, compile naudoja `KONTEKSTAS` / `TAISYKLĖS (privalomos)`. **v2.2 (abu locale):** `@media print` „one-page kit“ `styles/components.css`; footer versijos žyma iš `package.json` (`Prompt Anatomy CMO Kit v…` / `… CMO rinkinys v…`); kryžminė nuoroda į [Prompt Anatomy Leader](https://ditreneris.github.io/leader/en/); po kiekviena „Kopijuoti promptą“ eilutė nuorodų į ChatGPT / Claude / Gemini (naujas skirtukas, be duomenų perdavimo). Versija SemVer pakelta į **1.2.0**. Struktūros testai atnaujinti (EN+LT teigiami parity teiginiai).
- **EN sister-site adoption v1 (2026-04-30):** EN puslapis (`en/index.html`) papildytas Prompt Anatomy operacinio modelio pagrindais pagal sesterinį `https://ditreneris.github.io/leader/en/`: (1) Marketing Context blokas su 5 laukais (Audience, Offer/USP, Channels, Goal, Main constraint) ir session-only persistencija per `sessionStorage`, (2) ne-derybinės taisyklės (no generic advice, no invented numbers, decision-grade output), kurios kartu su konteksto reikšmėmis automatiškai prepend'inamos kiekvieną kartą paspaudus „Copy prompt“ per `window.__CMO_COMPILE` hook'ą, (3) matomas „Expected output“ sąrašas po kiekviena prompt kortele iš `data/en-prompt-expected.json`. Įgyvendinta tik EN locale per `scripts/build-locale-pages.js` (LT byte-identical, hero demo nepakeistas). CSS `.cmo-context` ir `.prompt-expected` pridėti į `styles/components.css` su esamais design tokenais. Struktūros testai išplėsti (77 assertions praeina).
- **P0–P3 stabilizacijos testų aprėptis (2026-04-29):** Išplėsti testai `tests/structure.test.js`, `tests/design-system-smoke.test.js`, `tests/a11y-smoke.test.js` su locale/privacy parity, canonical/hreflang SEO kontraktais ir `robots.txt` + `sitemap.xml` nuoseklumo patikra pagal production host/path.
- **Build apsaugos EN ir privacy SEO (2026-04-29):** `scripts/build-locale-pages.js` pridėta EN replacement safety patikra (kritinių šablonų aptikimas) ir privacy puslapių SEO validacija (`lt/privatumas.html`, `en/privacy.html`) build metu.
- **SEO/GEO bazė CMO srauto nukreipimui (2026-04-29):** Pridėti `robots.txt` ir `sitemap.xml` su pagrindiniais URL (`/`, `/lt/`, `/en/`, privatumo puslapiai), kad crawler'iai aiškiai rastų indeksuojamus kelius.
- **Struktūriniai AI signalai (2026-04-29):** `index.html` pridėtas JSON-LD rinkinys `WebSite`, `Organization` ir `FAQPage` bei FAQ pertvarka į `details/summary` Q/A formatą lengvesniam LLM extract'inimui ir citavimui.
- **Quoteable blokai + source signalas (2026-04-29):** Pagrindiniame turinyje pridėti cituojami „definition / when-to-use“ blokai su aiškiu nukreipimu į oficialų šaltinį `promptanatomy.app`.

- **Vizualinės sistemos sluoksniai (2026-04-29):** Įdiegti `styles/design-tokens.json` (vienas tokenų šaltinis) ir CSS sluoksniai `styles/tokens.css`, `styles/components.css`, `styles/utilities.css`. Root `index.html` importuoja šiuos failus; locale build automatiškai perrašo į `../styles/...`.
- **Design system kokybės vartai (2026-04-29):** Pridėti smoke testai `tests/design-system-smoke.test.js` ir `tests/a11y-smoke.test.js`; `npm test` papildytas naujais testų etapais.
- **Baseline auditas (2026-04-29):** Pridėtas `docs/DESIGN_SYSTEM_BASELINE.md` su pradinės būsenos išvadomis, priimtais architektūriniais sprendimais ir priėmimo checkpointais.
- **EN promptų tekstas – vienas šaltinis (2026-03-30):** `data/en-prompt-bodies.json` (10 anglų META eilučių). `npm run build` generuoja `js/en-prompt-bodies-inline.js` (`window.__EN_PROMPT_PRE`) ir iš root `index.html` `<pre id="prompt1">`…`prompt10` ištraukia LT tekstą META pakeitimams – nebereikia dubliuoti LT+EN porų `scripts/build-locale-pages.js`. `index.html` įtraukia `js/en-prompt-bodies-inline.js`; lt/en puslapiuose kelias `../js/…`. Struktūros testai: JSON, inline JS, script src. ESLint ignoruoja generuojamą inline failą.
- **Dokumentacija (2026-03-09):** docs/LEGACY_GOLDEN_STANDARD.md atnaujintas į v1.6 – build/deploy (BASE_PATH, scripts/build-locale-pages.js), footer (.footer-email, .footer-product-link), privatumas.html (back-link ID, referrer logika), checklist ir skyrius „privatumas.html (fiksuota)“.

### Pakeista

- **Kalbos perjungiklis GitHub Pages subkelyje (2026-04-29):** `index.html` – `getBasePathPrefix()` ir EN/LT navigacija naudoja repo prefiksą (pvz. `/cmo/en/`), ne absoliutų `/en/`, kuris rodė 404 ant `*.github.io/<repo>/`.
- **GitHub Pages repo ir kelias – `cmo` (2026-04-29):** Production target: [DITreneris/cmo](https://github.com/DITreneris/cmo), `SITE_ORIGIN`/`BASE_PATH` = `https://ditreneris.github.io` + `/cmo`; deploy workflow (`.github/workflows/deploy.yml`), canonical/hreflang visuose puslapiuose, `robots.txt`, `sitemap.xml`, `DEPLOYMENT.md` (įskaitant šalto deploy į tuščią repo žingsnius).
- **Dokumentacijos konsolidacija pagal realų pipeline (2026-04-29):** Atnaujinti `AGENTS.md`, `README.md`, `docs/QA_STANDARTAS.md`, `docs/MULTILINGUAL_STRUCTURE.md`, `docs/TESTAVIMAS.md`, `DEPLOYMENT.md` pagal faktinį `npm test` ir locale architektūrą; `MUST_TODO.md`, `MVP_ROADMAP.md`, `docs/MICROCOPY_AUDIT_EN.md` pažymėti kaip historical/deprecated.
- **Privacy LT/EN UX parity (2026-04-29):** LT privatumo puslapiuose (`lt/privatumas.html`, root `privatumas.html`) pridėtas kalbos perjungiklis į EN, kad navigacija tarp locale būtų nuosekli.
- **Puslapių SEO antraštės ir locale build (2026-04-29):** `index.html` ir `scripts/build-locale-pages.js` atnaujinti su canonical/hreflang/robots/meta description/OG/Twitter signalais; locale generatorius dabar automatiškai įterpia absoliučius URL (`https://promptanatomy.cloud/...`) ir pašalina dubliuojamus SEO tag'us prieš perrašymą.
- **CMO intent routing į oficialų brand hub (2026-04-29):** Sustiprintas vidinių nuorodų kontraktas į `https://promptanatomy.app/` per turinio, FAQ ir footer zonas, kad šis repo liktų „implementation/use-case“ sluoksniu, o metodikos autoritetas būtų koncentruotas `.app`.
- **Kalbos perjungimo URL modelis (2026-04-29):** Root kalbos perjungimas suvienodintas į path-based nukreipimą (`/lt/`, `/en/`) vietoje query fallback (`?lang=`), mažinant URL dubliavimo riziką indeksacijai.
- **Privatumo puslapių SEO nuoseklumas (2026-04-29):** `en/privacy.html`, `lt/privatumas.html` ir root `privatumas.html` papildyti canonical/hreflang/robots/description; pašalintas runtime hreflang `#` pildymas, palikti statiniai URL.

- **UI micro polish (2026-04-29):** Įgyvendinti greiti vizualinio nuoseklumo pataisymai be struktūros keitimo: pagerintas hero antrinio CTA kontrastas (`opacity 0.85`), suvienodintos pagrindinių CTA transition taisyklės (atsisakyta `transition: all`), sumažintas hero noise intensyvumas (`0.04`), suvienodinti smulkūs spacing/typography taškai (`badge` padding ir letter-spacing), pašalintas perteklinis `margin-top` iš `.community-cta-secondary`, ir `meme-slot` hardcoded spalvos pakeistos į design token kintamuosius.
- **Design token nuoseklumas (2026-04-29):** `styles/components.css` papildytas `.prompt` radius su `var(--radius-xl)`, kad komponentų sluoksnyje būtų aiškus 20px kampų šaltinis.
- **Pilno plano įgyvendinimas (2026-04-29):** Užbaigti visi vizualinės sistemos refaktoriaus plano etapai (tokenai, komponentų sluoksnis, interakcijų centralizacija, locale build validacija, smoke testai, dokumentacijos perdavimas) viename cikle su pilnu `npm test` praeinamu rezultatu.
- **Interakcijų architektūra (2026-04-29):** Pašalinti inline `onclick`/`onkeydown` handleriai promptų kortelėse; kopijavimo ir teksto pažymėjimo logika sujungta į centralizuotą `addEventListener` bindinimą `DOMContentLoaded` inicializacijoje.
- **Locale build validacija (2026-04-29):** `scripts/build-locale-pages.js` papildytas dizaino sistemos struktūrine validacija (`assertLocaleStructure`) ir `styles/` kelių adaptacija generuojamiems `lt/en` puslapiams.
- **Dokumentacija (2026-04-29):** Atnaujinti `STYLEGUIDE.md` (v2 architektūra, state matrica, kokybės vartai) ir `docs/DOCUMENTATION.md` (nauji dizaino sistemos failai bei testų atsakomybės).
- **US lokalizacija EN turiniui (content-only, 2026-04-29):** Sustiprintas EN (`en-US`) tonas ir terminija pagal US rinkos praktiką, su ryškesniu local flavor conversion vietose ir neutraliu tonu trust zonose. Atnaujinta hero/CTA/instrukcijų/community/error copy bei nuoseklumas (`Get started free`, `What you get`, aiškūs copy fallback veiksmai). Pakeitimai suderinti per generatorių: `scripts/build-locale-pages.js` EN replacement map, po build atnaujinti `en/index.html` ir `js/en-prompt-bodies-inline.js`.
- **EN promptų šaltinis – US rinkos framing (2026-04-29):** `data/en-prompt-bodies.json` perrašytas į natūralesnį US B2B kalbėjimą (KPI/CTA/pipeline žodynas), pridėti kontekstiniai miestų pavyzdžiai (Austin, Miami, Chicago) ir `$` biudžeto/impact signalai ten, kur tinka.
- **EN microcopy dokumentacija (2026-04-29):** `docs/MICROCOPY_AUDIT_EN.md` papildytas US lokalizacijos playbook: zone model (conversion/trust/utility), 10 taisyklių mini-guide, before/after pavyzdžiai ir šio etapo failų suvestinė.

- **Bendruomenė: WhatsApp → Telegram (2026-03-30):** Pagrindinis CTA vietoj `chat.whatsapp.com` nukreipia į [Telegram @prompt_anatomy](https://t.me/prompt_anatomy). Pakeista `index.html` (bendruomenės sekcija, hero antrinis CTA `aria-label`, `applyStaticLocaleText()` EN eilutės), `scripts/build-locale-pages.js` (EN statinės poros), sugeneruoti `lt/index.html` ir `en/index.html` per `npm run build`. `tests/structure.test.js` – EN `aria-label` regresijos teiginys. Dokumentacija: STYLEGUIDE.md, docs/TURINIO_AUDITAS_DETALUS.md.
- **EN UI – likę lietuviški promptai ir a11y (2026-03-30):** Root arba `?lang=en` / `localStorage` EN režime `applyStaticLocaleText()` dabar perrašo ir kopijuojamą `<pre>` turinį (anksčiau likdavo LT, kai `/en/` build’e jau buvo EN). Build: prieš globalų `Promptų anatomija` → `Prompt Anatomy` perkeltas bendruomenės CTA `aria-label`, kad EN nebeliktų hibridinės etiketės; pridėta trūkstama prompto 9 info pastraipa LT→EN.
- **LT→EN UI/UX – statinis tekstas ir promptai (2026-03-09):** Build skripte (EN_REPLACEMENTS): instrukcijų 2 eilutė – sutapdintos kabutės („ “ U+201E/U+201C), kad „Click Copy prompt“ atsirastų EN; laiko etiketė „~3–5 min per žingsnį“ → „~3–5 min per step“; CSS .code-block::before `content` „Spausk čia ir nukopijuok“ → „Click here and copy“. Visi 10 promptų `<pre>` turinių (META, INPUT, OUTPUT) lokalizuoti į EN per build. docs/LEGACY_GOLDEN_STANDARD.md ir LT_EN_UI_UX_REPORT.md atnaujinti.
- **EN hero – CMO mikro-kopija (2026-03-09):** EN title ir h1 „for Marketing Leads“ → „for Marketing Leaders“ (atitikmuo LT „rinkodaros vadovams“, aiškesnė CMO/vadovų auditorija). Pakeitimas: scripts/build-locale-pages.js (title, h1), index.html (applyStaticLocaleText h1). Kitos „Leads“ vietos (Lead generator, „Leads and metrics“) nekeistos.

---

## [1.1.0] - 2026-03-09

### Prideta

- **Privatumas.html „atgal“ nuorodos (2026-03-09):** Jei vartotojas atėjo iš `/lt/` ar `/en/`, mygtukai „Grįžti“ nukreipia atgal į atitinkamą locale (pagal `document.referrer`), kad neprarastų kalbos.
- **Footer el. paštas (2026-03-09):** Pridėtas el. paštas footer'yje – info@promptanatomy.app (mailto nuoroda); LT etiketė „El. paštas:“, EN „Email:“; CSS .footer-email; build skripte ir applyStaticLocaleText() EN lokalizacija.
- **LT/EN lokalizacija (2026-03):** Path-based puslapiai `/lt/` ir `/en/` – build skriptas `scripts/build-locale-pages.js` generuoja `lt/index.html` ir `en/index.html` iš root `index.html`; canonical ir hreflang SEO; runtime locale sprendimas (path → query → localStorage → navigator), `uiText(lt, en)`, `applyStaticLocaleText()`; kalbos perjungiklis (LT/EN mygtukai header'yje) su navigacija ir hash išsaugojimu; dinaminiai stringai (toast, progress, klaidos) per `uiText`. Žr. [LT_EN_UI_UX_REPORT.md](LT_EN_UI_UX_REPORT.md). Testai: structure.test.js tikrina lt/en failus ir lang; deploy workflow paleidžia `npm run build` prieš upload.
- **Pedagoginė specifikacija (2026-02-19):** docs/PEDAGOGINES_SPECIFIKACIJA.md – pedagoginiai tikslai, auditorija, terminologija ir paaiškinimai, „paprasta kalba“ kriterijai, vartotojo kelionė. docs/DOCUMENTATION.md – į inventorių įtraukti PEDAGOGINES_SPECIFIKACIJA.md ir TURINIO_AUDITAS_DETALUS.md.
- **Spin-off Nr. 2:** Rinkodaros vadovo AI operacinė sistema – 10 promptų (30 dienų turinys, Repurpose, LinkedIn, 30s video, Performance→Sprendimas, Objection Handling, Lead Magnet+DM, Case Study, Topical Cluster, MASTER PROMPT).
- **Oranžinė CTA paletė:** Pagrindinė spalvų paletė pakeista į oranžinę (`--accent-primary`, `--cta-bg`, hero gradientas) dėl aukštesnio CTA; STYLEGUIDE.md atnaujintas.
- QA ir dokumentų valdymo procesas: CHANGELOG.md, docs/DOCUMENTATION.md, integracija su AGENTS.md ir .cursorrules.
- Deploy: GitHub Pages workflow (.github/workflows/deploy.yml), DEPLOYMENT.md.
- QA standartas: docs/QA_STANDARTAS.md su nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01).
- Gyvo testavimo dokumentacija: docs/TESTAVIMAS.md (scenarijai ir žurnalas).
- Ryšys su pagrindiniu produktu: badge „Promptų anatomija“, community CTA ir footer nuorodos → https://www.promptanatomy.app/ (anksčiau ditreneris.github.io/anatomija).
- Favicon: favicon.svg (SVG, „P“ ant teal fono), nuorodos index.html ir privatumas.html.
- `.nojekyll` root’e – GitHub Pages naudoja statinius failus be Jekyll.

### Pakeista

- **Promptų anatomija nuoroda ir terminologija (2026-03-09):** Pagrindinė nuoroda „Promptų anatomija“ (hero badge, community antrinis CTA, footer) pakeista į https://www.promptanatomy.app/. Terminologija: LT – DI (dirbtinis intelektas), EN – AI; pataisyta badge aria-label LT „AI“→„DI“, EN title/h1 „Content DI System“→„Content AI System“; rašyba „Linkedin“→„LinkedIn“ LT. Build skripte footer-product-link pakeitimas perkeltas prieš bendrą „Promptų anatomija“→„Prompt Anatomy“, kad EN footer būtų pilnai anglų kalba. README nuorodos atnaujintos į promptanatomy.app. Žr. docs/GILI_ANALIZE_LT_EN_TERMINOLOGIJA.md.
- **Poliravimas – UI/UX ir a11y (2026-02-19):** Spacing: suvienodinta sekcijų margin-bottom (prompt 32px), prompt-header/footer padding 32px. Focus: paliktas tik `:focus-visible` form-input, .btn, .code-block; outline-offset hero CTA ir outline mygtukų 2px. Transitions: .next-steps-links a, .cta-secondary – pridėtas transition hover būsenoms. ARIA: progreso juosta – aria-label „Progresas: X iš 10 promptų“ (atnaujinama JS), info-box – „Informacija: promptas N“ (N 1–10). Mažų ekranų (375px) .footer padding 24px 16px. STYLEGUIDE.md sinchronizuotas su implementacija: hero vertikalus gradientas, spalvos #c75515/#b54f14, hover translateY(-1px), numerio badge color var(--white), community CTA hover; pridėta border-radius skalė (4.8).
- **Lead generator (2026-02-19):** „Nemokamo vediklio“ / „vediklis“ pakeista į „Lead generator“ – vediklis šioje aplikacijoje netinka. index.html (antraštė, aprašymas, prompt7, next-steps, footer, aria-label), README, docs/PEDAGOGINES_SPECIFIKACIJA.md.
- **Promptų ir turinio draugiškumas (2026-02-19):** TURINIO_AUDITAS ir pedagoginė spec. įgyvendinti: objectives (lead'us→potencialius klientus), žodynėlis (hook, CTR, reach, B2B), promptų antraštės/aprašymai (30s Short-Form→30 sek. video, MASTER PROMPT→Pagrindinis promptas), promptų tekste (Carousel/Landing hero→lietuviškai, lead generation/CMO/spamo→lietuviški atitikmenys, B2B paaiškintas), CTA tekstai varijuoti, next-steps ir footer (MASTER PROMPT, Lead magnet→Nemokamo vediklio, CTA fokusas→Veiksmų fokusas). Aria-label: „lead magnet versija“→„nemokamo vediklio versija“. README ir privatumas.html – žargonas pakeistas į lietuviškus atitikmenis, DI paaiškintas, localStorage (naršyklės vietinė atmintinė), „panašiai“→„panašią formą“.

- **Turinio ir kalbos auditas (2026-02-18):** Žargono mažinimas – DI paaiškintas, glosarė (USP, CTA, KPI), „fluff“→„tuščios frazės“, „proof“→„įrodymai“, „objection“→„prieštaravimai“, „repurpose“→„vienos idėjos daug formatų“, „lead magnet“→„nemokamas vediklis“, „insight“→„idėja“, „case study“→„kliento istorija“, „pillar/supporting“→„pagrindinė tema ir subtemos“. Kategorijos MUST/SHOULD/WANT/MASTER pakeistos į Pradžia/Įgūdžiai/Plėtra/Viskas kartu.
- **Turinio pataisymai (2026-02-18):** Short-form→Trumpas formatas, scroll'inimą→slinkimą, repurpose (prompt10)→vienos idėjos daug formatų, case'ai→klientų istorijos; encoding ir gramatikos pataisymai; žargonas: objection'ų→prieštaravimų, Lead'ai→Potencialūs klientai, follower'io→sekėjo, lead'ą→potencialų klientą.
- **Privatumas:** privatumas.html pavadinimas suderintas su index.html (DI Promptų biblioteka).
- **Spalvų paletė:** pridėti kintamieji --tertiary-dark, --tertiary-hover, --green-dark, --error, --bg-subtle; hardcoded spalvos pakeistos į kintamuosius; numerio badge – baltas tekstas (WCAG AA); STYLEGUIDE.md atnaujintas.
- **Dokumentacija:** docs/DOCUMENTATION.md papildytas „Greita schema – kas kur ir kam“.
- **Struktūra 8 → 10 promptų:** index.html – pridėti block9/prompt9 (Topical Cluster), block10/prompt10 (MASTER PROMPT); progress bar ir JS ciklas atnaujinti į 10; next-steps ir footer. tests/structure.test.js ir docs/LEGACY_GOLDEN_STANDARD.md atnaujinti į 10 promptų.
- **Turinys:** Hero, objectives, instructions ir visi 10 promptų pakeisti į Spin-off Nr. 2 turinį (rinkodaros sistema); placeholder'iai [auditorija], [skausmas], [USP], [kanalas] ir kt.
- Community sekcija: hierarchija ir UX – vienas pagrindinis CTA (brand green #0E7A33, be glow, subtilus shadow), antrinis outline („Promptų anatomija“). Trumpesnė antraštė dviem eilutėm, vertikalūs tarpai (16px / 24px / 16px), kortelė 1px border ir 16px radius. Emoji pašalintas iš CTA. STYLEGUIDE 4.7 atnaujintas.

### Taisyta

- **CI a11y vartai (2026-04-29):** `.github/workflows/ci.yml` `pa11y` žingsnis nebe `continue-on-error`; WCAG regresijos dabar stabdo CI.
- **Deploy ir SEO (2026-03-09):** GitHub Pages deploy workflow – build žingsnyje nustatytas `BASE_PATH=/marketingas`, kad sugeneruoti `lt/` ir `en/` puslapiai turėtų teisingus canonical ir hreflang URL (`/marketingas/lt/`, `/marketingas/en/`).
- **CI ir pa11y (2026-02-19):** GitHub Actions – Chromium „No usable sandbox“: į CI workflow įdėtas `continue-on-error: true` pa11y žingsniui (workflow lieka žalias); .pa11yrc.json ir package.json „pa11y“ – Chrome paleidimo argumentai (`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`). DEPLOYMENT.md – troubleshooting atnaujintas: a11y pilnai tikrinamas lokaliai.
- Badge „Promptų anatomija“: paspaudimo zona (min-height/min-width 44px), z-index ir cursor, kad nuoroda būtų aiškiai paspaudžiama.
- A11y WCAG2AA: community skyriaus nuorodos „Promptų anatomija“ kontrastas (teksto spalva #040404).
- Hreflang skriptas (lt/en index + privatumas/privacy): null patikros prieš `getElementById(...).href`, kad nebūtų klaidos, jei elemento nėra.
- Hreflang `<link>`: pradinis `href=""` pakeistas į `href="#"` – HTML validatoriumi leidžiama, skriptas vėliau nustato tikrus URL.
- package.json: „serve“ įtrauka sutvarkyta; lint:js naudoja `npx eslint` (veikia be globalaus eslint).

### Pašalinta

- Root `privatumas.html`: nenaudojamas (kanoniniai puslapiai – `lt/privatumas.html`, `en/privacy.html`). docs/DOCUMENTATION.md inventoriuje atnaujinta nuoroda į lt/privatumas.html ir en/privacy.html.

### Deprecated

- (tuščia)

### Saugumas

- (tuščia)

---

## [1.0.0] - 2026-02-18

### Prideta

- Pradinė DI Promptų Biblioteka: 8 promptai, interaktyvus dizainas, kopijavimo funkcija.
- Dokumentacija: README.md, INTEGRACIJA.md, AGENTS.md, .cursorrules, feedback-schema.md.
- CI: lint, testai, a11y (pa11y) per .github/workflows/ci.yml.
- PR šablonas ir agentų commit prefiksai.

### Pakeista

- (pirmas release – nėra ankstesnių pakeitimų)

### Taisyta

- (nėra)
