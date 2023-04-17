import { defineConfig } from "vite";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";

export default defineConfig({
  plugins: [chunkSplitPlugin()],
  server: { host: "0.0.0.0", port: 8000 },
  clearScreen: false,
  root: ".",
  base: "./",
});