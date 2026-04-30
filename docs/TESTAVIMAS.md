# Gyvo testavimo dokumentacija

**QA standartas:** [DITreneris/spinoff01](https://github.com/DITreneris/spinoff01)  
**Deploy:** žr. [DEPLOYMENT.md](../DEPLOYMENT.md)

Po kiekvieno deploy atlikti gyvą testavimą ir rezultatus įrašyti čia (arba nuoroda į atskirą žurnalą).

---

## 1. Testavimo aplinka

| Laukas | Reikšmė |
|--------|--------|
| Production URL | https://ditreneris.github.io/cmo/ |
| Naršyklė(ės) | Chrome, Firefox, Safari, Edge |
| Mobilus | iOS Safari / Chrome Mobile (pasirinktinai) |

---

## 2. Scenarijai (checklist)

### Funkcionalumas

- [ ] **Kopijavimas:** Visi 10 promptų – pasirinkti → „Kopijuoti promptą“ → įklijuoti į DI (pvz. ChatGPT) – tekstas teisingas.
- [ ] **Progresas:** „Pažymėjau kaip atlikau“ – varnelė įrašoma; perkrovus puslapį – progresas išsaugotas (localStorage).
- [ ] **Skip link:** Tab iki „Praleisti į turinį“ – Enter – fokusas pereina į pagrindinį turinį.
- [ ] **Privatumas:** Veikia `lt/privatumas.html` ir `en/privacy.html`; rodomos teisingos canonical/hreflang žymos.

### Prieinamumas (a11y)

- [ ] **Klaviatūra:** Navigacija Tab, Enter, Esc – veikia be įstrigimo.
- [ ] **Focus:** Matomas focus (pvz. focus-visible) ant mygtukų ir nuorodų.
- [ ] **Pa11y:** CI jau bėga; pasirinktinai lokaliai: `npx pa11y <production-url>/ --standard WCAG2AA --ignore "warning"`.

### Responsive / naršyklės

- [ ] **Desktop:** Veikia Chrome / Firefox / Edge (arba Safari).
- [ ] **Mobilus:** Veikia vienoje iš: iOS Safari, Chrome Mobile (layoutas, mygtukai, kopijavimas).

### Turinio / bullet-proof (META, INPUT, OUTPUT)

- [ ] **Struktūra:** Kiekvienas iš 8 promptų turi aiškius META, INPUT, OUTPUT blokus (kopijuojamas tekstas).
- [ ] **Copyable:** Į darbinių atmintinę kopijuojamas tik META+INPUT+OUTPUT; instrukcijos (Naudok kai, Pakeisk prieš naudodamas, Ką daryti) rodomos atskirame bloke „Prieš naudojant“ ir nekopijuojamos.
- [ ] **Instrukcijos:** „Kaip naudoti“ ir footer aiškina: [ĮMONĖ]/[MANO ROLĖ] keisti; DI rolės keisti nereikia.
- [ ] **Turinio patikra:** Nukopijuoti 1–2 promptus, įklijuoti – įklijuotas tekstas tik META+INPUT+OUTPUT (žr. [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md)).

### Kiti

- [ ] Nėra console klaidų atidarius puslapį ir atlikus kopijavimą.
- [ ] Nuorodos nepalūžusios (pagrindinis, privatumas).

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

### Pavyzdys

```markdown
## 2026-02-18 – pirmas deploy

- **Testeris:** QA
- **URL:** https://ditreneris.github.io/cmo/
- **Naršyklė:** Chrome (desktop)
- **Rezultatas:** ✅ Kopijavimas, progresas, skip link, privatumas – OK. Console be klaidų.
- **Pastabos:** A11y tikrinta per CI (pa11y). Mobilus – planuojama kitame cikle.
```

---

## 4. Susiję

- [BULLET_PROOF_PROMPTS.md](BULLET_PROOF_PROMPTS.md) – promptų kokybės standartas (META/INPUT/OUTPUT, bullet-proof)
- [QA_STANDARTAS.md](QA_STANDARTAS.md) – QA kriterijai ir nuoroda į spinoff01  
- [DEPLOYMENT.md](../DEPLOYMENT.md) – kaip deploy ir kad po deploy būtų testuojama gyvai  

**Paskutinis atnaujinimas:** 2026-02-18
