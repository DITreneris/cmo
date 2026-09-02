# Daugiakalbiška struktūra (LT/EN)

**Atsakingas:** Curriculum Agent  
**Tikslas:** Path atitikmenys, routing ir **locale politika** – vienas šaltinis tiesiai UI/UX, Content ir QA.

**Paskutinis atnaujinimas:** 2026-05-31 (EN kanonas; LT užšaldyta)

---

## 0. Locale politika (nuo 2026-05-31)

| Locale | Statusas | Kam skirta |
|--------|----------|------------|
| **`/en/`** | **Kanoninė versija** | Produktas, turinys, SEO (`hreflang x-default`), Commerce, release QA, rankinis testavimas, dokumentacija |
| **`/lt/`** | **Užšaldyta (testeriams)** | Vidinė LT snapshot versija – **be aktyvaus turinio/UI vystymo**. Build ir CI lieka dėl regresijos; ne atnaujinti sinchroniškai su EN |

### Kas keičiama (EN-first)

- **Turinys:** [`data/en-prompt-bodies.json`](../data/en-prompt-bodies.json), [`data/en-prompt-expected.json`](../data/en-prompt-expected.json), [`data/en-scenarios.json`](../data/en-scenarios.json), [`scripts/build-locale-pages.js`](../scripts/build-locale-pages.js) `EN_REPLACEMENTS` / `applyStaticLocaleText` EN šakos.
- **Struktūra / UX / Commerce:** [`en/index.html`](../en/index.html) (build output), root [`index.html`](../index.html) DOM kontraktas (Legacy), [`docs/pdf-source/`](../docs/pdf-source/), [`config/sot.json`](../config/sot.json) – visada EN scope.
- **SEO kanonas:** `https://promptanatomy.space/en/` ir `hreflang x-default` → `/en/` (patvirtina `tests/structure.test.js`).

### Kas NEKEIČIAMA (LT freeze)

- **Neredaguoti** aktyviai [`lt/index.html`](../lt/index.html), [`lt/privatumas.html`](../lt/privatumas.html), [`data/lt-prompt-expected.json`](../data/lt-prompt-expected.json), [`data/lt-scenarios.json`](../data/lt-scenarios.json) – nebent Orchestrator **sąmoningai** atnaujina tester snapshot (retas, atskiras scope).
- **Nereikalauti** LT/EN turinio pariteto naujuose PR. EN pakeitimai **nebackport'inami** į LT automatiškai.
- **Nenaudoti** `/lt/` kaip pagrindinio README, deploy ar gyvo testavimo entry point (žr. [TESTAVIMAS.md](TESTAVIMAS.md)).

### Techninė pastaba (build pipeline)

Root [`index.html`](../index.html) vis dar yra **struktūrinis build šaltinis** (LT tekstai `<pre>` + DOM). Tai **legacy technika**, ne produkto kalbos prioritetas. Kol nebus atskiro migracijos PR:

1. Struktūros / id / JS kontraktas – [`index.html`](../index.html) + Legacy.
2. **Matomas EN turinys** – per EN JSON + `EN_REPLACEMENTS` + build.
3. **`lt/` generuojamas** build metu, bet laikomas užšaldytu snapshot'u – ne produkto roadmap.

---

## 1. Puslapių atitikmenys

| LT path | EN path | Pastaba |
|---------|---------|---------|
| `/lt/` (index.html – biblioteka) | `/en/` (index.html – library) | **Kanonas:** `/en/` |
| `/lt/privatumas.html` | `/en/privacy.html` | LT free-only; EN + paid processors |

- **Biblioteka:** LT = `lt/index.html`, EN = `en/index.html`.
- **Privatumas:** LT = `lt/privatumas.html`, EN = `en/privacy.html`.

---

## 2. Routing taisyklės

### Root `/`

- `index.html` – legacy LT struktūrinis šaltinis (ne redirect, ne kanoninis produkto URL).
- `scripts/build-locale-pages.js` iš `index.html` sugeneruoja:
  - `lt/index.html` (užšaldyta snapshot)
  - `en/index.html` (kanonas)
- Build metu canonical/hreflang URL sudaromi iš:
  - `SITE_ORIGIN` (default: `https://promptanatomy.space`)
  - `BASE_PATH` (default: tuščia eilutė – šaknis)
- **Kanoninis vartotojo kelias:** `/en/` (primary ir mirror, su atitinkamu `BASE_PATH`).

### Kalbos jungiklis

Kalbos perjungiklis **lieka** abiem pusėms (backward compat + testeriams):

- Esant **LT** puslapyje `/lt/` → nuoroda į EN: `/en/`.
- Esant **LT** puslapyje `/lt/privatumas.html` → nuoroda į EN: `/en/privacy.html`.
- Esant **EN** puslapyje `/en/` → nuoroda į LT: `/lt/` (tester snapshot).
- Esant **EN** puslapyje `/en/privacy.html` → nuoroda į LT: `/lt/privatumas.html`.

---

## 3. Path → counterpart (lentelė skriptams)

```
LT → EN:
  /lt/                 → /en/
  /lt/privatumas.html  → /en/privacy.html

EN → LT:
  /en/           → /lt/
  /en/privacy.html → /lt/privatumas.html
```

Naudoti santykinius kelius iš root (pvz. `../en/`, `../lt/`) arba su base path priklausomai nuo deploy profilio.

---

## 4. EN turinio sinchronizacija (pakeista 2026-05-31)

**Anksčiau:** keičiant EN UI – privaloma lyginti LT.  
**Dabar:** **EN-first.** LT užšaldyta – sinchronizacija su LT **nereikalaujama** ir **nerekomenduojama**, nebent Orchestrator nurodo atskirą „LT snapshot refresh“.

Kai keičiami **anglų (EN)** UI tekstai ar promptai:

1. Redaguoti EN šaltinius (`data/en-*.json`, `EN_REPLACEMENTS`, Commerce copy).
2. Paleisti `npm run build` ir `npm test`.
3. Rankinis QA – **`/en/`** (primary); `/lt/` – tik CI smoke, ne turinio acceptance.

**LT snapshot refresh (retas, Orchestrator scope):** tik jei testeriams reikia atnaujinto LT atspindžio – atskiras PR, be automatinio EN→LT backport reikalavimo kituose PR.
