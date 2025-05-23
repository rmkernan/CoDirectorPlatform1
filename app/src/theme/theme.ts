/**
 * @file theme.ts
 * @description Main theme configuration for the application using Material-UI.
 * Defines color palette, typography, and component styling with custom overrides.
 * @created 2025-05-22 22:10 ET
 * @lastUpdated 2025-05-22 22:15 ET
 * @module theme
 */

import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { blue, grey, green, red, orange, common } from '@mui/material/colors';

// Extend the Theme interface to include custom status colors
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      success: {
        main: string;
        contrastText: string;
      };
      warning: {
        main: string;
        contrastText: string;
      };
      error: {
        main: string;
        contrastText: string;
      };
      info: {
        main: string;
        contrastText: string;
      };
    };
  }
  
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      success?: {
        main?: string;
        contrastText?: string;
      };
      warning?: {
        main?: string;
        contrastText?: string;
      };
      error?: {
        main?: string;
        contrastText?: string;
      };
      info?: {
        main?: string;
        contrastText?: string;
      };
    };
  }
}

// Create a theme instance
const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: blue[700],
        light: blue[500],
        dark: blue[900],
        contrastText: common.white,
      },
      secondary: {
        main: grey[800],
        light: grey[600],
        dark: grey[900],
        contrastText: common.white,
      },
      error: {
        main: red[600],
        light: red[400],
        dark: red[800],
        contrastText: common.white,
      },
      warning: {
        main: orange[600],
        light: orange[400],
        dark: orange[800],
        contrastText: common.black,
      },
      info: {
        main: blue[500],
        light: blue[300],
        dark: blue[700],
        contrastText: common.white,
      },
      success: {
        main: green[600],
        light: green[400],
        dark: green[800],
        contrastText: common.white,
      },
      background: {
        default: grey[50],
        paper: common.white,
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: '0.00938em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.2,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.2,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 4px -1px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            borderRadius: 12,
          },
        },
      },
    },
    status: {
      success: {
        main: green[500],
        contrastText: common.white,
      },
      warning: {
        main: orange[500],
        contrastText: common.black,
      },
      error: {
        main: red[500],
        contrastText: common.white,
      },
      info: {
        main: blue[500],
        contrastText: common.white,
      },
    },
  })
);

export default theme;
