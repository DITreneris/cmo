# Design system epic — EN kompozicija

**Statusas:** Iteracijos 2–13 yra `/en/` kode. Vartai 7 uždaryti 2026-10-17. Visual PNG baseline dar neatnaujintas (`npm run test:visual`). Failas lieka kaip iteracijų istorija.  
**Data:** 2026-10-17  
**Ambition:** A / R1-support. R1 neišeina. SemVer nekeliamas.  
**Dizaino sistema dabar:** [STYLEGUIDE.md](STYLEGUIDE.md) **1.8.0** §0.4. Skyriai žemiau, kurie liepia palikti **1.6.2**, yra tos iteracijos įrašas. Gyvas paveikslas yra §0.4 ir [docs/visual/2026-10-17-en-composition.md](docs/visual/2026-10-17-en-composition.md).  
**Kalba:** LT. Produktas lieka EN kanonas `/en/`.  
**Locale:** `/lt/` ir `data/lt-*.json` neliečiami.

Šis failas yra vienintelis šaltinis, kas daroma su gyvu `/en/` vaizdu po 2026-10-15 pikselių praėjimo. Agentas, kuris keičia hero, brief, storefront, `#pro-contents` arba poraštę, skaito šią iteraciją iki galo ir daro tik ją.

---

## 0. Kodėl šitas epikas yra

2026-10-15 vizualinis praėjimas ([docs/visual/2026-10-15-en-visual.md](docs/visual/2026-10-15-en-visual.md)) nufotografavo `/en/` ir pavadino rezultatą praėjimu, nes Playwright pikseliai sutapo su `tests/visual/snapshots/`. Tie kadrai yra sulūžusi kompozicija:

| Ekranas | Ką mato žmogus | Iteracija |
|---------|----------------|-----------|
| Hero, pirmas viewport | Turinys suspaustas viršuje, po rankine tuščias popierius, „Build my prompt“ mažas | 2 |
| `#creative-brief` | Kairė sulipusi, dešinė panelė kabo, po forma balta skylė, violetinė nuoroda | 3 (nuorodos spalva jau 1) |
| `#pdf-storefront` | Juodi `USE` / `INSTALL`, antraštės nesueina, 96px viršelis, „separately“ perbraukta | 4 (perbraukimas jau 1) |
| `#pro-contents` | Plaukų linijų lentelė, po ja priklijuotas „Copy tips“ | 5 |
| `#ecosystem-strip` + `#community` + `footer` | Trys tekstiniai blokai, pabrauktos nuorodos, versija, adresas per vidurį | 6 |

DS **1.6.2** tą poraštę pasirašė: [STYLEGUIDE.md](STYLEGUIDE.md) §0.3 `surface-page / open` = how-it-works, instructions, FAQ, ecosystem, footer, community. Atviras paviršius buvo suprasta kaip „jokio piešinio“. Epikas tą sakinį pakeičia iteracijoje 6. Iki tol gidas lieka 1.6.2, kad dokumentas nemeluotų apie kodą, kurio dar nėra.

Pilnas root `<style>` trynimas lieka parked: [docs/TEMPLATE_MIGRATION_BACKLOG.md](docs/TEMPLATE_MIGRATION_BACKLOG.md). Šitas epikas jo neatidaro.

---

## 1. Kas lieka už epiko

Šitie dalykai atrodo kaip senas kodas. Juos trinti draudžiama visose septyniose iteracijose.

| Kas | Kur | Kodėl lieka |
|-----|-----|-------------|
| `.lang-switcher` | [styles/components.css](styles/components.css) ~2415; smoke ~250 | LT `privatumas.html` ir `tests/design-system-smoke.test.js` reikalauja klasės. EN produkto juostoje jungiklio nėra. |
| `removeEl(q('.footer > h3'))` ir `.footer .tags` / `.cmo-footer-crosslink` valymas | root [index.html](index.html) ~2073 | EN runtime nuima workbook mazgus. `tests/structure.test.js` ir `tests/e2e/smoke.spec.js` tikrina, kad šalinimas yra, o `footer > h3` gyvame EN yra 0. |
| `#pro-contents`, `#block4`, `#block6`–`#block10` | [en/index.html](en/index.html) | Katalogo ID. Ne šešios netikros `.prompt` kortelės. |
| Porąštės entity sakinys | `#footer-product-link` | Šis puslapis yra Content AI System. Kursas ant `promptanatomy.app` yra kitas produktas. Checkout lieka šiame puslapyje. |
| Auksas ne kaip nuorodos `color` | STYLEGUIDE §0.1, lesson §10.19 | Auksas = CTA fill, žiedas, kraštas. Nuorodos spalva = ink `--color-text-primary`. |
| Kainos ir Stripe | [config/sot.json](config/sot.json), Payment Links | $3.99 / $10.99 / Pro $8.99 tekstu. Jokių naujų SKU. |
| Hero H1, rankinės failas, alt | `assets/hero/brief-sample-satori.png` + `.webp` | Tekstas ir asset string lieka. Testai rakina failo vardą. |
| `#heroCtaSpine` → `#creative-brief`, `#heroCtaBrief` → `#pdf-storefront` | hero | Primary = Build my prompt. Secondary = See pricing. |
| `#cb-builder` atributas `open` | brief | Įrankis atidarytas. Žingsniai 1/2/3 ir laukų ID lieka. ChatGPT + Ideogram only. |
| LT snapshot | `lt/`, `data/lt-*.json` | Joks šio epiko diff. |

---

## 2. Kaip skaityti iteraciją

