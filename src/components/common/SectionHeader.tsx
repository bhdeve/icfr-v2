/**
 * Section Header Component
 * Reusable section header for landing and portal pages
 */

import React from 'react';
import { motion } from 'motion/react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${centered ? 'text-center' : ''} mb-12 ${className}`}
    >
      <h2 className="text-3xl lg:text-5xl mb-3 text-gray-900">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
