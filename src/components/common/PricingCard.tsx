/**
 * Pricing Card Component
 * Reusable pricing card for landing and portal pages
 */

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { CheckCircle2 } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string | number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  index?: number;
  onCtaClick?: () => void;
  className?: string;
}

export function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  popular = false,
  index = 0,
  onCtaClick,
  className = '',
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 ${
        popular ? 'border-[#18325a] scale-105' : 'border-gray-200'
      } ${className}`}
    >
      {popular && (
        <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
          <span className="bg-gradient-to-r from-[#18325a] to-purple-600 text-white px-4 py-1 rounded-full text-sm">
            الأكثر شعبية
          </span>
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl mb-2 text-gray-900">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="mb-2">
          <span className="text-4xl text-gray-900">{price}</span>
          {price !== 'مخصص' && typeof price === 'number' && (
            <span className="text-gray-600 mr-2">ريال/شهرياً</span>
          )}
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onCtaClick}
        className={`w-full ${
          popular
            ? 'bg-gradient-to-r from-[#18325a] to-[#2a4a7a]'
            : 'bg-gray-900'
        }`}
      >
        {cta}
      </Button>
    </motion.div>
  );
}
