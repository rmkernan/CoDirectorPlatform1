/**
 * @file index.tsx
 * @description Application routes configuration
 * Configured to work with React Router v7 and Vite using HashRouter for reliable client-side routing
 * @created 2025-05-22 22:15 ET
 * @lastUpdated 2025-05-22 22:44 ET
 * @module routes
 */

import { createHashRouter, Navigate } from 'react-router-dom';
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
 * Main application routes configuration
 * Using React Router v7 with createBrowserRouter
 * @see https://reactrouter.com/en/main/routers/create-browser-router
 */
/**
 * Main application router using HashRouter for reliable client-side routing
 * This approach ensures proper page refreshes and direct URL access without server configuration
 * @see https://reactrouter.com/en/main/routers/create-hash-router
 */
export const router = createHashRouter(
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
