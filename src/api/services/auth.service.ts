/**
 * Authentication Service
 * Based on api_frontend_contract.md - Authentication section
 */

import { api, apiClient } from '../../shared/api/apiClient';
import { tokenManager } from '../../shared/auth/tokenManager';

const setAuthorizationHeader = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

const extractTokens = (payload: any) => {
  const candidate = payload?.tokens ?? payload;
  if (candidate?.accessToken && candidate?.refreshToken) {
    return {
      accessToken: candidate.accessToken,
      refreshToken: candidate.refreshToken,
    };
  }
  return null;
};

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName?: string;
  industry?: string;
  country?: string;
  city?: string;
  phone?: string;
  acceptTerms: boolean;
  captchaToken: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    organizationId?: string;
    avatar?: string;
    locale: string;
    status: string;
  };
  organization?: {
    id: string;
    name: string;
    status: string;
    plan?: string;
    features?: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface ForgotPasswordRequest {
  email: string;
  captchaToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authService = {
  /**
   * POST /auth/login
   * Login with email and password
   */
  async login(data: LoginRequest) {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    if (response.success) {
      const tokens = extractTokens(response.data);
      if (!tokens) {
        throw new Error('Invalid login response: tokens are missing');
      }

      // Store tokens and update default header for subsequent requests
      tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
      setAuthorizationHeader(tokens.accessToken);
    }
    
    return response;
  },

  /**
   * POST /auth/register
   * Register new organization and admin user
   */
  async register(data: RegisterRequest) {
    const response = await api.post<AuthResponse>('/auth/register', data);
    
    if (response.success) {
      // Store tokens if provided
      const tokens = extractTokens(response.data);
      if (tokens) {
        tokenManager.setTokens(
          tokens.accessToken,
          tokens.refreshToken
        );
        setAuthorizationHeader(tokens.accessToken);
      }
    }
    
    return response;
  },

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  async refreshToken() {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    }>('/auth/refresh', { refreshToken });
    
    if (response.success) {
      const tokens = extractTokens(response.data);
      if (tokens) {
        // Update tokens
        tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
        setAuthorizationHeader(tokens.accessToken);
      } else {
        throw new Error('Refresh response missing tokens');
      }
    }
    
    return response;
  },

  /**
   * POST /auth/logout
   * Logout and revoke refresh token
   */
  async logout() {
    const refreshToken = tokenManager.getRefreshToken();
    
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      // Always clear tokens locally and remove default header
      tokenManager.clearTokens();
      setAuthorizationHeader();
    }
  },

  /**
   * POST /auth/forgot-password
   * Send password reset email
   */
  async forgotPassword(data: ForgotPasswordRequest) {
    return api.post('/auth/forgot-password', data);
  },

  /**
   * POST /auth/reset-password
   * Reset password with token from email
   */
  async resetPassword(data: ResetPasswordRequest) {
    return api.post('/auth/reset-password', data);
  },

  /**
   * POST /auth/change-password
   * Change password for authenticated user
   */
  async changePassword(data: ChangePasswordRequest) {
    return api.post('/auth/change-password', data);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * Get current user from token
   */
  getCurrentUser(): any {
    return tokenManager.getUserFromToken();
  },
};
