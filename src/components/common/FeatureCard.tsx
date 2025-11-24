/**
 * Feature Card Component
 * Reusable feature card for landing and portal pages
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  index?: number;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient = 'from-blue-500 to-cyan-500',
  index = 0,
  className = '',
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100 ${className}`}
    >
      <div className="flex gap-4 items-start">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
