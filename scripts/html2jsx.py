"""Convert the legacy body markup into JSX. Mechanical, because hand-retyping
40KB of markup is how you lose a stat or an aria attribute without noticing."""
import io, re, sys

VOID = {"img", "br", "hr", "input", "meta", "link", "source", "path", "rect",
        "circle", "line", "polyline", "polygon", "stop", "use", "ellipse"}

ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex",
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin", "stroke-dasharray": "strokeDasharray",
    "fill-rule": "fillRule", "clip-rule": "clipRule", "stop-color": "stopColor",
    "stop-opacity": "stopOpacity", "text-anchor": "textAnchor",
    "font-family": "fontFamily", "font-size": "fontSize", "font-weight": "fontWeight",
    "vector-effect": "vectorEffect", "stroke-miterlimit": "strokeMiterlimit",
    "clip-path": "clipPath", "colspan": "colSpan", "rowspan": "rowSpan",
    "maxlength": "maxLength", "autocomplete": "autoComplete", "readonly": "readOnly",
    "crossorigin": "crossOrigin", "srcset": "srcSet", "datetime": "dateTime",
}
BOOL_ATTRS = {"hidden", "disabled", "checked", "readonly", "required", "autofocus", "inert", "open"}


def convert_attrs(tag_body):
    out = []
    for m in re.finditer(r'([a-zA-Z_:][\w:.-]*)(?:\s*=\s*"([^"]*)")?', tag_body):
        name, val = m.group(1), m.group(2)
        if not name:
            continue
        jsx = ATTR_MAP.get(name, name)
        if val is None:
            out.append(f"{jsx}" + ("={true}" if name in BOOL_ATTRS else ""))
        elif name.startswith("data-") or name.startswith("aria-"):
            out.append(f'{name}="{val}"')
        elif name in BOOL_ATTRS:
            out.append(f"{jsx}={{true}}" if val in ("", name, "true") else f'{jsx}={{false}}')
        elif name == "style":
            decls = [d for d in val.split(";") if d.strip()]
            pairs = []
            for d in decls:
                k, _, v = d.partition(":")
                k = k.strip()
                key = re.sub(r"-(\w)", lambda mm: mm.group(1).upper(), k)
                if key.startswith("--"):
                    key = f'"{k}"'
                pairs.append(f'{key}: "{v.strip()}"')
            out.append("style={{" + ", ".join(pairs) + "}}")
        elif re.fullmatch(r"-?\d+(\.\d+)?", val) and jsx in ("width", "height", "tabIndex"):
            out.append(f"{jsx}={{{val}}}")
        else:
            out.append(f'{jsx}="{val}"')
    return " ".join(out)


def convert(html):
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)

    def tag(m):
        closing, name, body, selfclose = m.group(1), m.group(2), m.group(3) or "", m.group(4)
        if closing:
            return f"</{name}>"
        attrs = convert_attrs(body)
        space = " " if attrs else ""
        if selfclose or name.lower() in VOID:
            return f"<{name}{space}{attrs} />"
        return f"<{name}{space}{attrs}>"

    return re.sub(r"<(/?)([a-zA-Z][\w:-]*)((?:\s+[^>]*?)?)(/?)>", tag, html)


if __name__ == "__main__":
    src = io.open(sys.argv[1], encoding="utf-8").read()
    body = src[src.index("<body>") + 6: src.index("</body>")]
    io.open(sys.argv[2], "w", encoding="utf-8", newline="\n").write(convert(body))
    print("converted", len(body), "chars ->", sys.argv[2])
