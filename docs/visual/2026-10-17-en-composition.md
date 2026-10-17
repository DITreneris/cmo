# EN composition — 2026-10-17

Source: [design_system_epic.md](../../design_system_epic.md). This note records the composition gates. A pixel match is not evidence that the picture is ready to ship.

## Gates

- From 900px the hero holds the H1, Build my prompt, and the sample, then ends 72px later on the same paper as the page, with no divider. The brief card shares the hero shell width. From 900px the pricing card shares that same shell.
- From 900px the open brief is one viewport. The dark sheet fills the right column, and the prompt takes the leftover height. The second slide does not repeat the hero instruction. Start, step, and answer are three shapes: a sand preset with no disc, a 2px gold edge on the current step, and a sand answer with an ink disc.
- Starter and Complete share H3, price, and button lines. `was $7.99` is struck. `separately $12.98` is not. The tier line has no dark chip.
- `#pro-contents` is one quiet line of six names. No grid. No gold button back to pricing. The ids `#block4` and `#block6`–`#block10` stay.
- The Copy sentence and Copy tips are not separate layers. Prompt 1 already says copy, then paste.
- FAQ is one list. An accordion inside an accordion is not allowed. Each question shows a + chip.
- The tail panel reads top to bottom: Telegram heading, one sentence, one outline button, one method link, a quieter Leader line, then “What a prompt is”. The ecosystem heading and the checkout sentence are not on the slide. Footer stays outside the panel.

## Still open

`npm run test:visual` baselines stay manual and Windows-only. Refresh the section PNGs that this composition moved. Do not treat a green pixel run as the composition gate.

## Iteration log

Replaced gates that required a `#pro-contents` grid, a Copy line in the next section, and a naked left axis for ecosystem and community. The screen does not change in this step.

EN build then: context summary uses `.cmo-context-details > summary` so the + chip paints. `#pro-contents-cta`, `#executive-summary`, and `#copy-tips` are removed on EN only. FAQ items sit in one list. `#prompt-basics`, `#ecosystem-strip`, and `#community` sit in `.tail-panel`. Root and `/lt/` keep the old blocks.

Checked on `/en/` at 390: closed context shows +, open shows the fields and −, close returns +. After prompt 5 the six names are one line and there is no gold button and no link. Copy sentence and Copy tips are gone. FAQ is one list; two questions can be open at once. The tail is one white panel, one +, one methodology link, Leader as related text, one outline Telegram button, footer outside. At 1280 the name line is one row, 23px tall, with no anchors. `npm test` passed.

The box passed that check and the lines did not. Next pass rewrites the lines: Telegram first, one method link, quieter Leader, “What a prompt is” last. The ecosystem heading and the checkout sentence leave the slide.

DS **1.8.0**. SemVer **1.11.0**. R1 stays open.
