# Legacy Golden Standard – DI Promptų Biblioteka (Spin-off Nr. 2)

**Tikslas:** Dabartinis kodas yra atskaitos taškas (legacy golden standard). Keičiant **turinį** (promptus, antraštes, aprašymus) – būtina laikytis šios struktūros ir konvencijų. Struktūros, ID, CSS klasių ir JavaScript API nekeičiame be QA patvirtinimo ir šio dokumento atnaujinimo. Projektas: Spin-off Nr. 2 (10 promptų CMO rinkiniui).

**Versija:** 1.7
**Data:** 2026-05-15
**Kalba:** LT

---

## 0. Šaltinio modelis (svarbiausia)

Faktinis **vartotojui matomas puslapis ≠ root [`index.html`](../index.html)**. Vartotojas mato `lt/index.html` arba `en/index.html`, kurie **generuojami** iš trijų šaltinių:

```
index.html (LT bazė, struktūra ir promptų <pre>)
  + data/*.json (en-prompt-bodies, en/lt-prompt-expected, en/lt-scenarios)
  + scripts/build-locale-pages.js (inject CMO v2 blokus, EN_REPLACEMENTS, SEO, JSON-LD)
     ↓ npm run build
lt/index.html, en/index.html, js/en-prompt-bodies-inline.js
```

**CMO v2 blokai (`#cmo-context`, `.prompt-expected`, `#cmo-safety`, `#cmo-scenarios`, `window.__CMO_COMPILE` patch) NĖRA `index.html` faile** – jie įterpiami build metu ir egzistuoja tik `lt/`, `en/` ir `public/` failuose. Build skriptas validuoja jų buvimą per `assertEnLocaleAdditions` / `assertLtLocaleAdditions` ([scripts/build-locale-pages.js](../scripts/build-locale-pages.js) ~ eilutės 1417–1462) – be jų build krenta.

**LT/EN lokalizacija:** Keičiant tik turinio tekstus ir `lang`/meta – DOM (id, class, data-*), a11y struktūra (role, aria-* pavadinimai) lieka tie patys abiem kalbom. **Terminologija:** LT – **DI**, EN – **AI**. EN versijoje turi būti lokalizuoti ir **promptų `<pre>` turiniai** (per [data/en-prompt-bodies.json](../data/en-prompt-bodies.json) → `js/en-prompt-bodies-inline.js`).

**Build ir deploy:**
- **Primary host:** `https://promptanatomy.space` (Vercel), default `BASE_PATH = ''` (testai tai patvirtina).
- **Mirror:** `https://ditreneris.github.io/cmo/` (GitHub Pages), aktyvuojamas su `BASE_PATH=/cmo`.
- Override per env `SITE_ORIGIN` / `BASE_PATH`. Žr. [DEPLOYMENT.md](../DEPLOYMENT.md).

**Sinchronizuota su kodu (2026-05-15):** skip-link „Pereiti prie turinio“, hero (Turinio DI sistema / rinkodaros vadovams, žyma „Promptų anatomija“ → `https://promptanatomy.app/`, žyma „Nemokama biblioteka“, poantraukė apie 10 CMO promptų ir ~45 min., primary CTA „Pradėti nuo 1-o prompto“, antrinė nuoroda „Bendruomenė: Telegram“), hero trust pills; po `progressIndicator` – **viena** `.cmo-provider-hub` eilutė (ChatGPT / Claude / Gemini). **SEO/OG preview:** `og:image` ir `twitter:image` naudoja self-hosted `https://promptanatomy.space/og.png` (šaltinis [scripts/generate-og.js](../scripts/generate-og.js), paleidžiama `npm run build` / `npm run generate:og`) su `og:image:width=1200`, `og:image:height=630`, `og:image:alt`, `twitter:image:alt`. **Nuorodų hierarchija:** `.objectives-eco-hint`, FAQ `.faq-eco-hint` → `#ecosystem-strip`; sekcija `#ecosystem-strip` (h2 `#ecosystem-strip-title`) **prieš** `#community`; bendruomenė – tik Telegram CTA; footer – **viena** sujungta `.footer-product-link` eilutė (versija iš `package.json` + `promptanatomy.app`). **Turinio eiliškumas (CRO 3.2):** `#framework-schema` lieka po instrukcijų ir prieš progresą; `#what-is-prompt` ir `#prompt-anatomy` (su `meme-slot-1` / `meme-slot-2`) yra **po** visų 10 promptų kortelių, prieš „Kas toliau?“; po FAQ seka `#ecosystem-strip`, tada `#community`. **`privatumas.html`:** „Grįžti“ nuorodos turi `id="back-link"` ir `id="back-link-footer"`; inline skriptas nustato `href` pagal `document.referrer` (lt/, en/ arba index.html).

