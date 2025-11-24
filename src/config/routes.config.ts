/**
 * Routes Configuration
 * Central configuration for all application routes
 */

import type { UserRole } from '../types';

export const ROUTES = {
  // Public Routes
  LANDING: 'landing',
  LOGIN: 'login',
  SIGNUP: 'signup',
  ORG_REGISTRATION: 'org-registration',
  FORGOT_PASSWORD: 'forgot-password',
  
  // Authenticated Routes
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  
  // Survey Routes
  SURVEYS: 'surveys',
  SURVEY_CREATION: 'survey-creation',
  SURVEY_VIEW: 'survey-view',
  SURVEY_RESULTS: 'survey-results',
  SURVEY_SHARE: 'survey-share',
  ENHANCED_SURVEY: 'enhanced-survey',
  ORGANIZATION_SURVEYS: 'organization-surveys',
  
  // User Management
  USER_MANAGEMENT: 'user-management',
  BENEFICIARIES: 'beneficiaries',
  
  // Organization Management
  ORGANIZATIONS: 'organizations',
  ORGANIZATION_REQUESTS: 'organization-requests',
  
  // Analytics
  ANALYSIS: 'analysis',
  
  // Settings
  SYSTEM_SETTINGS: 'system-settings',
  ADMIN_SETTINGS: 'admin-settings',
  GLOBAL_SURVEY_SETTINGS: 'global-survey-settings',
  
  // Billing & Subscriptions
  SUBSCRIPTION: 'subscription',
  ADMIN_BILLING: 'admin-billing',
  PAYMENT_METHOD: 'payment-method',
  PAYMENT_DETAILS: 'payment-details',
  SUBSCRIPTION_CONFIRMATION: 'subscription-confirmation',
  
  // System Management
  ACTIVITY_LOGS: 'activity-logs',
  
  // Thank You
  THANK_YOU: 'thank-you',
} as const;

/**
 * Get default page for user role
 */
export const getDefaultPageForRole = (role: UserRole): string => {
  switch (role) {
    case 'beneficiary':
      return ROUTES.ENHANCED_SURVEY;
    case 'super_admin':
    case 'admin':
    case 'org_manager':
    default:
      return ROUTES.DASHBOARD;
  }
};

/**
 * Check if route is public (doesn't require authentication)
 */
export const isPublicRoute = (route: string): boolean => {
  const publicRoutes = [
    ROUTES.LANDING,
    ROUTES.LOGIN,
    ROUTES.SIGNUP,
    ROUTES.ORG_REGISTRATION,
    ROUTES.FORGOT_PASSWORD,
  ];
  return publicRoutes.includes(route);
};
