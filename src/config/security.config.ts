/**
 * Security Configuration
 * Centralized security settings and policies
 * 
 * إعدادات الأمان المركزية
 */

export const securityConfig = {
  /**
   * Authentication & Session
   */
  auth: {
    // Token expiration times
    accessTokenExpiry: 15 * 60 * 1000, // 15 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    
    // Session settings
    sessionTimeout: 30 * 60 * 1000, // 30 minutes of inactivity
    maxConcurrentSessions: 3, // Maximum sessions per user
    
    // Password requirements
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      preventCommonPasswords: true,
      maxLoginAttempts: 5, // Before account lockout
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
    },
  },

  /**
   * Rate Limiting
   */
  rateLimit: {
    // Global rate limits
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // requests per window
    },
    
    // Authentication endpoints
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // login attempts
    },
    
    // API endpoints
    api: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 60, // requests per minute
    },
    
    // File uploads
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // uploads per hour
    },
  },

  /**
   * Input Validation & Sanitization
   */
  validation: {
    // Maximum input lengths
    maxInputLength: {
      text: 1000,
      textarea: 5000,
      email: 255,
      phone: 20,
      url: 2000,
    },
    
    // Allowed file types
    allowedFileTypes: {
      images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    },
    
    // Maximum file sizes (in bytes)
    maxFileSize: {
      image: 5 * 1024 * 1024, // 5 MB
      document: 10 * 1024 * 1024, // 10 MB
      spreadsheet: 10 * 1024 * 1024, // 10 MB
    },
  },

  /**
   * Content Security Policy
   */
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co'],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },

  /**
   * CORS Configuration
   */
  cors: {
    // Allowed origins (update with your production domains)
    allowedOrigins: [
      'https://yourdomain.com',
      'https://www.yourdomain.com',
      'https://app.yourdomain.com',
      // Development
      ...(process.env.NODE_ENV === 'development'
        ? ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']
        : [])
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600, // 10 minutes
  },

  /**
   * Security Headers
   */
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  },

  /**
   * Data Protection
   */
  dataProtection: {
    // Encrypt sensitive data at rest
    encryptSensitiveData: true,
    
    // Personal data retention (GDPR compliance)
    dataRetentionDays: 365, // 1 year
    
    // Anonymize data after deletion
    anonymizeDeletedData: true,
    
    // Audit logging
    auditLog: {
      enabled: true,
      retentionDays: 90,
      logSensitiveOperations: true,
    },
  },

  /**
   * API Security
   */
  api: {
    // Require API key for external access
    requireApiKey: true,
    
    // API versioning
    currentVersion: 'v1',
    
    // Request signing (HMAC)
    requestSigning: {
      enabled: false, // Enable for high-security endpoints
      algorithm: 'sha256',
    },
    
    // Response encryption
    encryptResponse: false, // Enable for sensitive data
  },

  /**
   * Monitoring & Alerts
   */
  monitoring: {
    // Alert on suspicious activity
    alerts: {
      multipleFailedLogins: 3,
      unusualAccessPatterns: true,
      dataExfiltration: true,
      privilegeEscalation: true,
    },
    
    // IP-based restrictions
    ipRestrictions: {
      enabled: false, // Enable for admin panels
      allowlist: [], // Allowed IP addresses
      blocklist: [], // Blocked IP addresses
    },
  },

  /**
   * Development Mode Settings
   */
  development: {
    // Disable certain security checks in development
    bypassRateLimit: false, // Keep enabled even in dev
    verboseErrors: true, // Show detailed errors
    mockAuthentication: true, // Allow demo mode
    
    // Security warnings
    showSecurityWarnings: true,
    logSecurityEvents: true,
  },
};

/**
 * Get security configuration for current environment
 */
export function getSecurityConfig() {
  const isDevelopment = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) || 
                        (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development') || 
                        false;
  
  return {
    ...securityConfig,
    isDevelopment,
    isProduction: !isDevelopment,
  };
}

/**
 * Validate security configuration
 */
export function validateSecurityConfig(): void {
  const errors: string[] = [];
  
  // Check password requirements
  if (securityConfig.auth.password.minLength < 8) {
    errors.push('⚠️ Password minimum length should be at least 8 characters');
  }
  
  // Check token expiry
  if (securityConfig.auth.accessTokenExpiry > 60 * 60 * 1000) {
    errors.push('⚠️ Access token expiry should not exceed 1 hour');
  }
  
  // Check CORS configuration
  if (securityConfig.cors.allowedOrigins.includes('*')) {
    errors.push('🔴 CORS should not allow all origins (*)');
  }
  
  // Check rate limiting
  if (securityConfig.rateLimit.auth.max > 10) {
    errors.push('⚠️ Authentication rate limit is too high (should be <= 10)');
  }
  
  if (errors.length > 0) {
    console.warn('🔒 Security Configuration Warnings:');
    errors.forEach(error => console.warn(`  ${error}`));
  }
}

/**
 * Check if feature is enabled based on environment
 */
export function isSecurityFeatureEnabled(feature: keyof typeof securityConfig): boolean {
  const config = getSecurityConfig();
  
  // Some features should always be enabled in production
  if (config.isProduction) {
    const alwaysEnabled = ['auth', 'rateLimit', 'validation', 'headers'];
    if (alwaysEnabled.includes(feature)) {
      return true;
    }
  }
  
  return true; // Default to enabled
}

// Auto-validate on load
if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
  validateSecurityConfig();
}

export default securityConfig;