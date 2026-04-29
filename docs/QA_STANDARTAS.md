# QA standartas – DI Promptų Biblioteka

**Kanoninis repozitorijas organizacijos QA procesui:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)

Šis dokumentas aprašo įvestą kokybės tikrinimo (QA) standartą ir jo ryšį su spinoff01 repozitorija.

---

## 1. Tikslas

- Vienoda QA praktika visuose susijusiuose projektuose.
- Aiškūs kriterijai prieš merge ir release.
- Dokumentuotas gyvas testavimas po deploy.

---

## 2. Nuoroda į spinoff01

- **Repozitorija:** https://github.com/DITreneris/spinoff01  
- **Paskirtis:** Organizacijos QA standarto ir šablonų repozitorijas (checklistai, workflow šablonai, testavimo šablonai).  
- **Šiame projekte:** Laikomės šio dokumento ir [AGENTS.md](../AGENTS.md) QA Agent aprašymo; bendri standartai ir atnaujinimai – spinoff01.

---

## 3. QA kriterijai (šis projektas)

### Prieš kiekvieną merge / PR

- [ ] `npm test` praeina (build + struktūra + design-system smoke + a11y smoke + `lint:html` + `lint:js`).
- [ ] CI (`.github/workflows/ci.yml`) praeina – lint, testai, pa11y (WCAG2AA).
- [ ] Pakeitimams atitinka dokumentacijos atnaujinimai ([docs/DOCUMENTATION.md](DOCUMENTATION.md)).

### Prieš release

- [ ] CHANGELOG.md atnaujintas (SemVer).
- [ ] Versija atitinka pakeitimus.
- [ ] Rankinis QA: naršyklė, mobilus, kopijavimas, a11y (pagal [docs/TESTAVIMAS.md](TESTAVIMAS.md)).

### Po deploy (gyvas testavimas)

- [ ] Atliktas gyvas testavimas pagal [docs/TESTAVIMAS.md](TESTAVIMAS.md).
- [ ] Rezultatai įrašyti į testavimo žurnalą.

---

## 4. Komandos

| Komanda | Paskirtis |
|---------|-----------|
| `npm test` | Build (`lt/en`) + struktūra + design-system smoke + a11y smoke + HTML/JS lint |
| `npm run lint:html` | HTML validacija (`index.html`, `lt/index.html`, `lt/privatumas.html`, `en/index.html`, `en/privacy.html`) |
| `npm run lint:js` | ESLint |
| A11y lokaliai | `npx serve -s . -l 3000` + `npx pa11y http://localhost:3000/ --standard WCAG2AA` |

---

## 5. Susiję dokumentai

- [AGENTS.md](../AGENTS.md) – QA Agent rolė ir release seka  
- [docs/DOCUMENTATION.md](DOCUMENTATION.md) – dokumentų valdymas ir QA checklist  
- [docs/TESTAVIMAS.md](TESTAVIMAS.md) – gyvo testavimo scenarijai ir žurnalas  
- [DEPLOYMENT.md](../DEPLOYMENT.md) – deploy ir testavimas po deploy  

**Paskutinis atnaujinimas:** 2026-02-18
