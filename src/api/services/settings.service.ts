/**
 * Settings Service
 * Based on api_frontend_contract.md - Settings section
 */

import { api } from '../../shared/api/apiClient';

export interface GeneralSettings {
  branding: {
    organizationName: string;
    logoUrl?: string;
    logoText: string;
    primaryColor: string;
    secondaryColor: string;
    favicon?: string;
  };
  locale: {
    default: string;
    supported: string[];
  };
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface AdvancedSettings {
  features: {
    liveMode: boolean;
    betaAnalytics: boolean;
    aiAssistant: boolean;
    voiceInput: boolean;
    advancedReports: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;
  };
  survey: {
    allowAnonymousResponses: boolean;
    requireEmailVerification: boolean;
    autoCloseAfterTarget: boolean;
    enableProgressSaving: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
  };
}

export interface SystemSettings {
  maintenanceMode: {
    enabled: boolean;
    message: string;
    allowedIPs: string[];
  };
  registrations: {
    enabled: boolean;
    requireApproval: boolean;
    autoApprove: boolean;
  };
  rateLimit: {
    enabled: boolean;
    requests: number;
    window: number;
  };
  dataRetention: {
    auditLogs: number;
    deletedRecords: number;
    sessionLogs: number;
  };
}

export const settingsService = {
  /**
   * GET /settings/general
   * Get general settings
   */
  async getGeneral() {
    return api.get<GeneralSettings>('/settings/general');
  },

  /**
   * PUT /settings/general
   * Update general settings
   */
  async updateGeneral(data: Partial<GeneralSettings>) {
    return api.put('/settings/general', data);
  },

  /**
   * GET /settings/advanced
   * Get advanced settings
   */
  async getAdvanced() {
    return api.get<AdvancedSettings>('/settings/advanced');
  },

  /**
   * PUT /settings/advanced
   * Update advanced settings
   */
  async updateAdvanced(data: Partial<AdvancedSettings>) {
    return api.put('/settings/advanced', data);
  },

  /**
   * GET /settings/system
   * Get system settings (super_admin only)
   */
  async getSystem() {
    return api.get<SystemSettings>('/settings/system');
  },

  /**
   * PUT /settings/system
   * Update system settings (super_admin only)
   */
  async updateSystem(data: Partial<SystemSettings>) {
    return api.put('/settings/system', data);
  },
};
