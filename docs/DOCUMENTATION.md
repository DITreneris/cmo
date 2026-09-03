# Dokumentų valdymas

**Tikslas:** Dokumentų atnaujinimo, versijavimo ir archyvavimo tvarka. Taisyklės: [.cursorrules](../.cursorrules), [AGENTS.md](../AGENTS.md).

**Įėjimo taškas (indeksas):** [docs/INDEX.md](INDEX.md) – navigacija pagal rolę ir užduotį.

---

## 0. Greita schema – kas kur ir kam

| Sritis | Dokumentas | Kam skirta |
|--------|------------|------------|
| **Indeksas** | [docs/INDEX.md](INDEX.md) | Visi agentai ir žmonės: kur skaityti pirmiausia |
| **Verslas ir procesai** | [AGENTS.md](../AGENTS.md) | Agentų rolės, workflow (Content, Curriculum, UI/UX, QA, Orchestrator) |
| **Kodas ir turinys** | [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) | Ką galima keisti keičiant turinį; HTML/JS struktūra; CMO v2 kontraktas |
| **LT/EN** | [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) | **EN kanonas**; `/lt/` užšaldyta testeriams; build routing |
| **Dizainas** | [STYLEGUIDE.md](../STYLEGUIDE.md) | DS **1.6** Product Operator: tipografija, paviršiai, hero diagram, anti-patternai |
| **Brand sync** | [docs/BRAND_SYNC.md](BRAND_SYNC.md) | Mother spalvos/favicon/OG; tipografija – spin-off DS 1.6 |
| **Kokybė** | [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) | QA kriterijai, komandos (`npm test`, pa11y) |
| **Testavimas** | [docs/TESTAVIMAS.md](TESTAVIMAS.md) | Gyvo testavimo scenarijai ir žurnalas |
| **Taisyklės** | [.cursorrules](../.cursorrules) | Kokybė, a11y, commit formatas |
| **Ops SOT** | [docs/AGENT_SOT.md](AGENT_SOT.md) | Build, deploy, GEO (hash hubs + frontFaq), commerce, free-surface model |
| **Roadmap** | [roadmap.md](../roadmap.md) | Ambition A→E→light B→C (R1–R4); Audit P0–P3 mapping; parked F/D/G |
| **Active tracker** | [todo.md](../todo.md) | R1 Stripe ops + R1-support leftovers; Audit ≠ R1 exit |
| **Agent lessons** | [AGENTS.md](../AGENTS.md) §10 | Operacinės pamokos (spine-first, JTBD/GEO §10.11–13, §10.14 cash before platform, §10.16–20 R1-support closeout, FAQ triple sync) |
| **Stripe go-live (R1 detail)** | [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md) | Ambition A ops SSOT (Blob, env, webhook, live drills) |
| **Go-live runbook** | [docs/GO_LIVE_RUNBOOK.md](GO_LIVE_RUNBOOK.md) | Linear operator commands (`check:prod`, Blob dry-run, TEST_SEND) |
| **Versijos** | [CHANGELOG.md](../CHANGELOG.md) | Pakeitimų istorija (Keep a Changelog, SemVer) |

---

## 1. Dokumentų inventorius ir atsakomybės

### Dokumentai (Markdown)

