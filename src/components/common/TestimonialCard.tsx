/**
 * Testimonial Card Component
 * Reusable testimonial card for landing and portal pages
 */

import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating?: number;
  index?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  rating = 5,
  index = 0,
  className = '',
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative ${className}`}
    >
      <Quote className="w-10 h-10 text-[#18325a]/20 mb-4" />
      <p className="text-gray-700 mb-6 leading-relaxed">{quote}</p>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <div>
        <div className="text-gray-900 mb-1">{author}</div>
        <div className="text-sm text-gray-500">{role}</div>
      </div>
    </motion.div>
  );
}
