# Pedagoginė specifikacija – promptų draugiškumas ir paprasta kalba

**Versija:** 1.0  
**Data:** 2026-02-19  
**Tikslas:** Nustatyti pedagoginius tikslus, auditoriją, terminologiją ir „paprastos kalbos“ kriterijus, kad Content Agent galėtų vienodai perrašyti turinį.

---

## 1. Pedagoginiai tikslai

- Vartotojas **iš karto supranta**, ką gaus ir ką daryti – be gilinimosi į žargoną.
- Kiekvienas promptas atsako į **„Ką aš iš to turiu?“** – aiškūs naudos sakiniai (info-bokse arba aprašyme).
- **Free spine** 1→2→3→5 (Plan → Create → Check → Improve) palaiko pirmą ciklą naršyklėje. Pilna seka **1→10** yra Pro/PDF mokymosi gylis, ne free interactive.
- **Vienas aiškus veiksmas** per promptą; laiko signalas (~X min) išlaikomas; vienas suprantamas CTA.

---

## 2. Auditorija

- **Pagrindinė:** Rinkodaros praktikai (EN kanonas – tarptautinė auditorija).
- **Antrinė:** Patyrę rinkodaros specialistai, ieškantys paruoštų promptų šablonų.
- **LT `/lt/`:** Užšaldyta vidinė snapshot versija testeriams – ne aktyvus turinio vystymas.
- Kalba: **anglų** vartotojui matomam produkto tekstui (kanonas `/en/`); promptų `<pre>` – EN per `data/en-prompt-bodies.json`. LT lieka build artefakte, ne roadmap.

---

## 3. Kalbos ir tono kriterijai („paprasta kalba pirmiausia“)

| Kriterijus | Reikalavimas |
|------------|--------------|
| **Kreipinys** | Tu-forma (LT docs / vidinis): tavo, tau, tu… **EN kanonas (`/en/`):** „you“ – tiesioginis, palaikantis tonas. |
| **Sakiniai** | Trumpi, lakoniški; vengti ilgų, sudėtingų periodų. |
| **Tonas** | Motyvacinė, palaikanti – skatina veikti, bet be patetikos. |
| **Terminologija** | **EN kanonas** (`/en/`): user-visible copy anglų kalba. LT docs / vidinis kreipinys – Tu-forma. Promptų `<pre>` – EN per `data/en-prompt-bodies.json`. |

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

1. **Atėjimas** → Hero **spine-first** (EN primary: Start your first workflow → `#block1`; secondary: Build a creative brief → `#creative-brief`).
2. **Kontekstas** – optional `#cmo-context` (before progress); then progress + jump.
3. **Spine** – contiguous interactive prompts **1, 2, 3, 5** (categories Plan / Create / Check / Improve). Progress 0/4.
4. **Brief (EN)** – `#creative-brief` after prompt 5 (image JTBD; not required for spine proof).
5. **Teasers** – 4, 6–10 after brief → Pro storefront (full META/INPUT/OUTPUT offline).
6. **Kas toliau?** – `#cmo-safety`, scenarios, FAQ, storefront (EN); bendruomenė; footer.

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
- [MULTILINGUAL_STRUCTURE.md](MULTILINGUAL_STRUCTURE.md) – EN kanonas, LT freeze, keliai ir build
- [.cursorrules](../.cursorrules) – Tu, lakoniškai, palaikantis tonas
