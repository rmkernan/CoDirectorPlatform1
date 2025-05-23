/**
 * @file theme.ts
 * @description Application theme configuration using Material-UI's createTheme.
 * Defines color palette, typography, and other theme settings for the application.
 * @created 2025-05-22 19:56 ET
 * @lastUpdated 2025-05-22 19:56 ET
 * @module theme
 */

import { createTheme } from '@mui/material/styles';

/**
 * Creates the application's Material-UI theme instance
 * Configures colors, typography, spacing, and other design elements
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default theme;
