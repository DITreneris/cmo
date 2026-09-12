# Deployment – DI Promptų Biblioteka

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

---

## 0. Du deploy taikiniai (primary + mirror)

| Vaidmuo | URL | Platforma | `BASE_PATH` | Build artefaktas | Workflow |
|---------|-----|-----------|-------------|------------------|----------|
| **Primary** | `https://promptanatomy.space` | **Vercel** | `''` (tuščia) | `public/` (per `scripts/vercel-export-public.js`) | Vercel auto-deploy iš `main` |
| **Mirror** | `https://ditreneris.github.io/cmo/` | **GitHub Pages** | `''` (workflow; canonical stays `.space`) | `public/` (`path: public`) | [.github/workflows/deploy.yml](.github/workflows/deploy.yml) |

Abu taikiniai dirba kartu: kodas / testai / canonical / hreflang **default**'ai derinami su primary; mirror aktyvuojamas per env override.

**SEO šaltinis tiesai:** primary (`promptanatomy.space`) – canonical/hreflang/sitemap'e; **kanoninis locale – `/en/`** (`hreflang x-default`). Root `/` visada 302 → `/en/` ([`vercel.json`](vercel.json)); `/lt/` tik tiesioginiu URL (užšaldyta tester snapshot, žr. [docs/MULTILINGUAL_STRUCTURE.md](docs/MULTILINGUAL_STRUCTURE.md) §0). Mirror egzistuoja kaip backup ir backward-compat (senos nuorodos į `/cmo` srautai).

---

## 1. Primary – Vercel (`promptanatomy.space`)

### Build

```bash
npm install
npm run build
```

`npm run build` (žr. [package.json](package.json)) atlieka:

