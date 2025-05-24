/**
 * @file history.ts
 * @description Custom history object for programmatic navigation
 * Ensures consistent navigation behavior throughout the application
 * @created 2025-05-24 09:20 ET
 * @lastUpdated 2025-05-24 09:20 ET
 * @module utils/history
 */

import { createBrowserHistory } from 'history';

/**
 * Creates a custom history object for programmatic navigation
 * This ensures consistent navigation behavior throughout the application
 */
const history = createBrowserHistory();

export default history;
