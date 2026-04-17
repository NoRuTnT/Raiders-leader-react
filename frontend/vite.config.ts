import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: react({}),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://moonhub.kr",
        changeOrigin: true,
        secure: true,
      },
      "/actuator": {
        target: "https://moonhub.kr",
        changeOrigin: true,
        secure: true,
      },
      "/lalabot": {
        target: "https://moonhub.kr",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
  },
});
