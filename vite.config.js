// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        timeout: 120000, // 2 minute timeout for slow requests
        proxyTimeout: 120000,
        logLevel: "debug",
        // Prevent Vite from buffering large responses
        ws: false,
      },
    },
  },
});
