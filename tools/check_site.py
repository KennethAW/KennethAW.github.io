"""Static checks for the portfolio: every local link and asset resolves, and the
main HTML files have balanced tags. Runs locally and in GitHub Actions.

Usage:  python tools/check_site.py
Exit code 1 on any failure.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html", "404.html"]
TAGS = ["section", "article", "div", "ul", "li", "a", "main", "header", "nav", "footer",
        "span", "svg", "g", "button", "dl", "p", "h1", "h2", "h3"]

failures = []
for page in PAGES:
    path = os.path.join(ROOT, page)
    html = open(path, encoding="utf-8").read()
    refs = set(re.findall(r'(?:href|src)="([^"#][^"]*)"', html))
    for ref in sorted(refs):
        if ref.startswith(("http://", "https://", "mailto:", "data:")):
            continue
        target = ref.split("#")[0].split("?")[0]
        if target in ("", "/"):
            target = "index.html"
        local = os.path.join(ROOT, target.lstrip("/"))
        if not os.path.exists(local):
            failures.append(f"{page}: missing target for {ref}")
    for tag in TAGS:
        opens = len(re.findall(rf"<{tag}[\s>]", html))
        closes = len(re.findall(rf"</{tag}>", html))
        if opens != closes:
            failures.append(f"{page}: <{tag}> opens {opens} vs closes {closes}")

for required in ["styles.css", "script.js", "assets/Kenneth_Wijaya_Resume.pdf", "assets/og.png",
                 "dashboard/index.html", "dashboard/data/baselines.json"]:
    if not os.path.exists(os.path.join(ROOT, required)):
        failures.append(f"required file missing: {required}")

if failures:
    print("FAILED")
    for f in failures:
        print(" -", f)
    sys.exit(1)
print(f"OK: {len(PAGES)} pages checked, all local links resolve, tags balanced")
