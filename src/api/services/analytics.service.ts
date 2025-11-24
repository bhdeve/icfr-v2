/**
 * Analytics & Dashboard Service
 * Based on api_frontend_contract.md - Analytics section
 */

import { api } from '../../shared/api/apiClient';

export interface DashboardAnalytics {
  overview: {
    totalSurveys: number;
    activeSurveys: number;
    totalResponses: number;
    totalBeneficiaries: number;
    completionRate: number;
  };
  recentSurveys: Array<{
    id: string;
    title: string;
    responsesCount: number;
    completionRate: number;
    publishedAt: string;
  }>;
  trends: {
    responses: {
      current: number;
      previous: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
    beneficiaries: {
      current: number;
      previous: number;
      change: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
  charts: {
    responsesOverTime: Array<{
      date: string;
      count: number;
    }>;
    categoriesDistribution: Record<string, number>;
  };
}

export interface DashboardParams {
  organizationId?: string;
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  dateFrom?: string;
  dateTo?: string;
}

export const analyticsService = {
  /**
   * GET /analytics/dashboard
   * Get dashboard analytics
   */
  async getDashboard(params?: DashboardParams) {
    return api.get<DashboardAnalytics>('/analytics/dashboard', { params });
  },
};
