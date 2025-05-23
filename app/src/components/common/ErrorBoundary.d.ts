/**
 * @file ErrorBoundary.d.ts
 * @description Type definitions for the ErrorBoundary component that catches and handles errors in React components.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 19:52 ET
 * @module components/common/ErrorBoundary
 */

import { FC, ReactNode } from 'react';

/**
 * Error boundary component that catches JavaScript errors in child component trees
 * and displays a fallback UI instead of the component tree that crashed
 */
declare const ErrorBoundary: FC<{
  /** UI to display when an error is caught */
  fallback: ReactNode;
  /** Child components that will be rendered within the error boundary */
  children: ReactNode;
}>;

export default ErrorBoundary;
