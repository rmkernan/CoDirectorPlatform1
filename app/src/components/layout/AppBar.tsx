/**
 * @file AppBar.tsx
 * @description Application header component that provides navigation controls and branding.
 * Includes a responsive menu toggle for mobile devices.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 19:52 ET
 * @module components/layout/AppBar
 */

import React from 'react';
import { AppBar as MuiAppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

/**
 * Props for the AppBar component
 * @interface AppBarProps
 */
interface AppBarProps {
  /** Handler function for menu button click events */
  onMenuClick: () => void;
}

/**
 * Application header bar component that displays the app title and menu button
 * @param {object} props - Component props
 * @param {Function} props.onMenuClick - Handler for menu button click
 * @returns {React.ReactElement} The rendered AppBar component
 */
export const AppBar: React.FC<AppBarProps> = ({ onMenuClick }) => {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Co-Director Platform
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};
