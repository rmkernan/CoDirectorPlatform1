/**
 * @file react-app-env.d.ts
 * @description Type definitions for the React application environment.
 * This file is required for Create React App and TypeScript to work together.
 * It provides type definitions for the React environment and global declarations.
 * @created 2025-05-22 19:56 ET
 * @lastUpdated 2025-05-22 19:56 ET
 * @module types
 */

/// <reference types="react-scripts" />

/**
 * NodeJS namespace augmentation for environment variables
 */
declare namespace NodeJS {
  /**
   * Environment variables available in the application
   */
  interface ProcessEnv {
    /** Application environment: development, production, or test */
    NODE_ENV: 'development' | 'production' | 'test';
    /** Application version from package.json */
    REACT_APP_VERSION: string;
    // Add other environment variables here as needed
  }
}

/**
 * JSX namespace augmentation for custom elements
 * This is needed for TypeScript to recognize JSX in .tsx files
 * and to provide type checking for JSX elements
 */
declare namespace JSX {
  /**
   * Interface for intrinsic (built-in) JSX elements
   */
  interface IntrinsicElements {
    /** Index signature for element names with their corresponding props */
    [elemName: string]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
