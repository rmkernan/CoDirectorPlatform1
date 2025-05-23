/**
 * @file header-template.js
 * @description Template for file headers used by ESLint notice plugin
 * @created 2025-05-22 21:35 ET
 * @lastUpdated 2025-05-22 21:52 ET
 * @module config
 */

module.exports = function(data) {
  // Get current date/time in ET timezone
  const now = new Date();
  // ET is UTC-4 or UTC-5 depending on DST
  // Using UTC-4 for now (May is in DST)
  const etOffset = -4 * 60 * 60 * 1000;
  const etTime = new Date(now.getTime() + etOffset + now.getTimezoneOffset() * 60 * 1000);
  
  // Format timestamp as YYYY-MM-DD HH:MM ET
  const year = etTime.getUTCFullYear();
  const month = String(etTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(etTime.getUTCDate()).padStart(2, '0');
  const hours = String(etTime.getUTCHours()).padStart(2, '0');
  const minutes = String(etTime.getUTCMinutes()).padStart(2, '0');
  
  const timestamp = `${year}-${month}-${day} ${hours}:${minutes} ET`;
  
  // Extract filename and module path
  const filename = data.filePath.split(/[\/\\]/).pop();
  const modulePath = data.filePath.replace(/^src[\/\\]?/, '').replace(/[\/\\]/g, '/');
  
  // Return the file header template
  return [
    '/**',
    ` * @file ${filename}`,
    ` * @description ${data.description || 'TODO: Add file description'}`,
    ` * @created ${timestamp}`,
    ` * @lastUpdated ${timestamp}`,
    ` * @module ${modulePath}`,
    ' */',
    ''
  ].join('\n');
};
