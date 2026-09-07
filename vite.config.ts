import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    build: {
      chunkSizeWarningLimit: 2000,
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
