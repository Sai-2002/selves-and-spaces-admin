'use client';

import { useState } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import OrderRow from './OrderRow';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = ['all', 'pending', 'processing', 'completed', 'cancelled'];

export default function OrderListPanel({ orders, selectedId }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const { query, setQuery, filtered: searched } = useSearch(orders, [
    'id',
    'customerName',
    'status',
  ]);

  const filtered =
    statusFilter === 'all'
      ? searched
      : searched.filter((o) => o.status === statusFilter);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="w-80 flex-shrink-0 border-r border-tan/30 bg-white/60 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-tan/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink">
            Orders{' '}
            <span className="ml-1 text-xs font-normal text-brown/50">
              ({orders.length})
            </span>
          </h2>
        </div>
        <SearchInput value={query} onChange={setQuery} placeholder="Search orders…" />

        {/* Status filter chips */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-colors',
                statusFilter === s
                  ? 'bg-forest text-cream'
                  : 'bg-tan/20 text-brown hover:bg-tan/40'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-brown/40">No orders found.</div>
        ) : (
          sorted.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isActive={order.id === selectedId}
            />
          ))
        )}
      </div>
    </div>
  );
}
