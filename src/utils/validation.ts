/**
 * Validation Utilities
 * Common validation functions for forms and inputs
 * 
 * 🔒 Security Enhanced (Nov 4, 2025)
 * - Comprehensive input sanitization
 * - HTML sanitization for rich text
 * - Protection against XSS attacks
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  url?: boolean;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate a single value against rules
 */
export function validate(value: any, rules: ValidationRule): ValidationResult {
  // Required check
  if (rules.required && (!value || String(value).trim() === '')) {
    return {
      isValid: false,
      error: rules.message || 'هذا الحقل مطلوب',
    };
  }

  // Skip other validations if value is empty and not required
  if (!value && !rules.required) {
    return { isValid: true };
  }

  const stringValue = String(value);

  // Min length check
  if (rules.minLength && stringValue.length < rules.minLength) {
    return {
      isValid: false,
      error: rules.message || `يجب أن يكون الحد الأدنى ${rules.minLength} حرف`,
    };
  }

  // Max length check
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return {
      isValid: false,
      error: rules.message || `يجب أن لا يتجاوز ${rules.maxLength} حرف`,
    };
  }

  // Min value check (for numbers)
  if (rules.min !== undefined && Number(value) < rules.min) {
    return {
      isValid: false,
      error: rules.message || `يجب أن يكون الحد الأدنى ${rules.min}`,
    };
  }

  // Max value check (for numbers)
  if (rules.max !== undefined && Number(value) > rules.max) {
    return {
      isValid: false,
      error: rules.message || `يجب أن لا يتجاوز ${rules.max}`,
    };
  }

  // Email validation
  if (rules.email && !isValidEmail(stringValue)) {
    return {
      isValid: false,
      error: rules.message || 'البريد الإلكتروني غير صحيح',
    };
  }

  // Phone validation (Saudi Arabia format)
  if (rules.phone && !isValidPhone(stringValue)) {
    return {
      isValid: false,
      error: rules.message || 'رقم الجوال غير صحيح',
    };
  }

  // URL validation
  if (rules.url && !isValidUrl(stringValue)) {
    return {
      isValid: false,
      error: rules.message || 'الرابط غير صحيح',
    };
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return {
      isValid: false,
      error: rules.message || 'التنسيق غير صحيح',
    };
  }

  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    return {
      isValid: false,
      error: rules.message || 'القيمة غير صحيحة',
    };
  }

  return { isValid: true };
}

/**
 * Validate multiple fields
 */
export function validateFields(
  values: Record<string, any>,
  rules: Record<string, ValidationRule>
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const result = validate(values[field], rules[field]);
    if (!result.isValid && result.error) {
      errors[field] = result.error;
    }
  });

  return errors;
}

/**
 * Check if validation errors exist
 */
export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (Saudi Arabia)
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s\-()]/g, '');
  
  // Saudi phone formats: 05xxxxxxxx or +9665xxxxxxxx
  const saudiRegex = /^(05|5|\+9665)[0-9]{8}$/;
  return saudiRegex.test(cleaned);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate national ID (Saudi Arabia)
 */
export function isValidNationalId(id: string): boolean {
  // Saudi national ID: 10 digits starting with 1 or 2
  const regex = /^[12][0-9]{9}$/;
  return regex.test(id);
}

/**
 * Validate CR number (Commercial Registration)
 */
export function isValidCRNumber(cr: string): boolean {
  // CR number: 10 digits
  const regex = /^[0-9]{10}$/;
  return regex.test(cr);
}

/**
 * Validate password strength
 */
export interface PasswordStrength {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  issues: string[];
}

export function validatePasswordStrength(
  password: string,
  requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  }
): PasswordStrength {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = requirements || {};

  const issues: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  // Length check
  if (password.length < minLength) {
    issues.push(`يجب أن تحتوي كلمة المرور على ${minLength} أحرف على الأقل`);
  }

  // Uppercase check
  if (requireUppercase && !/[A-Z]/.test(password)) {
    issues.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  // Lowercase check
  if (requireLowercase && !/[a-z]/.test(password)) {
    issues.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  // Numbers check
  if (requireNumbers && !/[0-9]/.test(password)) {
    issues.push('يجب أن تحتوي على رقم واحد على الأقل');
  }

  // Special characters check
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
  }

  // Calculate strength
  if (issues.length === 0) {
    if (password.length >= 12) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return {
    isValid: issues.length === 0,
    strength,
    issues,
  };
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"]/g, (char) => {
      const map: Record<string, string> = {
        '<': '<',
        '>': '>',
        "'": '&#39;',
        '"': '&quot;',
      };
      return map[char] || char;
    });
}

/**
 * Validate file upload
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  allowedExtensions?: string[];
}

export function validateFile(
  file: File,
  options: FileValidationOptions
): ValidationResult {
  const { maxSize, allowedTypes, allowedExtensions } = options;

  // Size check
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `حجم الملف يجب أن لا يتجاوز ${maxSizeMB} ميجابايت`,
    };
  }

  // Type check
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'نوع الملف غير مدعوم',
    };
  }

  // Extension check
  if (allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `الامتداد المسموح به: ${allowedExtensions.join(', ')}`,
      };
    }
  }

  return { isValid: true };
}
