/**
 * @file main.tsx
 * @description Entry point of the React application that bootstraps the app with React 18 features.
 * This file initializes font resources, creates the React root, and renders the application
 * within a StrictMode wrapper and BrowserRouter for routing functionality.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 19:52 ET
 * @module main
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

/**
 * Initialize Google Fonts for the application
 * Loads the Roboto font family with various weights used throughout the UI
 */
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

/**
 * Initialize Material Icons font
 * Loads the Material Icons font used for UI icons across the application
 */
const materialIcons = document.createElement('link');
materialIcons.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
materialIcons.rel = 'stylesheet';
document.head.appendChild(materialIcons);

/**
 * Get the root DOM element where the React application will be mounted
 */
const container = document.getElementById('root');

/**
 * Initialize and render the React application
 * Uses React 18's createRoot API for concurrent rendering features
 * Wraps the application in StrictMode for additional development checks
 * and BrowserRouter for client-side routing capabilities
 */
if (container) {
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
