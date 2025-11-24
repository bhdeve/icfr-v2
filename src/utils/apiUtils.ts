/**
 * API Utilities
 * Helper functions for API calls and responses with caching support
 * 
 * 🔒 Security Enhanced (Nov 4, 2025)
 * - Enhanced input sanitization
 * - XSS protection
 */

import cache from './cache';

// Define types locally since shared/api/types may not exist
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Check if response is successful
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.success === true;
}

/**
 * Extract data from API response
 */
export function extractData<T>(response: ApiResponse<T>): T | undefined {
  return response.data;
}

/**
 * Extract error from API response
 */
export function extractError(response: ApiResponse<any>): string | undefined {
  return response.error || response.message;
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: string,
  message?: string
): ApiResponse<never> {
  return {
    success: false,
    error,
    message,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(queryString);
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Delay execution (useful for rate limiting)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        const delayMs = initialDelay * Math.pow(2, i);
        await delay(delayMs);
      }
    }
  }
  
  throw lastError;
}

/**
 * Batch requests
 */
export async function batchRequests<T>(
  requests: (() => Promise<T>)[],
  batchSize: number = 5
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((fn) => fn()));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 بايت';
  
  const k = 1024;
  const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (Saudi Arabia)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(05|5)[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Sanitize input to prevent XSS attacks
 * Enhanced version with comprehensive HTML entity encoding
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove potential JavaScript protocol
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Cached API call wrapper
 * Wraps an API call with caching support
 */
export async function cachedApiCall<T>(
  key: string,
  apiCall: () => Promise<T>,
  ttl: number = 300000 // 5 minutes default
): Promise<T> {
  // Check cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    console.log(`[API Cache] Hit: ${key}`);
    return cached;
  }

  // Execute API call
  console.log(`[API Cache] Miss: ${key}`);
  const result = await apiCall();
  
  // Store in cache
  cache.set(key, result, ttl);
  
  return result;
}

/**
 * Invalidate cache for a specific key or pattern
 */
export function invalidateCache(keyOrPattern: string | RegExp): void {
  if (typeof keyOrPattern === 'string') {
    cache.delete(keyOrPattern);
    console.log(`[API Cache] Invalidated: ${keyOrPattern}`);
  } else {
    cache.clearPattern(keyOrPattern);
    console.log(`[API Cache] Invalidated pattern: ${keyOrPattern}`);
  }
}

/**
 * Clear all API cache
 */
export function clearApiCache(): void {
  cache.clear();
  console.log('[API Cache] Cleared all cache');
}
