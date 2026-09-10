# Product roadmap — CMO AI Content System

**Canon sequence:** Ambition **A** → **E** → light **B** → **C**  
**Active tracker:** [todo.md](todo.md)  
**Ops detail (R1):** [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md)  
**Agent contract:** [AGENTS.md](AGENTS.md) §0.2  
**Last updated:** 2026-09-03

**Verdict:** Close production commerce first; then GEO on one URL; then one more browser-local tool; then deepen offline Install kits. Do not open SaaS or a multi-kit catalog until R1 converts.

**Naming:** Roadmap phases are **R1–R4** / **Ambition A/E/B/C**. Do **not** call commerce “Phase A” — that label in [AGENTS.md](AGENTS.md) §0.1 means the EN free-surface (tool-first: open brief → PDF → library), which is already shipped. Do **not** treat UX Conversion Audit **P0–P3** as roadmap R1–R4.

```mermaid
flowchart LR
  R1["R1 Ambition A go-live"] --> R2["R2 Ambition E GEO"]
  R2 --> R3["R3 Ambition B one tool"]
  R3 --> R4["R4 Ambition C Install depth"]
  R4 --> Later["Later G then maybe D or F"]
```

---

## R1 — Ambition A: Close the cash register

| | |
|--|--|
| **Goal** | Live Stripe → webhook → Resend → Blob download on `promptanatomy.space` |
| **Owner** | Commerce (+ Orchestrator gate) |
| **Entry** | Repo SOT already has live Payment Links; `allowPlaceholderCheckout: false` |
| **Exit** | `GET /api/fulfillment-health` → `{ ok: true }`; live Starter (then Pro/Bundle) email + download ≤5 min; `success.html` poll works |
| **Primary docs** | [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md), [DEPLOYMENT.md](DEPLOYMENT.md) §2.5, [memo_pdf.md](memo_pdf.md) |
| **Kill if** | Fulfillment cannot be made reliable after env + Blob are correctly set |

**In scope:** Blob upload, Vercel Production env, webhook signing, live purchase drills, commit/push redeploy.  
**Out of scope for exit:** New browser tools, PDF content expansion, SaaS, price/SKU change, CSS dual-layer rewrite.  
**Parallel (not exit):** `/en/` conversion-surface polish (sticky nav, hero outcome, storefront copy) may ship as **R1-support**. Shipped 2026-09-03. See [todo.md](todo.md).

---

## R2 — Ambition E: GEO / AI-search distribution

| | |
|--|--|
| **Goal** | Stronger discovery on the **same** `/en/` URL — FAQ, `llms.txt` hubs, IndexNow signal |
| **Owner** | Content (+ QA for schema/claims) |
| **Entry** | R1 exit (cash register boringly works) |
| **Exit** | `frontFaq` maintained (≥8); hash hubs accurate; IndexNow post-deploy used; no invented ROI/stats; no new SEO hub routes |
| **Primary docs** | [docs/AGENT_SOT.md](docs/AGENT_SOT.md) §5, [docs/PRODUCT-POSITIONING.md](docs/PRODUCT-POSITIONING.md) §4, [AGENTS.md](AGENTS.md) §10.11–13 |
| **Kill if** | No attributable AI/search visits after sustained GEO work — reallocate to conversion on `/en/` |

**In scope:** `config/sot.json` / `brand-seo.json` JTBD copy, FAQ triple sync, `scripts/geo-surfaces.js` hub quality.  
**Out of scope:** `/en/ai-marketing-*` landing farms; lengthening path to first Copy.

**Baseline harden (2026-09-03, not R2 exit):** FAQ answer parity in `tests/structure.test.js`, `llms.txt` `#pro-contents` hub, `npm run check:prod` IndexNow key assert, runbook ping after Vercel. Further GEO still waits for R1 exit.

---

## R3 — Ambition B (light): One more browser-local tool

