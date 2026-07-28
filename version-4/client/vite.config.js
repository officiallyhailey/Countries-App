// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// <https://vite.dev/config/>
export default defineConfig({
  server: {
    // the frontend fetches "/api/..." and this sends those requests on to the Express server running on port 3005. doing it this way means I don't get CORS errors and don't have to write out localhost URLs in every component. the rewrite takes the "/api" bit back off because the server's routes don't include it (/get-all-users, not /api/get-all-users). this is only for running locally, a deployed version needs the same setup on the host
    proxy: {
      "/api": {
        target: "http://localhost:3005",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()],
});