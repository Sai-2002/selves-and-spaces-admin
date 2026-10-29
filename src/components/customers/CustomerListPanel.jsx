'use client';

import SearchInput from '@/components/ui/SearchInput';
import CustomerRow from './CustomerRow';
import { useSearch } from '@/hooks/useSearch';

export default function CustomerListPanel({ customers, selectedId }) {
  const { query, setQuery, filtered } = useSearch(customers, [
    'name',
    'email',
    'phone',
    'status',
  ]);

  return (
    <div className="w-80 flex-shrink-0 border-r border-tan/30 bg-white/60 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-tan/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink">
            Clients{' '}
            <span className="ml-1 text-xs font-normal text-brown/50">
              ({customers.length})
            </span>
          </h2>
        </div>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search clients…"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-brown/40">
            No clients match &ldquo;{query}&rdquo;
          </div>
        ) : (
          filtered.map((customer) => (
            <CustomerRow
              key={customer.id}
              customer={customer}
              isActive={customer.id === selectedId}
            />
          ))
        )}
      </div>
    </div>
  );
}
