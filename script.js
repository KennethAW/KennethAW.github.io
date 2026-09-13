// Kenneth Anthony Wijaya - portfolio
// Motion and interaction layer. Lenis handles smooth scrolling, anime.js v4
// handles the intro, scroll-synced spine, reveals, counters, and parallax.
// Every feature checks for its library and for prefers-reduced-motion, so the
// page still works as plain HTML if a CDN is blocked.

(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasAnime = typeof window.anime !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  /* ---------- Smooth scrolling ---------- */
  var lenis = null;
  if (hasLenis && !reduceMotion) {
    lenis = new window.Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true });
  }

  function scrollToTarget(target, offset) {
    if (target === 0) {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { offset: typeof offset === "number" ? offset : -20, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
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

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    if (a.hasAttribute("data-no-smooth")) return;
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (id === "#top") scrollToTarget(0); else scrollToTarget(target);
      history.replaceState(null, "", id);
      setTimeout(function () { focusTarget(target); }, reduceMotion ? 0 : 700);
    });
  });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  var nav = document.querySelector(".nav");

  /* The open menu is an opaque panel over the whole screen, but the page
     underneath stays in the tab order. Tabbing past the last menu link used to
     land on the hero's buttons, which are completely hidden behind it: focus
     vanished with no visible indicator, and a screen reader could wander into
     content the visitor could not see. inert removes them from both the tab
     order and the accessibility tree. The brand and the toggle sit above the
     panel and stay reachable, so there is always a way back out. */
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
    if (lenis) lenis.start();
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = !menu.classList.contains("open");
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      hideBehindMenu(open);
      if (lenis) { open ? lenis.stop() : lenis.start(); }
      if (open) {
        nav.classList.remove("is-hidden");
        if (hasAnime && !reduceMotion) {
          window.anime.animate(menu.querySelectorAll("a"), {
            opacity: [0, 1], y: [18, 0], delay: window.anime.stagger(50), duration: 600, ease: "outExpo"
          });
        }
        setTimeout(function () { var first = menu.querySelector("a"); if (first) first.focus(); }, 60);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { closeMenu(); toggle.focus(); }
    });
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
  (function () {
    var win = document.getElementById("dash-window");
    if (!win) return;
    var media = win.querySelector(".window-media");
    var frame = win.querySelector(".window-frame");
    var tools = win.querySelector(".window-tools");
    var live = win.querySelector(".live");
    var loading = win.querySelector(".window-loading");
    var launch = win.querySelector("[data-dash-launch]");
    var close = win.querySelector("[data-dash-close]");
    var src = "dashboard/index.html";
    var LOAD_TIMEOUT = 15000;

    function fail() {
      if (loading) loading.classList.remove("on");
      // Nothing is live, so the bar must not say so
      if (live) live.hidden = true;
      media.classList.add("is-error");
    }

    /* A subframe that an extension or a proxy blocks, or that 404s, still fires
       load - with the browser's error page or the site's own 404 inside it -
       and never fires error. The load event alone is therefore not evidence
       that the dashboard is there, and the panel used to announce "Live" over
       a blank grey box. The frame is same-origin, so look inside: the real
       document has #root, an error page has nothing readable at all. */
    function frameHasDashboard() {
      var iframe = frame.querySelector("iframe");
      try {
        return !!(iframe && iframe.contentDocument && iframe.contentDocument.getElementById("root"));
      } catch (e) {
        return false;
      }
    }

    function open() {
      // The dashboard is built for wide screens; on phones open it in its own tab
      if (window.innerWidth < 820) { window.open(src, "_blank", "noopener"); return; }
      var existing = frame.querySelector("iframe");
      if (!existing) {
        var iframe = document.createElement("iframe");
        var timer = setTimeout(fail, LOAD_TIMEOUT);
        iframe.title = "Alpha Analytics interactive dashboard";
        iframe.setAttribute("allow", "fullscreen");
        iframe.addEventListener("load", function () {
          clearTimeout(timer);
          if (loading) loading.classList.remove("on");
          if (!frameHasDashboard()) fail();
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
        scrollToTarget(win, -88);
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

    if (launch) launch.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);
    // Escape closes the panel, matching every other overlay on the page
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && media.classList.contains("is-live")) shut();
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
      return fig ? fig.getBoundingClientRect().width + 16 : 400;
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

  /* ---------- Scroll: progress bar, nav hide/show, back-to-top ---------- */
  var ticking = false, lastY = window.scrollY;
  var toTop = document.querySelector(".to-top");
  function handleScroll() {
    var y = window.scrollY;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    doc.style.setProperty("--p", p.toFixed(4));
    if (nav && !(menu && menu.classList.contains("open"))) {
      if (y > 140 && y > lastY + 6) nav.classList.add("is-hidden");
      else if (y < lastY - 6 || y <= 140) nav.classList.remove("is-hidden");
    }
    if (toTop) toTop.classList.toggle("show", y > 700);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(handleScroll); }
  }, { passive: true });
  handleScroll();
  if (toTop) toTop.addEventListener("click", function () { scrollToTarget(0); });

  /* ---------- Active section: nav links, sliding indicator, spine nodes ---------- */
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var navInner = document.querySelector(".nav-inner");
  var indicator = document.querySelector(".nav-indicator");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

  function moveIndicator() {
    if (!indicator || !navInner) return;
    var active = document.querySelector(".nav-links a.active");
    if (!active || window.innerWidth <= 820) { indicator.style.opacity = "0"; return; }
    var r = active.getBoundingClientRect(), n = navInner.getBoundingClientRect();
    indicator.style.left = (r.left - n.left) + "px";
    indicator.style.width = r.width + "px";
    indicator.style.opacity = "1";
  }

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
        var node = entry.target.querySelector(".sec-node");
        if (node) node.classList.add("on");
        moveIndicator();
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }
  window.addEventListener("resize", moveIndicator);

  /* ---------- Clock (London) and footer year ---------- */
  var clock = document.getElementById("clock");
  if (clock && window.Intl && Intl.DateTimeFormat) {
    var fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
    var tick = function () { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Pointer-driven micro-interactions (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn, .icon-btn, .to-top").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        el.style.setProperty("--mx", Math.max(-8, Math.min(8, dx)).toFixed(1) + "px");
        el.style.setProperty("--my", Math.max(-8, Math.min(8, dy)).toFixed(1) + "px");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      });
    });

    document.querySelectorAll(".spot").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--x", (e.clientX - r.left) + "px");
        el.style.setProperty("--y", (e.clientY - r.top) + "px");
      });
    });

    var hero = document.querySelector(".hero");
    if (hero) {
      var pending = false, px = 0, py = 0;
      window.addEventListener("mousemove", function (e) {
        if (window.scrollY > window.innerHeight) return;
        px = (e.clientX / window.innerWidth - 0.5) * 2;
        py = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!pending) {
          pending = true;
          requestAnimationFrame(function () {
            hero.style.setProperty("--px", px.toFixed(3));
            hero.style.setProperty("--py", py.toFixed(3));
            pending = false;
          });
        }
      }, { passive: true });
    }
  }

  /* ---------- Hero price path (drawn with or without anime.js) ---------- */
  function buildHeroPath() {
    var line = document.getElementById("heroLine");
    var area = document.getElementById("heroArea");
    if (!line) return null;
    var seed = 20260906;
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    var n = 90, w = 1000, y = 238, pts = [];
    for (var i = 0; i <= n; i++) {
      var x = (i / n) * w;
      var drift = -1.6;
      var noise = (rnd() - 0.5) * 26;
      y = Math.max(46, Math.min(282, y + drift + noise));
      pts.push([x.toFixed(1), y.toFixed(1)]);
    }
    var d = "M" + pts.map(function (p) { return p[0] + " " + p[1]; }).join(" L");
    line.setAttribute("d", d);
    if (area) area.setAttribute("d", d + " L" + w + " 300 L0 300 Z");
    return { line: line, area: area };
  }
  var heroPath = buildHeroPath();

  /* ---------- Everything below needs anime.js and motion allowed ---------- */
  if (!hasAnime || reduceMotion) {
    if (heroPath && heroPath.area) heroPath.area.setAttribute("opacity", "1");
    document.querySelectorAll(".spine-fill").forEach(function (el) { el.style.transform = "none"; });
    return;
  }

  var anime = window.anime;
  var animate = anime.animate, createTimeline = anime.createTimeline, stagger = anime.stagger,
      onScroll = anime.onScroll, utils = anime.utils, svg = anime.svg;

  /* Intro timeline */
  var intro = createTimeline({ defaults: { ease: "outExpo", duration: 1100 } });
  utils.set(".hero-title .line-inner", { y: "110%" });
  utils.set([".hero-top", ".hero-name", ".hero-lede", ".hero-actions", ".hero-links", ".hero-cue"], { opacity: 0, y: 16 });
  utils.set(".hero-grid", { opacity: 0 });

  intro
    .add(".hero-grid", { opacity: [0, 0.55], duration: 1800, ease: "outQuad" }, 0)
    .add(".hero-top", { opacity: 1, y: 0 }, 100)
    .add(".hero-name", { opacity: 1, y: 0 }, 220)
    .add(".hero-title .line-inner", { y: ["110%", "0%"], delay: stagger(120), duration: 1300 }, 300)
    .add(".hero-lede", { opacity: 1, y: 0 }, 800)
    .add(".hero-actions", { opacity: 1, y: 0 }, 950)
    .add(".hero-links", { opacity: 1, y: 0 }, 1050)
    .add(".hero-cue", { opacity: 1, y: 0 }, 1300);

  if (heroPath) {
    intro.add(svg.createDrawable("#heroLine"), { draw: ["0 0", "0 1"], duration: 2600, ease: "inOutQuad" }, 500);
    if (heroPath.area) intro.add("#heroArea", { opacity: [0, 1], duration: 1400, ease: "outQuad" }, 1900);
  }

  /* Hero content recedes as you scroll away from it */
  var heroInner = document.querySelector(".hero-inner");
  if (heroInner) {
    animate(heroInner, {
      y: [0, -70],
      opacity: [1, 0.1],
      ease: "linear",
      autoplay: onScroll({ target: ".hero", enter: "top top", leave: "top bottom", sync: true })
    });
  }

  /* Spine fill synced to scroll through the thread */
  var thread = document.querySelector(".thread");
  if (thread) {
    animate(".spine-fill", {
      scaleY: [0, 1],
      ease: "linear",
      autoplay: onScroll({ target: thread, enter: "center top", leave: "bottom-=40 bottom", sync: true })
    });
  }

  /* Section headings: split into words and letters, then rise in with a stagger */
  function splitChars(el) {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var wd = document.createElement("span");
            wd.className = "wd";
            part.split("").forEach(function (c) {
              var s = document.createElement("span");
              s.className = "ch";
              s.textContent = c;
              s.setAttribute("aria-hidden", "true");
              wd.appendChild(s);
            });
            frag.appendChild(wd);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    }
    walk(el);
    return el.querySelectorAll(".ch");
  }
  document.querySelectorAll(".sec h2").forEach(function (h2) {
    var chars = splitChars(h2);
    if (!chars.length) return;
    utils.set(chars, { opacity: 0, y: 18 });
    animate(chars, {
      opacity: 1, y: 0, duration: 900, ease: "outExpo", delay: stagger(14),
      autoplay: onScroll({ target: h2, enter: "bottom-=60 top", repeat: false })
    });
  });

  /* Reveal groups */
  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    var targets = el.hasAttribute("data-stagger") ? Array.prototype.slice.call(el.children) : [el];
    if (!targets.length) return;
    utils.set(targets, { opacity: 0, y: 24 });
    animate(targets, {
      opacity: 1,
      y: 0,
      duration: 1100,
      ease: "outExpo",
      delay: stagger(70),
      autoplay: onScroll({ target: el, enter: "bottom-=60 top", repeat: false })
    });
  });

  /* Counters */
  var snapCounters = [];
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var state = { v: 0 };
    // The real figure ships in the HTML so it survives without JS. Reset it to
    // zero only now that we know we can actually count it up.
    el.textContent = state.v.toFixed(decimals);
    snapCounters.push(function () { el.textContent = target.toFixed(decimals); });
    animate(state, {
      v: target,
      duration: 1800,
      ease: "outExpo",
      onUpdate: function () { el.textContent = state.v.toFixed(decimals); },
      autoplay: onScroll({ target: el, enter: "bottom-=40 top", repeat: false })
    });
  });

  /* Printing captures whatever is on screen at that moment, and these counters
     spend most of their life showing something other than the truth: zero until
     they are scrolled into view, and a partial figure while they count up. A
     visitor who loads the page and prints it without scrolling was getting a
     CGPA of 0.00 out of 5.00; one who printed during the animation got 2.66.
     Put the real figures back before the snapshot is taken. beforeprint covers
     Chrome, Firefox and Edge; the print media query covers Safari. */
  function snapCountersToFinal() {
    snapCounters.forEach(function (snap) { snap(); });
  }
  window.addEventListener("beforeprint", snapCountersToFinal);
  if (window.matchMedia) {
    var printMq = window.matchMedia("print");
    var onPrintMq = function (e) { if (e.matches) snapCountersToFinal(); };
    if (printMq.addEventListener) printMq.addEventListener("change", onPrintMq);
    else if (printMq.addListener) printMq.addListener(onPrintMq);
  }

  /* Parallax on the featured screenshot */
  var parallax = document.querySelector(".parallax");
  if (parallax) {
    animate(parallax, {
      y: ["0%", "-14%"],
      ease: "linear",
      autoplay: onScroll({ target: parallax.parentElement, enter: "bottom top", leave: "top bottom", sync: true })
    });
  }

  /* Section index ticks in with the heading */
  document.querySelectorAll(".sec-index").forEach(function (el) {
    utils.set(el, { opacity: 0, x: -10 });
    animate(el, {
      opacity: 1, x: 0, duration: 900, ease: "outExpo",
      autoplay: onScroll({ target: el, enter: "bottom-=80 top", repeat: false })
    });
  });
})();
