// Kenneth Anthony Wijaya - portfolio
// Interaction layer. No libraries: the terminal look needs snappy, not smooth,
// so everything here is plain DOM, CSS transitions and IntersectionObserver.
// Every figure and sentence is already in the HTML; if this file fails to load
// the page is complete and readable, it just stops moving.

(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollToTarget(target) {
    if (target === 0) { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); return; }
    if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* ---------- Anchor links ----------
     Smooth-scrolling an anchor throws away the focus move a real jump performs,
     which strands keyboard and screen-reader users at the top of the page.
     Scroll, then place focus on the destination. The skip link opts out so it
     behaves exactly as assistive technology expects. */
  function focusTarget(target) {
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  function goTo(id) {
    var target = document.querySelector(id);
    if (!target) return;
    closeMenu();
    if (id === "#top") scrollToTarget(0); else scrollToTarget(target);
    history.replaceState(null, "", id);
    setTimeout(function () { focusTarget(target); }, reduceMotion ? 0 : 600);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    if (a.hasAttribute("data-no-smooth")) return;
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      goTo(id);
    });
  });

  /* ---------- Theme ----------
     Dark is the default. The choice is remembered per browser; the inline
     script in <head> applies it before first paint. */
  var themeBtn = document.querySelector(".theme-toggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function currentTheme() { return doc.getAttribute("data-theme") === "light" ? "light" : "dark"; }
  function syncThemeUi() {
    var light = currentTheme() === "light";
    if (themeBtn) themeBtn.setAttribute("aria-label", light ? "Switch to the dark theme" : "Switch to the light theme");
    if (themeMeta) themeMeta.setAttribute("content", light ? "#f2efe8" : "#0b0e13");
  }
  function setTheme(next) {
    doc.setAttribute("data-theme", next);
    try { localStorage.setItem("kw-theme", next); } catch (e) { /* private mode: still switches */ }
    syncThemeUi();
  }
  function toggleTheme() { setTheme(currentTheme() === "light" ? "dark" : "light"); }
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  syncThemeUi();

  /* ---------- Ticker ----------
     Moving content that runs for more than five seconds must be pausable
     (WCAG 2.2.2). Hover pauses it too, in CSS. */
  var ticker = document.querySelector(".ticker");
  var tickerBtn = document.querySelector(".ticker-toggle");
  if (ticker && tickerBtn) {
    tickerBtn.addEventListener("click", function () {
      var paused = !ticker.classList.contains("is-paused");
      ticker.classList.toggle("is-paused", paused);
      tickerBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      tickerBtn.setAttribute("aria-label", paused ? "Play the ticker" : "Pause the ticker");
    });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  var top = document.querySelector(".top");

  /* The open menu is an opaque panel over the whole screen, but the page
     underneath stays in the tab order. inert removes it from both the tab
     order and the accessibility tree. The header sits above the panel and
     stays reachable, so there is always a way back out. */
  var behindMenu = [document.getElementById("main"), document.querySelector("footer"),
                    document.querySelector(".to-top"), document.querySelector(".skip-link")];
  function hideBehindMenu(hidden) {
    behindMenu.forEach(function (el) { if (el) el.inert = hidden; });
  }

  function closeMenu() {
    if (!menu || !menu.classList.contains("open")) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    hideBehindMenu(false);
    document.body.style.overflow = "";
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = !menu.classList.contains("open");
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      hideBehindMenu(open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        top.classList.remove("is-hidden");
        setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus(); }, 60);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { closeMenu(); toggle.focus(); }
    });
    /* Above the breakpoint the full navigation takes over and the toggle is
       hidden, so a tablet rotated with the menu open would be left with the
       page inert and no toggle to close the panel with. */
    if (window.matchMedia) {
      var wide = window.matchMedia("(min-width: 961px)");
      var onWide = function (e) { if (e.matches) closeMenu(); };
      if (wide.addEventListener) wide.addEventListener("change", onWide);
      else if (wide.addListener) wide.addListener(onWide);
    }
  }

  /* ---------- Copy email ---------- */
  var copyStatus = document.querySelector("[data-copy-status]");
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.classList.add("is-copied");
        // The button swaps its icon for a tick, which tells a screen reader
        // nothing. Put the same confirmation in the live region.
        if (copyStatus) copyStatus.textContent = "Email address copied";
        setTimeout(function () {
          btn.classList.remove("is-copied");
          if (copyStatus) copyStatus.textContent = "";
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { window.location.href = "mailto:" + text; });
      } else {
        window.location.href = "mailto:" + text;
      }
    });
  });

  /* ---------- Interactive dashboard embed ---------- */
  var launchDashboard = (function () {
    var win = document.getElementById("dash-window");
    if (!win) return function () {};
    var media = win.querySelector(".window-media");
    var frame = win.querySelector(".window-frame");
    var tools = win.querySelector(".window-tools");
    var live = win.querySelector(".live");
    var loading = win.querySelector(".window-loading");
    var launch = win.querySelector("[data-dash-launch]");
    var close = win.querySelector("[data-dash-close]");
    var src = "dashboard/index.html";
    var LOAD_TIMEOUT = 15000;
    // The panel is 78vh tall, so a viewport can be wide enough for the embed and
    // still far too short to drive it. Below these the dashboard opens in its own
    // tab instead, where it gets the whole screen.
    var MIN_WIDTH = 820;
    var MIN_HEIGHT = 520;

    function fail() {
      if (loading) loading.classList.remove("on");
      // Nothing is live, so the bar must not say so
      if (live) live.hidden = true;
      media.classList.add("is-error");
    }

    /* A subframe that an extension or a proxy blocks, or that 404s, still fires
       load - with the browser's error page or the site's own 404 inside it -
       and never fires error. The frame is same-origin, so look inside: the
       real document has #root, an error page has nothing readable at all. */
    function frameHasDashboard() {
      var iframe = frame.querySelector("iframe");
      try {
        return !!(iframe && iframe.contentDocument && iframe.contentDocument.getElementById("root"));
      } catch (e) {
        return false;
      }
    }

    function open() {
      // Check both dimensions: a phone held sideways is wide enough but far
      // too short for the dashboard's first chart.
      if (window.innerWidth < MIN_WIDTH || window.innerHeight < MIN_HEIGHT) {
        window.open(src, "_blank", "noopener");
        return;
      }
      var existing = frame.querySelector("iframe");
      if (!existing) {
        var iframe = document.createElement("iframe");
        var timer = setTimeout(fail, LOAD_TIMEOUT);
        iframe.title = "Alpha Analytics interactive dashboard";
        iframe.setAttribute("allow", "fullscreen");
        iframe.addEventListener("load", function () {
          clearTimeout(timer);
          if (loading) loading.classList.remove("on");
          if (!frameHasDashboard()) { fail(); return; }
          // A key pressed inside the frame is delivered to its document, not
          // this one. The frame is same-origin: listen for Escape in it too.
          try {
            iframe.contentDocument.addEventListener("keydown", onKeydown);
          } catch (e) { /* a frame we cannot reach into is already an error */ }
        }, { once: true });
        iframe.addEventListener("error", function () { clearTimeout(timer); fail(); }, { once: true });
        if (loading) loading.classList.add("on");
        iframe.src = src;
        frame.appendChild(iframe);
      }
      media.classList.add("is-live");
      tools.hidden = false;
      live.hidden = false;
      // Re-launching after a failure must not quietly show the broken frame
      if (existing && !frameHasDashboard()) fail();
      if (launch) launch.setAttribute("aria-expanded", "true");
      setTimeout(function () {
        scrollToTarget(win);
        // Put keyboard users inside the panel they just opened
        frame.setAttribute("tabindex", "-1");
        frame.focus({ preventScroll: true });
      }, 60);
    }

    function shut() {
      if (!media.classList.contains("is-live")) return;
      media.classList.remove("is-live");
      media.classList.remove("is-error");
      tools.hidden = true;
      live.hidden = true;
      if (launch) {
        launch.setAttribute("aria-expanded", "false");
        launch.focus({ preventScroll: true });
      }
    }

    // Escape closes the panel, matching every other overlay on the page
    function onKeydown(e) {
      if (e.key === "Escape" && media.classList.contains("is-live")) shut();
    }

    if (launch) launch.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);
    document.addEventListener("keydown", onKeydown);
    return open;
  })();

  /* ---------- Command line ----------
     Type a section name and press Enter. It is a shortcut, never the only way
     to reach anything: every command maps to a link that is already on the
     page. Ctrl/Cmd+K focuses it; a modified shortcut cannot fire by accident
     while someone is typing (WCAG 2.1.4). */
  (function () {
    var form = document.getElementById("cmd");
    if (!form) return;
    var input = document.getElementById("cmd-input");
    var out = document.getElementById("cmd-out");
    var items = Array.prototype.slice.call(form.querySelectorAll("[data-cmd]"));
    form.hidden = false;

    var commands = {
      ABOUT: "#about", BIO: "#about",
      EXP: "#experience", EXPERIENCE: "#experience", DEALS: "#experience", WORK: "#experience",
      LEAD: "#leadership", LEADERSHIP: "#leadership",
      RSCH: "#projects", RESEARCH: "#projects", FYP: "#projects", PROJECTS: "#projects",
      EDU: "#education", EDUCATION: "#education",
      SKILLS: "#skills", TOOLS: "#skills",
      MSG: "#contact", CONTACT: "#contact", EMAIL: "#contact",
      TOP: "#top", HOME: "#top"
    };

    function say(text, isError) {
      out.textContent = text;
      out.classList.toggle("err", !!isError);
    }
    function openPop() { form.classList.add("is-open"); }
    function closePop() { form.classList.remove("is-open"); say(""); }

    function run(raw) {
      var q = String(raw || "").trim().toUpperCase().replace(/\s*<?GO>?$/, "").replace(/\s+/g, "");
      if (!q) { openPop(); return; }
      if (q === "HELP" || q === "?") { say("Pick a command below, or type one and press Enter."); openPop(); return; }
      if (q === "CV" || q === "RESUME") {
        window.open("assets/Kenneth_Wijaya_Resume.pdf", "_blank", "noopener");
        finish(); return;
      }
      if (q === "THEME" || q === "LIGHT" || q === "DARK") {
        setTheme(q === "THEME" ? (currentTheme() === "light" ? "dark" : "light") : q.toLowerCase());
        say("Theme set to " + currentTheme() + ".");
        input.value = "";
        return;
      }
      if (q === "DASH" || q === "DASHBOARD") {
        finish();
        var win = document.getElementById("dash-window");
        scrollToTarget(win);
        setTimeout(launchDashboard, reduceMotion ? 0 : 500);
        return;
      }
      if (commands[q]) { finish(); goTo(commands[q]); return; }
      // Unique prefix: "EDU" works, so should "ED"
      var keys = Object.keys(commands).filter(function (k) { return k.indexOf(q) === 0; });
      var targets = keys.map(function (k) { return commands[k]; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      if (targets.length === 1) { finish(); goTo(targets[0]); return; }
      say("Unknown command “" + q + "”. Type HELP for the list.", true);
      openPop();
    }
    function finish() { input.value = ""; filter(""); closePop(); input.blur(); }

    function filter(v) {
      var q = v.trim().toUpperCase();
      items.forEach(function (b) {
        var hit = !q || b.getAttribute("data-cmd").indexOf(q) === 0;
        b.parentNode.hidden = !hit;
        b.classList.remove("hit");
      });
      var first = items.filter(function (b) { return !b.parentNode.hidden; })[0];
      if (q && first) first.classList.add("hit");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value;
      // Enter on a partial match runs the highlighted command
      var hit = form.querySelector(".cmd-list .hit");
      if (hit && !commands[v.trim().toUpperCase()]) v = hit.getAttribute("data-cmd");
      run(v);
    });
    input.addEventListener("focus", openPop);
    input.addEventListener("input", function () { say(""); filter(input.value); openPop(); });
    items.forEach(function (b) {
      b.addEventListener("click", function () { run(b.getAttribute("data-cmd")); });
    });
    form.addEventListener("focusout", function () {
      setTimeout(function () { if (!form.contains(document.activeElement)) closePop(); }, 0);
    });
    form.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closePop(); input.blur(); }
    });
    document.addEventListener("click", function (e) { if (!form.contains(e.target)) closePop(); });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        if (getComputedStyle(form).display === "none") return;
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
  })();

  /* ---------- Gallery arrows ---------- */
  document.querySelectorAll(".gallery-wrap").forEach(function (wrap) {
    var track = wrap.querySelector(".gallery");
    if (!track) return;
    var prev = wrap.querySelector("[data-gallery-prev]");
    var next = wrap.querySelector("[data-gallery-next]");

    function step() {
      var fig = track.querySelector("figure");
      return fig ? fig.getBoundingClientRect().width + 12 : 400;
    }

    // Dim the arrows at the ends, and hide them when nothing can scroll
    function sync() {
      var max = track.scrollWidth - track.clientWidth;
      wrap.classList.toggle("no-scroll", max < 8);
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft >= max - 8;
    }

    if (prev) prev.addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    if (next) next.addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" });
    });
    track.addEventListener("scroll", function () { requestAnimationFrame(sync); }, { passive: true });
    window.addEventListener("resize", sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(track);
    sync();
  });

  /* ---------- Scroll: progress bar, header hide/show, back-to-top ---------- */
  var ticking = false, lastY = window.scrollY;
  var toTop = document.querySelector(".to-top");
  function handleScroll() {
    var y = window.scrollY;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    doc.style.setProperty("--p", p.toFixed(4));
    var cmdOpen = document.getElementById("cmd") && document.getElementById("cmd").classList.contains("is-open");
    if (top && !(menu && menu.classList.contains("open")) && !cmdOpen) {
      if (y > 160 && y > lastY + 6) top.classList.add("is-hidden");
      else if (y < lastY - 6 || y <= 160) top.classList.remove("is-hidden");
    }
    if (toTop) toTop.classList.toggle("show", y > 700);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(handleScroll); }
  }, { passive: true });
  handleScroll();
  if (toTop) toTop.addEventListener("click", function () {
    scrollToTarget(0);
    setTimeout(function () { focusTarget(document.getElementById("top")); }, reduceMotion ? 0 : 600);
  });
  // A header that slid away must come back when focus moves into it
  if (top) top.addEventListener("focusin", function () { top.classList.remove("is-hidden"); });

  /* ---------- Active section in the nav ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"))
    .filter(function (s) { return navAnchors.some(function (a) { return a.getAttribute("href") === "#" + s.id; }) || s.id === "top"; });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = "#" + entry.target.id;
        navAnchors.forEach(function (a) {
          var on = a.getAttribute("href") === id;
          a.classList.toggle("active", on);
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Clocks and footer year ---------- */
  var clocks = Array.prototype.slice.call(document.querySelectorAll("[data-tz]"));
  var london = document.getElementById("clock");
  if (window.Intl && Intl.DateTimeFormat) {
    var fmts = clocks.map(function (el) {
      try {
        return new Intl.DateTimeFormat("en-GB", { timeZone: el.getAttribute("data-tz"), hour: "2-digit", minute: "2-digit" });
      } catch (e) { return null; }
    });
    var londonFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
    var tick = function () {
      var now = new Date();
      clocks.forEach(function (el, i) { if (fmts[i]) el.textContent = fmts[i].format(now); });
      if (london) london.textContent = londonFmt.format(now);
    };
    tick();
    setInterval(tick, 20000);
  }
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Printing ----------
     A collapsed blotter row would print as a bare heading. Open every row for
     the print and put them back afterwards. */
  var closedForPrint = [];
  function openForPrint() {
    if (closedForPrint.length) return;
    closedForPrint = Array.prototype.slice.call(document.querySelectorAll("details:not([open])"));
    closedForPrint.forEach(function (d) { d.open = true; });
  }
  function restoreAfterPrint() {
    closedForPrint.forEach(function (d) { d.open = false; });
    closedForPrint = [];
  }
  window.addEventListener("beforeprint", openForPrint);
  window.addEventListener("afterprint", restoreAfterPrint);
  // Safari, and Chrome's own print-to-PDF, fire only the media query
  if (window.matchMedia) {
    var printRows = window.matchMedia("print");
    var onPrintRows = function (e) { if (e.matches) openForPrint(); else restoreAfterPrint(); };
    if (printRows.addEventListener) printRows.addEventListener("change", onPrintRows);
    else if (printRows.addListener) printRows.addListener(onPrintRows);
  }

  /* ---------- Everything below is motion ---------- */
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
    return;
  }

  /* Reveal groups */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
  document.querySelectorAll("[data-reveal]").forEach(function (el) { revealer.observe(el); });

  /* Counters */
  var snapCounters = [];
  // Once the figures have been snapped for a print they stay snapped: the
  // relayout for print media can start a count-up that would overwrite them.
  var countersSnapped = false;
  var counterIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      counterIo.unobserve(entry.target);
      entry.target._count();
    });
  }, { threshold: 0.2 });
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    // The real figure ships in the HTML so it survives without JS. Reset it to
    // zero only now that we know we can actually count it up.
    el.textContent = (0).toFixed(decimals);
    snapCounters.push(function () { el.textContent = target.toFixed(decimals); });
    el._count = function () {
      var start = null, dur = 1400;
      function frame(t) {
        if (countersSnapped) return;
        if (start === null) start = t;
        var k = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - k, 4);
        el.textContent = (target * eased).toFixed(decimals);
        if (k < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    };
    counterIo.observe(el);
  });

  /* Printing captures whatever is on screen, and a counter spends part of its
     life showing something other than the truth. Put the real figures back
     before the snapshot. beforeprint covers Chrome, Firefox and Edge; the
     print media query covers Safari. */
  function snapCountersToFinal() {
    countersSnapped = true;
    snapCounters.forEach(function (snap) { snap(); });
  }
  window.addEventListener("beforeprint", snapCountersToFinal);
  if (window.matchMedia) {
    var printMq = window.matchMedia("print");
    var onPrintMq = function (e) { if (e.matches) snapCountersToFinal(); };
    if (printMq.addEventListener) printMq.addEventListener("change", onPrintMq);
    else if (printMq.addListener) printMq.addListener(onPrintMq);
  }
})();
