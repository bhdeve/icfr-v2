/**
 * Beneficiaries Service
 * Based on api_frontend_contract.md - Beneficiaries section
 */

import { api, PaginatedResponse } from '../../shared/api/apiClient';
import envConfig from '../../config/env.config';
import { tokenManager } from '../../shared/auth/tokenManager';

export interface Beneficiary {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
  organizationId: string;
  category?: string;
  metadata?: Record<string, any>;
  surveysCompleted?: number;
  surveysInProgress?: number;
  lastSurveyAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ListBeneficiariesParams {
  organizationId?: string;
  status?: 'active' | 'inactive';
  search?: string;
  gender?: 'male' | 'female' | 'other';
  ageMin?: number;
  ageMax?: number;
  category?: string;
  page?: number;
  limit?: number;
}

export interface CreateBeneficiaryRequest {
  nationalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  organizationId?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface UpdateBeneficiaryRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  category?: string;
  metadata?: Record<string, any>;
}

export interface ImportResult {
  total: number;
  imported: number;
  failed: number;
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

export const beneficiariesService = {
  /**
   * GET /beneficiaries
   * List beneficiaries with filters
   */
  async list(params?: ListBeneficiariesParams) {
    return api.get<PaginatedResponse<Beneficiary>>('/beneficiaries', { params });
  },

  /**
   * GET /beneficiaries/:id
   * Get beneficiary details
   */
  async getById(id: string) {
    return api.get<Beneficiary>(`/beneficiaries/${id}`);
  },

  /**
   * POST /beneficiaries
   * Create new beneficiary
   */
  async create(data: CreateBeneficiaryRequest) {
    return api.post<Beneficiary>('/beneficiaries', data);
  },

  /**
   * PATCH /beneficiaries/:id
   * Update beneficiary
   */
  async update(id: string, data: UpdateBeneficiaryRequest) {
    return api.patch<Beneficiary>(`/beneficiaries/${id}`, data);
  },

  /**
   * DELETE /beneficiaries/:id
   * Soft delete beneficiary
   */
  async delete(id: string) {
    return api.delete(`/beneficiaries/${id}`);
  },

  /**
   * POST /beneficiaries/import
   * Import beneficiaries from CSV/Excel
   */
  async import(file: File, organizationId?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (organizationId) {
      formData.append('organizationId', organizationId);
    }

    return api.post<ImportResult>('/beneficiaries/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * GET /beneficiaries/export
   * Export beneficiaries to CSV/Excel
   */
  async export(format: 'csv' | 'excel' = 'csv', params?: ListBeneficiariesParams) {
    const apiBaseUrl = envConfig.backendBaseUrl;
    const locale = localStorage.getItem('locale') || 'ar';
    const searchParams = new URLSearchParams(params as any);
    searchParams.set('format', format);

    const token = tokenManager.getAccessToken();
    const response = await fetch(
      `${apiBaseUrl}/beneficiaries/export?${searchParams.toString()}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Accept-Language': locale,
          'x-locale': locale,
        },
      }
    );
    
    if (!response.ok) {
      const message = response.statusText || 'Export failed';
      throw new Error(message);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beneficiaries_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
