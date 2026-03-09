# Changelog

Visi reikšmingi projekto pakeitimai dokumentuojami šiame faile.

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Nereleisuota]

### Pakeista

- **LT→EN UI/UX – statinis tekstas ir promptai (2026-03-09):** Build skripte (EN_REPLACEMENTS): instrukcijų 2 eilutė – sutapdintos kabutės („ “ U+201E/U+201C), kad „Click Copy prompt“ atsirastų EN; laiko etiketė „~3–5 min per žingsnį“ → „~3–5 min per step“; CSS .code-block::before `content` „Spausk čia ir nukopijuok“ → „Click here and copy“. Visi 10 promptų `<pre>` turinių (META, INPUT, OUTPUT) lokalizuoti į EN per build. docs/LEGACY_GOLDEN_STANDARD.md ir LT_EN_UI_UX_REPORT.md atnaujinti.
- **EN hero – CMO mikro-kopija (2026-03-09):** EN title ir h1 „for Marketing Leads“ → „for Marketing Leaders“ (atitikmuo LT „rinkodaros vadovams“, aiškesnė CMO/vadovų auditorija). Pakeitimas: scripts/build-locale-pages.js (title, h1), index.html (applyStaticLocaleText h1). Kitos „Leads“ vietos (Lead generator, „Leads and metrics“) nekeistos.

### Prideta

- **Dokumentacija (2026-03-09):** docs/LEGACY_GOLDEN_STANDARD.md atnaujintas į v1.6 – build/deploy (BASE_PATH, scripts/build-locale-pages.js), footer (.footer-email, .footer-product-link), privatumas.html (back-link ID, referrer logika), checklist ir skyrius „privatumas.html (fiksuota)“. CHANGELOG – šis įrašas.

---

## [1.1.0] - 2026-03-09

### Prideta