---

## 1. Santrauka

| Kategorija | Fiksuota (nekeičiame keisdami turinį) | Leidžiama keisti (turinys) |
|------------|----------------------------------------|----------------------------|
| **HTML** | Struktūra: `<main id="main-content">`, sekcijos, 10× `<article class="prompt">`, id `block1`–`block10`, `prompt1`–`prompt10`, `data-prompt-id` atributai, CMO v2 sekcijų id (`cmo-context`, `cmo-safety`, `cmo-scenarios`, `expected1`–`expected10`) | Tekstai: hero h1/p, .objectives sąrašas, instrukcijos, .prompt-title, .prompt-desc, `<pre class="code-text">` turinys (LT root + EN per `data/en-prompt-bodies.json`), .info-content, .next-steps, .community, .footer, privatumas.html |
| **CSS** | `:root` tokenai ([styles/tokens.css](../styles/tokens.css)), komponentai ([styles/components.css](../styles/components.css)) – žr. [STYLEGUIDE.md](../STYLEGUIDE.md) | Nėra (turinio keitimas neturi keisti klasių ar layout) |
| **JS** | IIFE `index.html`; CONFIG, selectText, copyPrompt, handleCodeBlockKeydown, fallbackCopy, showSuccess/showError/showToast, localStorage raktai `di_prompt_done_1`…`10`, debounce; locale resolve, uiText, applyStaticLocaleText, LANG_KEY `di_promptu_biblioteka_lang`. **Event binding:** `addEventListener` per `DOMContentLoaded` (be inline `onclick`/`onkeydown` – `tests/structure.test.js` to reikalauja). **CMO v2 (tik build output):** `window.__CMO_COMPILE` hook, `sessionStorage` kontekstui | Nėra |
| **A11y** | Skip link `#main-content`, role="button"/tabindex="0" ant .code-block, aria-label mygtukams ir checkbox, aria-live/role="progressbar", toast role="status" | Nėra (prieinamumo atributų reikšmes keisti tik pagal reikalavimus, nekeičiant struktūros) |

**Promptų turinio formatas:** Kiekvieno prompto tekstas `<pre class="code-text">` laikosi šablono: **META** (vaidmuo su patirtimi, tikslas, auditorija, kontekstas), **INPUT** (konkretūs duomenys/placeholderiai, apribojimai), **OUTPUT** (formatas, struktūra, kalba, tonas). Keičiant turinį – išlaikyti šią struktūrą.

---

## 2. HTML struktūros schema

