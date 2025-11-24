/**
 * Stat Card Component
 * Reusable stat card for displaying statistics
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  number: string;
  label: string;
  icon?: LucideIcon;
  index?: number;
  variant?: 'default' | 'light' | 'dark';
  className?: string;
}

export function StatCard({
  number,
  label,
  icon: Icon,
  index = 0,
  variant = 'default',
  className = '',
}: StatCardProps) {
  const textColorClass = variant === 'dark' ? 'text-white' : 'text-gray-900';
  const labelColorClass = variant === 'dark' ? 'text-white/80' : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {Icon && (
        <Icon className={`w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 ${
          variant === 'dark' ? 'text-white/80' : 'text-[#18325a]'
        }`} />
      )}
      <div>
        <div className={`text-3xl lg:text-4xl ${textColorClass} mb-1`}>{number}</div>
        <div className={`text-sm ${labelColorClass}`}>{label}</div>
      </div>
    </motion.div>
  );
}
