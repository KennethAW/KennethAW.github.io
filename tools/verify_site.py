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

# A failure message carrying text from the page must not kill the run: the
# Windows console is cp1252 and the page has arrows and dashes in its links.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

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


# Requests whose URL contains one of these are failed with the same error a
# content blocker or a corporate proxy produces. Empty for every other check.
blocked_urls = []


def answer_paused(p):
    """Fetch.requestPaused has to be answered while we are waiting on something
    else, or the page simply stalls on that request."""
    global mid
    mid += 1
    hit = any(b in p["request"]["url"] for b in blocked_urls)
    ws.send(json.dumps({"id": mid,
                        "method": "Fetch.failRequest" if hit else "Fetch.continueRequest",
                        "params": {"requestId": p["requestId"], "errorReason": "BlockedByClient"}
                        if hit else {"requestId": p["requestId"]}}))


def call(method, params=None):
    global mid
    mid += 1
    my = mid
    ws.send(json.dumps({"id": my, "method": method, "params": params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get("method") in ("Runtime.exceptionThrown", "Log.entryAdded"):
            console.append(json.dumps(msg["params"])[:220])
        if msg.get("method") == "Fetch.requestPaused":
            answer_paused(msg["params"])
            continue
        if msg.get("id") == my:
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
    focus: document.activeElement.className, loadingOff: !document.querySelector('.window-loading').classList.contains('on'),
    error: m.classList.contains('is-error'), badge: !document.querySelector('#dash-window .live').hidden });
})()""")
print("   ", json.dumps(r))
check("launch sets aria-expanded", r.get("expanded"), "true")
check("focus moves into the frame", r.get("focus"), "window-frame")
check("loading bar stops after load", r.get("loadingOff"), True)
# The other side of the check below: a dashboard that does load must not be
# mistaken for one that did not
check("a dashboard that loads is not called an error", r.get("error"), False)
check("a dashboard that loads is announced live", r.get("badge"), True)
shot("dash-live")
key("Escape", 27); time.sleep(0.6)
r2 = ev("""JSON.stringify({ live: document.querySelector('#dash-window .window-media').classList.contains('is-live'),
  expanded: document.querySelector('[data-dash-launch]').getAttribute('aria-expanded'),
  focus: String(document.activeElement.className).split(' ')[0] })""")
check("escape closes", r2.get("live"), False)
check("escape restores aria-expanded", r2.get("expanded"), "false")
check("focus returns to the launch button", r2.get("focus"), "btn")

print("\n== escape works from inside the dashboard as well ==")
# Tabbing past the edge of the panel puts focus in the dashboard's own document,
# and a key pressed there is delivered to that document, not this one. Escape
# did nothing there, so a keyboard visitor's only way back out of a 15-control
# app was to tab through the whole of it.
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
ev("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
  document.querySelector('#projects').scrollIntoView(); await w(1600);
  document.querySelector('[data-dash-launch]').click(); await w(5000); return 1; })()""")
key("Tab", 9); time.sleep(0.3)
check("tab from the panel edge lands inside the dashboard",
      ev("document.activeElement.tagName"), "IFRAME")
key("Escape", 27); time.sleep(0.8)
check("escape from inside the dashboard closes the panel",
      ev("document.querySelector('#dash-window .window-media').classList.contains('is-live')"), False)
check("and focus comes back to the launch button",
      ev("String(document.activeElement.className).split(' ')[0]"), "btn")

