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

- [scripts/vercel-export-public.js](../scripts/vercel-export-public.js) — `assertNoPaidPdfsLeaked()` blocks any `.pdf` under `public/`.
- Mirror build uses `MIRROR_NOTE=1` — no storefront, no Stripe links.
- `/api/*` — `Cache-Control: no-store`.

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

---

## Related

- [DEPLOYMENT.md](../DEPLOYMENT.md) §2.5 — env matrix
- [docs/AGENT_SOT.md](AGENT_SOT.md) — operational paths
