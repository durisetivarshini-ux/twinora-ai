import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceDot, ReferenceLine
} from 'recharts';
import { TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
import { fetchRevenueTrend, fetchBusinessOverview, fetchCustomerSegments } from '../services/apiService';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E4E7ED] rounded-xl px-3 py-2.5 shadow-lg text-[12px]">
      <p className="font-semibold text-[#0E1117] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="font-bold" style={{ color: p.color }}>
          {p.name === 'revenue' ? '₹' : ''}{p.value?.toLocaleString('en-IN')}{p.name === 'r' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('30d');
  const [trendData, setTrendData] = useState(null);
  const [overview, setOverview] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchRevenueTrend(dateRange),
      fetchBusinessOverview(dateRange),
      fetchCustomerSegments()
    ]).then(([trend, ov, segs]) => {
      setTrendData(trend);
      setOverview(ov);
      setCohorts(segs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [dateRange]);

  const timeseries = trendData?.timeseries || Array.from({ length: 20 }, (_, i) => ({
    date: `Aug ${i + 1}`,
    revenue: Math.round(42000 + Math.sin(i * 0.5) * 10000 + i * 800),
  }));

  const anomalyDay = timeseries[Math.min(7, timeseries.length - 1)];
  const recoveryDay = timeseries[Math.min(12, timeseries.length - 1)];

  const totalRevL = overview ? (overview.totalRevenue / 100000).toFixed(2) : '8.42';
  const revChange = overview ? overview.revenueChangePct : -19.8;

  const kpis = [
    {
      label: 'Revenue',
      value: `₹${totalRevL}L`,
      delta: `${revChange > 0 ? '+' : ''}${revChange}%`,
      neg: revChange < 0
    },
    {
      label: 'Orders',
      value: overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940',
      delta: '+4.2%',
      neg: false
    },
    {
      label: 'Repeat rate',
      value: `${overview ? overview.repeatRate : 34}%`,
      delta: '−2.1%',
      neg: true
    },
    {
      label: 'Avg order',
      value: `₹${overview ? overview.aov : 864}`,
      delta: '+₹28',
      neg: false
    },
  ];

  const cohortBars = cohorts.map(c => ({
    name: c.label,
    value: c.count,
    fill: c.color
  }));

  const retentionPoints = [
    { m: 'Mar', r: 38 }, { m: 'Apr', r: 36 }, { m: 'May', r: 37 },
    { m: 'Jun', r: 35 }, { m: 'Jul', r: 34 }, { m: 'Aug', r: overview ? overview.repeatRate : 32 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-canvas space-y-5 max-w-[1100px]">

      {/* Header with Date Range Filter Chips */}
      <div className="fade-up flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Evidence workspace — {dateRange} business performance with Twinora telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Dynamic Date Range Filter Chips */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E4E7ED] shadow-sm text-[12px]">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: 'Quarter' },
              { id: 'all', label: '1 Year' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setDateRange(chip.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${dateRange === chip.id
                    ? 'bg-[#4F52E8] text-white shadow-sm'
                    : 'text-[#5C6370] hover:text-[#0E1117] hover:bg-[#F8F9FC]'
                  }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <button onClick={() => navigate('/simulate')} className="btn-primary shrink-0 gap-2">
            Simulate improvements <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="fade-up fade-up-delay-1 flex gap-px bg-white rounded-2xl border border-[#E4E7ED] overflow-hidden shadow-sm">
        {kpis.map((k, i) => (
          <div key={k.label} className={`flex-1 px-5 py-4 ${i < kpis.length - 1 ? 'border-r border-[#E4E7ED]' : ''}`}>
            <p className="text-[11px] font-medium text-[#9BA3B0] mb-1.5">{k.label}</p>
            <p className="text-[19px] font-bold text-[#0E1117] leading-none tracking-tight">{k.value}</p>
            <div className="mt-1.5">
              {k.neg
                ? <span className="trend-down"><TrendingDown className="w-3 h-3" />{k.delta}</span>
                : <span className="trend-up"><TrendingUp className="w-3 h-3" />{k.delta}</span>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart — evidence workspace with annotations */}
      <div className="fade-up fade-up-delay-2 panel overflow-hidden">
        {/* Twinora interpretation header */}
        <div className="px-5 pt-5 pb-4 border-b border-[#E4E7ED]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="section-label mb-1.5">Twinora interpretation</p>
              <p className="text-[14px] font-bold text-[#0E1117] leading-snug">
                Revenue recovered after mid-cycle promotion, but repeat purchases remain below baseline.
              </p>
              <p className="text-[12.5px] text-[#5C6370] mt-1.5 leading-relaxed max-w-xl">
                {trendData?.narrative || 'Revenue dipped during mid-cycle as inactive accounts exceeded their typical 32-day repurchase cycle. Repeat purchase frequency is currently below baseline.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/customers')}
              className="btn-link shrink-0"
            >
              Investigate <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chart with inline annotations */}
        <div className="px-4 py-5 relative">
          <div className="relative">
            <div className="flex items-center gap-4 mb-2 px-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#D92E2E]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D92E2E]" />
                Retention anomaly detected (Mid-period)
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#05875F]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#05875F]" />
                Recovery signal
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timeseries} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F52E8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4F52E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9BA3B0' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#9BA3B0' }} tickLine={false} axisLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine x={anomalyDay?.date} stroke="#D92E2E" strokeDasharray="3 2" strokeWidth={1.5} />
              <ReferenceLine x={recoveryDay?.date} stroke="#05875F" strokeDasharray="3 2" strokeWidth={1.5} />
              <ReferenceDot
                x={anomalyDay?.date} y={anomalyDay?.revenue}
                r={5} fill="#D92E2E" stroke="#fff" strokeWidth={2}
              />
              <ReferenceDot
                x={recoveryDay?.date} y={recoveryDay?.revenue}
                r={5} fill="#05875F" stroke="#fff" strokeWidth={2}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4F52E8" strokeWidth={2}
                fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#4F52E8' }} />
            </AreaChart>
          </ResponsiveContainer>

          <div className="mt-3 flex items-center gap-2 text-[12px]">
            <span className="text-[#9BA3B0]">Want to understand why repeat velocity dropped?</span>
            <button
              onClick={() => navigate('/customers')}
              className="btn-link"
            >
              Ask Twinora why <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2-col: Cohort + Retention */}
      <div className="fade-up fade-up-delay-3 grid lg:grid-cols-2 gap-4">

        {/* Cohort chart */}
        <div className="panel p-5">
          <p className="text-[13px] font-semibold text-[#0E1117] mb-0.5">Customer cohort mix</p>
          <p className="text-[11.5px] text-[#9BA3B0] mb-4">
            {overview ? overview.uniqueCustomersCount.toLocaleString('en-IN') : '948'} accounts across 4 behavioral segments.
          </p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={cohortBars} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9BA3B0' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9BA3B0' }} tickLine={false} axisLine={false} />
              <Tooltip formatter={v => [`${v} accounts`, '']} contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {cohortBars.map(entry => (
                  <rect key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-[#FEF1F1] border border-[#FECACA] rounded-xl text-[12px] text-[#5C6370]">
            <span className="text-[#D92E2E] font-semibold">↓ {overview?.activeDormantAccounts || 32} accounts</span> moved to Dormant · high recovery potential
          </div>
        </div>

        {/* Retention trend */}
        <div className="panel p-5">
          <p className="text-[13px] font-semibold text-[#0E1117] mb-0.5">Retention trend</p>
          <p className="text-[11.5px] text-[#9BA3B0] mb-4">Monthly repeat purchase rate — 6 months.</p>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={retentionPoints} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F7" />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#9BA3B0' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9BA3B0' }} tickLine={false} axisLine={false} unit="%" domain={[25, 45]} />
              <Tooltip formatter={v => [`${v}%`, 'Retention']} contentStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="r" stroke="#D92E2E" strokeWidth={2}
                dot={{ r: 3, fill: '#D92E2E', strokeWidth: 0 }}
                activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-[12px] text-[#5C6370]">
            ↓ Repeat purchase velocity dropped. Re-engaging dormant accounts is the top recovery priority.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
