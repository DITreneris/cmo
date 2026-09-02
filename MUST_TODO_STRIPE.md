# MUST_TODO — Stripe + paid PDF go-live (CMO Kit)

Kritinės užduotys prieš live checkout ant `promptanatomy.space`. Po kiekvieno žingsnio – `npm test`. Pilna env matrica: [DEPLOYMENT.md](DEPLOYMENT.md) §2.5.

**Produktai:** Starter $3.99 · Pro $8.99 · Complete Kit (Bundle) $10.99 · EN-only · tik primary host.

---

## Likę rankiniai žingsniai (Vercel + Stripe Dashboard)

Repo paruošta (SOT flip, testai, `vercel.json` build gate). **Prieš pirmą live pirkimą:**

1. **Stripe Dashboard** — patvirtinti success URL + webhook + nukopijuoti `price_...` ir `whsec_...` (žr. § Stripe Dashboard).
2. **Vercel Production env** — visi raktai iš [.env.example](.env.example) (§ Vercel Production env).
3. **`npm run pdf:upload-blob`** — lokaliai su `BLOB_READ_WRITE_TOKEN` `.env` faile → paste `PDF_CMO_*_SOURCE_URL` į Vercel.
4. **Commit + push** → redeploy → `GET /api/fulfillment-health` → live Starter $3.99 drill.

---

## Repo paruošimas (Phase 1a — padaryta kode)

- [x] `api/_lib/fulfillment.js` — starter + pro + bundle
- [x] `config/sot.json` — 3 produktai, placeholder režimas
- [x] `REQUIRE_STRIPE_LINKS=1` build gate — [`scripts/build-locale-pages.js`](scripts/build-locale-pages.js)
- [x] Security headers — [`vercel.json`](vercel.json)
- [x] Mirror be storefront — `MIRROR_NOTE=1` + `assertNoPaidPdfsLeaked()`

---

## PDF pipeline

- [x] `npm install` → `npx playwright install chromium`
- [x] `npm run pdf:export` — Starter **14 p.**, Pro **30 p.** (page-count gate)
- [ ] `npm run pdf:upload-blob` → įklijuoti `PDF_CMO_*_SOURCE_URL` į Vercel Production (reikia `BLOB_READ_WRITE_TOKEN` iš Vercel Storage)
- [ ] (Optional Pro) `PDF_CMO_PRO_MD_SOURCE_URL` jei Markdown companion Blob'e

---

## Stripe Dashboard

**Live Payment Links (2026-05-31):**

| SKU | Link |
|-----|------|
| Starter $3.99 | https://buy.stripe.com/28E14namg9Vj5lycKcfjG0b |
| Pro $8.99 | https://buy.stripe.com/9B68wPamgc3rbJW11ufjG0c |
| Complete Kit $10.99 | https://buy.stripe.com/eVqcN58e82sRdS4cKcfjG0d |

- [ ] **CMO AI Content System · Starter** — Product + Price `$3.99` → `STRIPE_PRICE_CMO_STARTER_PDF`
- [ ] **CMO AI Content System · Pro** — Product + Price `$8.99` → `STRIPE_PRICE_CMO_PRO_PDF`
- [ ] **CMO AI Content System · Complete Kit** — Product + Price `$10.99` → `STRIPE_PRICE_CMO_BUNDLE_PDF`
- [ ] Kiekvienam **Payment Link** — success URL:  
  `https://promptanatomy.space/success.html?session_id={CHECKOUT_SESSION_ID}`
- [ ] Product metadata (optional): `product=starter` | `pro` | `bundle`
- [ ] Stripe receipts ON (Settings → Customer emails → Successful payments)
- [ ] Webhook endpoint: `https://promptanatomy.space/api/stripe-webhook`  
  Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
- [ ] Webhook signing secret → Vercel `STRIPE_WEBHOOK_SECRET`
- [ ] Stripe product descriptions atitinka PDF (14 / 30 / 44 pages) — ne seni skaičiai

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

- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PRICE_CMO_STARTER_PDF`
- [ ] `STRIPE_PRICE_CMO_PRO_PDF`
- [ ] `STRIPE_PRICE_CMO_BUNDLE_PDF`
- [ ] `DOWNLOAD_TOKEN_SECRET` (≥32 baitai)
- [ ] `RESEND_API_KEY`
- [ ] `FULFILLMENT_FROM_EMAIL` (verified Resend sender, pvz. `info@promptanatomy.app`)
- [ ] `UPSTASH_REDIS_REST_URL`
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `SITE_URL=https://promptanatomy.space`
- [ ] `PDF_CMO_STARTER_SOURCE_URL`
- [ ] `PDF_CMO_PRO_SOURCE_URL`
- [ ] `BLOB_READ_WRITE_TOKEN`

Po env: **Redeploy** Production.

**Production build gate (po go-live):** [`vercel.json`](vercel.json) → `buildCommand`:

```bash
REQUIRE_STRIPE_LINKS=1 npm run build
```

Stripe links vis dar tikrinami `build-locale-pages.js`. Pilnas `npm test` lieka GitHub CI — ant Vercel jis tempia Playwright/Puppeteer ir pakabina deploy.

---

## QA prieš release

- [ ] `npm run check:fulfillment` — Redis PONG, env complete (Vercel Production env; lokaliai reikia `.env`)
- [ ] `GET https://promptanatomy.space/api/fulfillment-health` → `{ ok: true, missing: [] }` (po deploy + env)
- [x] `/en/` — storefront: 3 kortelės, live `buy.stripe.com` (ne `/coming-soon.html`) — **repo build patvirtinta**
- [x] `/lt/` — **NĖRA** `#pdf-storefront`, kainų, `buy.stripe.com` — **structure tests**
- [x] Mirror (`MIRROR_NOTE=1` build) — taip pat be storefront — **structure tests**
- [ ] Stripe **live mode**: Starter, Pro, Bundle → el. laiškas per ≤5 min → download veikia
- [ ] `success.html` — poll → „Download PDF“ per ~5 s
- [ ] Webhook idempotency — pakartotinis delivery → `already_fulfilled`
- [ ] `terms.html` `#paid-pdf-license` pasiekiamas (gyvai)
- [x] `npm run test:e2e` — live režime CTA branch
- [x] Repo QA — [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) `/en/` (CI)
- [x] [CHANGELOG.md](CHANGELOG.md) 1.9.0 + SemVer

---

## Saugumas

- [ ] **Niekada** necommitinti `.env`
- [ ] Tik [.env.example](.env.example) versijuojamas (be realių verčių)