1. `scripts/export-favicons.js` → favicon PNG pack.
2. `scripts/generate-og.js` → `og.png` (1200×630).
3. `scripts/build-locale-pages.js` → `lt/index.html`, `en/index.html`, `js/en-prompt-bodies-inline.js` (su default `BASE_PATH=''`); GEO emit (`robots` / `sitemap` / `llms`).
4. `scripts/vercel-export-public.js` → `public/` (allowlist; **be** `data/` / `docs/` / `api/`; `@vercel/analytics` snippet'as tik į `public/` HTML).

### Vercel konfigūracija

Šaltinis: [`vercel.json`](vercel.json) (ne dashboard default'ai).

- **Framework preset:** None / Other (static).
- **Redirects:** `/` ir `/index.html` visada → `/en/` (302). Jokio `Accept-Language` / geo negotiate į `/lt/`.
- **Privacy / Terms slash (`.space` + Pages HTML):** rewrite `/en/privacy/` → `/en/privacy.html` and `/terms/` → `/terms.html`; 308 `.html` and no-slash → slash. Do **not** enable `cleanUrls` (drops `?session_id=` on `/success.html`). Do not pretty-URL `/success.html` or `/coming-soon.html`. Export writes `public/en/privacy/index.html` and `public/terms/index.html` so Pages slash URLs resolve without `vercel.json`. Host-relative `/styles/` on Pages under `/cmo` is known. CI pa11y: `npx serve public -l 3000` (no `-s`), wait-on `/en/`.
- **Build command:** `REQUIRE_STRIPE_LINKS=1 npm run build` (Stripe Payment Link gate locale build'e).
- **Output directory:** `public`.
- **Install command:** `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 PUPPETEER_SKIP_DOWNLOAD=1 npm install`.
- **Environment:** `BASE_PATH` neapibrėžta (default `''`), `SITE_ORIGIN=https://promptanatomy.space` (default).

**Analytics:** `@vercel/analytics` snippet'as įterpiamas į `public/` HTML failus tik per export skriptą; norint matyti duomenis – įjungti Web Analytics Vercel dashboard'e.

### Deploy

- `git push origin main` → Vercel automatiškai paleidžia build + deploy.
- Rankinis: Vercel dashboard → Deployments → Redeploy.

---

## 2. Mirror – GitHub Pages (`ditreneris.github.io/cmo`)

### Šaltas deploy (tuščia repo, pirmas push)

1. **GitHub:** repozitorija [DITreneris/cmo](https://github.com/DITreneris/cmo) turi būti sukurta.
2. **Lokaliai:**
   ```bash
   npm install
   npm test
   git remote add cmo https://github.com/DITreneris/cmo.git
   git push -u cmo main
   ```
3. **GitHub (repo cmo):** Settings → Pages → **Source: GitHub Actions**.
4. Po push paleidžiamas [.github/workflows/deploy.yml](.github/workflows/deploy.yml): `npm test` → `npm run build` su `MIRROR_NOTE=1` → upload `path: public` artefaktas → publish į Pages. Do not upload the repo root (`path: .`) — that published `docs/`, `api/`, and `data/`.

### Vėlesni deploy

- `git push cmo main` automatiškai paleidžia testus ir deploy.
- Rankinis: GitHub Actions → workflow „Deploy to GitHub Pages" → Run workflow.

### Workflow env override (kaip dokumentuoti mirror canonical/hreflang)

Šiuo metu [.github/workflows/deploy.yml](.github/workflows/deploy.yml) build žingsnyje turi:

```yaml
env:
  BASE_PATH: ''
  SITE_ORIGIN: 'https://promptanatomy.space'
```

**Pastaba:** Jei norima, kad mirror'o HTML turėtų canonical/hreflang `https://ditreneris.github.io/cmo/...`, šios env reikšmes pakeisti į `BASE_PATH: '/cmo'` ir `SITE_ORIGIN: 'https://ditreneris.github.io'`. Dabartinė konfigūracija duoda primary canonical net ant mirror, kas SEO atžvilgiu nukreipia kreditą į `promptanatomy.space` – tai sąmoningas sprendimas. Mirror naudojamas kaip backup.

**Mokama PDF tarpinė ant mirror:** [.github/workflows/deploy.yml](.github/workflows/deploy.yml) deploy job nustato `MIRROR_NOTE: '1'`. Tai išjungia EN `#pdf-storefront` injekciją – mirror NEturi paid PDF storefronto, neturi Stripe nuorodų, neturi `/api/*` route'ų. Pirkėjai, atvykę į `ditreneris.github.io/cmo`, mato laisvą biblioteką, bet pirkimui keliami į `https://promptanatomy.space`. Žr. §2.5 žemiau.

---

## 2.5. Paid PDF fulfillment (EN-only, tik primary)

**Apimtis:** Mokama PDF tarpinė (CMO Kit Starter $3.99 / Pro $8.99) gyvena tik `https://promptanatomy.space` (Vercel). Niekada GitHub Pages mirror'e. Niekada LT pusėje.

### Vercel Production env matrica

Visi nustatomi per Vercel dashboard → Project → Settings → Environment Variables → **Production**:

| Env raktas | Reikšmė | Šaltinis |
|------------|---------|----------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe → Developers → Webhooks → endpoint signing secret |
| `STRIPE_PRICE_CMO_STARTER_PDF` | `price_...` (Starter Payment Link price id) | Stripe → Products → Starter |
| `STRIPE_PRICE_CMO_PRO_PDF` | `price_...` (Pro Payment Link price id) | Stripe → Products → Pro |
| `STRIPE_PRICE_CMO_BUNDLE_PDF` | `price_...` (Complete Kit bundle price id) | Stripe → Products → Bundle |
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | Vercel → Storage → Upstash Redis → `KV_REST_API_URL` |
| `UPSTASH_REDIS_REST_TOKEN` | `...` | Vercel → Storage → Upstash Redis → `KV_REST_API_TOKEN` |
| `DOWNLOAD_TOKEN_SECRET` | 32+ atsitiktinių baitų base64 | `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"` |
| `RESEND_API_KEY` | `re_...` | Resend dashboard → API Keys |
| `FULFILLMENT_FROM_EMAIL` | `info@promptanatomy.app` | Verified Resend domain |
| `BLOB_READ_WRITE_TOKEN` | `vercel_blob_rw_...` | Vercel → Storage → Blob → tokens |
| `PDF_CMO_STARTER_SOURCE_URL` | `https://...vercel-storage.com/paid-pdfs/cmo-starter-...pdf` | `npm run pdf:upload-blob` output |
| `PDF_CMO_PRO_SOURCE_URL` | `https://...vercel-storage.com/paid-pdfs/cmo-pro-...pdf` | `npm run pdf:upload-blob` output |
| `SITE_URL` | `https://promptanatomy.space` | Konstanta |

Opcionalūs (default'ai veikia):

| Env raktas | Default | Paskirtis |
|------------|---------|-----------|
| `DOWNLOAD_TOKEN_TTL_SECONDS` | `604800` (7 d.) | El. pašto download link galiojimas |
| `IN_PAGE_DOWNLOAD_TOKEN_TTL_SECONDS` | `900` (15 min.) | success.html in-page link galiojimas |
| `FULFILLMENT_STATE_TTL_SECONDS` | `7776000` (90 d.) | Redis fulfillment būsenos retencija |

### Pre-launch sekvencija

1. **Sukurti turinį:** `npm install` → `npx playwright install chromium` → `npm run pdf:export` (gauname `api/_private/pdfs/cmo-starter.pdf` **14 p.** ir `cmo-pro.pdf` **30 p.**, page-count gate praeina).
2. **Įkelti į privatų storage:** `npm run pdf:upload-blob` → įkelia abu į Vercel Blob privačiai → terminale parodo dvi `PDF_CMO_*_SOURCE_URL` eilutes paste'inti į Vercel env.
3. **Stripe Live:** Stripe dashboard → Products → sukurti *CMO AI Content System · Starter* ($3.99) ir *CMO AI Content System · Pro* ($8.99). Kiekvienam – sukurti **Payment Link** su sėkmės URL `https://promptanatomy.space/success.html?session_id={CHECKOUT_SESSION_ID}` ir produkto metadata `product=starter` arba `product=pro`. Įdėti `price_id` reikšmes į `STRIPE_PRICE_CMO_*` env.
4. **Webhook:** Stripe dashboard → Developers → Webhooks → Add endpoint: `https://promptanatomy.space/api/stripe-webhook`, įvykiai `checkout.session.completed`, `checkout.session.async_payment_succeeded`. Signing secret į `STRIPE_WEBHOOK_SECRET`.
5. **Atnaujinti SOT:** [`config/sot.json`](config/sot.json) `commerce.allowPlaceholderCheckout` → `false`; `commerce.stripePaymentLinks.starter`, `.pro` ir `.bundle` → įklijuoti `https://buy.stripe.com/...` URL'us. Commit + push.
6. **Production build gate (po go-live):** [`vercel.json`](vercel.json) `buildCommand` → `REQUIRE_STRIPE_LINKS=1 npm run build` (žr. [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md)). `npm test` lieka CI, ne Vercel.
7. **Sveikatos patikra:** `GET https://promptanatomy.space/api/fulfillment-health` → `{ ok: true, redis: "PONG", missing: [] }`.
8. **Test-mode drill:** Stripe Test mode + test Payment Links (Starter, Pro, Bundle) → patikrinti, kad email atvyksta per 5 min., download link veikia, success.html polling pereina į ready būseną.
9. **Live drill:** Real card $3.99 pirkimas → tas pats checklistas. Po sėkmės – išleisti viešai.

Pilnas checklist: [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md).

### Lokalus pre-flight

```bash
npm install
npm run check:fulfillment   # patikrina visus env, ping'ina Redis, validuoja Stripe key
TEST_SEND=1 TEST_FULFILLMENT_EMAIL=you@example.com npm run check:fulfillment   # papildomai – išsiunčia tikrą Resend laišką
```

### Saugumas

- **Privatūs PDF niekada `public/`:** [`scripts/vercel-export-public.js`](scripts/vercel-export-public.js) `assertNoPaidPdfsLeaked()` blokuoja deploy, jei rastų `.pdf` po `public/` arba `api/_private/` dirbinį.
- **Webhook signature:** [`api/stripe-webhook.js`](api/stripe-webhook.js) `bodyParser: false` – raw body Stripe parašui. Vercel headers vietos `Cache-Control: no-store` ant `/api/*` ir `/success.html`.
- **Pasirašytos URL:** HMAC SHA256 + Redis token metaduomenys; default 7 d. el. paštas / 15 min. in-page polling.

---

## 3. Lokalus QA prieš deploy

```bash
npm install
npm test
```

`npm test` = build (`lt/en` + `public/`) + structure + cmo-prompt-registry + design-system smoke + a11y smoke + fulfillment-config + `lint:html` + `lint:js`.

### A11y testavimas lokaliai

```bash
npx serve public -l 3000
# Kitoje terminale:
npx pa11y http://127.0.0.1:3000/lt/ --standard WCAG2AA --ignore "warning"
npx pa11y http://127.0.0.1:3000/en/ --standard WCAG2AA --ignore "warning"
npx pa11y http://127.0.0.1:3000/lt/privatumas.html --standard WCAG2AA --ignore "warning"
npx pa11y http://127.0.0.1:3000/en/privacy/ --standard WCAG2AA --ignore "warning"
```

CI automatiškai atlieka tuos pačius pa11y patikrinimus per [.github/workflows/ci.yml](.github/workflows/ci.yml).

---

## 4. Po deploy – gyvas testavimas

- Atlikti gyvą testavimą pagal [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) **abiems** URL (primary + mirror, jei naudojamas).
- Rezultatus įrašyti į testavimo žurnalą.

---

## 5. Troubleshooting

| Problema | Sprendimas |
|----------|------------|
| **Vercel build fail** | `npm run build` lokaliai; pažiūrėti, kuris žingsnis krenta (`generate-og`, `build-locale-pages`, `vercel-export-public`). Daugiausiai – build skripto `EN replacement safety check` (žr. [scripts/build-locale-pages.js](scripts/build-locale-pages.js)). |
| **Vercel: „No Output Directory named `public`"** | `package.json` `build` skriptas turi įtraukti `vercel-export-public.js`. Patikrinti `npm run build` lokaliai – `public/` privalo atsirasti. |
| **GitHub Pages 404** | Settings → Pages → Source: **GitHub Actions** (ne „Deploy from branch"). |
| **Deploy workflow failed (test job)** | Lokaliai paleisti `npm test`. |
| **CI workflow failed (pa11y)** | Lokaliai: `npx serve public -l 3000` + `npx pa11y http://127.0.0.1:3000/en/privacy/ --standard WCAG2AA`. Ne `serve -s .`. |
| **pa11y: No usable sandbox** (CI) | `.pa11yrc.json` turi `--no-sandbox` Chrome args. Jei vis tiek krenta – patikrinti workflow. |
| **Mirror rodo seną canonical** | Patikrinti [.github/workflows/deploy.yml](.github/workflows/deploy.yml) `env` (`BASE_PATH`, `SITE_ORIGIN`). Žr. §2 pastabą. |
| **Mirror rodo `#pdf-storefront` (turi nerodyti)** | [.github/workflows/deploy.yml](.github/workflows/deploy.yml) deploy job env turi `MIRROR_NOTE: '1'`. Žr. §2 mirror politikos pastabą. |
| **`/api/fulfillment-health` rodo `missing: [...]`** | Trūksta env Vercel Production. Žr. §2.5 matricą. |
| **Stripe webhook 400 „No signatures found matching"** | [`api/stripe-webhook.js`](api/stripe-webhook.js) `bodyParser: false` privalo veikti. Patikrinti `STRIPE_WEBHOOK_SECRET` (Stripe → Webhooks → endpoint signing secret, tas pats kaip Production env). |
| **Pirkėjas nemato laiško per 5 min.** | Vercel Logs → `api/stripe-webhook` paskutinis 200? Resend dashboard → Logs (atmestas?) → spam check. Pakartoti per `node -e "require('./api/_lib/fulfillment').getDownloadUrlBySessionId('cs_...')"`. |
| **`success.html` užstringa „preparing your link"** | F12 Network → `/api/download-link` 202 lūkuriavimas yra normalus iki 30 attempt; po jų – „taking longer than expected". Patikrinti webhook logą ir Redis `fulfillment:cs_*` raktą. |
| **`pdf:export` page-count mismatch (12 / 24)** | `docs/pdf-source/cmo-*.html` HTML'as overflow'ina Letter puslapį. Pataisyti CSS arba sumažinti turinį, paleisti pakartotinai. |
| **`vercel-export-public.js` „Refusing to publish: PDF found"** | Privatus PDF pateko į `public/`. Pašalinti, paleisti `npm run build` iš naujo. Žr. [`scripts/vercel-export-public.js`](scripts/vercel-export-public.js) `assertNoPaidPdfsLeaked()`. |

---

## 6. Susiję dokumentai

- [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) – QA standartas (nuoroda į spinoff01)
- [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) – gyvo testavimo scenarijai
- [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) – kodo kontraktas, BASE_PATH paaiškinimas
- [AGENTS.md](AGENTS.md) – release ir QA procesas
- [CHANGELOG.md](CHANGELOG.md) – versijų istorija
