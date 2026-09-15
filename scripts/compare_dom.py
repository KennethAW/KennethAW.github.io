"""Structural comparison against the hand-written page. A text diff misses a
dropped button that carries only an icon and an aria-label, which is exactly
what happened when the page was split into components - so compare the shape of
the DOM, not just the words in it."""
import io, re, sys
from collections import Counter

def shape(path):
    s = io.open(path, encoding="utf-8").read()
    s = s[s.index("<body"):] if "<body" in s else s
    s = re.sub(r"<script.*?</script>", " ", s, flags=re.S)
    tags = Counter(m.lower() for m in re.findall(r"<([a-zA-Z][\w-]*)[\s/>]", s))
    classes = Counter()
    for attr in re.findall(r'class="([^"]*)"', s):
        for c in attr.split():
            classes[c] += 1
    ids = Counter(re.findall(r'id="([^"]*)"', s))
    aria = Counter(re.findall(r'aria-label="([^"]*)"', s))
    hrefs = Counter(re.findall(r'href="([^"]*)"', s))
    return tags, classes, ids, aria, hrefs

names = ["tags", "classes", "ids", "aria-labels", "hrefs"]
a = shape(sys.argv[1])
b = shape(sys.argv[2])
bad = 0
for name, ca, cb in zip(names, a, b):
    for key in sorted(set(ca) | set(cb)):
        if ca[key] != cb[key]:
            print(f"  {name:<12} {key!r}: original {ca[key]}, built {cb[key]}")
            bad += 1
print("identical" if not bad else f"{bad} structural differences")
sys.exit(1 if bad else 0)
