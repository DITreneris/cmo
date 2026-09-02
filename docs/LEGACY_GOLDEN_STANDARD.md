# Legacy Golden Standard – DI Promptų Biblioteka (Spin-off Nr. 2)

**Tikslas:** Dabartinis kodas yra atskaitos taškas (legacy golden standard). Keičiant **turinį** (promptus, antraštes, aprašymus) – būtina laikytis šios struktūros ir konvencijų. Struktūros, ID, CSS klasių ir JavaScript API nekeičiame be QA patvirtinimo ir šio dokumento atnaujinimo. Projektas: Spin-off Nr. 2 (10 promptų CMO rinkiniui).

**Versija:** 2.0
**Data:** 2026-05-31
**Kalba:** LT

---

## 0. Šaltinio modelis (svarbiausia)

### Locale politika (nuo 2026-05-31)

| | `/en/` | `/lt/` |
|---|--------|--------|
| **Statusas** | **Kanoninė produkto versija** | **Užšaldyta** (tester snapshot) |
| **Turinys / UX / Commerce** | Aktyvus vystymas | Neredaguoti be Orchestrator „LT snapshot refresh“ |
| **Release QA** | Pilnas checklist | CI smoke tik |

**SEO:** `hreflang x-default` → `/en/`. **Commerce:** jau EN-only (§7). Žr. [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) §0.

### Build pipeline

Faktinis **vartotojui matomas puslapis ≠ root [`index.html`](../index.html)**. Kanonas – **`en/index.html`** (`/en/`). Vartotojas gali atidaryti ir `/lt/` (testeriams), bet ji ne roadmap.

```
index.html (legacy struktūrinis šaltinis – DOM + LT <pre> branduolys)
  + data/en-*.json (EN kanonas: prompt bodies, expected, scenarios)
  + data/lt-*.json (užšaldyta snapshot – ne sinchronizuoti su kiekvienu EN PR)
  + scripts/build-locale-pages.js (inject CMO v2, EN_REPLACEMENTS, SEO, JSON-LD)
     ↓ npm run build
lt/index.html (užšaldyta), en/index.html (kanonas), js/en-prompt-bodies-inline.js
```

**CMO v2 blokai (`#cmo-context`, `.prompt-expected`, `#cmo-safety`, `#cmo-scenarios`, `window.__CMO_COMPILE` patch) NĖRA `index.html` faile** – jie įterpiami build metu ir egzistuoja tik `lt/`, `en/` ir `public/` failuose. Build skriptas validuoja jų buvimą per `assertEnLocaleAdditions` / `assertLtLocaleAdditions` ([scripts/build-locale-pages.js](../scripts/build-locale-pages.js) ~ eilutės 1417–1462) – be jų build krenta.

**LT/EN lokalizacija:** DOM (id, class, data-*), a11y struktūra lieka tie patys abiem kalbom. **Terminologija:** LT – **DI**, EN – **AI**. **Turinio kanonas – EN** (`data/en-prompt-bodies.json` → `<pre>` EN; LT `<pre>` root'e – legacy snapshot, ne aktyvus vystymas).

**Build ir deploy:**
- **Primary host:** `https://promptanatomy.space` (Vercel), default `BASE_PATH = ''` (testai tai patvirtina).
- **Mirror:** `https://ditreneris.github.io/cmo/` (GitHub Pages), aktyvuojamas su `BASE_PATH=/cmo`.
- Override per env `SITE_ORIGIN` / `BASE_PATH`. Žr. [DEPLOYMENT.md](../DEPLOYMENT.md).

**Sinchronizuota su kodu (2026-08-11, EN path cut):** skip-link; hero **spine-first** + Product Operator (full-bleed `.header`, brand mark, **no top status pills**; slim `.hero-diagram` Plan→Create→Check→Improve pipeline + caption only — **no** outputs row / tagline / cycle-stepper / provider hub / `#framework-schema`); `#heroProof`; muted `#heroTrustPill1/2/3` chips — No signup · ChatGPT + Claude · 4 workflows free; primary EN `#heroCtaSpine` → `#block1` **Start your first workflow**; secondary `#heroCtaBrief` → `#creative-brief` as **text link**); **eiliškumas:** `#executive-summary` → optional `#copy-tips` → closed `#cmo-context` → `#progressIndicator` (`aria-valuemax="4"`) → `#progressJump` (1,2,3,5 · Pro · Brief · FAQ) → **interactive spine** 1,2,3,5 → thin `#cmo-safety` → EN `#creative-brief` (teaser + closed `#cb-builder`) → `#cmo-scenarios` → `#pro-contents` → EN `#pdf-storefront` (**3 cards, no comparison table**) → FAQ → `#prompt-basics`. **Meme slotų nėra**. Dizainas: [STYLEGUIDE.md](../STYLEGUIDE.md) **1.6**. Žr. [CREATIVE_BRIEF_BUILDER.md](CREATIVE_BRIEF_BUILDER.md).

