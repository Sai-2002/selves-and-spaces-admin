'use client';

import { useState, useMemo } from 'react';

export function useSearch(items, keys) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) =>
      keys.some((key) => {
        const value = key.split('.').reduce((obj, k) => obj?.[k], item);
        return String(value ?? '').toLowerCase().includes(q);
      })
    );
  }, [items, query, keys]);

  return { query, setQuery, filtered };
}
