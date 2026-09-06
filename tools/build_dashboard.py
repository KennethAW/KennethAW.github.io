"""Rebuild the embedded Alpha Analytics dashboard from the FYP repo.

Usage:
    python tools/build_dashboard.py "C:/path/to/Final-Year-Project-Rev-1.0/dashboard-react"

What it does:
  1. Copies dashboard-react to a temp folder (the FYP repo is left untouched).
  2. Switches BrowserRouter -> HashRouter so routes work from /dashboard/ with no server rewrites.
  3. Rewrites absolute "/data/..." fetches to base-relative ones.
  4. Runs `npm install` and `vite build --base=./`.
  5. Replaces ./dashboard in this site with the fresh build.

Requires Node.js 18+ on PATH.
"""
import pathlib, re, shutil, subprocess, sys, tempfile

if len(sys.argv) < 2:
    sys.exit(__doc__)

src = pathlib.Path(sys.argv[1]).resolve()
site = pathlib.Path(__file__).resolve().parent.parent
if not (src / "package.json").exists():
    sys.exit(f"No package.json in {src}")

tmp = pathlib.Path(tempfile.mkdtemp(prefix="dashboard-build-"))
work = tmp / "dashboard-react"
shutil.copytree(src, work, ignore=shutil.ignore_patterns("node_modules", "dist", ".env"))

app = work / "src" / "App.tsx"
app.write_text(app.read_text(encoding="utf-8").replace("BrowserRouter", "HashRouter"), encoding="utf-8")
for f in (work / "src").rglob("*.ts*"):
    t = f.read_text(encoding="utf-8")
    t2 = t.replace("`/data/", "`${import.meta.env.BASE_URL}data/")
    t2 = re.sub(r'"/data/([^"]*)"', r'`${import.meta.env.BASE_URL}data/\1`', t2)
    if t2 != t:
        f.write_text(t2, encoding="utf-8")

npm = "npm.cmd" if sys.platform == "win32" else "npm"
npx = "npx.cmd" if sys.platform == "win32" else "npx"
subprocess.run([npm, "install", "--no-audit", "--no-fund"], cwd=work, check=True)
subprocess.run([npx, "vite", "build", "--base=./"], cwd=work, check=True)

out = site / "dashboard"
if out.exists():
    shutil.rmtree(out)
shutil.copytree(work / "dist", out)
shutil.rmtree(tmp, ignore_errors=True)
print(f"Dashboard rebuilt into {out}")
