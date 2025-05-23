/**
 * @file App.tsx
 * @description Root component of the application that sets up the React application with theme,
 * routing, and error boundaries. This is the main entry point that wraps the entire application
 * with necessary providers and global error handling.
 * 
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 19:52 ET
 * @module App
 */

import { FC, ReactElement, Suspense, lazy } from 'react';
import { 
  Box, 
  Button,
  CircularProgress,
  CssBaseline, 
  ThemeProvider,
  Typography,
  Alert
} from '@mui/material';
import { Routes, Route } from 'react-router-dom';

// Theme configuration
import theme from './theme';

// Lazy load components with proper error boundaries
const ErrorBoundary = lazy(() => import('./components/common/ErrorBoundary'));
const Layout = lazy(() => import('./components/layout/Layout'));
const HomePage = lazy(() => import('./pages/HomePage'));

/**
 * A full-page loading spinner used as a fallback for Suspense components.
 * Provides visual feedback while child components are being loaded.
 *
 * @returns {ReactElement} A centered circular progress indicator
 */
const LoadingSpinner: FC = (): ReactElement => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

/**
 * Fallback UI component that renders when an error is caught by the ErrorBoundary
 * @param {object} props - Component props
 * @param {Error} props.error - The error object that was caught
 * @returns {ReactElement} The error fallback UI
 */
const ErrorFallback: FC<{ error: Error }> = ({ error }): ReactElement => (
  <Box p={4}>
    <Box
      component="div"
      sx={{
        backgroundColor: 'background.paper',
        p: 4,
        borderRadius: 1,
        boxShadow: 1,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom color="error">
        Something went wrong
      </Typography>
      <Typography variant="body1" paragraph>
        We're sorry, but an unexpected error has occurred. Our team has been notified.
      </Typography>
      <Typography variant="subtitle2" component="pre" sx={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
        p: 2, 
        borderRadius: 1,
        overflowX: 'auto',
        fontSize: '0.8rem'
      }}>
        {error?.message || 'Unknown error'}
      </Typography>
      <Box mt={3}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.location.reload()}
        >
          Reload Application
        </Button>
      </Box>
      <Alert severity="error">
        <Typography variant="h6" gutterBottom>
          Application Error
        </Typography>
        <Typography variant="body2" component="div">
          <div>{error.message}</div>
          <Box mt={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.reload()}
              aria-label="Reload application"
            >
              Reload Application
            </Button>
          </Box>
        </Typography>
      </Alert>
    </Box>
  </Box>
);

/**
 * Main App component that sets up the application with theme, routing, and error boundaries
 * @returns {ReactElement} The rendered application
 */
const App: FC = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      {/* Normalize CSS across browsers */}
      <CssBaseline />
      
      {/* Global error boundary to catch any unhandled errors */}
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorBoundary 
          fallback={
            <ErrorFallback 
              error={new Error('An unexpected application error occurred')} 
            />
          }
        >
          {/* Main application layout */}
          <Suspense fallback={<LoadingSpinner />}>
            <Layout>
              <Routes>
                {/* Home route */}
                <Route 
                  path="/" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary 
                        fallback={
                          <ErrorFallback 
                            error={new Error('Failed to load the home page')} 
                          />
                        }
                      >
                        <HomePage />
                      </ErrorBoundary>
                    </Suspense>
                  } 
                />
                
                {/* Add more routes here as the application grows */}
                {/* Example: 
                <Route 
                  path="/about" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary fallback={<ErrorFallback error={new Error('Failed to load the about page')} />}>
                        <AboutPage />
                      </ErrorBoundary>
                    </Suspense>
                  } 
                />
                */}
              </Routes>
            </Layout>
          </Suspense>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;
