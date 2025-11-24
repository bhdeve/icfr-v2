/**
 * Step Card Component
 * Reusable step card for how-it-works sections
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  index?: number;
  showConnector?: boolean;
  className?: string;
}

export function StepCard({
  step,
  title,
  description,
  icon: Icon,
  index = 0,
  showConnector = false,
  className = '',
}: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className={`relative ${className}`}
    >
      {/* Connector Line */}
      {showConnector && (
        <div className="hidden lg:block absolute top-20 right-0 w-full h-0.5 bg-gradient-to-l from-[#18325a]/20 to-transparent transform translate-x-1/2 -z-10" />
      )}

      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
        <div className="flex gap-4 items-center mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#18325a]/10 to-purple-600/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-7 h-7 text-[#18325a]" />
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#18325a] to-purple-600 text-white text-2xl flex-shrink-0">
            {step}
          </div>
        </div>
        <div className="mr-[72px]">
          <h3 className="text-2xl mb-3 text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
