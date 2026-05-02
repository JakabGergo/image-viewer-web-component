import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/image-viewer.js",
      name: "ImageViewer",
      fileName: "image-viewer",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["lit"], // don't bundle lit, let the consumer provide it
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
