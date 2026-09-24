# Kenneth Anthony Wijaya — Personal Website

A single-page portfolio, designed as a personal market terminal. Plain HTML,
CSS and JavaScript. No build step, no framework, no libraries, no third-party
requests at runtime.

**Live at <https://kennethaw.github.io>.** Every push to `main` redeploys it.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole page |
| `styles.css` | The design system, both themes and every layout rule |
| `script.js` | Interaction: command line, theme toggle, ticker pause, clocks, reveals, counters, gallery, mobile menu, dashboard embed |
| `404.html` | Styled not-found page |
| `assets/` | Resume PDF, gallery images, project PDFs, social preview image |
| `assets/fonts/` | Self-hosted woff2 subsets plus metric-matched fallbacks |
| `dashboard/` | The Alpha Analytics dashboard from the final-year project, built as static files and embedded in the Research section |
| `tools/` | Build and check scripts (see below) |
| `robots.txt`, `sitemap.xml` | Search engine basics |

## Preview locally

```bash
python tools/serve.py 5500
```

Then open <http://localhost:5500>. `python -m http.server 5500` works too, but
it serves one file at a time and does not compress, so do not measure with it.

## Checks

`tools/check_site.py` is the fast one and runs on every push via
`.github/workflows/check.yml`. It has no dependencies and guards the things
that are cheap to break and expensive to notice: dead links, unbalanced
markup, images without `alt` or intrinsic dimensions, stray third-party
requests, render-blocking scripts, and content that only renders correctly
when JavaScript runs.

```bash
python tools/check_site.py
```

`tools/verify_site.py` drives a real headless Chrome and asserts behaviour:
focus actually moves when the skip link or the command line is used, the
dashboard opens and closes on Escape and returns focus, the theme toggle
repaints and remembers, the ticker pauses, gallery arrows disable at the ends,
headline figures still read correctly with the script blocked or while
printing, collapsed rows open for print, the header never overlaps itself, and
deep links clear the fixed header. It needs Chrome and `websocket-client`, so
it is a local tool rather than a CI step. Set `CHROME_PATH` if Chrome is not
in the default Windows location.

```bash
pip install websocket-client
python tools/serve.py 5500 &
python tools/verify_site.py
```

## Design notes

- **Concept.** A personal market terminal. The page is a set of panels, each
  with a function-code bar (`DES`, `KPI`, `BLTR`, `RSCH`...), under a ticker
  and a command line. The figures on it are the real ones: the chart in the
  hero and the model comparison come straight from the final-year project's
  exported data in `dashboard/data/`.
- **Themes.** Dark by default, with a light "day mode" behind the sun/moon
  button. The choice is remembered per browser, and applied by a one-line
  script in `<head>` before first paint so there is no flash. Every colour is
  a token on `:root` and `[data-theme="light"]`; each text colour was checked
  against every surface it sits on and passes WCAG AA in both themes. The
  contact console stays dark in both, because it is a terminal window.
- **Colour means something.** Amber is the accent and every action. Green is
  a good number or a winning trade, red a bad one or a limitation, cyan a
  link. On the skills map, colour marks the category, never a level.
- **Type.** Geist Mono for headings, figures, labels and everything
  terminal-like; Geist for reading text. Body 16px.
- **Structure.** Each section opens with a numbered strip and a one-line
  heading, then takes its own form: a profile dashboard, a bio with no panel
  chrome, a blotter of expandable roles, a research note with charts, cards
  for education, a colour-coded skills map, and a console for contact.
- **Less to read.** Detail lives one click away rather than in the way: role
  bullets are inside `<details>` rows (first one open), findings are one line
  each, and the backtest figures are a grid of numbers rather than prose.
- **The command line.** Type `EDU`, `RSCH`, `CV`, `DASH`, `THEME` or `HELP`
  in the header (Ctrl/Cmd+K focuses it). It is a shortcut only: every command
  goes somewhere the nav or a link already reaches. It is hidden below 1280px
  and without JavaScript.
