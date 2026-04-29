# Microcopy audit – English UI/UX

> Statusas: Historical snapshot + partial backlog.  
> Prieš taikant rekomendacijas būtina patikrinti aktualią `en/index.html` ir `en/privacy.html` būseną.

**Scope:** English version (`en/index.html`, `en/privacy.html`, root `index.html`, dynamic JS strings)  
**Date:** 2026-03-06  
**Focus:** Clarity, consistency, tone, actionability, accessibility (aria-labels), errors, CTAs.

---

## 1. Inventory of user-facing copy

### 1.1 Page titles & meta

| Location | Current copy | Note |
|----------|--------------|------|
| `en/index.html` `<title>` | Let AI do 30–50% of your daily tasks – Prompt Anatomy | Strong value prop; long for tab. |
| `en/privacy.html` `<title>` | Privacy policy – Prompt Anatomy | Clear; brand aligned. |
| Root `index.html` `<title>` | Redirect – Prompt Anatomy | OK for redirect; brand aligned. |

### 1.2 Skip link & navigation

| Location | Current copy |
|----------|--------------|
| Skip link | Skip to content |
| Lang switcher (visible) | English / Lietuvių |
| Badge (link) | Prompt Anatomy |
| Badge (status) | Spin-off No. 1 |

### 1.3 Hero

| Element | Current copy |
|---------|--------------|
| H1 | Let AI do 30–50% of your daily tasks |
| Subline | 8 exercises with ready-made templates – results in minutes. |
| Meta (who it’s for) | Who it's for: Managers, specialists, consultants, freelancers. |
| CTA primary | Start for free |
| CTA secondary | Join the community |

### 1.4 Objectives section

| Element | Current copy |
|---------|--------------|
| H2 | What you actually get |
| Intro | In 30 minutes you’ll have a basic AI workflow: |
| Bullets | 3–5 hours saved per week; Up to 6× lower error risk; 8 standardized templates; Clear automation logic instead of chaotic prompts |

### 1.5 Instructions

| Element | Current copy |
|---------|--------------|
| H2 | How to use this library |
| Time hint | ~3–5 min per step |
| Steps 1–4 | (see full text in HTML) |

### 1.6 Progress

| Element | Current copy |
|---------|--------------|
| Default | You've used 0 of 8 prompts |
| Complete | Great – you've used all 8. |
| Dynamic | You've used X of 8 prompts. |

### 1.7 Code block (CSS ::before)

| Element | Current copy |
|---------|--------------|
| Tooltip (hover/focus) | Click here and copy |

### 1.8 Prompt cards (repeated pattern)

- **Categories:** Foundation, Analysis, Role, Document, Processes, AI Integration, Library, Simulation.
- **Titles:** e.g. AI Context Check, Organization Portrait, My Role in the Organization, etc.
- **Descriptions:** One line per prompt.
- **“Before using”:** Use when / Replace before using / What to do.
- **Info box titles:** Why it matters, Application, Result, Practical value, Optimization, Real impact, Daily improvement, Readiness.
- **Button:** Copy prompt
- **Checkbox label:** Mark as done

### 1.9 Next steps

| Element | Current copy |
|---------|--------------|
| H2 | What’s next? |
| Intro | Best to go in order from 1 to 8. Click a link to jump to that prompt. |
| Links | 1. Context check, 2. Organization portrait, … 8. Critical situation simulation |

### 1.10 Community & footer

| Element | Current copy |
|---------|--------------|
| Community H2 | Want more? Join the WhatsApp group. |
| Subline | Shared discussions, tips and news about prompts and AI. |
| Primary CTA | Join WhatsApp group |
| Secondary CTA | Prompt Anatomy → |
| Footer H3 | Good luck with your analysis |
| Footer reminder | If the prompt has [COMPANY] or [MY ROLE] – replace with your details. The AI role (e.g. “critical analyst”) is already set – no need to change it. |
| Product link | This is **Spin-off No. 1** from “Prompt Anatomy”. Full interactive course and more: Prompt Anatomy → |
| Tags | AI-optimized, 8 prompts, Quick start, Results |
| Copyright | © 2026 Tomas Staniulis. Training material. All rights reserved. Privacy |

