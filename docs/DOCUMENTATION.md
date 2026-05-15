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
| **LT/EN** | [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) | Keliai, kalbos jungiklis, sinchronizacija su build |
| **Dizainas** | [STYLEGUIDE.md](../STYLEGUIDE.md) | Spalvos, tipografija, komponentai |
| **Kokybė** | [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) | QA kriterijai, komandos (`npm test`, pa11y) |
| **Testavimas** | [docs/TESTAVIMAS.md](TESTAVIMAS.md) | Gyvo testavimo scenarijai ir žurnalas |
| **Taisyklės** | [.cursorrules](../.cursorrules) | Kokybė, a11y, commit formatas |
| **Versijos** | [CHANGELOG.md](../CHANGELOG.md) | Pakeitimų istorija (Keep a Changelog, SemVer) |

---

## 1. Dokumentų inventorius ir atsakomybės

### Dokumentai (Markdown)

| Dokumentas | Paskirtis | Atsakingas agentas | Kada atnaujinti |
|------------|-----------|--------------------|-----------------|
| [docs/INDEX.md](INDEX.md) | Dokumentacijos navigacija (rolės, užduotys, kodas ↔ docs) | Orchestrator / QA | Nauji docs failai, pasikeitus pipeline ar agentų modeliui |
| [README.md](../README.md) | Apžvalga, naudojimas, struktūra | Content / Orchestrator | Naujos funkcijos, deployment, struktūros pakeitimai |
| [AGENTS.md](../AGENTS.md) | Agentų rolės, workflow, commit prefiksai | Orchestrator | Workflow / rolės pakeitimai |
| [.cursorrules](../.cursorrules) | Kokybė, a11y, dokumentacijos taisyklės | QA + Orchestrator | Taisyklių pakeitimai, nauji reikalavimai |
| [CHANGELOG.md](../CHANGELOG.md) | Versijų pakeitimų istorija (Keep a Changelog, SemVer) | Kiekvienas (pagal pakeitimą) | Kiekvienas release ir reikšmingi pakeitimai |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | Primary (Vercel) + mirror (GitHub Pages), BASE_PATH, troubleshooting | QA / Orchestrator | Platforma, URL, post-deploy |
| [STYLEGUIDE.md](../STYLEGUIDE.md) | Spalvų paletė, komponentai, tipografija | UI/UX | Dizaino pakeitimai, tokenų atnaujinimai |
| [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) | Atskaitos kontraktas (HTML/JS struktūra, CMO v2, BASE_PATH) | QA / Orchestrator | Struktūros pakeitimai, CMO v2 plėtra |
| [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) | LT/EN path atitikmenys ir sinchronizacija | Curriculum / QA | Locale routing, `EN_REPLACEMENTS`, hreflang |
| [docs/BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md) | Promptų kokybės standartas (META/INPUT/OUTPUT) | Content | Promptų šablonų keitimai |
| [docs/PEDAGOGINES_SPECIFIKACIJA.md](PEDAGOGINES_SPECIFIKACIJA.md) | Pedagoginiai tikslai, auditorija, terminologija | Curriculum / Content | Kriterijų ar terminologijos pakeitimai |
| [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) | QA standartas (nuoroda spinoff01) | QA | Kriterijai, komandos |
| [docs/TESTAVIMAS.md](TESTAVIMAS.md) | Gyvo testavimo scenarijai ir žurnalas | QA | Po deploy testavimas, rezultatai |
| [.github/PULL_REQUEST_TEMPLATE.md](../.github/PULL_REQUEST_TEMPLATE.md) | PR šablonas | Orchestrator / QA | Checklist pakeitimai |

### Privatumo puslapiai

| Failas | Paskirtis | Atsakingas | Kada atnaujinti |
|--------|-----------|------------|------------------|
| `lt/privatumas.html`, `en/privacy.html` | Privatumo politika (kanonas) | Content (juridinė peržiūra atskirai) | GDPR pokyčiai (kai bus rinkimas, dabar – tik aprašymas, kad duomenys nerinkimi) |
| `privatumas.html` (root) | Legacy backward compat | (laikomas dėl backlinks) | Tik tekstas (struktūra/JS – fiksuota Legacy §6) |

### Kodas, build ir testai

