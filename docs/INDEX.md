# Dokumentacijos indeksas – DI Promptų Biblioteka

**Paskirtis:** Vienas įėjimo taškas žmonėms ir AI agentams – ką skaityti pirmiausia pagal rolę ar užduotį. Kanoniniai kodas ir ribos: [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) + `npm test`.

**Paskutinis atnaujinimas:** 2026-09-11 (docs hygiene: Commerce SSOT seka; Active vs Reference/parked)

---

## 0. Locale (būtina skaityti)

**Kanonas:** [`/en/`](https://promptanatomy.space/en/) – turinys, UX, Commerce, release QA, SEO `x-default`.  
**LT freeze:** [`/lt/`](https://promptanatomy.space/lt/) – tester snapshot; ne vystyti be Orchestrator scope. Root `/` visada → `/en/` (ne pagal naršyklės kalbą).  
Pilna politika: [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) §0–§2.

---

## 1. Pradžia per 2 minutes

| Jei tu… | Atidaryk |
|---------|----------|
| Naujas projekte | [README.md](../README.md) (**EN**, GitHub) → tada šį indeksą |
| Orchestrator / prioritetai | [roadmap.md](../roadmap.md) (R1–R4 + Audit mapping) + [todo.md](../todo.md) (aktyvus R1 Stripe; R1-support leftovers) + [AGENTS.md](../AGENTS.md) §0.2 |
| AI agentas (Cursor ir kt.) | [.cursorrules](../.cursorrules) + [AGENTS.md](../AGENTS.md) (§0.1 free surface, §0.2 roadmap, §10 lessons incl. JTBD/GEO + §10.14–21 R1-support) + [AGENT_SOT.md](AGENT_SOT.md) + [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) + [`PRODUCT-POSITIONING.md`](PRODUCT-POSITIONING.md) §4 |
| Keiti tik angliškus tekstus / promptus (kanonas) | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) §0 + [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) + [`BULLET_PROOF_PROMPTS.md`](BULLET_PROOF_PROMPTS.md) |
| Keiti LT (retas snapshot refresh) | Orchestrator scope + [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) §4 |
| Keiti EN promptų `<pre>` turinį | [`../data/en-prompt-bodies.json`](../data/en-prompt-bodies.json) → `npm run build` |
| Keiti LT/EN kelius ar build | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) + [`../scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) |
| Keiti CMO v2 (kontekstas, scenarijai, safety) | [`../data/*.json`](../data/) + [`../scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) |
| **Keiti mokamą PDF tarpinę (kainos, license, Stripe)** | [`config/sot.json`](../config/sot.json) + [`LEGACY_GOLDEN_STANDARD.md` §7](LEGACY_GOLDEN_STANDARD.md); architektūra: [`memo_pdf.md`](../memo_pdf.md) (**reference**, ne go-live pirmas žingsnis) |
| **Pridėti / atnaujinti PDF turinį** | Operator-local [`docs/pdf-source/*.html`](pdf-source/README.md) (gitignored) → `npm run pdf:export` (14/30 page-count gate). Covers stay in `assets/pdf-covers/`. |
| **Pozicionavimas / pasiūlymo architektūra** | [`docs/PRODUCT-POSITIONING.md`](PRODUCT-POSITIONING.md) + [`docs/OFFER-ARCHITECTURE.md`](OFFER-ARCHITECTURE.md) |
| **EN creative brief builder (`#creative-brief`)** | Po hero, prieš `#pdf-storefront` (`#cb-builder` open) — [`docs/CREATIVE_BRIEF_BUILDER.md`](CREATIVE_BRIEF_BUILDER.md) + [`config/sot.json`](../config/sot.json) `copy.creativeBrief` + [`js/creative-brief.js`](../js/creative-brief.js) |
| **Įvesti live Stripe / R1 go-live** | [docs/GO_LIVE_RUNBOOK.md](GO_LIVE_RUNBOOK.md) (komandų seka) → [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md) (Dashboard + env SSOT) → [`config/sot.json`](../config/sot.json) + [todo.md](../todo.md) + [DEPLOYMENT.md §2.5](../DEPLOYMENT.md). `memo_pdf` = reference only |
| **Produkto roadmap** | [roadmap.md](../roadmap.md) — Ambition A→E→light B→C |
| **GEO / SEO surfaces** | [docs/AGENT_SOT.md](AGENT_SOT.md) §5 + [`scripts/geo-surfaces.js`](../scripts/geo-surfaces.js) (`llms.txt` hash hubs) |
| **EN JTBD messaging (search intent)** | [`PRODUCT-POSITIONING.md`](PRODUCT-POSITIONING.md) §4 + [`config/sot.json`](../config/sot.json) `frontFaq` / `knowsAbout` / `storefrontHead` + [`config/brand-seo.json`](../config/brand-seo.json); FAQ triple sync ([AGENTS.md](../AGENTS.md) §10.13) — **ne** nauji `/en/ai-marketing-*` hub'ai |
| Release / deploy | [CHANGELOG.md](../CHANGELOG.md) + [DEPLOYMENT.md](../DEPLOYMENT.md) + `npm test` |

---

## 2. Pagal agento rolę (AGENTS.md modelis)

| Agentas | Pagrindiniai dokumentai | Kodas / artefaktai |
|---------|-------------------------|--------------------|
| **Orchestrator** | [roadmap.md](../roadmap.md), [todo.md](../todo.md), [AGENTS.md](../AGENTS.md) §0.2, [DOCUMENTATION.md](DOCUMENTATION.md), [CHANGELOG.md](../CHANGELOG.md) | Prioritetai R1–R4, scope |
| **Curriculum** | [`PEDAGOGINES_SPECIFIKACIJA.md`](PEDAGOGINES_SPECIFIKACIJA.md), [`OFFER-ARCHITECTURE.md`](OFFER-ARCHITECTURE.md), registry `freeInteractive` | Free spine 1/2/3/5 vs Pro full 10; **EN** `data/en-*.json` |
| **Content** | [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md), [`BULLET_PROOF_PROMPTS.md`](BULLET_PROOF_PROMPTS.md), [`PEDAGOGINES_SPECIFIKACIJA.md`](PEDAGOGINES_SPECIFIKACIJA.md), [`PRODUCT-POSITIONING.md`](PRODUCT-POSITIONING.md) §4 | Spine bodies + teaser copy + JTBD FAQ/meta; [`data/en-*.json`](../data/); SOT `frontFaq`; root [`index.html`](../index.html) `applyStaticLocaleText` |
| **UI/UX** | [STYLEGUIDE.md](../STYLEGUIDE.md) **1.6.1**, [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md), [`CREATIVE_BRIEF_BUILDER.md`](CREATIVE_BRIEF_BUILDER.md), [`BRAND_SYNC.md`](BRAND_SYNC.md) | Product Operator; tool-first CEO IA (hero → open brief → 2 kits → library 1/2/3/5); surfaces; `styles/*`; **0** meme slots |
| **Commerce** (v1.6.0+) | [todo.md](../todo.md) R1 → [GO_LIVE_RUNBOOK.md](GO_LIVE_RUNBOOK.md) → [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md); [`PRODUCT-POSITIONING.md`](PRODUCT-POSITIONING.md), [`OFFER-ARCHITECTURE.md`](OFFER-ARCHITECTURE.md), [`LEGACY_GOLDEN_STANDARD.md` §7](LEGACY_GOLDEN_STANDARD.md), [DEPLOYMENT.md §2.5](../DEPLOYMENT.md); [`memo_pdf.md`](../memo_pdf.md) = architecture reference | [`config/sot.json`](../config/sot.json), operator-local [`docs/pdf-source/`](pdf-source/README.md), [`api/`](../api/), [`success.html`](../success.html), [`terms.html`](../terms.html). Tik EN, tik `promptanatomy.space`. R4 Install po R1. |
| **QA** | [docs/QA_STANDARTAS.md](QA_STANDARTAS.md), [docs/TESTAVIMAS.md](TESTAVIMAS.md), [DOCUMENTATION.md](DOCUMENTATION.md) | `npm test`, `tests/*.test.js`, [`tests/fulfillment-config.test.js`](../tests/fulfillment-config.test.js), [`tests/e2e/`](../tests/e2e/), [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) |

---

## 3. Pagal užduotį (užduočių žemėlapis)

| Užduotis | Žingsniai |
|----------|-----------|
| Pakeisti prompto tekstą (EN kanonas) | Tik leidžiami laukai pagal **Legacy**; META/INPUT/OUTPUT – **Bullet proof**; EN `<pre>` – [`data/en-prompt-bodies.json`](../data/en-prompt-bodies.json); struktūra – root `index.html`. **LT nekeisti.** |
| Pakeisti CMO v2 konteksto / scenarijų / safety bloką | Redaguoti [`data/en-*.json`](../data/) + build; LT JSON – tik snapshot refresh scope. |
| Pakeisti EN UI tekstus | [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) `EN_REPLACEMENTS` + root `applyStaticLocaleText` EN šakos. |
| Pakeisti EN FAQ / JTBD GEO copy | Sync **trys** vietos: `sot.frontFaq` + build inject/`EN_REPLACEMENTS` + `applyStaticLocaleText` FAQ arrays; meta → `brand-seo.json`. Žr. AGENTS §10.11–13. |
| Pakeisti dizainą | STYLEGUIDE **1.6.1** + `design-tokens.json` / `styles/*`; po pakeitimų `npm test` (design-system + a11y smoke). |
| Pakeisti struktūrą (nauja sekcija, JS API) | QA + sąmoningas **Legacy** atnaujinimas; išplėsti `tests/structure.test.js` jei reikia kontrakto. |

---

## 4. Kodas ↔ dokumentai (faktinis pipeline)

```
index.html (legacy struktūrinis šaltinis) + data/en-*.json (kanonas) + data/lt-*.json (užšaldyta)
    → npm run build
       1. scripts/export-favicons.js → favicon PNG pack
       2. scripts/generate-og.js → og.png (1200×630; brand-seo + design-tokens)
       3. scripts/build-locale-pages.js → lt/index.html, en/index.html, js/en-prompt-bodies-inline.js
          (inject: cmo-context, creative-brief EN, prompt-expected×4 spine, cmo-safety, cmo-scenarios, __CMO_COMPILE;
          `geo-surfaces.js` rašo robots/sitemap/llms/JSON-LD iš šio skripto)
       4. scripts/vercel-export-public.js → public/ (Vercel deploy artefaktas)
    → npm test (structure + registry + design-system + a11y smoke + fulfillment-config + lint)
```

| Failas / katalogas | Dokumentuota |
|--------------------|--------------|
| `index.html` | Legacy §0, §2, README |
| `data/*.json` (en-prompt-bodies, {lt,en}-prompt-expected, {lt,en}-scenarios) | Legacy §0, MULTILINGUAL §4 |
| `scripts/build-locale-pages.js` | Legacy §0, MULTILINGUAL, DEPLOYMENT (BASE_PATH) |
| `scripts/generate-og.js` | Legacy §0, DEPLOYMENT (OG kontraktas) |
| `scripts/vercel-export-public.js` | DEPLOYMENT (Vercel mirror) |
| `lt/`, `en/`, `js/en-prompt-bodies-inline.js` | Generuojama, žr. MULTILINGUAL |
| `public/` | Vercel deploy artefaktas (gitignored) |
| `tests/*.test.js` | QA standartas, AGENTS §6 |
| `privatumas.html` (root), `lt/privatumas.html`, `en/privacy.html` | Legacy §6, TESTAVIMAS |
| `robots.txt`, `sitemap.xml` | DOCUMENTATION inventorius |

---

## 5. Visi `docs/` failai (santrauka)

### Active (agentų skaitymo kelias)

| Dokumentas | Trumpai |
|------------|---------|
| **INDEX.md** (šis failas) | Navigacija |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Inventorius, atsakomybės, release/docs taisyklės |
| [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) | Golden standard: ID, JS API, CMO v2 kontraktas, checklist |
| [MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) | EN kanonas, LT freeze, build, routing |
| [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md) | Promptų META/INPUT/OUTPUT standartas |
| [PEDAGOGINES_SPECIFIKACIJA.md](PEDAGOGINES_SPECIFIKACIJA.md) | Auditorija, tonas; free spine 1/2/3/5, full 1–10 Pro |
| [QA_STANDARTAS.md](QA_STANDARTAS.md) | QA merge/release kriterijai; free-surface → [TESTAVIMAS.md](TESTAVIMAS.md) |
| [TESTAVIMAS.md](TESTAVIMAS.md) | Gyvas testavimas po deploy + EN UX kontraktas |
| [AGENT_SOT.md](AGENT_SOT.md) | Ops: build, deploy, GEO, commerce |
| [BRAND_SYNC.md](BRAND_SYNC.md) | Mother brand tokens + entity footer |
| [CREATIVE_BRIEF_BUILDER.md](CREATIVE_BRIEF_BUILDER.md) | EN `#creative-brief` DOM + SOT |
| [OFFER-ARCHITECTURE.md](OFFER-ARCHITECTURE.md) | Free vs paid matrica, funnel |
| [PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md) | Paid layer + JTBD §4 |
| [security.md](security.md) | Headers, CSP, secrets |
| [language-guidelines-en-lt.md](language-guidelines-en-lt.md) | Viešo UI kalba |
| [PDF_A11Y_CHECKLIST.md](PDF_A11Y_CHECKLIST.md) | Rankinis PDF a11y prieš release |
| [GO_LIVE_RUNBOOK.md](GO_LIVE_RUNBOOK.md) | R1 operatorių seka (Blob dry-run → check:prod) |
| [pdf-source/README.md](pdf-source/README.md) | Paid PDF HTML operator-local (gitignored) |

### Reference / parked (ne pirmas agentų žingsnis)

| Dokumentas | Rolė |
|------------|------|
| [TEMPLATE_MIGRATION_BACKLOG.md](TEMPLATE_MIGRATION_BACKLOG.md) | **Parked** — template / CSS dual-layer epic; ne UI primary scope |
| [`../memo_pdf.md`](../memo_pdf.md) | **Reference** — Stripe/PDF architecture handoff; go-live = GO_LIVE → MUST_TODO → `sot.json` |

---

## 6. Root ir kiti svarbūs failai (ne `docs/`)

| Failas | Paskirtis |
|--------|-----------|
| [README.md](../README.md) | **Public EN** product overview (GitHub); kanonas `/en/` |
| [roadmap.md](../roadmap.md) | Produkto roadmap R1–R4 (A→E→light B→C) |
| [todo.md](../todo.md) | Aktyvus R1 tracker → MUST_TODO_STRIPE |
| [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md) | R1 / Ambition A ops SSOT (Dashboard + env) |
| [memo_pdf.md](../memo_pdf.md) | Architecture reference (ne go-live pirmas žingsnis) |
| [AGENTS.md](../AGENTS.md) | Agentų rolės, workflow, komandos |
| [.cursorrules](../.cursorrules) | Cursor: kokybė, a11y, docs, commit |
| [CHANGELOG.md](../CHANGELOG.md) | SemVer istorija |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | Primary (Vercel) + mirror (GitHub Pages), BASE_PATH |
| [STYLEGUIDE.md](../STYLEGUIDE.md) | Dizaino sistema **1.6.1** (Product Operator) |

**Pastaba:** Kontaktų forma / Google Apps Script / atsiliepimų schema **NEBĖRA** (pašalinta 2026-05-15). Produktas duomenų nerinkia – tik kopijavimas + localStorage progresas.

---

## 7. Cursor: taisyklės ir Skills

- **Šiame repozitorijoje** kanonas: `.cursorrules` + `AGENTS.md` + `docs/` (ypač **Legacy** + šis **INDEX**).
- **Cursor Agent Skills** (pvz. PR babysit, split-to-PRs) yra vartotojo lygio įrankiai – jie **papildo**, bet **nepakeičia** šio projekto golden standard ir `npm test`. Jei Skill liečia dokumentaciją, po merge vis tiek atitikti [DOCUMENTATION.md](DOCUMENTATION.md) checklist.

---

## 8. Greitos komandos

```bash
npm install
npm run build    # icons:export + generate-og + build-locale-pages + vercel-export
npm test         # build + testai + lint:html + lint:js
```

A11y lokaliai (pavyzdys):

```bash
npx serve public -l 3000
npx pa11y http://127.0.0.1:3000/en/ --standard WCAG2AA
# CI taip pat tikrina /lt/ (freeze smoke) ir /en/privacy/ — ne serve -s .
```

Žr. [README.md](../README.md) ir [DEPLOYMENT.md](../DEPLOYMENT.md).