| Dokumentas | Paskirtis | Atsakingas agentas | Kada atnaujinti |
|------------|-----------|--------------------|-----------------|
| [docs/INDEX.md](INDEX.md) | Dokumentacijos navigacija (rolės, užduotys, kodas ↔ docs) | Orchestrator / QA | Nauji docs failai, pasikeitus pipeline ar agentų modeliui |
| [README.md](../README.md) | Apžvalga, naudojimas, struktūra | Content / Orchestrator | Naujos funkcijos, deployment, struktūros pakeitimai |
| [AGENTS.md](../AGENTS.md) | Agentų rolės, workflow, commit prefiksai, §0.2 roadmap | Orchestrator | Workflow / rolės / roadmap pakeitimai |
| [roadmap.md](../roadmap.md) | Produkto roadmap R1–R4 (A→E→light B→C) | Orchestrator | Ambition sequence / exit criteria |
| [todo.md](../todo.md) | Aktyvus R1 tracker (nuorodos į MUST_TODO) | Orchestrator / Commerce | Po R1 žingsnių; kai unlock R2+ |
| [.cursorrules](../.cursorrules) | Kokybė, a11y, dokumentacijos taisyklės | QA + Orchestrator | Taisyklių pakeitimai, nauji reikalavimai |
| [CHANGELOG.md](../CHANGELOG.md) | Versijų pakeitimų istorija (Keep a Changelog, SemVer) | Kiekvienas (pagal pakeitimą) | Kiekvienas release ir reikšmingi pakeitimai |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | Primary (Vercel) + mirror (GitHub Pages), BASE_PATH, troubleshooting | QA / Orchestrator | Platforma, URL, post-deploy |
| [STYLEGUIDE.md](../STYLEGUIDE.md) | Dizaino sistema **1.6** (Product Operator): spalvos, tipografija, paviršiai, hero diagram | UI/UX | Dizaino pakeitimai, tokenų atnaujinimai |
| [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) | Atskaitos kontraktas (HTML/JS struktūra, CMO v2, BASE_PATH) | QA / Orchestrator | Struktūros pakeitimai, CMO v2 plėtra |
| [docs/PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md) | Mokamo sluoksnio pozicionavimas (CMO AI Content System, Use · Build · Install, ką teigiame / ko ne) + §4 JTBD search-intent language | Commerce / Content | Pavadinimų, pakopų, pozicionavimo, EN JTBD copy pakeitimai |
| [docs/OFFER-ARCHITECTURE.md](OFFER-ARCHITECTURE.md) | Pasiūlymo architektūra (free vs paid matrica, funnel, copy cascade, regeneration komandos); GEO JTBD on `/en/` | Commerce | Produktų struktūros, copy šaltinių pakeitimai |
| [docs/CREATIVE_BRIEF_BUILDER.md](CREATIVE_BRIEF_BUILDER.md) | EN free `#creative-brief` DOM kontraktas, SOT keys, out-of-scope | UI/UX / Content | Builder UI, SOT copy, e2e |
| [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) | EN kanonas, LT freeze, path atitikmenys, build | Curriculum / QA / Orchestrator | Locale politika, `EN_REPLACEMENTS`, hreflang |
| [docs/BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md) | Promptų kokybės standartas (META/INPUT/OUTPUT) | Content | Promptų šablonų keitimai |
| [docs/PEDAGOGINES_SPECIFIKACIJA.md](PEDAGOGINES_SPECIFIKACIJA.md) | Pedagoginiai tikslai, auditorija, terminologija | Curriculum / Content | Kriterijų ar terminologijos pakeitimai |
| [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) | QA standartas (nuoroda spinoff01) | QA | Kriterijai, komandos |
| [docs/TESTAVIMAS.md](TESTAVIMAS.md) | Gyvo testavimo scenarijai ir žurnalas | QA | Po deploy testavimas, rezultatai |
| [docs/AGENT_SOT.md](AGENT_SOT.md) | Operacinis SOT: build, deploy, GEO (hash hubs + frontFaq), commerce | Orchestrator / QA | Pipeline, GEO, go-live proceso pakeitimai |
| [docs/security.md](security.md) | Headers, CSP, secrets, PDF leak policy | QA / Orchestrator | Saugumo pakeitimai |
| [docs/language-guidelines-en-lt.md](language-guidelines-en-lt.md) | EN kanonas, brand, LT freeze | Content / QA | Viešo UI kalbos taisyklės |
| [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md) | Stripe + PDF go-live checklist — **R1 / Ambition A ops SSOT** | Commerce | Prieš live checkout; detail už [todo.md](../todo.md) |
| [docs/GO_LIVE_RUNBOOK.md](GO_LIVE_RUNBOOK.md) | Viena puslapio operatorių seka (dry-run → Blob → check:fulfillment → check:prod → IndexNow) | Commerce / Orchestrator | R1 ops komandų pokyčiai |
| [docs/TEMPLATE_MIGRATION_BACKLOG.md](TEMPLATE_MIGRATION_BACKLOG.md) | Phase 4b template epic (deferred) | Orchestrator | Scope patvirtinimas |
| [docs/PDF_A11Y_CHECKLIST.md](PDF_A11Y_CHECKLIST.md) | Rankinis PDF a11y prieš paid release | Commerce / QA | `docs/pdf-source/` pakeitimai |
| [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) | PR šablonas | Orchestrator / QA | Checklist pakeitimai |

