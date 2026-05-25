import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Menangkap semua request axios yang diawali dengan '/api'
      "/api": {
        target: "https://untracked-exponent-oboe.ngrok-free.dev", // URL Ngrok Backend kamu
        changeOrigin: true,
        secure: false,
        // Sekaligus menyisipkan jamu anti-warning dari Ngrok di latar belakang
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
