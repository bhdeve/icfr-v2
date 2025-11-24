/**
 * Audit Logs Service
 * Based on api_frontend_contract.md - Audit Logs section
 */

import { api, PaginatedResponse } from '../../shared/api/apiClient';

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  organizationId: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface ListAuditLogsParams {
  action?: string;
  userId?: string;
  organizationId?: string;
  resource?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const auditLogsService = {
  /**
   * GET /audit-logs
   * List audit logs (filtered by action, user, org, resource)
   */
  async list(params?: ListAuditLogsParams) {
    return api.get<PaginatedResponse<AuditLog>>('/audit-logs', { params });
  },
};
