/**
 * @file vite.config.ts
 * @description Vite configuration for the Co-Director Platform application.
 * Configures build settings, development server, and path aliases.
 * @created 2025-05-22 20:03 ET
 * @lastUpdated 2025-05-22 20:03 ET
 * @module config
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite configuration object
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
});
