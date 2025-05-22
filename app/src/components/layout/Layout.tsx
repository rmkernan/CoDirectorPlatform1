import React, { ReactNode, useState } from 'react';
import { Box, Container, CssBaseline, Toolbar } from '@mui/material';
import { AppBar } from './AppBar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that provides the application structure
 * @component
 * @param {ReactNode} children - The child components to render within the layout
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          overflow: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
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