---

## 1. Santrauka

| Kategorija | Fiksuota (nekeičiame keisdami turinį) | Leidžiama keisti (turinys) |
|------------|----------------------------------------|----------------------------|
| **HTML** | Struktūra: `<main id="main-content">`, sekcijos, 4× interactive spine + `#pro-contents` (6× `data-teaser-prompt` / `#block4/6–10`), id `block1`–`block10`, spine `prompt1/2/3/5`, CMO v2 (`cmo-context`, `cmo-safety`, `cmo-scenarios`, `expected1/2/3/5`) | Tekstai: hero, objectives, instrukcijos, titles/desc, spine `<pre>` (EN via `data/en-prompt-bodies.json`), Pro catalog copy, community, footer |
| **CSS** | Tokenai ([styles/design-tokens.json](../styles/design-tokens.json) → [styles/tokens.css](../styles/tokens.css)), komponentai ([styles/components.css](../styles/components.css) – DS 1.6 hero/surfaces), utilities – žr. [STYLEGUIDE.md](../STYLEGUIDE.md) **1.6** | Nėra (turinio keitimas neturi keisti klasių ar layout) |
| **JS** | IIFE `index.html`; CONFIG, selectText, copyPrompt, handleCodeBlockKeydown, fallbackCopy, showSuccess/showError/showToast, localStorage raktai `di_prompt_done_1`…`10`, debounce; locale resolve, uiText, applyStaticLocaleText, LANG_KEY `di_promptu_biblioteka_lang`. **Event binding:** `addEventListener` per `DOMContentLoaded` (be inline `onclick`/`onkeydown` – `tests/structure.test.js` to reikalauja). **CMO v2 (tik build output):** `window.__CMO_COMPILE` hook, `sessionStorage` kontekstui | Nėra |
| **A11y** | Skip link `#main-content`, role="button"/tabindex="0" ant .code-block, aria-label mygtukams ir checkbox, aria-live/role="progressbar", toast role="status" | Nėra (prieinamumo atributų reikšmes keisti tik pagal reikalavimus, nekeičiant struktūros) |

**Promptų turinio formatas:** Kiekvieno prompto tekstas `<pre class="code-text">` laikosi šablono: **META** (vaidmuo su patirtimi, tikslas, auditorija, kontekstas), **INPUT** (konkretūs duomenys/placeholderiai, apribojimai), **OUTPUT** (formatas, struktūra, kalba, tonas). Keičiant turinį – išlaikyti šią struktūrą.

---

## 2. HTML struktūros schema

