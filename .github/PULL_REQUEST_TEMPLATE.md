## Pakeitimų aprašymas

<!-- Trumpai aprašykite, ką keičiate ir kodėl -->

## Agentas / Tipas

<!-- Pažymėkite, kuris agentas arba commit tipas pritaikomas -->

- [ ] `[Content]` – turinio pakeitimai
- [ ] `[Curriculum]` – struktūros/sekos pakeitimai
- [ ] `[UI]` – dizainas, UX, prieinamumas
- [ ] `[QA]` – testai, validacija, klaidų taisymas
- [ ] `[Orchestrator]` – koordinacija, konfigūracija
- [ ] `[Feature]` – nauja funkcija
- [ ] `[Fix]` – klaidos taisymas
- [ ] `[Docs]` – dokumentacijos pakeitimai
- [ ] `[Refactor]` – kodo refactoring
- [ ] `[Commerce]` – mokama PDF tarpinė (EN-only)
- [ ] `[Chore]` – build, config
- [ ] Locale: pakeitimai tik EN kanonui (LT nekeista / snapshot refresh scope)

## Ambition (roadmap.md PR rule)

- [ ] **A** — R1 cash register (Stripe / fulfillment)
- [ ] **E** — R2 GEO on `/en/`
- [ ] **B** — R3 one more local tool
- [ ] **C** — R4 Install depth
- [ ] **Parked** — docs/hygiene / R1-support; not R1 exit; not F/D

## Kaip testuota

<!-- Kaip patikrinote, kad pakeitimai veikia -->

- [ ] Lokaliai paleistas ir patikrintas
- [ ] Lint/test komandos praeina
- [ ] Naršyklėse patikrinta (Chrome / Firefox / Safari / Edge)
- [ ] Mobile responsive patikrintas

## Susiję dokumentai

<!-- Inventorius ir kada ką atnaujinti: docs/DOCUMENTATION.md; greita navigacija: docs/INDEX.md -->

- [ ] Dokumentacija atnaujinta pagal pakeitimus (žr. [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md))
- [ ] Jei release – CHANGELOG.md ir package.json versija (SemVer)
- [ ] Locale politika: EN kanonas; LT diff tik jei sąmoningas snapshot refresh ([MULTILINGUAL_STRUCTURE.md §0](docs/MULTILINGUAL_STRUCTURE.md))

---

Žr. [docs/INDEX.md](docs/INDEX.md) (indeksas), [AGENTS.md](AGENTS.md) (agentai), [.cursorrules](.cursorrules) (taisyklės), [docs/LEGACY_GOLDEN_STANDARD.md](docs/LEGACY_GOLDEN_STANDARD.md) (struktūros kontraktas).
