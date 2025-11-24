/**
 * API Services Index
 * Central export for all API services
 */

export * from './auth.service';
export * from './users.service';
export * from './organizations.service';
export * from './beneficiaries.service';
export * from './surveys.service';
export * from './billing.service';
export * from './ai-assistant.service';
export * from './analytics.service';
export * from './settings.service';
export * from './transactions.service';
export * from './audit-logs.service';

// Re-export API client for direct use
export { api, apiClient } from '../../shared/api/apiClient';
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse, PaginatedResponse } from '../../shared/api/apiClient';
