# Deployment – DI Promptų Biblioteka

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

---

## 0. Du deploy taikiniai (primary + mirror)

| Vaidmuo | URL | Platforma | `BASE_PATH` | Build artefaktas | Workflow |
|---------|-----|-----------|-------------|------------------|----------|
| **Primary** | `https://promptanatomy.space` | **Vercel** | `''` (tuščia) | `public/` (per `scripts/vercel-export-public.js`) | Vercel auto-deploy iš `main` |
| **Mirror** | `https://ditreneris.github.io/cmo/` | **GitHub Pages** | `/cmo` | repo šaknis (`path: .`) | [.github/workflows/deploy.yml](.github/workflows/deploy.yml) |

Abu taikiniai dirba kartu: kodas / testai / canonical / hreflang **default**'ai derinami su primary; mirror aktyvuojamas per env override.

**SEO šaltinis tiesai:** primary (`promptanatomy.space`) – canonical/hreflang/sitemap'e. Mirror egzistuoja kaip backup ir backward-compat (senos nuorodos į `/cmo` srautai).

---

## 1. Primary – Vercel (`promptanatomy.space`)

### Build

```bash
npm install
npm run build
```

`npm run build` (žr. [package.json](package.json)) atlieka:

1. `scripts/generate-og.js` → `og.png` (1200×630).
2. `scripts/build-locale-pages.js` → `lt/index.html`, `en/index.html`, `js/en-prompt-bodies-inline.js` (su default `BASE_PATH=''`).
3. `scripts/vercel-export-public.js` → `public/` (visi statiniai assets + `@vercel/analytics` snippet'as įterpiamas tik į `public/` HTML, ne į repo šaltinį).

### Vercel konfigūracija

- **Framework preset:** None / Other (static).
- **Build command:** `npm run build`.
- **Output directory:** `public`.
- **Install command:** `npm install`.
- **Environment:** `BASE_PATH` neapibrėžta (default `''`), `SITE_ORIGIN=https://promptanatomy.space` (default).

**Analytics:** `@vercel/analytics` snippet'as įterpiamas į `public/` HTML failus tik per export skriptą; norint matyti duomenis – įjungti Web Analytics Vercel dashboard'e.

### Deploy

- `git push origin main` → Vercel automatiškai paleidžia build + deploy.
- Rankinis: Vercel dashboard → Deployments → Redeploy.

---

## 2. Mirror – GitHub Pages (`ditreneris.github.io/cmo`)

### Šaltas deploy (tuščia repo, pirmas push)

1. **GitHub:** repozitorija [DITreneris/cmo](https://github.com/DITreneris/cmo) turi būti sukurta.
2. **Lokaliai:**
   ```bash
   npm install
   npm test
   git remote add cmo https://github.com/DITreneris/cmo.git
   git push -u cmo main
   ```
3. **GitHub (repo cmo):** Settings → Pages → **Source: GitHub Actions**.
4. Po push paleidžiamas [.github/workflows/deploy.yml](.github/workflows/deploy.yml): `npm test` → `npm run build` su `BASE_PATH=/cmo` → upload `path: .` artefaktas → publish į Pages.

### Vėlesni deploy

- `git push cmo main` automatiškai paleidžia testus ir deploy.
- Rankinis: GitHub Actions → workflow „Deploy to GitHub Pages" → Run workflow.

### Workflow env override (kaip dokumentuoti mirror canonical/hreflang)

Šiuo metu [.github/workflows/deploy.yml](.github/workflows/deploy.yml) build žingsnyje turi:

```yaml
env:
  BASE_PATH: ''
  SITE_ORIGIN: 'https://promptanatomy.space'
```

**Pastaba:** Jei norima, kad mirror'o HTML turėtų canonical/hreflang `https://ditreneris.github.io/cmo/...`, šios env reikšmes pakeisti į `BASE_PATH: '/cmo'` ir `SITE_ORIGIN: 'https://ditreneris.github.io'`. Dabartinė konfigūracija duoda primary canonical net ant mirror, kas SEO atžvilgiu nukreipia kreditą į `promptanatomy.space` – tai sąmoningas sprendimas. Mirror naudojamas kaip backup.

---

## 3. Lokalus QA prieš deploy

```bash
npm install
npm test
```

`npm test` = build (`lt/en` + `public/`) + struktūra (96+ teiginiai) + design-system smoke + a11y smoke + `lint:html` + `lint:js`.

### A11y testavimas lokaliai

```bash
npx serve -s . -l 3000
# Kitoje terminale:
npx pa11y http://localhost:3000/lt/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/en/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/lt/privatumas.html --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/en/privacy.html --standard WCAG2AA --ignore "warning"
```

CI automatiškai atlieka tuos pačius pa11y patikrinimus per [.github/workflows/ci.yml](.github/workflows/ci.yml).

---

## 4. Po deploy – gyvas testavimas

- Atlikti gyvą testavimą pagal [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) **abiems** URL (primary + mirror, jei naudojamas).
- Rezultatus įrašyti į testavimo žurnalą.

---

## 5. Troubleshooting

| Problema | Sprendimas |
|----------|------------|
| **Vercel build fail** | `npm run build` lokaliai; pažiūrėti, kuris žingsnis krenta (`generate-og`, `build-locale-pages`, `vercel-export-public`). Daugiausiai – build skripto `EN replacement safety check` (žr. [scripts/build-locale-pages.js](scripts/build-locale-pages.js)). |
| **Vercel: „No Output Directory named `public`"** | `package.json` `build` skriptas turi įtraukti `vercel-export-public.js`. Patikrinti `npm run build` lokaliai – `public/` privalo atsirasti. |
| **GitHub Pages 404** | Settings → Pages → Source: **GitHub Actions** (ne „Deploy from branch"). |
| **Deploy workflow failed (test job)** | Lokaliai paleisti `npm test`. |
| **CI workflow failed (pa11y)** | Lokaliai: `npx serve -s . -l 3000` + `npx pa11y http://localhost:3000/lt/ --standard WCAG2AA`. |
| **pa11y: No usable sandbox** (CI) | `.pa11yrc.json` turi `--no-sandbox` Chrome args. Jei vis tiek krenta – patikrinti workflow. |
| **Mirror rodo seną canonical** | Patikrinti [.github/workflows/deploy.yml](.github/workflows/deploy.yml) `env` (`BASE_PATH`, `SITE_ORIGIN`). Žr. §2 pastabą. |

---

## 6. Susiję dokumentai

- [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) – QA standartas (nuoroda į spinoff01)
- [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) – gyvo testavimo scenarijai
- [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) – kodo kontraktas, BASE_PATH paaiškinimas
- [AGENTS.md](AGENTS.md) – release ir QA procesas
- [CHANGELOG.md](CHANGELOG.md) – versijų istorija
