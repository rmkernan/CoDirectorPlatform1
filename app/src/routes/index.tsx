/**
 * @file index.tsx
 * @description Application routes configuration
 * Configured to work with React Router v7 and Vite.
 * 
 * Router Selection Notes:
 * - BrowserRouter (current): Uses clean URLs (e.g., /home, /settings) but requires server configuration
 *   to serve the index.html for all routes in production. This is the recommended approach for new applications.
 *   KNOWN ISSUE: There's a current issue where clicking the Home tab causes a full page refresh instead of a client-side
 *   navigation. This is likely due to how the root route ('/') is being handled in the navigation setup.
 * 
 * - HashRouter (alternative): Uses URLs with # (e.g., /#/home, /#/settings) which works without server
 *   configuration but has less clean URLs. This was previously used to avoid server configuration issues
 *   but has been replaced with BrowserRouter for better UX. The HashRouter might behave better with the
 *   current navigation setup if the refresh issue becomes problematic.
 * 
 * If you need to switch back to HashRouter in the future, make these changes:
 * 1. Replace createBrowserRouter with createHashRouter
 * 2. Update the vite.config.ts to remove any BrowserRouter-specific settings
 * 3. Update all internal links to work with hash-based routing
 * 
 * @created 2025-05-22 22:15 ET
 * @lastUpdated 2025-05-24 09:25 ET
 * @module routes
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Import placeholder components for now
// These will be replaced with actual components as they are developed
const ChatPage = () => <div>Chat Page</div>;
const HistoryPage = () => <div>History Page</div>;
const SettingsPage = () => <div>Settings Page</div>;

// Create a wrapper component that includes both Layout and ErrorBoundary
const LayoutWithErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Layout>{children}</Layout>
  </ErrorBoundary>
);

/**
 * Main application router using BrowserRouter for clean URLs and client-side routing
 * This approach provides better UX with clean URLs while maintaining client-side routing
 * @see https://reactrouter.com/en/main/routers/create-browser-router
 */
export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/home" replace />,
    },
    {
      path: '/home',
      element: (
        <LayoutWithErrorBoundary>
          <HomePage />
        </LayoutWithErrorBoundary>
      ),
    },
    {
      path: '/login',
      element: (
        <LayoutWithErrorBoundary>
          <LoginForm />
        </LayoutWithErrorBoundary>
      ),
    },
    {
      path: '/register',
      element: (
        <LayoutWithErrorBoundary>
          <RegisterForm />
        </LayoutWithErrorBoundary>
      ),
    },
    {
      path: '/chat',
      element: (
        <LayoutWithErrorBoundary>
          <ChatPage />
        </LayoutWithErrorBoundary>
      ),
    },
    {
      path: '/history',
      element: (
        <LayoutWithErrorBoundary>
          <HistoryPage />
        </LayoutWithErrorBoundary>
      ),
    },
    {
      path: '/settings',
      element: (
        <LayoutWithErrorBoundary>
          <SettingsPage />
        </LayoutWithErrorBoundary>
      ),
    },
    {
      path: '*',
      element: (
        <LayoutWithErrorBoundary>
          <div>404 - Page Not Found</div>
        </LayoutWithErrorBoundary>
      ),
    },
  ],
  {
    basename: '/',
    future: {
      // Future flags can be added here when needed
    },
  }
);
