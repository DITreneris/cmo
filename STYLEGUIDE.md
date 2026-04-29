# DI Promptų Biblioteka – stiliaus gidas (Spin-off Nr. 2)

**Versija:** 1.2  
**Data:** 2026-02-19  
**Kalba:** LT

Šis dokumentas aprašo spalvų gamą, tipografiją ir komponentų stilius projekte – Spin-off Nr. 2 (Rinkodaros vadovo AI operacinė sistema). Oranžinė pagrindinė paletė pasirinkta dėl aukštesnio CTA.

---

## 1. Spalvų paletė

### 1.1 Pagrindinės spalvos

| Kintamasis | Hex | Paskirtis | WCAG pastaba |
|------------|-----|-----------|--------------|
| `--bg` | `#F7F8FA` | Puslapio fonas | Tekstas `--text` ant jo atitinka AA |
| `--text` | `#1A202C` | Pagrindinis tekstas, antraštės | Kontrastas ant `--bg` > 4.5:1 |
| `--text-light` | `#4A5568` | Antrinis tekstas, meta | Kontrastas ant `--bg` > 4.5:1 |
| `--white` | `#FFFFFF` | Kortelių fonas, mygtukų tekstas | Naudoti ant tamsių fonų (ant oranžinės CTA atitinka AA) |

### 1.2 Akcentai (brand) – oranžinė CTA paletė

| Kintamasis | Hex | Paskirtis | Naudojimas |
|------------|-----|-----------|------------|
| `--accent-primary` | `#c75515` | Pagrindinė oranžinė (WCAG2AA 4.5:1, mažesnė saturation) | CTA mygtukai, hero, progreso juosta |
| `--accent-primary-hover` | `#b54f14` | Tamsesnė oranžinė | Hover būsena CTA |
| `--accent-gold` | `#c75515` | Sutapatintas su primary oranžine | Badge, focus ring, paryškinti elementai |
| `--accent-gold-dark` | `#b54f14` | Sutapatintas su accent-primary-hover | Hover, numerio badge |
| `--accent-dark` | `#3C485A` | Antrinis akcentas (tamsiai pilka) | Outline mygtukai, borders, antraštės |
| `--accent-dark-hover` | `#2D3848` | Hover būsena | Antrinių mygtukų hover |

**Kontrastas:** Ant oranžinės (`--accent-primary`, `--cta-bg`) naudoti **baltą tekstą** (`--white`) – atitinka WCAG AA. Ant `--accent-dark` – **baltas tekstas** (`--white`).

### 1.3 Tertiarinė (bibliotekos identitetas)

| Kintamasis | Hex | Paskirtis |
|------------|-----|-----------|
| `--tertiary` | `#0D9488` | Teal – kategorijos, „Kas toliau?“ blokas, info box |
| `--tertiary-dark` | `#0a5c54` | Tamsesnė teal – info-box strong, kategorija |
| `--tertiary-hover` | `#0f766e` | Hover būsena – next-steps nuorodos |
| `--tertiary-light` | `#CCFBF1` | Šviesus teal fonas |

### 1.4 Semantinės ir pagalbinės