### 1.11 Toast & dynamic (JS)

| Context | Current copy |
|---------|--------------|
| Toast (success) | Copied. |
| Button after copy | Copied! |
| Error: missing params | Error: missing parameters |
| Error: no element | Prompt not found |
| Error: empty | Prompt is empty |
| Error: copy failed | Copy failed |
| Error: fallback | Failed. Select the text manually and copy. |
| Fallback button label | Select text |

### 1.12 Privacy page

| Element | Current copy |
|---------|--------------|
| Back link | ← Back to library |
| H1 | Privacy policy |
| Intro | **Prompt Anatomy** – minimal app. A brief note about your data. |
| H2 | Do we collect your data? / What happens on your device? / If we add a form later |
| Body | (see privacy.html) |
| Bottom link | ← Back to DI Prompt Library |

### 1.13 Root redirect

| Element | Current copy |
|---------|--------------|
| Visible text | Redirecting… Lietuvių \| English |

---

## 2. UX & microcopy audit

### 2.1 Strengths

- **Value-first hero:** “Let AI do 30–50% of your daily tasks” is clear and benefit-led.
- **Scannable structure:** Sections (What you get, How to use, prompts, What’s next) are easy to scan.
- **Consistent pattern:** Each prompt card uses the same “Before using” / “What to do” structure.
- **Action-oriented CTAs:** “Start for free”, “Copy prompt”, “Join WhatsApp group” state the action.
- **Time framing:** “~3–5 min per step” and “In 30 minutes” set expectations.
- **Progress copy:** “You’ve used X of 8 prompts” and “Great – you’ve used all 8” support motivation.

### 2.2 Issues and recommendations

#### A. Clarity and consistency

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“For?”** (header-meta) | “For?” alone is cryptic; “Who it’s for” is in aria-label only. | Use visible copy: “For: Managers, specialists, consultants, freelancers.” or “Who it’s for: Managers, specialists, consultants, freelancers.” |
| **“Click here and copy”** (code-block) | “Here” is vague for screen readers; “copy” could mean “duplicate” or “copy to clipboard”. | Prefer: “Click to select, then copy” or “Select and copy prompt” (align with aria-label). |
| **“Select text”** (error fallback) | Shown when no specific error is passed; generic. | Keep as last-resort; consider “Copy didn’t work. Select the text and press Ctrl+C.” for fallback path. |

#### B. Tone and wording

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“What you actually get”** | “Actually” can sound defensive. | “What you get” or “What’s included” is neutral and clear. |
| **“chaotic prompts”** (objectives) | Slightly negative. | “Clear automation logic instead of ad‑hoc prompts” or “structured workflows instead of one-off prompts”. |
| **“Good luck with your analysis”** | Generic; “analysis” may not match all use cases. | “Good luck with your prompts” or “Good luck putting this into practice” to match the product. |

#### C. Errors and edge cases (JS)

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“Error: missing parameters”** | Technical; users never “pass parameters”. | Don’t show this to users (handle in code). If something fails, show: “Something went wrong. Try copying again.” |
| **“Prompt not found”** | Technical. | Same as above; generic recovery message is better. |
| **“Prompt is empty”** | Technical. | Same; generic message. |
| **“Copy failed”** | Clear but no next step. | “Copy failed. Try selecting the text and pressing Ctrl+C (or Cmd+C).” |
| **“Failed. Select the text manually and copy.”** | Good direction; “Failed” is abrupt. | “Copy didn’t work. Select the text and copy with Ctrl+C (or Cmd+C).” |
| **Toast “Copied.” vs button “Copied!”** | Inconsistent punctuation. | Use one style: e.g. “Copied” everywhere (or “Copied!” everywhere). |

#### D. Accessibility (aria-labels)

