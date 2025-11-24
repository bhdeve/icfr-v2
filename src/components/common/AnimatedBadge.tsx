/**
 * Animated Badge Component
 * Reusable badge with animation for highlights
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AnimatedBadgeProps {
  icon?: LucideIcon;
  text: string;
  variant?: 'primary' | 'accent' | 'light';
  className?: string;
}

export function AnimatedBadge({
  icon: Icon,
  text,
  variant = 'primary',
  className = '',
}: AnimatedBadgeProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#18325a]/10 to-purple-500/10 text-[#18325a]',
    accent: 'bg-white/10 text-white',
    light: 'bg-white/90 text-[#18325a]',
  };

  const iconColorClasses = {
    primary: 'text-[#18325a]',
    accent: 'text-yellow-400',
    light: 'text-[#18325a]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon className={`w-4 h-4 ${iconColorClasses[variant]}`} />}
      <span className="text-sm">{text}</span>
    </motion.div>
  );
}
