# LT→EN UI/UX praktikų ataskaita – duplikavimui kituose repo

**Tikslas:** Aprašyti šio projekto (DI Operacinis Centras) LT/EN lokalizacijos ir UI/UX modelį, kad būtų galima atkartoti panašų sprendimą kituose repozitorijuose.

**Data:** 2026-03

---

## 1. Santrauka

Projektas naudoja **hibridinį modelį**: vienas šablonas (root `index.html` lietuviškai), **build-time** generuojami atskiri puslapiai `/lt/` ir `/en/`, o **runtime** JavaScript (`generator.js`) nustato kalbą ir atnaujina visą dinaminį bei dalį statinio turinio. Kalbos perjungimas – navigacija į atitinkamą path su išsaugotu state (mode, depth, hash).

---

## 2. Kalbų architektūra

### 2.1 Locale nustatymo eilė

Locale nustatomas **vieną kartą** paleidus `generator.js` (eilutė ~45–57):

1. **Path** – jei URL yra `/lt/` arba `/en/`, naudojama ta kalba.
2. **Query** – `?lang=lt` arba `?lang=en`.
3. **localStorage** – raktas `di_ops_center_lang`.
4. **Fallback** – `navigator.language` (jei prasideda „lt“ → lt, kitaip → en).

```javascript
function getLocaleFromPathname() {
  var path = (window.location.pathname || '').toLowerCase();
  if (/\/lt(?:\/|$)/.test(path)) return 'lt';
  if (/\/en(?:\/|$)/.test(path)) return 'en';
  return '';
}
// resolveLocale(): path → query → localStorage → navigator
```

**Svarbu:** Root puslapis (`/` arba `index.html`) gali būti atidaromas su `?lang=en` – tada JS nustato locale ir `applyStaticLocaleText()` atnaujina visą UI. Tačiau **rekomenduojami** įėjimai yra `/lt/` ir `/en/` (SEO, bookmark’ai, aiškūs URL).

### 2.2 Path-based puslapiai (Phase 2)

| Kelias    | Turinys              | Naudojimas                          |
|-----------|----------------------|-------------------------------------|
| `/`       | Root `index.html` (LT šablonas) | Alternatyvus įėjimas su `?lang=…`   |
| `/lt/`    | Pilnas app, `lang="lt"` | Statinis LT puslapis                |
| `/en/`    | Pilnas app, `lang="en"` | Statinis EN puslapis                |

- **Nėra client-side redirect:** `/lt/` ir `/en/` yra tikri statiniai HTML failai (pilnas app), ne redirect į root.
- **Build:** `npm run build` → `node scripts/build-locale-pages.js` generuoja `lt/index.html` ir `en/index.html` iš root `index.html`.

---

## 3. Build skriptas (`scripts/build-locale-pages.js`)

### 3.1 Ką daro

1. **HTML lang** – `<html lang="lt">` arba `lang="en"`.
2. **Title ir meta description** – lokaliai pritaikyti (aprašymas EN/LT).
3. **Canonical** – `<link rel="canonical" href="/lt/">` arba `/en/`.
4. **hreflang** – `hreflang="lt"`, `hreflang="en"`, `hreflang="x-default"` (default = LT).
5. **Asset keliai** – jei reikia (pvz. GitHub Pages), `BASE_PATH` naudojamas; įprastai absoliutus kelias `/style.css`, `/generator.js` ir t. t.
6. **EN statinio teksto pakeitimai** – jei `locale === 'en'`, vienas didelis `EN_REPLACEMENTS` blokas (split/join) pakeičia:
   - skip link, nav, brand, h1, hero, žingsniai, CTA, operacinis centras, režimų tab’ai, depth, output blokas, sesijos, biblioteka, taisyklės, community, footer, aria-label’ai, toast.
   - **Instrukcijų 2 eilutė:** šaltinyje naudojamos lietuviškos kabos „ “ (U+201E, U+201C) – replacement’e `from` turi naudoti tą patį, kad atitiktų.
   - **Laiko etiketė:** matomas tekstas „~3–5 min per žingsnį“ → „~3–5 min per step“ (be to keičiamas ir aria-label).
   - **CSS `content`:** `.code-block::before` turinys „Spausk čia ir nukopijuok“ → „Click here and copy“.
   - **Promptų blokai:** visi 10 `<pre class="code-text" id="prompt1">` … `prompt10` turiniai (META, INPUT, OUTPUT) pakeičiami iš LT į EN per atskiras replacement poras.

### 3.2 Duplikavimo patarimai

