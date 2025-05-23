/**
 * @file index.ts
 * @description Utility functions for data validation
 * @created 2025-05-22 21:40 ET
 * @lastUpdated 2025-05-22 21:40 ET
 * @module utils/validators
 */

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password against complexity requirements
 * @param password - The password to validate
 * @param options - Validation options
 * @returns Object with validation result and error message if invalid
 */
export const validatePassword = (
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { isValid: boolean; message?: string } => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character',
    };
  }

  return { isValid: true };
};

/**
 * Validates a URL string
 * @param url - The URL to validate
 * @returns True if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Basic phone number validation (allows for various formats)
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a date string
 * @param dateString - The date string to validate
 * @returns True if the date string is a valid date
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

/**
 * Validates that a value is not empty
 * @param value - The value to check
 * @param fieldName - The name of the field for the error message
 * @returns Object with validation result and error message if invalid
 */
export const validateRequired = (
  value: string | number | boolean | null | undefined,
  fieldName: string = 'Field'
): { isValid: boolean; message?: string } => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, message: `${fieldName} cannot be empty` };
  }
  
  return { isValid: true };
};

/**
 * Validates that a number is within a specified range
 * @param value - The number to validate
 * @param min - The minimum allowed value (inclusive)
 * @param max - The maximum allowed value (inclusive)
 * @param fieldName - The name of the field for the error message
 * @returns Object with validation result and error message if invalid
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Value'
): { isValid: boolean; message?: string } => {
  if (isNaN(value)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }
  
  if (value < min || value > max) {
    return {
      isValid: false,
      message: `${fieldName} must be between ${min} and ${max}`,
    };
  }
  
  return { isValid: true };
};

/**
 * Validates that a string length is within specified limits
 * @param value - The string to validate
 * @param minLength - The minimum allowed length
 * @param maxLength - The maximum allowed length
 * @param fieldName - The name of the field for the error message
 * @returns Object with validation result and error message if invalid
 */
export const validateStringLength = (
  value: string,
  minLength: number,
  maxLength: number,
  fieldName: string = 'Field'
): { isValid: boolean; message?: string } => {
  if (typeof value !== 'string') {
    return { isValid: false, message: `${fieldName} must be a string` };
  }
  
  const length = value.trim().length;
  
  if (length < minLength) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${minLength} characters long`,
    };
  }
  
  if (length > maxLength) {
    return {
      isValid: false,
      message: `${fieldName} cannot exceed ${maxLength} characters`,
    };
  }
  
  return { isValid: true };
};
