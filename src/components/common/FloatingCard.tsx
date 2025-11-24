/**
 * Floating Card Component
 * Animated floating card for visual effects
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface FloatingCardProps {
  icon: LucideIcon;
  label?: string;
  value?: string;
  position?: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
  gradient?: string;
  className?: string;
}

export function FloatingCard({
  icon: Icon,
  label,
  value,
  position = 'top-right',
  gradient = 'from-green-400 to-emerald-500',
  className = '',
}: FloatingCardProps) {
  const positionClasses = {
    'top-right': '-top-6 -right-6',
    'bottom-left': '-bottom-4 -left-4',
    'top-left': '-top-6 -left-6',
    'bottom-right': '-bottom-4 -right-4',
  };

  const animationConfig = {
    'top-right': { y: [0, -10, 0], duration: 3 },
    'bottom-left': { y: [0, 10, 0], duration: 4 },
    'top-left': { y: [0, -10, 0], duration: 3.5 },
    'bottom-right': { y: [0, 10, 0], duration: 4.5 },
  };

  return (
    <motion.div
      animate={{ y: animationConfig[position].y }}
      transition={{ duration: animationConfig[position].duration, repeat: Infinity }}
      className={`absolute ${positionClasses[position]} bg-white rounded-xl shadow-xl p-4 border border-gray-200 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {(label || value) && (
          <div>
            {label && <div className="h-2 w-16 bg-gray-200 rounded mb-1" />}
            {value && <div className={`h-3 w-12 bg-gradient-to-r ${gradient} rounded`} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
