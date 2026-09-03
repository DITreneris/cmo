# Agentų Sistemos Modelis – Apžvalga

**Projektas:** DI Promptų Biblioteka (Turinio DI sistema – CMO rinkinys)  
**Šio dokumento versija:** 1.5.4 (EN kanonas; spine-first; DS 1.6; JTBD/GEO; R1-support closeout lessons; LT užšaldyta)  
**Kalba:** LT

---

## 0. Locale politika (nuo 2026-05-31)

| Locale | Rolė |
|--------|------|
| **`/en/`** | **Kanoninė versija** – visi agentai (Content, UI/UX, Commerce, Curriculum, QA release) dirba čia. SEO `x-default`, Commerce, rankinis testavimas, dokumentacija. |
| **`/lt/`** | **Užšaldyta testeriams** – build/CI lieka; **jokio aktyvaus turinio/UI vystymo** be Orchestrator „LT snapshot refresh“ scope. |

**Visiems agentams:** nauji PR **nekeičia** LT turinio sinchroniškai; EN pakeitimai **nebackport'inami** į LT. QA release – pilnas checklist **`/en/`**; `/lt/` – tik regresijos smoke (CI). Detaliau: [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) §0.

### 0.1 EN free surface (Phase A – privaloma)

| Sluoksnis | Kontraktas |
|-----------|------------|
| **Spine-first** | Hero primary → spine `#block1` (`#heroCtaSpine`); secondary → `#creative-brief` (`#heroCtaBrief`) |
| **Interactive spine** | Promptai **1, 2, 3, 5** (contiguous); free loop includes `#cmo-safety` + `#creative-brief`; progress **of 4** |
| **Pro catalog** | Promptai **4, 6, 7, 8, 9, 10** – `#pro-contents` po safety + brief + scenarios; `data-teaser-prompt` + `#blockN` eilutės (**ne** `.prompt--teaser`); vienas CTA → storefront |
| **Pro / data SSOT** | Vis dar **10** bodies: `data/en-prompt-bodies.json`, `data/cmo-prompt-registry.json` → `freeInteractive` |
| **Memes** | **0** gyvoje UI (`data/meme-*` – tik offline/social) |
| **Free-value order** | Spine `#block5` → thin `#cmo-safety` → EN `#creative-brief` (teaser + closed `#cb-builder`) → `#cmo-scenarios` → `#pro-contents` → storefront (3 cards, **no** comparison table) → FAQ → `#prompt-basics`; LT strip brief + `#heroCtaBrief` + `#progressJumpCreative` |
| **Path cut (R1 conversion)** | One method surface = hero diagram; **no** cycle-stepper / provider hub / `#framework-schema` / diagram outputs; sticky `#siteNav` = Workflows · Brief builder · Pricing; progress jump = 1·2·3·5 · Pricing · Brief · FAQ |

Detaliau: [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md), [docs/OFFER-ARCHITECTURE.md](docs/OFFER-ARCHITECTURE.md), [docs/AGENT_SOT.md](docs/AGENT_SOT.md) §1.

### 0.2 Product roadmap (Orchestrator)

**Canon sequence:** Ambition **A → E → light B → C** = Roadmap **R1–R4**. SSOT: [roadmap.md](roadmap.md). Active checkboxes: [todo.md](todo.md).

| Roadmap | Ambition | Focus |
|---------|----------|--------|
| **R1** | **A** | Close cash register — [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md) |
| **R2** | **E** | GEO on one `/en/` URL |
| **R3** | light **B** | Exactly one more browser-local tool after spine |
| **R4** | **C** | Deeper offline Install (Pro/Bundle) |

**Naming:** Do not call commerce “Phase A” — §0.1 “Phase A” = EN free-surface (already shipped).

**PR rule:** Every product PR declares which Ambition it serves. Ambition **F** (SaaS) or **D** (vertical kits) without Orchestrator rewrite of [roadmap.md](roadmap.md) → reject. Priorities come from the roadmap, not ad-hoc feature requests.

---

## 1. Architektūra

