'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Tabs({ tabs, active, onChange, className }) {
  return (
    <div
      className={cn(
        'flex border-b border-tan/40',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2.5 text-sm font-medium transition-colors duration-150',
            'focus:outline-none',
            active === tab.id
              ? 'text-forest'
              : 'text-brown/60 hover:text-ink'
          )}
        >
          {tab.label}
          {active === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full"
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
