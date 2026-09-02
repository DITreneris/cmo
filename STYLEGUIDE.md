# DI Promptų Biblioteka – stiliaus gidas (Spin-off Nr. 2)

**Versija:** 1.6  
**Data:** 2026-08-11  
**Kalba:** LT  
**Kryptis:** Product Operator (light SaaS shell; Fraunces **only** hero H1; Source Sans 3 product UI; JetBrains Mono prompts)

Spin-off Nr. 2 (Rinkodaros vadovo turinio DI sistema) naudoja **Prompt Anatomy** brandą iš mother repo [DITreneris/promptanatomy](https://github.com/DITreneris/promptanatomy). Spalvų kanonas: auksas + ink (+ teal kaip antrinis). Sinchronizacija: [docs/BRAND_SYNC.md](docs/BRAND_SYNC.md). Hero diagramos gramatika adaptuota iš sister [DITreneris/blog](https://github.com/DITreneris/blog) (ne Inter, ne dark full-bleed hub).

---

## 0. DS 1.6 – Product Operator

### 0.1 Principai

- **Viena gramatika:** light SaaS shell + serif tik hero H1 + navy product diagram (ne ebook cover).
- Tipografija: Fraunces = marketing H1; visa produkto UI = Source Sans 3. Inter nenaudojamas.
- Trys paviršiai: `page` | `panel` | `accent` – ne kiekviena sekcija = kortelė; open lieka open.
- Hero = full-bleed light plokštuma; pirmas viewport = brand + H1 + viena eilutė + spine-first CTA + **workflow diagram**.
- Gold ≈ **5%**: primary CTA, selected/focus, tiny highlights – ne kiekvienas border/link/chip.
- Elevations: **0** (border only) + **1** (subtle); optional stronger shadow tik `.hero-diagram`.
- Radii: **8 / 12 / 16** only; pill tik status labels.
- Skaitomumas: body 17px, prose `max-width: 70ch`.
- Anti-patternai: emoji chrome, trust pills as chrome, `border: 3px`, blanket `font-weight: 800`, Inter-as-display, card-every-section, serif on builder/prompt/instructions, gold-everywhere, dual CSS for same component.

### 0.2 Tipų poros

| Rolė | Šeima | Token |
|------|--------|--------|
| Display (**hero H1 only**; optional storefront/FAQ marketing H2) | Fraunces | `--font-display` |
| UI / body / section titles / builder / prompts chrome | Source Sans 3 | `--font-ui` |
| Code / prompts `<pre>` | JetBrains Mono | `--font-mono` |

Skalė: caption 12 → small 14 → body 17 → bodyLg 18 → title 1.35rem → display `clamp(...)`.

### 0.3 Paviršiai

| Klasė / map | Naudojimas |
|-------------|------------|
| `surface-page` / open | how-it-works (`#executive-summary`), instructions (if kept slim), FAQ, ecosystem, footer, community |
| `surface-panel` | `.prompt`, progress, storefront, system-map |
| `surface-accent` | `#cmo-context`, `#creative-brief`, `#cmo-safety`, `#cmo-scenarios` (gold left edge **sparingly**) |

### 0.4 Pre-spine IA (EN) + glossary

**Glossary:** Prompt Anatomy = brand; Content AI System = product; **workflow** = free spine unit (1/2/3/5); **prompt** = copyable body; **brief** = secondary tool; **Pro kit** = full 10 offline.

1. Hero: logo + compact lang; H1 once; `#heroProof`; trust chips (No signup · ChatGPT + Claude · 4 workflows free); primary `#heroCtaSpine` **Start your first workflow**; `#heroCtaBrief` **text link**; `.hero-diagram` (pipeline modules + caption only — no outputs row / tagline)  
2. `#executive-summary` — quiet usage sentence only (no second start CTA)  
3. Optional copy tips (`#instructions` details)  
4. `#cmo-context` (collapsed)  
5. Progress of 4 workflows + jump (1·2·3·5 · Pro · Brief · FAQ; no provider hub)  
6. Spine prompts 1→2→3→5  
7. `#cmo-safety` → `#creative-brief` → `#cmo-scenarios`  
8. `#pro-contents` catalog → storefront → FAQ → `#prompt-basics` → rest 

Spine-first: primary `#heroCtaSpine` → `#block1`. Do not lengthen path to first Copy. No top status pills.

---

## 1. Spalvų paletė (brand)

### 1.1 Brand (mother-aligned)

| Kintamasis | Hex | Paskirtis |
|------------|-----|-----------|
| `--color-brand-primary` | `#CFA73A` | Primary CTA, selected, focus, progress fill |
| `--color-brand-primary-hover` | `#E8B93C` | Hover |
| `--color-brand-primary-pressed` | `#B8922F` | Pressed |
| `--color-brand-dark` | `#0B1320` | Ink – antraštės, diagram card, outline |
| `--color-brand-tertiary` | `#2E9E7E` | Ekosistemos teal (not prompt category shout) |
| `--color-brand-tertiary-light` | `#CCFBF1` | Šviesus teal fonas |

Legacy alias – **ne naudoti oranžinės `#c75515`**.

### 1.2 Paviršiai ir tekstas

| Kintamasis | Hex | Paskirtis |
|------------|-----|-----------|
| `--color-surface-page` | `#F8FAFC` | Puslapio fonas |
| `--color-text-primary` | `#0F172A` | Pagrindinis tekstas |
| `--color-text-secondary` | `#475569` | Antrinis tekstas |
| `--color-border-default` | `#E2E8F0` | Rėmeliai |

### 1.3 Semantinės

| Kintamasis | Naudojimas |
|------------|------------|
| `--color-semantic-success` | Sėkmė (toast, checkbox) |
| `--color-semantic-error` | Klaidos |
| `--community-cta-green` | Telegram CTA |

**PDF spausdiniam:** footer navy `#0F2A44` – tik PDF, ne web UI.

---

## 2. Hero ir diagram

- **Hero fonas:** `--hero-bg` – šviesus gradientas; **full-bleed** (ne kortelė).
- **CTA:** `--cta-bg` gold gradient; ink text; `--shadow-cta` restrained.
- **CTA kontraktas:** primary `#heroCtaSpine` → `#block1` (EN: **Start your first workflow**); secondary `#heroCtaBrief` text link. Brief is never primary.
- **Vizualas:** `.hero-diagram` – navy card ~38rem, Plan → Create → Check → Improve modules with product descs + figcaption only (no outputs row / tagline / cycle-stepper duplicate). Accessible label visually hidden; **not** PDF cover; no H1 restatement inside the card.
- Eyebrow ≠ subhead (no duplicate message). Trust = three muted chips (`#heroTrustPill1/2/3`); Pro/offline lives in FAQ/storefront, not hero. Lang switcher is utility (no gold active state).

---

## 3. Tipografija

- **Display:** Fraunces 500–700 – **hero H1 only** (optional marketing H2 on storefront/FAQ).  
- **UI/body:** Source Sans 3 400–700 – section titles, builder, prompt titles, instructions.  
- **Kodas:** JetBrains Mono 500–600  
- **Body:** 17px, line-height ≥ 1.5  
- **Prose measure:** `--measure-prose` (70ch)

---

## 4. Komponentai

### 4.1 Mygtukai

- **Primary CTA:** `var(--cta-bg)`, `border-radius: 12px` (`--radius-md`).
- **Secondary:** outline ink.
- Brief presets: **neutral** chips; selected = gold.

### 4.2 Badge / chips

- One chip system for prompt meta: number, category, time, status.
- No competing teal 2px borders + peach pills + gold glow numbers.

### 4.3 Progress

- Fill: brand primary; `aria-valuemax="4"` (spine only).
- Cycle is communicated by hero diagram + how-it-works; no redundant loud stepper chrome.

### 4.4 Code block

- Border 1px; focus brand primary.

### 4.5 Icons

- Line icons ~18–20px, stroke 1.5–1.75, ink/slate; gold only active. **No emoji chrome.**

### 4.6 Border-radius

- `--radius-sm` 8px – chips/small controls  
- `--radius-md` 12px – buttons/inputs  
- `--radius-lg` 16px – cards/panels  
- `--radius-xl` aliases to 16px (no 20px panel radius)  
- `--radius-pill` – status only  

### 4.7 Shadows

- Elevation 0: border, no shadow  
- Elevation 1: `0 8px 24px rgba(15, 23, 42, 0.06)`  
- `--shadow-hero-diagram`: stronger, diagram only  
- CTA: ink-tinted, restrained  

### 4.8 Motion budget (max 2–3)

- Progress fill, brief step current, CTA hover – `prefers-reduced-motion` gated.

### 4.9 Shell

- Content shell ≈ `max-width: 1120px`; consistent inline padding; controlled density (not luxury empty).

---

## 5. Prieinamumas (a11y)

- **focus-visible** su brand primary arba ink.  
- **prefers-reduced-motion** – utilities + components.  
- Skip link, ARIA – [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md).  
- Diagram: `figure` + accessible name/description.

---

## 6. Failų nuorodos

- **Tokenai:** [styles/design-tokens.json](styles/design-tokens.json) → [styles/tokens.css](styles/tokens.css)  
- **Komponentai:** [styles/components.css](styles/components.css) (DS 1.6 authoritative; no dual prompt chrome in `index.html`)  
- **Struktūra:** [index.html](index.html)  
- **SEO / OG:** [config/brand-seo.json](config/brand-seo.json)  
- **Sister diagram reference:** [DITreneris/blog](https://github.com/DITreneris/blog) `hero_architecture_diagram.html`  

---

## 7. Design system architektūra

- Vienas tokenų šaltinis + CSS sluoksniai: tokens → components → utilities  
- Build: [scripts/build-locale-pages.js](scripts/build-locale-pages.js)  

---

## 8. Komponentų būsenų matrica

- Interactive: `default`, `hover`, `focus-visible`, `success`  
- Code block: `default`, `hover`, `focus-visible`, `selected`  
- Progress: JS + `aria-valuenow`  

---

## 9. Kokybės vartai

- `npm run test:design-system` – tokens, fonts, JSON↔CSS, no 3px prompt borders, no emoji chrome in components  
- `npm run test:a11y:smoke`  
- Pilnas: `npm test`  

---

## 10. Brand sync

- Mother colors/favicon: [docs/BRAND_SYNC.md](docs/BRAND_SYNC.md)  
- Blog: diagram **grammar** only; type stack stays Source Sans 3 (not blog Inter).  

---

## 11. Versijų istorija

- **1.3** – gold/ink token pass, Inter, card stack  
- **1.4** – subtract chrome, type/space tokens  
- **1.5** – Editorial Operator (serif on section titles; PDF cover hero)  
- **1.6** – Product Operator: serif=hero H1; hero workflow diagram; gold/shadow/radius restraint; dual CSS kill; compact how-it-works  

---

*Atnaujinta 2026-08-11 – DS 1.6 Product Operator.*