print("\n== a frame that cannot load says so ==")
# A subframe blocked by an extension, a proxy or a corporate policy still fires
# the iframe's load event, with the browser's error page inside it, and never
# fires error. The panel took that as success: it hid the screenshot, showed a
# blank grey box, announced "Live" in green and never offered the way out it
# carries for exactly this case. Fail the request the way a blocker does.
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
blocked_urls.append("/dashboard/")
call("Fetch.enable", {"patterns": [{"urlPattern": "*/dashboard/*"}]})
r = ev("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
  document.querySelector('.nav-links a[href="#projects"]').click(); await w(2600);
  document.querySelector('[data-dash-launch]').click(); await w(4000);
  const m = document.querySelector('#dash-window .window-media');
  return JSON.stringify({ error: m.classList.contains('is-error'),
    errorPanel: getComputedStyle(document.querySelector('.window-error')).display,
    frameHidden: getComputedStyle(document.querySelector('.window-frame')).display,
    badge: !document.querySelector('#dash-window .live').hidden,
    wayOut: !!document.querySelector('.window-error a[href="dashboard/index.html"]'),
    loadingOff: !document.querySelector('.window-loading').classList.contains('on') });
})()""")
print("   ", json.dumps(r))
check("a blocked frame is recognised as a failure", r.get("error"), True)
check("the explanation is on screen", r.get("errorPanel"), "flex")
check("nothing claims to be live", r.get("badge"), False)
check("the way out is offered", r.get("wayOut"), True)
check("the loading bar stops", r.get("loadingOff"), True)
call("Fetch.disable")
del blocked_urls[:]

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

print("\n== printing captures the real figures ==")
# The counters read zero until they are scrolled into view and a partial number
# while they count up, and printing snapshots whatever is on screen. Loading the
# page and printing it without scrolling used to put a CGPA of 0.00 out of 5.00
# on paper; printing mid-animation put 2.66 there.
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
check("counters still start at zero for the animation",
      ev("document.querySelector('[data-count]').textContent"), "0.00")
call("Page.printToPDF", {"paperWidth": 8.27, "paperHeight": 11.69})
check("printing puts the true figures back",
      ev("JSON.stringify([...document.querySelectorAll('.stat-num')].map(e => e.textContent.trim()))"),
      ["4.85/5.00", "3×", "8+", "55.5%"])

# Safari fires only the print media query, not beforeprint. Switching to print
# media also relays the page out, which starts the count-up that the scroll
# observer had been holding, and every frame of it overwrote the figure the
# snap had just put back: 0.77/5.00 at 0.3s, 3.56/5.00 at 0.6s, 4.81/5.00 at
# 1.2s. The snapped figures have to win for as long as the print lasts.
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
call("Emulation.setEmulatedMedia", {"media": "print"})
for delay in (0.4, 0.8):
    time.sleep(delay)
    check(f"the print media query alone holds the true figures ({delay}s)",
          ev("JSON.stringify([...document.querySelectorAll('.stat-num')].map(e => e.textContent.trim()))"),
          ["4.85/5.00", "3×", "8+", "55.5%"])
call("Emulation.setEmulatedMedia", {"media": ""})

print("\n== copying the address says so out loud ==")
# The button swaps its icon for a tick, which is the only confirmation there is
# and which a screen reader cannot see. WCAG 2.2 SC 4.1.3 asks for a status
# message that assistive technology can pick up without moving focus. Chrome
# needs the document focused and the clipboard permission granted, or writeText
# rejects and the page falls back to opening a mail client instead.
call("Browser.grantPermissions", {"origin": BASE,
                                  "permissions": ["clipboardReadWrite", "clipboardSanitizedWrite"]})
call("Emulation.setFocusEmulationEnabled", {"enabled": True})
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
check("a status live region is there before anything is copied",
      ev("""JSON.stringify((() => { const s = document.querySelector('[data-copy-status]');
        return s ? { role: s.getAttribute('role'), text: s.textContent } : null; })())"""),
      {"role": "status", "text": ""})
r = ev("""(async () => { const w = ms => new Promise(r => setTimeout(r, ms));
  document.querySelector('#contact').scrollIntoView(); await w(1200);
  document.querySelector('[data-copy]').click(); await w(700);
  const s = document.querySelector('[data-copy-status]');
  const said = s.textContent;
  const clip = await navigator.clipboard.readText().catch(function () { return 'unreadable'; });
  await w(1700);
  return JSON.stringify({ said: said, clip: clip, cleared: s.textContent === '' });
})()""")
print("   ", json.dumps(r))
check("copying announces itself", bool(r.get("said")), True)
check("the address really reached the clipboard", r.get("clip"), "w.kennethanthony@gmail.com")
check("the announcement clears again", r.get("cleared"), True)
call("Emulation.setFocusEmulationEnabled", {"enabled": False})

print("\n== the mobile menu contains focus ==")
# The open menu covers the page with an opaque panel. If what is behind it stays
# focusable, Tab walks off the last menu link onto hero buttons the visitor
# cannot see and the focus ring disappears entirely.
call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 1, "mobile": True})
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
check("page behind the closed menu is reachable", ev("document.getElementById('main').inert === true"), False)
ev("document.querySelector('.nav-toggle').click(); 1"); time.sleep(0.6)
check("opening the menu hides the page behind it", ev("document.getElementById('main').inert === true"), True)
for _ in range(13):   # past the ten menu links and round the cycle
    for t in ("rawKeyDown", "keyUp"):
        call("Input.dispatchKeyEvent", {"type": t, "key": "Tab", "code": "Tab",
                                        "windowsVirtualKeyCode": 9, "nativeVirtualKeyCode": 9})
    time.sleep(0.05)
check("tabbing never reaches the covered page",
      ev("!!document.activeElement.closest('#main, footer, .to-top')"), False)
key("Escape", 27); time.sleep(0.5)
check("closing the menu gives the page back", ev("document.getElementById('main').inert === true"), False)
call("Emulation.clearDeviceMetricsOverride")

print("\n== the mobile menu fits a short viewport ==")
# The panel is the height of the viewport and its ten items need 684px. On an
# iPhone SE in portrait (667px) that put Resume, LinkedIn and GitHub below the
# fold; in landscape (360-375px) it hid everything from Education down. The
# page behind is scroll-locked while the menu is open and a fixed box does not
# scroll its own overflow, so none of it could be reached by touch, and tabbing
# to it moved focus off screen.
for label, width, height in (("phone in landscape", 740, 360), ("iPhone SE portrait", 375, 667)):
    call("Emulation.setDeviceMetricsOverride", {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": True})
    call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
    ev("document.querySelector('.nav-toggle').click(); 1"); time.sleep(0.6)
    r = ev("""JSON.stringify((() => { const m = document.getElementById('menu');
      const needed = m.scrollHeight > m.clientHeight;
      m.scrollTop = 9999;
      const last = m.querySelector('.menu-foot a:last-child').getBoundingClientRect();
      const vh = document.documentElement.clientHeight;
      return { needed: needed, scrolled: m.scrollTop > 0,
               lastReachable: last.top >= 0 && last.bottom <= vh,
               pageMoved: Math.round(window.scrollY) }; })())""")
    print("   ", label, json.dumps(r))
    check(f"the menu scrolls when it overflows, {label}", r["needed"] and r["scrolled"], True)
    check(f"the last menu link can be brought on screen, {label}", r["lastReachable"], True)
    check(f"scrolling the menu leaves the page behind, {label}", r["pageMoved"], 0)
    # and every tab stop has to be somewhere the visitor can see
    ev("document.getElementById('menu').scrollTop = 0; document.querySelector('.menu a').focus(); 1")
    offscreen = []
    for _ in range(9):
        key("Tab", 9)
        time.sleep(0.08)
        where = ev("""JSON.stringify((() => { const r = document.activeElement.getBoundingClientRect();
          return { off: r.top >= document.documentElement.clientHeight || r.bottom <= 0,
                   what: document.activeElement.getAttribute('href') || document.activeElement.tagName }; })())""")
        if where["off"]:
            offscreen.append(where["what"])
    check(f"no menu item takes focus off screen, {label}", offscreen, [])

# A wheel gesture has to reach the panel too: Lenis is stopped while the menu is
# open, and a stopped Lenis calls preventDefault on wheel and touch unless an
# ancestor of the target carries data-lenis-prevent. Without that attribute the
# panel is scrollable and still will not scroll.
call("Emulation.setDeviceMetricsOverride", {"width": 740, "height": 360, "deviceScaleFactor": 1, "mobile": False})
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
ev("document.querySelector('.nav-toggle').click(); 1"); time.sleep(0.6)
call("Input.synthesizeScrollGesture", {"x": 370, "y": 180, "xDistance": 0, "yDistance": -400,
                                       "gestureSourceType": "mouse", "speed": 800})
time.sleep(1.2)
check("a wheel gesture scrolls the open menu",
      ev("document.getElementById('menu').scrollTop > 0"), True)
shot("menu-short-scrolled")
call("Emulation.clearDeviceMetricsOverride")

print("\n== rotating with the menu open does not strand the page ==")
# Above 820px the full navigation takes over and the toggle is hidden. A tablet
# rotated from portrait to landscape with the menu open was left showing both
# navigations at once, with the page behind still inert and no toggle left to
# close the panel: the only ways out were Escape, which a touch device does not
# have, or following a link.
call("Emulation.setDeviceMetricsOverride", {"width": 768, "height": 1024, "deviceScaleFactor": 1, "mobile": True})
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
ev("document.querySelector('.nav-toggle').click(); 1"); time.sleep(0.6)
check("the menu opens in portrait", ev("document.getElementById('menu').classList.contains('open')"), True)
call("Emulation.setDeviceMetricsOverride", {"width": 1024, "height": 768, "deviceScaleFactor": 1, "mobile": True})
time.sleep(1.2)
r = ev("""JSON.stringify({ open: document.getElementById('menu').classList.contains('open'),
  expanded: document.querySelector('.nav-toggle').getAttribute('aria-expanded'),
  inert: document.getElementById('main').inert === true,
  toggle: getComputedStyle(document.querySelector('.nav-toggle')).display })""")
print("   ", json.dumps(r))
check("rotating to landscape closes the menu", r["open"], False)
check("the hidden toggle stops claiming it is expanded", r["expanded"], "false")
check("the page behind is given back", r["inert"], False)
# and the page has to scroll again, which it does not if Lenis was left stopped
ev("window.scrollTo(0, 0); 1"); time.sleep(0.4)
call("Input.synthesizeScrollGesture", {"x": 512, "y": 400, "xDistance": 0, "yDistance": -500,
                                       "gestureSourceType": "mouse", "speed": 800})
time.sleep(1.2)
check("the page scrolls again after the rotation", ev("window.scrollY > 0"), True)
call("Emulation.clearDeviceMetricsOverride")

print("\n== the desktop nav fits the moment it appears ==")
# The mobile menu stops at 820px but the full nav needs 920px to lay out, so
# 821-919px used to clip the Resume button off the right edge and wrap the
# brand name onto a second line. 834px is an iPad Pro 11 in portrait.
for width in (821, 834, 900):
    call("Emulation.setDeviceMetricsOverride", {"width": width, "height": 700, "deviceScaleFactor": 1, "mobile": False})
    call("Page.navigate", {"url": BASE + "/"}); time.sleep(2.4)
    r = ev("""JSON.stringify({
      resumeRight: Math.round(document.querySelector('.nav-links li:last-child a').getBoundingClientRect().right),
      innerRight: Math.round(document.querySelector('.nav-inner').getBoundingClientRect().right),
      brandH: Math.round(document.querySelector('.brand').getBoundingClientRect().height),
      navH: Math.round(document.querySelector('.nav').getBoundingClientRect().height) })""")
    check(f"resume button inside the container at {width}px", r["resumeRight"] <= r["innerRight"], True)
    check(f"brand stays on one line at {width}px", r["brandH"] <= 40, True)
call("Emulation.clearDeviceMetricsOverride")

print("\n== reflow at 320px (WCAG 1.4.10) ==")
# 400% browser zoom on a 1280px screen is a 320px viewport, and at that width
# content must not need scrolling in two directions. The contact email address
# is one unbreakable word and used to push the whole page 16px sideways.
call("Emulation.setDeviceMetricsOverride", {"width": 320, "height": 800, "deviceScaleFactor": 1, "mobile": True})
call("Page.navigate", {"url": BASE + "/"}); time.sleep(3)
r = ev("""JSON.stringify({ scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
  email: Math.round(document.querySelector('.contact-email').getBoundingClientRect().right) })""")
check("no horizontal scrolling at 320px", r["scrollW"] <= r["clientW"] + 1, True)
check("email address stays inside 320px", r["email"] <= r["clientW"] + 1, True)
call("Emulation.clearDeviceMetricsOverride")

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
