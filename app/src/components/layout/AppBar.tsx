import React from 'react';
import { AppBar as MuiAppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AppBarProps {
  onMenuClick: () => void;
}

/**
 * Application header bar component
 * @component
 * @param {Function} onMenuClick - Handler for menu button click
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
