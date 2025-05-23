/**
 * @file main.tsx
 * @description Entry point of the React application that bootstraps the app with React 18 features.
 * This file initializes font resources, creates the React root, and renders the application
 * within a StrictMode wrapper and RouterProvider for routing functionality.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 22:20 ET
 * @module main
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

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

// Get the root DOM element where the app will be mounted
const container = document.getElementById('root');

// Throw an error if the root element is not found
if (!container) {
  throw new Error('Failed to find the root element');
}

// Create the root for React 18 concurrent features
const root = createRoot(container);

/**
 * Render the application with:
 * - React.StrictMode for additional development checks
 * - ThemeProvider for Material-UI theming
 * - CssBaseline for consistent baseline styles
 * - RouterProvider for client-side routing
 */
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