### Privatumo puslapiai

| Failas | Paskirtis | Atsakingas | Kada atnaujinti |
|--------|-----------|------------|------------------|
| `lt/privatumas.html`, `en/privacy.html` | Privatumo politika (kanonas) | Content (juridinė peržiūra atskirai) | GDPR pokyčiai (kai bus rinkimas, dabar – tik aprašymas, kad duomenys nerinkimi) |
| `privatumas.html` (root) | Legacy backward compat | (laikomas dėl backlinks) | Tik tekstas (struktūra/JS – fiksuota Legacy §6) |

### Kodas, build ir testai

| Failas / katalogas | Paskirtis | Atsakingas | Kada atnaujinti |
|--------------------|-----------|------------|-----------------|
| [index.html](../index.html) | Legacy **struktūrinis** build šaltinis (DOM + LT `<pre>` branduolys); **produkto kanonas – `/en/`** | Content + UI/UX + QA | Struktūra, id; EN turinys per `data/en-*.json` + build |
| [data/en-prompt-bodies.json](../data/en-prompt-bodies.json) | 10 EN META eilučių (`<pre>` turiniui) | Content | Keičiant EN promptų tekstą |
| [data/en-prompt-expected.json](../data/en-prompt-expected.json) | „Expected output“ bullet'ai (EN kanonas) | Content / Curriculum | Pridedant / keičiant tikėtinus rezultatus |
| [data/lt-prompt-expected.json](../data/lt-prompt-expected.json) | LT expected (užšaldyta snapshot) | (Orchestrator scope tik) | Retas LT snapshot refresh |
| [data/en-scenarios.json](../data/en-scenarios.json) | CMO v2 scenarijai EN (kanonas) | Content / Curriculum | Scenarijų pakeitimai |
| [data/lt-scenarios.json](../data/lt-scenarios.json) | LT scenarijai (užšaldyta snapshot) | (Orchestrator scope tik) | Retas LT snapshot refresh |
| [data/](../data/) `meme-*.(png\|webp)` | Offline/social meme assetai (ne gyvoje UI) | UI/UX | Social reuse |
| [config/brand-seo.json](../config/brand-seo.json) | SEO title, description, OG alt ir OG vizualo tekstai | Content / UI/UX | Keičiant social preview ar `<title>` |
| [docs/BRAND_SYNC.md](BRAND_SYNC.md) | Mother repo SHA, spalvų map, favicon/OG sync procedūra | UI/UX | Po mother brand pakeitimo |
| [styles/design-tokens.json](../styles/design-tokens.json) | Dizaino tokenų vienas šaltinis (smoke assert vs `tokens.css`) | UI/UX + QA | Keičiant semantinius / type / shadow tokenus |
| [styles/tokens.css](../styles/tokens.css), [styles/components.css](../styles/components.css), [styles/utilities.css](../styles/utilities.css) | CSS sluoksniai; components – DS 1.6 hero/surfaces authoritative layer | UI/UX | Keičiant komponentų vizualiką, hero, paviršius |
| [scripts/build-locale-pages.js](../scripts/build-locale-pages.js) | Generuoja lt/en + inject CMO v2 blokus + EN_REPLACEMENTS | QA / Orchestrator | LT/EN replace sąrašas, BASE_PATH, canonical/hreflang, CMO v2 inject |
| [scripts/generate-og.js](../scripts/generate-og.js) | OG paveikslo (1200×630, SVG → PNG) generavimas | UI/UX + QA | Keičiant OG maketą; po pakeitimo `tests/structure.test.js` OG kontraktai |
| [scripts/vercel-export-public.js](../scripts/vercel-export-public.js) | Vercel statinio output kopijavimas į `public/` + analytics inject | QA / Orchestrator | Keičiant Vercel deploy artefakto sudėtį |
| [lt/index.html](../lt/index.html), [en/index.html](../en/index.html) | Generuojami locale puslapiai (`en/` kanonas; `lt/` užšaldyta) | (build output) | Po kiekvieno `npm run build` |
| [js/en-prompt-bodies-inline.js](../js/en-prompt-bodies-inline.js) | Generuojamas iš `data/en-prompt-bodies.json` | (build output) | Po `npm run build` |
| [public/](../public/) | Vercel deploy artefaktas (gitignored) | (build output) | Po `npm run build` |
| [og.png](../og.png) | OG/Twitter preview (1200×630) | UI/UX (per generate-og) | `npm run build` arba `npm run generate:og` |
| [robots.txt](../robots.txt), [sitemap.xml](../sitemap.xml) | SEO crawler signalai | QA | Naujos sekcijos / lokelės |
| [favicon.svg](../favicon.svg) | Favicon (derivative, ink + gold) | UI/UX | Brand atnaujinimas; žr. [BRAND_SYNC.md](BRAND_SYNC.md) |
| [site.webmanifest](../site.webmanifest), `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png` | PWA / tab icons | UI/UX | `npm run icons:export` po SVG keitimo |
| [scripts/export-favicons.js](../scripts/export-favicons.js) | SVG → PNG icon pack | UI/UX | Keičiant favicon.svg |
| [tests/structure.test.js](../tests/structure.test.js) | Struktūriniai testai (spine + commerce + GEO) | QA | Pridedant naujus kontraktus |
| [tests/cmo-prompt-registry.test.js](../tests/cmo-prompt-registry.test.js) | Registry `freeInteractive` 1/2/3/5 vs bodies | QA | Keičiant spine/teaser ribą |
| [tests/design-system-smoke.test.js](../tests/design-system-smoke.test.js) | Dizaino sistemos smoke (tokenai, selektoriai) | QA | Keičiant CSS sluoksnius ar tokenų struktūrą |
| [tests/a11y-smoke.test.js](../tests/a11y-smoke.test.js) | A11y smoke (skip-link, focus-visible, reduced-motion, aria-label) | QA | Keičiant interaktyvius elementus ar a11y taisykles |
| [js/creative-brief.js](../js/creative-brief.js) | EN `#creative-brief` builder (sessionStorage, copy) | UI/UX | Builder UI / SOT copy |
| [js/va-track.js](../js/va-track.js) | Vercel Analytics `trackEvent` (no PII; no-op without `window.va`) | UI/UX / Commerce | Naujas conversion event |
| [.github/workflows/ci.yml](../.github/workflows/ci.yml) | CI – npm test + pa11y į /lt/, /en/, privacy | QA / Orchestrator | Nauji testai, lint, a11y URL |
| [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) | GitHub Pages deploy (mirror, su `MIRROR_NOTE: '1'`) | QA / Orchestrator | Deploy žingsniai, environment, BASE_PATH, MIRROR_NOTE |