```
index.html (legacy struktūrinis šaltinis) → po `npm run build` → lt/index.html (užšaldyta), en/index.html (kanonas)
├── <a class="skip-link" href="#main-content">Pereiti prie turinio</a>
├── <div class="container">
│   └── <main id="main-content">
│       ├── <header class="header">        (full-bleed; brand; #heroCtaSpine + #heroCtaBrief; #heroTrustPill*; .header-visual .hero-diagram)
│       ├── <section id="executive-summary" class="objectives--skim">
│       ├── <section class="instructions"> (#copy-tips only; no #framework-schema)
│       ├── [build inject @ <!-- CMO_CONTEXT -->] <section id="cmo-context"> (closed details)
│       ├── <div id="progressIndicator">   (max 4 – spine only)
│       ├── <nav id="progressJump">        (1,2,3,5 · Pro · Brief · FAQ; LT strips Brief)
│       ├── 4× <article class="prompt"> …  (spine 1,2,3,5; #prompt1PathHint on prompt 1)
│       ├── [build inject @ <!-- CMO_SAFETY -->] <section id="cmo-safety"> (EN: thin + closed details)
│       ├── [build inject EN @ <!-- CMO_CREATIVE_BRIEF -->] <section id="creative-brief"> (teaser + #cb-builder)
│       ├── [build inject @ <!-- CMO_SCENARIOS -->] #cmo-scenarios (details)
│       ├── <section id="pro-contents"> … 6× [data-teaser-prompt] #block4/6–10 (catalog rows, not .prompt cards)
│       ├── [build inject EN] <section id="pdf-storefront"> (3 cards; no comparison table)
│       ├── <section id="faq">
│       ├── <details id="prompt-basics">
│       ├── <section id="ecosystem-strip">
│       ├── <section class="community" id="community">
│       └── <footer class="footer">
│       `#stickyPromptBar` (mobilus, ≤768px)
├── <textarea class="hidden" id="hiddenTextarea" aria-hidden="true">
└── <div class="toast" id="toast" role="status" aria-live="polite" aria-label="Kopijavimo pranešimas">
```

**Būtini ID ir atributai (nekeisti):**

- `main-content`, `progressIndicator`, `progressText`, `progressBarFill`, `toast`, `hiddenTextarea`, `ecosystem-strip`, `ecosystem-strip-title`, `progressJump`, `progressJumpCreative` (EN), `heroTrustPill1`, `heroTrustPill2`, `heroTrustPill3`, `heroProof`, `heroCtaSpine`, `heroCtaBrief`, `prompt1PathHint`
- Kiekvienam promptui: `id="block1"` … `id="block10"`, `id="prompt1"` … `id="prompt10"`
- Mygtukas: `data-prompt-id="prompt1"` … `"prompt10"`, `aria-label="Kopijuoti promptą N į darbinių atmintinę"`
- Checkbox: `data-prompt-id="1"` … `"10"`, `aria-label="Pažymėti, kad atlikai šį žingsnį"`
- Progreso juosta: `.progress-bar` turi `aria-valuemax="4"` ir EN `aria-label` / `progressText` „of 4 workflows“ (pradžia); JS skaičiuoja tik spine checkboxes 1/2/3/5
- Info-box: `aria-label="Informacija: promptas N"` (N 1–10)
- **CMO v2 (tik `lt/`, `en/`):** `cmo-context`, `cmo-safety`, `cmo-scenarios`, `expected1` … `expected10`, `cmoCtxAudience`, `cmoCtxOffer`, `cmoCtxChannels`, `cmoCtxGoal`, `cmoCtxConstraint`
- **Creative brief (tik EN build, įskaitant mirror):** `creative-brief`, `cb-title`, `cb-builder` (default closed), `cbForm`, `cbOutput`, `cbCopyBtn`, `cbQuality`, `cbQualityHint`; žr. [CREATIVE_BRIEF_BUILDER.md](CREATIVE_BRIEF_BUILDER.md)
- localStorage raktai: `di_prompt_done_1` … `di_prompt_done_10`
- `sessionStorage` (CMO v2): konteksto laukai (audience, offer, channels, goal, constraint); creative brief draft: `cmo.creativeBrief.v1`

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
- [ ] Free spine 1,2,3,5: full interactive (`.prompt-header` → body → footer, `#promptN`, copy, done). Pro 4/6–10: `#pro-contents` catalog rows (`data-teaser-prompt`, `#blockN`), **ne** `.prompt--teaser` / be `#promptN` / copy / checkbox. 0× `.prompt-details` free page.
- [ ] Progress: tik spine checkboxes; „of 4“ / `aria-valuemax="4"`.
- [ ] **NE pridėti** inline `onclick` / `onkeydown` atributų – binding per `addEventListener`.
- [ ] Eiliškumas: `#cmo-context` → progress → spine 1/2/3/5 → `#cmo-safety` → EN `#creative-brief` (collapsed builder) → `#cmo-scenarios` → `#pro-contents` → EN storefront (no comparison table) → FAQ → `#prompt-basics`.
- [ ] Meme: **0** `meme-slot-*` gyvoje UI.
- [ ] CMO v2 blokai (`#cmo-context`, `.prompt-expected`, `#cmo-safety`, `#cmo-scenarios`, `window.__CMO_COMPILE`) **negali būti rankomis kuriami `index.html`** – jie generuojami iš build skripto + `data/*.json` (anchor'iai `<!-- CMO_SAFETY -->`, `<!-- CMO_SCENARIOS -->`).
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
- `lt/privatumas.html` – LT privatumas (užšaldyta; free-only scope).
- `en/privacy.html` – **kanoninė** privatumo versija (canonical: `https://promptanatomy.space/en/privacy.html`).

**Bendros taisyklės (visoms versijoms):**
- ID: `back-link`, `back-link-footer` – naudojami inline skriptu, kuris nustato `href` pagal `document.referrer` (jei kelias turi `/lt` → `lt/`, `/en` → `en/`, kitaip → `index.html`).
- **Keisti leidžiama:** tik teksto turinys (antraštės, pastraipos); nekeisti id ar skripto logikos be QA.

---

## 7. Mokama PDF tarpinė (EN-only, primary host) – v1.6.0+

**Apimtis:** Mokama CMO PDF tarpinė pridėta v1.6.0. Kontraktas yra papildomas, ne pakeičiantis – ankstesnės taisyklės (§0–§6) lieka galioti nepakeistos.

### 7.1. Kalbinė ir host'inė izoliacija (privaloma)

- **Tik EN, tik primary.** Visi mokami komercijos elementai (storefront, kainos, Stripe nuorodos, success/terms/coming-soon, paid PDF processors privacy bloke) gyvena **tik** `en/index.html` ir `https://promptanatomy.space`. LT (`lt/index.html`, `lt/privatumas.html`) ir GitHub Pages mirror (`ditreneris.github.io/cmo`) NETURI:
  - `id="pdf-storefront"`
  - `$3.99` / `$8.99` (kainos)
  - `https://buy.stripe.com/...` (jokios Stripe nuorodos)
  - `/api/*` route'ų (jie egzistuoja tik Vercel runtime)
- **Mirror politika:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) deploy job nustato `MIRROR_NOTE: '1'`. [scripts/build-locale-pages.js](../scripts/build-locale-pages.js) `injectPdfStorefront()` skip'ina bloką, jei `MIRROR_NOTE === '1'`.
- **`assertEnLocaleAdditions(html)`** privalo patikrinti: jei `MIRROR_NOTE === '1'` – `#pdf-storefront` NĖRA; kitu atveju – yra ir turi `$3.99`, `$8.99`, `.pdf-card`.
- **`assertLtLocaleAdditions(html)`** privalo patikrinti: `#pdf-storefront` NIEKADA neatsiranda LT pusėje.

