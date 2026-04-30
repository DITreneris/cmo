# Changelog

Visi reikšmingi projekto pakeitimai dokumentuojami šiame faile.

Formatas pagal [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), versijavimas – [Semantic Versioning](https://semver.org/).

## [Nereleisuota]

### Pašalinta

- Pasenusios ar dubliuojančios dokumentų bylos: root `KODO_BAZES_ANALIZE.md`, `LT_EN_UI_UX_REPORT.md`, `VARIANTU_PALYGINIMAS.md`; `docs/GILI_ANALIZE_LT_EN_TERMINOLOGIJA.md`, `docs/MICROCOPY_AUDIT_EN.md`, `docs/TURINIO_AUDITAS_DETALUS.md`, `docs/DESIGN_SYSTEM_BASELINE.md`; dublikatai `docs/archive/MUST_TODO.md`, `docs/archive/MVP_ROADMAP.md` (kanonas – root `MUST_TODO.md` / `MVP_ROADMAP.md` su historical žyma). Nuorodos sutvarkytos į `docs/MULTILINGUAL_STRUCTURE.md`, `docs/LEGACY_GOLDEN_STANDARD.md`, `npm test`.

### Pakeista

- **Frontpage „premium SaaS“ productizacija (2026-04-30):** LT/EN frontpage perstruktūruotas iš „dokumento su dėžėmis“ į „įrankio / sistemos“ patirtį: hero iš karto seka naujas **Setup** modulis (kontekstas + progresas + DI įrankių nuorodos), pridėta **How it works** sekcija su vizualiu ciklu ir prieinamais tab’ais (`.system-map`, `.how-tab`), „Executive summary“ ir „Ką gausi / What you get“ pakeisti į kompaktiškas **value grid** korteles (`.value-grid`), pridėtas **Proof / Įrodymas** blokas (`.output-proof`) su before/after + kokybės kriterijais. Preflight perrašytas į skim-first sąrašą su unikaliomis nuorodomis (`.preflight-list`). Meme #1 demotuotas: perkeltas po Prompt 1 ir apribotas aukštis (nebėra „antras hero“). Pagrindinis vizualinis sluoksnis suvienodintas į 1px border + subtilus elevation per `styles/components.css` (užgožia senus 3px inline rėmelius). Pakeitimai: `lt/index.html`, `en/index.html`, `styles/components.css`. `npm test` praeina.

- **SEO + GEO micro-optimizacijos (AI discoverability, 2026-04-30):** `scripts/build-locale-pages.js` `insertSeo()` atnaujintas su aukštesnio ketinimo LT/EN `<title>` ir suvienodintais aprašymais (`meta description`, `og:*`, `twitter:*`). `index.html` pridėta trumpa `#executive-summary` santrauka (kas tai yra / use-cases / compared-to + vidinės nuorodos į `#block1`, `#block5`, `#block9`, `#cmo-safety`, `#ecosystem-strip`) ir kompaktiškas sąvokų blokas `#definitions` (3 aiškios definicijos LLM citavimui). Išplėstas FAQ (+4 klausimai) ir `FAQPage` JSON‑LD atnaujintas, kad tiksliai sutaptų su matomu turiniu tiek LT, tiek EN locale.
- **OG preview paveikslas FB/LinkedIn (2026-04-30):** `og:image` ir `twitter:image` suvienodinti į self-hosted `og.png` (1200×630) per `scripts/build-locale-pages.js` `insertSeo()` ir root `index.html`. Pridėti stabilumą gerinantys tag’ai: `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:image:alt`. `tests/structure.test.js` papildytas kontraktu, kad OG URL būtų `https://ditreneris.github.io/cmo/og.png`.
- **EN stop-ship lokalizacijos pataisymai + microcopy polish (2026-04-30):** Pašalinti LT nutekėjimai EN puslapyje: hero demo mini-prompt (`#promptDemo`) ir meme `figcaption` tekstai dabar statiniai EN (ne vien runtime). `scripts/build-locale-pages.js` papildytas tiksliomis LT→EN poromis, taip pat pašalintos likusios LT eilutės EN generuojamame JS (pvz. „Kopijuoti…“ komentarai/aria-label dalys), kad `en/index.html` neturėtų LT tokenų. Papildomai sutvarkytos kelios aukšto poveikio EN frazės promptų kortelėse (gramatika + US-native formuluotės) ir suvienodinta CTA instrukcija be „templated“ tono; `index.html` EN `promptData` atnaujintas, kad runtime EN režimas atitiktų build output.
- **CMO CRO uplift – „system, not prompts“ + paid-first CTA (2026-04-30):** `en/index.html` hero perrašytas į „operacinę sistemą“ (prognozuojamas rezultatas), primary CTA nukreiptas į `promptanatomy.app`, demo CTA paliktas kaip antrinis („Try prompt 1“). Virš pirmo scroll pridėtos dvi autoriteto sekcijos: `#system-map` (Inputs/Controls/Outputs + vykdymo ciklas) ir `#output-proof` (Before/After + rezultatų kriterijų checklist) su nuosekliais paid→demo CTA. Instrukcijos perrašytos į „skim-first“ (3 bullet) + pilnas checklist po `<details>`, sumažinant kognityvinį krūvį. `styles/components.css` pridėti `system-map`, `output-proof`, `section-cta`, `instructions-details` komponentai. `lt/index.html` sutapatintas su EN struktūra ir CTA logika; bendruomenės blokas pakeistas į paid-first (Telegram – optional).
- **IA: hierarchinė nuorodų tvarka ir vienas „hub“ (2026-04-30):** Sumažintas pakartojančių išorinių nuorodų triukšmas: hero – vienas PA ženkliukas (`promptanatomy.app`), pašalinta antra hero nuoroda į metodiką; `quoteable-block` be dubliuojančių `<a>`; `.objectives-eco-hint` ir FAQ `.faq-eco-hint` veda į `#ecosystem-strip`; nauja sekcija `#ecosystem-strip` (metodika, Telegram, el. paštas, Leader); bendruomenės blokas – tik Telegram CTA; footer – viena `.footer-product-link` eilutė. Viena DI tiekėjų juosta `.cmo-provider-hub` po `progressIndicator`; `injectProviderRows` build’e no-op (nebe 10×). „Kas toliau?“ – nuorodos po `<details>` su `summary#next-steps-jump`. `applyStaticLocaleText` ir `EN_REPLACEMENTS` sinchronizuoti; spaudai `styles/components.css` print taisyklėse paslėpta `.ecosystem-strip` ir `.cmo-provider-hub`; struktūros testas: Gemini nuoroda ≥1. Atnaujinta `docs/LEGACY_GOLDEN_STANDARD.md`. Versija **1.3.4**.
- **Dokumentacija ir agentų modelis (2026-04-30):** Pridėtas [docs/INDEX.md](docs/INDEX.md) (navigacija pagal rolę, užduotį ir kodą). Atnaujinti [AGENTS.md](AGENTS.md) (Curriculum/QA įvestys, release scope, nuorodos į Legacy ir `npm test`), [.cursorrules](.cursorrules) (projekto apžvalga, testai, docs sąrašas, Skills pastaba), [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md), [README.md](README.md) (medis), PR šablonas – nuorodos į indeksą ir golden standard.
- **LT/EN kalbos kokybė, EN statinis paritetas, SEO x-default (2026-04-30):** LT šaltinyje pataisyta hero gramatika („susiformuos planas…“), `aria-label` kopijavimui (**darbinių atmintinė** vietoje klaidingo „mainų“), saugumo įžanga (DI sugeneruotas turinys), FAQ `JSON-LD` sutapdintas su matomu FAQ (en dash, ciklas). `scripts/build-locale-pages.js`: EN keitinių papildymas (hero trust pills, oficiali metodika, „Start here“, meme `alt` ir `figcaption` šablonai sutapdinti su `index.html`, FAQ `FAQPage` anglų JSON), `hreflang x-default` → `/en/`; LT saugumo bloko intro taisymas. `applyStaticLocaleText` suvienodintas su build (objectives, instrukcijos, bendruomenė, footer h3, meme `img alt`, „Official methodology“). Atnaujinti `docs/LEGACY_GOLDEN_STANDARD.md`, `docs/TESTAVIMAS.md`, `docs/BULLET_PROOF_PROMPTS.md`, `tests/structure.test.js` (x-default kontraktas). Versija **1.3.3**.
- **CRO fazė 3.2 – edukacinių blokų eiliškumas (2026-04-30):** `index.html` sekcijos `#what-is-prompt` ir `#prompt-anatomy` perkeltos **po** visų 10 promptų (prieš „Kas toliau?“), kad kelias iki `#block1` būtų trumpesnis; `#framework-schema` palikta po instrukcijų ir prieš progresą. Atnaujinta `docs/LEGACY_GOLDEN_STANDARD.md` schema ir checklist. Versija **1.3.2**.
- **Hero CRO / clarity (2026-04-30):** Primary CTA pervadintas į veiksmą („Pradėti nuo 1-o prompto“), hero antrinis CTA pakeistas į tekstinę nuorodą „Bendruomenė: Telegram“; žyma „Spin-off Nr. 2“ → „Nemokama biblioteka“; poantraukė, demo antraštė ir mini kopijavimo mygtukas aiškiau komunikuoja formatą ir registracijos nereikalavimą; `insertSeo` aprašymai LT/EN; EN `applyStaticLocaleText` sinchronizuotas su build (nebe „Get free“ / „Get started free“ skirtumas). CMO konteksto įžanga LT/EN: pažymima, kad forma neprivaloma. `docs/LEGACY_GOLDEN_STANDARD.md` hero eilutė atnaujinta. Versija **1.3.1**.
- **Premium dizaino sistema (Prompt Anatomy DNR, 2026-04-30):** `styles/tokens.css` ir `styles/design-tokens.json` suvienodinti su motininės svetainės palete (auksinis akcentas `#CFA73A`, ink `#0B1320`, ekosistemos teal `#2E9E7E`, šviesūs paviršiai `#F8FAFC` / `#F1F5F9`, rėmeliai `#E2E8F0`), pridėti šešėlių lygiai (`elevation1` / `elevation2`, CTA, modal), tipografijos ir hero kintamieji (`--hero-bg`, `--hero-ink`), legacy alias (`--accent-*`, `--bg`, …) perkelti į vieną `:root` šaltinį – dubliuojantis inline `:root` pašalintas iš `index.html`. Hero pertvarkytas į šviesų kortelės stilių su tamsiu tekstu; h1 skalė 40px (48px nuo 768px); CTA gradientas ir tamsus tekstas dėl kontrasto; `body` 16px. `styles/components.css`: `.prompt` ir CMO blokai naudoja `--shadow-elevation-*`, CMO rėmeliai 1px + kairinis 4px brand akcentas, progreso juosta suderinta. Versija **1.3.0**.

### Prideta

- **CMO sister adoption v2 – trust + LT parity + scale (2026-04-30):** Po v1 papildyta pagal planą `cmo_sister_adoption_v2_phased`. **v2.0 (EN):** `data/en-scenarios.json` – 3 scenarijai (savaitės apžvalga, kampanijos startas, stakeholderių atnaujinimas); build įterpia **Clarity practice** juostą su skirtukais (`role="tab"`, rodyklės), kopijuojama santrauka per `window.__CMO_COMPILE`; **Pre-publish safety** blokas su kopijuojamu rizikų recenzento promptu ir 4 greitos kontrolės punktais. **v2.1 (LT):** `data/lt-prompt-expected.json` ir `data/lt-scenarios.json`; LT puslapyje tas pats konteksto blokas, „Tikėtinas atsakymas“, saugumo ir scenarijų sekcijos lietuviškai, compile naudoja `KONTEKSTAS` / `TAISYKLĖS (privalomos)`. **v2.2 (abu locale):** `@media print` „one-page kit“ `styles/components.css`; footer versijos žyma iš `package.json` (`Prompt Anatomy CMO Kit v…` / `… CMO rinkinys v…`); kryžminė nuoroda į [Prompt Anatomy Leader](https://ditreneris.github.io/leader/en/); po kiekviena „Kopijuoti promptą“ eilutė nuorodų į ChatGPT / Claude / Gemini (naujas skirtukas, be duomenų perdavimo). Versija SemVer pakelta į **1.2.0**. Struktūros testai atnaujinti (EN+LT teigiami parity teiginiai).
- **EN sister-site adoption v1 (2026-04-30):** EN puslapis (`en/index.html`) papildytas Prompt Anatomy operacinio modelio pagrindais pagal sesterinį `https://ditreneris.github.io/leader/en/`: (1) Marketing Context blokas su 5 laukais (Audience, Offer/USP, Channels, Goal, Main constraint) ir session-only persistencija per `sessionStorage`, (2) ne-derybinės taisyklės (no generic advice, no invented numbers, decision-grade output), kurios kartu su konteksto reikšmėmis automatiškai prepend'inamos kiekvieną kartą paspaudus „Copy prompt“ per `window.__CMO_COMPILE` hook'ą, (3) matomas „Expected output“ sąrašas po kiekviena prompt kortele iš `data/en-prompt-expected.json`. Įgyvendinta tik EN locale per `scripts/build-locale-pages.js` (LT byte-identical, hero demo nepakeistas). CSS `.cmo-context` ir `.prompt-expected` pridėti į `styles/components.css` su esamais design tokenais. Struktūros testai išplėsti (77 assertions praeina).
- **P0–P3 stabilizacijos testų aprėptis (2026-04-29):** Išplėsti testai `tests/structure.test.js`, `tests/design-system-smoke.test.js`, `tests/a11y-smoke.test.js` su locale/privacy parity, canonical/hreflang SEO kontraktais ir `robots.txt` + `sitemap.xml` nuoseklumo patikra pagal production host/path.
- **Build apsaugos EN ir privacy SEO (2026-04-29):** `scripts/build-locale-pages.js` pridėta EN replacement safety patikra (kritinių šablonų aptikimas) ir privacy puslapių SEO validacija (`lt/privatumas.html`, `en/privacy.html`) build metu.
- **SEO/GEO bazė CMO srauto nukreipimui (2026-04-29):** Pridėti `robots.txt` ir `sitemap.xml` su pagrindiniais URL (`/`, `/lt/`, `/en/`, privatumo puslapiai), kad crawler'iai aiškiai rastų indeksuojamus kelius.
- **Struktūriniai AI signalai (2026-04-29):** `index.html` pridėtas JSON-LD rinkinys `WebSite`, `Organization` ir `FAQPage` bei FAQ pertvarka į `details/summary` Q/A formatą lengvesniam LLM extract'inimui ir citavimui.
- **Quoteable blokai + source signalas (2026-04-29):** Pagrindiniame turinyje pridėti cituojami „definition / when-to-use“ blokai su aiškiu nukreipimu į oficialų šaltinį `promptanatomy.app`.

- **Vizualinės sistemos sluoksniai (2026-04-29):** Įdiegti `styles/design-tokens.json` (vienas tokenų šaltinis) ir CSS sluoksniai `styles/tokens.css`, `styles/components.css`, `styles/utilities.css`. Root `index.html` importuoja šiuos failus; locale build automatiškai perrašo į `../styles/...`.
- **Design system kokybės vartai (2026-04-29):** Pridėti smoke testai `tests/design-system-smoke.test.js` ir `tests/a11y-smoke.test.js`; `npm test` papildytas naujais testų etapais.
- **Baseline auditas (2026-04-29):** Pridėtas `docs/DESIGN_SYSTEM_BASELINE.md` su pradinės būsenos išvadomis, priimtais architektūriniais sprendimais ir priėmimo checkpointais.
- **EN promptų tekstas – vienas šaltinis (2026-03-30):** `data/en-prompt-bodies.json` (10 anglų META eilučių). `npm run build` generuoja `js/en-prompt-bodies-inline.js` (`window.__EN_PROMPT_PRE`) ir iš root `index.html` `<pre id="prompt1">`…`prompt10` ištraukia LT tekstą META pakeitimams – nebereikia dubliuoti LT+EN porų `scripts/build-locale-pages.js`. `index.html` įtraukia `js/en-prompt-bodies-inline.js`; lt/en puslapiuose kelias `../js/…`. Struktūros testai: JSON, inline JS, script src. ESLint ignoruoja generuojamą inline failą.
- **Dokumentacija (2026-03-09):** docs/LEGACY_GOLDEN_STANDARD.md atnaujintas į v1.6 – build/deploy (BASE_PATH, scripts/build-locale-pages.js), footer (.footer-email, .footer-product-link), privatumas.html (back-link ID, referrer logika), checklist ir skyrius „privatumas.html (fiksuota)“.

### Pakeista

- **Kalbos perjungiklis GitHub Pages subkelyje (2026-04-29):** `index.html` – `getBasePathPrefix()` ir EN/LT navigacija naudoja repo prefiksą (pvz. `/cmo/en/`), ne absoliutų `/en/`, kuris rodė 404 ant `*.github.io/<repo>/`.
- **GitHub Pages repo ir kelias – `cmo` (2026-04-29):** Production target: [DITreneris/cmo](https://github.com/DITreneris/cmo), `SITE_ORIGIN`/`BASE_PATH` = `https://ditreneris.github.io` + `/cmo`; deploy workflow (`.github/workflows/deploy.yml`), canonical/hreflang visuose puslapiuose, `robots.txt`, `sitemap.xml`, `DEPLOYMENT.md` (įskaitant šalto deploy į tuščią repo žingsnius).
- **Dokumentacijos konsolidacija pagal realų pipeline (2026-04-29):** Atnaujinti `AGENTS.md`, `README.md`, `docs/QA_STANDARTAS.md`, `docs/MULTILINGUAL_STRUCTURE.md`, `docs/TESTAVIMAS.md`, `DEPLOYMENT.md` pagal faktinį `npm test` ir locale architektūrą; `MUST_TODO.md`, `MVP_ROADMAP.md`, `docs/MICROCOPY_AUDIT_EN.md` pažymėti kaip historical/deprecated.
- **Privacy LT/EN UX parity (2026-04-29):** LT privatumo puslapiuose (`lt/privatumas.html`, root `privatumas.html`) pridėtas kalbos perjungiklis į EN, kad navigacija tarp locale būtų nuosekli.
- **Puslapių SEO antraštės ir locale build (2026-04-29):** `index.html` ir `scripts/build-locale-pages.js` atnaujinti su canonical/hreflang/robots/meta description/OG/Twitter signalais; locale generatorius dabar automatiškai įterpia absoliučius URL (`https://promptanatomy.cloud/...`) ir pašalina dubliuojamus SEO tag'us prieš perrašymą.
- **CMO intent routing į oficialų brand hub (2026-04-29):** Sustiprintas vidinių nuorodų kontraktas į `https://promptanatomy.app/` per turinio, FAQ ir footer zonas, kad šis repo liktų „implementation/use-case“ sluoksniu, o metodikos autoritetas būtų koncentruotas `.app`.
- **Kalbos perjungimo URL modelis (2026-04-29):** Root kalbos perjungimas suvienodintas į path-based nukreipimą (`/lt/`, `/en/`) vietoje query fallback (`?lang=`), mažinant URL dubliavimo riziką indeksacijai.
- **Privatumo puslapių SEO nuoseklumas (2026-04-29):** `en/privacy.html`, `lt/privatumas.html` ir root `privatumas.html` papildyti canonical/hreflang/robots/description; pašalintas runtime hreflang `#` pildymas, palikti statiniai URL.

- **UI micro polish (2026-04-29):** Įgyvendinti greiti vizualinio nuoseklumo pataisymai be struktūros keitimo: pagerintas hero antrinio CTA kontrastas (`opacity 0.85`), suvienodintos pagrindinių CTA transition taisyklės (atsisakyta `transition: all`), sumažintas hero noise intensyvumas (`0.04`), suvienodinti smulkūs spacing/typography taškai (`badge` padding ir letter-spacing), pašalintas perteklinis `margin-top` iš `.community-cta-secondary`, ir `meme-slot` hardcoded spalvos pakeistos į design token kintamuosius.
- **Design token nuoseklumas (2026-04-29):** `styles/components.css` papildytas `.prompt` radius su `var(--radius-xl)`, kad komponentų sluoksnyje būtų aiškus 20px kampų šaltinis.
- **Pilno plano įgyvendinimas (2026-04-29):** Užbaigti visi vizualinės sistemos refaktoriaus plano etapai (tokenai, komponentų sluoksnis, interakcijų centralizacija, locale build validacija, smoke testai, dokumentacijos perdavimas) viename cikle su pilnu `npm test` praeinamu rezultatu.
- **Interakcijų architektūra (2026-04-29):** Pašalinti inline `onclick`/`onkeydown` handleriai promptų kortelėse; kopijavimo ir teksto pažymėjimo logika sujungta į centralizuotą `addEventListener` bindinimą `DOMContentLoaded` inicializacijoje.
- **Locale build validacija (2026-04-29):** `scripts/build-locale-pages.js` papildytas dizaino sistemos struktūrine validacija (`assertLocaleStructure`) ir `styles/` kelių adaptacija generuojamiems `lt/en` puslapiams.
- **Dokumentacija (2026-04-29):** Atnaujinti `STYLEGUIDE.md` (v2 architektūra, state matrica, kokybės vartai) ir `docs/DOCUMENTATION.md` (nauji dizaino sistemos failai bei testų atsakomybės).
- **US lokalizacija EN turiniui (content-only, 2026-04-29):** Sustiprintas EN (`en-US`) tonas ir terminija pagal US rinkos praktiką, su ryškesniu local flavor conversion vietose ir neutraliu tonu trust zonose. Atnaujinta hero/CTA/instrukcijų/community/error copy bei nuoseklumas (`Get started free`, `What you get`, aiškūs copy fallback veiksmai). Pakeitimai suderinti per generatorių: `scripts/build-locale-pages.js` EN replacement map, po build atnaujinti `en/index.html` ir `js/en-prompt-bodies-inline.js`.
- **EN promptų šaltinis – US rinkos framing (2026-04-29):** `data/en-prompt-bodies.json` perrašytas į natūralesnį US B2B kalbėjimą (KPI/CTA/pipeline žodynas), pridėti kontekstiniai miestų pavyzdžiai (Austin, Miami, Chicago) ir `$` biudžeto/impact signalai ten, kur tinka.
- **EN microcopy dokumentacija (2026-04-29):** `docs/MICROCOPY_AUDIT_EN.md` papildytas US lokalizacijos playbook: zone model (conversion/trust/utility), 10 taisyklių mini-guide, before/after pavyzdžiai ir šio etapo failų suvestinė.

- **Bendruomenė: WhatsApp → Telegram (2026-03-30):** Pagrindinis CTA vietoj `chat.whatsapp.com` nukreipia į [Telegram @prompt_anatomy](https://t.me/prompt_anatomy). Pakeista `index.html` (bendruomenės sekcija, hero antrinis CTA `aria-label`, `applyStaticLocaleText()` EN eilutės), `scripts/build-locale-pages.js` (EN statinės poros), sugeneruoti `lt/index.html` ir `en/index.html` per `npm run build`. `tests/structure.test.js` – EN `aria-label` regresijos teiginys. Dokumentacija: STYLEGUIDE.md, docs/TURINIO_AUDITAS_DETALUS.md.
- **EN UI – likę lietuviški promptai ir a11y (2026-03-30):** Root arba `?lang=en` / `localStorage` EN režime `applyStaticLocaleText()` dabar perrašo ir kopijuojamą `<pre>` turinį (anksčiau likdavo LT, kai `/en/` build’e jau buvo EN). Build: prieš globalų `Promptų anatomija` → `Prompt Anatomy` perkeltas bendruomenės CTA `aria-label`, kad EN nebeliktų hibridinės etiketės; pridėta trūkstama prompto 9 info pastraipa LT→EN.
- **LT→EN UI/UX – statinis tekstas ir promptai (2026-03-09):** Build skripte (EN_REPLACEMENTS): instrukcijų 2 eilutė – sutapdintos kabutės („ “ U+201E/U+201C), kad „Click Copy prompt“ atsirastų EN; laiko etiketė „~3–5 min per žingsnį“ → „~3–5 min per step“; CSS .code-block::before `content` „Spausk čia ir nukopijuok“ → „Click here and copy“. Visi 10 promptų `<pre>` turinių (META, INPUT, OUTPUT) lokalizuoti į EN per build. docs/LEGACY_GOLDEN_STANDARD.md ir LT_EN_UI_UX_REPORT.md atnaujinti.
- **EN hero – CMO mikro-kopija (2026-03-09):** EN title ir h1 „for Marketing Leads“ → „for Marketing Leaders“ (atitikmuo LT „rinkodaros vadovams“, aiškesnė CMO/vadovų auditorija). Pakeitimas: scripts/build-locale-pages.js (title, h1), index.html (applyStaticLocaleText h1). Kitos „Leads“ vietos (Lead generator, „Leads and metrics“) nekeistos.

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
- `.nojekyll` root’e – GitHub Pages naudoja statinius failus be Jekyll.

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

- **CI a11y vartai (2026-04-29):** `.github/workflows/ci.yml` `pa11y` žingsnis nebe `continue-on-error`; WCAG regresijos dabar stabdo CI.
- **Deploy ir SEO (2026-03-09):** GitHub Pages deploy workflow – build žingsnyje nustatytas `BASE_PATH=/marketingas`, kad sugeneruoti `lt/` ir `en/` puslapiai turėtų teisingus canonical ir hreflang URL (`/marketingas/lt/`, `/marketingas/en/`).
- **CI ir pa11y (2026-02-19):** GitHub Actions – Chromium „No usable sandbox“: į CI workflow įdėtas `continue-on-error: true` pa11y žingsniui (workflow lieka žalias); .pa11yrc.json ir package.json „pa11y“ – Chrome paleidimo argumentai (`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`). DEPLOYMENT.md – troubleshooting atnaujintas: a11y pilnai tikrinamas lokaliai.
- Badge „Promptų anatomija“: paspaudimo zona (min-height/min-width 44px), z-index ir cursor, kad nuoroda būtų aiškiai paspaudžiama.
- A11y WCAG2AA: community skyriaus nuorodos „Promptų anatomija“ kontrastas (teksto spalva #040404).
- Hreflang skriptas (lt/en index + privatumas/privacy): null patikros prieš `getElementById(...).href`, kad nebūtų klaidos, jei elemento nėra.
- Hreflang `<link>`: pradinis `href=""` pakeistas į `href="#"` – HTML validatoriumi leidžiama, skriptas vėliau nustato tikrus URL.
- package.json: „serve“ įtrauka sutvarkyta; lint:js naudoja `npx eslint` (veikia be globalaus eslint).

### Pašalinta

- Root `privatumas.html`: nenaudojamas (kanoniniai puslapiai – `lt/privatumas.html`, `en/privacy.html`). docs/DOCUMENTATION.md inventoriuje atnaujinta nuoroda į lt/privatumas.html ir en/privacy.html.

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
