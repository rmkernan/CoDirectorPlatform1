import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

/**
 * Home page component that serves as the landing page
 * @component
 */
const HomePage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Co-Director Platform
        </Typography>
        <Typography variant="body1" paragraph>
          Your AI-powered development assistant for building better software, faster.
        </Typography>
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper component="div" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Start a New Chat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Begin a new conversation with the AI to get help with your development tasks.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper component="div" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              View History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review your previous sessions and continue where you left off.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper component="div" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customize your experience and configure application settings.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
