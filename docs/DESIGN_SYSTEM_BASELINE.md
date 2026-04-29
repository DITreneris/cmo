# Design System Baseline Audit

Data: 2026-04-29

## Scope
- `index.html`
- `lt/index.html`
- `en/index.html`
- `scripts/build-locale-pages.js`

## Baseline findings
- Vienas didelis `<style>` blokas (`index.html`) sujungia tokenus, komponentus ir utility taisykles.
- Prieš refaktorių interakcijos naudojo inline `onclick`/`onkeydown`, todėl buvo sunkiau testuoti.
- LT/EN puslapiai generuojami iš root ir turi locale replacement pipeline.
- Nebuvo dedikuoto dizaino tokenų failo, todėl dokumentacija ir kodas galėjo išsiskirti.

## Refactor decisions
- Įvesti vieną tokenų šaltinį: `styles/design-tokens.json`.
- Įvesti CSS sluoksnius:
  - `styles/tokens.css`
  - `styles/components.css`
  - `styles/utilities.css`
- Perkelti promptų interakcijas į centralizuotą `addEventListener` bindinimą.
- Įtraukti smoke kokybės vartus:
  - `tests/design-system-smoke.test.js`
  - `tests/a11y-smoke.test.js`

## Acceptance checkpoints
- Root ir locale puslapiai importuoja tą patį CSS sluoksnių rinkinį.
- Markup nenaudoja inline event handlerių.
- Build skriptas validuoja kritinius dizaino sistemos fragmentus locale išvestyse.
