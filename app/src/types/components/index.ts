/**
 * @file index.ts
 * @description Type definitions for component props
 * @created 2025-05-22 21:41 ET
 * @lastUpdated 2025-05-22 21:41 ET
 * @module types/components
 */

import { ReactNode } from 'react';

/**
 * Base props for all components
 */
export interface BaseProps {
  /**
   * Additional CSS class name
   */
  className?: string;
  
  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
  
  /**
   * Data test ID for testing
   */
  'data-testid'?: string;
}

/**
 * Props for components that can be disabled
 */
export interface DisableableProps {
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
}

/**
 * Props for components that can show a loading state
 */
export interface LoadableProps {
  /**
   * Whether the component is in a loading state
   */
  loading?: boolean;
}

/**
 * Props for components that can show an error state
 */
export interface ErrorableProps {
  /**
   * Error message to display
   */
  error?: string;
  
  /**
   * Whether to show the error message
   */
  showError?: boolean;
}

/**
 * Props for components that can be controlled or uncontrolled
 */
export interface ControlledProps<T> {
  /**
   * Controlled value
   */
  value?: T;
  
  /**
   * Default value for uncontrolled mode
   */
  defaultValue?: T;
  
  /**
   * Change handler
   */
  onChange?: (value: T) => void;
}

/**
 * Props for components that render children
 */
export interface ChildrenProps {
  /**
   * Child elements
   */
  children: ReactNode;
}
