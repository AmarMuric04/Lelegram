import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_SERVER_PORT,
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