| Failas / katalogas | Paskirtis | Atsakingas | Kada atnaujinti |
|--------------------|-----------|------------|-----------------|
| [index.html](../index.html) | Pagrindinis UI šaltinis (LT bazė) + „upgrade-only“ aiškinamasis sluoksnis + 10 promptų branduolys | Content + UI/UX + QA | Vartotojui matomas turinys, edukaciniai blokai, promptų sekcijos |
| [data/en-prompt-bodies.json](../data/en-prompt-bodies.json) | 10 EN META eilučių (`<pre>` turiniui) | Content | Keičiant EN promptų tekstą |
| [data/en-prompt-expected.json](../data/en-prompt-expected.json), [data/lt-prompt-expected.json](../data/lt-prompt-expected.json) | „Expected output“ bullet'ai kiekvienam promptui | Content / Curriculum | Pridedant / keičiant tikėtinus rezultatus |
| [data/en-scenarios.json](../data/en-scenarios.json), [data/lt-scenarios.json](../data/lt-scenarios.json) | CMO v2 „Clarity practice“ scenarijų skirtukai | Content / Curriculum | Scenarijų pakeitimai |
| [data/](../data/) `meme-*.(png\|webp)` (6 meme paveikslai) | Meme slot 1–6 binariniai šaltiniai | UI/UX | Meme atnaujinimas |
| [styles/design-tokens.json](../styles/design-tokens.json) | Dizaino tokenų vienas šaltinis | UI/UX + QA | Keičiant semantinius tokenus |
| [styles/tokens.css](../styles/tokens.css), [styles/components.css](../styles/components.css), [styles/utilities.css](../styles/utilities.css) | CSS sluoksniai (tokenai, komponentai, utility) | UI/UX | Keičiant komponentų vizualiką ar būsenas |
| [scripts/build-locale-pages.js](../scripts/build-locale-pages.js) | Generuoja lt/en + inject CMO v2 blokus + EN_REPLACEMENTS | QA / Orchestrator | LT/EN replace sąrašas, BASE_PATH, canonical/hreflang, CMO v2 inject |
| [scripts/generate-og.js](../scripts/generate-og.js) | OG paveikslo (1200×630, SVG → PNG) generavimas | UI/UX + QA | Keičiant OG maketą; po pakeitimo `tests/structure.test.js` OG kontraktai |
| [scripts/vercel-export-public.js](../scripts/vercel-export-public.js) | Vercel statinio output kopijavimas į `public/` + analytics inject | QA / Orchestrator | Keičiant Vercel deploy artefakto sudėtį |
| [lt/index.html](../lt/index.html), [en/index.html](../en/index.html) | Generuojami locale puslapiai | (build output) | Po kiekvieno `npm run build` |
| [js/en-prompt-bodies-inline.js](../js/en-prompt-bodies-inline.js) | Generuojamas iš `data/en-prompt-bodies.json` | (build output) | Po `npm run build` |
| [public/](../public/) | Vercel deploy artefaktas (gitignored) | (build output) | Po `npm run build` |
| [og.png](../og.png) | OG/Twitter preview (1200×630) | UI/UX (per generate-og) | `npm run build` arba `npm run generate:og` |
| [robots.txt](../robots.txt), [sitemap.xml](../sitemap.xml) | SEO crawler signalai | QA | Naujos sekcijos / lokelės |
| [favicon.svg](../favicon.svg) | Favicon | UI/UX | Brand atnaujinimas |
| [tests/structure.test.js](../tests/structure.test.js) | Struktūriniai testai (96+ teiginiai, įskaitant CMO v2) | QA | Pridedant naujus kontraktus |
| [tests/design-system-smoke.test.js](../tests/design-system-smoke.test.js) | Dizaino sistemos smoke (tokenai, selektoriai) | QA | Keičiant CSS sluoksnius ar tokenų struktūrą |
| [tests/a11y-smoke.test.js](../tests/a11y-smoke.test.js) | A11y smoke (skip-link, focus-visible, reduced-motion, aria-label) | QA | Keičiant interaktyvius elementus ar a11y taisykles |
| [.github/workflows/ci.yml](../.github/workflows/ci.yml) | CI – npm test + pa11y į /lt/, /en/, privacy | QA / Orchestrator | Nauji testai, lint, a11y URL |
| [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) | GitHub Pages deploy (mirror) | QA / Orchestrator | Deploy žingsniai, environment, BASE_PATH |

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
