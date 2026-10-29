'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES = {
  '/admin/customers': 'Clients',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin': 'Dashboard',
};

function getTitle(pathname) {
  const sorted = Object.keys(TITLES).sort((a, b) => b.length - a.length);
  const match = sorted.find((path) => pathname.startsWith(path));
  return match ? TITLES[match] : 'Admin';
}

export default function AdminShell({ children, user }) {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} user={user} onMenuToggle={toggle} />
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
