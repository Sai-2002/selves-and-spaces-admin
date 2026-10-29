'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
} from 'recharts';

const data = [
  { month: 'Sep', revenue: 420 },
  { month: 'Oct', revenue: 680 },
  { month: 'Nov', revenue: 540 },
  { month: 'Dec', revenue: 890 },
  { month: 'Jan', revenue: 720 },
  { month: 'Feb', revenue: 1050 },
  { month: 'Mar', revenue: 960 },
  { month: 'Apr', revenue: 1240 },
  { month: 'May', revenue: 1100 },
  { month: 'Jun', revenue: 1380 },
  { month: 'Jul', revenue: 1520 },
  { month: 'Aug', revenue: 1680 },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-tan/30 rounded-lg shadow-lg px-3 py-2">
        <p className="text-xs text-brown/60">{label}</p>
        <p className="text-sm font-semibold text-forest">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl p-5 border border-tan/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Revenue</h3>
          <p className="text-xs text-brown/50">Last 12 months</p>
        </div>
        <span className="text-xs font-medium text-moss bg-moss/10 px-2 py-1 rounded-full">
          +24% this year
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2B4A3A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2B4A3A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#8B6B47', opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8B6B47', opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#C4A882', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4A7C59"
            strokeWidth={2}
            fill="url(#forestGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#2B4A3A', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