```
ORCHESTRATOR AGENT (koordinacija; roadmap.md R1–R4)
    ├── Content Agent      (promptai, tekstai, GEO R2)
    ├── Curriculum Agent   (struktūra, logika, seka; R3/R4)
    ├── UI/UX Agent        (dizainas, a11y, UX; R3 tool)
    ├── Commerce Agent     (PDF/Stripe; R1 ops, R4 Install)
    ├── QA Agent           (kodas + turinys + roadmap gate)
    └── Feedback Store     (duomenys, metrikos)
            │
            └── GitHub / Version Control
```

---

## 2. Agentų rolės

### Content Agent
- **Tikslas:** Kuria ir prižiūri teksto turinį (promptus, aprašymus, teaser copy, EN JTBD/GEO messaging)
- **Įvestis:** Specifikacija, grįžtamasis ryšys, Curriculum rekomendacijos, [docs/PRODUCT-POSITIONING.md](docs/PRODUCT-POSITIONING.md) §4 (search-intent language); roadmap R2–R4 po R1 exit
- **Išvestis:** EN spine `<pre>` (`data/en-prompt-bodies.json` indeksai 1/2/3/5), teaser lead/CTA tekstai, FAQ; SOT `frontFaq` / `storefrontHead` / `knowsAbout` + `config/brand-seo.json` JTBD copy; **nekeičia** free↔Pro ribos be Curriculum; **nepervadina** produkto į „AI Marketing Operating System“. **R2** GEO copy; **R3** tool copy; **R4** Install PDF copy — ne nauji feature'ai be roadmap.

### Curriculum Agent
- **Tikslas:** Nustato turinio struktūrą ir mokymosi logiką (įskaitant **free spine vs Pro full 10**)
- **Įvestis:** Tikslai, auditorija, [docs/PEDAGOGINES_SPECIFIKACIJA.md](docs/PEDAGOGINES_SPECIFIKACIJA.md), [docs/OFFER-ARCHITECTURE.md](docs/OFFER-ARCHITECTURE.md), [data/cmo-prompt-registry.json](data/cmo-prompt-registry.json) (`freeInteractive`), `data/en-*.json`, [roadmap.md](roadmap.md)
- **Išvestis:** Spine seka 1→2→3→5, teaserių sąrašas, scenarijų startPromptId ant spine; Pro PDF lieka full 10. **R3:** naujo tool placement (po `#block5`, prieš teasers). **R4:** Install pedagogika (workshop depth) be SaaS.

### UI/UX & Usability Agent
- **Tikslas:** Sąsajos kokybė, prieinamumas, spine-first hero, brief placement
- **Įvestis:** .cursorrules, WCAG AA, [docs/CREATIVE_BRIEF_BUILDER.md](docs/CREATIVE_BRIEF_BUILDER.md), LEGACY; R3 tik po R1 exit
- **Išvestis:** CSS/HTML/a11y; **negrąžina** meme slotų į gyvą UI; neatidaro teaserių kaip full interactive be Curriculum scope. **R3:** vienas local tool pagal brief pattern; neilgina kelio iki Prompt 1 Copy.

### QA Agent
- **Tikslas:** Tikrina kokybę – kodas ir turinys
- **Įvestis:** Pakeitimų diff, [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) (struktūros kontraktas, CMO v2), `npm test` / `tests/*.test.js`, [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md), PRODUCT-POSITIONING (claims), [roadmap.md](roadmap.md) / [todo.md](todo.md)
- **Išvestis:** Klaidų ataskaitos, acceptance checklist
- **Dokumentacija:** Prieš merge tikrina, ar pakeitimams atitinka dokumentacijos atnaujinimai (žr. [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)). Prieš release – ar CHANGELOG.md atnaujintas ir `package.json` versija atitinka SemVer.
- **Locale:** Release QA ir rankinis testavimas – **`/en/`** kanonas. PR, keičiantis tik EN, **neturi** keisti LT failų. Jei diff liečia `lt/` ar `data/lt-*.json` be Orchestrator scope – grąžinti.
- **GEO/messaging:** `sot.frontFaq.length >= 8`; `llms.txt` hash hubs; EN be „free interactive 10“ / „AI Marketing Operating System“ kaip H1; FAQ matomas HTML ↔ `frontFaq` ↔ `applyStaticLocaleText` sinchronas.
- **Roadmap:** PR be Ambition scope arba Ambition F/D be Orchestrator rewrite → grąžinti.

