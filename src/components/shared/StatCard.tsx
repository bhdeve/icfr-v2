import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  iconColor?: string;
  iconBgColor?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconColor = 'text-[#183259]',
  iconBgColor = 'bg-blue-50',
  index = 0
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <p className="text-sm text-gray-600">{title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-gray-900 arabic-numbers">
                  {value}
                </h3>
                {trend && (
                  <div className={`flex items-center gap-1 text-sm ${
                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.direction === 'up' ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="arabic-numbers">{trend.value}</span>
                  </div>
                )}
              </div>
            </div>
            <div className={`p-2 rounded-lg ${iconBgColor}`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatCardGridProps {
  stats: Omit<StatCardProps, 'index'>[];
  columns?: 2 | 3 | 4;
}

export function StatCardGrid({ stats, columns = 4 }: StatCardGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} index={index} />
      ))}
    </div>
  );
}
