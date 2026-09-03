# Go-live runbook (R1 operator)

**Ambition A.** Linear command sequence to finish cash go-live on `promptanatomy.space`.  
**Does not exit R1 by itself.** Exit = `npm run check:prod` green + live Starter $3.99 email + download.

Dashboard field names and the full env matrix stay in [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md) and [.env.example](../.env.example). Do not commit `.env`.

PowerShell first (this machine). Bash equivalents in italics.

---

## 1. Export PDFs if local files are missing

```powershell
npm run pdf:export
```

Needed when `api/_private/pdfs/cmo-starter.pdf` or `cmo-pro.pdf` are absent. Optional companion: `npm run pdf:export-md`.

## 2. Dry-run Blob upload

```powershell
npm run pdf:upload-blob:dry
```

*bash:* `node scripts/upload-pdfs-to-blob.js --dry-run`

Confirms the three env names (`PDF_CMO_STARTER_SOURCE_URL`, `PDF_CMO_PRO_SOURCE_URL`, `PDF_CMO_PRO_MD_SOURCE_URL`) and prints any URLs already in local `.env`. **Bundle has no third PDF URL** — Complete Kit delivers starter + pro.

## 3. Upload and paste Blob URLs

```powershell
npm run pdf:upload-blob
```

Paste the printed `ENV=url` lines into Vercel → Production → Environment Variables. Redeploy after saving.

## 4. Stripe Dashboard leftovers

Do the remaining boxes in [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md#stripe-dashboard): success URL, webhook `https://promptanatomy.space/api/stripe-webhook`, `price_…` / `whsec_…` for all three SKUs.

## 5. Local fulfillment probe

```powershell
npm run check:fulfillment
```

Needs a complete local `.env` (same keys as Production). Redis PONG + Stripe `sessions.list` must pass.

## 6. Resend email drill

```powershell
$env:TEST_SEND='1'; $env:TEST_FULFILLMENT_EMAIL='you@example.com'; npm run check:fulfillment
```

*bash:* `TEST_SEND=1 TEST_FULFILLMENT_EMAIL=you@example.com npm run check:fulfillment`

Inbox should receive the drill from the verified `FULFILLMENT_FROM_EMAIL` sender.

## 7. Redeploy Production

Vercel → promptanatomy.space → Redeploy (after env changes). Build command is already `REQUIRE_STRIPE_LINKS=1 npm run build`.

## 8. Production health

```powershell
npm run check:prod
```

Fails if `/api/fulfillment-health` is not `{ ok: true, missing: [] }` or the IndexNow key file is missing. Prints **key names only**. Follows apex → `www` redirects.

## 9. Live Starter drill

Buy Starter $3.99 on `/en/#pdf-storefront` → email ≤5 min → `success.html` poll → Download. Then Pro and Bundle. Webhook idempotency: second delivery → `already_fulfilled`.

## 10. IndexNow on the primary host

After a **Vercel** production deploy (not only GitHub Pages):

```powershell
npm run seo:indexnow
```

Pages workflow ping is non-blocking and is not the primary signal.

## Analytics (optional, not R1 exit)

Enable **Vercel Web Analytics** on the project dashboard so `copy_prompt_1`, `open_brief`, `click_starter`, and `success_download` appear. Snippet injects only into `public/` HTML.

---

**Next:** tick the matching boxes in [todo.md](../todo.md) and [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md).
