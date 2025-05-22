/// <reference types="react-scripts" />

// This file is required for Create React App and TypeScript to work together
// It provides type definitions for the React environment

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_VERSION: string;
    // Add other environment variables here as needed
  }
}

// This is needed for TypeScript to recognize JSX in .tsx files
// and to provide type checking for JSX elements
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
