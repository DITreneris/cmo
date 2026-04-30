# Dokumentų valdymas

**Tikslas:** Dokumentų atnaujinimo, versijavimo ir archyvavimo tvarka. Taisyklės: [.cursorrules](../.cursorrules), [AGENTS.md](../AGENTS.md).

**Įėjimo taškas (indeksas):** [docs/INDEX.md](INDEX.md) – navigacija pagal rolę ir užduotį.

---

## 0. Greita schema – kas kur ir kam

| Sritis | Dokumentas | Kam skirta |
|--------|------------|------------|
| **Indeksas** | [docs/INDEX.md](INDEX.md) | Visi agentai ir žmonės: kur skaityti pirmiausia |
| **Verslas ir procesai** | [AGENTS.md](../AGENTS.md) | Agentų rolės, workflow (Content, Curriculum, UI/UX, QA, Orchestrator) |
| **Kodas ir turinys** | [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) | Ką galima keisti keičiant turinį; HTML/JS struktūra |
| **LT/EN** | [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) | Keliai, kalbos jungiklis, sinchronizacija su build |
| **Dizainas** | [STYLEGUIDE.md](../STYLEGUIDE.md) | Spalvos, tipografija, komponentai |
| **Kokybė** | [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) | QA kriterijai, komandos (`npm test`, pa11y) |
| **Testavimas** | [docs/TESTAVIMAS.md](TESTAVIMAS.md) | Gyvo testavimo scenarijai ir žurnalas |
| **Taisyklės** | [.cursorrules](../.cursorrules) | Saugumas, kokybė, commit formatas |
| **Versijos** | [CHANGELOG.md](../CHANGELOG.md) | Pakeitimų istorija (Keep a Changelog, SemVer) |

---

## 1. Dokumentų inventorius ir atsakomybės

| Dokumentas | Paskirtis | Atsakingas agentas / tipas | Kada atnaujinti |
|------------|-----------|----------------------------|------------------|
| docs/INDEX.md | Dokumentacijos navigacija (rolės, užduotys, kodas ↔ docs) | Orchestrator / QA | Nauji docs failai, pasikeitus pipeline ar agentų modeliui |
| README.md | Apžvalga, naudojimas, struktūra | Content / Orchestrator | Naujos funkcijos, deployment, struktūros pakeitimai |
| AGENTS.md | Agentų rolės, workflow, commit prefiksai | Orchestrator | Workflow / rolės pakeitimai |
| .cursorrules | Saugumas, kokybė, dokumentacijos taisyklės | QA + Orchestrator | Taisyklų pakeitimai, nauji reikalavimai |
| CHANGELOG.md | Versijų pakeitimų istorija | Kiekvienas (pagal pakeitimą) | Kiekvienas release ir reikšmingi pakeitimai |
| MUST_TODO.md | MVP kritinės užduotys | Orchestrator / Curriculum | Užduočių atnaujinimas, nauji P0 |
| MVP_ROADMAP.md | Roadmap, tikslai | Curriculum / Orchestrator | Etapų pasikeitimas, prioritetai |
| INTEGRACIJA.md | Google Sheets, formos | Content / QA | Integracijos žingsniai, konfigūracija |
| feedback-schema.md | Feedback Store schema | Orchestrator | Schema pakeitimai |
| lt/privatumas.html, en/privacy.html | Privatumo politika (LT/EN) | Content (juridinė peržiūra atskirai) | Duomenų rinkimo pakeitimai, GDPR |
| .github/PULL_REQUEST_TEMPLATE.md | PR šablonas | Orchestrator / QA | Checklist pakeitimai |
| .github/workflows/ci.yml | CI | QA / Orchestrator | Nauji testai, lint, a11y |
| .github/workflows/deploy.yml | GitHub Pages deploy | QA / Orchestrator | Deploy žingsniai, environment |
| index.html | Pagrindinis UI ir „upgrade-only“ aiškinamasis sluoksnis (`#what-is-prompt`, `#prompt-anatomy`, `#framework-schema`, `#faq`) + 10 promptų branduolys | Content + UI/UX + QA | Keičiant vartotojui matomą turinį, naujus edukacinius blokus ar promptų sekcijas |
| styles/design-tokens.json | Dizaino tokenų vienas šaltinis (spalvos, spacing, radius, focus, motion) | UI/UX + QA | Keičiant dizaino sistemos semantinius tokenus |
| styles/tokens.css, styles/components.css, styles/utilities.css | Dizaino sistemos CSS sluoksniai (tokenai, komponentai, utility) | UI/UX | Keičiant komponentų vizualiką ar būsenas |
| scripts/build-locale-pages.js | Generuoja lt/index.html ir en/index.html iš root index.html | QA / Orchestrator | LT/EN replace sąrašas, BASE_PATH, canonical/hreflang |
| lt/index.html, en/index.html | Generuojami locale puslapiai (path-based) | (build output) | Po kiekvieno `npm run build`; deploy reikalauja build prieš upload |
| tests/design-system-smoke.test.js | Dizaino sistemos smoke testas (importai, tokenai, būtinieji selektoriai) | QA | Keičiant CSS sluoksnius arba tokenų struktūrą |
| tests/a11y-smoke.test.js | A11y smoke testas (skip-link, focus-visible, reduced-motion, aria-label) | QA | Keičiant interaktyvius elementus ar a11y taisykles |
| DEPLOYMENT.md | Deploy instrukcijos, troubleshooting | QA / Orchestrator | Platforma, URL, post-deploy |
| docs/QA_STANDARTAS.md | QA standartas (nuoroda spinoff01) | QA | Kriterijai, komandos, spinoff01 |
| docs/TESTAVIMAS.md | Gyvo testavimo scenarijai ir žurnalas | QA | Po deploy testavimas, rezultatai |
| docs/LEGACY_GOLDEN_STANDARD.md | Atskaitos kodas ir taisyklės keičiant turinį | QA / Orchestrator | Golden standard atnaujinimas, struktūros pakeitimai |
| docs/MULTILINGUAL_STRUCTURE.md | LT/EN path atitikmenys ir sinchronizacija | Curriculum / QA | Locale routing, `EN_REPLACEMENTS`, hreflang |
| docs/BULLET_PROOF_PROMPTS.md | Promptų kokybės standartas (META/INPUT/OUTPUT) | Content | Promptų šablonų keitimai |
| docs/PEDAGOGINES_SPECIFIKACIJA.md | Pedagoginiai tikslai, auditorija, terminologija, paprasta kalba | Curriculum / Content | Kriterijų ar terminologijos pakeitimai |

