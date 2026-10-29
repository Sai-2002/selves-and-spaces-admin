'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StatCard({ title, value, delta, icon: Icon, accentColor = 'text-forest' }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(43,74,58,0.10)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl p-5 border border-tan/30 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-brown/60 uppercase tracking-wider">{title}</p>
        <div className={cn('p-2 rounded-lg bg-blush/50', accentColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className={cn('text-3xl font-serif font-semibold', accentColor)}>{value}</p>
        {delta && (
          <p
            className={cn(
              'flex items-center gap-1 text-xs mt-1',
              delta.positive ? 'text-moss' : 'text-red-500'
            )}
          >
            {delta.positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {delta.label}
          </p>
        )}
      </div>
    </motion.div>
  );
}
