/**
 * AI Chat Preview Component
 * Animated AI chat interface preview for marketing purposes
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ChatMessage {
  type: 'user' | 'ai';
  content: string | React.ReactNode;
}

interface AIChatPreviewProps {
  assistantName?: string;
  messages: ChatMessage[];
  showTyping?: boolean;
  className?: string;
}

export function AIChatPreview({
  assistantName = 'مساعد برق',
  messages,
  showTyping = true,
  className = '',
}: AIChatPreviewProps) {
  return (
    <motion.div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      {/* Chat Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-[#18325a]" />
        </div>
        <div>
          <h4 className="text-white mb-1">{assistantName}</h4>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/60">متصل الآن</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.type === 'user' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 + index * 0.2 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                message.type === 'user'
                  ? 'bg-white/90 rounded-bl-sm text-[#18325a]'
                  : 'bg-gradient-to-r from-yellow-400/90 to-amber-300/90 rounded-br-sm text-[#18325a]'
              }`}
            >
              {typeof message.content === 'string' ? (
                <p className="text-sm">{message.content}</p>
              ) : (
                message.content
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        {showTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.3 + messages.length * 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="bg-white/20 rounded-full px-3 py-2">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-white/60"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-white/60"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-white/60"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
            <span className="text-xs text-white/60">{assistantName.split(' ')[1] || 'المساعد'} يكتب...</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
