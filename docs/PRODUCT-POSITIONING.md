# Product Positioning — CMO AI Content System

**Scope:** EN-only paid layer (`promptanatomy.space`). The free interactive library and the LT site are out of scope here.
**Owner:** Commerce + Content. **Review gate:** every paid-surface copy change is checked against this file before merge.
**Related:** [OFFER-ARCHITECTURE.md](OFFER-ARCHITECTURE.md), [config/sot.json](../config/sot.json), [memo_pdf.md](../memo_pdf.md), [AGENTS.md](../AGENTS.md), [roadmap.md](../roadmap.md).

**Active product path:** Use · Build · Install maturity ladder on `/en/` + GEO on one URL + optional browser-local tools ([roadmap.md](../roadmap.md) Ambition A → E → light B → C). The kits are offline delivery, but the page should sell the system maturity, not lead with “PDF kit.” **SaaS remains “do not claim”** (login, dashboard, hosted studio) until Ambition F is explicitly opened and this file’s §3 is rewritten.

---

## 1. The promise

**One line:** *From ready-made AI content workflows to your own internal content tools — delivered as offline system kits for marketing teams.*

We sell a **content operating system** for in-house marketing teams. We deliver it as printable PDF kits plus a Markdown companion. The PDF is the delivery format, not the product story.

The free EN layer sells "Content AI System" via the **open creative brief builder** (hero primary) plus **4 core interactive workflows** (prompts 1, 2, 3, 5 — display 1–4 — library after PDF); prompts 4/6–10 appear in the `#pro-contents` catalog (not faux prompt cards) after the storefront. See [config/brand-seo.json](../config/brand-seo.json). The paid layer must speak the same language so the funnel reads as one product, not a separate document download.

---

## 2. Tier ladder — Use · Build · Install

| Tier | Tag | CMO job-to-be-done | What we actually deliver |
|------|-----|--------------------|--------------------------|
| **Starter** | **Use** | Start producing better content this week | 14-page PDF: content OS, 10 prompt minis, weekly rhythm, pre-publish verify gate |
| **Pro** | **Build** | Design reusable tools and team workflows | 30-page PDF + Markdown: full prompt bodies, expected outputs, scenarios, workshop, rubric, **plus a workflow/tool-building method** |
| **Bundle** | **Install** | Own the full operating system offline | Starter + Pro in one checkout (44 pages, team license) |

The ladder is a maturity progression: **use the system → build your own tools on top of it → install the whole thing for the team.** Each tier must feel like a different maturity level, not "small PDF / bigger PDF."

---

## 3. What we claim — and what we do not

**We claim:**
- A repeatable operating cycle: Plan → Create → Check → Improve.
- Practical, execution-first assets a marketing team can use the same week.
- Pro teaches teams to design reusable prompt systems and workflow templates (the "Build" tier).
- Offline, printable, workshop-ready, team-licensed.
- The free EN layer may include a **browser-only creative brief builder** (`#creative-brief`) that assembles an image prompt locally (no account, no server).

**We do not claim:**
- A live SaaS app, dashboard, login, or hosted creative studio. Paid delivery remains PDF + email.
- An AI course or a generic prompt pack.
- Custom autonomous "agents." We teach reusable prompt systems and workflow templates, not agent infrastructure.

---

## 4. Language from search intent (JTBD)

Buyer searches often say *AI marketing workflow*, *content operating system*, *brand voice guardrails*, or *structured prompting*. Use that language as **job framing** on `/en/` (hero, FAQ, storefront, GEO).

- Public product name stays **Content AI System** (H1, slogan, SKU family).
- Soft **content operating system** is fine for Bundle / storefront Install framing.
- Do **not** rename the product to “AI Marketing Operating System” or lead with “PDF kit.”
- Do **not** claim a live SaaS, agents, or free interactive 10.

Copy SSOT for these jobs: [`config/sot.json`](../config/sot.json) (`frontFaq`, `storefrontHead`, `knowsAbout`) + [`config/brand-seo.json`](../config/brand-seo.json).

## 5. Pitfalls to avoid

1. **Do not lead with "PDF kit" or "printable kits."** That lowers perceived value before anyone reads the bullets. Sell the system; mention PDF as the format in the FAQ and trust line.
2. **Keep Starter and Pro clearly different in kind.** Starter = *use* ready-made workflows. Pro = *build* your own. If they read as two sizes of the same file, the ladder fails.
3. **Do not imply a live app exists.** Words like "system," "workflow kit," "browser builder," and "tool-building method" are fine; "log in," "dashboard," and "platform" are not, until a real app ships. The free `#creative-brief` section is a browser builder, not a hosted studio.
4. **Keep internal identifiers stable.** Rename display strings only. Stripe `metadata.product` (`starter` / `pro` / `bundle`), Blob paths (`paid-pdfs/cmo-*.pdf`), fulfillment `publicId` / `downloadFileName`, and price cents must not change — fulfillment depends on them. SOT `publicId` / `downloadFileName` must match [`api/_lib/fulfillment.js`](../api/_lib/fulfillment.js) `PRODUCTS` (tests assert). JSON-LD `sku` is derived as `cmo-` + `id` (`cmo-starter`) and is a separate layer.

---

## 6. Naming reference

| Layer | v2 public name | Checkout `id` | Fulfillment `publicId` | JSON-LD `sku` |
|-------|----------------|---------------|-------------------------|---------------|
| Family | CMO AI Content System | — | — | — |
| Starter | CMO AI Content System · Starter | `starter` | `cmo-starter-pdf` | `cmo-starter` |
| Pro | CMO AI Content System · Pro | `pro` | `cmo-pro-pdf` | `cmo-pro` |
| Bundle | CMO AI Content System · Complete Kit | `bundle` | `cmo-bundle-pdf` | `cmo-bundle` |

Buyer download filenames (Content-Disposition, from `PRODUCTS.downloadFileName`): `prompt-anatomy-cmo-starter.pdf`, `prompt-anatomy-cmo-pro.pdf`. Bundle is not a single file (`cmo-prompt-kit-bundle`). Blob local names stay `cmo-starter.pdf` / `cmo-pro.pdf`.

After a v2 copy pass, a search for "CMO Prompt Kit" should return zero hits in EN paid surfaces (storefront, PDF covers and footers, fulfillment emails, success page).