Kiekviena iteracija turi tuos pačius laukus, ta pačia tvarka:

1. **Ekranas** — ką žmogus mato dabar.
2. **Kas piešia** — failas, selektorius, eilutė, build, jei HTML gimsta ne ranka.
3. **Ką keisti** — vienas pakeitimas vienoje eilutėje. Eilės tvarka yra darbo tvarka.
4. **Ko neliesti** — šitos iteracijos draudimai, be viso §1 sąrašo.
5. **Vartai** — kada iteracija baigta. Kita neprasideda, kol šitie nepraeina.
6. **Dokumentai** — ką atnaujinti tame pačiame PR.

Kaskados faktas, kurio nepainioti su „negyvu CSS“: root [index.html](index.html) `<style>` baigiasi ~1319 eilutėje. `styles/components.css` įkeliamas **po** jo (~1321). Vienodo specifiškumo taisyklė `components.css` laimi. Inline taisyklė vis dar piešia, kai `components.css` tos savybės **neišreiškia iš naujo**.

---

## 3. Iteracija 1 — likučiai, kurie jau piešia klaidingai

**Tikslas.** Sutaisyti tris gyvas klaidas ir sutraukti dvigubą hero šaltinį. Nepalieti šablono migracijos.

### Ekranas

- Storefront dešinėje „separately $12.98“ atrodo kaip sena kaina, nes ta pati klasė braukia ir „was“, ir „separately“.
- Atšaukta 2026-10-17. Brief apačioje „CMO AI Content System kits“ nebėra. Nuoroda šoko į jau matomą kainų antraštę.
- Hero padding ir margin gyvena dviejuose `.header` blokuose. Agentas pataiso vieną, kitas lieka.

### Kas piešia

| Taisyklė | Failas | Eilutė | Kas laimi |
|----------|--------|--------|-----------|
| `.pdf-card-was { text-decoration: line-through }` | [styles/components.css](styles/components.css) | ~1704 | Vienintelis šaltinis. Braukia abu spanus. |
| `<span class="pdf-card-was">` ir `was` / `separately` tekstas | [scripts/build-locale-pages.js](scripts/build-locale-pages.js) `buildPdfCard` | ~970–975 | `product.id === 'bundle'` keičia tik žodį, ne klasę. |
| Atšaukta 2026-10-17. `.cb-pro-teaser` | [styles/components.css](styles/components.css) | — | Nuorodos nebėra. Nebegražinti, kad testas pažaliuotų. |
| Atšaukta 2026-10-17. `.cb-pro-teaser` HTML | [scripts/build-locale-pages.js](scripts/build-locale-pages.js) | — | „CMO AI Content System kits“ ir `href="#pdf-storefront"` po brifu išimti. |
| `.header { ... }` pirmas blokas | [styles/components.css](styles/components.css) | ~1906 | `padding`, `margin-bottom: var(--space-10)`, full-bleed. |
| `.header { ... }` antras blokas | [styles/components.css](styles/components.css) | ~2369 | Perrašo tik `padding-left/right` ir `margin-bottom: var(--space-6)`. |

### Ką keisti

1. [scripts/build-locale-pages.js](scripts/build-locale-pages.js) `buildPdfCard`: kai `product.id === 'bundle'`, span klasė yra `pdf-card-compare`, tekstas lieka `separately $12.98`. Starter span lieka `pdf-card-was` ir `was $7.99`.
2. [styles/components.css](styles/components.css): `.pdf-card-was` palieka `text-decoration: line-through`. Nauja `.pdf-card-compare` neturi perbraukimo, dydis ir spalva kaip dabartinis `.pdf-card-was` be line-through.
3. Atšaukta 2026-10-17. `.cb-pro-teaser a` nebegrąžinti. Nuoroda šoko dvi eilutes į `#pdf-storefront`.
4. Sujungti du `.header` blokus į vieną, po DS 1.6.2 komentaru (~2351). Palikti vėlesnio bloko padding formulę `max(var(--shell-pad), calc(50vw - (var(--shell-max) / 2)))` ir `margin-bottom: var(--space-6)`. Pirmąjį `margin-bottom: var(--space-10)` išmesti. Likusios pirmojo bloko savybės (full-bleed, `border-bottom`, `background`, `overflow`) persikelia į sujungtą taisyklę, ne dingsta.
5. Į šio epiko pabaigos inventorių (žemiau, §4) neberašyti naujų eilučių. Inventorius jau yra. Iteracijos 1 PR jį tik patikrina: jei inline selektorius iš §4 dingo arba `components.css` jį perrašė, eilutė pažymima „nebe piešia“.

### Ko neliesti

- `tierTag` Use / Build / Install ir `.pdf-card-tier` fonas. Tai iteracija 4.
- `.cb-layout` ir `<details>` santrauka. Tai iteracija 3.
- Root `<style>` blokas kaip visuma. Pilnas trynimas lieka [docs/TEMPLATE_MIGRATION_BACKLOG.md](docs/TEMPLATE_MIGRATION_BACKLOG.md).
- Kainų skaičiai `compareAtUsd` 7.99 ir 12.98.

### Vartai

- EN HTML po `npm run build`: Complete kortelėje yra `pdf-card-compare`, nėra `line-through` ant „separately“. Starter tebeturi `pdf-card-was`.
- Atšaukta 2026-10-17. `.cb-pro-teaser a` spalvos vartų nebėra. EN HTML neturi `id="cbTips"` ir `class="cb-pro-teaser"`.
- Vienas `.header {` produktiniame sluoksnyje (spausdinimo `@media print` `.footer` nesiskaito).
- `npm test` praeina. `git diff -- lt/ data/lt-` tuščias.

