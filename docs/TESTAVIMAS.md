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

- [ ] **Kopijavimas (spine):** Promptai 1, 2, 3, 5 – Copy → DI; kontekstas + taisyklės prepend'inamos. `#pro-contents` 4/6–10 – katalogas be copy, CTA į Complete kit.
- [ ] **EN UX tool-first:** hero primary → `#creative-brief` (open builder); secondary See pricing → `#pdf-storefront`; 2 kortelės (Starter + Complete); Pro = tekstinė nuoroda; library 1/2/3/5 (display 1–4) po kits; `#cb-builder` **open**; progress of 4; 0 meme slotų; Stripe kainos/linkai nepakitę.
- [ ] **CMO kontekstas:** Užpildyti `#cmo-context` laukus → kopijuoti promptą → įklijuotas tekstas turi konteksto bloką ir „TAISYKLĖS (privalomos)" / „RULES (non-negotiable)".
- [ ] **Scenarijai:** `#cmo-scenarios` skirtukai veikia (klaviatūra: rodyklės); kopijavimas iš scenarijaus į clipboard.
- [ ] **Safety blokas:** `#cmo-safety` recenzento promptas kopijuojasi.
- [ ] **Progresas:** „Pažymėjau kaip atlikau" – varnelė įrašoma; perkrovus puslapį – progresas išsaugotas (localStorage).
- [ ] **Skip link:** Tab iki „Praleisti į turinį" – Enter – fokusas pereina į pagrindinį turinį.
- [ ] **Privatumas:** Veikia `lt/privatumas.html` ir public `/en/privacy/`; rodomos teisingos canonical/hreflang žymos (LT `hreflang="en"` = `/en/privacy/`, ne `.html`). Post-deploy: `curl -I https://promptanatomy.space/en/privacy.html` → 308 Location `/en/privacy/`.

### Prieinamumas (a11y)

- [ ] **Klaviatūra:** Navigacija Tab, Enter, Esc – veikia be įstrigimo.
- [ ] **Focus:** Matomas focus (pvz. focus-visible) ant mygtukų ir nuorodų.
- [ ] **Pa11y:** CI bėga į `/en/` (kanonas), `/lt/` (smoke), `/en/privacy/` per `npx serve public` **be** `-s`. Lokaliai release QA: `npx serve public -l 3000` tada `npx pa11y http://127.0.0.1:3000/en/ --standard WCAG2AA --ignore "warning"`. Ne `serve -s .` — `/en/privacy/` tada gali nukristi į root `index.html`.

### UX path cut (EN kanonas, DS 1.8.0 §0.4)

- [ ] **Hero:** full-bleed warm paper; brand mark; page-level sticky `#siteNav` (not hero-clipped) = Workflows / Brief builder / Pricing; primary = Build my prompt (`#heroCtaSpine` → `#creative-brief`); secondary = See pricing (`#heroCtaBrief`); `#heroLead` *Fill the fields. Copy the prompt. Paste it into your image tool.*; `#heroProof` *No account.* under that CTA pair; trust IDs `#heroTrustPill1/2/3` present and hidden; `.hero-diagram` = prompt `<pre>` above the Satori still (image max 58% of the card) + *Example image…* (*From brief → image prompt* — **no** outputs row / tagline / cycle-stepper); nėra usage juostos, mini-prompt demo, hero Telegram nuorodos ar lang switcher.
- [ ] **Type:** Fraunces display (hero H1 only) + Source Sans 3 UI (ne Inter); body ~17px; prose ne full-bleed wall.
- [ ] **Usage:** EN neturi `#executive-summary` ir `#copy-tips`. Kopijavimo sakinys lieka `#prompt1PathHint`.
- [ ] **Instructions:** **no** `#framework-schema` / provider hub.
- [ ] **CMO context:** closed `#cmo-context` **po** `#block1` (library zona po storefront/progress); forma `<details>`; kopijavimas prepend'ina kontekstą.
- [ ] **Prompt 1 path hint:** `#prompt1PathHint` – Copy → paste into ChatGPT/Claude.
- [ ] **Progress jump:** EN `#progressJump` is Plan · Create · Check · Improve. Pricing, Brief, and FAQ are not in that row. `/lt/` keeps Pricing and FAQ and strips Brief.
- [ ] **Sticky bar (≤768px):** Po `#block1` pasirodo juosta; Kopijuoti / Kitas → veikia.
- [ ] **FAQ:** vienas sąrašas iš 4 (kursas, grąžinimas, licencija, privatumas), kiekvienas su „+“, be `<details class="faq-more-details">`; JSON-LD = `frontFaq`.
- [ ] **PDF storefront (EN):** 2 kortelės (Starter + Complete) + Pro text link, **no** comparison table; live `buy.stripe.com`; delivery line and Team license · Privacy; refund and license live in `#faq`.
- [ ] **Free loop after kits:** library 1/2/3/5 → thin `#cmo-safety` → `#cmo-scenarios` → `#pro-contents` → FAQ → `#prompt-basics`.
- [ ] **Meme:** 0 slotų gyvoje UI.

### Responsive / naršyklės

- [ ] **Desktop:** Veikia Chrome / Firefox / Edge (arba Safari).
- [ ] **Mobilus:** Veikia vienoje iš: iOS Safari, Chrome Mobile (layoutas, mygtukai, kopijavimas, sticky bar).

### Turinio / bullet-proof (META, INPUT, OUTPUT)

