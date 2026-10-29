'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = {
  Completed: '#7B9E87',
  Pending: '#9B8EC4',
  Processing: '#C4A882',
  Cancelled: '#d1856a',
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-tan/30 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs text-brown/60">{label}</p>
        <p className="text-sm font-semibold text-ink">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
}

export default function OrderStatusChart({ orders }) {
  const counts = {
    Completed: orders.filter((o) => o.status === 'completed').length,
    Pending: orders.filter((o) => o.status === 'pending').length,
    Processing: orders.filter((o) => o.status === 'processing').length,
    Cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white rounded-xl p-5 border border-tan/30">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-ink">Orders by Status</h3>
        <p className="text-xs text-brown/50">All time</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={32}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#8B6B47', opacity: 0.7 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8B6B47', opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FAF7F2' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