### Dokumentai

- [CHANGELOG.md](CHANGELOG.md) `## [Unreleased]`: `[UI]` eilutė apie compare klasę, teaser nuorodą, vieną `.header`.
- Šio failo §4 eilutės, kurias PR palietė, pažymimos „sutvarkyta iteracijoje 1“.
- STYLEGUIDE versija **nekeliama**.

---

## 4. Inline inventorius (iteracija 1 skaito, netrina)

`<style>` yra [index.html](index.html) 44–1319. Po jo kraunamas `components.css`. Žemiau tik taisyklės, kurios liečia penkis sulūžusius ekranus. Jei `components.css` savybę išreiškia iš naujo, inline nebe piešia.

| Inline selektorius | Eilutė | Ar dar piešia EN | Iteracija, kuri tai tvarko |
|--------------------|--------|------------------|----------------------------|
| `.header h1` font-weight 700, margin | ~128 | Ne. `components.css` `.header h1` ~2155 yra vėlesnis. | 2, jei svoris vis dar blogas jau laimėjusiame bloke |
| `.header p` | ~143 | Ne, kai `.header-lead` / `.header-proof` specifiškesni (~2385). | 2 |
| `.header-trust a` auksas + underline | ~171 | Tik jei hero trust viduje yra `<a>`. Dabartiniai trust yra `<li>`, ne nuorodos. | Neliečia, kol trust netampa nuoroda |
| `.cta-button` | ~213 | Dalinai. `components.css` perrašo dalį geometrijos. Prieš iteraciją 2 patikrinti suskaičiuotą `font-size` ir padding. | 2 |
| `.ecosystem-strip` gradientas, `border: 2px`, radius 16 | ~856 | Ne. `components.css` ~16–24: `background: transparent; border: none; box-shadow: none`. | 6 piešia iš naujo jau laimėjusiame sluoksnyje |
| `.ecosystem-strip-list` 2 stulpeliai nuo 640px | ~878 | **Taip.** `components.css` šios taisyklės neturi. Sąrašas dabar turi 1 `<li>`, todėl antro stulpelio nematyti. | 6 |
| `.ecosystem-strip-list a` underline, ink | ~892 | **Taip.** Vienintelis nuorodos piešinys. | 6 |
| `.ecosystem-strip-related a` underline | ~915 | Dalinai. `components.css` ~34 pakartoja underline ir ink. Laimi vėlesnis. | 6 |
| `.community`, `.community h2`, `.community p` | ~963 | **Taip**, kur `components.css` neperrašo margin, šrifto, lygiavimo. | 6 |
| `.community-cta-primary` inline | ~989 | Dalinai. `html[lang="en"] .community-cta-primary` ~1464 laimi EN: skaidrus fonas, 2px ink rėmelis. | 6 |
| `.footer` baltas fonas, radius 20, šešėlis, `text-align: center`, padding 48 | ~1044 | Fonas, rėmelis, šešėlis — ne (juos nuima ~16–24). **`text-align: center` ir padding — taip.** | 6 |
| `.footer-product-link a` spalva `--tertiary` | ~1071 | Ne EN. `html[lang="en"] .footer-product-link a` ~1459 stato ink. | 6 tik kompoziciją |
| `.footer-email a` underline | ~1095 | Spalvą EN perrašo ~1459. Underline iš inline gali likti. | 6 |

Kitų inline selektorių (toast, prompt, print) šitas epikas neinventorizuoja ir netrina.

---

## 5. Iteracija 2 — hero kadras

**Tikslas.** Pirmas viewport yra viena scena. CTA yra inkaras. Po sample nėra tuščio popieriaus iki `#creative-brief`.

### Ekranas

Antraštė, lead, „Free below“, trys taškai, mažas auksinis mygtukas ir tyli „See pricing“ sėdi kairėje. Dešinėje tamsi kortelė su rankine, aukštesnė už tekstą. Po abiem stulpeliais tas pats kreminis fonas, todėl atrodo, kad puslapis baigėsi.

### Kas piešia

| Taisyklė | Failas | Eilutė |
|----------|--------|--------|
| `.header` padding, `margin-bottom`, nėra `min-height` | [styles/components.css](styles/components.css) | po iteracijos 1 sujungtas blokas; dabar ~1906 ir ~2369 |
| `.header-grid` nuo 900px `align-items: start`, `1.1fr / 0.9fr` | tas pats | ~2147 |
| `.header h1` `max-width: 18ch` | tas pats | ~2163 |
| `.header-cta` `margin-top: var(--space-6)` | tas pats | ~2247 |
| `.hero-diagram` `max-width: 28.75rem` | tas pats | ~2451 |
| `.header-visual` `align-items: flex-start` | tas pats | ~2404 |
| H1 tekstas | root `applyStaticLocaleText` | ~1859 |

### Ką keisti

