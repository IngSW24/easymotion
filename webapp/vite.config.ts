import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

const usePolling = process.env.POLLING === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // Custom plugin to load markdown files
    {
      name: "markdown-loader",
      transform(code, id) {
        if (id.slice(-3) === ".md") {
          // For .md files, get the raw content
          return `export default ${JSON.stringify(code)};`;
        }
      },
    },
  ],
  test: {
    global: true,
    environment: "jsdom",
  },
  server: {
    watch: usePolling
      ? {
          usePolling: true,
          ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
        }
      : undefined,
  },
} as UserConfig);
