'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function CustomerRow({ customer, isActive }) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ x: 2 }}
      transition={{ duration: 0.15 }}
      onClick={() => router.push(`/admin/customers/${customer.id}`)}
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 cursor-pointer border-b border-tan/20 transition-colors duration-100',
        isActive
          ? 'bg-blush/60 border-l-2 border-l-forest'
          : 'hover:bg-cream/80 border-l-2 border-l-transparent'
      )}
    >
      <Avatar name={customer.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{customer.name}</p>
        <p className="text-xs text-brown/60 truncate">{customer.email}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge status={customer.status} />
        <span className="text-xs text-brown/50">{formatCurrency(customer.totalSpent)}</span>
      </div>
    </motion.div>
  );
}