### Commerce Agent
- **Tikslas:** Mokama PDF tarpinė (tik EN, `promptanatomy.space`)
- **R1:** tik [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md) ops (Blob, Vercel env, webhook, live drills) — be naujų SKU / SaaS
- **R4:** Install depth (PDF/MD) po R1 conversion signal

### Orchestrator Agent
- **Tikslas:** Koordinuoja agentus, prioritizuoja užduotis
- **Įvestis:** [roadmap.md](roadmap.md), [todo.md](todo.md), verslo užduotys, Feedback Store metrikos
- **Išvestis:** Užduočių eilės pagal R1→R2→R3→R4; prioritetų planas. Ad-hoc scope, prieštaraujantis roadmap, – atmesti arba perrašyti `roadmap.md`.

---

## 3. Workflow

1. **Vartotojas/Verslas** → Orchestrator: nauja užduotis
2. **Orchestrator** → Curriculum: struktūros rekomendacijos
3. **Curriculum** → Orchestrator: specifikacija
4. **Orchestrator** → Content: turinio kūrimas
5. **Content** → Orchestrator: turinio versija
6. **Orchestrator** → UI/UX: integracijos užduotis
7. **UI/UX** → Orchestrator: UI pakeitimai
8. **Orchestrator** → QA: validacija
9. **QA fail** → grąžinti Content/UI taisymams
10. **QA pass** → GitHub: PR sukūrimas

---

## 4. Loop logika

| Ciklas | Aprašymas |
|--------|-----------|
| Planavimo | Orchestrator → Curriculum → prioritetų sąrašas |
| Kūrimo | Content + UI/UX (lygiagrečiai, jei leidžia priklausomybės) |
| Validacijos | QA → fail = grąžinti; pass = merge |
| Įvertinimo | Release → Feedback Store → metrikos → nauji prioritetai |

---

## 5. Commit prefiksai (agentų)

- `[Content]` – turinys + EN JTBD/GEO copy: promptai/teaseriai; `config/brand-seo.json`; SOT `frontFaq` / `knowsAbout`; FAQ inject + `EN_REPLACEMENTS` + root `applyStaticLocaleText` EN arrays (**triple sync**)
- `[Curriculum]` – struktūros/sekos pakeitimai; `data/cmo-prompt-registry.json` → `freeInteractive`, spine/teaser ownership; pedagogy journey
- `[UI]` – dizainas, UX, a11y; EN free surface: spine-first hero (`#heroCtaSpine` primary / `#heroCtaBrief` secondary), free loop `#cmo-safety` → `#creative-brief` → `#cmo-scenarios` → `#pro-contents` (not `.prompt--teaser`), progress of 4; `js/creative-brief.js`, SOT `copy.creativeBrief`. LT: strip brief + `#heroCtaBrief`; mirror **gali** turėti brief (ne commerce)
- `[QA]` – testai, validacija, fix'ai
- `[Orchestrator]` – koordinacija, konfigūracija
- `[Commerce]` – mokama PDF tarpinė: `api/`, `config/sot.json` (įskaitant `storefrontHead` / product bullets / `buyerFaq`), `scripts/export-pdfs.js`, `scripts/upload-pdfs-to-blob.js`, `success.html`, `terms.html`, `coming-soon.html`, EN `#pdf-storefront`. **Tik EN, tik `promptanatomy.space`.**

---

## 6. Komandos (vykdomos prieš merge / lokaliai)

| Komanda | Paskirtis |
|---------|-----------|
| `npm install` | Įdiegti priklausomybes |
| `npm test` | Build (`lt/en`) + structure + cmo-prompt-registry + design-system smoke + a11y smoke + fulfillment-config + lint (HTML, JS) |
| `npm run lint:html` | HTML validacija (`index.html`, `lt/index.html`, `lt/privatumas.html`, `en/index.html`, `en/privacy.html`) |
| `npm run lint:js` | ESLint visiems .js failams |
| CI (GitHub Actions) | Lint, test, pa11y a11y – automatiškai push/PR |