| Item | Current | Recommendation |
|------|---------|----------------|
| Code block | “Select and copy prompt N” | Good. |
| Copy button | “Copy prompt N to clipboard” | Good. |
| Success | “Prompt copied successfully” | Good. |
| Community primary CTA | “Open Prompt Anatomy WhatsApp group in new tab” | Slightly wrong (it’s “Prompt Anatomy” product but the group may have another name). Consider: “Join Prompt Anatomy WhatsApp group (opens in new tab)”. |
| Progress bar | `aria-label="Progress"` | Optional: “Progress: X of 8 prompts used” for more context. |

#### E. Consistency with product naming

| Item | Note |
|------|------|
| **“DI Prompt Library”** (privacy, footer) vs **“Prompt Anatomy”** (badge, product link) | Decide: is the product “Prompt Anatomy” and this the “DI Prompt Library” spin-off, or one name for the app? Ensure privacy and footer use the chosen naming. |
| **“Spin-off No. 1”** | Clear; keep as is if that’s the brand. |

#### F. Privacy page

| Item | Issue | Recommendation |
|------|--------|----------------|
| **“← Back to library”** vs **“← Back to DI Prompt Library”** | Two different link texts at top and bottom. | Use one: e.g. “← Back to library” in both places, or “Back to DI Prompt Library” if you want the full name. |
| **“We do not collect any personal data at this time.”** | Clear. | Optional: “We don’t collect personal data.” for a slightly friendlier tone. |

#### G. Instructions (step 4)

| Item | Current (condensed) | Note |
|------|----------------------|------|
| Placeholders | “[COMPANY]”, “[MY ROLE]”; “replace with your or your client’s company” | Clear. “The AI role … is already in the prompt – no need to change it” is good. Consider one short sentence: “Replace only [COMPANY] and [MY ROLE]; leave the AI role as is.” |

---

## 3. Summary table – priority

| Priority | Area | Action |
|----------|------|--------|
| **High** | Hero “For?” | Replace with “Who it’s for:” or “For:” + list so it’s clear without aria. |
| **High** | JS errors | Replace technical messages (“missing parameters”, “Prompt not found”, “Prompt is empty”) with a single user-facing message; improve “Copy failed” / fallback with next step (Ctrl+C). |
| **Medium** | “Click here and copy” | Change to “Select and copy” or “Click to select, then copy”. |
| **Medium** | Toast vs button | Unify “Copied” / “Copied!”. |
| **Medium** | “What you actually get” | Consider “What you get” or “What’s included”. |
| **Low** | “Good luck with your analysis” | Consider “Good luck with your prompts” or similar. |
| **Low** | Privacy back link | Use same label at top and bottom. |
| **Low** | Progress `aria-label` | Optionally make dynamic (“Progress: X of 8 prompts used”). |

---

## 4. Questions for product / content (decisions 2026-03-06)

1. **Product name in UI:** Use “Prompt Anatomy” as main brand; “DI Prompt Library” only as secondary descriptor where useful. *Applied in privacy title, back link, root redirect.*
2. **Audience:** “Managers, specialists, consultants, freelancers” kept in hero as “Who it’s for:”.
3. **Error handling:** No technical errors in UI; user-facing messages only; manual copy hint when clipboard fails. *Applied in JS.*
4. **Tone:** (Privacy “We do not collect” vs “We don’t collect”) – left for later; backlog optional.
5. **Localization:** EN string sync note added to MULTILINGUAL_STRUCTURE.md §4 so LT stays aligned when EN changes.

---

## 5. Files to update (when implementing)

- **`en/index.html`** – hero meta, instructions, code-block ::before, next steps, community, footer, progress text; all JS error/success strings and aria-labels.
- **`en/privacy.html`** – back link(s), optional tone tweaks.
- **Root `index.html`** – only if redirect or product name copy is changed.

---

## 6. High-priority changes applied (2026-03-06)

