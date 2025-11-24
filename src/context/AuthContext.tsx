/**
 * Authentication Context
 * Manages authentication state across the application
 * Integrated with Backend API based on api_frontend_contract.md
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { authService, type AuthResponse } from '../api/services/auth.service';
import { usersService } from '../api/services/users.service';
import { tokenManager } from '../shared/auth/tokenManager';
import { apiClient } from '../shared/api/apiClient';
import type { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // Check if we have a token
        if (tokenManager.isAuthenticated()) {
          // Ensure axios default header is set for this session
          const token = tokenManager.getAccessToken();
          if (token) {
            apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
          }

          // Fetch user profile from backend
          const response = await usersService.getProfile();
          
          if (response.success && response.data) {
            // Convert backend user to app user format
            const user: User = {
              id: response.data.id,
              email: response.data.email,
              name: `${response.data.firstName} ${response.data.lastName}`,
              role: response.data.role as any,
              organizationId: response.data.organizationId,
              avatar: response.data.avatar,
            };
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Token might be expired, clear tokens
        tokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Call backend login API
      const response = await authService.login({ email, password, rememberMe });
      
      if (response.success && response.data) {
        const authData = response.data as AuthResponse;

        // Best-effort: map user from login response if provided
        const userFromLogin: User | null = authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          name: `${authData.user.firstName} ${authData.user.lastName}`,
          role: authData.user.role as any,
          organizationId: authData.user.organizationId,
          avatar: authData.user.avatar,
        } : null;

        // Always try to fetch fresh profile (ensures up-to-date data and works if login response omits user)
        try {
          const profileRes = await usersService.getProfile();
          if (profileRes.success && profileRes.data) {
            const profile = profileRes.data;
            const user: User = {
              id: profile.id,
              email: profile.email,
              name: `${profile.firstName} ${profile.lastName}`,
              role: profile.role as any,
              organizationId: profile.organizationId,
              avatar: profile.avatar,
            };
            setCurrentUser(user);
            return true;
          }
        } catch (profileError) {
          console.warn('Profile fetch after login failed; falling back to login payload', profileError);
        }

        if (userFromLogin) {
          setCurrentUser(userFromLogin);
          return true;
        }
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Show user-friendly error message
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw new Error('لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت أو التأكد من أن الخادم قيد التشغيل.');
      } else if (error.message === 'Invalid login response: tokens are missing' || error.message === 'Refresh response missing tokens') {
        throw new Error('OU,O1U?U? O?O3O?USU, OU,O_OrU^U, U.O?Oc U?USU? OO3O?O?U,U? U?US OU,O1U^O?U%');
      } else if (error.response?.status === 401) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (error.response?.status === 429) {
        throw new Error('تم تجاوز عدد محاولات تسجيل الدخول. يرجى المحاولة لاحقاً');
      } else {
        throw new Error('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Call backend logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Call backend register API
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        const authData = response.data as AuthResponse;
        
        // Convert backend user to app user format
        const user: User = {
          id: authData.user.id,
          email: authData.user.email,
          name: `${authData.user.firstName} ${authData.user.lastName}`,
          role: authData.user.role as any,
          organizationId: authData.user.organizationId,
          avatar: authData.user.avatar,
        };
        
        setCurrentUser(user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const response = await usersService.getProfile();
      
      if (response.success && response.data) {
        const user: User = {
          id: response.data.id,
          email: response.data.email,
          name: `${response.data.firstName} ${response.data.lastName}`,
          role: response.data.role as any,
          organizationId: response.data.organizationId,
          avatar: response.data.avatar,
        };
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const setUser = useCallback((user: User | null) => {
    setCurrentUser(user);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: !!currentUser,
      isLoading,
      login,
      logout,
      register,
      refreshProfile,
      setUser,
    }),
    [currentUser, isLoading, login, logout, register, refreshProfile, setUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
