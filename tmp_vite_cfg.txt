import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // important so file:// paths work
  plugins: [
    tsconfigPaths(),
    react(),
    viteSingleFile(), // inlines JS, CSS, assets into index.html
  ],
  build: {
    target: "es2018",
    cssCodeSplit: false, // all CSS inlined into HTML
    assetsInlineLimit: 100_000_000, // inline even large images/fonts as data: URIs
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // bundle all JS into one file
      },
    },
  },
});
