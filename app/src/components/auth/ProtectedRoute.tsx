/**
 * @file ProtectedRoute.tsx
 * @description A component that protects routes from unauthorized access
 * @created 2025-05-22 22:15 ET
 * @lastUpdated 2025-05-22 22:15 ET
 * @module components/auth/ProtectedRoute
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  /**
   * The path to redirect to if not authenticated
   * @default '/login'
   */
  redirectPath?: string;
}

/**
 * A component that renders its children only if the user is authenticated.
 * Otherwise, it redirects to the login page.
 */
export const ProtectedRoute = ({
  isAuthenticated,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they log in, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
