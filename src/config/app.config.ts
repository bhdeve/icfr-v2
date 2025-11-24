/**
 * Application Configuration
 * Central configuration for the entire application
 */

export const APP_CONFIG = {
  // Application Info
  APP_NAME: 'سحابة الأثر',
  APP_NAME_EN: 'Impact Cloud',
  POWERED_BY: 'أثرنا',
  PRIMARY_COLOR: '#18325A',
  
  // Version
  VERSION: '1.0.0',
  
  // API Configuration - Use env.config for API settings
  // API_BASE_URL is managed in /config/env.config.ts and /shared/api/http.ts
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_FILE_TYPES: ['application/pdf', 'application/vnd.ms-excel', 'text/csv'],
  
  // Session
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  
  // Toast Duration
  TOAST_DURATION: 3000,
  
  // Date Format
  DATE_FORMAT: 'DD/MM/YYYY',
  DATE_TIME_FORMAT: 'DD/MM/YYYY HH:mm',
  
  // RTL Support
  DEFAULT_DIRECTION: 'rtl' as const,
  DEFAULT_LANGUAGE: 'ar' as const,
  
  // Features Flags
  FEATURES: {
    AI_CHAT: true,
    EXPORT: true,
    ANALYTICS: true,
    NOTIFICATIONS: true,
  },
} as const;
