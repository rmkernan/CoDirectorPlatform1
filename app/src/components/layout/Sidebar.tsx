/**
 * @file Sidebar.tsx
 * @description Navigation sidebar component that provides application navigation.
 * Includes responsive design for both mobile and desktop viewing modes.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 19:52 ET
 * @module components/layout/Sidebar
 */

import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Chat as ChatIcon,
  History as HistoryIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { ReactNode } from 'react';

/**
 * Defines the structure of a sidebar navigation item
 * @interface SidebarItem
 */
interface SidebarItem {
  /** Display text for the navigation item */
  text: string;
  /** Icon component to display with the navigation item */
  icon: ReactNode;
  /** Navigation path/route for the item */
  path: string;
}

/**
 * Available navigation items for the sidebar
 */
const sidebarItems: SidebarItem[] = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
  { text: 'History', icon: <HistoryIcon />, path: '/history' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

/**
 * Props for the Sidebar component
 * @interface SidebarProps
 */
interface SidebarProps {
  /** Controls whether the mobile drawer is open */
  mobileOpen: boolean;
  /** Handler function for closing the mobile drawer */
  onClose: () => void;
}

/**
 * Sidebar navigation component that provides application navigation
 * with different display modes for mobile and desktop
 * @param {object} props - Component props
 * @param {boolean} props.mobileOpen - Controls the mobile drawer state
 * @param {Function} props.onClose - Handler for closing the mobile drawer
 * @returns {React.ReactElement} The rendered Sidebar component
 */
export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {sidebarItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) onClose();
            }}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.15)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};