Prieš PR įsitikinti, kad `npm test` praeina. A11y: CI tikrina `/lt/` ir `/en/`; **rankinis release QA – `/en/`** (LT – tik CI smoke). Lokaliai: `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/en/ --standard WCAG2AA` (žr. [README.md](README.md), [.github/workflows/ci.yml](.github/workflows/ci.yml)).

---

## 7. Release seka

1. Orchestrator → Curriculum: release scope ([CHANGELOG.md](CHANGELOG.md), aktyvūs PR tikslai).
2. Orchestrator → Content / UI/UX: reikiai (jei yra).
3. Orchestrator → QA: release validacija.
4. QA: `npm test`, CHANGELOG atnaujintas (SemVer), rankinis QA **`/en/`** (naršyklės, mobilus, kopijavimas, a11y, Commerce jei taikoma).
5. QA pass → tag (pvz. `v1.x.0`), deploy. QA fail → grąžinti Content/UI.

---

## 8. Susiję dokumentai

- [roadmap.md](roadmap.md) – **produkto roadmap** R1–R4 (Ambition A→E→light B→C)
- [todo.md](todo.md) – aktyvus R1 tracker (nuorodos į MUST_TODO_STRIPE)
- [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md) – R1 ops SSOT (Stripe / Blob / Vercel)
- [docs/AGENT_SOT.md](docs/AGENT_SOT.md) – **agentų operacinis SOT** (keliai, build, deploy, GEO, commerce)
- [docs/PRODUCT-POSITIONING.md](docs/PRODUCT-POSITIONING.md) – paid positioning + §4 JTBD search-intent language
- [docs/INDEX.md](docs/INDEX.md) – **indeksas**: rolės, užduotys, kodas ↔ dokumentai
- [.cursorrules](.cursorrules) – Cursor: kokybė, a11y, dokumentacija, commit formatas
- [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) – dokumentų inventorius ir atsakomybės
- [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) – golden standard (struktūra, ID, JS API, CMO v2, checklist)
- [STYLEGUIDE.md](STYLEGUIDE.md) – dizaino sistema **1.6** (Product Operator)
- [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) – EN kanonas, LT freeze ([§0](docs/MULTILINGUAL_STRUCTURE.md))
- [docs/BULLET_PROOF_PROMPTS.md](docs/BULLET_PROOF_PROMPTS.md) – promptų META/INPUT/OUTPUT standartas
- [docs/PEDAGOGINES_SPECIFIKACIJA.md](docs/PEDAGOGINES_SPECIFIKACIJA.md) – pedagogika ir auditorija
- [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) – QA standartas (nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01))
- [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) – gyvas testavimas ir žurnalas
- [DEPLOYMENT.md](DEPLOYMENT.md) – primary (Vercel) + mirror (GitHub Pages), BASE_PATH, post-deploy
- [CHANGELOG.md](CHANGELOG.md) – versijų istorija (Keep a Changelog, SemVer)

---

## 9. Užduočių seka ir golden standard

Keičiant **turinį** – atsakingas Content Agent; keičiant **struktūrą arba JS** – reikia QA patvirtinimo, kad nepažeidžiamas golden standard (arba [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) atnaujinamas sąmoningai).

