# Deployment – DI Promptų Biblioteka

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

**Production URL (šis projektas):** https://ditreneris.github.io/cmo/

**GitHub repo:** [DITreneris/cmo](https://github.com/DITreneris/cmo)

---

## Įspėjimas: į kurią repo keliama

- Šis projektas deploy'inamas į repo **cmo** → URL `https://ditreneris.github.io/cmo/`.
- Lokaliai pridėkite remote (žemiau). **Push į teisingą remote:** `git push cmo main` (arba jūsų remote vardas).
- Jei turite kelis remotes (`marketing`, `marketingas`, `spinoff01`), nepushinkite į seną **marketingas**, nebent sąmoningai palaikote du veidrodžius.

---

## 1. GitHub Pages (rekomenduojama)

### Šaltas deploy (tuščia repo, pirmas push)

1. **GitHub:** repozitorija [DITreneris/cmo](https://github.com/DITreneris/cmo) turi būti sukurta (dabar gali būti tuščia).
2. **Lokaliai** šiame kataloge:
   ```bash
   npm install
   npm test
   git remote add cmo https://github.com/DITreneris/cmo.git
   # Jei remote jau yra – naudokite: git remote set-url cmo https://github.com/DITreneris/cmo.git
   git push -u cmo main
   ```
   Jei GitHub dar rodo „empty“, pirmas push užpildo `main` su visu turiniu.
3. **GitHub (repo cmo):** **Settings** → **Pages** → **Build and deployment** → **Source:** **GitHub Actions** (ne „Deploy from a branch“, nebent sąmoningai atsisakote workflow).
4. Po pirmo push workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) paleidžiamas: `npm test` → artefakto įkėlimas → publikacija į Pages.

### Vėlesni deploy

- Kiekvienas `git push cmo main` paleidžia testus ir deploy į https://ditreneris.github.io/cmo/.

### URL

- Šis projektas: `https://ditreneris.github.io/cmo/`
- Bendrai (projekto site): `https://<org-or-username>.github.io/<repo-name>/`

Build žingsnyje naudojamas **`BASE_PATH=/cmo`**, kad nuorodos, canonical ir hreflang atitiktų `/cmo/lt/`, `/cmo/en/`.

### Rankinis deploy (repo cmo)

- **Actions** → workflow **Deploy to GitHub Pages** → **Run workflow** (branch: `main`).

---

## 2. Lokalus tikrinimas prieš deploy

```bash
npm install
npm test
```

A11y (pasirinktinai):

```bash
npx serve -s . -l 3000
# Kitoje terminale:
npx pa11y http://localhost:3000/lt/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/en/ --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/lt/privatumas.html --standard WCAG2AA --ignore "warning"
npx pa11y http://localhost:3000/en/privacy.html --standard WCAG2AA --ignore "warning"
```

---

## 3. Po deploy – gyvas testavimas

- Atlikti gyvą testavimą pagal [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md).
- Rezultatus įrašyti į testavimo žurnalą (tame pačiame faile arba susietame).

---

## 4. Troubleshooting

| Problema | Sprendimas |
|----------|------------|
| Pages rodo 404 | Patikrinti, ar Settings → Pages šaltinis = **GitHub Actions**. |
| Workflow nepaleidžiamas | Patikrinti, ar failas `.github/workflows/deploy.yml` yra `main` šakoje. |
| **Deploy workflow failed** | Actions → atidaryti nepavykusį run → žiūrėti **test** job: jei nepraėjo `npm test`, lokaliai paleisti `npm test` ir taisyti; jei nepraėjo **deploy** job – tikrinti environment/permissions. |
| **CI workflow failed** | Dažniausiai `pa11y` (a11y klaidos) arba `npm test`. Lokaliai: `npm test`, tada `npx serve -s . -l 3000` ir `npx pa11y http://localhost:3000/ --standard WCAG2AA`. |
| **pa11y: No usable sandbox** (CI) | `pa11y` yra privalomas CI žingsnis. Jei CI aplinkoje krenta dėl Chromium/sandbox, sutvarkyti launch args arba paleisti papildomą diagnostiką lokaliai (`npx serve -s . -l 3000` + `npx pa11y ...`) ir tik tada kartoti workflow. |
| Svetainė tuščia / neteisingas kelias | Projektas – statinis iš root; `path: .` – teisingas. Jei naudojate subfolderį, pakeisti `path`. |

---

## 5. Susiję dokumentai

- [docs/QA_STANDARTAS.md](docs/QA_STANDARTAS.md) – QA standartas (nuoroda į spinoff01)
- [docs/TESTAVIMAS.md](docs/TESTAVIMAS.md) – gyvo testavimo dokumentacija
- [AGENTS.md](AGENTS.md) – release ir QA procesas
