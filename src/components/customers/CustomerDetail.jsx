'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Phone, Mail, Calendar, ShoppingBag, DollarSign, Tag } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import { formatCurrency, formatDate } from '@/lib/utils';

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'orders', label: 'Orders' },
  { id: 'notes', label: 'Notes' },
];

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-blush rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-brown" />
      </div>
      <div>
        <p className="text-xs text-brown/50 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm text-ink mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function CustomerDetail({ customer, orders }) {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <motion.div
      key={customer.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex-1 overflow-y-auto"
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-start gap-5">
          <Avatar name={customer.name} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-serif font-semibold text-ink">{customer.name}</h2>
              <Badge status={customer.status} />
            </div>
            <p className="text-sm text-brown/60 mt-1">
              {customer.therapist} · Joined {formatDate(customer.joinedAt)}
            </p>
            {customer.tags.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-lavender-soft/40 text-lavender text-xs rounded-full border border-lavender/20"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 text-center flex-shrink-0">
            <div>
              <p className="text-2xl font-serif font-semibold text-moss">{customer.totalOrders}</p>
              <p className="text-xs text-brown/50">Orders</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-semibold text-brown">
                {formatCurrency(customer.totalSpent)}
              </p>
              <p className="text-xs text-brown/50">Spent</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Contact info */}
            <div className="bg-white rounded-xl border border-tan/30 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">Contact</h3>
              <InfoRow icon={Mail} label="Email" value={customer.email} />
              <InfoRow icon={Phone} label="Phone" value={customer.phone} />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={`${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zip}`}
              />
            </div>

            {/* Account stats */}
            <div className="bg-white rounded-xl border border-tan/30 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider">Account</h3>
              <InfoRow icon={Calendar} label="Member Since" value={formatDate(customer.joinedAt)} />
              <InfoRow icon={ShoppingBag} label="Total Orders" value={customer.totalOrders.toString()} />
              <InfoRow icon={DollarSign} label="Total Spent" value={formatCurrency(customer.totalSpent)} />
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {orders.length === 0 ? (
              <div className="text-center py-10 text-brown/40 text-sm">No orders found.</div>
            ) : (
              <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-tan/20">
                      <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Order</th>
                      <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Date</th>
                      <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Items</th>
                      <th className="text-right text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Total</th>
                      <th className="text-left text-xs font-semibold text-brown/50 uppercase tracking-wider px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-tan/10 hover:bg-cream/50 transition-colors">
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-xs font-mono text-moss hover:text-forest font-medium"
                          >
                            {order.id}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-sm text-brown/60">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-3 text-sm text-ink">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-ink text-right">{formatCurrency(order.total)}</td>
                        <td className="px-5 py-3"><Badge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'notes' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            <div className="bg-white rounded-xl border border-tan/30 p-5">
              <h3 className="text-xs font-semibold text-brown/60 uppercase tracking-wider mb-3">Notes</h3>
              {customer.notes ? (
                <p className="text-sm text-ink leading-relaxed">{customer.notes}</p>
              ) : (
                <p className="text-sm text-brown/40 italic">No notes added.</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
