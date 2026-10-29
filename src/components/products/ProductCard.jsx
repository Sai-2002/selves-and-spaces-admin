'use client';

import { motion } from 'framer-motion';
import { formatCurrency, cn } from '@/lib/utils';

export default function ProductCard({ product, selected, onSelect }) {
  const thumb = product.images[0]?.url;

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(43,74,58,0.09)' }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white rounded-xl border p-5 flex flex-col gap-3 cursor-pointer transition-colors',
        selected ? 'border-forest ring-2 ring-forest/20' : 'border-tan/30'
      )}
    >
      {thumb && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-tan/10 border border-tan/20">
          <img src={thumb} alt={product.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-ink leading-snug">{product.title}</p>
        <p className="text-xs text-brown/50 mt-1 line-clamp-2">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-tan/20">
        <span className="text-lg font-serif font-semibold text-forest">
          {formatCurrency(product.amount)}
        </span>
        <span className="text-xs text-brown/50">
          {product.images.length} image{product.images.length !== 1 ? 's' : ''}
        </span>
      </div>
    </motion.div>
  );
}
