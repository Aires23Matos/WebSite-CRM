import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
//const url= "http://localhost:3000"
const url = "https://customer-management-api-with-typescript.onrender.com";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    "/api": {
      target: url,
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
  },
});
