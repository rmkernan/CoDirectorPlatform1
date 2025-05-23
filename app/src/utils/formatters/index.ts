/**
 * @file index.ts
 * @description Utility functions for formatting data
 * @created 2025-05-22 21:40 ET
 * @lastUpdated 2025-05-22 21:40 ET
 * @module utils/formatters
 */

/**
 * Formats a date string or Date object into a localized date string
 * @param date - The date to format (string, number, or Date object)
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | number | Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string => {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a number into a currency string
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${value.toFixed(2)}`;
  }
};

/**
 * Formats a number with thousands separators
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param maximumFractionDigits - Maximum number of fraction digits (default: 2)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  locale: string = 'en-US',
  maximumFractionDigits: number = 2
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits,
      minimumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

/**
 * Truncates text to a specified length and adds an ellipsis if needed
 * @param text - The text to truncate
 * @param maxLength - The maximum length before truncation
 * @param ellipsis - The ellipsis string to append (default: '...')
 * @returns The truncated text with ellipsis if needed
 */
export const truncateText = (
  text: string,
  maxLength: number = 100,
  ellipsis: string = '...'
): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}${ellipsis}`;
};

/**
 * Converts a string to title case
 * @param str - The string to convert
 * @returns The string in title case
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats a duration in milliseconds into a human-readable string
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (ms: number): string => {
  if (ms < 0) return '0s';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const parts = [];
  
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
};
