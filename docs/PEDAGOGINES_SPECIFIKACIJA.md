# Pedagoginė specifikacija – promptų draugiškumas ir paprasta kalba

**Versija:** 1.0  
**Data:** 2026-02-19  
**Tikslas:** Nustatyti pedagoginius tikslus, auditoriją, terminologiją ir „paprastos kalbos“ kriterijus, kad Content Agent galėtų vienodai perrašyti turinį.

---

## 1. Pedagoginiai tikslai

- Vartotojas **iš karto supranta**, ką gaus ir ką daryti – be gilinimosi į žargoną.
- Kiekvienas promptas atsako į **„Ką aš iš to turiu?“** – aiškūs naudos sakiniai (info-bokse arba aprašyme).
- Seka 1→10 palaiko **mokymosi logiką**: Pradžia (lengviau) → Įgūdžiai → Plėtra → Viskas kartu (10. Pagrindinis promptas).
- **Vienas aiškus veiksmas** per promptą; laiko signalas (~X min) išlaikomas; vienas suprantamas CTA.

---

## 2. Auditorija

- **Pagrindinė:** Rinkodaros praktikai – įskaitant **pradedančiuosius** (nauji AI įrankiams, norintys turinio sistemos).
- **Antrinė:** Patyrę rinkodaros specialistai, ieškantys paruoštų promptų šablonų.
- Kalba: **lietuvių** (vartotojui matomas tekstas); promptų `<pre>` gali būti LT arba EN pagal užsakovo poreikį.

---

## 3. Kalbos ir tono kriterijai („paprasta kalba pirmiausia“)

| Kriterijus | Reikalavimas |
|------------|--------------|
| **Kreipinys** | Tu-forma: tavo, tau, tu, atlikai, naudojai, gausi, galėsi. |
| **Sakiniai** | Trumpi, lakoniški; vengti ilgų, sudėtingų periodų. |
| **Tonas** | Motyvacinė, palaikanti – skatina veikti, bet be patetikos. |
| **Terminologija** | Vartotojui matomas tekstas (antraštės, aprašymai, objectives, instrukcijos, info-boksai) – lietuviškai arba su trumpu paaiškinimu vietoje. Promptų `<pre>` viduje terminus galima palikti, jei glosarėje arba info-bokse paaiškinta. |

---

## 4. Priimtina terminologija ir paaiškinimai

Žodynėlyje (instrukcijų sekcijoje) ir info-boksuose naudoti šiuos atitikmenis / paaiškinimus:

| Terminas | Vartotojui matomame tekste | Pastaba |
|----------|----------------------------|---------|
| Unikalus pardavimo pasiūlymas | (anksčiau USP) – kuo skiriesi nuo kitų | Jau yra žodynėlyje |
| CTA | Kvietimas veikti (pvz. „Parašyk“, „Parsisiųsk“) | Jau yra |
| Matavimo rodikliai | (anksčiau KPI) – pvz. paspaudimai, konversijos | Jau yra |
| hook | Pirmoji frazė, traukianti dėmesį | Pridėti į žodynėlį |
| CTR | Paspaudimų santykis | Pridėti |
| reach | Pasiekiamumas | Pridėti |
| B2B | Verslas su verslu | Pridėti arba (verslas su verslu) prie pirmo paminėjimo |
| lead / lead'ai | Potencialūs klientai | Pakeisti visur vartotojui matomame tekste |
| lead magnet / lead generator | Lead generator (šioje aplikacijoje paliekame) | – |
| objection | Prieštaravimas | Pakeisti |
| case study / case'ai | Kliento istorija / klientų istorijos | Pakeisti |
| takeaways | Pagrindinės mintys | Pakeisti |
| repurpose | Vienos idėjos daug formatų | Pakeisti arba paaiškinti |
| Short-form | Trumpas formatas (vaizdo) | Pakeisti |
| scroll | Slinkimas (peržvalgymas) | Pakeisti „scroll'inimą“ → „slinkimą“ |
| topical cluster | Temų grupė (pagrindinė tema + subtemos); žodyne nenaudojame „pillar“ | – |
| CMO | Vyresnysis rinkodaros vadovas | Pakeisti arba „CMO (vyresnysis rinkodaros vadovas)“ |
| MASTER PROMPT | Pagrindinis promptas (valdymo centras) | Pakeisti next-steps ir ten, kur rodoma |
| Carousel outline | Karuselės struktūra (LinkedIn) | Promptų OUTPUT – galima lietuviškai |
| Landing hero | Titulinio ekrano tekstas | Promptų OUTPUT – galima lietuviškai |
| localStorage | Naršyklės vietinė atmintinė | Privatumas – pridėti skliaustuose |

---

## 5. Vartotojo kelionė (žingsniai)

1. **Atėjimas** → Hero („ką gausi per 45 min“) → „Ką realiai gausi“ (konkretūs naudos punktai).
2. **Instrukcijos** – ~3–5 min per žingsnį; žodynėlis (unikalus pardavimo pasiūlymas, raginimas veikti, matavimo rodikliai ir kt. pagal poreikį). Aiškus pirmas žingsnis: „Pasirink pirmą promptą ir nukopijuok.“
3. **Progresas** (0/10) → eina per promptus 1–10. Kiekvienas: aiški antraštė, paprastas aprašymas, promptas (kopijuoti), info-boksas („kodėl tai naudinga“), vienas CTA + „Pažymėjau kaip atlikau“.
4. **Kas toliau?** – nuorodos į promptus; bendruomenė; footer su priminimu pakeisti [auditorija], [galvos skausmas] ir kt.

---

## 6. Seka 1–10 pagrindimas

- **1–5 (Pradžia):** 30 d. planas, viena idėja → 7 formatai, LinkedIn postas, 30 s video, Kasdienė analizė (Veikla→Sprendimas). Lengvesni, įžanginiai.
- **6–8 (Įgūdžiai):** Prieštaravimų apdorojimas, Lead generator postas + DM seka, kliento istorijos struktūra.
- **9 (Plėtra):** Temų grupė (SEO/turinio struktūra).
- **10:** Pagrindinis promptas – viskas kartu, valdymo centras.

Content Agent išlaiko šią seką ir kategorijas; keičia tik tekstus pagal šią specifikaciją ir [docs/LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) (leidžiami tekstiniai laukai be struktūros keitimo).

---

## 7. Susiję dokumentai

- [LEGACY_GOLDEN_STANDARD.md](LEGACY_GOLDEN_STANDARD.md) – struktūra ir ID nekeičiami; keičiamas tik turinys (tekstai)
- [MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) – LT/EN keliai ir sinchronizacija
- [.cursorrules](../.cursorrules) – Tu, lakoniškai, palaikantis tonas