| Etapas | Agentas | Užduotis | Įvestis | Išvestis |
|--------|---------|----------|---------|----------|
| 1 | **Orchestrator** | Prioritizuoja užduotį, nustato scope | [roadmap.md](roadmap.md), [todo.md](todo.md), [CHANGELOG.md](CHANGELOG.md) | Užduočių eilė pagal R1–R4 |
| 2 | **Curriculum** | Nustato spine/teaser ribą, seka, mokymosi tikslus | Scope; `freeInteractive` registry | Specifikacija: ką keisti free vs Pro |
| 3 | **Content** | Redaguoja turinį **EN kanonui** (`data/en-*.json`, teaser copy, EN build, JTBD FAQ/meta); **privalo laikytis** LEGACY + PRODUCT-POSITIONING §4. **LT nekeičia** be snapshot refresh | Specifikacija | EN tekstai; `frontFaq` ↔ visible FAQ ↔ `applyStaticLocaleText`; nekeičia spine ID kontrakto |
| 4 | **UI/UX** | Spine-first hero, DS **1.6** Product Operator ([STYLEGUIDE.md](STYLEGUIDE.md)), brief after spine, teaser UI, a11y – ne META bodies; **nekuria** naujų SEO hub route'ų be Curriculum/Orchestrator | Reikalavimai; LEGACY; STYLEGUIDE 1.6 | CSS/HTML; 0 meme slots; hero diagram; surfaces page/panel/accent |
| 5 | **Commerce** | Mokama PDF tarpinė: `docs/pdf-source/*.html`, [`config/sot.json`](config/sot.json), fulfillment, kainos. Tik EN, `promptanatomy.space`. Free copy: spine ≠ full 10 interactive | Stripe / Resend / Blob (žr. [memo_pdf.md §8](memo_pdf.md)) | SOT + PDF + storefront; SOT `comparisonTable` unused on page |
| 6 | **QA** | `npm test`, `test:fulfillment-config`, `test:e2e`, pa11y; diff vs LEGACY. **Free surface:** spine copy×4 contiguous; order safety → brief → scenarios → `#pro-contents` → storefront → FAQ → basics; progress of 4; 0 memes; 0 `.prompt--teaser`. **GEO:** `frontFaq >= 8`, `llms.txt` hubs, no free-10 claim. **Commerce:** (a) LT be kainų/storefront/Stripe; (b) MIRROR_NOTE=1 be storefront; (c) `assertNoPaidPdfsLeaked()`. | Diff, LEGACY, docs | pass / grąžinti |

---

## 10. Lessons (operacinės) – EN free surface + GEO messaging

