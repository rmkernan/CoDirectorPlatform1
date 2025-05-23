// @ts-nocheck
/**
 * @file ui.ts
 * @description Defines global types and interfaces related to common UI elements or patterns.
 * @created 2025-05-23 11:58 ET
 * @lastUpdated 2025-05-23 11:58 ET
 * @module src/types/ui
 */

/**
 * Represents common component sizing options.
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Represents theme mode options for the application.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Represents common text alignment options.
 */
export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

/**
 * Represents common visual variants for components like buttons or alerts.
 * These are generic; more specific variants might be defined per component or feature.
 */
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';

/**
 * Represents the orientation of a component or layout.
 */
export type Orientation = 'horizontal' | 'vertical';

/**
 * Interface for basic icon properties, if a global icon system is in place.
 */
export interface IconProps {
  /** The unique identifier or name of the icon. */
  name: string;
  /** Optional size for the icon. */
  size?: ComponentSize | number;
  /** Optional color for the icon. */
  color?: string;
  /** Optional accessibility label. */
  ariaLabel?: string;
  /** Additional CSS class names. */
  className?: string;
}
