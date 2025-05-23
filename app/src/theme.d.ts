/**
 * @file theme.d.ts
 * @description Type definitions for the application theme configuration.
 * @created 2025-05-22 19:56 ET
 * @lastUpdated 2025-05-22 19:56 ET
 * @module theme
 */

import { Theme } from '@mui/material/styles';

/**
 * Declaration for the theme module that provides type safety for the custom theme
 */
declare module './theme' {
  /**
   * The application's Material-UI theme configuration
   */
  const theme: Theme;
  export default theme;
}
