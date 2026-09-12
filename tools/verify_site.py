"""Behavioural checks: drives a real Chrome and asserts how the page behaves.

tools/check_site.py covers what can be seen in the source. This covers what can
only be seen by running the thing: that focus moves where it should, that the
dashboard opens and closes, that headline figures survive with the motion
libraries blocked, and that deep links clear the fixed header.

Requires Chrome and websocket-client (pip install websocket-client), plus a
local server:  python -m http.server 5500

Usage:  python tools/verify_site.py [base_url]
Exit code 1 if any check fails.
"""
import json, time, urllib.request, websocket, base64, os, subprocess, sys

BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://localhost:5500"
S = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_verify_out")
OUT = S
os.makedirs(OUT, exist_ok=True)
PROFILE = os.path.join(S, "chrome-profile")
CHROME = os.environ.get("CHROME_PATH", r"C:\Program Files\Google\Chrome\Application\chrome.exe")
PORT = 9342
proc = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--no-first-run", "--hide-scrollbars",
                         "--user-data-dir=" + PROFILE, "--remote-debugging-port=%d" % PORT, "--window-size=1280,900", "about:blank"],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(3)
page = next(t for t in json.load(urllib.request.urlopen("http://127.0.0.1:%d/json" % PORT)) if t["type"] == "page")
ws = websocket.create_connection(page["webSocketDebuggerUrl"], suppress_origin=True, timeout=40)
mid = 0
console = []
fails = []


def call(method, params=None):
    global mid
    mid += 1
    ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get("method") in ("Runtime.exceptionThrown", "Log.entryAdded"):
            console.append(json.dumps(msg["params"])[:220])
        if msg.get("id") == mid:
            return msg.get("result", msg)


def ev(expr):
    r = call("Runtime.evaluate", {"expression": expr, "awaitPromise": True, "returnByValue": True})
    v = r.get("result", {}).get("value")
    if isinstance(v, str) and v[:1] in "{[":
        try:
            return json.loads(v)
        except Exception:
            return v
    return v if v is not None else r


def shot(n):
    open(os.path.join(OUT, n + ".png"), "wb").write(base64.b64decode(call("Page.captureScreenshot", {"format": "png"})["data"]))


def key(k, kc=0):
    for t in ("keyDown", "keyUp"):
        call("Input.dispatchKeyEvent", {"type": t, "key": k, "code": k, "windowsVirtualKeyCode": kc, "nativeVirtualKeyCode": kc})


checks = []


def check(name, got, want):
    ok = got == want
    if not ok:
        fails.append(name)
    checks.append({"name": name, "pass": ok, "got": repr(got), "want": repr(want)})
    print(("  PASS  " if ok else "  FAIL  ") + name + "  got=" + repr(got) + ("" if ok else "  want=" + repr(want)))


call("Page.enable"); call("Runtime.enable"); call("Log.enable")

print("== counters survive without motion / without the CDN ==")
call("Emulation.setEmulatedMedia", {"features": [{"name": "prefers-reduced-motion", "value": "reduce"}]})
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
ev("window.scrollTo(0, 900); 1"); time.sleep(1.2)
check("reduced-motion stats", ev("JSON.stringify([...document.querySelectorAll('.stat-num')].map(e => e.textContent.trim()))"),
      ["4.85/5.00", "3\u00d7", "8+", "55.5%"])
call("Emulation.setEmulatedMedia", {"features": []})

call("Network.enable")
# The libraries are vendored now, so simulate them failing to load at all
call("Network.setBlockedURLs", {"urls": ["*assets/vendor/*"]})
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
ev("window.scrollTo(0, 900); 1"); time.sleep(1.0)
check("stats when the motion libraries fail", ev("JSON.stringify([...document.querySelectorAll('.stat-num')].map(e => e.textContent.trim()))"),
      ["4.85/5.00", "3\u00d7", "8+", "55.5%"])
check("page still readable without them", ev("getComputedStyle(document.querySelector('.hero-lede')).opacity"), "1")
shot("no-vendor")
call("Network.setBlockedURLs", {"urls": []})

print("\n== counters still animate when they can ==")
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3.5)
check("pre-scroll counter is zeroed for the animation", ev("document.querySelector('[data-count]').textContent"), "0.00")
ev("(async () => { window.scrollTo(0, 900); await new Promise(r => setTimeout(r, 2600)); return 1; })()")
check("animated to final value", ev("document.querySelector('[data-count]').textContent"), "4.85")

