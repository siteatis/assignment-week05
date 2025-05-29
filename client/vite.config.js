import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        messageboards: resolve(__dirname, "messageboards.html"),
        messages: resolve(__dirname, "messages.html"),
        reporting: resolve(__dirname, "reporting.html"),
      },
    },
  },
});
