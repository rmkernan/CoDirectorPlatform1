/**
 * @file ErrorBoundary.tsx
 * @description A reusable error boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * @created 2025-05-22
 * @lastUpdated 2025-05-22
 * @module components/common/ErrorBoundary
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Box, Typography } from '@mui/material';

/**
 * Props for the ErrorBoundary component
 * @interface ErrorBoundaryProps
 * @property {ReactNode} children - The child components to be wrapped by the error boundary
 * @property {ReactNode} [fallback] - Optional fallback UI to display when an error is caught
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * State shape for the ErrorBoundary component
 * @interface ErrorBoundaryState
 * @property {boolean} hasError - Indicates if an error has been caught
 * @property {Error | null} error - The error that was caught
 * @property {ErrorInfo | null} errorInfo - Additional error information from React
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * A reusable error boundary component that catches JavaScript errors in its child component tree.
 * @class ErrorBoundary
 * @extends {Component<ErrorBoundaryProps, ErrorBoundaryState>}
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initializes the component state
   */
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Updates state when an error is thrown in a child component
   * @static
   * @param {Error} error - The error that was thrown
   * @returns {ErrorBoundaryState} The new state
   */
  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  /**
   * Catches errors that occur in child components
   * @param {Error} error - The error that was thrown
   * @param {ErrorInfo} errorInfo - Additional error information from React
   */
  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // TODO: Integrate with error tracking service (e.g., Sentry)
    // errorService.track(error, errorInfo);
  }

  /**
   * Renders the component
   * @returns {ReactNode} The rendered component or fallback UI
   */
  public render() {
    if (this.state.hasError) {
      // If a fallback is provided, render it, otherwise use the default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI with Alert component
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" paragraph>
              {this.state.error?.message || 'An unknown error occurred'}
            </Typography>
            {this.state.errorInfo?.componentStack && (
              <Typography variant="body2" component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo.componentStack}
              </Typography>
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
