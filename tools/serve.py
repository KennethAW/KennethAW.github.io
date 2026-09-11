"""Serve the site locally.

Reads the port from the PORT environment variable (falling back to 5500), so
the harness can assign a free one instead of fighting over a fixed port.

Threaded on purpose: `python -m http.server` handles one request at a time,
which serialises the page's stylesheet, fonts and scripts and makes any
performance measurement meaningless. Lighthouse reported a 2.2s first paint
against the single-threaded server and 0.3s against this one, for the same
files.

Usage:  python tools/serve.py [port]
"""
import functools
import http.server
import os
import socketserver
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def end_headers(self):
        # Local preview should always show the current file, not a cached one
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


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
