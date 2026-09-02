# Turinio DI sistema – rinkodaros vadovams

**Spin-off Nr. 2** iš [Promptų anatomijos](https://www.promptanatomy.app/). Nemokamai: 4 workflow (Plan → Create → Check → Improve) + EN creative brief. Pilni 10 promptų – Pro rinkinyje offline. Kopijuok → įklijuok į ChatGPT arba Claude.

## Apie projektą

Interaktyvi HTML platforma su 10 paruoštų promptų rinkodaros sistemai. Paprasta kalba, lietuviški terminai (įžanginis kabliukas, raginimas veikti, matavimo rodikliai, unikalus pardavimo pasiūlymas). Turinys: 30 dienų planas pagal 4 principus, vienos idėjos daug formatų, LinkedIn autoritetas, 30 s video, kasdienė analizė (rodikliai → veiksmai), prieštaravimų apdorojimas, lead generator + DM seka, kliento istorijos, temų grupė, pagrindinis promptas (valdymo centras).

### Funkcijos

- **Free spine:** 4 interaktyvūs promptai (1, 2, 3, 5) + EN creative brief builder; **4/6–10** – Pro teaseriai; pilni 10 – Pro PDF
- **Upgrade sluoksnis prieš promptus** – aiškinimas „Kas yra prompt?", „Kas yra Prompt Anatomy?" ir darbo schema
- **CMO v2 kontekstas + scenarijai + safety** – paspaudus „Kopijuoti promptą", kontekstas (auditorija, USP, kanalai, tikslas, apribojimas) ir privalomos taisyklės automatiškai prepend'inamos prie prompto teksto
- **FAQ** – greitas aiškumas prieš startą
- **Interaktyvus dizainas** – DS 1.6 Product Operator, aiškūs mygtukai, progresas (0/4 spine)
- **Kopijavimas** – pasirink promptą, spausk „Kopijuoti promptą", įklijuok ir pakeisk laukus
- **Responsive** – veikia desktop ir mobiliai (Mobile UI First)
- **Be duomenų rinkimo** – kontaktų formos nėra; „Pažymėjau kaip atlikau" saugoma tik tavo įrenginyje (localStorage), kontekstas – sessionStorage
- **Mokama EN PDF tarpinė (v1.6.0+, tik `promptanatomy.space`)** – du atsisiunčiami PDF rinkodaros vadovams: *CMO AI Content System · Starter*, *CMO AI Content System · Pro*, Complete Kit. Stripe Payment Links → webhook → pasirašyta atsisiuntimo nuoroda per Resend. **Tik EN, tik primary host.** **Roadmap:** [roadmap.md](roadmap.md) (A→E→light B→C). **Active go-live (R1):** [todo.md](todo.md) → [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md). LT `/lt/` – užšaldyta nemokama biblioteka testeriams (be storefront). Detalės: [memo_pdf.md](memo_pdf.md), [DEPLOYMENT.md §2.5](DEPLOYMENT.md), [docs/LEGACY_GOLDEN_STANDARD.md §7](docs/LEGACY_GOLDEN_STANDARD.md).

### SEO + GEO + AI crawlers (2026)

Build emits from [`config/sot.json`](config/sot.json) + [`scripts/geo-surfaces.js`](scripts/geo-surfaces.js) — do not hand-edit:

- `robots.txt` — per-AI-bot policy; `/api/` and PDF preview paths carved out for training bots
- `sitemap.xml` — `xmlns:image`, `<lastmod>`, `/en/`, `/lt/`, terms
- `llms.txt` + `llms-full.txt` — AI-friendly site map and prompt digest
- `manifest.webmanifest` — PWA-lite (`start_url: /en/`)
- `404.html` — EN-only, canonical → `/en/`
- IndexNow key file + `npm run seo:indexnow:diff` (post-deploy, non-blocking)
- EN JSON-LD `@graph`: WebSite, Organization, Person, FAQPage, 3× Product + Offer

Full contract: [docs/AGENT_SOT.md](docs/AGENT_SOT.md) §5.

## Promptų sąrašas

1. **30 dienų turinio sistema** – planas pagal 4 principus (Autoritetas, Problema, Pavyzdys, Pasiūlymas)
2. **Viena idėja → 7 formatai** – LinkedIn, karuselė, 30 s video, el. laiškas, titulinis ekranas, reklama, 3 įžanginiai kabliukai
3. **LinkedIn autoriteto kūrimas** – 150–200 žodžių su įžanginiu kabliuku, įrodymais, raginimu veikti
4. **Sukurti video – lengviau dar nebuvo!** – 30 s scenarijus: įžanginis kabliukas, 3 punktai, pavyzdys, raginimas veikti
5. **Kasdienė analizė (Veikla→Sprendimas)** – iš rodiklių suprask: kas neveikia, kodėl, ką daryti
6. **Prieštaravimų apdorojimo įrankis** – 10 turinio vienetų iš klientų prieštaravimų
7. **Lead generator postas + DM seka** – postas + 4 žinučių seka
8. **Kliento istorijos struktūra** – problema, sprendimas, procesas, rezultatas, raginimas veikti
9. **Temų grupė** – 1 pagrindinė tema + 8 subtemos, vidinės nuorodos
10. **Pagrindinis promptas (valdymo centras)** – 30 d. struktūra, 5 turinio vienetai, hipotezės, veiksmai

## Kaip naudoti

1. Atidaryk [primary URL (EN)](https://promptanatomy.space/en/) arba [mirror URL (EN)](https://ditreneris.github.io/cmo/en/)
2. (Pasirenkama) Užpildyk **kontekstą** viršuje (auditorija, USP, kanalai, tikslas, apribojimas) – jis išliks tik šioje sesijoje
3. Pasirink promptą ir spausk ant jo – tekstas pažymėsis
4. Spausk **„Kopijuoti promptą"** arba `Ctrl+C` / `Cmd+C` (kontekstas ir taisyklės automatiškai prepend'inamos)
5. Įklijuok į ChatGPT, Claude ar kitą DI įrankį
6. Pakeisk likusius placeholder'ius (jei yra) savo duomenimis

## Technologijos

- **HTML5** – semantinė struktūra, prieinamumas (skip link, ARIA, progress)
- **CSS3** – dizaino sistema **1.6** Product Operator ([STYLEGUIDE.md](STYLEGUIDE.md)): [styles/design-tokens.json](styles/design-tokens.json) → [styles/tokens.css](styles/tokens.css) → [styles/components.css](styles/components.css) → [styles/utilities.css](styles/utilities.css); gold/ink brand; surface page/panel/accent; hero workflow diagram
- **Vanilla JavaScript** – kopijavimas, progresas (localStorage), CMO v2 kontekstas (sessionStorage), be frameworkų
- **Build:** Node.js skriptai ([scripts/build-locale-pages.js](scripts/build-locale-pages.js), [scripts/generate-og.js](scripts/generate-og.js), [scripts/vercel-export-public.js](scripts/vercel-export-public.js))
- **Google Fonts** – Fraunces (hero H1), Source Sans 3 (UI/body), JetBrains Mono (prompts)

## Struktūra

**Dokumentacijos indeksas (agentams ir komandai):** [docs/INDEX.md](docs/INDEX.md).

```
.
├── index.html                # Legacy struktūrinis build šaltinis (DOM + LT <pre>); kanonas – en/
├── privatumas.html           # Legacy LT privatumas (root, backward compat); kanonas – en/privacy.html
├── lt/                       # Generuojama: užšaldyta tester snapshot (lt/index.html, lt/privatumas.html)
├── en/                       # Generuojama: kanoninė versija (en/index.html, en/privacy.html)
├── data/                     # JSON šaltiniai build'ui
│   ├── en-prompt-bodies.json     # 10 EN META eilučių
│   ├── en-prompt-expected.json   # „Expected output" EN
│   ├── lt-prompt-expected.json   # „Tikėtinas atsakymas" LT
│   ├── en-scenarios.json         # CMO „Clarity practice" scenarijai EN
│   ├── lt-scenarios.json         # CMO scenarijai LT
│   └── meme-*.(png|webp)         # offline/social meme assetai (ne gyvoje UI)
├── scripts/
│   ├── build-locale-pages.js     # Generuoja lt/, en/ + inject CMO v2 + EN_REPLACEMENTS + EN-only #pdf-storefront (MIRROR_NOTE=1 jį praleidžia)
│   ├── generate-og.js            # OG paveikslas (SVG → PNG, 1200×630)
│   ├── vercel-export-public.js   # Vercel statinio output į public/ + analytics + assertNoPaidPdfsLeaked()
│   ├── export-pdfs.js            # Playwright Letter PDF export + page-count gate (14/27)
│   ├── export-pdf-covers.js      # PDF page 1 → storefront cover PNG (WYSIWYG)
│   ├── export-pdf-previews.js    # Watermarked interior pages 2–4 PNG previews
│   ├── upload-pdfs-to-blob.js    # Vercel Blob privatus įkėlimas
│   └── check-fulfillment-env.js  # Lokalus env / Redis / Stripe / Resend probe
├── api/                          # Vercel serverless (paid PDF fulfillment, EN-only, .space only)
│   ├── _lib/fulfillment.js       # PRODUCTS map ($3.99 / $8.99), Resend, signed tokens
│   ├── stripe-webhook.js         # bodyParser:false, signature verify, idempotent
│   ├── download-link.js          # success.html polling (200/202/404)
│   ├── download.js               # Pasirašytas PDF su Cache-Control: private, no-store
│   └── fulfillment-health.js     # Vieša env + Redis sveikatos patikra
├── config/
│   └── sot.json                  # Single source of truth: produktai, kainos, Stripe links, mirror policy
├── docs/pdf-source/
│   ├── cmo-starter.html          # 14 p. Starter PDF HTML šaltinis (Letter)
│   └── cmo-pro.html              # 30 p. Pro PDF HTML šaltinis (Letter)
├── assets/pdf-covers/
│   ├── cmo-starter-cover.png     # Storefront thumbnail (Playwright from PDF page 1)
│   ├── cmo-pro-cover.png
│   └── cmo-pro-cover.svg         # Bundle card only (until bundle cover phase)
├── styles/
│   ├── design-tokens.json
│   ├── tokens.css
│   ├── components.css            # + .pdf-storefront / .pdf-card (no-print)
│   └── utilities.css
├── js/
│   └── en-prompt-bodies-inline.js  # Generuojama iš data/en-prompt-bodies.json
├── public/                   # Vercel deploy artefaktas (gitignored, generuojamas)
├── tests/
│   ├── structure.test.js         # 134 struktūriniai teiginiai (įsk. CMO v2 + commerce EN-only)
│   ├── fulfillment-config.test.js  # 43 teiginiai (PRODUCTS ⇆ SOT consistency, /api kontraktas)
│   ├── design-system-smoke.test.js
│   ├── a11y-smoke.test.js
│   └── e2e/
│       ├── smoke.spec.js          # Playwright: viewer load, /terms, /coming-soon, /en/privacy
│       └── checkout.spec.js       # Playwright: storefront, success polling (placeholder vs live)
├── playwright.config.js
├── success.html, terms.html, coming-soon.html  # Mokama PDF tarpinė pagalbiniai puslapiai (EN)
├── memo_pdf.md, .env.example
├── docs/
│   ├── INDEX.md              # Navigacija pagal rolę ir užduotį
│   ├── DOCUMENTATION.md      # Dokumentų inventorius
│   ├── LEGACY_GOLDEN_STANDARD.md  # Golden standard (struktūra, ID, JS, CMO v2)
│   ├── MULTILINGUAL_STRUCTURE.md  # EN kanonas, LT freeze, build
│   ├── BULLET_PROOF_PROMPTS.md    # Promptų šablonas
│   ├── PEDAGOGINES_SPECIFIKACIJA.md
│   ├── QA_STANDARTAS.md      # QA (spinoff01)
│   └── TESTAVIMAS.md         # Gyvo testavimo žurnalas
├── .github/workflows/
│   ├── ci.yml                # npm test + pa11y (/lt/, /en/, privacy)
│   └── deploy.yml            # GitHub Pages mirror
├── README.md, AGENTS.md, CHANGELOG.md, DEPLOYMENT.md, STYLEGUIDE.md
├── .cursorrules              # Cursor: kokybė, a11y, docs, commit
├── .pa11yrc.json, .htmlvalidate.json, .eslintrc.json, .nojekyll
├── og.png, favicon.svg
├── robots.txt, sitemap.xml
└── package.json              # npm test, lint:html, lint:js, build
```

## Privatumas

- **Minimali aplikacija:** **nerinkime jokių asmens duomenų**. Visas naudojimas vyksta tik tavo įrenginyje (kopijavimas, „Pažymėjau kaip atlikau" – localStorage; CMO kontekstas – sessionStorage).
- **Privatumo politika:** EN [en/privacy.html](en/privacy.html) (kanonas). LT [lt/privatumas.html](lt/privatumas.html) – užšaldyta tester versija.

## Deployment ir gyvas testavimas

- **Primary URL:** [promptanatomy.space](https://promptanatomy.space) (Vercel, default `BASE_PATH=''`).
- **Mirror URL:** [ditreneris.github.io/cmo](https://ditreneris.github.io/cmo/) (GitHub Pages backup, `BASE_PATH=/cmo`).
- **Deploy:** Vercel auto-deploy iš `main`; GitHub Pages per [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Instrukcijos: [DEPLOYMENT.md](DEPLOYMENT.md).
- **QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01). Projektas laikosi [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md); po deploy – gyvas testavimas pagal [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md).

## Reikalavimai

- **Naudojimui:** Nėra būtinų priklausomybių – atidaryk primary arba mirror URL.
- **Development/CI:**
  ```bash
  npm install
  npm test            # build + tests + lint
  npm run build       # tik build (generate-og + locale + public)
  ```
- **A11y lokaliai:** `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/en/ --standard WCAG2AA` (release QA; CI taip pat tikrina `/lt/`).

## Licencija

Šis projektas yra atviro kodo ir gali būti naudojamas laisvai.

## Autorius

Sukurta rinkodaros vadovams ir komandoms – sistemingai generuoti turinį, kurti potencialius klientus ir matuoti rezultatus. Pilnas interaktyvus mokymas: [Promptų anatomija](https://www.promptanatomy.app/).

---

**Sėkmės rinkodaroje.**
