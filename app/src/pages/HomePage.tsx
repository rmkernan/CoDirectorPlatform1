/**
 * @file HomePage.tsx
 * @description Main landing page component for the Co-Director Platform application.
 * Displays welcome message, feature cards, getting started guide, and testimonials.
 * Includes responsive UI elements and interactive content sections.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-22 20:40 ET
 * @module pages/HomePage
 */

/**
 * @file HomePage.tsx
 * @description Main landing page component for the Co-Director Platform application.
 * Displays welcome message, feature cards, getting started guide, and testimonials.
 * Includes responsive UI elements and interactive content sections.
 * @created 2025-05-22 19:52 ET
 * @lastUpdated 2025-05-24 09:06 ET
 * @module pages/HomePage
 */

import React from 'react';
import { Box, Typography, Paper, Grid, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';

// Import individual icons for better tree-shaking and smaller bundle size
import Code from '@mui/icons-material/Code';
import BugReport from '@mui/icons-material/BugReport';
import Storage from '@mui/icons-material/Storage';
import Security from '@mui/icons-material/Security';
import Build from '@mui/icons-material/Build';
import Cloud from '@mui/icons-material/Cloud';

/**
 * Home page component that serves as the landing page for the application.
 * Displays a welcome message and navigation cards for primary actions.
 * @returns {React.ReactElement} The rendered HomePage component
 */
const HomePage: React.FC = () => {
  // Generate sample content for testing scrolling
  const features = [
    { icon: <Code />, title: 'Code Generation', description: 'Generate code snippets and complete functions in multiple programming languages.' },
    { icon: <BugReport />, title: 'Debugging', description: 'Get help identifying and fixing bugs in your code.' },
    { icon: <Storage />, title: 'Data Structures', description: 'Learn about and implement various data structures efficiently.' },
    { icon: <Security />, title: 'Security', description: 'Get guidance on implementing secure coding practices.' },
    { icon: <Build />, title: 'Build Tools', description: 'Set up and optimize your build process with modern tools.' },
    { icon: <Cloud />, title: 'Cloud Services', description: 'Learn how to deploy and manage applications in the cloud.' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome to Co-Director Platform
        </Typography>
        <Typography variant="h6" paragraph sx={{ maxWidth: '800px' }}>
          Your AI-powered development assistant for building better software, faster.
        </Typography>
      </Paper>
      
      {/* Main Features */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 'medium' }}>
        Key Features
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={{ p: 3, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ mr: 2, color: 'primary.main' }}>{feature.icon}</Box>
                <Typography variant="h6" component="h3">
                  {feature.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Additional Content Section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 6, mb: 2, fontWeight: 'medium' }}>
        Getting Started
      </Typography>
      <Divider sx={{ mb: 4 }} />
      
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Quick Start Guide</Typography>
        <List>
          {[
            'Create a new chat session to start interacting with the AI',
            'Use specific questions to get the most accurate responses',
            'Save important code snippets for future reference',
            'Explore different conversation threads for various topics',
            'Use the history feature to revisit previous conversations'
          ].map((text, index) => (
            <ListItem key={index} disableGutters>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      {/* More Content */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Why Choose Our Platform?</Typography>
        <Typography paragraph>
          Our platform is designed to help developers of all skill levels improve their coding efficiency.
          Whether you're a beginner learning the basics or an experienced developer working on complex systems,
          our AI-powered assistant is here to help you every step of the way.
        </Typography>
        <Typography paragraph>
          With features like code generation, debugging assistance, and best practice recommendations,
          you'll be able to write better code in less time. Plus, our intuitive interface makes it easy
          to get started right away.
        </Typography>
      </Paper>
      
      {/* Testimonial Section */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>What Our Users Say</Typography>
        <Grid container spacing={3}>
          {[
            {
              quote: "This platform has transformed how I approach coding challenges. The AI suggestions are incredibly helpful!",
              author: "Alex Johnson, Senior Developer"
            },
            {
              quote: "As a beginner, I've learned so much from the code explanations and examples provided.",
              author: "Taylor Smith, Student"
            },
            {
              quote: "The debugging assistance has saved me countless hours of work. Highly recommended!",
              author: "Jordan Lee, Tech Lead"
            }
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="body1" fontStyle="italic" paragraph>
                  "{testimonial.quote}"
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  — {testimonial.author}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default HomePage;
