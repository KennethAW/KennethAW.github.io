"""Split the single page component into per-section components by matching
brace-free tag depth, so the split lands on real element boundaries rather than
on a line number that shifts the moment anyone edits the markup."""
import io, re, os

SRC = "src/Site.tsx"
OUT = "src/sections"
s = io.open(SRC, encoding="utf-8").read()
body = s[s.index("    <>\n") + len("    <>\n"): s.rindex("    </>")]
lines = body.split("\n")


def block_at(start_idx):
    """Return (end_idx_exclusive) of the element beginning on start_idx."""
    m = re.match(r"\s*<([a-zA-Z][\w.]*)", lines[start_idx])
    tag = m.group(1)
    depth = 0
    for i in range(start_idx, len(lines)):
        depth += len(re.findall(r"<%s[\s>]" % tag, lines[i]))
        depth -= len(re.findall(r"</%s>" % tag, lines[i]))
        depth -= len(re.findall(r"<%s[^>]*/>" % tag, lines[i]))
        if depth <= 0 and i >= start_idx:
            return i + 1
    return len(lines)


def find(pattern, frm=0):
    for i in range(frm, len(lines)):
        if re.search(pattern, lines[i]):
            return i
    raise SystemExit("could not find " + pattern)


CUTS = [
    ("Nav", r'<header className="nav">'),
    ("Hero", r'<section className="hero" id="top">'),
    ("Stats", r'<div className="container stats-wrap">'),
    ("About", r'<section id="about"'),
    ("Experience", r'<section id="experience"'),
    ("Work", r'<section id="projects"'),
    ("Education", r'<section id="education"'),
    ("Skills", r'<section id="skills"'),
    ("Leadership", r'<section id="leadership"'),
    ("Contact", r'<section id="contact"'),
    ("Footer", r"<footer"),
]

os.makedirs(OUT, exist_ok=True)
spans = []
for name, pat in CUTS:
    i = find(pat)
    spans.append((name, i, block_at(i)))

taken = set()
for name, a, b in spans:
    chunk = "\n".join(lines[a:b])
    dedent = min((len(l) - len(l.lstrip()) for l in chunk.split("\n") if l.strip()), default=0)
    chunk = "\n".join(l[dedent:] if l.strip() else "" for l in chunk.split("\n"))
    chunk = "\n".join(("      " + l) if l.strip() else "" for l in chunk.split("\n"))
    io.open(os.path.join(OUT, name + ".tsx"), "w", encoding="utf-8", newline="\n").write(
        "export default function %s() {\n  return (\n%s\n  );\n}\n" % (name, chunk))
    taken.update(range(a, b))
    print("  %-11s lines %4d-%-4d -> src/sections/%s.tsx" % (name, a + 1, b, name))

leftover = [lines[i] for i in range(len(lines)) if i not in taken and lines[i].strip()]
print("\nnot claimed by any section (%d lines):" % len(leftover))
for l in leftover[:20]:
    print("   ", l.strip()[:100])
