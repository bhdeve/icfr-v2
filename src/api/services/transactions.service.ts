/**
 * Transactions Service
 * Based on api_frontend_contract.md - Transactions section
 */

import { api, PaginatedResponse } from '../../shared/api/apiClient';

export interface Transaction {
  id: string;
  organizationId: string;
  organizationName?: string;
  type: 'subscription' | 'upgrade' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  paymentMethod: string;
  paymentProvider: string;
  invoiceUrl?: string;
  metadata?: Record<string, any>;
  processedAt?: string;
  createdAt: string;
}

export interface ListTransactionsParams {
  organizationId?: string;
  type?: 'subscription' | 'upgrade' | 'refund';
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface TransactionsResponse extends PaginatedResponse<Transaction> {
  summary?: {
    totalAmount: number;
    completedCount: number;
    pendingCount: number;
    failedCount: number;
  };
}

export const transactionsService = {
  /**
   * GET /transactions
   * List transactions (admins see all, managers scoped)
   */
  async list(params?: ListTransactionsParams) {
    return api.get<TransactionsResponse>('/transactions', { params });
  },

  /**
   * GET /transactions/:id
   * Get transaction details
   */
  async getById(id: string) {
    return api.get<Transaction>(`/transactions/${id}`);
  },
};
