'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Pencil } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProductModal({ product, onClose }) {
  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 bg-cream rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-tan/30 bg-white/60 shrink-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brown/50 uppercase tracking-wider mb-0.5">Product</p>
                <h2 className="text-lg font-serif font-semibold text-ink leading-tight">
                  {product.title}
                </h2>
              </div>
              <div className="flex items-center gap-1 mt-0.5 shrink-0">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  onClick={onClose}
                  className="p-2 rounded-lg text-brown/50 hover:text-forest hover:bg-blush/60 transition-colors"
                  title="Edit product"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-brown/40 hover:text-ink hover:bg-tan/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Images */}
              {product.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((img, i) => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-tan/20 bg-tan/10">
                      <img
                        src={img.url}
                        alt={`${product.title} image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Price */}
              <span className="block text-3xl font-serif font-bold text-forest">
                {formatCurrency(product.amount)}
              </span>

              {/* Description */}
              {product.description && (
                <Section title="Description">
                  <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">{product.description}</p>
                </Section>
              )}

              {/* Detail sections */}
              {product.details.map((d) => (
                <Section key={d.id} title={d.title}>
                  {d.subtitle && <p className="text-sm font-medium text-ink mb-1">{d.subtitle}</p>}
                  <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">{d.paragraph}</p>
                </Section>
              ))}

              {/* Meta */}
              {product.createdAt && (
                <div className="flex items-center gap-2 text-xs text-brown/40 pt-2 border-t border-tan/20">
                  <Calendar className="w-3.5 h-3.5" />
                  Added {formatDate(product.createdAt)}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-brown/50 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}