1. Nuo 900px `.header` užpildo pirmą viewport: `min-height` skaičiuojamas nuo viewport minus lipni juosta (`.header-bar` yra sticky, ne hero viduje). Turinys vertikaliai sėdi scenoje, ne prilipęs prie juostos viršaus.
2. `.header-grid` nuo 900px: `align-items: center`. Kairė ir sample dalijasi vieną horizontalią ašį.
3. Kairės eilė: H1, vienas `.header-lead` sakinys, tada `.header-cta`. `.header-proof` ir `.trust-pills` lieka DOM (ID `#heroProof`, `#heroTrustPill1/2/3`). EN visuose pločiuose `#heroProof` yra tyli eilutė **po** CTA (`order: 2`). Trust lieka paslėptas.
4. `.cta-button` hero viduje (`#heroCtaSpine`) yra vienintelis auksinis stačiakampis scenoje. Dydis ne mažesnis už dabartinį `.btn` hit target (min-height 44px). „See pricing“ lieka teksto nuoroda šalia, ne antras mygtukas.
5. `.hero-diagram` `max-width` keliamas taip, kad sample užpildytų dešinį stulpelį scenoje, ne paliktų kortelę kaip pašto ženklą. Viršutinė riba lieka stulpelio plotis, ne viso viewport.
6. Po `.header` nėra papildomo tuščio `margin`, kuris atskiria sample nuo `#creative-brief` daugiau nei `--space-6`. Kita sekcija prasideda iškart po scenos, kad fold neskaitytųsi kaip pabaiga.
7. 320–899px: vienas stulpelis, CTA stulpu (jau yra `< 481px`). `min-height: 100vh` **nededamas**. Sample lieka po tekstu, `max-width: 28rem` (~2204) lieka.

### Ko neliesti

- H1 eilutė „Content AI System.“ Užraktas: [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) turinio užraktas.
- `assets/hero/brief-sample-satori.png` / `.webp`. Failo vardas lieka. `#heroLead` yra *Fill the fields. Copy the prompt. Paste it into your image tool.* `#heroTrustPill1/2/3` ID lieka, echo teksto nėra. `#heroProof` yra *No account.* po CTA. Alt nekalba apie headline.
- `#heroCtaSpine`, `#heroCtaBrief`, href.
- Lipni `#siteNav` sudėtis: Workflows, Brief builder, Pricing.
- Fraunces tik ant hero H1.

### Vartai

- 1024 ir 1920: pirmame ekrane matomas H1, „Build my prompt“, sample. Iki `#creative-brief` antraštės nėra tuščios kreminės juostos, aukštesnės už `--space-6`.
- 320: mygtukas po tekstu, ne šalia, sample neužlenda už ekrano krašto (`scrollWidth === clientWidth`).
- Hero H1 suskaičiuotas šriftas vis dar Fraunces.

### Dokumentai

- [STYLEGUIDE.md](STYLEGUIDE.md) §0.4 hero pastraipa: scena užpildo pirmą viewport. Versijos numeris lieka 1.6.2 iki iteracijos 7.
- [CHANGELOG.md](CHANGELOG.md) `## [Unreleased]` `[UI]`.
- Visual baseline `header.header` ir fold atnaujinami **tik** šitam PR, ne visam puslapiui.

---

## 6. Iteracija 3 — brief kaip vienas įrankis

**Tikslas.** Forma ir išvestis yra viena kortelė. Atidarytas įrankis neberodo antros antraštės juostos. Nuoroda į rinkinius nebėra naršyklės numatytoji.

### Ekranas

Balta kortelė su auksiniu kairiu kraštu. Viršuje eyebrow, H2, lead, „Try an example“. Tada `<summary>BRIEF BUILDER</summary>` su `+`/`−` per visą plotį. Žemiau kairėje keturi laukai, dešinėje tamsi panelė, kuri prasideda žemiau ir tęsiasi ilgiau. Po laukais kairė tuščia. Apačioje violetinė nuoroda (spalvą jau tvarko iteracija 1; šita iteracija tvarko vietą ir svorį).

### Kas piešia

| Taisyklė | Failas | Eilutė |
|----------|--------|--------|
| `.creative-brief` kortelė, kairys 4px auksas | [styles/components.css](styles/components.css) | ~1068 |
| `.cb-stage:has(#cb-builder[open])` aukštis `100dvh - 5.5rem` | tas pats | ~3219 |
| `.cb-builder-details > summary` uppercase juosta, `border-bottom` | tas pats | ~2782 |
| `#cb-builder` `open` | [en/index.html](en/index.html) | ~1389 |
| Atšaukta 2026-10-17. `.cb-pro-teaser` pastraipos nebėra | [scripts/build-locale-pages.js](scripts/build-locale-pages.js) | — |

### Ką keisti

1. Nuo 900px atidaryta `.cb-stage` yra `height` ir `max-height: calc(100dvh - 5.5rem)`, tinklelis `minmax(0, 1.1fr) minmax(0, 0.9fr)`. Kairė `.cb-stage-main` ir dešinė `.cb-output-wrap` slenka viduje (`min-height: 0`, `overflow-y: auto`). `align-items: stretch` scenos nebeaugina: tuščią aukštį suvalgo viewport, ne panelės turinys. Uždarytam įrankiui aukštis lieka `auto`.
2. `<summary>` tekstas „Brief builder“ ir `+`/`−` nuo 900px neberodomi, kai `#cb-builder` yra `open`. Uždarymo elgsena lieka: vartotojas vis dar gali uždaryti (summary lieka klaviatūrai, vizualiai tai viena tyli eilutė, ne antroji antraštė). 320px summary lieka matoma, nes ten įrankis ilgas.
3. Atšaukta 2026-10-17. `.cb-pro-teaser` nebeatsiskiria nuo formos, nes pastraipos nebėra.
4. Pakeista iteracijoje 8. „Try an example“ nebėra atskiras mygtukas. Trys presetai yra vienintelis startas.

### Ko neliesti