- [ ] **Struktūra:** Keturi **free** spine promptai turi META, INPUT, OUTPUT (kopijuojamas tekstas). Pilni 10 kūnų – Pro PDF, ne gyvoje UI.
- [ ] **Copyable:** Į darbinių atmintinę kopijuojamas META+INPUT+OUTPUT su CMO v2 prepend (kontekstas + taisyklės, jei aktyvūs); info-box ir „Tikėtinas atsakymas" sekcijos rodomos atskirai ir nekopijuojamos.
- [ ] **Tikėtinas atsakymas:** Po kiekvienu promptu matosi `.prompt-expected` su ≥2 bullet'ais.
- [ ] **Turinio patikra:** Nukopijuoti 1–2 promptus, įklijuoti – įklijuotas tekstas turi tinkamą formatą (žr. [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md)).

### Kiti

- [ ] Nėra console klaidų atidarius puslapį ir atlikus kopijavimą.
- [ ] Nuorodos nepalūžusios (pagrindinis, privatumas).

### Commerce (EN-only, live)

- [ ] **`/en/` storefront:** 2 kortelės + Pro text link; CTAs → live `buy.stripe.com` (ne `/coming-soon.html`)
- [ ] **`/lt/`:** NĖRA `#pdf-storefront`, kainų, `buy.stripe.com`
- [ ] **Mirror:** `MIRROR_NOTE=1` build — storefront omitted
- [x] **`npm run check:prod`:** `{ ok: true, missing: [] }` + IndexNow key file hosted — 2026-10-15, po Production redeploy
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

## 2026-10-18 – EN visual baselines (DS 1.8.0)

- **Testeris:** QA (repo)
- **URL:** local `public/` after `npm run build` — `/en/`, `/en/privacy/`, `/terms/`, `/success.html`
- **Naršyklė:** Playwright Chromium, 320 / 768 / 1024 / 1920, Windows
- **Rezultatas:** ✅ 16 passed. Section PNGs match the DS **1.8.0** composition. Orphan `#executive-summary` shots are gone.
- **Pastabos:** `npm run test:visual` stays outside `npm test`. A green pixel run is not the composition gate ([visual/2026-10-17-en-composition.md](visual/2026-10-17-en-composition.md)). R1 stays open.

## 2026-10-15 – R1 health, dar ne pirkimas

- **Testeris:** QA (repo)
- **URL:** `https://www.promptanatomy.space` ir `https://promptanatomy.space`
- **Naršyklė:** `npm run check:prod`, `npm run check:fulfillment` (ne Checkout)
- **Rezultatas:** ⚠️ Health žalias (`missing: []`, Redis PONG, Blob įjungtas, IndexNow). Trijų Payment Link success URL rodo į `success.html?session_id={CHECKOUT_SESSION_ID}`, metadata `product` yra `starter` / `pro` / `bundle`. Webhook `www` įjungtas tik checkout įvykiams. Gyvo pirkimo nėra.
- **Pastabos:** Refundai lieka rankomis Stripe Dashboard. `CRON_SECRET` neįdėtas — follow-up cron checkoutui nereikalingas. Production redeploy = tas pats `main` commit `e8a5961`, ne šis UI working tree. Starter $3.99, tada Pro ir Complete, dar neatlikti.

## 2026-10-15 – EN visual Chromium pass (local)

- **Testeris:** QA (repo)
- **URL:** local `public/` after `npm run build` — `/en/`, `/en/privacy/`, `/terms/`, `/success.html`
- **Naršyklė:** Playwright Chromium, 320 / 768 / 1024 / 1920
- **Rezultatas:** ✅ Suite green (`npm run test:visual` is local-only; not CI). Three findings were fixed the same day — see the next entry.
- **Pastabos:** Report [visual/2026-10-15-en-visual.md](visual/2026-10-15-en-visual.md). Baselines are Windows (`win32`). The three findings below were fixed the same day (sticky `[hidden]`, success label, 320 nav row).

## 2026-10-15 – visual findings fixed

- **Testeris:** QA (repo)
- **URL:** local `/en/` + `/success.html`
- **Naršyklė:** Playwright Chromium, 320 / 768
- **Rezultatas:** ✅ Sticky bar hidden on the first screen; “Download your PDF” is white on navy; Pricing stays on the nav row at 320.
- **Pastabos:** Snapshots refreshed for home 320, home 768, and success.

### Pavyzdys

Žemiau yra seno žurnalo forma. Gyvas antspaudas yra STYLEGUIDE **1.8.0** ir SemVer **1.11.0**. Tų pastabų nekopijuok į naują įrašą.

```markdown
## 2026-09-03 – DS 1.6 Product Operator (docs + code)

- **Testeris:** QA (repo)
- **URL:** local `/en/` after `npm run build`
- **Naršyklė:** `npm test` (structure + design-system smoke + lint)
- **Rezultatas:** ✅ Repo gates green. ⏳ Rankinis visual QA 320/768/1024 (full-bleed hero, Fraunces H1, Source Sans 3, slim hero diagram, surfaces) — checklist §2 UX.
- **Pastabos:** Istorinis įrašas iš 2026-09-03 (tada gidas buvo 1.6.1, SemVer 1.9.0). Gyvas antspaudas yra STYLEGUIDE 1.8.0 ir SemVer 1.11.0.
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
- [STYLEGUIDE.md](../STYLEGUIDE.md) – DS **1.8.0** §0.4 Product Operator (visual QA)
- [QA_STANDARTAS.md](QA_STANDARTAS.md) – QA kriterijai ir nuoroda į spinoff01  
- [DEPLOYMENT.md](../DEPLOYMENT.md) – kaip deploy ir kad po deploy būtų testuojama gyvai  

**Paskutinis atnaujinimas:** 2026-10-15
