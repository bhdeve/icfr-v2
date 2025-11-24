/**
 * Organizations Service
 * Based on api_frontend_contract.md - Organizations section
 */

import { api, PaginatedResponse } from '../../shared/api/apiClient';

export interface Organization {
  id: string;
  name: string;
  nameEn?: string;
  logo?: string;
  industry: string;
  country: string;
  city: string;
  status: 'pending' | 'active' | 'suspended';
  plan?: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  metadata?: Record<string, any>;
  usersCount?: number;
  beneficiariesCount?: number;
  surveysCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface OrganizationDetail extends Organization {
  subscription?: {
    plan: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    features: string[];
  };
  limits?: {
    surveys: number;
    beneficiaries: number;
    users: number;
    storage: number;
  };
  usage?: {
    surveys: number;
    beneficiaries: number;
    users: number;
    storage: number;
  };
}

export interface ListOrganizationsParams {
  status?: 'pending' | 'active' | 'suspended';
  search?: string;
  industry?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrganizationRequest {
  name: string;
  nameEn?: string;
  industry: string;
  country: string;
  city: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  captchaToken: string;
  acceptTerms: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateOrganizationRequest {
  name?: string;
  nameEn?: string;
  logo?: string;
  industry?: string;
  country?: string;
  city?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  metadata?: Record<string, any>;
}

export interface ApproveOrganizationRequest {
  plan: 'free' | 'professional' | 'enterprise';
  notes?: string;
}

export interface SuspendOrganizationRequest {
  reason: string;
  duration?: number; // days
}

export const organizationsService = {
  /**
   * GET /organizations
   * List organizations (scoped by role)
   */
  async list(params?: ListOrganizationsParams) {
    return api.get<PaginatedResponse<Organization>>('/organizations', { params });
  },

  /**
   * GET /organizations/:id
   * Get organization details
   */
  async getById(id: string) {
    return api.get<OrganizationDetail>(`/organizations/${id}`);
  },

  /**
   * POST /organizations
   * Create new organization (public endpoint for registration)
   */
  async create(data: CreateOrganizationRequest) {
    return api.post<Organization>('/organizations', data);
  },

  /**
   * PATCH /organizations/:id
   * Update organization
   */
  async update(id: string, data: UpdateOrganizationRequest) {
    return api.patch<Organization>(`/organizations/${id}`, data);
  },

  /**
   * POST /organizations/:id/approve
   * Approve pending organization
   */
  async approve(id: string, data: ApproveOrganizationRequest) {
    return api.post<Organization>(`/organizations/${id}/approve`, data);
  },

  /**
   * POST /organizations/:id/suspend
   * Suspend organization
   */
  async suspend(id: string, data: SuspendOrganizationRequest) {
    return api.post(`/organizations/${id}/suspend`, data);
  },
};
