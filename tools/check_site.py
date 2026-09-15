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

_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# The site is built now, so every static check runs against what actually
# ships, not against the Vite template at the repo root.
ROOT = os.environ.get("SITE_ROOT") or (
    os.path.join(_REPO, "dist") if os.path.isdir(os.path.join(_REPO, "dist")) else _REPO
)
PAGES = ["index.html", "404.html"]

def _bundled(ext):
    d = os.path.join(ROOT, "assets")
    return [f for f in os.listdir(d) if f.endswith(ext)] if os.path.isdir(d) else []

TAGS = ["section", "article", "div", "ul", "ol", "li", "a", "main", "header", "nav", "footer",
        "span", "svg", "g", "button", "dl", "p", "h1", "h2", "h3", "h4", "figure", "figcaption"]
# The stylesheet and the script are bundled under hashed names now, so they are
# checked by pattern below rather than by exact path.
REQUIRED = [
    "robots.txt", "sitemap.xml", ".nojekyll",
    "assets/Kenneth_Wijaya_Resume.pdf", "assets/og.png",
    "assets/fonts/fonts.css", "assets/fonts/geist-latin.woff2",
    "dashboard/index.html", "dashboard/data/baselines.json",
    "dashboard/assets/fonts/fonts.css",
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
            fail(f"{page}: loads from {host}; add it as a dependency and bundle it instead")

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


# ------------------------------------------------------------------ stylesheets
# A declaration that sits outside any rule does not fail loudly. The CSS parser
# treats it as the start of a selector and keeps swallowing tokens until the next
# "{", which means it eats the whole rule that follows it. A stray duplicated
# unicode-range line in fonts.css silently removed the "Geist Fallback"
# @font-face this way, and nothing anywhere reported a problem.
def css_structure(path):
    src = read(path)
    stripped = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    depth = 0
    for n, line in enumerate(stripped.splitlines(), 1):
        text = line.strip()
        if depth == 0 and re.match(r"^[-a-z]+\s*:", text):
            fail(f"{path}:{n}: declaration outside any rule; it will swallow the rule after it")
        if depth == 0 and text.startswith("}"):
            fail(f"{path}:{n}: closing brace with nothing open")
        depth += line.count("{") - line.count("}")
    if depth != 0:
        fail(f"{path}: braces do not balance (ends at depth {depth})")


# The page stylesheet is authored in src/ and bundled into a hashed file, so the
# structure check runs against the source a human actually edits. fonts.css
# ships as-is and is checked where it lands.
def _source_sheet(rel):
    cand = os.path.join(_REPO, rel)
    return cand if os.path.exists(cand) else os.path.join(ROOT, rel)


for sheet, base in (("src/styles.css", _REPO), ("assets/fonts/fonts.css", ROOT)):
    _path = os.path.join(base, sheet)
    if not os.path.exists(_path):
        fail(f"{sheet}: expected stylesheet is missing")
        continue
    _src = open(_path, encoding="utf-8").read()
    _stripped = re.sub(r"/\*.*?\*/", "", _src, flags=re.S)
    _depth = 0
    for _n, _line in enumerate(_stripped.splitlines(), 1):
        _text = _line.strip()
        if _depth == 0 and re.match(r"^[-a-z]+\s*:", _text):
            fail(f"{sheet}:{_n}: declaration outside any rule; it will swallow the rule after it")
        if _depth == 0 and _text.startswith("}"):
            fail(f"{sheet}:{_n}: closing brace with nothing open")
        _depth += _line.count("{") - _line.count("}")
    if _depth != 0:
        fail(f"{sheet}: braces do not balance (ends at depth {_depth})")

# Every metric-matched fallback the design system names must actually be defined.
# If it is not, the browser skips silently past it to the next family in the
# stack and the size-adjust that stops text reflowing never applies. System
# families further down the stack (Arial, Georgia and friends) are not ours to
# define, so only the "... Fallback" ones are checked.
fonts_css = read("assets/fonts/fonts.css")
defined_families = {m.strip("\"' ") for m in
                    re.findall(r"@font-face\s*\{[^}]*?font-family:\s*([^;]+?);", fonts_css, re.S)}
# The font stacks are Tailwind theme tokens in the source sheet now.
_theme_sheet = os.path.join(_REPO, "src", "styles.css")
# JSX decodes HTML entities through Babel's table, and that table does not carry
# every named entity - &nearr; reached the page as the literal text "&nearr;".
# Nothing should survive into the output looking like an undecoded entity.
for page in PAGES:
    for stray in set(re.findall(r"&amp;([a-zA-Z]{2,10});", read(page))):
        fail(f"{page}: &{stray}; reached the page as literal text; use the character itself")

if not _bundled(".css"):
    fail("the build emitted no stylesheet into assets/")
if not _bundled(".js"):
    fail("the build emitted no script into assets/")

stacks = re.findall(r"--font-(?:sans|serif|mono):\s*([^;]+);",
                    open(_theme_sheet, encoding="utf-8").read())
for family in sorted({f for stack in stacks for f in re.findall(r'"([^"]+ Fallback)"', stack)}):
    if family not in defined_families:
        fail(f'styles.css falls back to "{family}", which no @font-face in '
             f"assets/fonts/fonts.css defines")
for family in sorted(f for f in defined_families if not f.endswith(" Fallback")):
    if f"{family} Fallback" not in defined_families:
        fail(f'assets/fonts/fonts.css defines "{family}" but not "{family} Fallback"; '
             "text will reflow when the real font arrives")


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
