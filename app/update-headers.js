/**
 * @file update-headers.js
 * @description Script to update file headers with correct timestamp format
 * @created 2025-05-22 21:37 ET
 * @lastUpdated 2025-05-22 21:37 ET
 * @module scripts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';

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

// Generate file header with proper timestamp
function generateFileHeader(filename, description, modulePath, createdDate) {
  const timestamp = getCurrentTimestamp();
  return `/**
 * @file ${filename}
 * @description ${description || 'TODO: Add file description'}
 * @created ${createdDate || timestamp}
 * @lastUpdated ${timestamp}
 * @module ${modulePath}
 */\n\n`;
}

// Update file header in a single file
function updateFileHeader(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract filename and module path
    const filename = path.basename(filePath);
    const modulePath = path.relative(path.join(__dirname, 'src'), filePath)
      .replace(/\\/g, '/')
      .replace(/\.[^/.]+$/, ''); // Remove extension
    
    // Check if file already has a header
    const headerRegex = /\/\*\*[\s\S]*?\*\/\s*/;
    const headerMatch = content.match(headerRegex);
    
    let newContent;
    let description = '';
    let createdDate = '';
    
    // Extract existing description and created date if available
    if (headerMatch) {
      const existingHeader = headerMatch[0];
      
      // Try to extract description
      const descMatch = existingHeader.match(/@description\s+([^\n]+)/);
      if (descMatch) {
        description = descMatch[1];
      }
      
      // Try to extract created date
      const createdMatch = existingHeader.match(/@created\s+([^\n]+)/);
      if (createdMatch) {
        const dateStr = createdMatch[1];
        
        // Check if it has the full timestamp format or just the date
        if (dateStr.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} ET/)) {
          createdDate = dateStr;
        } else if (dateStr.match(/\d{4}-\d{2}-\d{2}/)) {
          // If it only has the date, append the current time
          const timestamp = getCurrentTimestamp();
          const timeStr = timestamp.split(' ')[1] + ' ' + timestamp.split(' ')[2];
          createdDate = dateStr + ' ' + timeStr;
        }
      }
      
      // Replace existing header
      newContent = content.replace(headerRegex, generateFileHeader(filename, description, modulePath, createdDate));
    } else {
      // Add new header
      newContent = generateFileHeader(filename, description, modulePath, createdDate) + content;
    }
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated header for: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}: ${error.message}`);
    return false;
  }
}

// Find and update all TypeScript/TSX files
async function updateAllFiles() {
  // Find all TS/TSX files in the src directory
  const files = await glob('src/**/*.{ts,tsx}', { cwd: __dirname });
  
  let successCount = 0;
  let failCount = 0;
  
  // Update each file
  files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    const success = updateFileHeader(fullPath);
    
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  console.log(`\nCompleted header updates:`);
  console.log(`- Successfully updated: ${successCount} files`);
  console.log(`- Failed updates: ${failCount} files`);
}

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run the update
console.log('Starting header updates...');
updateAllFiles();
