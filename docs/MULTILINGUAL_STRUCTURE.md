# Daugiakalbiška struktūra (LT/EN)

**Atsakingas:** Curriculum Agent  
**Tikslas:** Path atitikmenys ir routing taisyklės – vienas šaltinis tiesiai UI/UX ir Content.

---

## 1. Puslapių atitikmenys

| LT path | EN path |
|---------|---------|
| `/lt/` (index.html – biblioteka) | `/en/` (index.html – library) |
| `/lt/privatumas.html` | `/en/privacy.html` |

- **Biblioteka:** LT = `lt/index.html`, EN = `en/index.html`.
- **Privatumas:** LT = `lt/privatumas.html`, EN = `en/privacy.html`.

---

## 2. Routing taisyklės

### Root `/`

- `index.html` yra LT bazinis šaltinis (ne redirect failas).
- `scripts/build-locale-pages.js` iš `index.html` sugeneruoja:
  - `lt/index.html`
  - `en/index.html`
- Build metu canonical/hreflang URL sudaromi iš:
  - `SITE_ORIGIN` (default: `https://ditreneris.github.io`)
  - `BASE_PATH` (default: `/cmo`)
- Deploy profile (GitHub Pages): `SITE_ORIGIN=https://ditreneris.github.io`, `BASE_PATH=/cmo`.

### Kalbos jungiklis

- Esant **LT** puslapyje `/lt/` → nuoroda į EN: `/en/` (arba `base + '/en/'`).
- Esant **LT** puslapyje `/lt/privatumas.html` → nuoroda į EN: `/en/privacy.html`.
- Esant **EN** puslapyje `/en/` → nuoroda į LT: `/lt/`.
- Esant **EN** puslapyje `/en/privacy.html` → nuoroda į LT: `/lt/privatumas.html`.

---

## 3. Path → counterpart (lentelė skriptams)

```
LT → EN:
  /lt/                 → /en/
  /lt/privatumas.html  → /en/privacy.html

EN → LT:
  /en/           → /lt/
  /en/privacy.html → /lt/privatumas.html
```

Naudoti santykinius kelius iš root (pvz. `../en/`, `../lt/`) arba su base path priklausomai nuo deploy profilio.

---

## 4. EN string sync (LT alignment)

Kai keičiami **anglų (EN)** UI tekstai (`en/index.html`, `en/privacy.html`), būtina atnaujinti atitinkamus **lietuviškus (LT)** tekstus `lt/index.html` ir `lt/privatumas.html`, kad abi kalbos būtų išlygintos.

- **Pagrindinės vietos:** hero (h1, subline, „Who it’s for“, CTA), sekcijos antraštės (objectives, instructions, progress, next steps, community, footer), mygtukai („Copy prompt“, „Mark as done“), klaidos ir toast pranešimai (JS), code-block tooltip (CSS `::before`), privacy puslapio antraštės ir nuorodos.
- **Nuoroda:** visi EN stringai inventorizuoti audite [docs/MICROCOPY_AUDIT_EN.md](MICROCOPY_AUDIT_EN.md); pakeitus EN – peržiūrėti atitikmenis LT.
