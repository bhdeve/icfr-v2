/**
 * API Types
 * Shared types for API requests and responses
 */

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>; // Validation errors
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Authentication Responses
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
    organizationId?: string;
    organization?: {
      id: string;
      name: string;
      nameEn: string;
    };
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * User Types
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
  organizationId?: string;
  organization?: {
    id: string;
    name: string;
    nameEn: string;
  };
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Organization Types
 */
export interface Organization {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  logo?: string;
  subscriptionPlan: 'free' | 'basic' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  subscriptionExpiresAt?: string;
  usersCount: number;
  surveysCount: number;
  responsesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Survey Types
 */
export interface Survey {
  id: string;
  title: string;
  description?: string;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
  };
  createdBy: string;
  createdByUser?: {
    id: string;
    name: string;
  };
  status: 'draft' | 'active' | 'paused' | 'closed';
  questions: SurveyQuestion[];
  settings: SurveySettings;
  responsesCount: number;
  targetResponses?: number;
  startDate?: string;
  endDate?: string;
  isPublic: boolean;
  shareLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'rating' | 'scale' | 'date';
  text: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  order: number;
}

export interface SurveySettings {
  allowMultipleResponses: boolean;
  showProgressBar: boolean;
  randomizeQuestions: boolean;
  requireAuthentication: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  thankYouMessage?: string;
  redirectUrl?: string;
}

/**
 * Survey Response Types
 */
export interface SurveyResponse {
  id: string;
  surveyId: string;
  survey?: {
    id: string;
    title: string;
  };
  beneficiaryId?: string;
  beneficiary?: {
    id: string;
    name: string;
  };
  answers: SurveyAnswer[];
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
  submittedAt: string;
  createdAt: string;
}

export interface SurveyAnswer {
  questionId: string;
  value: string | string[] | number;
}

/**
 * Beneficiary Types
 */
export interface Beneficiary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  nationalId?: string;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
  };
  customFields?: Record<string, any>;
  responsesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Analytics Types
 */
export interface DashboardStats {
  totalOrganizations: number;
  totalSurveys: number;
  totalResponses: number;
  totalBeneficiaries: number;
  activeOrganizations: number;
  activeSurveys: number;
  responsesThisMonth: number;
  growthRate: number;
}

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  completionRate: number;
  averageTime: number; // in seconds
  responsesByDate: {
    date: string;
    count: number;
  }[];
  questionAnalytics: QuestionAnalytics[];
}

export interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  type: string;
  totalResponses: number;
  distribution: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

/**
 * Subscription Types
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    maxUsers: number;
    maxSurveys: number;
    maxResponses: number;
    maxBeneficiaries: number;
  };
  isActive: boolean;
}

export interface Transaction {
  id: string;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  type: 'subscription' | 'upgrade' | 'renewal';
  paymentMethod?: string;
  paymentReference?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request Filters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SurveyFilters extends PaginationParams {
  status?: 'draft' | 'active' | 'paused' | 'closed';
  organizationId?: string;
  search?: string;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrganizationFilters extends PaginationParams {
  subscriptionPlan?: 'free' | 'basic' | 'professional' | 'enterprise';
  subscriptionStatus?: 'active' | 'expired' | 'cancelled';
  isActive?: boolean;
  search?: string;
}

export interface UserFilters extends PaginationParams {
  role?: 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';
  organizationId?: string;
  isActive?: boolean;
  search?: string;
}
