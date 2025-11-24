/**
 * Backend Health Check Utility
 * Checks if backend is available on startup
 */

import { envConfig } from '../config/env.config';

interface HealthCheckResult {
  isAvailable: boolean;
  message: string;
  details?: any;
}

/**
 * Perform a health check on the backend API
 */
export async function checkBackendHealth(): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`${envConfig.backendBaseUrl.replace('/api/v1', '')}/health`, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        isAvailable: true,
        message: 'Backend is available and running',
        details: data,
      };
    } else {
      return {
        isAvailable: false,
        message: `Backend returned status ${response.status}`,
      };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        isAvailable: false,
        message: 'Backend health check timed out (5s)',
      };
    }

    return {
      isAvailable: false,
      message: error.message || 'Backend is not available',
    };
  }
}

/**
 * Log backend status to console with styling
 */
export function logBackendStatus(result: HealthCheckResult): void {
  const styles = {
    success: 'background: #10b981; color: white; padding: 4px 8px; border-radius: 3px;',
    error: 'background: #ef4444; color: white; padding: 4px 8px; border-radius: 3px;',
    info: 'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 3px;',
    warning: 'background: #f59e0b; color: white; padding: 4px 8px; border-radius: 3px;',
  };

  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6;');
  console.log('%c🌐 Backend Connection Status', styles.info);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6;');

  if (result.isAvailable) {
    console.log('%c✅ Backend Available', styles.success);
    console.log(`%c📍 URL: ${envConfig.backendBaseUrl}`, 'color: #10b981;');
    if (result.details) {
      console.log('%cℹ️  Details:', 'color: #6b7280;', result.details);
    }
  } else {
    console.log('%c❌ Backend Not Available', styles.error);
    console.log(`%c📍 Expected URL: ${envConfig.backendBaseUrl}`, 'color: #ef4444;');
    console.log(`%c💡 Message: ${result.message}`, 'color: #f59e0b;');
    console.log('\n%c⚠️  This application requires a running Backend API', styles.warning);
    console.log('%cPlease ensure:', 'color: #6b7280;');
    console.log('  1. Backend server is running on the configured URL');
    console.log('  2. CORS is configured to allow requests from this origin');
    console.log('  3. Network connection is active\n');
    console.log('%c📖 See BACKEND_SETUP.md for setup instructions', 'color: #3b82f6;');
  }

  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6;');
}

/**
 * Perform health check and log results on app startup
 */
export async function performStartupHealthCheck(): Promise<void> {
  console.log('%c🚀 سحابة الأثر - Impact Cloud Platform', 'font-size: 16px; font-weight: bold; color: #18325a;');
  console.log('%cFrontend Application Starting...', 'color: #6b7280;');
  console.log('');

  const result = await checkBackendHealth();
  logBackendStatus(result);

  // Return result for potential use
  return;
}
