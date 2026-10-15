# MUST_TODO — Stripe + paid PDF go-live (CMO Kit)

Kritinės užduotys prieš live checkout ant `promptanatomy.space`. Po kiekvieno žingsnio – `npm test`. Pilna env matrica: [DEPLOYMENT.md](DEPLOYMENT.md) §2.5.

**Produktai:** Starter $3.99 · Pro $8.99 · Complete Kit (Bundle) $10.99 · EN-only · tik primary host.

---

## Likę rankiniai žingsniai (Vercel + Stripe Dashboard)

**Operator sequence (commands in order):** [docs/GO_LIVE_RUNBOOK.md](docs/GO_LIVE_RUNBOOK.md). Šis failas lieka Dashboard + env SSOT.

Repo paruošta (SOT flip, testai, `vercel.json` build gate). **Prieš pirmą live pirkimą:**

1. **Stripe Dashboard** — patvirtinti success URL + webhook + nukopijuoti `price_...` ir `whsec_...` (žr. § Stripe Dashboard).
2. **Vercel Production env** — visi raktai iš [.env.example](.env.example) (§ Vercel Production env).
3. **`npm run pdf:upload-blob`** — lokaliai su `BLOB_READ_WRITE_TOKEN` `.env` faile → paste `PDF_CMO_*_SOURCE_URL` į Vercel.
4. **Commit + push** → redeploy → `GET /api/fulfillment-health` → live Starter $3.99 drill.

---

## Repo paruošimas (padaryta kode — ne „Phase A“)

- [x] `api/_lib/fulfillment.js` — starter + pro + bundle
- [x] `config/sot.json` — 3 produktai, placeholder režimas
- [x] `REQUIRE_STRIPE_LINKS=1` build gate — [`scripts/build-locale-pages.js`](scripts/build-locale-pages.js)
- [x] Security headers — [`vercel.json`](vercel.json)
- [x] Mirror be storefront — `MIRROR_NOTE=1` + `assertNoPaidPdfsLeaked()`

---

## PDF pipeline

- [x] `npm install` → `npx playwright install chromium`
- [x] `npm run pdf:export` — Starter **14 p.**, Pro **30 p.** (page-count gate)
- [x] `npm run pdf:upload-blob` → įklijuoti `PDF_CMO_*_SOURCE_URL` į Vercel Production (reikia `BLOB_READ_WRITE_TOKEN` iš Vercel Storage) — 2026-10-15 `check:prod` žalias, `missing: []`, `blobConfigured=true`
- [x] (Optional Pro) `PDF_CMO_PRO_MD_SOURCE_URL` jei Markdown companion Blob'e — raktas yra Production env

---

## Stripe Dashboard

**Live Payment Links (2026-05-31):**

| SKU | Link |
|-----|------|
| Starter $3.99 | https://buy.stripe.com/28E14namg9Vj5lycKcfjG0b |
| Pro $8.99 | https://buy.stripe.com/9B68wPamgc3rbJW11ufjG0c |
| Complete Kit $10.99 | https://buy.stripe.com/eVqcN58e82sRdS4cKcfjG0d |

- [x] **CMO AI Content System · Starter** — Product + Price `$3.99` → `STRIPE_PRICE_CMO_STARTER_PDF` — 2026-10-15 Payment Link `G0b` sutampa
- [x] **CMO AI Content System · Pro** — Product + Price `$8.99` → `STRIPE_PRICE_CMO_PRO_PDF` — 2026-10-15 Payment Link `G0c` sutampa
- [x] **CMO AI Content System · Complete Kit** — Product + Price `$10.99` → `STRIPE_PRICE_CMO_BUNDLE_PDF` — 2026-10-15 Payment Link `G0d`; Production env sutapatintas su gyva kaina
- [x] Kiekvienam **Payment Link** — success URL:  
  `https://www.promptanatomy.space/success.html?session_id={CHECKOUT_SESSION_ID}` — 2026-10-15 `after_completion=redirect`