- **Privatumas.html „atgal“ nuorodos (2026-03-09):** Jei vartotojas atėjo iš `/lt/` ar `/en/`, mygtukai „Grįžti“ nukreipia atgal į atitinkamą locale (pagal `document.referrer`), kad neprarastų kalbos.
- **Footer el. paštas (2026-03-09):** Pridėtas el. paštas footer'yje – info@promptanatomy.app (mailto nuoroda); LT etiketė „El. paštas:“, EN „Email:“; CSS .footer-email; build skripte ir applyStaticLocaleText() EN lokalizacija.
- **LT/EN lokalizacija (2026-03):** Path-based puslapiai `/lt/` ir `/en/` – build skriptas `scripts/build-locale-pages.js` generuoja `lt/index.html` ir `en/index.html` iš root `index.html`; canonical ir hreflang SEO; runtime locale sprendimas (path → query → localStorage → navigator), `uiText(lt, en)`, `applyStaticLocaleText()`; kalbos perjungiklis (LT/EN mygtukai header'yje) su navigacija ir hash išsaugojimu; dinaminiai stringai (toast, progress, klaidos) per `uiText`. Žr. [LT_EN_UI_UX_REPORT.md](LT_EN_UI_UX_REPORT.md). Testai: structure.test.js tikrina lt/en failus ir lang; deploy workflow paleidžia `npm run build` prieš upload.
- **Pedagoginė specifikacija (2026-02-19):** docs/PEDAGOGINES_SPECIFIKACIJA.md – pedagoginiai tikslai, auditorija, terminologija ir paaiškinimai, „paprasta kalba“ kriterijai, vartotojo kelionė. docs/DOCUMENTATION.md – į inventorių įtraukti PEDAGOGINES_SPECIFIKACIJA.md ir TURINIO_AUDITAS_DETALUS.md.
- **Spin-off Nr. 2:** Rinkodaros vadovo AI operacinė sistema – 10 promptų (30 dienų turinys, Repurpose, LinkedIn, 30s video, Performance→Sprendimas, Objection Handling, Lead Magnet+DM, Case Study, Topical Cluster, MASTER PROMPT).
- **Oranžinė CTA paletė:** Pagrindinė spalvų paletė pakeista į oranžinę (`--accent-primary`, `--cta-bg`, hero gradientas) dėl aukštesnio CTA; STYLEGUIDE.md atnaujintas.
- QA ir dokumentų valdymo procesas: CHANGELOG.md, docs/DOCUMENTATION.md, integracija su AGENTS.md ir .cursorrules.
- Deploy: GitHub Pages workflow (.github/workflows/deploy.yml), DEPLOYMENT.md.
- QA standartas: docs/QA_STANDARTAS.md su nuoroda į [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01).
- Gyvo testavimo dokumentacija: docs/TESTAVIMAS.md (scenarijai ir žurnalas).
- Ryšys su pagrindiniu produktu: badge „Promptų anatomija“, community CTA ir footer nuorodos → https://www.promptanatomy.app/ (anksčiau ditreneris.github.io/anatomija).
- Favicon: favicon.svg (SVG, „P“ ant teal fono), nuorodos index.html ir privatumas.html.

### Pakeista

- **Promptų anatomija nuoroda ir terminologija (2026-03-09):** Pagrindinė nuoroda „Promptų anatomija“ (hero badge, community antrinis CTA, footer) pakeista į https://www.promptanatomy.app/. Terminologija: LT – DI (dirbtinis intelektas), EN – AI; pataisyta badge aria-label LT „AI“→„DI“, EN title/h1 „Content DI System“→„Content AI System“; rašyba „Linkedin“→„LinkedIn“ LT. Build skripte footer-product-link pakeitimas perkeltas prieš bendrą „Promptų anatomija“→„Prompt Anatomy“, kad EN footer būtų pilnai anglų kalba. README nuorodos atnaujintos į promptanatomy.app. Žr. docs/GILI_ANALIZE_LT_EN_TERMINOLOGIJA.md.
- **Poliravimas – UI/UX ir a11y (2026-02-19):** Spacing: suvienodinta sekcijų margin-bottom (prompt 32px), prompt-header/footer padding 32px. Focus: paliktas tik `:focus-visible` form-input, .btn, .code-block; outline-offset hero CTA ir outline mygtukų 2px. Transitions: .next-steps-links a, .cta-secondary – pridėtas transition hover būsenoms. ARIA: progreso juosta – aria-label „Progresas: X iš 10 promptų“ (atnaujinama JS), info-box – „Informacija: promptas N“ (N 1–10). Mažų ekranų (375px) .footer padding 24px 16px. STYLEGUIDE.md sinchronizuotas su implementacija: hero vertikalus gradientas, spalvos #c75515/#b54f14, hover translateY(-1px), numerio badge color var(--white), community CTA hover; pridėta border-radius skalė (4.8).
- **Lead generator (2026-02-19):** „Nemokamo vediklio“ / „vediklis“ pakeista į „Lead generator“ – vediklis šioje aplikacijoje netinka. index.html (antraštė, aprašymas, prompt7, next-steps, footer, aria-label), README, docs/PEDAGOGINES_SPECIFIKACIJA.md.
- **Promptų ir turinio draugiškumas (2026-02-19):** TURINIO_AUDITAS ir pedagoginė spec. įgyvendinti: objectives (lead'us→potencialius klientus), žodynėlis (hook, CTR, reach, B2B), promptų antraštės/aprašymai (30s Short-Form→30 sek. video, MASTER PROMPT→Pagrindinis promptas), promptų tekste (Carousel/Landing hero→lietuviškai, lead generation/CMO/spamo→lietuviški atitikmenys, B2B paaiškintas), CTA tekstai varijuoti, next-steps ir footer (MASTER PROMPT, Lead magnet→Nemokamo vediklio, CTA fokusas→Veiksmų fokusas). Aria-label: „lead magnet versija“→„nemokamo vediklio versija“. README ir privatumas.html – žargonas pakeistas į lietuviškus atitikmenis, DI paaiškintas, localStorage (naršyklės vietinė atmintinė), „panašiai“→„panašią formą“.

- **Turinio ir kalbos auditas (2026-02-18):** Žargono mažinimas – DI paaiškintas, glosarė (USP, CTA, KPI), „fluff“→„tuščios frazės“, „proof“→„įrodymai“, „objection“→„prieštaravimai“, „repurpose“→„vienos idėjos daug formatų“, „lead magnet“→„nemokamas vediklis“, „insight“→„idėja“, „case study“→„kliento istorija“, „pillar/supporting“→„pagrindinė tema ir subtemos“. Kategorijos MUST/SHOULD/WANT/MASTER pakeistos į Pradžia/Įgūdžiai/Plėtra/Viskas kartu.
- **Turinio pataisymai (2026-02-18):** Short-form→Trumpas formatas, scroll'inimą→slinkimą, repurpose (prompt10)→vienos idėjos daug formatų, case'ai→klientų istorijos; encoding ir gramatikos pataisymai; žargonas: objection'ų→prieštaravimų, Lead'ai→Potencialūs klientai, follower'io→sekėjo, lead'ą→potencialų klientą.
- **Privatumas:** privatumas.html pavadinimas suderintas su index.html (DI Promptų biblioteka).
- **Spalvų paletė:** pridėti kintamieji --tertiary-dark, --tertiary-hover, --green-dark, --error, --bg-subtle; hardcoded spalvos pakeistos į kintamuosius; numerio badge – baltas tekstas (WCAG AA); STYLEGUIDE.md atnaujintas.
- **Dokumentacija:** docs/DOCUMENTATION.md papildytas „Greita schema – kas kur ir kam“.
- **Struktūra 8 → 10 promptų:** index.html – pridėti block9/prompt9 (Topical Cluster), block10/prompt10 (MASTER PROMPT); progress bar ir JS ciklas atnaujinti į 10; next-steps ir footer. tests/structure.test.js ir docs/LEGACY_GOLDEN_STANDARD.md atnaujinti į 10 promptų.
- **Turinys:** Hero, objectives, instructions ir visi 10 promptų pakeisti į Spin-off Nr. 2 turinį (rinkodaros sistema); placeholder'iai [auditorija], [skausmas], [USP], [kanalas] ir kt.
- Community sekcija: hierarchija ir UX – vienas pagrindinis CTA (brand green #0E7A33, be glow, subtilus shadow), antrinis outline („Promptų anatomija“). Trumpesnė antraštė dviem eilutėm, vertikalūs tarpai (16px / 24px / 16px), kortelė 1px border ir 16px radius. Emoji pašalintas iš CTA. STYLEGUIDE 4.7 atnaujintas.

### Taisyta

- **Deploy ir SEO (2026-03-09):** GitHub Pages deploy workflow – build žingsnyje nustatytas `BASE_PATH=/marketingas`, kad sugeneruoti `lt/` ir `en/` puslapiai turėtų teisingus canonical ir hreflang URL (`/marketingas/lt/`, `/marketingas/en/`).
- **CI ir pa11y (2026-02-19):** GitHub Actions – Chromium „No usable sandbox“: į CI workflow įdėtas `continue-on-error: true` pa11y žingsniui (workflow lieka žalias); .pa11yrc.json ir package.json „pa11y“ – Chrome paleidimo argumentai (`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`). DEPLOYMENT.md – troubleshooting atnaujintas: a11y pilnai tikrinamas lokaliai.
- Badge „Promptų anatomija“: paspaudimo zona (min-height/min-width 44px), z-index ir cursor, kad nuoroda būtų aiškiai paspaudžiama.
- A11y WCAG2AA: community skyriaus nuorodos „Promptų anatomija“ kontrastas (teksto spalva #040404).

### Pašalinta

- (tuščia)

### Deprecated

- (tuščia)

### Saugumas

- (tuščia)

---

## [1.0.0] - 2026-02-18

### Prideta

- Pradinė DI Promptų Biblioteka: 8 promptai, interaktyvus dizainas, kopijavimo funkcija.
- Dokumentacija: README.md, INTEGRACIJA.md, AGENTS.md, .cursorrules, feedback-schema.md.
- CI: lint, testai, a11y (pa11y) per .github/workflows/ci.yml.
- PR šablonas ir agentų commit prefiksai.

### Pakeista

- (pirmas release – nėra ankstesnių pakeitimų)

### Taisyta

- (nėra)
