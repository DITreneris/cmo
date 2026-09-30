# Security — CMO repo

**Scope:** `promptanatomy.space` primary host. Mirror is static-only (no `/api/*`).

---

## Secrets

- Never commit `.env` or live Stripe/Resend keys.
- Use [.env.example](../.env.example) as the only versioned template.
- `DOWNLOAD_TOKEN_SECRET` — 32+ random bytes; rotate invalidates old email links.

---

## HTTP headers (Vercel)

Configured in [vercel.json](../vercel.json):

- HSTS, `X-Content-Type-Options`, `X-Frame-Options`, Referrer-Policy, Permissions-Policy
- COOP / CORP / Origin-Agent-Cluster
- **Content-Security-Policy-Report-Only** — baseline for scripts (Vercel Analytics), Stripe checkout frames, Google Fonts

### CSP promotion (Report-Only → enforce)

Promote to enforcing CSP only after:

1. Two weeks with no unexpected violations in browser reports (if reporting endpoint added).
2. `npm test` passes (no inline `onclick` / `onkeydown` on index — enforced by structure tests).
3. Manual smoke on `/en/`: copy prompt, PDF storefront, success.html polling.

---

## Paid PDF leak prevention

- Paid PDF **HTML interiors** (`docs/pdf-source/cmo-*.html`) are operator-local and gitignored. See [pdf-source/README.md](pdf-source/README.md).
- [scripts/vercel-export-public.js](../scripts/vercel-export-public.js) — `assertNoPaidPdfsLeaked()` blocks `.pdf`, `api/`, `docs/`, and paid HTML names under `public/`. `data/` is build input, not a public URL.
- Mirror build uses `MIRROR_NOTE=1` — no storefront, no Stripe links. Pages artifact is `public/` only (not the repo root).
- `/api/*` — `Cache-Control: no-store`.
- `/api/fulfillment-health` is public by design. JSON is `{ ok, missing, redis, blobConfigured }` only — no `redisDetail` and no raw `error.message`.

---

## Dependencies

Run periodically:

```bash
npm audit
```

Fix high/critical before release. Document exceptions in CHANGELOG if deferred.

---

## Webhook security

- [api/stripe-webhook.js](../api/stripe-webhook.js) — raw body + Stripe signature verification.
- Idempotent fulfillment via Redis — duplicate webhooks must not double-send email.
- Shared Stripe account status mapping:
  - `ignored` (unknown / foreign product, partial refund, or refund with no CMO record) → **200** (stop retries)
  - `fulfilled` / `already_fulfilled` / `not_paid` / `revoked` → **200**
  - `locked` (Redis NX contention) → **503** (Stripe retries)
- Product identity order: CMO `price.id` → optional `payment_link` allowlist → `metadata.product` (metadata alone is vetoed when line items carry a foreign price id). Never match on dollar amount.
- Endpoint in Stripe Dashboard must be `https://www.promptanatomy.space/api/stripe-webhook`. Apex returns 307; Stripe does not follow it. Subscribe `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `charge.refunded`.
- A full refund (`charge.refunded` with `refunded: true`) sets fulfillment `revoked` when a `fulfillment-by-pi:` index exists (purchases after this deploy). That stops new success-page links and rejects existing email tokens. A partial refund does not revoke. A replay of the checkout event does not send another email.

## Download links

- Email links stay valid for 7 days and are reusable.
- `GET /api/download-link` re-mints a 15-minute link for 24 hours after `fulfilledAt`. Older records with no `fulfilledAt` still re-mint.
- Rate limit: 120 requests / 10 minutes per IP, 30 mints / hour per Checkout session. Over the limit → **429**.
- Revoked or closed re-mint → **403** with a generic error. Public download routes do not return `detail`.
- Download URL host follows `SITE_URL` when set. Otherwise only `promptanatomy.space`, `www.promptanatomy.space`, `localhost`, and `127.0.0.1`.
- `pro-md` is allowed only when the purchase includes the Markdown companion (Pro and Complete).

## Follow-up cron

- [api/fulfillment-followup.js](../api/fulfillment-followup.js) — `CRON_SECRET` is **required on every call** and must match `Authorization: Bearer …` (timing-safe compare, otherwise **401**). Set the env var in Vercel or the daily cron returns 401. `FULFILLMENT_FOLLOWUP_ENABLED=1` still decides whether emails send. Due jobs are listed with Redis `SCAN`, not `KEYS`.

---

## Related

- [DEPLOYMENT.md](../DEPLOYMENT.md) §2.5 — env matrix
- [docs/AGENT_SOT.md](AGENT_SOT.md) — operational paths
