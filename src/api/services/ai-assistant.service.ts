/**
 * AI Assistant (Barq) Service
 * Based on api_frontend_contract.md - AI Assistant section
 */

import { api, PaginatedResponse } from '../../shared/api/apiClient';

export interface AskQuestionRequest {
  question: string;
  conversationId?: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    organizationId?: string;
    currentPage?: string;
  };
}

export interface AskQuestionResponse {
  messageId: string;
  conversationId: string;
  answer: string;
  suggestions?: string[];
  actions?: Array<{
    type: string;
    label: string;
    url?: string;
  }>;
  sources?: Array<{
    type: string;
    query?: string;
  }>;
  metadata?: {
    tokensUsed: number;
    responseTime: number;
    model: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messagesCount: number;
  lastMessageAt: string;
  createdAt: string;
  preview?: string;
}

export interface ConversationDetail extends Conversation {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    suggestions?: string[];
    actions?: any[];
    timestamp: string;
  }>;
  updatedAt: string;
}

export interface VoiceInputRequest {
  audio: File;
  language?: 'ar' | 'en';
  transcriptionRequested?: boolean;
  conversationId?: string;
}

export interface VoiceInputResponse {
  messageId: string;
  conversationId: string;
  transcription?: {
    text: string;
    language: string;
    confidence: number;
    duration: number;
  };
  answer: string;
  audioResponse?: {
    url: string;
    duration: number;
    format: string;
  };
  suggestions?: string[];
}

export interface FeedbackRequest {
  messageId: string;
  rating: 'positive' | 'negative' | 'neutral';
  comment?: string;
  categories?: string[];
}

export interface Insight {
  id: string;
  type: 'performance' | 'opportunity' | 'warning';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation?: string;
  action?: {
    type: string;
    label: string;
    url: string;
  };
  createdAt: string;
}

export interface UsageStats {
  period: string;
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  averageResponseTime: number;
  totalTokensUsed: number;
  conversationsCreated: number;
  averageMessagesPerConversation: number;
  topQueries?: Array<{
    query: string;
    count: number;
  }>;
  usageByDay?: Array<{
    date: string;
    queries: number;
    tokens: number;
  }>;
}

export const aiAssistantService = {
  /**
   * POST /ai-assistant/ask
   * Ask a question to the AI assistant
   */
  async ask(data: AskQuestionRequest) {
    return api.post<AskQuestionResponse>('/ai-assistant/ask', data);
  },

  /**
   * POST /ai-assistant/voice
   * Send voice input to AI assistant
   */
  async voiceInput(data: VoiceInputRequest) {
    const formData = new FormData();
    formData.append('audio', data.audio);
    if (data.language) formData.append('language', data.language);
    if (data.transcriptionRequested !== undefined) {
      formData.append('transcriptionRequested', String(data.transcriptionRequested));
    }
    if (data.conversationId) formData.append('conversationId', data.conversationId);

    return api.post<VoiceInputResponse>('/ai-assistant/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * GET /ai-assistant/conversations
   * List conversations
   */
  async listConversations(params?: { page?: number; limit?: number }) {
    return api.get<PaginatedResponse<Conversation>>('/ai-assistant/conversations', { params });
  },

  /**
   * GET /ai-assistant/conversations/:id
   * Get conversation details
   */
  async getConversation(id: string) {
    return api.get<ConversationDetail>(`/ai-assistant/conversations/${id}`);
  },

  /**
   * PATCH /ai-assistant/conversations/:id
   * Update conversation (e.g., title)
   */
  async updateConversation(id: string, data: { title: string }) {
    return api.patch(`/ai-assistant/conversations/${id}`, data);
  },

  /**
   * DELETE /ai-assistant/conversations/:id
   * Delete conversation
   */
  async deleteConversation(id: string) {
    return api.delete(`/ai-assistant/conversations/${id}`);
  },

  /**
   * POST /ai-assistant/feedback
   * Submit feedback for AI response
   */
  async submitFeedback(data: FeedbackRequest) {
    return api.post('/ai-assistant/feedback', data);
  },

  /**
   * GET /ai-assistant/insights
   * Get proactive insights
   */
  async getInsights() {
    return api.get<{ insights: Insight[] }>('/ai-assistant/insights');
  },

  /**
   * GET /ai-assistant/usage-stats
   * Get usage statistics
   */
  async getUsageStats(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    return api.get<UsageStats>('/ai-assistant/usage-stats', { params: { period } });
  },
};
