import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Initialize Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Material Icons
const materialIcons = document.createElement('link');
materialIcons.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
materialIcons.rel = 'stylesheet';
document.head.appendChild(materialIcons);

// Get the root element
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}
