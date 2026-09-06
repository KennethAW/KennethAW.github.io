# Kenneth Anthony Wijaya - Personal Website

Single-page portfolio site. Plain HTML and CSS with a small JavaScript motion layer. No build step.

## Files

- `index.html` - page content
- `styles.css` - styling (dark theme, single accent colour, Barlow + JetBrains Mono from Google Fonts)
- `script.js` - motion layer: smooth scrolling, hero intro, scroll-synced spine, section reveals, counters, parallax, mobile menu, copy-email buttons
- `assets/` - resume PDF, project screenshot, and project PDFs
- `dashboard/` - the Alpha Analytics dashboard from the final-year project, built as static files and embedded in the Projects section (visitors click "Launch interactive dashboard" to run it in place, or open `dashboard/index.html` full screen)
- `tools/build_dashboard.py` - rebuilds `dashboard/` from the FYP repo's `dashboard-react` folder
- `tools/og.html` - template for the social preview image; `assets/og.png` is rendered from it (see below)
- `404.html` - styled not-found page that GitHub Pages serves automatically

## Dependencies (loaded from CDNs, no install needed)

- [anime.js 4.5](https://animejs.com/) for animations
- [Lenis 1.3](https://lenis.darkroom.engineering/) for smooth scrolling

If either CDN is blocked, the page still renders fully; it just loses the motion. Visitors with "reduce motion" enabled get a static page with instant scrolling.

## Preview locally

```bash
python -m http.server 5500
```

Then open http://localhost:5500 in a browser.

## Deploy to GitHub Pages

1. Create a public repository on GitHub named `KennethAW.github.io`.
2. Push this folder to the `main` branch of that repository.
3. In the repository settings, under Pages, set the source to "Deploy from a branch", branch `main`, folder `/ (root)`.
4. The site will be live at https://KennethAW.github.io within a minute or two.

## Updating the embedded dashboard

The dashboard is a React + Vite app that ships with pre-exported JSON, so it runs with no backend. To refresh it after changing the FYP repo:

```bash
python tools/build_dashboard.py "C:/path/to/Final-Year-Project-Rev-1.0/dashboard-react"
```

The script switches the app to hash routing and base-relative data paths so it works from the `/dashboard/` subfolder, then builds with `vite build --base=./`. Node.js 18+ is required. The optional Finnhub live ticker is off because no API key is bundled.

## Design notes

The site follows a small set of motion and UX rules, drawn from current guidance on UI animation and portfolio design:

- Recruiters decide in under 30 seconds and more than half browse on phones, so the fold states name, current programme, availability, and one call to action. Everything is responsive down to 360px.
- Micro-interactions (buttons, links, chips, cards) run in 150-350ms with an ease-out curve and only animate `transform` and `opacity`, which stay off the browser's layout and paint work.
- Larger reveals (hero intro, section headings, scroll reveals) run 900-1300ms and play once. The spine and hero fade are tied to scroll position rather than time.
- Pointer-only effects (magnetic buttons, card spotlight, hero depth) are enabled only on devices with a fine pointer and hover capability.
- `prefers-reduced-motion` turns off smooth scrolling, the intro, reveals, loops, and parallax. Content is always visible without JavaScript or if a CDN is blocked.
- Section headings are split into letters for the reveal but keep an `aria-label` with the full text; the mobile menu traps focus sensibly and closes on Escape; the active nav link carries `aria-current`.
- A print stylesheet produces a clean light version with link URLs printed, so the page can be saved as a PDF.

To regenerate the social preview image after changing `tools/og.html`:

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --window-size=1200,630 --screenshot=assets/og.png tools/og.html
```

## Updating content

Everything lives in `index.html`. Search for the section comments (`HERO`, `ABOUT`, `EXPERIENCE`, and so on) and edit the text in place. The hero stats strip uses `data-count` attributes for the animated numbers. The availability pill and the footer's "Updated" date are plain text near the top of `index.html` and the bottom of the page respectively. Replace `assets/Kenneth_Wijaya_Resume.pdf` whenever the resume changes.
