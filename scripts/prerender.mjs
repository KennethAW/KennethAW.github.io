/* Render the app to static HTML at build time and inject it into the built
   template. Without this the page ships an empty <div id="root"> and the
   content disappears for anyone with JavaScript off, for link previews, and
   for anything that reads HTML rather than running it. */
import { readFile, writeFile, rm } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const template = await readFile(path.join(dist, "index.html"), "utf8");
const { render } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

const html = render();
if (!html || html.length < 200) {
  console.error("prerender produced almost nothing; refusing to write an empty page");
  process.exit(1);
}
if (!template.includes("<!--app-html-->")) {
  console.error("template has no <!--app-html--> placeholder");
  process.exit(1);
}
await writeFile(path.join(dist, "index.html"), template.replace("<!--app-html-->", html));
await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${html.length} chars of HTML into dist/index.html`);
