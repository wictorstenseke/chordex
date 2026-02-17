import path from "path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// Determine base path for deployment
const getBasePath = () => {
  // BASE_PATH environment variable takes precedence
  if (process.env.BASE_PATH) {
    return process.env.BASE_PATH;
  }
  // Default to root path for local development
  return "/";
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(), tailwindcss()],
  base: getBasePath(),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
