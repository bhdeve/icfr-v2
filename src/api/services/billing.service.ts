/**
 * Billing & Subscription Service
 * Based on api_frontend_contract.md - Billing & Subscription section
 */

import { api } from '../../shared/api/apiClient';

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  price: {
    monthly: number | null;
    yearly: number | null;
    currency: string;
    custom?: boolean;
  };
  features: string[];
  limits: {
    surveys: number;
    beneficiaries: number;
    users: number;
    storage: number;
    responsePerSurvey: number;
  };
  recommended?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  providers?: string[];
}

export interface PlansResponse {
  plans: SubscriptionPlan[];
  paymentMethods: PaymentMethod[];
}

export interface CurrentSubscription {
  organizationId: string;
  plan: {
    id: string;
    name: string;
    billingPeriod: 'monthly' | 'yearly';
  };
  status: 'active' | 'past_due' | 'canceled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  paymentMethod?: {
    type: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  nextBillingDate?: string;
  nextBillingAmount?: number;
  usage: {
    surveys: number;
    beneficiaries: number;
    users: number;
    storage: number;
  };
  limits: {
    surveys: number;
    beneficiaries: number;
    users: number;
    storage: number;
  };
  features: string[];
  invoices?: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    invoiceUrl: string;
  }>;
}

export interface CreateCheckoutSessionRequest {
  planId: string;
  billingPeriod: 'monthly' | 'yearly';
  paymentMethodId: string;
  organizationId?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  expiresAt: string;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    billingPeriod: string;
  };
  paymentMethod: {
    id: string;
    name: string;
  };
}

export interface ConfirmPaymentRequest {
  sessionId: string;
}

export interface ConfirmPaymentResponse {
  subscriptionId: string;
  status: string;
  plan: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  invoice: {
    id: string;
    amount: number;
    invoiceUrl: string;
  };
}

export interface CancelSubscriptionRequest {
  reason?: string;
  feedback?: string;
  cancelImmediately?: boolean;
}

export interface UpdatePaymentMethodRequest {
  paymentMethodId: string;
}

export const billingService = {
  /**
   * GET /subscriptions/plans
   * Get subscription plans catalog (public)
   */
  async getPlans() {
    return await api.get<PlansResponse>('/subscriptions/plans');
  },

  /**
   * GET /billing/subscription
   * Get current organization subscription
   */
  async getCurrentSubscription(organizationId?: string) {
    const params = organizationId ? { organizationId } : undefined;
    return api.get<CurrentSubscription>('/billing/subscription', { params });
  },

  /**
   * POST /billing/stripe/session
   * Create Stripe checkout session
   */
  async createCheckoutSession(data: CreateCheckoutSessionRequest) {
    return api.post<CheckoutSession>('/billing/stripe/session', data);
  },

  /**
   * POST /billing/confirm
   * Confirm payment and activate subscription
   */
  async confirmPayment(data: ConfirmPaymentRequest) {
    return api.post<ConfirmPaymentResponse>('/billing/confirm', data);
  },

  /**
   * POST /billing/subscription/cancel
   * Cancel subscription
   */
  async cancelSubscription(data: CancelSubscriptionRequest) {
    return api.post('/billing/subscription/cancel', data);
  },

  /**
   * PATCH /billing/payment-method
   * Update payment method
   */
  async updatePaymentMethod(data: UpdatePaymentMethodRequest) {
    return api.patch('/billing/payment-method', data);
  },
};