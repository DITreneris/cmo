# Turinio DI sistema – rinkodaros vadovams

**Spin-off Nr. 2** iš [Promptų anatomijos](https://www.promptanatomy.app/). Per 45 min. susikursi turinio variklį, kuris dirba kasdien: aiški turinio sistema, 100 turinio vienetų, 30 d. planas. Planuok → Kurk → Platink → Matuok → Spręsk.

## Apie projektą

Interaktyvi HTML platforma su 10 paruoštų promptų rinkodaros sistemai. Paprasta kalba, lietuviški terminai (įžanginis kabliukas, raginimas veikti, matavimo rodikliai, unikalus pardavimo pasiūlymas). Turinys: 30 dienų planas pagal 4 principus, vienos idėjos daug formatų, LinkedIn autoritetas, 30 s video, kasdienė analizė (rodikliai → veiksmai), prieštaravimų apdorojimas, lead generator + DM seka, kliento istorijos, temų grupė, pagrindinis promptas (valdymo centras).

### Funkcijos

- **10 promptų** (Pradžia, Įgūdžiai, Plėtra, Viskas kartu) – kopijuoti į ChatGPT, Claude ar kitą DI įrankį
- **Upgrade sluoksnis prieš promptus** – aiškinimas „Kas yra prompt?“, „Kas yra Prompt Anatomy?“ ir darbo schema
- **FAQ + meme slotai** – numatytos vietos greitam aiškumui ir lengvam dėmesio atstatymui
- **Interaktyvus dizainas** – oranžinė paletė, aiškūs mygtukai, progresas (0/10)
- **Kopijavimas** – pasirink promptą, spausk „Kopijuoti promptą“, įklijuok ir pakeisk laukus
- **Responsive** – veikia desktop ir mobiliai (Mobile UI First)
- **Be duomenų rinkimo** – kontaktų formos nėra; „Pažymėjau kaip atlikau“ saugoma tik tavo įrenginyje (localStorage)

## Promptų sąrašas

1. **30 dienų turinio sistema** – planas pagal 4 principus (Autoritetas, Problema, Pavyzdys, Pasiūlymas)
2. **Viena idėja → 7 formatai** – LinkedIn, karuselė, 30 s video, el. laiškas, titulinis ekranas, reklama, 3 įžanginiai kabliukai
3. **LinkedIn autoriteto kūrimas** – 150–200 žodžių su įžanginiu kabliuku, įrodymais, raginimu veikti
4. **Sukurti video – lengviau dar nebuvo!** – 30 s scenarijus: įžanginis kabliukas, 3 punktai, pavyzdys, raginimas veikti
5. **Kasdienė analizė (Veikla→Sprendimas)** – iš rodiklių suprask: kas neveikia, kodėl, ką daryti
6. **Prieštaravimų apdorojimo įrankis** – 10 turinio vienetų iš klientų prieštaravimų
7. **Lead generator postas + DM seka** – postas + 4 žinučių seka (pristatyti → kvalifikacija → vertė → pasiūlymas)
8. **Kliento istorijos struktūra** – problema, sprendimas, procesas, rezultatas, pagrindinės mintys, raginimas veikti
9. **Temų grupė** – 1 pagrindinė tema + 8 subtemos, vidinės nuorodos, raginimas veikti
10. **Pagrindinis promptas (valdymo centras)** – 30 d. struktūra, 5 turinio vienetai, vienos idėjos daug formatų, hipotezės, veiksmai

## Kaip naudoti

1. Atidarykite [index.html](index.html) naršyklėje arba gyvą svetainę: [ditreneris.github.io/cmo](https://ditreneris.github.io/cmo/)
2. Pasirinkite promptą ir spauskite ant jo – tekstas pažymėsis
3. Spauskite **„Kopijuoti promptą“** arba `Ctrl+C` / `Cmd+C`
4. Įklijuokite į ChatGPT, Claude ar kitą DI (dirbtinio intelekto) įrankį
5. Pakeiskite `[auditorija]`, `[galvos skausmas]`, `[unikalus pardavimo pasiūlymas]`, `[kanalas]` ir kitus laukus savo duomenimis

## Technologijos

- **HTML5** – semantinė struktūra, prieinamumas (skip link, ARIA, progress)
- **CSS3** – kintamieji, responsive, oranžinė paletė (žr. [STYLEGUIDE.md](STYLEGUIDE.md))
- **Vanilla JavaScript** – kopijavimas, progresas (localStorage), be frameworkų
- **Google Fonts** – Inter, JetBrains Mono

## Struktūra

```
.
├── index.html              # Pagrindinis puslapis (hero, upgrade sluoksnis, 10 promptų, instrukcijos)
├── privatumas.html         # Privatumo politika
├── README.md               # Ši dokumentacija
├── CHANGELOG.md            # Versijų istorija (Keep a Changelog)
├── STYLEGUIDE.md           # Spalvos, komponentai, tipografija
├── DEPLOYMENT.md           # Deploy į GitHub Pages (cmo)
├── package.json            # npm test, lint:html, lint:js
├── .pa11yrc.json           # A11y (pa11y) – Chrome launch args CI
├── docs/
│   ├── DOCUMENTATION.md    # Dokumentų inventorius
│   ├── LEGACY_GOLDEN_STANDARD.md   # Struktūra, ID, JS API (keičiant turinį)
│   ├── PEDAGOGINES_SPECIFIKACIJA.md
│   ├── QA_STANDARTAS.md    # QA (spinoff01)
│   └── TESTAVIMAS.md       # Gyvo testavimo žurnalas
├── .github/workflows/
│   ├── ci.yml              # Lint, testai, pa11y
│   └── deploy.yml          # GitHub Pages
└── tests/
    └── structure.test.js   # Struktūros testai (promptai, ID, mygtukai)
```

## Privatumas

- **Minimali aplikacija:** šiuo metu **nerinkime jokių asmens duomenų**. Visas naudojimas vyksta tik tavo įrenginyje (kopijavimas, „Pažymėjau kaip atlikau“ – localStorage).
- **Privatumo politika:** LT [lt/privatumas.html](lt/privatumas.html), EN [en/privacy.html](en/privacy.html) – aprašymas, kad duomenų nerinkime; jei vėliau bus įjungta kontaktų forma, bus atnaujinta.

## Deployment ir gyvas testavimas

- **Deploy:** GitHub Pages per [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Instrukcijos: [DEPLOYMENT.md](DEPLOYMENT.md).
- **Production URL:** https://ditreneris.github.io/cmo/ (deploy tik į repo **cmo**, žr. [DEPLOYMENT.md](DEPLOYMENT.md))
- **QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01). Projektas laikosi [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md); po deploy – gyvas testavimas pagal [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md).

## Reikalavimai

- **Naudojimui:** Nėra būtinų priklausomybių – atidarykite index.html arba [ditreneris.github.io/cmo](https://ditreneris.github.io/cmo/)
- **Development/CI:** `npm install`, `npm test` (build + `tests/structure` + `tests/design-system-smoke` + `tests/a11y-smoke` + `lint:html` + `lint:js`). A11y lokaliai: `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/lt/ --standard WCAG2AA`.

## Kontaktų rinkimas (vėlesniems etapams)

Dabartinė versija minimali – kontaktų formos nėra. Jei vėliau reikės rinkti atsiliepimus, integracijos instrukcijos saugomos repozitorijoje (vėlesniems etapams).

## Licencija

Šis projektas yra atviro kodo ir gali būti naudojamas laisvai.

## Autorius

Sukurta rinkodaros vadovams ir komandoms – sistemingai generuoti turinį, kurti potencialius klientus ir matuoti rezultatus. Pilnas interaktyvus mokymas: [Promptų anatomija](https://www.promptanatomy.app/).

---

**Sėkmės rinkodaroje.**
