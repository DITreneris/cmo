# Agentų Sistemos Modelis – Apžvalga

**Projektas:** DI Promptų Biblioteka (Turinio DI sistema – CMO rinkinys)  
**Šio dokumento versija:** 1.1 (sinchronizuota su repo pipeline ir `docs/LEGACY_GOLDEN_STANDARD.md`)  
**Kalba:** LT

---

## 1. Architektūra

```
ORCHESTRATOR AGENT (koordinacija)
    ├── Content Agent      (promptai, tekstai)
    ├── Curriculum Agent   (struktūra, logika, seka)
    ├── UI/UX Agent        (dizainas, a11y, UX)
    ├── QA Agent           (kodas + turinys)
    └── Feedback Store     (duomenys, metrikos)
            │
            └── GitHub / Version Control
```

---

## 2. Agentų rolės

### Content Agent
- **Tikslas:** Kuria ir prižiūri teksto turinį (promptus, aprašymus)
- **Įvestis:** Specifikacija, grįžtamasis ryšys, Curriculum rekomendacijos
- **Išvestis:** Turinio redagavimai, nauji promptai

### Curriculum Agent
- **Tikslas:** Nustato turinio struktūrą ir mokymosi logiką
- **Įvestis:** Tikslai, auditorija, [docs/PEDAGOGINES_SPECIFIKACIJA.md](docs/PEDAGOGINES_SPECIFIKACIJA.md), [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md), [CHANGELOG.md](CHANGELOG.md) (naujausi scope); `MVP_ROADMAP.md` – tik *historical* kontekstui
- **Išvestis:** Promptų seka, priklausomybių modelis, LT/EN atitikmenų reikalavimai

### UI/UX & Usability Agent
- **Tikslas:** Sąsajos kokybė, prieinamumas, vartotojo patirtis
- **Įvestis:** .cursorrules, WCAG AA, sesijų duomenys
- **Išvestis:** UI pakeitimai, CSS/HTML optimizacijos, a11y patikros

### QA Agent
- **Tikslas:** Tikrina kokybę – kodas ir turinys
- **Įvestis:** Pakeitimų diff, [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) (struktūros kontraktas), `npm test` / `tests/*.test.js`, [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md); `MUST_TODO.md` – tik jei liečia aktyvų scope (dokumentas *historical*)
- **Išvestis:** Klaidų ataskaitos, acceptance checklist
- **Dokumentacija:** Prieš merge tikrina, ar pakeitimams atitinka dokumentacijos atnaujinimai (žr. [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)). Prieš release – ar CHANGELOG.md atnaujintas ir `package.json` versija atitinka SemVer.

### Orchestrator Agent
- **Tikslas:** Koordinuoja agentus, prioritizuoja užduotis
- **Įvestis:** Verslo užduotys, Feedback Store metrikos
- **Išvestis:** Užduočių eilės, prioritetų planas

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

- `[Content]` – turinio pakeitimai
- `[Curriculum]` – struktūros/sekos pakeitimai
- `[UI]` – dizainas, UX, a11y
- `[QA]` – testai, validacija, fix'ai
- `[Orchestrator]` – koordinacija, konfigūracija

---

## 6. Komandos (vykdomos prieš merge / lokaliai)

| Komanda | Paskirtis |
|---------|-----------|
| `npm install` | Įdiegti priklausomybes |
| `npm test` | Build (`lt/en`) + struktūra + design-system smoke + a11y smoke + lint (HTML, JS) |
| `npm run lint:html` | HTML validacija (`index.html`, `lt/index.html`, `lt/privatumas.html`, `en/index.html`, `en/privacy.html`) |
| `npm run lint:js` | ESLint visiems .js failams |
| CI (GitHub Actions) | Lint, test, pa11y a11y – automatiškai push/PR |

Prieš PR įsitikinti, kad `npm test` praeina. A11y tikrinimas – per CI arba lokaliai: `npx serve -s . -l 3000` ir `npx pa11y` į `/lt/` bei `/en/` (žr. [README.md](README.md), [.github/workflows/ci.yml](.github/workflows/ci.yml)).

---

## 7. Release seka

1. Orchestrator → Curriculum: release scope ([CHANGELOG.md](CHANGELOG.md), aktyvūs PR tikslai; `MUST_TODO` / `MVP_ROADMAP` – historical).
2. Orchestrator → Content / UI/UX: reikiai (jei yra).
3. Orchestrator → QA: release validacija.
4. QA: `npm test`, CHANGELOG atnaujintas (SemVer), rankinis QA (naršyklės, mobilus, kopijavimas, a11y).
5. QA pass → tag (pvz. `v1.x.0`), deploy. QA fail → grąžinti Content/UI.

---

## 8. Susiję dokumentai

- [docs/INDEX.md](docs/INDEX.md) – **indeksas**: rolės, užduotys, kodas ↔ dokumentai
- [.cursorrules](.cursorrules) – Cursor: saugumas, kokybė, dokumentacija, commit formatas
- [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) – dokumentų inventorius ir atsakomybės
- [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) – golden standard (struktūra, ID, JS API, checklist)
- [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) – LT/EN keliai ir build sinchronizacija
- [docs/BULLET_PROOF_PROMPTS.md](docs/BULLET_PROOF_PROMPTS.md) – promptų META/INPUT/OUTPUT standartas
- [docs/PEDAGOGINES_SPECIFIKACIJA.md](docs/PEDAGOGINES_SPECIFIKACIJA.md) – pedagogika ir auditorija
- [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) – QA standartas (nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01))
- [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) – gyvas testavimas ir žurnalas
- [DEPLOYMENT.md](DEPLOYMENT.md) – GitHub Pages, BASE_PATH, post-deploy
- [CHANGELOG.md](CHANGELOG.md) – versijų istorija (Keep a Changelog, SemVer)
- [MUST_TODO.md](MUST_TODO.md), [MVP_ROADMAP.md](MVP_ROADMAP.md) – *historical* planai (kontekstas, ne vienintelis scope šaltinis)
- [feedback-schema.md](feedback-schema.md) – Feedback Store schema

---

## 9. Užduočių seka ir golden standard

Keičiant **turinį** – atsakingas Content Agent; keičiant **struktūrą arba JS** – reikia QA patvirtinimo, kad nepažeidžiamas golden standard (arba [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) atnaujinamas sąmoningai).

| Etapas | Agentas | Užduotis | Įvestis | Išvestis |
|--------|---------|----------|---------|----------|
| 1 | **Orchestrator** | Prioritizuoja užduotį, nustato scope | Verslo užduotis, MUST_TODO | Užduočių eilė, prioritetai |
| 2 | **Curriculum** | Nustato promptų seką, priklausomybes, mokymosi tikslus | Scope iš Orchestrator | Specifikacija: ką keisti, kokia seka |
| 3 | **Content** | Redaguoja tik turinį (promptai, antraštės, aprašymai, info boksai); **privalo laikytis** [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) | Specifikacija | Pakeisti tekstai; nekeičia id/klasės/JS |
| 4 | **UI/UX** | Keičia tik išvaizdą/a11y (CSS, ARIA, layout) – ne promptų teksto | Reikalavimai; golden standard struktūra | CSS/HTML pakeitimai, a11y patikros |
| 5 | **QA** | Vykdo `npm test`, pa11y (CI), dokumentacijos atitikimą; prieš merge – diff vs [LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) | Pakeitimų diff, LEGACY, docs/DOCUMENTATION.md | Ataskaita: pass / grąžinti Content/UI |

---

**Paskutinis atnaujinimas:** 2026-04-30
