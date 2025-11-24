/**
 * Users Service
 * Based on api_frontend_contract.md - Users section
 */

import { api, PaginatedResponse } from '../../shared/api/apiClient';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
  organizationName?: string;
  avatar?: string;
  status: string;
  locale?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  organization?: {
    id: string;
    name: string;
    logo?: string;
    plan?: string;
  };
  permissions?: string[];
  preferences?: {
    theme?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
}

export interface ListUsersParams {
  role?: string;
  organizationId?: string;
  search?: string;
  status?: 'active' | 'inactive' | 'suspended';
  page?: number;
  limit?: number;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
  password?: string;
  sendInviteEmail?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  locale?: string;
  metadata?: Record<string, any>;
}

export const usersService = {
  /**
   * GET /users
   * List users with filters
   */
  async list(params?: ListUsersParams) {
    return api.get<PaginatedResponse<User>>('/users', { params });
  },

  /**
   * GET /users/me
   * Get current user profile
   */
  async getProfile() {
    return api.get<UserProfile>('/users/me');
  },

  /**
   * GET /users/:id
   * Get user by ID
   */
  async getById(id: string) {
    return api.get<User>(`/users/${id}`);
  },

  /**
   * POST /users
   * Create new user
   */
  async create(data: CreateUserRequest) {
    return api.post<User>('/users', data);
  },

  /**
   * PATCH /users/:id
   * Update user
   */
  async update(id: string, data: UpdateUserRequest) {
    return api.patch<User>(`/users/${id}`, data);
  },

  /**
   * DELETE /users/:id
   * Soft delete user
   */
  async delete(id: string) {
    return api.delete(`/users/${id}`);
  },
};
