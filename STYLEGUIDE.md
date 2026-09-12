# DI Promptų Biblioteka – stiliaus gidas (Spin-off Nr. 2)

**Versija:** 1.6.1  
**Data:** 2026-09-03  
**Kalba:** LT  
**Kryptis:** Product Operator (warm paper atmosphere; Fraunces **only** hero H1; Source Sans 3 product UI; JetBrains Mono prompts)

Spin-off Nr. 2 (Rinkodaros vadovo turinio DI sistema) naudoja **Prompt Anatomy** brandą iš mother repo [DITreneris/promptanatomy](https://github.com/DITreneris/promptanatomy). Spalvų kanonas: auksas + ink (+ teal kaip antrinis). Sinchronizacija: [docs/BRAND_SYNC.md](docs/BRAND_SYNC.md). Hero diagramos gramatika adaptuota iš sister [DITreneris/blog](https://github.com/DITreneris/blog) (ne Inter, ne dark full-bleed hub).

---

## 0. DS 1.6.1 – Product Operator (atmosphere)

### 0.1 Principai

- **Viena gramatika:** warm paper shell + serif tik hero H1 + navy product diagram (ne ebook cover, ne cool slate).
- Tipografija: Fraunces = marketing H1; visa produkto UI = Source Sans 3. Inter nenaudojamas.
- Trys paviršiai: `page` | `panel` | `accent` – ne kiekviena sekcija = kortelė; open lieka open.
- Hero = full-bleed warm paper; pirmas viewport = brand + H1 + viena eilutė + tool-first CTA + **sample output image** (Satori still + prompt caption — not pipeline modules, not prompt-only).
- Gold ≈ **5%**: primary CTA fill, selected/focus ring, surface/border accents – **never** body text or link `color` (use ink `--color-text-primary`; gold fails WCAG AA as text on light).
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

**Glossary:** Prompt Anatomy = brand; Content AI System = product; **workflow** = free library unit (display 1–4 = IDs 1/2/3/5); **prompt** = copyable body; **brief** = **primary** free tool; **Pro kit** = full 10 offline.

1. Hero: logo + page-level sticky `#siteNav` (Workflows · Brief builder · Pricing; sibling of `.header`, not hero-clipped); **no lang switcher**; H1 once; `#heroProof` *Free below — no account.*; trust IDs `#heroTrustPill1/2/3` as one muted inline row (no pill chrome); primary `#heroCtaSpine` **Build my prompt** → `#creative-brief`; `#heroCtaBrief` **See pricing** text link → `#pdf-storefront`; `.hero-diagram` = **sample image** (`.hero-sample-image`) + prompt caption *From brief → image prompt* — no pipeline modules / outputs row  
2. **Use now:** EN `#creative-brief` (`#cb-builder` **open**)  
3. `#pdf-storefront` — 2 cards (Starter + Complete); Pro = text link  
4. Progress of 4 + jump (Plan·Create·Check·Improve · Pricing · Brief · FAQ; **not** sticky)  
5. Library: prompts 1, 2, 3, 5 (display 1–4) + closed `#cmo-context` → `#cmo-safety` → `#cmo-scenarios` → `#pro-contents`  
6. Usage strip + copy tips (demoted) → FAQ → `#prompt-basics` → rest  

Tool-first: primary `#heroCtaSpine` → `#creative-brief`. Do not put Prompt 1 before the builder. No top status pills.

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
| `--color-surface-page` | `#F6F1E8` | Šiltas popierius |
| `--color-surface-subtle` | `#EEE6D8` | Antrinis paviršius |
| `--color-text-primary` | `#0F172A` | Pagrindinis tekstas |
| `--color-text-secondary` | `#475569` | Antrinis tekstas |
| `--color-border-default` | `#E0D6C6` | Šilti rėmeliai |

### 1.3 Semantinės

| Kintamasis | Naudojimas |
|------------|------------|
| `--color-semantic-success` | Sėkmė (toast, checkbox) |
| `--color-semantic-error` | Klaidos |
| `--community-cta-green` | Telegram CTA |

**PDF spausdiniam:** footer navy `#0F2A44` – tik PDF, ne web UI.

---

## 2. Hero ir diagram

- **Hero fonas:** `--hero-bg` – šiltas gold radial ant popieriaus (`#F6F1E8` → `#EDE4D4`); **full-bleed** (ne kortelė).
- **CTA:** `--cta-bg` gold gradient; ink text; `--shadow-cta` restrained.
- **CTA kontraktas:** primary `#heroCtaSpine` → `#creative-brief` (EN: **Build my prompt**); secondary `#heroCtaBrief` **See pricing** → `#pdf-storefront`. LT primary lieka `#block1`.
- **Vizualas:** `.hero-diagram` – navy card ~38rem with `.hero-sample-image` (Satori still) + `<pre class="hero-brief-sample">` caption *From brief → image prompt*. **Not** pipeline modules; **not** PDF cover; no H1 restatement inside the card. Breakout 1120–1200px. `/lt/` keeps the 30-day table.
- Eyebrow ≠ subhead (no duplicate message). Trust IDs stay (`#heroTrustPill1/2/3`) as muted inline text. Pro/offline lives in FAQ/storefront, not hero. Lang switcher is utility (no gold active state).

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
- **1.6.1** – Atmosphere: warm paper (`#F6F1E8`); EN hero = Satori sample image + prompt caption; builder output pane = navy studio; Complete card visual weight  

---

*Atnaujinta 2026-09-03 – DS 1.6.1 Product Operator (atmosphere).*