- [x] Kiekvienam **CMO Payment Link** metadata: `product=starter` | `pro` | `bundle` (izoliuoja nuo kitų SKU tame pačiame Stripe account) — 2026-10-15
- [x] Webhook: `https://www.promptanatomy.space/api/stripe-webhook`  
  Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`. **Refundai — rankomis Stripe Dashboard.** `charge.refunded` neprenumeruoti, kol klientų nėra. Shared account: svetimi pirkimai → `200` `ignored`, ne `500`. Lock contention → `503` (Stripe retry). Apex POST 307 sulaužo Stripe. — 2026-10-15 endpoint enabled
- [ ] Stripe receipts ON (Settings → Customer emails → Successful payments) — API šito nustatymo nerodo
- [x] Webhook signing secret → Vercel `STRIPE_WEBHOOK_SECRET` — raktas yra Production env
- [x] Stripe product descriptions atitinka PDF (14 / 30 / 44 pages) — ne seni skaičiai — 2026-10-15

---

## Repo SOT flip (po Payment Links)

- [x] [`config/sot.json`](config/sot.json):
  - `commerce.stripePaymentLinks.starter` → `https://buy.stripe.com/28E14namg9Vj5lycKcfjG0b`
  - `commerce.stripePaymentLinks.pro` → `https://buy.stripe.com/9B68wPamgc3rbJW11ufjG0c`
  - `commerce.stripePaymentLinks.bundle` → `https://buy.stripe.com/eVqcN58e82sRdS4cKcfjG0d`
  - `commerce.allowPlaceholderCheckout` → **`false`**
- [x] `npm test` (visi 3 linkai privalomi kai placeholder off)
- [x] `npm run test:e2e` — live režimas: 3× `buy.stripe.com` ant `/en/`
- [ ] Commit + push → Vercel redeploy

---

## Vercel Production env

Privalomi (žr. [.env.example](.env.example)):

- [x] `STRIPE_SECRET_KEY`
- [x] `STRIPE_WEBHOOK_SECRET`
- [x] `STRIPE_PRICE_CMO_STARTER_PDF`
- [x] `STRIPE_PRICE_CMO_PRO_PDF`
- [x] `STRIPE_PRICE_CMO_BUNDLE_PDF` — 2026-10-15 sutapatinta su gyva Complete kaina
- [x] `DOWNLOAD_TOKEN_SECRET` (≥32 baitai)
- [x] `RESEND_API_KEY`
- [x] `FULFILLMENT_FROM_EMAIL` (verified Resend sender, pvz. `info@promptanatomy.app`)
- [x] `UPSTASH_REDIS_REST_URL`
- [x] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `SITE_URL=https://www.promptanatomy.space` — kode fallback lieka apex, kol Production env neperrašytas. Webhook ir success URL jau www. Po pakeitimo perdeployinti, kad laiško nuorodos nešoktų per apex 307.
- [x] `PDF_CMO_STARTER_SOURCE_URL`
- [x] `PDF_CMO_PRO_SOURCE_URL`
- [x] `BLOB_READ_WRITE_TOKEN`

Po env: **Redeploy** Production.

**Production build gate (po go-live):** [`vercel.json`](vercel.json) → `buildCommand`:

```bash
REQUIRE_STRIPE_LINKS=1 npm run build
```

Stripe links vis dar tikrinami `build-locale-pages.js`. Pilnas `npm test` lieka GitHub CI — ant Vercel jis tempia Playwright/Puppeteer ir pakabina deploy.

---

## QA prieš release

- [x] `npm run check:fulfillment` — Redis PONG, env complete (Vercel Production env; lokaliai reikia `.env`) — 2026-10-15
- [x] `npm run check:prod` — `{ ok: true, missing: [] }` + IndexNow key file (po deploy + env) — 2026-10-15, po Production redeploy
- [x] `/en/` — storefront: **2** kortelės (Starter + Complete) + Pro tekstinė nuoroda, live `buy.stripe.com` (ne `/coming-soon.html`) — **repo build patvirtinta**
- [x] `/lt/` — **NĖRA** `#pdf-storefront`, kainų, `buy.stripe.com` — **structure tests**
- [x] Mirror (`MIRROR_NOTE=1` build) — taip pat be storefront — **structure tests**
- [ ] Stripe **live mode**: Starter, Pro, Bundle → el. laiškas per ≤5 min → download veikia
- [ ] `success.html` — poll → „Download PDF“ per ~5 s
- [ ] Webhook idempotency — pakartotinis delivery → `already_fulfilled`
- [x] `terms.html` `#paid-pdf-license` pasiekiamas (gyvai) — 2026-10-15 `https://www.promptanatomy.space/terms/` HTTP 200
- [x] `npm run test:e2e` — live režime CTA branch
- [x] Repo QA — [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) `/en/` (CI)
- [x] [CHANGELOG.md](CHANGELOG.md) 1.9.0 + SemVer

---

## Saugumas

- [ ] **Niekada** necommitinti `.env`
- [ ] Tik [.env.example](.env.example) versijuojamas (be realių verčių)
