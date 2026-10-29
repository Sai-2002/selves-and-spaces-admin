'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function PageTransition({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('h-full', className)}
    >
      {children}
    </motion.div>
  );
}
