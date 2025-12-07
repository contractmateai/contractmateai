// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        analysis: "analysis.html",
        contact: "contact.html",
        privacy: "privacy.html",
        terms: "terms.html",
        cookies: "cookies.html"
      }
    }
  }
});