print("\n== skip link moves focus ==")
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3.5)
ev("document.body.focus(); 1")
key("Tab", 9); time.sleep(0.2)
check("first tab stop is the skip link", ev("document.activeElement.className"), "skip-link")
ev("document.querySelector('.skip-link').click(); 1"); time.sleep(0.6)
check("focus landed on main", ev("document.activeElement.id"), "main")

print("\n== nav landmarks and semantics ==")
check("primary nav landmark", ev("document.querySelectorAll('nav[aria-label]').length"), 2)
check("no aside wrapping section headings", ev("document.querySelectorAll('.sec aside').length"), 0)
check("nav link height >= 24", ev("Math.round(document.querySelector('.nav-links a').getBoundingClientRect().height) >= 24"), True)

print("\n== dashboard: launch, focus, escape ==")
r = ev("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
  document.querySelector('.nav-links a[href="#projects"]').click(); await w(2600);
  const b = document.querySelector('[data-dash-launch]');
  b.click(); await w(5000);
  const m = document.querySelector('#dash-window .window-media');
  return JSON.stringify({ live: m.classList.contains('is-live'), expanded: b.getAttribute('aria-expanded'),
    focus: document.activeElement.className, loadingOff: !document.querySelector('.window-loading').classList.contains('on') });
})()""")
print("   ", json.dumps(r))
check("launch sets aria-expanded", r.get("expanded"), "true")
check("focus moves into the frame", r.get("focus"), "window-frame")
check("loading bar stops after load", r.get("loadingOff"), True)
shot("dash-live")
key("Escape", 27); time.sleep(0.6)
r2 = ev("""JSON.stringify({ live: document.querySelector('#dash-window .window-media').classList.contains('is-live'),
  expanded: document.querySelector('[data-dash-launch]').getAttribute('aria-expanded'),
  focus: String(document.activeElement.className).split(' ')[0] })""")
check("escape closes", r2.get("live"), False)
check("escape restores aria-expanded", r2.get("expanded"), "false")
check("focus returns to the launch button", r2.get("focus"), "btn")

print("\n== gallery arrow states ==")
r = ev("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
  const g = document.querySelector('.gallery'); const prev = document.querySelector('[data-gallery-prev]'), next = document.querySelector('[data-gallery-next]');
  g.scrollLeft = 0; await w(400);
  const start = { prev: prev.disabled, next: next.disabled };
  g.scrollLeft = g.scrollWidth; await w(500);
  const end = { prev: prev.disabled, next: next.disabled };
  return JSON.stringify({ start, end });
})()""")
check("prev disabled at start", r["start"]["prev"], True)
check("next enabled at start", r["start"]["next"], False)
check("next disabled at end", r["end"]["next"], True)

print("\n== images now carry intrinsic size ==")
ev("(async () => { window.scrollTo(0, 5200); await new Promise(r => setTimeout(r, 2200)); return 1; })()")
r = ev("""JSON.stringify([...document.images].map(i => ({ n: i.src.split('/').pop(), w: i.getAttribute('width'), d: i.decoding })))""")
check("all images declare width", all(x["w"] for x in r), True)
check("all images decode async", all(x["d"] == "async" for x in r), True)

print("\n== deep link clears the fixed header ==")
call("Page.navigate", {"url": BASE + "/#skills"}); time.sleep(3)
r = ev("""JSON.stringify({ secTop: Math.round(document.querySelector('#skills').getBoundingClientRect().top),
  navH: Math.round(document.querySelector('.nav').getBoundingClientRect().height) })""")
check("section top below the nav", r["secTop"] >= r["navH"], True)

print("\nconsole entries:", len(console))
for c in console[:6]:
    print("   ", c)
print("\nFAILURES:", fails if fails else "none")

# Machine-readable result so tools/audit.py can score a run without parsing text
json.dump({"url": BASE, "passed": sum(1 for c in checks if c["pass"]),
           "failures": fails, "checks": checks,
           "console_entries": len(console)},
          open(os.path.join(S, "result.json"), "w", encoding="utf-8"), indent=2)

ws.close(); proc.terminate()
sys.exit(1 if fails else 0)
