import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this to your desired port
    host: "localhost", // Optional: Change to '0.0.0.0' if you want to access it on your network
  },
});
