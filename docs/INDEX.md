# Dokumentacijos indeksas – DI Promptų Biblioteka

**Paskirtis:** Vienas įėjimo taškas žmonėms ir AI agentams – ką skaityti pirmiausia pagal rolę ar užduotį. Kanoniniai kodas ir ribos: [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) + `npm test`.

**Paskutinis atnaujinimas:** 2026-04-30

---

## 1. Pradžia per 2 minutes

| Jei tu… | Atidaryk |
|--------|----------|
| Naujas projekte | [README.md](../README.md) → tada šį indeksą |
| AI agentas (Cursor ir kt.) | [.cursorrules](../.cursorrules) + [AGENTS.md](../AGENTS.md) + [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) |
| Keiti tik lietuviškus / angliškus tekstus | [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) (kas leidžiama) + [`BULLET_PROOF_PROMPTS.md`](BULLET_PROOF_PROMPTS.md) |
| Keiti LT/EN kelius ar build | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) + [`../scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) |
| Release / deploy | [CHANGELOG.md](../CHANGELOG.md) + [DEPLOYMENT.md](../DEPLOYMENT.md) + `npm test` |

---

## 2. Pagal agento rolę (AGENTS.md modelis)

| Agentas | Pagrindiniai dokumentai | Kodas / artefaktai |
|---------|-------------------------|-------------------|
| **Orchestrator** | [AGENTS.md](../AGENTS.md), [DOCUMENTATION.md](DOCUMENTATION.md), [CHANGELOG.md](../CHANGELOG.md) | Prioritetai; MUST_TODO / MVP_ROADMAP – *historical*, ne vykdymo šaltinis |
| **Curriculum** | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md), [`PEDAGOGINES_SPECIFIKACIJA.md`](PEDAGOGINES_SPECIFIKACIJA.md) | Seka 1–10, locale atitikmenys |
| **Content** | [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md), [`BULLET_PROOF_PROMPTS.md`](BULLET_PROOF_PROMPTS.md), [`PEDAGOGINES_SPECIFIKACIJA.md`](PEDAGOGINES_SPECIFIKACIJA.md) | [`../index.html`](../index.html) (LT šaltinis), po pakeitimų `npm run build` |
| **UI/UX** | [STYLEGUIDE.md](../STYLEGUIDE.md), [`LEGACY_GOLDEN_STANDARD.md`](LEGACY_GOLDEN_STANDARD.md) (struktūra / a11y) | `styles/*.css`, `styles/design-tokens.json`, [`../index.html`](../index.html) |
| **QA** | [docs/QA_STANDARTAS.md](QA_STANDARTAS.md), [docs/TESTAVIMAS.md](TESTAVIMAS.md), [DOCUMENTATION.md](DOCUMENTATION.md) | `npm test`, `tests/*.test.js`, [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) |

---

## 3. Pagal užduotį (užduočių žemėlapis)

| Užduotis | Žingsniai |
|----------|-----------|
| Pakeisti prompto tekstą (LT) | Tik leidžiami laukai pagal **Legacy**; META/INPUT/OUTPUT – **Bullet proof**; nekeisti `id` / `data-*` / JS. |
| Pakeisti EN UI ar promptų `<pre>` | [`MULTILINGUAL_STRUCTURE.md`](MULTILINGUAL_STRUCTURE.md) §4; dažnai reikia įrašų į `EN_REPLACEMENTS` skripte + `npm run build`. |
| Pakeisti dizainą | STYLEGUIDE + tokenai; po pakeitimų `npm test` (design-system + a11y smoke). |
| Pakeisti struktūrą (nauja sekcija, JS API) | QA + sąmoningas **Legacy** atnaujinimas; išplėsti `tests/structure.test.js` jei reikia kontrakto. |
| Įjungti kontaktų formą vėliau | [INTEGRACIJA.md](../INTEGRACIJA.md), `google-apps-script.js`; dabar forma išjungta – žr. INTEGRACIJA įžangą. |

---

## 4. Kodas ↔ dokumentai (faktinis pipeline)

```
index.html (LT šaltinis)
    → npm run build → scripts/build-locale-pages.js
    → lt/index.html, en/index.html, js/en-prompt-bodies-inline.js
    → npm test (structure + design-system + a11y smoke + lint)
```

| Failas / katalogas | Dokumentuota |
|--------------------|--------------|
| `index.html` | Legacy §2–3, README |
| `scripts/build-locale-pages.js` | Multilingual, DEPLOYMENT (BASE_PATH) |
| `lt/`, `en/` | Multilingual, DOCUMENTATION inventoriuje *(generuojama)* |
| `tests/structure.test.js` ir kt. | QA standartas, AGENTS §6 |
| `privatumas.html` (root), `lt/privatumas.html`, `en/privacy.html` | Legacy §6, TESTAVIMAS |

---

## 5. Visi `docs/` failai (santrauka)

| Dokumentas | Trumpai |
|------------|---------|
| **INDEX.md** (šis failas) | Navigacija |
| [DOCUMENTATION.md](DOCUMENTATION.md) | Inventorius, atsakomybės, release/docs taisyklės |
| [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) | Golden standard: ID, JS API, checklist |
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
| [.cursorrules](../.cursorrules) | Cursor: saugumas, kokybė, docs, commit |
| [CHANGELOG.md](../CHANGELOG.md) | SemVer istorija |
| [DEPLOYMENT.md](../DEPLOYMENT.md) | GitHub Pages, BASE_PATH |
| [STYLEGUIDE.md](../STYLEGUIDE.md) | Dizaino sistema |
| [INTEGRACIJA.md](../INTEGRACIJA.md) | Forma / Sheets – vėlesniems etapams |
| [MUST_TODO.md](../MUST_TODO.md), [MVP_ROADMAP.md](../MVP_ROADMAP.md) | *Historical* – kontekstas, ne aktyvus planas |
| [feedback-schema.md](../feedback-schema.md) | Feedback Store schema |

---

## 7. Cursor: taisyklės ir Skills

- **Šiame repozitorijoje** kanonas: `.cursorrules` + `AGENTS.md` + `docs/` (ypač **Legacy** + šis **INDEX**).
- **Cursor Agent Skills** (pvz. PR babysit, split-to-PRs) yra vartotojo lygio įrankiai – jie **papildo**, bet **nepakeičia** šio projekto golden standard ir `npm test`. Jei Skill liečia dokumentaciją, po merge vis tiek atitikti [DOCUMENTATION.md](DOCUMENTATION.md) checklist.

---

## 8. Greitos komandos

```bash
npm install
npm run build    # lt/en + en-prompt-bodies-inline
npm test         # build + testai + lint:html + lint:js
```

A11y lokaliai (pavyzdys): `npx serve -s . -l 3000`, tada `pa11y` į `/lt/` ir `/en/` – žr. [README.md](../README.md) ir [DEPLOYMENT.md](../DEPLOYMENT.md).
