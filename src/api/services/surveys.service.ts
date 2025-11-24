/**
 * Surveys Service
 * Based on api_frontend_contract.md - Surveys section
 */

import { api, PaginatedResponse } from '../../shared/api/apiClient';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'closed' | 'archived';
  category?: string;
  organizationId: string;
  organizationName?: string;
  thumbnail?: string;
  questionsCount: number;
  sectionsCount: number;
  responsesCount: number;
  completionRate: number;
  averageScore?: number;
  estimatedDuration?: number;
  publishedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyDetail extends Survey {
  settings?: {
    allowAnonymous?: boolean;
    allowMultipleResponses?: boolean;
    requireLogin?: boolean;
    showProgressBar?: boolean;
    randomizeQuestions?: boolean;
    showResultsToRespondent?: boolean;
  };
  sections?: SurveySection[];
}

export interface SurveySection {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'radio' | 'checkbox' | 'rating' | 'select' | 'textarea';
  title: string;
  description?: string;
  required: boolean;
  order: number;
  options?: QuestionOption[];
  validation?: Record<string, any>;
  settings?: Record<string, any>;
}

export interface QuestionOption {
  id: string;
  label: string;
  value?: string;
}

export interface ListSurveysParams {
  search?: string;
  status?: string[];
  categories?: string[];
  organizations?: string[];
  responseMin?: number;
  responseMax?: number;
  completionMin?: number;
  completionMax?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'title' | 'responses' | 'completion';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SurveySummary {
  totalSurveys: number;
  activeSurveys: number;
  draftSurveys?: number;
  closedSurveys?: number;
  totalResponses: number;
  averageResponses: number;
  averageCompletionRate?: number;
  averageScore?: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  beneficiaryId?: string;
  beneficiaryName?: string;
  status: 'completed' | 'partial';
  score?: number;
  answers: ResponseAnswer[];
  duration?: number;
  completedAt?: string;
}

export interface ResponseAnswer {
  questionId: string;
  questionTitle?: string;
  value: any;
  optionLabel?: string;
}

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  completedResponses: number;
  incompletedResponses: number;
  completionRate: number;
  averageScore?: number;
  averageDuration?: number;
  lastResponseAt?: string;
  demographics?: Record<string, any>;
  questionStats?: QuestionStats[];
  trends?: {
    daily?: Array<{ date: string; count: number }>;
  };
}

export interface QuestionStats {
  questionId: string;
  questionTitle: string;
  type: string;
  responses: number;
  distribution?: Record<string, { count: number; percentage: number }>;
  averageValue?: number;
}

export interface SubmitResponseRequest {
  beneficiaryId?: string;
  answers: Array<{
    questionId: string;
    value: any;
    optionId?: string;
  }>;
  metadata?: {
    duration?: number;
    device?: string;
    browser?: string;
  };
}

export const surveysService = {
  /**
   * GET /surveys
   * List surveys with filters
   */
  async list(params?: ListSurveysParams) {
    return api.get<PaginatedResponse<Survey>>('/surveys', { params });
  },

  /**
   * GET /surveys/summary
   * Get surveys summary with same filters
   */
  async getSummary(params?: ListSurveysParams) {
    return api.get<SurveySummary>('/surveys/summary', { params });
  },

  /**
   * GET /surveys/:id
   * Get survey details
   */
  async getById(id: string) {
    return api.get<SurveyDetail>(`/surveys/${id}`);
  },

  /**
   * POST /surveys
   * Create new survey
   */
  async create(data: Partial<SurveyDetail>) {
    return api.post<Survey>('/surveys', data);
  },

  /**
   * PATCH /surveys/:id
   * Update survey
   */
  async update(id: string, data: Partial<SurveyDetail>) {
    return api.patch<Survey>(`/surveys/${id}`, data);
  },

  /**
   * DELETE /surveys/:id
   * Soft delete survey
   */
  async delete(id: string) {
    return api.delete(`/surveys/${id}`);
  },

  /**
   * POST /surveys/:id/publish
   * Publish survey
   */
  async publish(id: string) {
    return api.post<Survey>(`/surveys/${id}/publish`);
  },

  /**
   * POST /surveys/:id/responses
   * Submit survey response
   */
  async submitResponse(id: string, data: SubmitResponseRequest) {
    return api.post<SurveyResponse>(`/surveys/${id}/responses`, data);
  },

  /**
   * GET /surveys/:id/responses
   * Get survey responses
   */
  async getResponses(id: string, params?: { page?: number; limit?: number; beneficiaryId?: string }) {
    return api.get<PaginatedResponse<SurveyResponse>>(`/surveys/${id}/responses`, { params });
  },

  /**
   * GET /surveys/:id/analytics
   * Get survey analytics
   */
  async getAnalytics(id: string) {
    return api.get<SurveyAnalytics>(`/surveys/${id}/analytics`);
  },
};
