'use client';

import { Bell, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';

export default function Topbar({ title, user, onMenuToggle }) {
  return (
    <header className="h-14 bg-cream/80 backdrop-blur-sm border-b border-tan/30 flex items-center px-5 gap-4 flex-shrink-0 z-10">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-ink/60 hover:text-ink hover:bg-blush transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-ink/80 tracking-wide">
        {title}
      </h1>

      <div className="flex-1" />

      {/* Notification bell */}
      <button className="relative p-2 rounded-lg text-brown/60 hover:text-ink hover:bg-blush transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-lavender rounded-full" />
      </button>

      {/* User info */}
      <div className="flex items-center gap-2.5">
        <Avatar name={user?.name ?? 'Admin'} size="sm" />
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-ink leading-tight">{user?.name}</p>
          <p className="text-xs text-brown/50 capitalize leading-tight">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}
