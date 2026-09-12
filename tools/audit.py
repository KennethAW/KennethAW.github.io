"""One command that scores the site, so "better" is a fact rather than an opinion.

Combines four independent signals into a single JSON scorecard:

  gates        check_site.py (static) and verify_site.py (behavioural, 21
               assertions in a real browser). These are pass/fail. A change
               that breaks one is a regression, full stop.
  lighthouse   performance / accessibility / best-practices / SEO plus the
               core web vitals, on both desktop and mobile presets.
  weight       bytes and request count for the initial page load.
  links        every external URL the site points at, so a repo going private
               or a profile moving is caught rather than discovered by a
               recruiter.

Usage:
    python tools/audit.py                      # against a local server
    python tools/audit.py --url https://kennethaw.github.io/
    python tools/audit.py --quick              # skip Lighthouse (fast loop)
    python tools/audit.py --out report.json

Exit code 0 if every gate passes, 1 otherwise. The JSON goes to stdout unless
--out is given, so it can be diffed between runs to prove a change helped.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, "tools")
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36")

# Lighthouse floors. The site currently sits at 100 across the board; a change
# that drops any category below these is not an improvement.
FLOORS = {"performance": 98, "accessibility": 100, "best-practices": 100, "seo": 100}
CLS_CEILING = 0.02


def run(cmd, timeout=600, cwd=ROOT):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True,
                          timeout=timeout, shell=False)


# ----------------------------------------------------------------- gates
def static_checks():
    p = run([sys.executable, os.path.join(TOOLS, "check_site.py")], timeout=120)
    failures = [ln.strip(" -") for ln in p.stdout.splitlines() if ln.strip().startswith("-")]
    return {"pass": p.returncode == 0, "failures": failures,
            "summary": p.stdout.strip().splitlines()[-1] if p.stdout.strip() else ""}


def behavioural(url):
    out = os.path.join(TOOLS, "_verify_out", "result.json")
    if os.path.exists(out):
        os.remove(out)
    p = run([sys.executable, os.path.join(TOOLS, "verify_site.py"), url], timeout=900)
    if os.path.exists(out):
        data = json.load(open(out, encoding="utf-8"))
        return {"pass": not data["failures"], "passed": data["passed"],
                "failed": len(data["failures"]), "failures": data["failures"]}
    return {"pass": False, "passed": 0, "failed": -1,
            "failures": ["verify_site.py produced no result: " + (p.stderr or p.stdout)[-300:]]}


# ------------------------------------------------------------ lighthouse
def lighthouse(url, preset):
    out = os.path.join(TOOLS, "_verify_out", f"lh-{preset}.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    cmd = ["npx", "--yes", "lighthouse@12", url, "--quiet",
           "--chrome-flags=--headless=new --no-sandbox",
           "--only-categories=performance,accessibility,best-practices,seo",
           "--output=json", "--output-path=" + out]
    if preset == "desktop":
        cmd.append("--preset=desktop")
    try:
        run(cmd, timeout=600)
    except subprocess.TimeoutExpired:
        return {"error": "lighthouse timed out"}
    if not os.path.exists(out):
        return {"error": "lighthouse produced no report"}
    d = json.load(open(out, encoding="utf-8"))
    cats = {k: round(v["score"] * 100) for k, v in d["categories"].items()}
    a = d["audits"]

    def num(key):
        return round(a.get(key, {}).get("numericValue") or 0)

    reqs = a.get("network-requests", {}).get("details", {}).get("items", [])
    host = url.split("/")[2] if "//" in url else ""
    return {**cats,
            "fcp_ms": num("first-contentful-paint"),
            "lcp_ms": num("largest-contentful-paint"),
            "tbt_ms": num("total-blocking-time"),
            "cls": round(a.get("cumulative-layout-shift", {}).get("numericValue") or 0, 4),
            "bytes_kb": round(num("total-byte-weight") / 1024),
            "requests": len(reqs),
            "third_party_hosts": sorted({r["url"].split("/")[2] for r in reqs
                                         if r["url"].startswith("http") and host not in r["url"]})}


# ----------------------------------------------------------------- links
def external_links():
    html = ""
    for page in ("index.html", "404.html"):
        html += open(os.path.join(ROOT, page), encoding="utf-8").read()
    urls = sorted({u for u in re.findall(r'href="(https?://[^"]+)"', html)})
    results, broken = {}, []
    for u in urls:
        code = 0
        for attempt in range(2):
            try:
                req = urllib.request.Request(u, headers={"User-Agent": UA}, method="GET")
                with urllib.request.urlopen(req, timeout=20) as r:
                    code = r.status
                break
            except urllib.error.HTTPError as e:
                code = e.code
                break
            except Exception:
                code = 0
                time.sleep(1)
        results[u] = code
        # LinkedIn answers bots with 999/403; that is not evidence of a dead link
        tolerated = code in (200, 999) or ("linkedin.com" in u and code in (403, 429, 999))
        if not tolerated:
            broken.append({"url": u, "status": code})
    return {"checked": len(urls), "broken": broken, "all": results}


# ---------------------------------------------------------------- verdict
def verdict(report):
    reasons = []
    if not report["gates"]["static"]["pass"]:
        reasons.append("static checks failed")
    if not report["gates"]["behavioural"]["pass"]:
        reasons.append("behavioural checks failed")
    if report["links"]["broken"]:
        reasons.append(f"{len(report['links']['broken'])} broken external link(s)")
    for preset, scores in report.get("lighthouse", {}).items():
        if "error" in scores:
            reasons.append(f"lighthouse {preset}: {scores['error']}")
            continue
        for cat, floor in FLOORS.items():
            if scores.get(cat, 0) < floor:
                reasons.append(f"lighthouse {preset} {cat} {scores.get(cat)} < {floor}")
        if scores.get("cls", 0) > CLS_CEILING:
            reasons.append(f"lighthouse {preset} CLS {scores['cls']} > {CLS_CEILING}")
    return ("PASS" if not reasons else "FAIL"), reasons


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default="http://localhost:5500")
    ap.add_argument("--quick", action="store_true", help="skip Lighthouse")
    ap.add_argument("--out")
    args = ap.parse_args()
    url = args.url.rstrip("/")

    report = {"timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"), "url": url, "gates": {}}
    report["gates"]["static"] = static_checks()
    report["gates"]["behavioural"] = behavioural(url)
    report["links"] = external_links()
    if not args.quick:
        report["lighthouse"] = {p: lighthouse(url + "/", p) for p in ("desktop", "mobile")}

    report["verdict"], report["reasons"] = verdict(report)

    text = json.dumps(report, indent=2)
    if args.out:
        open(args.out, "w", encoding="utf-8").write(text)
        print(f"{report['verdict']}  ->  {args.out}")
        for r in report["reasons"]:
            print("  -", r)
    else:
        print(text)
    return 0 if report["verdict"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
