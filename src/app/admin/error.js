'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function AdminError({ error, reset }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-sm"
      >
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        <h2 className="text-lg font-serif font-semibold text-ink mb-2">
          Something broke
        </h2>
        <p className="text-sm text-brown/60 mb-6 leading-relaxed">
          {error?.message || 'An unexpected error occurred.'}
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-forest text-cream rounded-lg hover:bg-moss transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
      </motion.div>
    </div>
  );
}