| | |
|--|--|
| **Goal** | Exactly **one** new sessionStorage tool after spine `#block5`, before teasers |
| **Owner** | Curriculum (placement) → UI/UX + Content |
| **Entry** | R2 exit (or Orchestrator waives R2 if GEO baseline already green) |
| **Exit** | Tool ships EN-only (mirror OK); LT strip; e2e; hero → Prompt 1 Copy path unchanged; secondary to brief/tool only |
| **Primary docs** | [docs/CREATIVE_BRIEF_BUILDER.md](docs/CREATIVE_BRIEF_BUILDER.md) (pattern), [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md), [AGENTS.md](AGENTS.md) §10.7 |
| **Kill if** | Tool becomes a pre-value wall or dual-primary CTA with the spine |

**In scope:** One local builder (e.g. pre-publish gate or weekly rhythm) — no account, no POST.  
**Out of scope:** Tool suite sprawl, I2V, Consistency Lock Lab, React port, SaaS.

---

## R4 — Ambition C: Offline Install depth

| | |
|--|--|
| **Goal** | Deeper Pro/Bundle Install — workshop / facilitator / Markdown vault richness |
| **Owner** | Commerce + Content (+ Curriculum for pedagogy) |
| **Entry** | R1 converting (at least one paid SKU proven end-to-end in production) |
| **Exit** | Use · Build · Install still feel different in **kind**; page-count gates pass; no login/dashboard claims |
| **Primary docs** | [docs/PRODUCT-POSITIONING.md](docs/PRODUCT-POSITIONING.md), [docs/OFFER-ARCHITECTURE.md](docs/OFFER-ARCHITECTURE.md), `docs/pdf-source/*` |
| **Kill if** | Buyers expect a live app after “system” language and bounce — tighten copy, do not add SaaS here |

**In scope:** PDF/MD depth, team-license clarity, workshop-ready assets; after converting, persona vs $3.99 reconciliation (Audit P3).  
**Out of scope:** Accounts, hosted vault, Ambition F.

---

## UX Conversion Audit mapping (2026-09-03)

Audit phases **P0–P3 are not** roadmap R1–R4. Historical canvas: `ux-conversion-audit`. Gap after P0/P1 ship: `ux-audit-roadmap-gap`. Tracker: [todo.md](todo.md).

| Audit | Status | Roadmap home |
|-------|--------|--------------|
| P0 defects + P1 nav / hero / storefront | Shipped as **R1-support** | Parallel to Ambition A; does not exit R1 |
| P0 analytics | Unscheduled | Orchestrator decide; not R1 exit |
| P1 fat diagram / open brief / comparison table | **Rejected** | Conflicts with [AGENTS.md](AGENTS.md) §0.1 path cut and §10.15 |
| P2 CSS dual-layer (inline `<style>`) | Parked | Engineering debt with [TEMPLATE_MIGRATION_BACKLOG.md](docs/TEMPLATE_MIGRATION_BACKLOG.md) — **not** R2 GEO |
| P3 live purchase drills | **Active = R1** | Ambition A / [MUST_TODO_STRIPE.md](MUST_TODO_STRIPE.md) |
| P3 persona vs $3.99 | Locked | R4 after R1 converting |
| RC6 full brand consolidation | Parked | Ambition G |

---

## Parked (not active roadmap)

| Ambition | Why parked | Reopen when |
|----------|------------|-------------|
| **F** — Controlled SaaS | Conflicts with PRODUCT-POSITIONING §3 (no login/dashboard) | Explicit Orchestrator scope + rewrite of §3 claims + budget |
| **D** — Vertical kit catalog | Dilutes focus before first kit monetizes | R1 converting and fulfillment is boringly reliable |
| **G** — Mother-brand consolidation | Org/multi-repo; Audit RC6 (one destination) | After R1; brand ops capacity |
| Template migration + CSS dual-layer | Engineering debt, not product ambition | [docs/TEMPLATE_MIGRATION_BACKLOG.md](docs/TEMPLATE_MIGRATION_BACKLOG.md) + Audit P2 when Orchestrator schedules |

---

## PR rule

Every product PR declares which **Ambition** (A/E/B/C) or **Parked** epic it serves. Ambition **F** or **D** scope without Orchestrator rewrite of this file → reject.
