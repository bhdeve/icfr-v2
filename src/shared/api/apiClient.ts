/**
 * API Client - Axios instance configured for backend communication
 * Based on api_frontend_contract.md
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import envConfig from '../../config/env.config';
import { tokenManager } from '../auth/tokenManager';

// API Response Types based on contract
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  meta?: any;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    field?: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination Response
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// API Configuration
const API_CONFIG = {
  baseURL: envConfig.backendBaseUrl,
  timeout: envConfig.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(API_CONFIG);
// Exported for direct use when needed
export { apiClient };

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Ensure headers object exists
    config.headers = config.headers ?? {};

    // Add access token
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add locale header (default: ar)
    const locale = localStorage.getItem('locale') || 'ar';
    config.headers['Accept-Language'] = locale;
    config.headers['x-locale'] = locale;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Read Content-Language from response
    const contentLanguage = response.headers['content-language'];
    if (contentLanguage) {
      localStorage.setItem('content-language', contentLanguage);
    }

    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post<ApiSuccessResponse<{
            accessToken: string;
            refreshToken: string;
            expiresIn: number;
          }>>(
            `${API_CONFIG.baseURL}/auth/refresh`,
            { refreshToken }
          );

          if (response.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            
            // Update tokens
            tokenManager.setTokens(accessToken, newRefreshToken);

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 429 - Rate Limit
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      console.warn(`Rate limited. Retry after ${retryAfter} seconds`);
    }

    // Handle 503 - Maintenance Mode
    if (error.response?.status === 503) {
      window.location.href = '/maintenance';
    }

    return Promise.reject(error);
  }
);

// API Helper Methods
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.get<ApiResponse<T>>(url, config).then(res => res.data);
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data);
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.patch<ApiResponse<T>>(url, data, config).then(res => res.data);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data);
  },
};

export default apiClient;
