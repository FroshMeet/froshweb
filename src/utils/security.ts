/**
 * Comprehensive security utilities for input validation and sanitization
 */

// HTML encode to prevent XSS attacks
export const htmlEncode = (str: string): string => {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
};

// Enhanced sanitization for text inputs
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, ''); // Remove data: protocols
};

// Enhanced sanitization for rich text content
export const sanitizeRichText = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, ''); // Remove data: protocols
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Enhanced password validation
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain uppercase, lowercase, and numeric characters' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long' };
  }
  return { isValid: true };
};

// Validate text input length and content
export const validateTextInput = (
  text: string, 
  minLength: number = 1, 
  maxLength: number = 1000,
  fieldName: string = 'Text'
): { isValid: boolean; message?: string } => {
  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters long` };
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, message: `${fieldName} must be ${maxLength} characters or less` };
  }
  
  // Check for potential SQL injection patterns
  const sqlPatterns = [
    /(\s|^)(union|select|insert|update|delete|drop|alter|create|exec|execute)(\s|$)/i,
    /(\s|^)(or|and)(\s)+\d+(\s)*=(\s)*\d+/i,
    /(\s|^)(or|and)(\s)+['"][^'"]*['"](\s)*=(\s)*['"][^'"]*['"]/i
  ];
  
  if (sqlPatterns.some(pattern => pattern.test(trimmed))) {
    return { isValid: false, message: 'Invalid input detected' };
  }
  
  return { isValid: true };
};

// Validate file uploads
export const validateFileUpload = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeBytes: number = 10 * 1024 * 1024 // 10MB default
): { isValid: boolean; message?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'File type not allowed' };
  }
  
  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return { isValid: false, message: `File size must be under ${maxSizeMB}MB` };
  }
  
  // Check for potentially dangerous file names
  if (/[<>:"/\\|?*]/.test(file.name)) {
    return { isValid: false, message: 'Invalid file name' };
  }
  
  return { isValid: true };
};

// Rate limiting validation
export const validateRateLimit = async (
  identifier: string,
  actionType: string,
  supabaseClient: any
): Promise<boolean> => {
  try {
    const { data, error } = await supabaseClient.rpc('check_rate_limit', {
      user_identifier: identifier,
      action_type: actionType
    });
    
    if (error) {
      console.error('Rate limit check failed:', error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error('Rate limit validation error:', error);
    return false;
  }
};

// Content filtering for inappropriate content
export const validateContentFilter = (text: string): { isValid: boolean; message?: string } => {
  const inappropriatePatterns = [
    /\b(spam|scam|fake|phishing|fraud)\b/i,
    /\b(drug|drugs|marijuana|cocaine|heroin)\b/i,
    /\b(hack|hacking|ddos|botnet)\b/i,
    /(https?:\/\/[^\s]+\.tk|https?:\/\/[^\s]+\.ml|https?:\/\/bit\.ly)/i // Suspicious URLs
  ];
  
  if (inappropriatePatterns.some(pattern => pattern.test(text))) {
    return { isValid: false, message: 'Content contains inappropriate or prohibited material' };
  }
  
  return { isValid: true };
};

// Message validation specifically for chat messages
export const validateMessage = (message: string): { isValid: boolean; error?: string } => {
  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > 1000) {
    return { isValid: false, error: 'Message must be 1000 characters or less' };
  }
  
  // Check for inappropriate content
  const contentCheck = validateContentFilter(trimmed);
  if (!contentCheck.isValid) {
    return { isValid: false, error: contentCheck.message };
  }
  
  // Check for potential spam (repeated characters)
  if (/(.)\1{20,}/.test(trimmed)) {
    return { isValid: false, error: 'Message contains too many repeated characters' };
  }
  
  return { isValid: true };
};

// Comprehensive input validation function
export const validateAndSanitizeInput = (
  input: string,
  validationOptions: {
    minLength?: number;
    maxLength?: number;
    fieldName?: string;
    allowRichText?: boolean;
    checkContent?: boolean;
  } = {}
): { isValid: boolean; sanitized: string; message?: string } => {
  const {
    minLength = 1,
    maxLength = 1000,
    fieldName = 'Input',
    allowRichText = false,
    checkContent = true
  } = validationOptions;
  
  // Sanitize first
  const sanitized = allowRichText ? sanitizeRichText(input) : sanitizeInput(input);
  
  // Validate length
  const lengthValidation = validateTextInput(sanitized, minLength, maxLength, fieldName);
  if (!lengthValidation.isValid) {
    return { isValid: false, sanitized, message: lengthValidation.message };
  }
  
  // Check content if enabled
  if (checkContent) {
    const contentValidation = validateContentFilter(sanitized);
    if (!contentValidation.isValid) {
      return { isValid: false, sanitized, message: contentValidation.message };
    }
  }
  
  return { isValid: true, sanitized };
};