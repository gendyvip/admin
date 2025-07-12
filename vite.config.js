import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Performance optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
          ],
          charts: ["recharts"],
          icons: ["@tabler/icons-react", "lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  // Development optimizations with improved connection settings
  server: {
    port: 5173,
    host: "0.0.0.0", // Allow connections from any IP
    strictPort: true, // Fail if port is already in use
    open: true, // Automatically open browser
    cors: true, // Enable CORS
    hmr: {
      port: 5173, // Use same port for HMR
      overlay: true, // Show errors in browser overlay
    },
    watch: {
      usePolling: false, // Use native file system events
      interval: 100, // Polling interval if needed
    },
  },
  // Optimize dependencies with fix for @tabler/icons-react
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "zustand", "axios"],
    exclude: [
      "@tabler/icons-react", // Exclude problematic dependency
    ],
  },
  // CSS optimizations
  css: {
    devSourcemap: true,
  },
  // Additional optimizations
  define: {
    __DEV__: true,
  },
  // Prevent connection issues
  clearScreen: false, // Keep terminal output visible
  logLevel: "info", // Set log level
});
