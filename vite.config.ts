import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// Standard Vite + React SPA build. The `@/*` alias mirrors tsconfig.json so
// source imports like `@/components/foo` resolve in both TypeScript and Vite.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/RIFF_LAB12/',
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});