---

## 2. Kada ką atnaujinti

- **Kodas keičiamas** → atnaujinti susijusią dokumentaciją (README, INTEGRACIJA ir pan.). Žr. [.cursorrules](../.cursorrules) skyrių „Dokumentacijos valdymas“.
- **Release / deploy** → prieš deploy paleisti `npm run build`, kad būtų sugeneruoti atnaujinti `lt/` ir `en/` failai. Būtina atnaujinti CHANGELOG: sekciją „Nereleisuota“ perkelti į naują versiją `## [X.Y.Z] - YYYY-MM-DD`. Versijavimas – [Semantic Versioning](https://semver.org/).
- **PR:** prieš merge patikrinti, ar „Susiję dokumentai“ (PR šablone) atnaujinti; jei release – ar CHANGELOG ir versija nurodyta.

---

## 3. CHANGELOG ir release taisyklė

- **Formatas:** [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) – sekcijos: Prideta, Pakeista, Taisyta, Pašalinta, Deprecated, Saugumas. Datos – **YYYY-MM-DD** (ISO 8601).
- **Release** = Git tag (pvz. `v1.0.0`) + CHANGELOG atnaujinimas („Nereleisuota“ → `[X.Y.Z] - data`).
- Prieš release QA Agent tikrina: ar CHANGELOG atnaujintas ir ar versija atitinka pakeitimus (SemVer).

---

## 4. Archyvavimo politika

- **Versijavimas:** Dokumentai versijuojami per **Git** (istorija = audit trail).
- **Archyvas:** Istoriniai šablonai laikomi Git istorijoje; atskiro `docs/archive/` katalogo šiuo metu nenaudojame.
- **Retention:** Automatinio dokumentų trynimo nenaudoti; archyve laikyti pagal poreikį (auditas, istorija).

---

## 5. QA checklist – dokumentacija

Prieš merge / release:

- [ ] Ar pakeitimams atitinka dokumentacijos atnaujinimai (pagal lentelę skyriuje 1)?
- [ ] Jei release – ar CHANGELOG.md atnaujintas ir versija nurodyta (SemVer)?

Žr. [AGENTS.md](../AGENTS.md) QA Agent aprašymui, [docs/QA_STANDARTAS.md](QA_STANDARTAS.md) (nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)), [docs/TESTAVIMAS.md](TESTAVIMAS.md) gyvam testavimui.