1. **Ne free = interactive 10.** Full META bodies lieka Pro/PDF; free rodo spine + `#pro-contents` catalog. GEO/`llms-full` digest ≠ „free interactive 10“.
2. **Spine → safety → brief → catalog.** Contiguous 1→2→3→5, then thin `#cmo-safety`, EN `#creative-brief` (collapsed builder), `#cmo-scenarios`, then `#pro-contents` (4/6–10 catalog, not faux prompt cards); hero primary = `#heroCtaSpine` → `#block1` (EN). Brief = secondary JTBD (image), not the default path.
3. **Memes – ne produkto UI.** Assetai OK social; gyvoje `/en/` – 0 `meme-slot-*`.
4. **Progress = spine count.** Tik checkbox 1/2/3/5; `aria-valuemax="4"`.
5. **LT freeze + brief strip.** Build pašalina `#creative-brief`, `#heroCtaBrief`, `#progressJumpCreative`; `#heroCtaSpine` lieka primary.
6. **Repo-local Cursor skills nėra** – rolės/kontraktai: šis failas + [AGENT_SOT.md](docs/AGENT_SOT.md) + LEGACY + PRODUCT-POSITIONING; globalūs skills negali laužyti `npm test` / LEGACY. JTBD/GEO copy **ne** reikalauja naujo skill failo.
7. **Distance to first Copy > storefront polish.** Funnel drop risk is path conflict + pre-value wall, not Stripe card art. Keep hero → Prompt 1 Copy short; do not re-insert brief/teasers/cycle-stepper/provider hub before spine without Curriculum + LEGACY + `tests/structure.test.js`. Cut > add on `/en/` chrome.
8. **No Pro catalog inside the spine.** Prompt 4 must not sit between 3 and 5. Upgrade interrupt only after contiguous Plan→Create→Check→Improve (1/2/3/5) plus free-loop safety (and brief on EN). Pro list is one destination (`#pro-contents`), not six fake `.prompt` cards.
9. **EN strings need build pairs + runtime sync.** Root is LT-sourced; `applyCollapsibleSummaries` is a no-op. Never leave LT `#prompt-desc-*` / claims on EN — add explicit EN replace pairs. FAQ/hero JTBD also lives in root `applyStaticLocaleText` EN arrays — update those with inject/`EN_REPLACEMENTS` or EN page load overwrites HTML.
10. **One primary path.** Dual equal CTAs (image brief vs spine) confuse. Spine primary (`Start your first workflow` → `#block1`) + brief secondary; claims must match free surface (4 workflows + brief, not “100 assets / 45 min”).
11. **JTBD language ≠ product rename.** Harvest search-intent phrases (workflow, content OS, brand guardrails, structured prompting) into SOT/`brand-seo`/FAQ. Public name stays **Content AI System**. Do not lead with “AI Marketing Operating System,” “PDF kit,” agents, or invented ROI/stack stats ([PRODUCT-POSITIONING.md](docs/PRODUCT-POSITIONING.md) §4).
12. **GEO on one URL.** Prefer `llms.txt` hash hubs + richer `frontFaq`/JSON-LD over new `/en/ai-marketing-*` landing farms. Multi-page SEO hubs need Orchestrator + Curriculum scope and must not lengthen path to first Copy.
13. **FAQ triple sync.** Changing EN FAQ means all of: (a) `config/sot.json` → `frontFaq` (JSON-LD), (b) build inject / `EN_REPLACEMENTS`, (c) `index.html` `applyStaticLocaleText` FAQ arrays. Miss one → runtime or schema drift.
14. **Ship cash before platform.** Ambition **A** (R1 go-live) before deep **B** tool suites, Ambition **F** (SaaS), or **D** (new vertical kits). Sequence: A → E → light B → C ([roadmap.md](roadmap.md)). Do not confuse with §0.1 free-surface “Phase A”.
15. **Collapse secondary tools.** Creative brief stays after safety but default = teaser + `#cb-builder` closed; image tools = ChatGPT + Ideogram only. Storefront keeps 3 SKU cards; do not render comparison table on page (`comparisonTable` may remain in SOT unused).
16. **Audit P ≠ roadmap R.** UX Conversion Audit **P0–P3** is not Ambition **R1–R4**. Shipped P0/P1 = **R1-support** (parallel `/en/` conversion; does **not** exit R1). Audit P3 live drills = the same R1 Stripe boxes in [todo.md](todo.md) / [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md). Rejected audit asks stay rejected unless Orchestrator rewrites §0.1 / §10.7 / §10.15 + LEGACY (open `#cb-builder`, render `comparisonTable`, fat before/after diagram, dual-primary CTA).
17. **Offer math must agree on the card.** Bundle `compareAtUsd` = Starter + Pro (`3.99 + 8.99 = 12.98`). Build renders bundle as `separately $…`, not `was $…`. Never ship a bullet that says `$12.98` while the price line says `was $19.99`. Stripe `priceUsd` / Payment Links stay unchanged unless Commerce opens a price PR.
18. **Footer entity ≠ checkout.** EN `.footer-product-link` = `Part of Prompt Anatomy · Methodology at promptanatomy.app` ([BRAND_SYNC.md](docs/BRAND_SYNC.md), [language-guidelines-en-lt.md](docs/language-guidelines-en-lt.md)). Checkout is `buy.stripe.com` on `promptanatomy.space`. Do not restore “Training & checkout → .app” — that re-teaches the visitor that purchase lives elsewhere.
19. **Gold is surface, not text.** STYLEGUIDE **1.6**: gold ≈ CTA fill, selected/focus ring, left-edge / border accents. Link and body `color` = `--color-text-primary` (ink). Gold-on-light as link text fails WCAG AA (~2.17:1). Do not treat this as Audit P2 (full inline-`<style>` deletion) — that stays parked with template migration.
20. **Ecosystem demotion.** `#ecosystem-strip` / footer sister links are methodology + community. Leader and other kits stay quiet related lines, not equal CTAs next to Pricing. Intro copy may state that checkout stays on this page.

---

**Paskutinis atnaujinimas:** 2026-09-03 (v1.5.4 – R1-support closeout lessons §10.16–20)