```
index.html (LT bazė) → po `npm run build` → lt/index.html, en/index.html
├── <a class="skip-link" href="#main-content">Pereiti prie turinio</a>
├── <div class="container">
│   └── <main id="main-content">
│       ├── <header class="header">        (hero: .header-badges, h1, p, .header-cta)
│       ├── <section id="executive-summary"> (h2#executive-summary-title)
│       ├── <section class="objectives">   (h2#objectives-title, ul > li)
│       ├── <section class="instructions"> (h2#instructions-title, ol > li)
│       ├── <section id="framework-schema"> (plan → create → check → improve)
│       ├── <div id="progressIndicator" aria-live="polite" aria-atomic="true">
│       │   ├── <p id="progressText">
│       │   └── <div class="progress-bar" role="progressbar" aria-valuenow/min/max aria-label="Progresas: 0 iš 10 promptų">
│       │       └── <div id="progressBarFill">
│       ├── <div class="cmo-provider-hub"> (viena .cmo-provider-row: ChatGPT, Claude, Gemini)
│       ├── [build inject] <section id="cmo-context">  (5 laukai + taisyklės, žr. §3)
│       ├── 10× <article class="prompt">
│       │   ├── <div class="prompt-header">    (.prompt-meta: .number, .category, .prompt-time; h2.prompt-title; p.prompt-desc)
│       │   ├── <div class="prompt-body">
│       │   │   ├── <div class="code-block" id="blockN" role="button" tabindex="0" aria-label="Pasirinkti ir kopijuoti promptą N">
│       │   │   │   └── <pre class="code-text" id="promptN">  ← TURINYS KEICIAMAS
│       │   │   └── <div class="info-box" role="note" aria-label="Informacija: promptas N">  ← TURINYS KEICIAMAS
│       │   ├── [build inject] <div class="prompt-expected" id="expectedN"> (≥2 bullet `<li>`)
│       │   └── <div class="prompt-footer">
│       │       ├── <p class="prompt-cta">
│       │       ├── <button class="btn" data-prompt-id="promptN" aria-label="Kopijuoti promptą N į darbinių atmintinę">
│       │       └── <label class="prompt-done-wrap">
│       │           └── <input type="checkbox" class="prompt-done" data-prompt-id="N" aria-label="Pažymėti, kad atlikai šį žingsnį">
│       ├── [build inject] <section id="cmo-safety">    (pre-publish saugumo recenzentas)
│       ├── [build inject] <section id="cmo-scenarios"> (scenarijų skirtukai, ~3 scenarijai)
│       ├── <section id="preflight">       (.preflight-list; be meme)
│       ├── <figure id="meme-slot-1">      (po Prompt 1; `.meme-slot--compact`)
│       ├── <figure id="meme-slot-2">      (po Prompt 2)
│       ├── <details id="prompt-basics">   (what-is-prompt, prompt-anatomy, definitions – ID išlaikyti)
│       ├── <nav id="progressJump">        (1–10, #cmo-safety, #faq)
│       ├── `#stickyPromptBar`             (mobilus, ≤768px)
│       ├── <section class="next-steps">   (h2#next-steps-title, p, <details> su summary#next-steps-jump, .next-steps-links > a → #block1..10)
│       ├── <section id="faq">             (su meme-slot-6)
│       ├── <section id="ecosystem-strip"> (h2#ecosystem-strip-title, .ecosystem-strip-list)
│       ├── <section class="community" id="community">
│       └── <footer class="footer">        (.footer-product-link su `data-version` iš package.json, .footer-email, .copyright)
├── <textarea class="hidden" id="hiddenTextarea" aria-hidden="true">
└── <div class="toast" id="toast" role="status" aria-live="polite" aria-label="Kopijavimo pranešimas">
```

**Būtini ID ir atributai (nekeisti):**

- `main-content`, `progressIndicator`, `progressText`, `progressBarFill`, `toast`, `hiddenTextarea`, `ecosystem-strip`, `ecosystem-strip-title`, `next-steps-jump`, `cmo-provider-hub-title`
- Kiekvienam promptui: `id="block1"` … `id="block10"`, `id="prompt1"` … `id="prompt10"`
- Mygtukas: `data-prompt-id="prompt1"` … `"prompt10"`, `aria-label="Kopijuoti promptą N į darbinių atmintinę"`
- Checkbox: `data-prompt-id="1"` … `"10"`, `aria-label="Pažymėti, kad atlikai šį žingsnį"`
- Progreso juosta: `.progress-bar` turi `aria-label="Progresas: 0 iš 10 promptų"` (pradžia); JS atnaujina į „Progresas: X iš 10 promptų“
- Info-box: `aria-label="Informacija: promptas N"` (N 1–10)
- **CMO v2 (tik `lt/`, `en/`):** `cmo-context`, `cmo-safety`, `cmo-scenarios`, `expected1` … `expected10`, `cmoCtxAudience`, `cmoCtxOffer`, `cmoCtxChannels`, `cmoCtxGoal`, `cmoCtxConstraint`
- localStorage raktai: `di_prompt_done_1` … `di_prompt_done_10`
- `sessionStorage` (tik CMO v2): konteksto laukai (audience, offer, channels, goal, constraint)

---

## 3. JavaScript API (fiksuota)

### 3.1 Pagrindinės funkcijos (root `index.html` + paveldima `lt/`, `en/`)

- **`selectText(element)`** – pasirenka tekstą `.code-block <pre>` elemente; kviečiama per `addEventListener('click'/'keydown')`.
- **`copyPrompt(button, promptId)`** – kopijuoja promptą pagal `promptId` (pvz. `'prompt1'`) į clipboard; kviečiama per `addEventListener('click')`. **Locale build patch'ina** šią funkciją, kad ji kviestų `window.__CMO_COMPILE(promptId, originalText)` prieš kopijavimą.
- **`handleCodeBlockKeydown(event, element)`** – Enter/Space klaviatūros navigacija ant `.code-block`.
- **`updateProgressIndicator()`** – skaičiuoja localStorage žymes, atnaujina `progressText`, `progressBarFill`, `aria-valuenow`, `aria-label`.
- **`fallbackCopy`, `showSuccess`, `showError`, `showToast`** – kopijavimo fallback ir toast UI.
- **`CONFIG`** – `SELECTION_TIMEOUT`, `TOAST_DURATION`, `BUTTON_RESET_TIMEOUT`, `ERROR_TIMEOUT`, `DEBOUNCE_DELAY`.

### 3.2 Event binding

**Inline `onclick` / `onkeydown` HTML atributai NĖRA naudojami** – visi event handler'iai prijungiami per `addEventListener` `DOMContentLoaded` callback'e. `tests/structure.test.js` to reikalauja (`Markup nenaudoja inline event handlerių` assertion).

### 3.3 CMO v2 hook (tik build output)

**`window.__CMO_COMPILE(promptId, originalText) → string`** – įterpiamas build metu į `lt/`, `en/`. Logika:

1. Skaito 5 konteksto laukus iš `sessionStorage` (jei nustatyti per `#cmo-context` formą).
2. Sudaro **KONTEKSTAS** (LT) arba **CONTEXT** (EN) bloką.
3. Pridėta **TAISYKLĖS (privalomos)** (LT) arba **RULES (non-negotiable)** (EN) sekcija.
4. Grąžina kompiliuotą tekstą: `[KONTEKSTAS]\n[TAISYKLĖS]\n\n[originalText]`.

Build skripto literal'ai privalomi:
- EN: `RULES (non-negotiable)`
- LT: `TAISYKLĖS (privalomos)`, `KONTEKSTAS`

### 3.4 Versijos žyma footer'yje

Build metu iš [package.json](../package.json) `version` lauko įterpiama:
- LT: `Prompt Anatomy CMO rinkinys v{version}` (su `data-version="{version}"`)
- EN: `Prompt Anatomy CMO Kit v{version}` (su `data-version="{version}"`)

Patikra: `tests/structure.test.js` lygina su `readPackageVersion()`.

### 3.5 localStorage / sessionStorage

| Saugykla | Raktai | Reikšmės |
|----------|--------|----------|
| `localStorage` | `di_prompt_done_1` … `di_prompt_done_10` | `'true'` / `'false'` |
| `localStorage` | `di_promptu_biblioteka_lang` | `'lt'` / `'en'` |
| `sessionStorage` (CMO v2) | konteksto laukai | string (vartotojo įvestis) |

Keičiant turinį **nepridėti** inline event atributų, nekeisti funkcijų pavadinimų, neištraukti JS į atskirą failą be QA patvirtinimo ir šio dokumento atnaujinimo.

---

## 4. `.code-block` komponentas (fiksuota)

`.code-block` turi pseudo-elementą `::before` su etikete „💡 Spausk čia ir nukopijuok“ (matoma hover/focus būsenose).

| Savybė | Reikšmė | Pastaba |
|--------|---------|---------|
| Etiketė | `content: '💡 Spausk čia ir nukopijuok'` | Nekeisti be Content/UI koordinacijos |
| Pozicija | `position: absolute`, `top: 12px`, `right: 20px`, `z-index: 1` | Etiketė **viduje** bloko viršuje |
| Layout | `margin-top: 20px`, `margin-bottom: 24px` | Etiketė nesikerta su prompt-header border |

Koreguojant `.code-block` ar `.prompt` CSS – patikrinti `tests/design-system-smoke.test.js`.

---

## 5. Checklist prieš commit (Content / QA)

- [ ] Nepakeisti jokių `id` (block1–block10, prompt1–prompt10, progressText, progressBarFill, toast, main-content, hiddenTextarea, CMO v2 sekcijų id).
- [ ] Nepakeisti `data-prompt-id` ant mygtukų ir checkbox (prompt1…prompt10 ir 1…10).
- [ ] Kiekvienas promptas lieka tos pačios struktūros: .prompt-header → .prompt-body (.code-block + .info-box) → .prompt-expected (build inject) → .prompt-footer (.btn + .prompt-done).
- [ ] **NE pridėti** inline `onclick` / `onkeydown` atributų – binding per `addEventListener`.
- [ ] Nauji ar pakeisti promptai naudoja tą patį HTML šabloną.
- [ ] Upgrade sekcijos: `id="what-is-prompt"` ir `id="prompt-anatomy"` lieka **po** 10-uoju `article.prompt`, prieš `next-steps`; `id="framework-schema"` lieka prieš `progressIndicator` (žr. §2).
- [ ] Meme slotų kontraktas: tiksliai 3× `<figure class="meme-slot" id="meme-slot-N">` (`meme-slot-1`, `meme-slot-2`, `meme-slot-6`) su vienu `<img>` viduje. Jokių matomų `.meme-lesson-*` heading'ų ar `.meme-caption`; prasmė perduodama pačiu paveikslu ir `alt` tekstu.
- [ ] CMO v2 blokai (`#cmo-context`, `.prompt-expected`, `#cmo-safety`, `#cmo-scenarios`, `window.__CMO_COMPILE`) **negali būti rankomis kuriami `index.html`** – jie generuojami iš build skripto + `data/*.json`.
- [ ] `data/en-prompt-bodies.json` turi 10 EN META eilučių (atitiks 10 LT promptų root `index.html`).
- [ ] `data/{en,lt}-prompt-expected.json` ir `data/{en,lt}-scenarios.json` – sutampa su locale poreikiu.
- [ ] Build: prieš release/deploy paleisti `npm run build`. Deploy aplinkos:
  - **Primary (Vercel, `promptanatomy.space`):** `BASE_PATH=''` (default).
  - **Mirror (GitHub Pages, `ditreneris.github.io/cmo`):** `BASE_PATH=/cmo` (env override).
- [ ] `privatumas.html`: nekeisti `id="back-link"`, `id="back-link-footer"` ir skripto logikos (referrer → lt/ | en/ | index.html).
- [ ] `npm test` praeina (96+ struktūriniai teiginiai + design-system + a11y smoke + lint).

---

## 6. `privatumas.html` (fiksuota)

**Trys versijos:**
- `privatumas.html` (root) – legacy backward compat, sitemap'e nėra, bet `tests/structure.test.js` tikrina egzistavimą.
- `lt/privatumas.html` – kanonas LT (canonical: `https://promptanatomy.space/lt/privatumas.html`).
- `en/privacy.html` – kanonas EN (canonical: `https://promptanatomy.space/en/privacy.html`).

**Bendros taisyklės (visoms versijoms):**
- ID: `back-link`, `back-link-footer` – naudojami inline skriptu, kuris nustato `href` pagal `document.referrer` (jei kelias turi `/lt` → `lt/`, `/en` → `en/`, kitaip → `index.html`).
- **Keisti leidžiama:** tik teksto turinys (antraštės, pastraipos); nekeisti id ar skripto logikos be QA.

---

## 7. Susiję dokumentai

- [docs/INDEX.md](INDEX.md) – dokumentacijos navigacija (rolės, užduotys)
- [index.html](../index.html) – LT bazinė struktūra (vartotojas mato `lt/` arba `en/`)
- [scripts/build-locale-pages.js](../scripts/build-locale-pages.js) – CMO v2 blokų inject + EN_REPLACEMENTS
- [data/](../data/) – JSON šaltiniai (en-prompt-bodies, lt/en-prompt-expected, lt/en-scenarios)
- [STYLEGUIDE.md](../STYLEGUIDE.md) – spalvų paletė, komponentai, tipografija
- [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) – LT/EN keliai ir sinchronizacija
- [tests/structure.test.js](../tests/structure.test.js), [package.json](../package.json) (`npm test`) – struktūros ir regresijų kontraktas
- [AGENTS.md](../AGENTS.md) – agentų rolės ir užduočių seka
- [docs/DOCUMENTATION.md](DOCUMENTATION.md) – dokumentų inventorius
- [DEPLOYMENT.md](../DEPLOYMENT.md) – deploy primary + mirror, BASE_PATH

---

**Paskutinis atnaujinimas:** 2026-05-15
