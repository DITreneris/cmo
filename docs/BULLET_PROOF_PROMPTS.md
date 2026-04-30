# Bullet-proof promptų standartas

**Tikslas:** Kiekvienas promptas veikia savarankiškai – vartotojas supranta, ką įrašyti, kur ir ką gauti, net jei neskaito „Kaip naudoti“ ar kitų instrukcijų.

**Susiję:** [AGENTS.md](../AGENTS.md), [DOCUMENTATION.md](DOCUMENTATION.md), [QA_STANDARTAS.md](QA_STANDARTAS.md).

---

## 1. Struktūra: META, INPUT, OUTPUT

Vienoda trijų blokų struktūra kiekvienam promptui:

| Blokas | Paskirtis | Pavyzdys |
|--------|-----------|----------|
| **META** | DI rolė + tikslas. Aiški formuluotė „Tu esi X. Tikslas: Y.“ (ne „Rolė – X“). | *Tu esi kritiškas verslo analitikas. Tikslas: išsiaiškinti, ką DI tikrai žino apie organizaciją.* |
| **INPUT** | Vartotojo pildomi laukai: [ĮMONĖ], [MANO ROLĖ]. + „Pakeisk prieš naudodamas:“ su paaiškinimais ir pavyzdžiais. | *[ĮMONĖ] → tavo arba kliento įmonė (pvz. Telia Lietuva). [MANO ROLĖ] → tavo pareigos (pvz. Pardavimų vadovas).* |
| **OUTPUT** | Konkretus rezultatas: formatas, apimtis, kalba/tonas. „Rezultatas:“ – ką vartotojas gaus. | *Rezultatas: trumpas struktūruotas atsakymas (1–3) ir pažymėtos vietos, kurioms reikia patikslinimo.* |

**Kodėl:** KISS – vienodas skaitymas; vartotojas iš karto mato, ką įrašyti (INPUT) ir ką gauti (OUTPUT), be priklausomybės nuo instrukcijų viršuje.

**UI:** Į darbinių atmintinę kopijuojamas tik META+INPUT+OUTPUT. Instrukcijos (Naudok kai, Pakeisk prieš naudodamas, Ką daryti) rodomos atskirame bloke „Prieš naudojant“ po code-block ir nekopijuojamos.

---

## 2. Reikalavimai kiekvienam promptui

### 2.1 Aiški DI rolė (META)

- Vengti: *Rolė – organizacijų dizaino konsultantas.*
- Naudoti: *Tu esi organizacijų dizaino konsultantas.* arba *Veik kaip organizacijų dizaino konsultantas.*

### 2.2 Aiškūs keičiamieji laukai (INPUT)

- Kiekvienas promptas, kuriame yra [ĮMONĖ] arba [MANO ROLĖ], turi bloką **Pakeisk prieš naudodamas:**
  - [ĮMONĖ] → tavo arba kliento įmonė (pvz. Telia Lietuva)
  - [MANO ROLĖ] → tavo pareigos (pvz. Pardavimų vadovas)

### 2.3 Jokios dviprasmybės dėl rolės

- DI rolė (kas atsako) ≠ vartotojo rolė (pareigos organizacijoje).
- Struktūra: *Tu esi [DI rolė]. [Užduotis su] rolę [MANO ROLĖ] įmonėje [ĮMONĖ].*

### 2.4 Nepriklausomumas nuo instrukcijų

- Promptas suprantamas net jei vartotojas nematė „Kaip naudoti šią biblioteką“ ar žingsnių aprašymo.

### 2.5 Aiškus rezultato pažadas (OUTPUT)

- Vartotojas iš karto supranta, ką gaus. Pvz.: *Rezultatas: gausi aiškų rolės aprašymą, kurį galėsi naudoti kaip atskaitos tašką.*

### 2.6 Aiški vartotojo užduotis

- Naudoti formuluotes: *Nukopijuok šį tekstą ir įklijuok į ChatGPT arba Claude. Pakeisk [ĮMONĖ] ir [MANO ROLĖ].* (pirmame prompte – „Tai nėra klausimynas.“)

### 2.7 Minimalus interpretavimo poreikis

- Vartotojas neturi spėlioti: ką reiškia [MANO ROLĖ], kokią įmonę įrašyti, ar rolė jau įrašyta.

---

## 3. „Naudok kai“ taksonomija (8 promptai)

| Nr | Promptas | Naudok kai |
|----|----------|------------|
| 1 | DI Konteksto Patikra | pradedi analizuoti organizaciją; nori patikrinti, ką DI žino apie įmonę; ruošiesi naudoti DI pagal kontekstą |
| 2 | Organizacijos Portretas | nori išsamaus organizacijos profilio; ruoši kontekstą kitiems promptams; analizuoji klientą ar partnerį |
| 3 | Mano Rolė Organizacijoje | nori suprasti savo rolę; pradedi dirbti su nauja įmone; reikia atskaitos apie pareigas |
| 4 | Pareigybės Instrukcija + KPI | reikia pareigybių aprašo; ruoši vertinimui ar naujo darbuotojo įvedimui; nori pamatuojamų KPI |
| 5 | Pagrindiniai Darbo Procesai | nori suprasti, kur dingsta laikas; optimizuoti darbo dieną; ruoši DI integracijai (žingsnis 6) |
| 6 | DI Pagalba ir Optimizavimas | jau turi procesų aprašymą (žingsnis 5); nori konkrečių DI naudojimo būdų; nori sutaupyti laiko |
| 7 | Kasdienė Promptų Biblioteka | nori asmeninių promptų; kasdieniniams darbams ir greitiems sprendimams; nori lentelės [promptas \| kada \| problema] |
| 8 | Kritinių Situacijų Simuliacija | nori pasiruošti krizėms; planuoti atsaką į spaudimą; treniruoti sprendimus su DI |

---

## 4. Dizaino principas (§9)

Projektuojama ne idealiam, o **realiam vartotojui**. Realus vartotojas: skuba, neskaito instrukcijų, kopijuoja mechaniškai, daro klaidas. Promptų biblioteka turi veikti net tokiomis sąlygomis – tai bullet-proof standartas.

---

## 5. Dokumento atnaujinimas

- **Atsakingas:** Content / QA.
- **Kada:** Po turinio ar struktūros (META/INPUT/OUTPUT, „Naudok kai“) pakeitimų.

**Paskutinis atnaujinimas:** 2026-02-24
