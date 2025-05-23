/**
 * @file index.tsx
 * @description Application routes configuration
 * @created 2025-05-22 22:15 ET
 * @lastUpdated 2025-05-22 22:15 ET
 * @module routes
 */

import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Create a wrapper component that includes both Layout and ErrorBoundary
const LayoutWithErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <Layout>{children}</Layout>
  </ErrorBoundary>
);

/**
 * Main application routes configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LayoutWithErrorBoundary>
        <HomePage />
      </LayoutWithErrorBoundary>
    ),
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/register',
    element: <RegisterForm />,
  },
  // Add more routes here as needed
]);
