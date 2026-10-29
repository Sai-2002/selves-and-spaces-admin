'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const variantMap = {
  primary: 'bg-forest text-cream hover:bg-moss active:bg-forest border border-transparent',
  secondary: 'bg-blush text-ink border border-tan hover:bg-tan/50 active:bg-tan/70',
  ghost: 'text-forest hover:bg-blush/60 border border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
  outline: 'border border-forest text-forest hover:bg-forest hover:text-cream',
};

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...rest
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-colors duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant] ?? variantMap.primary,
        sizeMap[size] ?? sizeMap.md,
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