- **Vienas šaltinis:** Root `index.html` laikykite **vienintele** HTML šablonu (pvz. visada lietuviškai).
- **Replace sąrašas:** Visus statinius tekstus, kuriuos norite EN puslapyje, įtraukite į build skripto `if (locale === 'en') { ... }` bloką.
- **Identiškas DOM:** LT ir EN failuose DOM struktūra (id, class, `data-*`) turi būti identiška, kad `generator.js` selektoriai veiktų abiem kalbomis.
- **GitHub Pages:** Jei naudojate project site, paleiskite build su `BASE_PATH=/your-repo-name`.

---

## 4. Runtime lokalizacija (`generator.js`)

### 4.1 Helper

```javascript
function uiText(lt, en) {
  return locale === 'lt' ? lt : en;
}
```

Naudojamas visur, kur tekstas priklauso nuo kalbos (nav, formos, mygtukai, pranešimai).

### 4.2 Kur saugomi vertimai

| Vieta                    | Turinys                                      |
|--------------------------|-----------------------------------------------|
| **MODES**                | Režimų pavadinimai ir aprašymai (STRATEGIC/STRATEGINIS ir t. t.) |
| **DEPTH_LEVELS**         | Gylio lygiai (Fast/Greita, Deep/Gilu, Board/Valdybai) + instrukcijos ir formatas |
| **LIBRARY_PROMPTS**      | Šablonų biblioteka – title, desc, prompt (atskirai LT ir EN masyvai) |
| **RULES**                | Taisyklės – title, items (atskirai LT ir EN)  |
| **applyStaticLocaleText()** | Vienas didelis blokas: title, skip link, nav, hero, form section titles, **visi** form label’ai ir placeholder’ai, select option’ai, output blokas, sesijos, biblioteka, taisyklės, community, footer, aria-label’ai. |

### 4.3 Formos ir placeholder’ai

- Root HTML (ir build’into EN) formos gali būti parašytos tik lietuviškai.
- **applyStaticLocaleText()** paleidžiama vieną kartą po DOM ready ir per `setLabel(forId, text)`, `setPlaceholder(id, text)` bei `querySelector` atnaujina:
  - visus form label’us,
  - visus placeholder’us,
  - select option tekstus,
  - field-help tekstus.
- Todėl **EN path** (`/en/`) ir root su `?lang=en` abu rodo pilną EN formą – dėl JS, ne dėl build’into EN HTML formos.

### 4.4 Dinaminis turinys

- **Biblioteka:** `renderLibrary()` naudoja `LIBRARY_PROMPTS`, kuris jau parinktas pagal `locale`.
- **Taisyklės:** `renderRules()` naudoja `RULES[locale]`.
- **Sesijos:** Datos formatuojamos `toLocaleString(locale === 'lt' ? 'lt-LT' : 'en-GB')`.
- **Output:** Sugeneruoto teksto šablonai ir etiketės (pvz. „Prioritetai“, „Veiksmai“) – per `uiText(...)` arba atitinkamus objektus.

---

## 5. Kalbos perjungiklis (UI/UX)

### 5.1 Vieta

- **Nav bar**, dešinėje: mygtukai **LT** ir **EN** (`#langLtBtn`, `#langEnBtn`).
- **aria-label:** „Kalbos pasirinkimas“ / „Language selection“; mygtukai – „Perjungti į lietuvių kalbą“ / „Switch to English“ ir t. t.
- Aktyvi kalba pažymima klasė `is-active` (vizualiai paryškinta).

### 5.2 Elgsena paspaudus

- Išsaugoma: `localStorage.setItem(LANG_KEY, nextLang)`.
- Query: pridedami/atnaujinami `mode`, `depth` (iš dabartinio state).
- Hash: išsaugomas (pvz. `#operationsCenter`).
- **Jei esame ant path:** `/lt/` arba `/en/`:
  - Navigacija į `/en/` arba `/lt/` su `?mode=...&depth=...` ir tuo pačiu hash.
- **Jei root:** Navigacija į `./?lang=lt` arba `./?lang=en` su tais pačiais params ir hash.

Taip vartotojas nepraranda režimo, gylio ir scroll pozicijos (hash).

---

## 6. SEO ir a11y

### 6.1 SEO

- **Canonical** – kiekvienas locale puslapis turi savo canonical (`/lt/`, `/en/`).
- **hreflang** – visuose puslapiuose yra `<link rel="alternate" hreflang="lt" href="...">`, `hreflang="en"`, `hreflang="x-default"` (čia → LT).
- **lang** – `<html lang="lt">` arba `lang="en">` atitinka turinį.

### 6.2 Prieinamumas (a11y)

- **aria-label** visur lokalizuoti (per build EN arba per `applyStaticLocaleText()`).
- Skip link: „Pereiti prie turinio“ / „Skip to content“.
- Tab’ai ir depth – `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="radiogroup"`, `aria-checked`.
- Pranešimai: toast su `aria-live="polite"`, `aria-atomic="true"`.

