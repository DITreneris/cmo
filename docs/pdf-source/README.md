# Paid PDF HTML sources (operator-local)

`cmo-starter.html`, `cmo-pro.html`, and `cmo-bundle.html` are the paid kit interiors. They are **gitignored** and live on the operator machine only. Cover and preview PNGs in [`assets/pdf-covers/`](../../assets/pdf-covers/) stay in git.

## Commands (need the three HTML files on disk)

```bash
npm run pdf:export      # Starter 14 p. + Pro 30 p. → api/_private/pdfs/ (gitignored)
npm run pdf:covers      # page-1 PNGs → assets/pdf-covers/
npm run pdf:previews    # watermarked interior thumbs → assets/pdf-covers/
```

These are **not** part of `npm test` or the Vercel / GitHub Pages build. CI never needs the HTML.

If a command fails with “Source HTML missing”, restore the three files locally (they are not in a fresh clone). Do not commit them.
