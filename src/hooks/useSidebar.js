'use client';

import { useState, useEffect } from 'react';

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ss-sidebar-collapsed');
    if (saved !== null) {
      try {
        setCollapsed(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('ss-sidebar-collapsed', JSON.stringify(next));
      return next;
    });
  };

  return { collapsed, toggle, mounted };
}
