import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Separator } from '../ui/separator';

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl';
}

export function AdminPageLayout({
  title,
  description,
  icon: Icon,
  actions,
  children,
  maxWidth = '7xl'
}: AdminPageLayoutProps) {
  const maxWidthClass = {
    'full': 'max-w-full',
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl'
  }[maxWidth];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4"
      >
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className="p-1.5 bg-[#183259]/10 rounded-lg">
                <Icon className="h-5 w-5 text-[#183259]" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </motion.div>

      <Separator className="bg-gray-200" />

      {/* Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`${maxWidthClass} mx-auto`}
      >
        {children}
      </motion.div>
    </div>
  );
}
