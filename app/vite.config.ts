/**
 * @file vite.config.ts
 * @description Vite configuration for the Co-Director Platform application.
 * Configures build settings, development server, and path aliases.
 * Includes SPA configuration for HashRouter-based client-side routing.
 * @created 2025-05-22 20:03 ET
 * @lastUpdated 2025-05-22 22:48 ET
 * @module config
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Vite configuration object
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    strictPort: true,
    // Handle SPA fallback for client-side routing with BrowserRouter
    fs: {
      strict: false,
    },
    // Enable CORS for development
    cors: true,
    // Proxy API requests if needed
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Configure SPA settings for client-side routing with BrowserRouter
  // This setup enables clean URLs and client-side routing
  // Note: For production, ensure your server is configured to serve index.html for all routes
  // If using Vercel, Netlify, or similar, they handle this automatically
  // For custom servers, you might need to configure URL rewriting
  appType: 'spa',
  base: '/', // Base URL for the application (empty string or '/' for root)
  preview: {
    port: 3000,
    strictPort: true,
  },
  // Configure build output for SPA
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