### Mokama PDF tarpinė (v1.6.0+, EN-only, tik `promptanatomy.space`)

| Failas / katalogas | Paskirtis | Atsakingas | Kada atnaujinti |
|--------------------|-----------|------------|-----------------|
| [memo_pdf.md](../memo_pdf.md) | Architektūros sprendimas, sister-project handoff (CMO konkrečios reikšmės §8) | Commerce / Orchestrator | Architektūros pokyčiai, kainos, env raktų pervadinimai |
| [config/sot.json](../config/sot.json) | Single source of truth: produktai ($3.99 / $8.99 / $10.99), Stripe Payment Links, allowPlaceholderCheckout, mirror policy, Buyer FAQ | Commerce | Live Payment Link pridėjimas, kainų / FAQ atnaujinimai |
| [docs/pdf-source/cmo-starter.html](../docs/pdf-source/cmo-starter.html) | 14-puslapio Starter PDF HTML šaltinis (Letter, print-optimized) | Commerce / Content | PDF turinio pakeitimai (kainos, copy, prompts) |
| [docs/pdf-source/cmo-pro.html](../docs/pdf-source/cmo-pro.html) | 30-puslapio Pro PDF HTML šaltinis | Commerce / Content | PDF turinio pakeitimai (scenarios, workshop, rubric) |
| [docs/pdf-source/cmo-bundle.html](../docs/pdf-source/cmo-bundle.html) | Bundle cover HTML (stacked Use/Build/Install) | Commerce / UI | Cover redesign |
| [docs/PDF_A11Y_CHECKLIST.md](PDF_A11Y_CHECKLIST.md) | Rankinis PDF a11y checklist prieš release | Commerce / QA | PDF šaltinio pakeitimai |
| [api/_lib/fulfillment.js](../api/_lib/fulfillment.js) | PRODUCTS map, FULFILLMENT_REQUIRED_ENV, getSiteUrl, fulfillCheckoutSession, signed download token logika | Commerce / QA | Kainų / produktų pakeitimai, env raktų pervadinimai, license copy |
| [api/stripe-webhook.js](../api/stripe-webhook.js) | Stripe webhook handler (raw body, signature verify, idempotent) | Commerce / QA | Niekada be QA; bodyParser:false + signature kontraktas privalomas |
| [api/download-link.js](../api/download-link.js) | success.html polling endpoint (200/202/404 protokolas) | Commerce / QA | Polling protokolo pakeitimai |
| [api/download.js](../api/download.js) | Pasirašyta PDF gauti route (HMAC + Redis token + `Cache-Control: private, no-store`) | Commerce / QA | Single-use token logikos pakeitimai |
| [api/fulfillment-health.js](../api/fulfillment-health.js) | Vieša sveikatos patikra (env + Redis ping) | Commerce / QA | Praplečiant patikrų sąrašą |
| [api/fulfillment-followup.js](../api/fulfillment-followup.js) | Vercel cron follow-up (Resend), jei pirmas laiškas nepasiekė | Commerce / QA | Cron / retry logika |
| [success.html](../success.html) | Pirkimo sėkmės polling UX (aria-live, noindex) | Commerce / UI/UX | Copy / UX pokyčiai |
| [terms.html](../terms.html) | Pardavimo sąlygos + Team License (#paid-pdf-license) + 14-day refund | Commerce (juridinė peržiūra atskirai) | Licencijos pokyčiai, refund politika |
| [coming-soon.html](../coming-soon.html) | Placeholder režimo CTA tikslas, kol nėra live Stripe Payment Links | Commerce | Po live launch – galima pašalinti arba palikti backup'ui |
| [assets/pdf-covers/cmo-{starter,pro,bundle}-cover.png](../assets/pdf-covers/) | Storefront cover thumbnails (Playwright WYSIWYG; `npm run pdf:covers`) | UI/UX / Commerce | Cover redesign in `docs/pdf-source/` |
| [assets/pdf-covers/cmo-pro-cover.svg](../assets/pdf-covers/cmo-pro-cover.svg) | Legacy Pro SVG (bundle naudoja `cmo-bundle-cover.png`) | UI/UX / Commerce | Tik jei SVG dar referencinamas |
| [assets/pdf-covers/cmo-{starter,pro}-preview-{1,2,3}.png](../assets/pdf-covers/) | Watermarked interior pages 2–4 (`npm run pdf:previews`) | (build output, on demand) | Marketing keitimas |
| [scripts/export-pdf-covers.js](../scripts/export-pdf-covers.js) | PDF page 1 → clean cover PNG (no watermark) | UI/UX / Commerce | Cover layout pokyčiai |
| [scripts/export-pdfs.js](../scripts/export-pdfs.js) | Playwright Chromium → PDF + page-count gate (14/30) | Commerce / QA | Tik build pipeline'o pokyčiai |
| [scripts/export-pdf-previews.js](../scripts/export-pdf-previews.js) | Interior pages 2–4 watermarked PNG preview generavimas | UI/UX / Commerce | Watermark / preview UX pokyčiai |
| [scripts/upload-pdfs-to-blob.js](../scripts/upload-pdfs-to-blob.js) | Vercel Blob privatus įkėlimas + `--dry-run` + env paste-snippet | Commerce / Orchestrator | Naujas PDF upload arba blob storage migracija |
| [scripts/check-fulfillment-env.js](../scripts/check-fulfillment-env.js) | Lokalus pre-launch probe (env + Redis + Stripe + opcionaliai Resend) | Commerce / QA | Naujas env reikalavimas, naujas drill |
| [scripts/check-prod-health.js](../scripts/check-prod-health.js) | Production GET `/api/fulfillment-health` + IndexNow key file (`npm run check:prod`) | Commerce / QA | Health kontraktas arba IndexNow raktas |
| [.env.example](../.env.example) | Visi reikalingi env raktai placeholder formatu | Commerce | Naujas env reikalavimas |
| [tests/fulfillment-config.test.js](../tests/fulfillment-config.test.js) | PRODUCTS ⇆ SOT consistency, env probe, /api kontraktas | QA | Kainų pokyčiai, naujas API route |
| [tests/e2e/smoke.spec.js](../tests/e2e/smoke.spec.js), [tests/e2e/checkout.spec.js](../tests/e2e/checkout.spec.js), [tests/e2e/creative-brief.spec.js](../tests/e2e/creative-brief.spec.js) | Playwright e2e: storefront, success polling, brief builder | QA | Naujas storefront / brief flow |
| [playwright.config.js](../playwright.config.js) | Playwright runner config | QA | CI / runner pakeitimai |
| [vercel.json](../vercel.json) | Cache-Control headers `/api/*` ir `/success.html` (no-store) | Orchestrator / QA | Naujas dinaminis maršrutas |

---

## 2. Kada ką atnaujinti

- **Kodas keičiamas** → atnaujinti susijusią dokumentaciją (README, Legacy ir kt.). Žr. [.cursorrules](../.cursorrules) skyrių „Dokumentacijos valdymas".
- **Release / deploy** → prieš deploy paleisti `npm run build`, kad būtų sugeneruoti atnaujinti `lt/`, `en/` ir `public/` failai. Būtina atnaujinti CHANGELOG: sekciją „Nereleisuota" perkelti į naują versiją `## [X.Y.Z] - YYYY-MM-DD`. Versijavimas – [Semantic Versioning](https://semver.org/).
- **PR:** prieš merge patikrinti, ar „Susiję dokumentai" (PR šablone) atnaujinti; jei release – ar CHANGELOG ir versija nurodyta.

---

## 3. CHANGELOG ir release taisyklė

- **Formatas:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) – sekcijos: Prideta, Pakeista, Taisyta, Pašalinta, Deprecated, Saugumas. Datos – **YYYY-MM-DD** (ISO 8601).
- **Release** = Git tag (pvz. `v1.0.0`) + CHANGELOG atnaujinimas („Nereleisuota" → `[X.Y.Z] - data`).
- Prieš release QA Agent tikrina: ar CHANGELOG atnaujintas ir ar versija atitinka pakeitimus (SemVer).

---

## 4. Archyvavimo politika

- **Versijavimas:** Dokumentai versijuojami per **Git** (istorija = audit trail).
- **Archyvas:** Istoriniai šablonai laikomi Git istorijoje; atskiro `docs/archive/` katalogo nenaudojame.
- **Retention:** Automatinio dokumentų trynimo nenaudoti; archyve laikyti pagal poreikį.

---

## 5. QA checklist – dokumentacija

Prieš merge / release:

- [ ] Ar pakeitimams atitinka dokumentacijos atnaujinimai (pagal lentelę skyriuje 1)?
- [ ] Jei release – ar CHANGELOG.md atnaujintas ir versija nurodyta (SemVer)?

Žr. [AGENTS.md](../AGENTS.md) QA Agent aprašymui, [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) (nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)), [docs/TESTAVIMAS.md](TESTAVIMAS.md) gyvam testavimui.
