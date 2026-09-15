import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Relative base so the built page works from any path, the same reason the
// dashboard is built with --base=./
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: { target: "es2022", cssCodeSplit: false, assetsInlineLimit: 0 },
});
