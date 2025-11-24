/**
 * usePermissions Hook
 * Provides role-based access control (RBAC) functionality
 */

import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

// Permission definitions
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  
  // Surveys
  CREATE_SURVEY: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  EDIT_SURVEY: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  DELETE_SURVEY: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  VIEW_SURVEY: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager', 'beneficiary'],
  VIEW_SURVEY_RESULTS: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  SHARE_SURVEY: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  DUPLICATE_SURVEY: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  
  // Users
  CREATE_USER: ['super_admin', 'exology_admin'],
  EDIT_USER: ['super_admin', 'exology_admin'],
  DELETE_USER: ['super_admin', 'exology_admin'],
  VIEW_USERS: ['super_admin', 'exology_admin', 'atharonaa_manager'],
  
  // Organizations
  CREATE_ORGANIZATION: ['super_admin', 'exology_admin'],
  EDIT_ORGANIZATION: ['super_admin', 'exology_admin'],
  DELETE_ORGANIZATION: ['super_admin', 'exology_admin'],
  VIEW_ORGANIZATIONS: ['super_admin', 'exology_admin', 'atharonaa_manager'],
  APPROVE_ORGANIZATION: ['super_admin', 'exology_admin'],
  
  // Beneficiaries
  VIEW_BENEFICIARIES: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  MANAGE_BENEFICIARIES: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  
  // Analytics
  VIEW_ANALYTICS: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  EXPORT_DATA: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  
  // Billing
  VIEW_BILLING: ['super_admin', 'exology_admin', 'organization_manager'],
  MANAGE_SUBSCRIPTION: ['organization_manager'],
  
  // Settings
  VIEW_SETTINGS: ['super_admin', 'exology_admin', 'atharonaa_manager', 'organization_manager'],
  EDIT_SYSTEM_SETTINGS: ['super_admin', 'exology_admin'],
  
  // Activity Logs
  VIEW_ACTIVITY_LOGS: ['super_admin', 'exology_admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export interface UsePermissionsReturn {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessPage: (page: string) => boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOrganizationManager: boolean;
  isBeneficiary: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { currentUser } = useAuth();
  
  const userRole = currentUser?.role || null;
  
  const isAdmin = useMemo(
    () => userRole === 'super_admin' || userRole === 'exology_admin',
    [userRole]
  );
  
  const isSuperAdmin = useMemo(
    () => userRole === 'super_admin',
    [userRole]
  );
  
  const isOrganizationManager = useMemo(
    () => userRole === 'organization_manager',
    [userRole]
  );
  
  const isBeneficiary = useMemo(
    () => userRole === 'beneficiary',
    [userRole]
  );
  
  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    const allowedRoles = PERMISSIONS[permission];
    return allowedRoles.includes(userRole);
  };
  
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };
  
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };
  
  const canAccessPage = (page: string): boolean => {
    // Map pages to permissions
    const pagePermissions: Record<string, Permission[]> = {
      dashboard: ['VIEW_DASHBOARD'],
      surveys: ['CREATE_SURVEY', 'VIEW_SURVEY'],
      'survey-creation': ['CREATE_SURVEY'],
      'survey-view': ['VIEW_SURVEY'],
      'survey-results': ['VIEW_SURVEY_RESULTS'],
      'survey-share': ['SHARE_SURVEY'],
      'user-management': ['VIEW_USERS'],
      beneficiaries: ['VIEW_BENEFICIARIES'],
      'beneficiaries-management': ['VIEW_BENEFICIARIES'],
      organizations: ['VIEW_ORGANIZATIONS'],
      'organizations-management': ['VIEW_ORGANIZATIONS'],
      'organization-requests': ['APPROVE_ORGANIZATION'],
      subscriptions: ['VIEW_BILLING'],
      'subscription-confirmation': ['VIEW_BILLING'],
      'payment-method': ['VIEW_BILLING'],
      'payment-details': ['VIEW_BILLING'],
      profile: [], // Everyone can access profile
      settings: ['VIEW_SETTINGS'],
      'admin-settings': ['EDIT_SYSTEM_SETTINGS'],
      'activity-logs': ['VIEW_ACTIVITY_LOGS'],
      analytics: ['VIEW_ANALYTICS'],
    };
    
    const permissions = pagePermissions[page];
    if (!permissions) return true; // Unknown pages are accessible by default
    if (permissions.length === 0) return true; // No permissions required
    
    return hasAnyPermission(permissions);
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessPage,
    userRole,
    isAdmin,
    isSuperAdmin,
    isOrganizationManager,
    isBeneficiary,
  };
}
