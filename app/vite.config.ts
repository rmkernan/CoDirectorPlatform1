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
    // Handle SPA fallback for client-side routing
    fs: {
      strict: false,
    },
  },
  // Configure SPA settings for HashRouter-based client-side routing
  // This enables reliable navigation, direct URL access, and page refreshes
  // without requiring special server configuration
  appType: 'spa',
  base: '/',
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
