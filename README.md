# Kenneth Anthony Wijaya — Personal Website

A single-page portfolio. Plain HTML, CSS and JavaScript with a small motion
layer. No build step, no framework, no third-party requests at runtime.

**Live at <https://kennethaw.github.io>.** Every push to `main` redeploys it.

## Files

| Path | What it is |
|---|---|
| `index.html` | The whole page |
| `styles.css` | The design system and every layout rule |
| `script.js` | Motion and interaction: smooth scroll, hero intro, scroll-synced spine, reveals, counters, gallery, mobile menu, dashboard embed |
| `404.html` | Styled not-found page |
| `assets/` | Resume PDF, gallery images, project PDFs, social preview image |
| `assets/fonts/` | Self-hosted woff2 subsets plus metric-matched fallbacks |
| `assets/vendor/` | anime.js 4.5.0 and Lenis 1.3.26, vendored (both MIT) |
| `dashboard/` | The Alpha Analytics dashboard from the final-year project, built as static files and embedded in the Work section |
| `tools/` | Build and check scripts (see below) |
| `robots.txt`, `sitemap.xml` | Search engine basics |

## Preview locally

```bash
python -m http.server 5500
```

Then open <http://localhost:5500>.

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
focus actually moves when the skip link is used, the dashboard opens and
closes on Escape and returns focus, gallery arrows disable at the ends,
headline figures still read correctly with the motion libraries blocked, and
deep links clear the fixed header. It needs Chrome and `websocket-client`, so
it is a local tool rather than a CI step.

```bash
pip install websocket-client
python -m http.server 5500 &
python tools/verify_site.py
```

## Design notes

- **Type.** Geist for text and display, Instrument Serif italic for one
  emphasised word per heading, Geist Mono only for small labels. Body 17px.
- **Colour.** Warm near-black, ivory text, a single gold accent for emphasis,
  the spine and small details. Primary buttons are ivory, not gold.
- **Structure.** Hairlines and whitespace instead of boxes. Each section has a
  sticky heading on the left and content on the right, with a scroll-synced
  spine and a node per section down the far left.
- **Fonts.** Self-hosted latin subsets, with `@font-face` fallbacks whose
  `size-adjust` and vertical metrics were measured from the real fonts. This
  shrinks the reflow when the real font swaps in; it does not abolish it, and
  the claim to check is the measured one: cumulative layout shift is 0. Do not
  re-tune `size-adjust` by eye — a plausible-looking 105.43% once moved the
  page nearly four times as much as having no fallback at all.
- **Motion.** Micro-interactions run 150–350ms with an ease-out curve on
  transform and opacity only. Reduced-motion visitors get a static page.
  Pointer effects (magnetic buttons, spotlight, hero depth) only run on
  devices with a mouse.
- **Degradation.** Every figure and sentence is in the HTML. If JavaScript is
  off or the motion libraries fail to load, the page is complete and readable;
  it just stops moving.
- **Copy.** Written for a reader rather than pasted from the CV: a positioning
  line in the hero, a short narrative in About, a one-line summary per role,
  and the final-year project as a case study with question, approach, result,
  findings and stated limitations.

Measured with Lighthouse against the live site, three runs per preset:
desktop 100 / 100 / 100 / 100; mobile performance 97 (range 97-99) with
accessibility, best practices and SEO all 100. Cumulative layout shift 0,
145 KB transferred. Mobile performance is scored far more harshly than
desktop and varies by a couple of points between runs, so `tools/audit.py`
sets its floors per preset rather than demanding 100 everywhere.

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

`assets/og.png` is rendered from `tools/og.html`. With the local server
running:

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
- Replace `assets/Kenneth_Wijaya_Resume.pdf` whenever the resume changes.
- Bump "Updated Sep 2026" in the footer when you make a substantive change.
