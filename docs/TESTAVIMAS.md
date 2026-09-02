# Gyvo testavimo dokumentacija

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)  
**Deploy:** žr. [DEPLOYMENT.md](../DEPLOYMENT.md)

Po kiekvieno deploy atlikti gyvą testavimą ir rezultatus įrašyti čia (arba nuoroda į atskirą žurnalą).

---

## 1. Testavimo aplinka

| Laukas | Reikšmė |
|--------|--------|
| Primary URL | https://promptanatomy.space/ (Vercel) |
| Mirror URL | https://ditreneris.github.io/cmo/ (GitHub Pages) |
| Naršyklė(ės) | Chrome, Firefox, Safari, Edge |
| Mobilus | iOS Safari / Chrome Mobile (pasirinktinai) |

Po deploy testuoti **abu** taikinius – **pilnas checklist `/en/`** (kanonas); `/lt/` – greitas smoke (užšaldyta snapshot).

**Locale politika:** [MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) §0.

---

## 2. Scenarijai (checklist)

### Funkcionalumas

- [ ] **Kopijavimas (spine):** Promptai 1, 2, 3, 5 – Copy → DI; kontekstas + taisyklės prepend'inamos. Teaseriai 4/6–10 – be copy, CTA į Pro.
- [ ] **EN UX spine-first:** hero primary → `#block1`; secondary → `#creative-brief`; brief po spine `#block5`, prieš teasers; contiguous 1→2→3→5; progress of 4; 0 meme slotų; Stripe checkout nepakitęs.
- [ ] **CMO kontekstas:** Užpildyti `#cmo-context` laukus → kopijuoti promptą → įklijuotas tekstas turi konteksto bloką ir „TAISYKLĖS (privalomos)" / „RULES (non-negotiable)".
- [ ] **Scenarijai:** `#cmo-scenarios` skirtukai veikia (klaviatūra: rodyklės); kopijavimas iš scenarijaus į clipboard.
- [ ] **Safety blokas:** `#cmo-safety` recenzento promptas kopijuojasi.
- [ ] **Progresas:** „Pažymėjau kaip atlikau" – varnelė įrašoma; perkrovus puslapį – progresas išsaugotas (localStorage).
- [ ] **Skip link:** Tab iki „Praleisti į turinį" – Enter – fokusas pereina į pagrindinį turinį.
- [ ] **Privatumas:** Veikia `lt/privatumas.html` ir `en/privacy.html`; rodomos teisingos canonical/hreflang žymos.

### Prieinamumas (a11y)

- [ ] **Klaviatūra:** Navigacija Tab, Enter, Esc – veikia be įstrigimo.
- [ ] **Focus:** Matomas focus (pvz. focus-visible) ant mygtukų ir nuorodų.
- [ ] **Pa11y:** CI bėga į `/en/` (kanonas), `/lt/` (smoke), privacy. Lokaliai release QA: `npx pa11y http://localhost:3000/en/ --standard WCAG2AA --ignore "warning"`.

### UX path cut (EN kanonas, DS 1.6)

- [ ] **Hero:** full-bleed; brand mark; primary = Start your first workflow (`#heroCtaSpine` → `#block1`); secondary = brief text link (`#heroCtaBrief`); `#heroProof`; trust chips `#heroTrustPill1/2/3`; slim `.hero-diagram` (modules + caption only — **no** outputs row / tagline / cycle-stepper); quiet usage strip; nėra mini-prompt demo ir hero Telegram nuorodos.
- [ ] **Type:** Fraunces display (hero H1 only) + Source Sans 3 UI (ne Inter); body ~17px; prose ne full-bleed wall.
- [ ] **Executive summary:** `#executive-summary.objectives--skim` – quiet usage sentence only; claims = 4 workflows + brief (ne „100 assets / 45 min“).
- [ ] **Instructions:** `#copy-tips` as optional `<details>`; **no** `#framework-schema` / provider hub.
- [ ] **CMO context:** closed `#cmo-context` **prieš** progress; forma `<details>`; kopijavimas prepend'ina kontekstą.
- [ ] **Prompt 1 path hint:** `#prompt1PathHint` – Copy → paste into ChatGPT/Claude.
- [ ] **Progress jump:** `#progressJump` 1·2·3·5 · Pro · Brief · FAQ; Pro = `#pro-contents`; Brief stripped on `/lt/`.
- [ ] **Sticky bar (≤768px):** Po `#block1` pasirodo juosta; Kopijuoti / Kitas → veikia.
- [ ] **FAQ:** 3 primary klausimai + `<details class="faq-more-details">`; title be „before you start“; JSON-LD pilnas (`frontFaq` ≥ 8).
- [ ] **PDF storefront (EN):** 3 kortelės, **no** comparison table; live `buy.stripe.com`; Buyer FAQ `<details>`.
- [ ] **Free loop after spine:** thin `#cmo-safety` → EN `#creative-brief` (teaser + closed `#cb-builder`) → `#cmo-scenarios` → `#pro-contents` → storefront → FAQ → `#prompt-basics`.
- [ ] **Meme:** 0 slotų gyvoje UI.

