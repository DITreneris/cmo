# PDF accessibility checklist (CMO Kit)

Playwright HTML → PDF export does not produce tagged PDF/UA files. Use this manual pass before each paid PDF release.

## Content structure (HTML source)

- [ ] One `h1` per page section; `h2`/`h3` hierarchy is logical top-to-bottom.
- [ ] Tables use `th` with `scope="col"` or `scope="row"` where applicable.
- [ ] New TOC and worked-example pages use single-column layout (no multi-column reading traps).
- [ ] Footer gray `#6b7a8c` on white meets 4.5:1 contrast for 9pt text (verify in DevTools or contrast checker).
- [ ] Meaningful diagrams include alt text or are described in adjacent body copy.

## Export smoke

- [ ] `npm run pdf:export` → Starter **14** pages, Pro **30** pages.
- [ ] Open both PDFs; confirm no clipped content on TOC, worked example, week-1 quickstart pages.
- [ ] Grayscale print preview: panels and prompt blocks remain readable.

## Acrobat / Reader pass

- [ ] View → Read Out Loud (or screen reader): heading order matches visual order on pages 2, 5, 22 (Pro).
- [ ] Zoom 200%: text reflows without horizontal scroll on Letter size.
- [ ] Search finds prompt titles and “Pre-publish” on expected pages.

## Storefront (EN)

- [ ] Comparison table is **not** rendered on `/en/` (`comparisonTable` may remain in SOT unused). No caption required.
- [ ] Preview thumbnails have descriptive alt text (“Preview page N — watermarked”).

## When to escalate

If a buyer requires WCAG 2.x PDF/UA tagged output, plan a post-process tagger (Adobe Acrobat Pro, axesPDF, or commercial pipeline) — out of scope for the default Playwright build.

**Owner:** Commerce + QA before each release that changes operator-local `docs/pdf-source/*.html` (see [README.md](pdf-source/README.md)). HTML interiors are not in git.
