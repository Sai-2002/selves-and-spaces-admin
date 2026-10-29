'use client';

import { useState } from 'react';
import { LayoutGrid, Table2 } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';
import ProductRow from './ProductRow';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

const SEARCH_KEYS = ['title', 'description'];

export default function ProductListPanel({ products }) {
  const [view, setView] = useState('table');
  const [selected, setSelected] = useState(null);

  const { query, setQuery, filtered } = useSearch(products, SEARCH_KEYS);

  return (
    <>
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48 max-w-xs">
            <SearchInput value={query} onChange={setQuery} placeholder="Search products…" />
          </div>

          <div className="flex border border-tan/40 rounded-lg overflow-hidden ml-auto">
            <button
              onClick={() => setView('table')}
              className={cn('p-2 transition-colors', view === 'table' ? 'bg-forest text-cream' : 'bg-white text-brown hover:bg-cream')}
            >
              <Table2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={cn('p-2 transition-colors', view === 'grid' ? 'bg-forest text-cream' : 'bg-white text-brown hover:bg-cream')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-brown/50">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Table view */}
        {view === 'table' && (
          <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-tan/20 bg-cream/40">
                  <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Product</th>
                  <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Price</th>
                  <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Images</th>
                  <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Sections</th>
                  <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-sm text-brown/40 py-10">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      selected={selected?.id === product.id}
                      onSelect={() => setSelected(product)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid view */}
        {view === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-sm text-brown/40 py-10">
                No products found.
              </div>
            ) : (
              filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={selected?.id === product.id}
                  onSelect={() => setSelected(product)}
                />
              ))
            )}
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