- **Fonts.** Self-hosted latin subsets, with `@font-face` fallbacks whose
  `size-adjust` and vertical metrics were measured from the real fonts. This
  shrinks the reflow when the real font swaps in; it does not abolish it. Do
  not re-tune `size-adjust` by eye: a plausible-looking 105.43% once moved the
  page nearly four times as much as having no fallback at all.
- **Motion.** Panels boot in once on load, the hero chart draws itself, and
  sections fade up as they arrive, all in CSS with IntersectionObserver.
  Transform and opacity only. The ticker can be paused (and pauses on hover).
  Reduced-motion visitors get a still page and a ticker they can scroll.
- **Degradation.** Every figure and sentence is in the HTML. If JavaScript is
  off, the page is complete and readable, the `<details>` rows still open, and
  only the command line (which needs script) is hidden.

Measured with Lighthouse against `tools/serve.py` locally, three runs per
preset: desktop 100 / 100 / 100 / 100 and mobile 100 / 100 / 100 / 100,
cumulative layout shift at most 0.002, 86 KB transferred. Re-measure against
the live site after a deploy: mobile performance is scored far more harshly
than desktop and production adds CDN time-to-first-byte, so `tools/audit.py`
sets its floors per preset rather than demanding 100 everywhere.

## The profile photo

`assets/photo.jpg` sits in the hero's profile panel. It is cropped to the
frame's 4:5 and sized 480x600 (the frame is at most 200px wide, so that covers
2x screens) at about 35 KB. To replace it, crop and export a new one at the
same size, rather than dropping in a camera original: the first upload was
3 MB.

## The embedded dashboard

`dashboard/` is a React + Vite app built to static files. It ships with
pre-exported JSON, so it runs with no backend. Visitors click "Launch the
dashboard" to run it inside the page; on phones it opens in its own tab.

To rebuild it after changing the final-year-project repo:

```bash
python tools/build_dashboard.py "C:/path/to/Final-Year-Project-Rev-1.0/dashboard-react"
```

The script switches the app to hash routing and base-relative data paths so it
works from the `/dashboard/` subfolder, builds with `vite build --base=./`,
then calls `tools/localise_dashboard_fonts.py` to replace the Google Fonts
links with self-hosted subsets. Icon names are scraped from the built bundle,
so a new icon is picked up automatically. Node.js 18+ is required.

Two things to know about the dashboard: the sidebar ticker shows cached prices
because no Finnhub API key is bundled, and the app makes one live call to
`api.open-meteo.com` for the little weather line in its footer.

## Regenerating the social preview image

`assets/og.png` is rendered from `tools/og.html`. Its chart is the same
GOOGL series as the one on the page. With the local server running:

```bash
chrome --headless=new --window-size=1200,630 --screenshot=assets/og.png http://localhost:5500/tools/og.html
```

## Deploy to GitHub Pages

Already deployed. The repository is <https://github.com/KennethAW/KennethAW.github.io>
and Pages serves it from the root of `main`, so publishing a change is just:

```bash
git add -A && git commit -m "..." && git push
```

The site updates within a minute. The "Site checks" workflow runs
`tools/check_site.py` on every push to catch a broken link or missing asset.

If a custom domain is added later, update the `canonical`, `og:url` and
`og:image` URLs in `index.html`, the URLs in `sitemap.xml` and `robots.txt`,
and the footer text in `tools/og.html`.

## Updating content

Everything lives in `index.html`, under the section comments (`HERO`, `ABOUT`,
`EXPERIENCE` and so on).

- The animated statistics use `data-count` for the target and carry the real
  value as their text. Keep both in sync; `check_site.py` fails the build if
  they drift.
- The ticker in the header repeats headline figures, and its list appears
  twice (the second copy makes the loop seamless). Change both copies, and
  `tools/og.html`, when a figure changes.
- Replace `assets/Kenneth_Wijaya_Resume.pdf` whenever the resume changes.
- Bump "Updated Sep 2026" in the footer when you make a substantive change.