### Responsive / naršyklės

- [ ] **Desktop:** Veikia Chrome / Firefox / Edge (arba Safari).
- [ ] **Mobilus:** Veikia vienoje iš: iOS Safari, Chrome Mobile (layoutas, mygtukai, kopijavimas, sticky bar).

### Turinio / bullet-proof (META, INPUT, OUTPUT)

- [ ] **Struktūra:** Kiekvienas iš **10** promptų turi aiškius META, INPUT, OUTPUT blokus (kopijuojamas tekstas).
- [ ] **Copyable:** Į darbinių atmintinę kopijuojamas META+INPUT+OUTPUT su CMO v2 prepend (kontekstas + taisyklės, jei aktyvūs); info-box ir „Tikėtinas atsakymas" sekcijos rodomos atskirai ir nekopijuojamos.
- [ ] **Tikėtinas atsakymas:** Po kiekvienu promptu matosi `.prompt-expected` su ≥2 bullet'ais.
- [ ] **Turinio patikra:** Nukopijuoti 1–2 promptus, įklijuoti – įklijuotas tekstas turi tinkamą formatą (žr. [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md)).

### Kiti

- [ ] Nėra console klaidų atidarius puslapį ir atlikus kopijavimą.
- [ ] Nuorodos nepalūžusios (pagrindinis, privatumas).

### Commerce (EN-only, live)

- [ ] **`/en/` storefront:** 3 kortelės; CTAs → live `buy.stripe.com` (ne `/coming-soon.html`)
- [ ] **`/lt/`:** NĖRA `#pdf-storefront`, kainų, `buy.stripe.com`
- [ ] **Mirror:** `MIRROR_NOTE=1` build — storefront omitted
- [ ] **`GET /api/fulfillment-health`:** `{ ok: true, missing: [] }`
- [ ] **Live purchase (Starter $3.99):** email ≤5 min, download veikia, webhook 200
- [ ] **Live purchase (Pro / Bundle):** po Starter sėkmės

---

## 3. Testavimo žurnalas

Įrašykite kiekvieno gyvo testavimo rezultatus.

### Šablonas įrašui

```markdown
## YYYY-MM-DD – [v1.x.x] / po deploy

- **Testeris:** vardas arba „QA“
- **URL:** https://...
- **Naršyklė:** Chrome 1xx / Firefox 1xx / …
- **Rezultatas:** ✅ Visi kritiniai praeina | ⚠️ Problema: [aprašymas]
- **Pastabos:** (neprivaloma)
```

### Pavyzdys

```markdown
## 2026-08-11 – DS 1.5 Editorial Operator (docs + code)

- **Testeris:** QA (repo)
- **URL:** local `/en/` after `npm run build`
- **Naršyklė:** `npm test` (structure 176 + design-system smoke + lint)
- **Rezultatas:** ✅ Repo gates green. ⏳ Rankinis visual QA 320/768/1024 (full-bleed hero, Fraunces/Source Sans 3, cycle stepper, surfaces) — checklist §2 UX.
- **Pastabos:** STYLEGUIDE 1.5; LEGACY/TESTAVIMAS/README/BRAND_SYNC aligned. Product SemVer still 1.9.0 until Orchestrator release bump.
```

```markdown
## 2026-05-31 – v1.9.0 Stripe go-live (Phase 1b)

- **Testeris:** QA (repo)
- **URL:** https://promptanatomy.space/en/ (primary)
- **Naršyklė:** CI Playwright + local Chrome
- **Rezultatas:** ✅ Repo: SOT flip, `npm test`, `npm run test:e2e` (3× buy.stripe.com). ⏳ Production: Vercel env + live purchase drill — žr. [MUST_TODO_STRIPE.md](../MUST_TODO_STRIPE.md)
- **Pastabos:** PDF export 14/30 p. OK. Blob upload reikia `BLOB_READ_WRITE_TOKEN` Vercel'e.
```

```markdown
## 2026-02-18 – pirmas deploy

- **Testeris:** QA
- **URL:** https://promptanatomy.space/ (primary), https://ditreneris.github.io/cmo/ (mirror)
- **Naršyklė:** Chrome (desktop)
- **Rezultatas:** ✅ Kopijavimas, CMO kontekstas, progresas, skip link, privatumas – OK. Console be klaidų.
- **Pastabos:** Release QA – `/en/`. CI pa11y – `/en/` + `/lt/` smoke. Mobilus – planuojama kitame cikle.
```

---

## 4. Susiję

- [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md) – promptų kokybės standartas (META/INPUT/OUTPUT, bullet-proof)
- [STYLEGUIDE.md](../STYLEGUIDE.md) – DS **1.6** Product Operator (visual QA)
- [QA_STANDARTAS.md](QA_STANDARTAS.md) – QA kriterijai ir nuoroda į spinoff01  
- [DEPLOYMENT.md](../DEPLOYMENT.md) – kaip deploy ir kad po deploy būtų testuojama gyvai  

**Paskutinis atnaujinimas:** 2026-09-02
