/**
 * @file Button.tsx
 * @description A reusable button component with various styles and states
 * @created 2025-05-22 21:41 ET
 * @lastUpdated 2025-05-22 21:41 ET
 * @module components/ui/Button
 */

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Extended button props that include custom variants and loading state
 */
export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  /**
   * The variant to use
   * @default 'contained'
   */
  variant?: 'contained' | 'outlined' | 'text';
  
  /**
   * The color of the component
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  
  /**
   * If `true`, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * If `true`, the button will be disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * If `true`, the button will show a loading indicator
   * @default false
   */
  loading?: boolean;
  
  /**
   * The size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Element placed before the children
   */
  startIcon?: React.ReactNode;
  
  /**
   * Element placed after the children
   */
  endIcon?: React.ReactNode;
  
  /**
   * The content of the button
   */
  children: React.ReactNode;
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'loading',
})<{ loading?: boolean }>(({ theme, loading }) => ({
  position: 'relative',
  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    display: loading ? 'none' : 'flex',
  },
}));

const LoadingIndicator = styled('span')({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  left: 0,
  right: 0,
  margin: '0 auto',
});

/**
 * A customizable button component that extends Material-UI's Button with additional features
 * such as loading state and custom variants.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {loading && (
        <LoadingIndicator>
          <CircularProgress
            color="inherit"
            size={size === 'small' ? 20 : 24}
            thickness={size === 'small' ? 4 : 4.5}
          />
        </LoadingIndicator>
      )}
      <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
        {children}
      </span>
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;
