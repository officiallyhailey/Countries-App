import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// <https://vite.dev/config/>
export default defineConfig({
  server: {
    // the frontend fetches "/api/..." and this sends those requests on to the Express server on Render. doing it this way means I don't get CORS errors and don't have to write out the full URL in every component. the rewrite takes the "/api" bit back off because the server's routes don't include it (/get-all-users, not /api/get-all-users). this block only applies to `npm run dev`, the deployed site uses public/_redirects to do the same job
    proxy: {
      "/api": {
        target: "https://countries-app-csgs.onrender.com/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()],
});