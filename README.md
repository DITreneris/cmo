# Turinio DI sistema – rinkodaros vadovams

**Spin-off Nr. 2** iš [Promptų anatomijos](https://www.promptanatomy.app/). Per 45 min. susikursi turinio variklį, kuris dirba kasdien: aiški turinio sistema, 100 turinio vienetų, 30 d. planas. Planuok → Kurk → Platink → Matuok → Spręsk.

## Apie projektą

Interaktyvi HTML platforma su 10 paruoštų promptų rinkodaros sistemai. Paprasta kalba, lietuviški terminai (įžanginis kabliukas, raginimas veikti, matavimo rodikliai, unikalus pardavimo pasiūlymas). Turinys: 30 dienų planas pagal 4 principus, vienos idėjos daug formatų, LinkedIn autoritetas, 30 s video, kasdienė analizė (rodikliai → veiksmai), prieštaravimų apdorojimas, lead generator + DM seka, kliento istorijos, temų grupė, pagrindinis promptas (valdymo centras).

### Funkcijos

- **10 promptų** (Pradžia, Įgūdžiai, Plėtra, Viskas kartu) – kopijuoti į ChatGPT, Claude ar kitą DI įrankį
- **Upgrade sluoksnis prieš promptus** – aiškinimas „Kas yra prompt?", „Kas yra Prompt Anatomy?" ir darbo schema
- **CMO v2 kontekstas + scenarijai + safety** – paspaudus „Kopijuoti promptą", kontekstas (auditorija, USP, kanalai, tikslas, apribojimas) ir privalomos taisyklės automatiškai prepend'inamos prie prompto teksto
- **FAQ + meme slotai** – greitas aiškumas ir lengvas dėmesio atstatymas
- **Interaktyvus dizainas** – premium paletė, aiškūs mygtukai, progresas (0/10)
- **Kopijavimas** – pasirink promptą, spausk „Kopijuoti promptą", įklijuok ir pakeisk laukus
- **Responsive** – veikia desktop ir mobiliai (Mobile UI First)
- **Be duomenų rinkimo** – kontaktų formos nėra; „Pažymėjau kaip atlikau" saugoma tik tavo įrenginyje (localStorage), kontekstas – sessionStorage

## Promptų sąrašas

1. **30 dienų turinio sistema** – planas pagal 4 principus (Autoritetas, Problema, Pavyzdys, Pasiūlymas)
2. **Viena idėja → 7 formatai** – LinkedIn, karuselė, 30 s video, el. laiškas, titulinis ekranas, reklama, 3 įžanginiai kabliukai
3. **LinkedIn autoriteto kūrimas** – 150–200 žodžių su įžanginiu kabliuku, įrodymais, raginimu veikti
4. **Sukurti video – lengviau dar nebuvo!** – 30 s scenarijus: įžanginis kabliukas, 3 punktai, pavyzdys, raginimas veikti
5. **Kasdienė analizė (Veikla→Sprendimas)** – iš rodiklių suprask: kas neveikia, kodėl, ką daryti
6. **Prieštaravimų apdorojimo įrankis** – 10 turinio vienetų iš klientų prieštaravimų
7. **Lead generator postas + DM seka** – postas + 4 žinučių seka
8. **Kliento istorijos struktūra** – problema, sprendimas, procesas, rezultatas, raginimas veikti
9. **Temų grupė** – 1 pagrindinė tema + 8 subtemos, vidinės nuorodos
10. **Pagrindinis promptas (valdymo centras)** – 30 d. struktūra, 5 turinio vienetai, hipotezės, veiksmai

## Kaip naudoti

1. Atidaryk [primary URL](https://promptanatomy.space/lt/) arba [mirror URL](https://ditreneris.github.io/cmo/lt/)
2. (Pasirenkama) Užpildyk **kontekstą** viršuje (auditorija, USP, kanalai, tikslas, apribojimas) – jis išliks tik šioje sesijoje
3. Pasirink promptą ir spausk ant jo – tekstas pažymėsis
4. Spausk **„Kopijuoti promptą"** arba `Ctrl+C` / `Cmd+C` (kontekstas ir taisyklės automatiškai prepend'inamos)
5. Įklijuok į ChatGPT, Claude ar kitą DI įrankį
6. Pakeisk likusius placeholder'ius (jei yra) savo duomenimis

## Technologijos

- **HTML5** – semantinė struktūra, prieinamumas (skip link, ARIA, progress)
- **CSS3** – kintamieji ([styles/tokens.css](styles/tokens.css), [styles/design-tokens.json](styles/design-tokens.json)), responsive, premium paletė (žr. [STYLEGUIDE.md](STYLEGUIDE.md))
- **Vanilla JavaScript** – kopijavimas, progresas (localStorage), CMO v2 kontekstas (sessionStorage), be frameworkų
- **Build:** Node.js skriptai ([scripts/build-locale-pages.js](scripts/build-locale-pages.js), [scripts/generate-og.js](scripts/generate-og.js), [scripts/vercel-export-public.js](scripts/vercel-export-public.js))
- **Google Fonts** – Inter, JetBrains Mono

## Struktūra

**Dokumentacijos indeksas (agentams ir komandai):** [docs/INDEX.md](docs/INDEX.md).

```
.
├── index.html                # LT bazė: hero, upgrade sluoksnis, 10 promptų, CMO konteksto/scenarijų jokio – inject build metu
├── privatumas.html           # Legacy LT privatumas (root, backward compat); kanonas – lt/privatumas.html
├── lt/                       # Generuojama: lt/index.html, lt/privatumas.html (su CMO v2)
├── en/                       # Generuojama: en/index.html, en/privacy.html (su CMO v2)
├── data/                     # JSON šaltiniai build'ui
│   ├── en-prompt-bodies.json     # 10 EN META eilučių
│   ├── en-prompt-expected.json   # „Expected output" EN
│   ├── lt-prompt-expected.json   # „Tikėtinas atsakymas" LT
│   ├── en-scenarios.json         # CMO „Clarity practice" scenarijai EN
│   ├── lt-scenarios.json         # CMO scenarijai LT
│   └── *.png                     # 3 meme slot paveikslai
├── scripts/
│   ├── build-locale-pages.js     # Generuoja lt/, en/ + inject CMO v2 + EN_REPLACEMENTS
│   ├── generate-og.js            # OG paveikslas (SVG → PNG, 1200×630)
│   └── vercel-export-public.js   # Vercel statinio output į public/ + analytics
├── styles/
│   ├── design-tokens.json
│   ├── tokens.css
│   ├── components.css
│   └── utilities.css
├── js/
│   └── en-prompt-bodies-inline.js  # Generuojama iš data/en-prompt-bodies.json
├── public/                   # Vercel deploy artefaktas (gitignored, generuojamas)
├── tests/
│   ├── structure.test.js         # 96+ struktūriniai teiginiai (įsk. CMO v2)
│   ├── design-system-smoke.test.js
│   └── a11y-smoke.test.js
├── docs/
│   ├── INDEX.md              # Navigacija pagal rolę ir užduotį
│   ├── DOCUMENTATION.md      # Dokumentų inventorius
│   ├── LEGACY_GOLDEN_STANDARD.md  # Golden standard (struktūra, ID, JS, CMO v2)
│   ├── MULTILINGUAL_STRUCTURE.md  # LT/EN keliai ir build
│   ├── BULLET_PROOF_PROMPTS.md    # Promptų šablonas
│   ├── PEDAGOGINES_SPECIFIKACIJA.md
│   ├── QA_STANDARTAS.md      # QA (spinoff01)
│   └── TESTAVIMAS.md         # Gyvo testavimo žurnalas
├── .github/workflows/
│   ├── ci.yml                # npm test + pa11y (/lt/, /en/, privacy)
│   └── deploy.yml            # GitHub Pages mirror
├── README.md, AGENTS.md, CHANGELOG.md, DEPLOYMENT.md, STYLEGUIDE.md
├── .cursorrules              # Cursor: kokybė, a11y, docs, commit
├── .pa11yrc.json, .htmlvalidate.json, .eslintrc.json, .nojekyll
├── og.png, favicon.svg
├── robots.txt, sitemap.xml
└── package.json              # npm test, lint:html, lint:js, build
```

## Privatumas

- **Minimali aplikacija:** **nerinkime jokių asmens duomenų**. Visas naudojimas vyksta tik tavo įrenginyje (kopijavimas, „Pažymėjau kaip atlikau" – localStorage; CMO kontekstas – sessionStorage).
- **Privatumo politika:** LT [lt/privatumas.html](lt/privatumas.html), EN [en/privacy.html](en/privacy.html).

## Deployment ir gyvas testavimas

- **Primary URL:** [promptanatomy.space](https://promptanatomy.space) (Vercel, default `BASE_PATH=''`).
- **Mirror URL:** [ditreneris.github.io/cmo](https://ditreneris.github.io/cmo/) (GitHub Pages backup, `BASE_PATH=/cmo`).
- **Deploy:** Vercel auto-deploy iš `main`; GitHub Pages per [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Instrukcijos: [DEPLOYMENT.md](DEPLOYMENT.md).
- **QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01). Projektas laikosi [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md); po deploy – gyvas testavimas pagal [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md).

## Reikalavimai

- **Naudojimui:** Nėra būtinų priklausomybių – atidaryk primary arba mirror URL.
- **Development/CI:**
  ```bash
  npm install
  npm test            # build + tests + lint
  npm run build       # tik build (generate-og + locale + public)
  ```
- **A11y lokaliai:** `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/lt/ --standard WCAG2AA`.

## Licencija

Šis projektas yra atviro kodo ir gali būti naudojamas laisvai.

## Autorius

Sukurta rinkodaros vadovams ir komandoms – sistemingai generuoti turinį, kurti potencialius klientus ir matuoti rezultatus. Pilnas interaktyvus mokymas: [Promptų anatomija](https://www.promptanatomy.app/).

---

**Sėkmės rinkodaroje.**
