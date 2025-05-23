/**
 * @file create-file.js
 * @description Script to create new files with proper documentation headers
 * @created 2025-05-22 21:50 ET
 * @lastUpdated 2025-05-22 21:50 ET
 * @module scripts
 */

// This script helps developers create new files with the proper documentation headers
// Usage: node scripts/create-file.js <file-path> [description] [module-path]
// Example: node scripts/create-file.js src/features/auth/components/LoginForm.tsx "Login form component" "features/auth/components"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current timestamp in ET timezone format
function getCurrentTimestamp() {
  const now = new Date();
  // ET is UTC-4 in May (DST)
  const etOffset = -4 * 60 * 60 * 1000;
  const etTime = new Date(now.getTime() + etOffset + now.getTimezoneOffset() * 60 * 1000);
  
  // Format timestamp as YYYY-MM-DD HH:MM ET
  const year = etTime.getUTCFullYear();
  const month = String(etTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(etTime.getUTCDate()).padStart(2, '0');
  const hours = String(etTime.getUTCHours()).padStart(2, '0');
  const minutes = String(etTime.getUTCMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes} ET`;
}

// Create a new file with proper header
function createFile(filePath, description, modulePath) {
  const fullPath = path.isAbsolute(filePath) 
    ? filePath 
    : path.join(process.cwd(), filePath);
  
  // Create directory if it doesn't exist
  const directory = path.dirname(fullPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  
  // Check if file already exists
  if (fs.existsSync(fullPath)) {
    console.error(`Error: File already exists: ${fullPath}`);
    process.exit(1);
  }
  
  const timestamp = getCurrentTimestamp();
  const filename = path.basename(fullPath);
  
  // Determine the module path from the file path if not provided
  if (!modulePath) {
    // Convert absolute path to relative path from src
    const projectRoot = process.cwd();
    const srcDir = path.join(projectRoot, 'src');
    
    if (fullPath.startsWith(srcDir)) {
      modulePath = path.dirname(fullPath)
        .substring(srcDir.length + 1)
        .replace(/\\/g, '/');
    } else {
      modulePath = path.dirname(fullPath).replace(/\\/g, '/');
    }
  }
  
  let fileContent = '';
  const ext = path.extname(filename);
  
  // Generate different content based on file type
  if (ext === '.ts' || ext === '.tsx') {
    fileContent = generateTypeScriptContent(filename, description, timestamp, modulePath);
  } else if (ext === '.js' || ext === '.jsx') {
    fileContent = generateJavaScriptContent(filename, description, timestamp, modulePath);
  } else if (ext === '.md') {
    fileContent = generateMarkdownContent(filename, description, timestamp, modulePath);
  } else if (ext === '.css' || ext === '.scss') {
    fileContent = generateCSSContent(filename, description, timestamp, modulePath);
  } else {
    fileContent = generateGenericContent(filename, description, timestamp, modulePath);
  }
  
  // Write the file
  fs.writeFileSync(fullPath, fileContent, 'utf8');
  console.log(`Created file: ${fullPath}`);
}

// Generate TypeScript/TSX content
function generateTypeScriptContent(filename, description, timestamp, modulePath) {
  // Determine if it's a React component based on filename and extension
  const isComponent = filename.charAt(0).toUpperCase() === filename.charAt(0) && 
                      path.extname(filename) === '.tsx';
  
  let content = `/**
 * @file ${filename}
 * @description ${description || 'TODO: Add file description'}
 * @created ${timestamp}
 * @lastUpdated ${timestamp}
 * @module ${modulePath}
 */

`;

  if (isComponent) {
    // Generate React component template following project standards
    content += `import React from 'react';

/**
 * Props for the ${path.basename(filename, '.tsx')} component
 */
interface ${path.basename(filename, '.tsx')}Props {
  // Add props here
}

/**
 * ${description || `${path.basename(filename, '.tsx')} component`}
 *
 * @param props - Component props
 * @returns The rendered component
 */
const ${path.basename(filename, '.tsx')} = (props: ${path.basename(filename, '.tsx')}Props): React.ReactElement => {
  return (
    <div>
      {/* Component content goes here */}
    </div>
  );
};

export default ${path.basename(filename, '.tsx')};
`;
  } else if (filename.includes('types') || filename.includes('interfaces')) {
    // Generate types file template
    content += `/**
 * Types and interfaces for ${modulePath}
 */

export interface Example {
  // Add properties here
}
`;
  } else {
    // Generate utility file template
    content += `/**
 * Example function
 *
 * @param input - Description of input
 * @returns Description of return value
 */
export function exampleFunction(input: string): string {
  return input;
}
`;
  }
  
  return content;
}

// Generate JavaScript/JSX content
function generateJavaScriptContent(filename, description, timestamp, modulePath) {
  return `/**
 * @file ${filename}
 * @description ${description || 'TODO: Add file description'}
 * @created ${timestamp}
 * @lastUpdated ${timestamp}
 * @module ${modulePath}
 */

/**
 * Example function
 *
 * @param {string} input - Description of input
 * @returns {string} Description of return value
 */
export function exampleFunction(input) {
  return input;
}
`;
}

// Generate Markdown content
function generateMarkdownContent(filename, description, timestamp, modulePath) {
  return `<!--
 * @file ${filename}
 * @description ${description || 'TODO: Add file description'}
 * @created ${timestamp}
 * @lastUpdated ${timestamp}
 * @module ${modulePath}
 -->

# ${description || 'Title'}

## Overview

Add content here.
`;
}

// Generate CSS content
function generateCSSContent(filename, description, timestamp, modulePath) {
  return `/**
 * @file ${filename}
 * @description ${description || 'TODO: Add file description'}
 * @created ${timestamp}
 * @lastUpdated ${timestamp}
 * @module ${modulePath}
 */

/* Styles go here */
`;
}

// Generate generic content for other file types
function generateGenericContent(filename, description, timestamp, modulePath) {
  return `/**
 * @file ${filename}
 * @description ${description || 'TODO: Add file description'}
 * @created ${timestamp}
 * @lastUpdated ${timestamp}
 * @module ${modulePath}
 */
`;
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node scripts/create-file.js <file-path> [description] [module-path]');
  console.error('Example: node scripts/create-file.js src/features/auth/components/LoginForm.tsx "Login form component" "features/auth/components"');
  process.exit(1);
}

const filePath = args[0];
const description = args[1] || '';
const modulePath = args[2] || '';

// Create the file
createFile(filePath, description, modulePath);
