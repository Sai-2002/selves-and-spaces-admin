'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Leaf,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth';

const NAV = [
  { type: 'item', href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { type: 'section', label: 'CUSTOMERS' },
  { type: 'item', href: '/admin/customers', label: 'Clients', icon: Users },
  { type: 'section', label: 'SALES' },
  { type: 'item', href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { type: 'item', href: '/admin/products', label: 'Products', icon: Package },
];

function NavItem({ item, collapsed }) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 transition-colors duration-150',
        'group',
        isActive
          ? 'bg-cream/10 text-cream'
          : 'text-cream/60 hover:text-cream hover:bg-cream/5'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1 bottom-1 w-0.5 bg-tan rounded-full"
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
      )}
      <Icon className={cn('w-5 h-5 flex-shrink-0', collapsed ? 'mx-auto' : '')} />
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 224 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="h-screen bg-forest flex flex-col overflow-hidden flex-shrink-0 border-r border-moss/30 relative z-10"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-moss/20 flex-shrink-0">
        <div className="w-8 h-8 bg-sage/30 rounded-lg flex items-center justify-center flex-shrink-0">
          <Leaf className="w-4 h-4 text-cream" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden"
            >
              <p className="text-cream font-serif text-sm font-semibold leading-tight whitespace-nowrap">
                Selves &amp; Spaces
              </p>
              <p className="text-cream/40 text-xs whitespace-nowrap">Admin Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {NAV.map((item, i) => {
          if (item.type === 'section') {
            return (
              <AnimatePresence key={`section-${i}`} initial={false}>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-5 pt-4 pb-1 text-xs font-semibold text-cream/30 tracking-widest uppercase"
                  >
                    {item.label}
                  </motion.p>
                )}
              </AnimatePresence>
            );
          }
          return <NavItem key={item.href} item={item} collapsed={collapsed} />;
        })}
      </nav>

      {/* Toggle + Logout */}
      <div className="border-t border-moss/20 py-3 space-y-1">
        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 w-[calc(100%-16px)]',
              'text-cream/50 hover:text-red-400 hover:bg-cream/5 transition-colors duration-150'
            )}
          >
            <LogOut className={cn('w-5 h-5 flex-shrink-0', collapsed ? 'mx-auto' : '')} />
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </form>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 w-[calc(100%-16px)]',
            'text-cream/30 hover:text-cream/60 hover:bg-cream/5 transition-colors duration-150'
          )}
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.25 }}
            className={collapsed ? 'mx-auto' : ''}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
