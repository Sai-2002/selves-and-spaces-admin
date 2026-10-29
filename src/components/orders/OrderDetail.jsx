'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Package, MessageSquare } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import { formatCurrency, formatDateTime } from '@/lib/utils';

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'related', label: 'Related' },
];

export default function OrderDetail({ order }) {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 overflow-y-auto"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-mono text-xl font-semibold text-ink">{order.id}</h2>
              <Badge status={order.status} />
            </div>
            <p className="text-sm text-brown/60 mt-1">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-serif font-semibold text-forest">
              {formatCurrency(order.total)}
            </p>
            <p className="text-xs text-brown/50 mt-0.5">incl. tax</p>
          </div>
        </div>

        {/* Customer ref */}
        <div className="flex items-center gap-2 mt-4 py-3 border-t border-tan/20">
          <div className="w-7 h-7 bg-blush rounded-lg flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-brown" />
          </div>
          <div>
            <p className="text-xs text-brown/50 uppercase tracking-wider font-medium">Client</p>
            <Link
              href={`/admin/customers/${order.customerId}`}
              className="text-sm font-medium text-moss hover:text-forest transition-colors"
            >
              {order.customerName}
            </Link>
          </div>
        </div>

        <div className="mt-2">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Tab content */}
      <div className="px-8 py-6">
        {activeTab === 'summary' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="space-y-5"
          >
            {/* Line items */}
            <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
              <div className="px-5 py-3 border-b border-tan/20 flex items-center gap-2">
                <Package className="w-4 h-4 text-brown/50" />
                <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">
                  Items
                </h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-tan/10">
                    <th className="text-left text-xs font-medium text-brown/40 px-5 py-2.5">Product</th>
                    <th className="text-center text-xs font-medium text-brown/40 px-3 py-2.5">Qty</th>
                    <th className="text-right text-xs font-medium text-brown/40 px-5 py-2.5">Unit Price</th>
                    <th className="text-right text-xs font-medium text-brown/40 px-5 py-2.5">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-b border-tan/10 last:border-0">
                      <td className="px-5 py-3 text-sm text-ink">{item.productName}</td>
                      <td className="px-3 py-3 text-sm text-ink text-center">{item.quantity}</td>
                      <td className="px-5 py-3 text-sm text-ink text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-ink text-right">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-tan/20 px-5 py-3 space-y-1.5">
                <div className="flex justify-between text-sm text-brown/60">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-brown/60">
                  <span>Tax (8%)</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-ink pt-1.5 border-t border-tan/20">
                  <span>Total</span>
                  <span className="text-forest">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-xl border border-tan/30 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-brown/50" />
                  <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">Notes</h3>
                </div>
                <p className="text-sm text-ink leading-relaxed">{order.notes}</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'related' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            <div className="bg-white rounded-xl border border-tan/30 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">
                Related
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blush rounded-lg flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-brown" />
                </div>
                <div>
                  <p className="text-xs text-brown/50 uppercase tracking-wider font-medium">Client</p>
                  <Link
                    href={`/admin/customers/${order.customerId}`}
                    className="text-sm font-medium text-moss hover:text-forest transition-colors"
                  >
                    {order.customerName} →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
