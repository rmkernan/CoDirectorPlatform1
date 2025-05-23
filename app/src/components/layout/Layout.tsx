/**
 * @file Layout.tsx
 * @description Main layout component that structures the application UI.
 * Includes responsive AppBar, Sidebar and main content area with proper spacing.
 * Features smooth transitions for mobile views and optimized scrolling behavior.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 20:40 ET
 * @module components/layout/Layout
 */

import React, { ReactNode, useState } from 'react';
import { Box, Container, CssBaseline, Toolbar } from '@mui/material';
import { AppBar } from './AppBar';
import { Sidebar } from './Sidebar';

/**
 * Props for the Layout component
 * @interface LayoutProps
 */
interface LayoutProps {
  /** Child components to be rendered in the main content area */
  children: ReactNode;
}

/**
 * Main layout component that provides the application structure
 * including responsive navigation, sidebar and content area
 * @param {object} props - Component props
 * @param {ReactNode} props.children - The child components to render within the layout
 * @returns {React.ReactElement} The rendered Layout component
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * Toggles the mobile drawer open/closed state
   * @returns {void}
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar onMenuClick={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          width: { xs: '100%', sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
          overflow: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar /> {/* This Toolbar is for proper spacing below the AppBar */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