- Laukų `id` ir `data-cb-field`.
- Žingsniai Context / Visual / Text, `.cb-panel[hidden] { display: none !important }`.
- ChatGPT ir Ideogram URL.
- `#cb-builder` numatytas `open`.
- Auksinis kairys kraštas (accent paviršius, STYLEGUIDE §0.3). Jis lieka vienas, ne ant kiekvieno lauko.

### Vartai

- 1024: atidarytos `.cb-stage` aukštis ne didesnis už viewport. Panelės apačia sutampa su scenos apačia. Po laukais nėra baltos kolonos, kuri tęsiasi žemiau scenos.
- Atšaukta 2026-10-17. Nuorodos „CMO AI Content System kits“ nebėra. Po įrankių eina kainų antraštė.
- Tab pereina laukus, summary, Copy, įrankių mygtukus. `open` po perkrovimo lieka.

### Dokumentai

- [docs/CREATIVE_BRIEF_BUILDER.md](docs/CREATIVE_BRIEF_BUILDER.md): summary nuo 900px, kai open, nėra antros antraštės.
- [CHANGELOG.md](CHANGELOG.md) `[UI]`.
- Visual baseline tik `en-creative-brief-*`.

---

## 7. Iteracija 4 — pardavimo kortelės

**Tikslas.** Dvi kortelės skaitomos kaip vienas palyginimas. Pirmas daiktas kortelėje yra pasiūlymas, ne juodas blynas. „separately“ skaitoma (klasę jau skelia iteracija 1).

### Ekranas

Starter ir Complete šalia. Kairėje juodas `USE`, dešinėje šviesus `BEST VALUE` ir po juo juodas `INSTALL`. Dėl antro blyno dešinė antraštė prasideda žemiau. Viršelis yra 96px nykštys, po juo tuščia. Kainos ir mygtukai nesidalija linija. Dešinė kortelė platesnė (`1.2fr`).

### Kas piešia

