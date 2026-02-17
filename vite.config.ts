import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(), tailwindcss()],
  base: process.env.BASE_PATH || (process.env.CI ? "/chordex/" : "/"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
