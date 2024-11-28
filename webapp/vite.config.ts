import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const usePolling = process.env.POLLING === "true";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: usePolling
      ? {
          usePolling: true,
          ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
        }
      : undefined,
  },
});
