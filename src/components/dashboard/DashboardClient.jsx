'use client';

import { motion } from 'framer-motion';
import { Users, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import OrderStatusChart from './OrderStatusChart';
import RecentOrdersTable from './RecentOrdersTable';
import { formatCurrency } from '@/lib/utils';

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function DashboardClient({ customers, orders, products }) {
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const activeCustomers = customers.filter((c) => c.status === 'active').length;

  const stats = [
    {
      title: 'Total Clients',
      value: customers.length.toString(),
      delta: { label: `${activeCustomers} active`, positive: true },
      icon: Users,
      accentColor: 'text-forest',
    },
    {
      title: 'Active Orders',
      value: activeOrders.toString(),
      delta: { label: 'pending + processing', positive: activeOrders > 0 },
      icon: ShoppingBag,
      accentColor: 'text-moss',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      delta: { label: '+24% this year', positive: true },
      icon: TrendingUp,
      accentColor: 'text-brown',
    },
    {
      title: 'Products',
      value: products.length.toString(),
      delta: { label: 'in catalogue', positive: true },
      icon: Package,
      accentColor: 'text-lavender',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-serif font-semibold text-ink">Dashboard</h2>
        <p className="text-sm text-brown/60 mt-0.5">
          Welcome back — here&apos;s your clinic overview.
        </p>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={staggerItem}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <OrderStatusChart orders={orders} />
        </div>
      </motion.div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.35 }}
      >
        <RecentOrdersTable orders={orders} />
      </motion.div>
    </div>
  );
}
