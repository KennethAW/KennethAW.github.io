"""Serve the site locally.

Reads the port from the PORT environment variable (falling back to 5500), so
the harness can assign a free one instead of fighting over a fixed port.

Threaded on purpose: `python -m http.server` handles one request at a time,
which serialises the page's stylesheet, fonts and scripts and makes any
performance measurement meaningless. Lighthouse reported a 2.2s first paint
against the single-threaded server and 0.3s against this one, for the same
files.

Compressing on purpose, for the same reason. GitHub Pages gzips text
responses, so the bytes a visitor actually downloads are a third of what is on
disk: index.html 40.6 KB on disk against 10.1 KB over the wire, styles.css
35.1 against 8.5, script.js 20.1 against 5.9, anime.js 118.0 against 41.1. A
plain file server sends the uncompressed version, which put roughly 150 KB of
phantom transfer into every local measurement and made Lighthouse report
"enable text compression, est. savings 160 KiB" against a site that already
has it.

Usage:  python tools/serve.py [port]
"""
import functools
import gzip
import http.server
import os
import socketserver
import sys

_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# The site is a build now, so serve what actually ships. SITE_ROOT overrides it
# for anyone wanting to point the checks at something else.
ROOT = os.environ.get("SITE_ROOT") or (
    os.path.join(_REPO, "dist") if os.path.isdir(os.path.join(_REPO, "dist")) else _REPO
)
# What GitHub Pages compresses. Images, fonts and PDFs are already compressed
# and gzipping them again only costs time.
TEXT_TYPES = (".html", ".htm", ".css", ".js", ".mjs", ".json", ".svg", ".xml",
              ".txt", ".map", ".webmanifest")


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def end_headers(self):
        # Local preview should always show the current file, not a cached one
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _compressible(self):
        """The file this request resolves to, when gzipping it is worthwhile."""
        if "gzip" not in self.headers.get("Accept-Encoding", ""):
            return None
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            # A directory without a trailing slash needs the base class's 301
            if not self.path.split("?", 1)[0].endswith("/"):
                return None
            path = os.path.join(path, "index.html")
        if not os.path.isfile(path) or not path.lower().endswith(TEXT_TYPES):
            return None
        return path

    def do_GET(self):
        path = self._compressible()
        if path is None:
            return super().do_GET()
        try:
            body = gzip.compress(open(path, "rb").read(), 6)
        except OSError:
            return super().do_GET()
        self.send_response(200)
        self.send_header("Content-type", self.guess_type(path))
        self.send_header("Content-Encoding", "gzip")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Vary", "Accept-Encoding")
        self.end_headers()
        self.wfile.write(body)


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else int(os.environ.get("PORT", 5500))
    with Server(("127.0.0.1", port), functools.partial(Handler, directory=ROOT)) as httpd:
        print(f"Serving {ROOT} at http://localhost:{port}", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
