# Dokumentacijos indeksas – DI Promptų Biblioteka

**Paskirtis:** Vienas įėjimo taškas žmonėms ir AI agentams – ką skaityti pirmiausia pagal rolę ar užduotį. Kanoniniai kodas ir ribos: [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) + `npm test`.

**Paskutinis atnaujinimas:** 2026-05-15

---

## 1. Pradžia per 2 minutes

| Jei tu… | Atidaryk |
|---------|----------|
| Naujas projekte | [README.md](../README.md) → tada šį indeksą |
| AI agentas (Cursor ir kt.) | [.cursorrules](../.cursorrules) + [AGENTS.md](../AGENTS.md) + [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) |
| Keiti tik lietuviškus / angliškus tekstus | [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) (kas leidžiama) + [`BULLET_PROOF_PROMPTS.md`](BULLET_PROOF_PROMPTS.md) |
| Keiti EN promptų `<pre>` turinį | [`../data/en-prompt-bodies.json`](../data/en-prompt-bodies.json) → `npm run build` |
| Keiti LT/EN kelius ar build | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) + [`../scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) |
| Keiti CMO v2 (kontekstas, scenarijai, safety) | [`../data/*.json`](../data/) + [`../scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) |
| Release / deploy | [CHANGELOG.md](../CHANGELOG.md) + [DEPLOYMENT.md](../DEPLOYMENT.md) + `npm test` |

---

## 2. Pagal agento rolę (AGENTS.md modelis)

| Agentas | Pagrindiniai dokumentai | Kodas / artefaktai |
|---------|-------------------------|--------------------|
| **Orchestrator** | [AGENTS.md](../AGENTS.md), [DOCUMENTATION.md](DOCUMENTATION.md), [CHANGELOG.md](../CHANGELOG.md) | Prioritetai, scope |
| **Curriculum** | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md), [`PEDAGOGINES_SPECIFIKACIJA.md`](PEDAGOGINES_SPECIFIKACIJA.md) | Seka 1–10, locale atitikmenys |
| **Content** | [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md), [`BULLET_PROOF_PROMPTS.md`](BULLET_PROOF_PROMPTS.md), [`PEDAGOGINES_SPECIFIKACIJA.md`](PEDAGOGINES_SPECIFIKACIJA.md) | [`../index.html`](../index.html) (LT bazė), [`../data/*.json`](../data/), po pakeitimų `npm run build` |
| **UI/UX** | [STYLEGUIDE.md](../STYLEGUIDE.md), [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) (struktūra / a11y) | `styles/*.css`, `styles/design-tokens.json`, [`../index.html`](../index.html) |
| **QA** | [docs/QA_STANDARTAS.md](QA_STANDARTAS.md), [docs/TESTAVIMAS.md](TESTAVIMAS.md), [DOCUMENTATION.md](DOCUMENTATION.md) | `npm test`, `tests/*.test.js`, [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) |

---

## 3. Pagal užduotį (užduočių žemėlapis)

| Užduotis | Žingsniai |
|----------|-----------|
| Pakeisti prompto tekstą (LT) | Tik leidžiami laukai pagal **Legacy**; META/INPUT/OUTPUT – **Bullet proof**; nekeisti `id` / `data-*` / JS. `<pre id="promptN">` LT root + EN per `data/en-prompt-bodies.json`. |
| Pakeisti CMO v2 konteksto / scenarijų / safety bloką | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) §4; redaguoti [`../data/*.json`](../data/) + [`../scripts/build-locale-pages.js`](../scripts/build-locale-pages.js); `npm run build`. |
| Pakeisti EN UI tekstus | [`../scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) `EN_REPLACEMENTS` + `applyStaticLocaleText` `index.html`'e. |
| Pakeisti dizainą | STYLEGUIDE + tokenai; po pakeitimų `npm test` (design-system + a11y smoke). |
| Pakeisti struktūrą (nauja sekcija, JS API) | QA + sąmoningas **Legacy** atnaujinimas; išplėsti `tests/structure.test.js` jei reikia kontrakto. |

---

## 4. Kodas ↔ dokumentai (faktinis pipeline)

```
index.html (LT bazė) + data/*.json
    → npm run build
       1. scripts/generate-og.js → og.png (1200×630 SVG → PNG)
       2. scripts/build-locale-pages.js → lt/index.html, en/index.html, js/en-prompt-bodies-inline.js
          (inject CMO v2 blokus: cmo-context, prompt-expected×10, cmo-safety, cmo-scenarios, __CMO_COMPILE)
       3. scripts/vercel-export-public.js → public/ (Vercel deploy artefaktas)
    → npm test (structure + design-system + a11y smoke + lint:html + lint:js)
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

| Dokumentas | Trumpai |
|------------|---------|
| **INDEX.md** (šis failas) | Navigacija |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Inventorius, atsakomybės, release/docs taisyklės |
| [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) | Golden standard: ID, JS API, CMO v2 kontraktas, checklist |
| [MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) | LT/EN keliai, sinchronizacija, build |
| [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md) | Promptų META/INPUT/OUTPUT standartas |
| [PEDAGOGINES_SPECIFIKACIJA.md](PEDAGOGINES_SPECIFIKACIJA.md) | Auditorija, tonas, seka 1–10 |
| [QA_STANDARTAS.md](QA_STANDARTAS.md) | QA kriterijai, nuoroda į spinoff01 |
| [TESTAVIMAS.md](TESTAVIMAS.md) | Gyvas testavimas po deploy |

---

## 6. Root ir kiti svarbūs failai (ne `docs/`)

| Failas | Paskirtis |
|--------|-----------|
| [README.md](../README.md) | Produktas, naudojimas, repo medis |
| [AGENTS.md](../AGENTS.md) | Agentų rolės, workflow, komandos |
| [.cursorrules](../.cursorrules) | Cursor: kokybė, a11y, docs, commit |
| [CHANGELOG.md](../CHANGELOG.md) | SemVer istorija |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | Primary (Vercel) + mirror (GitHub Pages), BASE_PATH |
| [STYLEGUIDE.md](../STYLEGUIDE.md) | Dizaino sistema |

**Pastaba:** Kontaktų forma / Google Apps Script / atsiliepimų schema **NEBĖRA** (pašalinta 2026-05-15). Produktas duomenų nerinkia – tik kopijavimas + localStorage progresas.

---

## 7. Cursor: taisyklės ir Skills

- **Šiame repozitorijoje** kanonas: `.cursorrules` + `AGENTS.md` + `docs/` (ypač **Legacy** + šis **INDEX**).
- **Cursor Agent Skills** (pvz. PR babysit, split-to-PRs) yra vartotojo lygio įrankiai – jie **papildo**, bet **nepakeičia** šio projekto golden standard ir `npm test`. Jei Skill liečia dokumentaciją, po merge vis tiek atitikti [DOCUMENTATION.md](DOCUMENTATION.md) checklist.

---

## 8. Greitos komandos

```bash
npm install
npm run build    # generate-og + build-locale-pages + vercel-export
npm test         # build + testai + lint:html + lint:js
```

A11y lokaliai (pavyzdys):

```bash
npx serve -s . -l 3000
npx pa11y http://localhost:3000/lt/ --standard WCAG2AA
npx pa11y http://localhost:3000/en/ --standard WCAG2AA
```

Žr. [README.md](../README.md) ir [DEPLOYMENT.md](../DEPLOYMENT.md).
