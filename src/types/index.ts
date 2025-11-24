/**
 * Global Types
 * Central type definitions for the entire application
 */

// Re-export from constants/types.ts for backward compatibility
export type {
  UserRole,
  User,
  Survey,
  DemoAccount,
  SelectedPackage,
  PagePermissions,
  SubscriptionFlow,
} from '../constants/types';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  field?: string;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  organizationId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Authentication DTOs
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullNameAr: string;
  fullNameEn?: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// Organization DTOs
export interface CreateOrganizationDto {
  nameAr: string;
  nameEn?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
}

export interface UpdateOrganizationDto {
  nameAr?: string;
  nameEn?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  settings?: Record<string, any>;
}

export interface Organization {
  id: string;
  nameAr: string;
  nameEn?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
  subscriptionPlan: 'free' | 'basic' | 'premium' | 'enterprise';
  subscriptionExpiresAt?: string;
  settings?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Survey DTOs
export interface CreateSurveyDto {
  organizationId: string;
  titleAr: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  questions: SurveyQuestion[];
  settings?: SurveySettings;
  startDate?: string;
  endDate?: string;
}

export interface UpdateSurveyDto {
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  questions?: SurveyQuestion[];
  settings?: SurveySettings;
  status?: 'draft' | 'published' | 'closed';
  startDate?: string;
  endDate?: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'multipleChoice' | 'rating' | 'scale' | 'yesNo' | 'date' | 'time';
  questionAr: string;
  questionEn?: string;
  required?: boolean;
  options?: string[];
  settings?: Record<string, any>;
}

export interface SurveySettings {
  allowAnonymous?: boolean;
  requireAuthentication?: boolean;
  limitResponses?: boolean;
  maxResponses?: number;
  showProgressBar?: boolean;
  randomizeQuestions?: boolean;
  [key: string]: any;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  beneficiaryInfo?: Record<string, any>;
  answers: Record<string, any>;
  submittedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// User DTOs
export interface CreateUserDto {
  email: string;
  password: string;
  fullNameAr: string;
  fullNameEn?: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  permissions?: Record<string, boolean>;
}

export interface UpdateUserDto {
  email?: string;
  fullNameAr?: string;
  fullNameEn?: string;
  phone?: string;
  role?: UserRole;
  organizationId?: string;
  permissions?: Record<string, boolean>;
  isActive?: boolean;
}

// Subscription DTOs
export interface SubscriptionPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  limits: {
    maxSurveys?: number;
    maxResponses?: number;
    maxUsers?: number;
    [key: string]: any;
  };
}

export interface SubscribeDto {
  planId: string;
  paymentMethod: 'stripe' | 'moyasar' | 'bank_transfer';
  paymentData?: Record<string, any>;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planType: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  paymentProvider?: string;
  externalSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics DTOs
export interface DashboardAnalytics {
  totalSurveys: number;
  totalResponses: number;
  totalBeneficiaries: number;
  activeSurveys: number;
  recentActivity: ActivityLog[];
  responseRate: number;
  demographics: Record<string, any>;
}

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  completionRate: number;
  averageTime: number;
  questionStats: QuestionStats[];
  demographics: Record<string, any>;
  impactMetrics: ImpactMetric[];
}

export interface QuestionStats {
  questionId: string;
  questionText: string;
  responseCount: number;
  distribution: Record<string, number>;
  averageRating?: number;
}

export interface ImpactMetric {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ActivityLog {
  id: string;
  userId: string;
  organizationId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  createdAt: string;
}

// File Upload DTOs
export interface FileUploadDto {
  file: File;
  type: 'logo' | 'attachment' | 'report';
  metadata?: Record<string, any>;
}

export interface FileResponse {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

// Report DTOs
export interface GenerateReportDto {
  surveyId: string;
  format: 'pdf' | 'excel';
  options?: {
    includeCharts?: boolean;
    includeRawData?: boolean;
    language?: 'ar' | 'en';
  };
}

export interface ReportStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  reportId?: string;
  error?: string;
}

export interface Report {
  id: string;
  surveyId: string;
  format: 'pdf' | 'excel';
  fileUrl: string;
  generatedAt: string;
  expiresAt?: string;
}
