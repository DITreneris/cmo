# Brand sync with mother repo

**Mother:** [DITreneris/promptanatomy](https://github.com/DITreneris/promptanatomy)  
**Pinned SHA:** `1b3a05e521b7697ce4aea142b0d1e3b07b9b867e` (2026-05-31)  
**Spin-off host:** `https://promptanatomy.space` (this repo)

This document tracks visual identity alignment with the Prompt Anatomy brand hub (`promptanatomy.app`). Product copy and SEO for `.space` live in [`config/brand-seo.json`](../config/brand-seo.json).

**Spin-off DS (web UI):** [STYLEGUIDE.md](../STYLEGUIDE.md) **1.6.2** Product Operator — Fraunces **hero H1 only** + Source Sans 3 product UI + JetBrains Mono prompts; full-bleed **warm paper** hero + navy sample card (grammar adapted from sister [DITreneris/blog](https://github.com/DITreneris/blog); not blog Inter / dark hub). Mother sync owns **gold + ink + favicon mark**; page/hero atmosphere (warm paper `#F6F1E8`) is a spin-off decision. Shared CSS warms `/lt/` paper without changing LT HTML.

---

## Color mapping

| Mother (`frontend/src/index.css` `@theme`) | Spin-off (`styles/design-tokens.json`) |
|--------------------------------------------|----------------------------------------|
| `--color-brand-dark` `#0b1320` | `color.brand.dark` |
| `--color-brand-accent` `#cfa73a` | `color.brand.primary` |
| `--color-brand-accent-hover` `#e8b93c` | `color.brand.primaryHover` |
| `--color-ecosystem-1` `#2e9e7e` | `color.brand.tertiary` |
| Hero bg `#f6f1e8` → `#ede4d4` (spin-off warm paper; mother remains gold+ink) | `tokens.css` `--hero-bg` |

**Print secondary (PDF footers only):** `#0F2A44` — not used for web UI.

---

## Asset inventory

| Asset | Source | Notes |
|-------|--------|-------|
| `styles/design-tokens.json` | Mother colors + spin-off type/shadow/space (DS 1.6.2) | Single source for CSS + OG; smoke asserts sync vs `tokens.css` |
| `favicon.svg` | **Derivative** of mother `frontend/public/favicon.svg` | Same lightning mark; ink `#0B1320` + gold `#CFA73A` (replaces legacy teal `#008579`) |
| `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png` | Generated: `npm run icons:export` | From local SVG |
| `site.webmanifest` | Local; `theme_color` `#0B1320` | `short_name`: PA Library |
| `og-v2.jpg` | Generated: `npm run generate:og` | Filename = `brand-seo.json` `ogImage.file`. Layout (ported from operator reference `v002.png`): navy tile + bolt lockup, 74px Fraunces headline (*One brief. One powerful image prompt.*), gold badge *Free AI Image Prompt Builder →*, navy card with uppercase *BRIEF → IMAGE PROMPT* label, handbag sample (`assets/hero/brief-sample-satori.png`), and a prompt panel with a copy icon. Copy from `ogVisual` (no price); colors from `design-tokens.json`; fonts only from `assets/fonts/og/` (OFL, resvg, system fonts off). **Any visual change bumps the filename** (`og-v3.jpg`, …) because `*.jpg` / `*.png` are served `immutable` for 1 year. A square centre crop shows the end of the headline and the card edge; landscape previews (LinkedIn, X, Facebook, Slack) are the target. |
| `og.png` | Legacy | Still exported to `public/` so old shares don't 404; no longer referenced |
| Mother `og-image.png` | Reference only | `.app` social preview; not copied to `.space` |

---

## Sync procedure

When mother updates brand tokens or `frontend/public/favicon.svg`:

1. Note new commit SHA on `main`.
2. Compare mother `frontend/src/index.css` `@theme` → update [`styles/design-tokens.json`](../styles/design-tokens.json) and [`styles/tokens.css`](../styles/tokens.css) if needed.
3. Reconcile [`favicon.svg`](../favicon.svg) geometry with mother SVG; run `npm run icons:export`.
4. If the OG card changes: bump `config/brand-seo.json` `ogImage.file`, then `npm run generate:og` and `npm run build`.
5. Run `npm test`.
6. Update **Pinned SHA** and date in this file.

---

## Entity footer (QW1b)

Mother contract: [DITreneris/promptanatomy `docs/sibling_memo.md`](https://github.com/DITreneris/promptanatomy/blob/main/docs/sibling_memo.md).

| Surface | Rule |
|---------|------|
| EN `/en/` `.footer-product-link` | `Part of Prompt Anatomy. This page is the Content AI System: META, INPUT, OUTPUT, then Plan → Create → Check → Improve. The course on promptanatomy.app is a separate product.` |
| Href | `https://www.promptanatomy.app/?utm_source=space&utm_medium=entity_footer&utm_campaign=ecosystem` |
| LT | Frozen — keep legacy spin-off line until Orchestrator snapshot refresh |
| Scope | Footer entity line only; not storefront CTAs, checkout routing, or a new promo component |
| EN Privacy (footer) | `/en/privacy/` (public slash URL; disk file stays `en/privacy.html`) |

Checkout stays on `promptanatomy.space` through the product cards and their live Stripe Payment Links. The `.app` footer link is methodology / brand context only.

The header lockup follows the hub brand manual §3: navy tile, gold bolt, split wordmark at weight 900. English pages say Prompt / Anatomy. The Lithuanian source says Promptų / Anatomija, and LT `og:site_name` matches. The footer line stays “Methodology at” because kit checkout is on this host.

---

## Related docs

- [STYLEGUIDE.md](../STYLEGUIDE.md) — web design system **1.6.2** (Product Operator)
- [DOCUMENTATION.md](DOCUMENTATION.md) — file inventory
- [AGENTS.md](../AGENTS.md) — locale policy (EN canon)