- **Hero:** “For?” → “Who it's for:” (visible and aria).
- **JS errors:** All technical messages replaced with user-facing copy:
  - Generic: “Something went wrong. Try copying again.”
  - When clipboard/manual copy needed: “Copy didn't work. Select the text and use Ctrl+C (or Cmd+C).” or same with “Select the text and use Ctrl+C (or Cmd+C).” where relevant.
  - `aria-label` on error: no longer prefixed with “Error:”.
- **Product naming:** “Prompt Anatomy” as primary brand:
  - `en/privacy.html`: title “Privacy policy – Prompt Anatomy”; bottom link “← Back to library”.
  - Root `index.html`: title “Redirect – Prompt Anatomy”.
- **LT sync:** EN string sync note added to [docs/MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) §4.

---

## 7. Backlog – medium/low (exact diffs)

Apply when ready; keep LT in sync per MULTILINGUAL_STRUCTURE.md §4.

### Medium

**7.1 Code-block tooltip (CSS)** – `en/index.html`, in `.code-block::before`:

```css
/* Current */
content: 'Click here and copy';

/* Suggested */
content: 'Select and copy';
```

**7.2 Toast vs button – unify “Copied”** – `en/index.html`:

- Toast (HTML): `<span>Copied.</span>` → `<span>Copied</span>` (no period), or keep and change button to “Copied.” for consistency.
- Button (JS) `showSuccess`: `'<span>Copied!</span>'` → `'<span>Copied</span>'` to match toast, or keep “Copied!” and set toast to “Copied!”.

**7.3 Objectives H2** – `en/index.html`:

```html
<!-- Current -->
<h2 ...>What you actually get</h2>

<!-- Suggested -->
<h2 ...>What you get</h2>
```

### Low

**7.4 Footer H3** – `en/index.html`:

```html
<!-- Current -->
<h3>Good luck with your analysis ...</h3>

<!-- Suggested -->
<h3>Good luck with your prompts ...</h3>
```

**7.5 Progress bar `aria-label`** – `en/index.html`: optional. Update the progress bar element so `aria-label` is dynamic, e.g. “Progress: X of 8 prompts used” (would require JS to set it when count changes).

**7.6 Privacy – back link** – Already aligned: both top and bottom use “← Back to library” after high-priority pass.

---

## 8. US localization playbook update (2026-04-29)

### 8.1 Zone model applied (content-only)

- **Conversion-critical (L2-L3):** hero headline/subline, primary CTA, objectives headline, community headline, prompt body framing.
- **Trust-critical (L1):** copy error states, copy fallback instructions, aria error labels.
- **Utility (L1-L2):** instructions and tooltip copy (selection/copy guidance).

### 8.2 EN-US mini style guide (implemented)

1. Use plain US business English, short action-first sentences.
2. Prefer US terms and spelling (`focused`, `optimize`, `behavior`).
3. Use colloquial flavor only in conversion sections; avoid slang in error/help text.
4. Use concrete operator language: `KPI`, `CTA`, `pipeline`, `test`, `pause`.
5. Include city examples only when they improve scenario clarity (not decoration).
6. Include `$` framing when discussing budget or impact.
7. Keep CTA verbs consistent (`Get started`, `Join`, `Copy`).
8. Error copy must include a recovery action.
9. Avoid defensive wording (`actually`) in section titles.
10. Keep trust copy calm and neutral; no hype in fallback/error states.

### 8.3 Before/after examples (selected)

- **Hero CTA**
  - Before: `Get free`
  - After: `Get started free`

- **Objectives title**
  - Before: `What you actually get`
  - After: `What you get`

- **Tooltip**
  - Before: `Click here and copy`
  - After: `Click to select and copy`

- **Error handling**
  - Before: `Error: missing parameters`
  - After: `Something went wrong. Try copying again.`

- **Prompt localization style**
  - Before: generic prompt phrasing without local market context
  - After: US market framing with city examples (`Austin, Miami, Chicago`) and `$`-based budget/impact cues where relevant

### 8.4 Files updated in this pass

- `data/en-prompt-bodies.json`
- `scripts/build-locale-pages.js`
- Generated outputs: `en/index.html`, `js/en-prompt-bodies-inline.js`