| Kintamasis | Naudojimas |
|------------|------------|
| `--cta-bg` | `#c75515` – pagrindinis CTA fonas (hero mygtukas, „Kopijuoti promptą“); WCAG2AA 4.5:1 |
| `--cta-hover` | Sutapatintas su `--accent-primary-hover` (#b54f14) – CTA hover |
| `--blue` | Sutapatintas su `--accent-dark` (3C485A) – objektų rėmeliai, antraštės |
| `--blue-light` | `#E8ECF0` – šviesus fonas gradientuose |
| `--orange` | `#c75515` – pagrindinė oranžinė (suderinta su CTA, WCAG2AA) |
| `--orange-light` | `#FFF7ED` – šviesus oranžinės atspalvis (instrukcijos, progreso wrap, code-block hover) |
| `--green` | `#38A169` – sėkmės būsena (toast, checkbox, „Nukopijuota“) |
| `--green-dark` | `#2F855A` – btn.success hover |
| `--error` | `#E53E3E` – klaidos (form-input.error, form-error) |
| `--bg-subtle` | `#F7FAFC` – prompt-footer fonas |
| `--border` | `#CBD5E0` – rėmeliai, atskyrimai |
| `--community-cta-green` | `#0E7A33` – bendruomenės CTA (hierarchija – atskirti nuo pagrindinio oranžinio) |
| `--community-cta-green-hover` | `#0B6B2D` – hover būsena |

---

## 2. Hero ir gradientai

- **Hero (header):** Vertikalus gradientas (180deg): tamsesnis viršuje, šviesesnis apačioje – mažesnė saturation.  
  - `--hero-gradient-start: #a85c32`, `--hero-gradient-mid: #c46d3d`, `--hero-gradient-end: #dc8f5e`.
  - **Overlay:** 8% tamsesnis sluoksnis (`rgba(0,0,0,0.08)`) – tekstas aiškesnis.
- **CTA:** `--cta-bg: #c75515` (oranžinė) – pagrindinis veiksmas; hover `--accent-primary-hover` (#b54f14). Baltas tekstas ant oranžinės atitinka WCAG2AA 4.5:1.
- **Prompt kortelės header:** `linear-gradient(to right, var(--blue-light), var(--orange-light))`, apatinis border: `--accent-dark`.

---

## 3. Tipografija

- **Šeima:** `'Inter', -apple-system, sans-serif`
- **Kodas:** `'JetBrains Mono', monospace`
- **Pagrindinis teksto dydis:** 18px (body), 16–19px sekcijose
- **Antraštės:** 22–52px, svoris 700–800 (priklausomai nuo lygio)
- **Hierarchija:** h1 (hero) 52px/800, h2 (sekcijos) 22–32px/800, meta tekstas 13–15px/700
- **Letter-spacing:** hero h1 `-0.01em` (ne per suspausta), badge (caps) `0.1em` (daugiau oro)
- **En-dash:** skaičiuose be tarpų (pvz. 30–50%); subtekste su tarpais („…šablonais – rezultatai…“)

---

## 4. Komponentai

### 4.1 Mygtukai

- **Pagrindinis (CTA):** `background: var(--cta-bg)` (oranžinė), `color: white`, `border-radius: 12px`, hover – `--cta-hover`, `translateY(-1px)`, focus-visible – `outline 3px` (hero baltas, kitur `--accent-gold`), `outline-offset: 2px`.
- **Sėkmės būsena:** `background: var(--green)` (pvz. „Nukopijuota“).
- **Antrinis (nuorodos „Kas toliau?“):** `background: var(--tertiary)`, hover `var(--tertiary-hover)`, focus-visible – oranžinio ringas.

### 4.2 Badge ir žymos

- **Hero badge:** pusiau skaidrus baltas fonas, baltas tekstas.
- **Kategorija (prompt kortelėje):** `background: var(--tertiary-light)`, `color/border: var(--tertiary)`.
- **Numeris (prompt kortelėje):** `background: var(--accent-gold)`, `color: var(--white)` (baltas tekstas ant oranžinės – WCAG AA).

### 4.3 Progreso juosta

- **Track:** `background: var(--border)`.
- **Užpildas:** `background: var(--accent-gold)`.
- **Wrap:** `background: var(--orange-light)`, `border: 2px solid var(--accent-gold)`.

### 4.4 Code block (promptų laukas)

- **Border:** `var(--accent-dark)`.
- **Hover:** `background: var(--orange-light)`, `border-color: var(--accent-gold)`.
- **Focus-visible:** `outline 3px var(--accent-gold)`.
- **„Spausk čia ir nukopijuok“ etiketė:** `background: var(--accent-dark)`, baltas tekstas.

### 4.5 Info box

- **Fonas:** `var(--tertiary-light)`, **border ir antraštė:** `var(--tertiary)`.

### 4.6 Instrukcijų blokas

- **Fonas:** `var(--orange-light)`, **border:** `var(--accent-gold)`, numeracija ir code – aukso atspalviai, antraštė – `var(--accent-dark)`.

### 4.7 Bendruomenė (community) CTA

- **Hierarchija:** vienas pagrindinis CTA (Telegram), antrinis – outline („Promptų anatomija“). Jokio glow – tik subtilus šešėlis.
- **Pagrindinis CTA (`.community-cta-primary`):** vienas brand green – `--community-cta-green: #0E7A33`, hover `--community-cta-green-hover: #0B6B2D`. Šešėlis: `0 6px 16px rgba(0,0,0,0.12)` (be glow). `border-radius: 12px`, font 18px / 600. Hover: `translateY(-1px)`. Focus-visible – `outline 3px var(--accent-gold)`, `outline-offset: 2px`.
- **Antrinis CTA (`.community-cta-secondary`):** outline stilius – `border: 2px solid var(--accent-dark)`, permatomas fonas, `margin-top: 16px`. Hover – šviesus fonas (`--blue-light`).
- **Kortelė:** `border: 1px solid var(--border)`, `border-radius: 16px`, šviesus šešėlis. Vertikalūs tarpai: h2 → 16px → subtext → 24px → primary CTA → 16px → secondary link.
- **Antraštė:** dvi eilutės („Nori daugiau?“ / „Prisijunk prie Telegram grupės.“) – mažesnis skaitymo tankis.

### 4.8 Border-radius skalė

- **20px:** hero (header), prompt kortelė (`.prompt`), modal, footer – dideli blokai.
- **16px:** objectives, instructions, next-steps, community – sekcijų kortelės.
- **12px:** mygtukai (CTA, .btn), code-block, progress-wrap, toast, next-steps nuorodos, community CTA.
- **8px:** badge, kategorija (`.category`), progress-bar.
- **6px:** code-block hint, prompt-time, progress-bar vidus; **4px:** progress-bar track.
- **50%:** apvalūs elementai (modal-close, toast icon).

---

## 5. Prieinamumas (a11y)

- Visi interaktyvūs elementai turi **focus-visible** būseną (3px outline, dažniausiai `--accent-gold` arba `--accent-dark`).
- **Kontrastas:** Tekstas ant fonų atitinka WCAG AA (normalus tekstas ≥ 4.5:1).
- **Redukuotas judesys:** `@media (prefers-reduced-motion: reduce)` – animacijos ir perėjimai sumažinami iki 0.01ms.
- Skip link, ARIA atributai ir semantinė struktūra išlaikomi pagal projekto taisykles.

---

## 6. Failų nuorodos

- Spalvos ir komponentai implementuoti: [index.html](index.html) (CSS bloke, `:root` ir atitinkamos klasės).
- Planas: žr. planą „Promptų Anatomija spin-off UI/UX“ (spalvų gama, vizualika, prioritetai).

---

## 7. Design system architektūra (v2)

- **Vienas tokenų šaltinis:** [styles/design-tokens.json](styles/design-tokens.json)
- **CSS sluoksniai:**
  - [styles/tokens.css](styles/tokens.css) – custom properties (semantiniai + scale tokenai)
  - [styles/components.css](styles/components.css) – komponentų bazė (`.btn`, `.prompt`, `.progress-wrap`, CTA)
  - [styles/utilities.css](styles/utilities.css) – focus ring utility, reduced motion ir cross-component taisyklės
- **Build lokalėms:** [scripts/build-locale-pages.js](scripts/build-locale-pages.js) perrašo `styles/` kelius į `../styles/` generuojant `lt/index.html` ir `en/index.html`.

## 8. Komponentų būsenų matrica (minimumas)

- **Interactive elementai (`.btn`, `.cta-button`, `.community-cta-*`):** `default`, `hover`, `focus-visible`, `success` (kur taikoma)
- **Code block (`.code-block`):** `default`, `hover`, `focus-visible`, `selected`
- **Progress (`.progress-wrap`, `.progress-bar-fill`):** `default`, dinamika per JS (`width`, `aria-valuenow`)
- **A11y minimumas:** skip-link, focus-visible, reduced-motion, aria-label ant interaktyvių valdiklių

## 9. Kokybės vartai

- `npm run test:design-system` – tikrina CSS sluoksnių importus, tokenų grupes ir esminius selektorius.
- `npm run test:a11y:smoke` – tikrina skip-link/focus-visible/reduced-motion/aria-label bazinius kriterijus LT/EN/root puslapiuose.
- Pilnas vartas prieš merge: `npm test`.

---

**Paskutinis atnaujinimas:** 2026-04-29
