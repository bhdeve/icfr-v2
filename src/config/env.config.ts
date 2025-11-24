/**
 * Environment Configuration
 * Centralized environment variables management
 */

interface EnvConfig {
  // API Configuration
  backendBaseUrl: string;
  apiTimeout: number;

  // Environment
  isDevelopment: boolean;
  isProduction: boolean;

  // Debug
  enableDebugLogs: boolean;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, defaultValue: string = ""): string {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  return defaultValue;
}

/**
 * Parse boolean environment variable
 */
function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  if (!value) return defaultValue;
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Parse number environment variable
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Normalize base URL to remove trailing slash
 */
function sanitizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Environment Configuration Object
 * Primary: VITE_API_BASE_URL
 * Fallback: VITE_BACKEND_BASE_URL
 */
export const envConfig: EnvConfig = {
  backendBaseUrl: sanitizeBaseUrl(
    getEnvVar(
      "VITE_API_BASE_URL",
      getEnvVar("VITE_BACKEND_BASE_URL", "http://localhost:3001/api/v1")
    )
  ),
  apiTimeout: getEnvNumber("VITE_API_TIMEOUT", 30000),

  isDevelopment: getEnvVar("MODE", "development") === "development",
  isProduction: getEnvVar("MODE", "development") === "production",

  enableDebugLogs: getEnvBool("VITE_ENABLE_DEBUG_LOGS", false),
};

/**
 * Validate required environment variables
 */
export function validateEnvConfig(): void {
  const errors: string[] = [];

  if (envConfig.isProduction && !envConfig.backendBaseUrl) {
    errors.push(
      "❌ VITE_API_BASE_URL (or VITE_BACKEND_BASE_URL) is required in production (.env file)"
    );
  }

  if (errors.length > 0) {
    console.error("Environment Configuration Errors:");
    errors.forEach((error) => console.error(`  ${error}`));
    console.error("\nTip: Check your .env file in the root directory");

    if (envConfig.isProduction) {
      throw new Error("Invalid environment configuration");
    }
  }
}

/**
 * Log environment configuration (development only)
 */
export function logEnvConfig(): void {
  if (envConfig.isDevelopment && envConfig.enableDebugLogs) {
    console.log("Environment Configuration:", {
      backendBaseUrl: envConfig.backendBaseUrl,
      apiTimeout: envConfig.apiTimeout,
      isDevelopment: envConfig.isDevelopment,
    });
  }
}

// Auto-validate on load
validateEnvConfig();

export default envConfig;
