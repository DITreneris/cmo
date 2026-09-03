# Language and brand guidelines — EN / LT

**Scope:** Customer-facing HTML on `promptanatomy.space`. Internal docs may use LT.

---

## Public brand (shipped HTML)

- **Brand name:** Prompt Anatomy only on `/en/`, PDFs, terms, privacy, success, emails.
- **Product family:** CMO AI Content System (paid); Content AI System (free library hero).
- **Locale:** EN canonical (`/en/`); SEO `x-default` → `/en/`.

## Do not ship on public EN pages

- Internal repo labels (“Spin-off No. 2”, “biblioteka” as product name in EN marketing)
- Un translated LT strings on `/en/*`
- Fake review schema (`aggregateRating`)

## LT `/lt/` (frozen tester snapshot)

- May retain LT UI for internal testers.
- **Not** release QA acceptance — CI smoke only.
- Do not sync EN commerce or copy backport without Orchestrator “LT snapshot refresh” scope.

## Commerce copy

- Lead with **content operating system**, not “PDF download”.
- Tier tags: **Use · Build · Install** — see [PRODUCT-POSITIONING.md](PRODUCT-POSITIONING.md).

## Agents

Before merge on EN-facing files:

```bash
rg -i "spin-off|biblioteka|prompt.?library" en/ terms.html success.html
```

Violations must be removed. EN footer hub line is the QW1b entity copy (`Part of Prompt Anatomy · Methodology at promptanatomy.app`), not “Spin-off”. Checkout stays on `promptanatomy.space` through Stripe; `.app` is methodology / brand context only.

---

**Related:** [MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md), [AGENT_SOT.md](AGENT_SOT.md)