---

## 7. UI/UX principai (Golden Standard)

Iš projekto README ir struktūros:

- **Vienas CTA** – vienas pagrindinis veiksmas vizualiai dominuoja (svoris, subtilus glow).
- **Hierarchija** – aiškūs sluoksniai: background → card → input (tonų skirtumas ~2–5%).
- **Kontrastas** – input, placeholder, pagalbiniai tekstai lengvai skaitomi.
- **Depth sistema** – 2–3 nuoseklūs elevation lygiai, be atsitiktinių shadow reikšmių.
- **Brand** – violetinė palaikoma tiek light, tiek dark režime.
- **Sesijos** – aiškus header, empty state su pozityvia žinute.
- **Focus** – būtina `:focus-visible`, klaviatūros navigacija.

Šie principai **nepriklauso** nuo kalbos, bet užtikrina nuoseklų LT/EN patirtį.

---

## 8. Failų ir skriptų santrauka

| Failas / aplankas      | Paskirtis |
|------------------------|-----------|
| `index.html` (root)    | Vienintelis HTML šablonas (LT). Naudojamas kaip šaltinis build’ui. |
| `lt/index.html`        | Generuojamas; pilnas app, `lang="lt"`, canonical/hreflang. |
| `en/index.html`        | Generuojamas; pilnas app, `lang="en"`, statiniai EN tekstai (nav, hero, footer, aria). |
| `scripts/build-locale-pages.js` | Generuoja `lt/` ir `en/` iš root `index.html`. |
| `generator.js`         | Locale resolve, MODES/DEPTH_LEVELS/LIBRARY_PROMPTS/RULES, `uiText`, `applyStaticLocaleText()`, kalbos perjungiklis, render’inimas. |
| `style.css`            | Bendri stiliai; nekinta pagal kalbą. |

---

## 9. Duplikavimo checklist kitame repo

- [ ] **Šablonas:** Vienas root `index.html` (pvz. LT) su aiškia DOM struktūra ir id/class.
- [ ] **Build:** Skriptas (panašus į `build-locale-pages.js`), kuris:
  - keičia `lang`, title, meta description, canonical, hreflang;
  - EN atveju pakeičia visus norimus statinius tekstus (nav, hero, footer, aria-label’ai);
  - išlaiko identišką DOM abiem kalbomis.
- [ ] **Locale resolve:** JS logika: path → query → localStorage → navigator; vienas raktas (pvz. `appId_lang`).
- [ ] **uiText(lt, en):** Vienas helper ir visur naudoti vietoj „hardcoded“ kalbos.
- [ ] **applyStaticLocaleText():** Vienas blokas, kuris per DOM atnaujina label’us, placeholder’ius, section titles, buttons, aria-label’ius – pagal dabartinį `locale`.
- [ ] **Dinaminis turinys:** Objektai/masyvai (pvz. MODES, DEPTH_LEVELS, LIBRARY_PROMPTS) su `locale === 'lt' ? ltVersion : enVersion`.
- [ ] **Kalbos perjungiklis:** Du mygtukai (LT/EN), paspaudus – localStorage + navigacija į `/lt/` arba `/en/` (arba `?lang=`) su išsaugotu state (params + hash).
- [ ] **Testai:** Struktūriniai testai, kad `lt/index.html` turi `lang="lt"`, `en/index.html` – `lang="en"`; E2E – kalbos perjungimas iš `/lt/` į `/en/` išlaiko mode/depth.
- [ ] **CI:** Prieš deploy paleisti `npm run build`, kad būtų sugeneruoti atnaujinti `lt/` ir `en/` failai.

---

## 10. Žinomos subtilybės

1. **Build EN replace:** Jei naudojate regex `replace()`, saugokitės specialių simbolių (pvz. `'` EN tekstuose – escape). Šiame projekte EN depth mygtukuose buvo rašyta `<//button>` vietoj `</button>` – reikia tikrinti, kad pakeitimai nelūžtų HTML.
2. **Formos EN:** Statiniame `en/index.html` formos label’ai ir placeholder’ai gali likti lietuviški – juos vis tiek perrašo `applyStaticLocaleText()`. Jei norite „clean“ EN HTML be JS (pvz. crawler’iams), reikėtų tą patį turinį įtraukti į build script’o replace sąrašą arba generuoti formą iš šablono.
3. **x-default:** Čia nurodyta LT. Jei pagrindinė rinkinė bus EN, pakeiskite `hreflang="x-default"` į EN URL.

---

Jei norite, galima iš šios ataskaitos išskirti trumpą „Quick start“ sekciją tik build + locale resolve + perjungiklio logikai (be detalių UI principų).
