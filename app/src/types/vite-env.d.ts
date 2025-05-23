/**
 * @file vite-env.d.ts
 * @description TypeScript type definitions for Vite-specific environment variables.
 * This file ensures that TypeScript understands the structure of `import.meta.env`.
 * @created 2025-05-23 14:19 ET
 * @lastUpdated 2025-05-23 14:19 ET
 * @module Types/ViteEnv
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  // Add other custom environment variables here as needed
  // Example: readonly VITE_API_URL: string;
  // Example: readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
