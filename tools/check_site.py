"""Static checks for the portfolio. Runs locally and in GitHub Actions.

Guards the properties that are easy to break by accident and expensive to
notice in production: dead links, unbalanced markup, missing images, silent
third-party requests, and content that only renders correctly when JavaScript
runs.

Usage:  python tools/check_site.py
Exit code 1 on any failure.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html", "404.html"]
TAGS = ["section", "article", "div", "ul", "ol", "li", "a", "main", "header", "nav", "footer",
        "span", "svg", "g", "button", "dl", "p", "h1", "h2", "h3", "h4", "figure", "figcaption"]
REQUIRED = [
    "styles.css", "script.js", "robots.txt", "sitemap.xml", ".nojekyll",
    "assets/Kenneth_Wijaya_Resume.pdf", "assets/og.png",
    "assets/fonts/fonts.css", "assets/fonts/geist-latin.woff2",
    "dashboard/index.html", "dashboard/data/baselines.json",
    "dashboard/assets/fonts/fonts.css",
    "assets/vendor/anime-4.5.0.umd.min.js", "assets/vendor/lenis-1.3.26.min.js",
]

failures = []


def fail(msg):
    failures.append(msg)


def read(path):
    return open(os.path.join(ROOT, path), encoding="utf-8").read()


# ---------------------------------------------------------------- links & markup
for page in PAGES:
    html = read(page)

    for ref in sorted(set(re.findall(r'(?:href|src)="([^"#][^"]*)"', html))):
        if ref.startswith(("http://", "https://", "mailto:", "data:")):
            continue
        target = ref.split("#")[0].split("?")[0]
        if target in ("", "/"):
            target = "index.html"
        if not os.path.exists(os.path.join(ROOT, target.lstrip("/"))):
            fail(f"{page}: dead local link {ref}")

    for tag in TAGS:
        opens = len(re.findall(rf"<{tag}[\s>]", html))
        closes = len(re.findall(rf"</{tag}>", html))
        if opens != closes:
            fail(f"{page}: <{tag}> opens {opens} vs closes {closes}")

    # Every image needs alt text and intrinsic dimensions
    for img in re.findall(r"<img\b[^>]*>", html):
        if 'alt="' not in img:
            fail(f"{page}: <img> without alt: {img[:70]}")
        if "width=" not in img or "height=" not in img:
            fail(f"{page}: <img> without width/height (causes layout shift): {img[:70]}")

    # The site self-hosts its fonts; a stray Google link would undo that
    if "fonts.googleapis.com" in html or "fonts.gstatic.com" in html:
        fail(f"{page}: links a Google Fonts stylesheet; fonts are meant to be self-hosted")

    # Scripts and styles are vendored, so nothing on the page should reach a CDN
    for host in ("cdnjs.cloudflare.com", "cdn.jsdelivr.net", "unpkg.com"):
        if host in html:
            fail(f"{page}: loads from {host}; vendor it into assets/vendor instead")

    # Scripts must not block the parser
    for tag in re.findall(r"<script[^>]*src=[^>]*>", html):
        if "defer" not in tag and "async" not in tag and "type=\"module\"" not in tag:
            fail(f"{page}: render-blocking script (add defer): {tag[:70]}")

    # Links that open a new tab must not hand the opener over
    for a in re.findall(r'<a\b[^>]*target="_blank"[^>]*>', html):
        if "noopener" not in a:
            fail(f"{page}: target=_blank without rel=noopener: {a[:70]}")


# ---------------------------------------------------------------- required files
for required in REQUIRED:
    if not os.path.exists(os.path.join(ROOT, required)):
        fail(f"required file missing: {required}")


# ------------------------------------------------- content must survive without JS
index = read("index.html")

# Animated counters: the true figure has to be in the markup, or a visitor with
# JavaScript blocked (or reduced motion) reads a headline statistic of zero.
for span in re.findall(r'<span data-count="([^"]+)" data-decimals="(\d+)">([^<]*)</span>', index):
    value, decimals, shown = span
    if shown.strip() != value:
        fail(f'counter data-count="{value}" renders "{shown}" without JS; put the real value in the markup')
if len(re.findall(r"data-count=", index)) == 0:
    fail("no counters found; the check above is no longer testing anything")

# The skip link must bypass the smooth-scroll handler so focus actually moves
if 'class="skip-link"' in index and "data-no-smooth" not in index:
    fail("the skip link is missing data-no-smooth, so JS will swallow its focus move")

# Section headings belong to their section, not to a complementary landmark
if re.search(r"<aside[^>]*class=\"sec-aside\"", index):
    fail("section headings are wrapped in <aside>, which exposes them as complementary landmarks")


# ---------------------------------------------------- dashboard stays self-contained
dash = read("dashboard/index.html")
if "fonts.googleapis.com" in dash or "fonts.gstatic.com" in dash:
    fail("dashboard/index.html requests Google Fonts; run tools/localise_dashboard_fonts.py")


if failures:
    print("FAILED")
    for f in failures:
        print(" -", f)
    sys.exit(1)
print(f"OK: {len(PAGES)} pages checked, links resolve, markup balanced, "
      "images sized, fonts self-hosted, content survives without JS")
