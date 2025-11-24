/**
 * Background Gradient Component
 * Reusable background gradient for sections
 */

import React from 'react';

interface BackgroundGradientProps {
  variant?: 'default' | 'accent' | 'dark';
  className?: string;
}

export function BackgroundGradient({
  variant = 'default',
  className = '',
}: BackgroundGradientProps) {
  const gradients = {
    default: (
      <>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#18325a]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </>
    ),
    accent: (
      <>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </>
    ),
    dark: (
      <>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </>
    ),
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {gradients[variant]}
    </div>
  );
}
