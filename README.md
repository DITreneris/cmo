# Content AI System

A static HTML product for marketing leaders. **Canon: [`/en/`](https://promptanatomy.space/en/)**. Free: a **creative brief builder** plus **4 workflows** (Plan → Create → Check → Improve). Full META bodies for all 10 prompts live in the Pro kit (PDF), not as ten interactive cards.

Part of [Prompt Anatomy](https://www.promptanatomy.app/). Copy → paste into ChatGPT or Claude. No account. No lead-gen backend.

## What you get

| Layer | What ships |
|-------|------------|
| **Free (`/en/`)** | Open brief builder → 2 kit cards (Starter + Complete; Pro is a text link) → library prompts **1, 2, 3, 5** (display 1–4) + Pro catalog `#pro-contents` |
| **Paid (primary host only)** | CMO AI Content System · Starter **$3.99** (14 p.) · Pro **$8.99** (30 p. + Markdown) · Complete **$10.99** (both, vs $12.98 separately) |
| **`/lt/`** | Frozen tester snapshot — no storefront, no brief. Direct URL only. Root `/` always redirects to `/en/`. |

Stripe checkout, webhook, and signed downloads run only on **[promptanatomy.space](https://promptanatomy.space)**. The GitHub Pages mirror omits `#pdf-storefront`.

Roadmap (R1 cash register → R2 GEO → R3 one more local tool → R4 Install): [roadmap.md](roadmap.md). Active Stripe ops: [todo.md](todo.md) → [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md).

## How to use

1. Open the [primary EN page](https://promptanatomy.space/en/) (or the [mirror](https://ditreneris.github.io/cmo/en/) for the free library only).
2. **Start in the brief builder** (open by default). Fill the brief → copy an image-ready prompt into ChatGPT or Ideogram. Nothing leaves the browser.
3. Optionally **See pricing** for Starter / Complete (Pro is a text path). Checkout is Stripe on `.space`.
4. Use the four workflows below the kits: select a prompt → **Copy prompt** (session context + non-negotiable rules prepend when filled) → paste into ChatGPT or Claude.
5. Mark “done” if you want — progress is `localStorage` only (4 of 4).

Prompts **4, 6–10** are catalog rows in `#pro-contents`, not copyable cards. Full bodies are in Pro / Complete.

## Free workflows (library)

1. **30-day content system** — plan on four principles (Authority, Problem, Example, Offer)
2. **One idea → 7 formats** — LinkedIn, carousel, 30s video, email, cover, ad, 3 hooks
3. **LinkedIn authority** — 150–200 words with hook, proof, CTA
4. **Daily review (Check → Improve)** — metrics → what failed, why, what to do next *(internal id `#block5`)*

Pro catalog (offline in the kit): 30s video, objections, lead post + DM sequence, case-study structure, pillar topics, control-center prompt.

## SEO / GEO (generated — do not hand-edit)

Build emits from [`config/sot.json`](config/sot.json) + [`scripts/geo-surfaces.js`](scripts/geo-surfaces.js):

- `robots.txt`, `sitemap.xml`, `llms.txt` / `llms-full.txt` (hash hubs on `/en/#…`)
- `manifest.webmanifest` (`start_url: /en/`), `404.html` (EN → `/en/`)
- IndexNow key file + `npm run seo:indexnow:diff` (post-deploy, non-blocking)
- EN JSON-LD `@graph`: WebSite, Organization, Person, FAQPage, 3× Product + Offer

Contract: [docs/AGENT_SOT.md](docs/AGENT_SOT.md) §5.

## Stack

- Semantic HTML5, WCAG 2 AA (skip link, ARIA, keyboard)
- Design system **1.6.1** Product Operator ([STYLEGUIDE.md](STYLEGUIDE.md)): `design-tokens.json` → `tokens.css` → `components.css` → `utilities.css`
- Vanilla JS (no framework): copy, progress, CMO context (`sessionStorage`), brief builder
- Fonts: Fraunces (hero H1 only), Source Sans 3 (UI), JetBrains Mono (prompts)
- Build: Node scripts (locale pages, OG, favicons, `public/` export). Paid PDF HTML is **operator-local** (gitignored) — see [docs/pdf-source/README.md](docs/pdf-source/README.md)

## Repository layout

**Internal docs (LT) start at [docs/INDEX.md](docs/INDEX.md).** This README is the public English entry.

```
.
├── index.html                 # Legacy structural source (DOM + LT <pre>); product canon is en/
├── lt/  en/                   # Generated locales (lt frozen; en canon)
├── data/                      # Build input (not copied to public/)
│   ├── en-prompt-bodies.json  # 10 EN META bodies
│   ├── cmo-prompt-registry.json
│   └── {lt,en}-prompt-expected.json, {lt,en}-scenarios.json
├── scripts/                   # build-locale-pages, geo-surfaces, vercel-export-public, pdf:*, check:*
├── api/                       # Vercel serverless fulfillment (EN, .space only)
├── config/sot.json             # Prices, Stripe links, FAQ, brief copy
├── js/                        # creative-brief.js, va-track.js, generated en-prompt-bodies-inline.js
├── styles/                    # tokens + components + utilities
├── assets/pdf-covers/         # Storefront PNGs (HTML interiors are gitignored)
├── public/                    # Deploy artifact (gitignored)
├── tests/                     # structure, registry, design-system, a11y, fulfillment-config, e2e/
├── success.html, terms.html, coming-soon.html
├── vercel.json                # / → /en/; REQUIRE_STRIPE_LINKS=1 build
├── package.json               # 1.9.0 — npm test, build, pdf:*, check:prod
└── docs/                      # INDEX, LEGACY, AGENT_SOT, GO_LIVE_RUNBOOK, …
```

## Privacy

The free library does **not** collect personal data. Copy, brief drafts, and “done” checkboxes stay on the device (`sessionStorage` / `localStorage`). Paid checkout uses Stripe + Resend for fulfillment email only — see disk [en/privacy.html](en/privacy.html) (live [`/en/privacy/`](https://promptanatomy.space/en/privacy/)). Frozen LT policy: [lt/privatumas.html](lt/privatumas.html).

## Deploy

| Role | URL | Notes |
|------|-----|--------|
| **Primary** | [promptanatomy.space](https://promptanatomy.space) | Vercel; `public/`; checkout + `/api/` |
| **Mirror** | [ditreneris.github.io/cmo](https://ditreneris.github.io/cmo/) | GitHub Pages; `MIRROR_NOTE=1`; no storefront; artifact is `public/` only |

Details: [DEPLOYMENT.md](DEPLOYMENT.md). Operator go-live order: [docs/GO_LIVE_RUNBOOK.md](docs/GO_LIVE_RUNBOOK.md).

## Development

```bash
npm install
npm test            # build + structure + registry + smoke + fulfillment-config + lint
npm run build       # favicons + OG + locale + public/
npm run check:prod  # production fulfillment-health + IndexNow key
```

Local a11y (release QA is `/en/`):

```bash
npx serve public -l 3000
npx pa11y http://127.0.0.1:3000/en/ --standard WCAG2AA
```

QA standard: [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md). Live checklist: [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md).

## License

The free site source in this repository may be used as a static library. **Paid PDF interiors and binaries are not in git** (operator-local). Team license, refund, and checkout terms: [terms.html](terms.html).
