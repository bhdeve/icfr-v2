/**
 * Error Handler Utility
 * Centralized error handling and logging
 */

import { toast } from 'sonner@2.0.3';
import { AxiosError } from 'axios';

export interface ErrorDetails {
  message: string;
  code?: string;
  status?: number;
  data?: any;
}

/**
 * Extract error details from various error types
 */
export function extractErrorDetails(error: unknown): ErrorDetails {
  // Axios Error
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message,
      code: error.response?.data?.code || error.code,
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  // Unknown error
  return {
    message: 'حدث خطأ غير متوقع',
  };
}

/**
 * Get user-friendly error message in Arabic
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const details = extractErrorDetails(error);

  // Map common error codes to Arabic messages
  const errorMessages: Record<string, string> = {
    // Auth errors
    INVALID_CREDENTIALS: 'بيانات الدخول غير صحيحة',
    UNAUTHORIZED: 'غير مصرح لك بالوصول',
    TOKEN_EXPIRED: 'انتهت صلاحية الجلسة',
    INVALID_TOKEN: 'رمز غير صالح',
    
    // User errors
    USER_NOT_FOUND: 'المستخدم غير موجود',
    EMAIL_ALREADY_EXISTS: 'البريد الإلكتروني مستخدم بالفعل',
    WEAK_PASSWORD: 'كلمة المرور ضعيفة',
    
    // Organization errors
    ORGANIZATION_NOT_FOUND: 'المنظمة غير موجودة',
    ORGANIZATION_ALREADY_EXISTS: 'المنظمة موجودة بالفعل',
    
    // Survey errors
    SURVEY_NOT_FOUND: 'الاستطلاع غير موجود',
    SURVEY_ALREADY_CLOSED: 'الاستطلاع مغلق',
    
    // Permission errors
    FORBIDDEN: 'ليس لديك صلاحية لتنفيذ هذا الإجراء',
    INSUFFICIENT_PERMISSIONS: 'صلاحياتك غير كافية',
    
    // Validation errors
    VALIDATION_ERROR: 'بيانات غير صالحة',
    REQUIRED_FIELD: 'حقل مطلوب',
    
    // Server errors
    INTERNAL_SERVER_ERROR: 'خطأ في الخادم',
    SERVICE_UNAVAILABLE: 'الخدمة غير متاحة حالياً',
    
    // Network errors
    NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
    TIMEOUT: 'انتهت مهلة الطلب',
  };

  // Return mapped message or original message
  if (details.code && errorMessages[details.code]) {
    return errorMessages[details.code];
  }

  // Map by status code
  if (details.status) {
    switch (details.status) {
      case 400:
        return 'طلب غير صالح';
      case 401:
        return 'يجب تسجيل الدخول أولاً';
      case 403:
        return 'ليس لديك صلاحية للوصول';
      case 404:
        return 'المورد غير موجود';
      case 408:
        return 'انتهت مهلة الطلب';
      case 409:
        return 'تعارض في البيانات';
      case 422:
        return 'بيانات غير صالحة';
      case 429:
        return 'عدد كبير من المحاولات. حاول لاحقاً';
      case 500:
        return 'خطأ في الخادم';
      case 502:
        return 'خطأ في البوابة';
      case 503:
        return 'الخدمة غير متاحة';
      case 504:
        return 'انتهت مهلة البوابة';
      default:
        return details.message || 'حدث خطأ غير متوقع';
    }
  }

  return details.message || 'حدث خطأ غير متوقع';
}

/**
 * Handle error and show toast notification
 */
export function handleError(
  error: unknown,
  options?: {
    showToast?: boolean;
    logToConsole?: boolean;
    customMessage?: string;
  }
): ErrorDetails {
  const {
    showToast = true,
    logToConsole = true,
    customMessage,
  } = options || {};

  const details = extractErrorDetails(error);
  const message = customMessage || getUserFriendlyErrorMessage(error);

  if (logToConsole) {
    console.error('Error:', {
      message: details.message,
      code: details.code,
      status: details.status,
      data: details.data,
      originalError: error,
    });
  }

  if (showToast) {
    toast.error(message);
  }

  return details;
}

/**
 * Handle success and show toast notification
 */
export function handleSuccess(
  message: string,
  options?: {
    showToast?: boolean;
    logToConsole?: boolean;
  }
): void {
  const {
    showToast = true,
    logToConsole = false,
  } = options || {};

  if (logToConsole) {
    console.log('Success:', message);
  }

  if (showToast) {
    toast.success(message);
  }
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: {
    showToast?: boolean;
    customMessage?: string;
    onError?: (error: ErrorDetails) => void;
  }
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const details = handleError(error, {
        showToast: options?.showToast,
        customMessage: options?.customMessage,
      });
      
      if (options?.onError) {
        options.onError(details);
      }
      
      throw error;
    }
  }) as T;
}

/**
 * Try-catch wrapper with error handling
 */
export async function tryWithErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    showToast?: boolean;
    customMessage?: string;
    fallbackValue?: T;
  }
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    handleError(error, {
      showToast: options?.showToast,
      customMessage: options?.customMessage,
    });
    return options?.fallbackValue;
  }
}