### 7.2. Single source of truth – `config/sot.json`

| Laukas | Reikalavimas |
|--------|--------------|
| `commerce.scope` | Privalo būti `"en-only"`. |
| `commerce.products` | Tiksliai 3 elementai: `id: "starter"` ($3.99 / 399 cents / 14 p.), `id: "pro"` ($8.99 / 899 cents / 30 p.), `id: "bundle"` ($10.99 / 1099 cents / 44 p.). Public pavadinimai: „CMO AI Content System · Starter / Pro / Complete Kit". |
| `commerce.allowPlaceholderCheckout` | `true` (placeholder mode, prieš live Stripe) ARBA `false` (live, abu Payment Link URL'ai užpildyti). |
| `commerce.placeholderHref` | Ne tuščia eilutė (default `/coming-soon.html`). |
| `commerce.stripePaymentLinks.{starter,pro}` | Tuščia eilutė (placeholder mode) ARBA `https://buy.stripe.com/...` URL (live mode). |
| `site.host` | `"promptanatomy.space"` |
| `site.mirror.renderPaidStorefront` | `false` (sąmoninga politikos deklaracija) |

`api/_lib/fulfillment.js` `PRODUCTS` map ir `config/sot.json` `commerce.products` privalo sutapti `priceCents` ⇆ `amountCents` (`tests/fulfillment-config.test.js` to validuoja).

### 7.3. Privatūs PDF (niekada `public/`, niekada git)

- PDF dirbiniai gyvena **tik** [`api/_private/pdfs/`](../api/_private/pdfs/) (lokalus build) ir Vercel Blob privačiame store (production runtime). Niekada `public/`, niekada git.
- [`scripts/vercel-export-public.js`](../scripts/vercel-export-public.js) `assertNoPaidPdfsLeaked()` blokuoja deploy, jei rastų `.pdf` po `public/` arba `api/_private/`.
- `.gitignore` rules: `api/_private/`, `assets/paid-pdfs/`, `docs/pdf-source/*.pdf`. Aiškiai NE-ignoruoja `assets/pdf-covers/` (cover thumbnails commit'inami).

### 7.4. API routes contract (Vercel serverless)

| Route | HTTP | Specifikuotas elgesys |
|-------|------|----------------------|
| `/api/stripe-webhook` | POST | `bodyParser: false` (raw body); validuoja `Stripe-Signature`; idempotent per Redis lock + `fulfillment:cs_*` būseną; pasirašo download token, įrašo metaduomenis su 7 d. TTL, siunčia Resend laišką. |
| `/api/download-link` | GET `?session_id=...` | Polling endpoint success.html'ui. 200 + `{url}` jei paruošta; 202 jei vis dar fulfillment'as; 404 jei session nežinoma; 500 server klaidoms. Jokios autentikacijos – tik per session_id. |
| `/api/download` | GET `?t=<signed>` | Validuoja HMAC parašą + Redis token metaduomenis; load'ina PDF iš `PDF_CMO_*_SOURCE_URL` (Vercel Blob private URL); siunčia bytes su `Cache-Control: private, no-store`; suvartoja `download-token:jti` (single-use). |
| `/api/fulfillment-health` | GET | Vieša sveikatos patikra. JSON: `{ ok, redis: "PONG"\|null, missing: [env], siteUrl }`. Jokios autentikacijos. |

### 7.5. Storefront blokas (EN, ne-mirror)

- Įterpiamas **po** `<section class="upgrade-section" id="faq">`, **prieš** `<section class="upgrade-section ecosystem-strip" id="ecosystem-strip">`.
- Vidinė ID/struktūra: `#pdf-storefront` → `.pdf-storefront-teaser` (matomas teaser) + `<details class="pdf-storefront-details">` (grid, compare, buyer FAQ, trust) → `.pdf-storefront-grid` (`role="list"`) → 3 × `<article class="pdf-card" id="pdf-card-{starter|pro|bundle}">`.
- CTA href:
  - **Live mode:** `https://buy.stripe.com/...` (Stripe Payment Link), `target="_blank"`, `rel="noopener noreferrer"`, `data-placeholder="false"`.
  - **Placeholder mode:** `/coming-soon.html` (relative, same-origin), `data-placeholder="true"`, jokio target/rel.
- Klasė `no-print` ant section'o – browser Print režime storefront paslepiamas.

### 7.6. Privacy / Terms kontraktas

- [`en/privacy.html`](../en/privacy.html) privalo turėti `id="paid-pdf-data"` sekciją, kuri vardinę paminėtų **Stripe**, **Resend**, **Upstash**, **Vercel Blob** kaip procesorius. [`lt/privatumas.html`](../lt/privatumas.html) NEGALI šių paminėti (LT scope free-only).
- [`terms.html`](../terms.html) privalo turėti `id="paid-pdf-license"` sekciją (Team License) + `14-day` refund tekstą.

### 7.7. Build rezultatų contract

- `npm run build` (be `MIRROR_NOTE`): `en/index.html` turi storefront + `$3.99` + `$8.99`; `lt/index.html` neturi; `public/` apima `success.html`, `terms.html`, `coming-soon.html`, `assets/pdf-covers/`; nėra jokių `.pdf` failų `public/`-e.
- `MIRROR_NOTE=1 npm run build`: `en/index.html` storefront NEturi; viskas kita lieka identiška.

---

## 8. Susiję dokumentai

- [docs/INDEX.md](INDEX.md) – dokumentacijos navigacija (rolės, užduotys)
- [index.html](../index.html) – legacy struktūrinis šaltinis; **produkto kanonas – `en/`**
- [scripts/build-locale-pages.js](../scripts/build-locale-pages.js) – CMO v2 blokų inject + EN_REPLACEMENTS
- [data/](../data/) – JSON šaltiniai (en-prompt-bodies, lt/en-prompt-expected, lt/en-scenarios)
- [STYLEGUIDE.md](../STYLEGUIDE.md) – dizaino sistema **1.6** (Product Operator)
- [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) – EN kanonas, LT freeze, keliai ir build
- [tests/structure.test.js](../tests/structure.test.js), [tests/design-system-smoke.test.js](../tests/design-system-smoke.test.js), [package.json](../package.json) (`npm test`) – struktūros / DS regresijos
- [AGENTS.md](../AGENTS.md) – agentų rolės ir užduočių seka
- [docs/DOCUMENTATION.md](DOCUMENTATION.md) – dokumentų inventorius
- [DEPLOYMENT.md](../DEPLOYMENT.md) – deploy primary + mirror, BASE_PATH

---

**Paskutinis atnaujinimas:** 2026-08-11 (EN path cut: slim pre-spine + collapsed brief + no storefront comparison)