| Taisyklė | Failas | Eilutė |
|----------|--------|--------|
| `tierTag` Use / Build / Install | [config/sot.json](config/sot.json) | ~170, ~197, ~225 |
| `.pdf-card-tier` HTML | [scripts/build-locale-pages.js](scripts/build-locale-pages.js) | ~991 |
| `.pdf-card-badge` „Best value“ tik bundle | tas pats | ~987 |
| `.pdf-card` nuo 520px `96px minmax(0, 1fr)`, `align-items: start` | [styles/components.css](styles/components.css) | ~1602 |
| `.pdf-card-cover` `max-width: 96px` nuo 520px | tas pats | ~1637 |
| `.pdf-card-tier` fonas `--color-brand-dark` (#0b1320), balta, uppercase | tas pats | ~1656 |
| Tinklelis nuo 900px `1fr / 1.2fr` | tas pats | ~1561 |
| `.pdf-card-was` / `.pdf-card-compare` | iteracija 1 | — |

### Ką keisti

1. `.pdf-card` nuo 900px yra vertikali kortelė: viršelis viršuje, plotis kortelės, ne 96px bėgelis. `aspect-ratio: 220 / 285` lieka. Nuo 520px iki 899px viršelis irgi ne 96px: dabartinis 180px žemiau 520px lieka mobiliajam, nuo 520px viršelis yra kortelės plotis su max apie 200px, centruotas.
2. `.pdf-storefront-grid` nuo 900px yra `1fr 1fr`. Complete nebe platesnė. Svorį rodo rėmelis ir „Best value“, ne stulpelio plotis.
3. Badge eilutė yra viena ir to paties aukščio abiejose kortelėse. Starter, neturinti „Best value“, laiko tuščią tos pačios aukščio eilutę, kad H3 prasidėtų vienoje linijoje. `Best value` lieka `.pdf-card-badge` (šviesus, ne auksas kaip tekstas).
4. `.pdf-card-tier` nebėra juodas blynas virš pavadinimo. `tierTag` eilutė lieka DOM (`role="note"`, tekstas Use / Install iš SOT), bet vizualiai tai viena tyli žodžio eilutė po subtitrą, `color: var(--color-text-secondary)`, be `background`, be uppercase bloko. Build HTML klasės neprivalo dingti. Pro `tierTag` Build lieka SOT, nes Pro kortelės puslapyje nėra (Pro yra teksto nuoroda).
5. Kaina, trys punktai ir CTA dalijasi apačią: `.pdf-card-body` yra stulpelis, `.pdf-card-cta` gauna `margin-top: auto`, kad mygtukai sėdėtų vienoje linijoje, kai tinklelis ištiesia korteles.
6. Auksiniai taškai prie punktų (`.pdf-card-bullets li::before`) lieka. Jie yra paviršius, ne tekstas.
7. Iteracijos 1 `.pdf-card-compare` negrąžinamas į `line-through`.

### Ko neliesti

- `priceUsd`, `compareAtUsd`, Stripe `href`, `data-product-id`.
- Pro eilutė „Get Pro · $8.99“ kaip tekstas, ne trečia kortelė.
- Palyginimo lentelė. `comparisonTable` SOT gali likti nenaudojamas. Į puslapį negrąžinamas.
- Viršelio PNG failai `assets/pdf-covers/`.

### Vartai

- 1024: abiejų kortelių H3, kainos ir CTA viršutiniai kraštai sutampa (±2px).
- Suskaičiuotas `.pdf-card-tier` fonas yra skaidrus. Tekstas skaitomas, kontrastas ≥ 4.5:1.
- „separately $12.98“ be perbraukimo. „was $7.99“ su perbraukimu.
- 320: viena kortelė po kita, viršelis ne 96px juostelė kampe.

### Dokumentai

- [docs/OFFER-ARCHITECTURE.md](docs/OFFER-ARCHITECTURE.md): tier žodis yra tyli eilutė, ne blynas. Use / Build / Install prasmė SOT lieka.
- [CHANGELOG.md](CHANGELOG.md) `[UI]`.
- Visual baseline `en-pdf-storefront-*`.

---

## 8. Iteracija 5 — Pro katalogas

**Tikslas.** `#pro-contents` skaitomas kaip vienas mokamo rinkinio turinys. „Copy tips“ nebėra tos pačios skaidrės apačia.

### Ekranas

Eyebrow PRO, H2 „Also in the Pro kit“, sakinys „Full prompt bodies offline in Pro.“ Šešios eilutės su trumpu kairiu žodžiu ir dešine fraze, plaukų linija per visą plotį, dešinė tuščia. Mygtukas „See the Complete kit“. Iškart po juo „Copy → paste into ChatGPT or Claude.“ ir „Copy tips · ~3–5 min“.

### Kas piešia

| Taisyklė | Failas | Eilutė |
|----------|--------|--------|
| `#pro-contents` sekcija | [en/index.html](en/index.html) | ~1955 |
| `.pro-contents-item` `7.5rem 1fr`, `border-bottom` | [styles/components.css](styles/components.css) | ~482 |
| `.pro-contents` fonas `surface-panel` | tas pats | ~448 |
| `#executive-summary` „Copy → paste“ | [en/index.html](en/index.html) | ~1988 |
| `#copy-tips` | [en/index.html](en/index.html) | ~1993 |

### Ką keisti

1. `.pro-contents` lieka viena panelė. Sąrašas nuo 900px yra du stulpeliai po tris eilutes, ne viena 7.5rem etiketė ir tuščia dešinė. Kiekviena eilutė rodo job ir outcome kartu, be linijos per visą puslapio plotį.
2. `#pro-contents-cta` lieka vienas mygtukas, `href="#pdf-storefront"`, tekstas „See the Complete kit“. Jis sėdi po sąrašu, ne po tuščia linija.
3. Tarp `#pro-contents` ir `#executive-summary` yra aiškus skyriaus lūžis: `#executive-summary` prasideda savo antrašte, ne viena našlaičio eilute. H2 „How to use“ nuimamas iš `.visually-hidden` tik jei eilutė „Copy → paste…“ lieka po matoma antrašte. Jei antraštė dubliuoja lead, lead lieka, H2 lieka paslėptas, bet sekcija gauna `margin-top: var(--space-10)` ir viršutinę 1px liniją, kad nebekibtų prie katalogo.
4. `#copy-tips` lieka `<details>`. Jis yra how-to sekcijos viduje vizualiai (ta pati grupė kaip usage strip), ne katalogo poraštė.

### Ko neliesti

- `id="block4"`, `block6`–`block10`, `data-teaser-prompt`.
- Sąrašo tekstai (Video, Objections, …), nebent Content atskirame PR keičia `applyStaticLocaleText` ir SOT kartu. Šita iteracija jų neperrašo.
- Šešių `.prompt--teaser` kortelių negrąžinti.
- `#progressJump` href į katalogą, jei toks yra. ID lieka.

### Vartai

- 1024: katalogas ir „Copy → paste“ neskaitomi kaip viena lentelė. Tarp jų matomas skyrius.
- Šeši ID vis dar dokumente. `npm test` free-spine assert praeina.
- 320: eilutės viena po kitos, mygtukas pilno pločio neprivalomas, bet ne karpytas.

### Dokumentai

- [docs/OFFER-ARCHITECTURE.md](docs/OFFER-ARCHITECTURE.md) viena eilutė: katalogas yra turinio tinklelis, ne worksheet.
- [CHANGELOG.md](CHANGELOG.md) `[UI]`.
- Visual baseline `en-pro-contents-*`, `en-executive-summary-*` jei pikseliai pajuda.

---

## 9. Iteracija 6 — puslapio pabaiga

**Tikslas.** Ekosistema, bendruomenė ir poraštė yra vienas uždarymas. Teisinės eilutės lieka. Jos nebėra dizainas. Atviras paviršius nebėra „nenumatyta nuoroda per vidurį“.

### Ekranas

„Prompt Anatomy ecosystem“, viena pabraukta metodologijos nuoroda, tyli Leader eilutė. Tada linija, „Join the community.“, kontūrinis „Join Telegram group“. Tada „Content AI System v1.10.0“, ilgas entity sakinys, email, adresas Alameda, viskas centruota. Skaitosi kaip 1999 katalogas, nes inline `text-align: center` vis dar laimi, o `components.css` nuėmė kortelės foną ir paliko pliką tekstą.

### Kas piešia

Žiūrėk §4 eilutes, pažymėtas „Taip“. Papildomai:

| Taisyklė | Failas | Eilutė |
|----------|--------|--------|
| `.surface-page` grupė transparent | [styles/components.css](styles/components.css) | ~16 |
| `html[lang="en"] .community-cta-primary` kontūras | tas pats | ~1464 |
| `.cmo-kit-version` | tas pats | ~1042 |
| Ecosystem HTML, vienas `<li>` | [en/index.html](en/index.html) | ~2089 |
| Footer entity, email, address | tas pats | ~2106 |

### Ką keisti

1. Vienas uždarymo blokas nuo `#ecosystem-strip` iki `footer` pabaigos. Trys semantiniai elementai lieka (`section`, `section`, `footer`). Vizualiai jie dalijasi vieną kairę ašį, `text-align: start`. Inline `.footer { text-align: center }` perrašomas `components.css` taisykle `.footer { text-align: start; padding: var(--space-8) 0; }`, kad kaskada laimėtų.
2. `.ecosystem-strip-list a` perkeliama į `components.css` (underline, ink, min-height 44px). Inline kopija lieka iki šablono migracijos, bet nebe ji laimi. Nuoroda lieka viena: Official methodology. Antro stulpelio taisyklė nuo 640px inline nebe taikoma EN, nes `components.css` stato `grid-template-columns: 1fr`.
3. Leader lieka `.ecosystem-strip-related`, viena tyli eilutė, ne antras CTA.
4. `#community` yra ta pati ašis. H2, vienas sakinys, vienas mygtukas. Kontūrinis mygtukas lieka (ne auksinis). Jis lygiuojamas į kairę, ne į centrą.
5. `footer` teisinės eilutės eina po 1px skyriaus: versija, entity, email, adresas, copyright. Šriftas `--font-size-small`, spalva `--color-text-secondary`, kairė. Entity sakinio žodžiai nekeičiami. `promptanatomy.app` nuoroda lieka ink.
6. [STYLEGUIDE.md](STYLEGUIDE.md) §0.3 lentelės eilutė `surface-page / open` perrašoma taip: ecosystem, footer ir community yra atviras paviršius su viena kaire ašimi, ink nuorodomis ir vienu kontūriniu community mygtuku. Atviras paviršius nereiškia centruoto teksto ir naršyklės numatytosios nuorodos. Versijos numeris vis dar 1.6.2, kol neiteracija 7. Šita pastraipa yra išimtis: ji keičiasi kartu su kodu, nes kitaip gidas vėl pasirašys seną kadrą.

### Ko neliesti

- Entity sakinio prasmė ir UTM ant `promptanatomy.app`.
- Adreso tekstas, email `info@promptanatomy.app`, Privacy href `/en/privacy/`.
- Telegram URL `https://t.me/prompt_anatomy`.
- Leader URL ir žodis „Related“.
- `removeEl` workbook valymas (§1).
- Pašto ar Telegramo negrąžinti į `#ecosystem-strip`.

### Vartai

- 1024: trys blokai kairėje, viena ašis su puslapio tekstu. Nėra centruoto adreso stulpelio.
- Metodologijos nuoroda: viena, ink, pabraukta. Community mygtukas: vienas, kontūras, ne auksas.
- `tests/e2e/smoke.spec.js` `.ecosystem-strip-list li` count lieka 1.
- 320: nėra horizontalaus overflow.

### Dokumentai

- STYLEGUIDE §0.3, kaip aukščiau.
- [AGENTS.md](AGENTS.md) §10.20 lieka teisingas (demotion). Pridėti vieną sakinį: demotion yra tyli eilutė kairėje, ne centruotas katalogas. Versijos numeris AGENTS keliamas tik jei Orchestrator taip numeruoja; šitam PR pakanka sakinio.
- [CHANGELOG.md](CHANGELOG.md) `[UI]`.
- Visual baseline `en-ecosystem-*`, `en-community-*`, `footer.footer`.

---

## 10. Iteracija 7 — vartai, kad kitas praėjimas nepasirašytų to paties

**Tikslas.** Pikselių baseline nebegali pavadinti sulūžusios kompozicijos praėjimu. DS numeris kyla tik dabar.

### Ekranas

Iteracijos 2–6 jau gyvos `/en/`. Šita iteracija nekeičia piešinio, nebent testas pagauna nuokrypį. Tada grąžtama į tą iteraciją, ne „pataisoma teste“.

### Ką keisti

1. [STYLEGUIDE.md](STYLEGUIDE.md) antraštė ir §0: **1.7.0**. §0.4 hero, storefront, katalogas ir pabaiga atitinka iteracijas 2–6. Data = merge diena.
2. [tests/design-system-smoke.test.js](tests/design-system-smoke.test.js) ir [tests/structure.test.js](tests/structure.test.js):
   - EN built HTML Complete kaina naudoja `pdf-card-compare`, ne `pdf-card-was`.
   - Atšaukta 2026-10-17. `.cb-pro-teaser a` bloko `components.css` nebėra. Smoke draudžia `.cb-pro-teaser` ir `.cb-tips`.
   - `.pdf-card-tier` neturi `background: var(--color-brand-dark)`.
   - `.footer` `components.css` turi `text-align: start`.
3. `.lang-switcher` assert lieka. Jo nešalinti „kaip likučio“.
4. `npm run test:visual` baseline atnaujinami vieną kartą, po 2–6, su `--update-snapshots`, ir tik tie PNG, kurių sekcija pasikeitė. [docs/visual/2026-10-15-en-visual.md](docs/visual/2026-10-15-en-visual.md) viršuje įrašoma: tai pikselių praėjimas, ne kompozicijos. Kompozicijos šaltinis yra šis epikas. Naujas findings failas `docs/visual/YYYY-MM-DD-en-composition.md` parašo, kad fold, storefront, katalogas ir pabaiga atitinka iteracijų vartus. Nenurodyti „16 passed“ kaip įrodymo, kad vaizdas tinkamas siųsti.
5. [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) DS nuoroda iš 1.6.2 į 1.7.0. `.cursorrules` antspaudas ir [AGENTS.md](AGENTS.md) antraštė, jei jie rašo 1.6.2 kaip gyvą DS.
6. `npm test`. LT diff tuščias. R1 checkbox [todo.md](todo.md) nepažymimas done.

### Ko neliesti

- Stripe, Blob, webhook, kainos.
- `tests/visual` neįtraukiamas į `npm test` ir CI. Jis lieka rankinis, Windows baseline.
- Šablono migracija.

### Vartai

- `npm test` žalias.
- Naujas composition findings failas egzistuoja ir nesako „pikseliai sutapo, vadinasi gerai“.
- STYLEGUIDE versija 1.7.0 sutampa su [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) ir `.cursorrules` antspaudu.
- Gyvas `/en/` patikrinimas naršyklėje: 1440 ir 390. Hero CTA, brief be baltos skylės, dvi kortelės vienoje linijoje, katalogas atskirtas nuo Copy tips, pabaiga kairėje. Tai daroma prieš merge, ne screenshot testu vietoje akių.

### Dokumentai

- [CHANGELOG.md](CHANGELOG.md) `[UI]` + `[Docs]`: DS 1.7.0, kompozicijos vartai. Vis dar `## [Unreleased]`, kol Orchestrator nekelia SemVer.
- Šio epiko statusas viršuje keičiamas į „2–6 kode, vartai 7 uždaryti“ su data. Failas netrinamas.

---

## 12. Iteracija 8 — kelias, ne antra instrukcija

**Tikslas.** Antra skaidrė nekartoja hero sakinio. Vienas startas, matomi trumpų sąrašų variantai, žingsnis rodo užpildymą.

### Ką keisti

1. Nėra `.cb-eyebrow`, `.cb-lead`, `#cbSampleBtn`.
2. Pakeista iteracijoje 9. `presetsLabel` yra **Try an example**. Pasirinktas presetas yra rašalo užpildas, ne kraštas ir ne auksas.
3. Kiekvienas 3 arba 5 variantų selectas turi matomą `.cb-choice` eilę. Selectas lieka `id` ir `data-cb-field`.
4. Pakeista iteracijoje 9. `.cb-step.is-complete` yra rašalo tekstas skaidriame takelyje. `.is-active` lieka auksinis kraštas.

### Ko neliesti

- Laukų `id`, žingsnių ID, ChatGPT ir Ideogram, Copy auksas, scena, `/lt/`.
- STYLEGUIDE versija ir SemVer.

---

## 13. Iteracija 9 — trys lygiai, po vieną

**Tikslas.** Startas, vieta ir atsakymas nebeatrodo kaip ta pati balta kortelė.

### Ką keisti

1. `.cb-steps` yra vienas takelis, trys lygūs segmentai. Tuščias ir užpildytas segmentas neturi savo kortelės. Einamasis turi baltą foną ir aukso kraštą.
2. **Try an example** stovi virš trijų lygių langelių. Pasirinktas langelis užsipildo rašalu, tekstas baltas. Pakeista iteracijoje 10.
3. Trijų variantų eilė yra trys lygūs langeliai. Penkių variantų eilė yra du stulpeliai, penktas per visą plotį. Pasirinktas atsakymas užsipildo rašalu, tekstas baltas. Pakeista iteracijoje 10.
4. Kiekvienas lygis pamatuotas naršyklėje prieš liečiant kitą. Copy lieka vienintelis auksinis užpildas.

### Ko neliesti

- Laukų `id`, žingsnių ID, ChatGPT ir Ideogram, scena, `/lt/`.
- STYLEGUIDE versija ir SemVer.

---

## Iteracija 10 — tylesnis atsakymas, paskui kraštai

**Tikslas.** Pasirinktas atsakymas nebeužgožia einamojo žingsnio. Kainų kortelė dalijasi builderio kiautu.

### Ką keisti

1. Pasirinktas atsakymas yra smėlis, rašalo kraštas ir 6 px rašalo skritulys. Užpildas ne rašalas.
2. Einamasis žingsnis yra 2 px aukso kraštas, baltas fonas, elevation-1. Užbaigtas segmentas lieka skaidrus.
3. Pasirinktas presetas yra tas pats smėlis be skritulio, 14 px. Atsakymas lieka su skrituliu.
4. Penktas variantas yra vieno stulpelio pločio. Ilga etiketė lūžta langelio viduje.
5. Brief readiness yra viena eilutė be savo rėmelio. Lygiai (weak / medium / good / premium) lieka.
6. Nuo 900 px `#pdf-storefront` ištrauktas per `--shell-pad`, `max-width: none`. Auksinės briaunos kainų kortelei nėra.

### Ko neliesti

- Laukų `id`, žingsnių ID, ChatGPT ir Ideogram, Copy auksinis užpildas, `.creative-brief` kairioji aukso briauna, `/lt/`.
- STYLEGUIDE versija ir SemVer. R1 lieka atidarytas.

---

## 11. Darbo tvarka

```text
1 likučiai (compare klasė, teaser a, vienas .header)
    → 2 hero scena
        → 3 brief viena kortelė
            → 4 storefront eilutės
                → 5 pro katalogas
                    → 6 pabaiga kairėje
                        → 7 DS 1.7.0 ir testai
```

Viena iteracija = vienas PR. PR antraštėje yra iteracijos numeris. Kitas PR neprasideda, kol šio vartai nepraeina `npm test` ir, jei pikseliai pajuda, atnaujintu tos sekcijos baseline.

Jei iteracijos viduje paaiškėja, kad inline taisyklė iš §4 vis dar laimi, ji perrašoma `components.css`, ne trinama iš `<style>`. Trynimas yra kitas epikas.
