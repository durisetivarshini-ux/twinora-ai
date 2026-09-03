import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingDown, TrendingUp, ArrowRight, ChevronRight,
  DollarSign, ShoppingBag, Users, BarChart2, CreditCard,
  Sparkles
} from 'lucide-react';
import { fetchBusinessOverview, fetchOpportunities, fetchAgents } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useDateRange } from '../context/DateRangeContext';

/* ── tiny Intelligence Flow cause-path ── */
function CauseFlow({ steps, activeIdx = steps.length - 1 }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <span className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border transition-all ${i === activeIdx
              ? 'bg-[#4F52E8]/10 border-[#4F52E8]/30 text-[#4F52E8]'
              : i < activeIdx
                ? 'bg-[#162035] border-[#1F3050] text-[#7B93B0]'
                : 'bg-transparent border-[#1F3050] text-[#3A4F6A]'
            }`}>
            {step}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className={`w-3 h-3 shrink-0 ${i < activeIdx ? 'text-[#4F52E8]' : 'text-[#2A3D58]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dateRange } = useDateRange();
  const [overview, setOverview] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName?.split(' ')[0] || 'there';
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    Promise.all([
      fetchBusinessOverview(dateRange),
      fetchOpportunities(),
      fetchAgents()
    ]).then(([ov, opps, ags]) => {
      setOverview(ov);
      setOpportunities(opps);
      setAgents(ags);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [dateRange]);

  const totalRevL = overview ? (overview.totalRevenue / 100000).toFixed(2) : '8.42';
  const targetRevL = overview ? (overview.targetRevenue / 100000).toFixed(2) : '10.50';
  const revChange = overview ? overview.revenueChangePct : -19.8;
  const isRevNeg = revChange < 0;

  const metrics = [
    {
      label: 'Revenue',
      value: `₹${totalRevL}L`,
      delta: `${revChange > 0 ? '+' : ''}${revChange}%`,
      neg: isRevNeg,
      sub: `vs ₹${targetRevL}L target`,
      icon: DollarSign
    },
    {
      label: 'Orders',
      value: overview ? `${overview.totalOrdersCount.toLocaleString('en-IN')}` : '2,940',
      delta: '+4.2%',
      neg: false,
      sub: `${overview ? Math.round(overview.totalOrdersCount / 30) : 98} / day`,
      icon: ShoppingBag
    },
    {
      label: 'Customers',
      value: overview ? `${overview.uniqueCustomersCount.toLocaleString('en-IN')}` : '948',
      delta: `+${overview?.activeDormantAccounts ? overview.activeDormantAccounts * 2 : 48}`,
      neg: false,
      sub: `${overview ? overview.repeatRate : 34}% repeat`,
      icon: Users
    },
    {
      label: 'Avg order',
      value: overview ? `₹${overview.aov}` : '₹864',
      delta: '+₹28',
      neg: false,
      sub: `AOV Target ₹950`,
      icon: BarChart2
    },
    {
      label: 'Payment health',
      value: overview ? `${overview.paymentHealthRate}%` : '99.4%',
      delta: '14ms',
      neg: false,
      sub: 'Zero dropouts',
      icon: CreditCard
    },
  ];

  const topOpp = opportunities[0] || {
    title: '32 high-value customers stopped purchasing.',
    description: 'Accounts with past AOV above ₹2,800 have passed their 32-day cycle without ordering.',
    potentialRevenue: 28400,
    targetCohort: 'Dormant VIPs',
    impact: 'HIGH',
    risk: 'Low'
  };

  const statusDot = { completed: '#05875F', running: '#4F52E8', ready: '#9BA3B0', idle: '#C97308' };

  return (
    <div className="page-canvas space-y-5 max-w-[1180px]">

      {/* ── GREETING ROW ── */}
      <div className="fade-up flex items-center justify-between gap-4">
        <div>
          <p className="text-[22px] font-bold text-[#0E1117] tracking-tight leading-none">
            {greeting}, {firstName}.
          </p>
          <p className="text-[12.5px] text-[#9BA3B0] mt-1">
            {day} · Twin synchronized {overview?.lastSynced || '2 minutes ago'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E4E7ED] text-[11px] font-semibold text-[#05875F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#05875F] ping-dot shrink-0" />
            Analyzing {overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940'} transactions
          </div>
          <button onClick={() => navigate('/simulate')} className="btn-primary gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Simulate
          </button>
        </div>
      </div>

      {/* ── BUSINESS PULSE — inline strip, dynamic backend values ── */}
      <div className="fade-up fade-up-delay-1 flex items-center gap-px bg-white rounded-2xl border border-[#E4E7ED] overflow-hidden shadow-sm">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className={`flex-1 px-5 py-4 ${i < metrics.length - 1 ? 'border-r border-[#E4E7ED]' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-[#9BA3B0]">{m.label}</span>
                <Icon className="w-3.5 h-3.5 text-[#D4D9E3]" strokeWidth={1.5} />
              </div>
              <p className="text-[19px] font-bold text-[#0E1117] leading-none tracking-tight">{m.value}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {m.neg
                  ? <span className="trend-down"><TrendingDown className="w-3 h-3" />{m.delta}</span>
                  : <span className="trend-up"><TrendingUp className="w-3 h-3" />{m.delta}</span>
                }
                <span className="text-[10.5px] text-[#9BA3B0]">{m.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DRAMATIC INTELLIGENCE MOMENT (DYNAMIC TOP OPPORTUNITY) ── */}
      <div className="fade-up fade-up-delay-2 panel-deep overflow-hidden relative">
        <div className="scan-line" />

        <div className="px-7 pt-6 pb-3">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12B5C6] ping-dot" />
            <span className="text-[11px] font-semibold text-[#12B5C6] uppercase tracking-widest">
              Twinora Intelligence Detection
            </span>
          </div>

          <div className="grid lg:grid-cols-[1fr_240px] gap-8 items-start">
            {/* Left content */}
            <div>
              <h2 className="text-[22px] font-bold text-white leading-snug mb-3">
                {topOpp.title}
              </h2>
              <p className="text-[13px] text-[#7B93B0] leading-relaxed mb-5 max-w-md">
                {topOpp.description}
              </p>

              {/* Cause flow */}
              <CauseFlow
                steps={[
                  `Revenue ${revChange}%`,
                  'Repeat velocity',
                  topOpp.targetCohort || 'VIP Cohort',
                  `${overview?.activeDormantAccounts || 32} inactive accounts`
                ]}
                activeIdx={3}
              />

              {/* Progress indicators */}
              <div className="flex items-center gap-5 mt-5 text-[11.5px]">
                {['Signal detected', 'Cause identified', 'Opportunity ready', 'Strategy ready'].map((s, i) => (
                  <div key={s} className="flex items-center gap-1.5 text-[#4F7A9E]">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${i < 3 ? 'bg-[#05875F]/20' : 'bg-[#4F52E8]/20'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${i < 3 ? 'bg-[#05875F]' : 'bg-[#4F52E8]'}`} />
                    </div>
                    <span className={i === 3 ? 'text-white font-semibold' : ''}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — recovery box */}
            <div className="panel-deep-3 p-5">
              <p className="text-[10.5px] font-semibold text-[#7B93B0] uppercase tracking-wider mb-2">
                Calculated recovery
              </p>
              <p className="text-[38px] font-bold text-white leading-none tracking-tight mb-1">
                ₹{(topOpp.potentialRevenue || 28400).toLocaleString('en-IN')}
              </p>
              <p className="text-[11.5px] text-[#7B93B0] mb-4">
                Range ₹{Math.round((topOpp.potentialRevenue || 28400) * 0.88).toLocaleString('en-IN')} – ₹{Math.round((topOpp.potentialRevenue || 28400) * 1.14).toLocaleString('en-IN')} · Deterministic model
              </p>
              <div className="flex flex-col gap-2">
                <p className="text-[11px] text-[#4F7A9E] flex justify-between">
                  <span>Evidence strength</span>
                  <span className="text-[#05875F] font-semibold">High ({topOpp.confidenceScore || 91}%)</span>
                </p>
                <p className="text-[11px] text-[#4F7A9E] flex justify-between">
                  <span>Risk level</span>
                  <span className="text-white font-semibold">{topOpp.risk || 'Low'}</span>
                </p>
                <p className="text-[11px] text-[#4F7A9E] flex justify-between">
                  <span>Target cohort</span>
                  <span className="text-white font-semibold">{topOpp.targetCohort || 'Dormant VIPs'}</span>
                </p>
              </div>
              <button
                onClick={() => navigate('/simulate')}
                className="w-full mt-4 flex items-center justify-center gap-2 h-9 rounded-lg bg-[#4F52E8] hover:bg-[#3E41CC] text-white text-[13px] font-semibold transition-all hover:shadow-lg hover:shadow-[#4F52E8]/25 active:scale-[0.98]"
              >
                Simulate this opportunity
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/customers')}
                className="w-full mt-2 h-8 text-[12px] font-medium text-[#7B93B0] hover:text-white transition-colors"
              >
                Inspect customer cohort
              </button>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mx-7 mb-5 pt-4 border-t border-[#1F3050] flex items-center gap-5 text-[11.5px] text-[#4F7A9E] flex-wrap">
          <span>{overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940'} transactions analyzed</span>
          <span>·</span>
          <span>{overview ? overview.uniqueCustomersCount.toLocaleString('en-IN') : '948'} customer RFM profiles</span>
          <span>·</span>
          <span>{overview?.activeDormantAccounts || 32} accounts recency &gt;45 days</span>
          <span>·</span>
          <span>32-day repurchase baseline</span>
        </div>
      </div>

      {/* ── SECONDARY ROW ── */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-4 fade-up fade-up-delay-3">

        {/* Ranked opportunities */}
        <div className="panel p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-[#0E1117]">Ranked Opportunities</p>
            <button onClick={() => navigate('/opportunities')} className="btn-link text-[12px]">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {opportunities.slice(0, 3).map((opp, i) => (
              <div
                key={opp.id}
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => navigate('/opportunities')}
              >
                <span className="text-[11px] font-bold mono text-[#D4D9E3] w-5 shrink-0 text-right">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#2D3748] group-hover:text-[#4F52E8] transition-colors truncate leading-none">
                    {opp.title}
                  </p>
                  <p className="text-[11.5px] text-[#9BA3B0] mt-0.5">{opp.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold text-[#05875F]">+₹{(opp.potentialRevenue / 1000).toFixed(1)}K</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Agent status strip */}
        <div className="panel-deep p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12.5px] font-semibold text-white">AI agents</p>
            <button onClick={() => navigate('/agents')} className="btn-link text-[11.5px] text-[#12B5C6]">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {agents.map(ag => (
              <div key={ag.name} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 ping-dot" style={{ background: statusDot[ag.status] || '#9BA3B0' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold text-[#E8ECF2] leading-none">{ag.name}</p>
                  <p className="text-[10.5px] text-[#7B93B0] mt-0.5">{ag.currentOutput}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACTIVITY TICKER (DYNAMIC TELEMETRY) ── */}
      <div className="fade-up fade-up-delay-4 flex items-start gap-4 px-5 py-3 bg-white rounded-xl border border-[#E4E7ED] text-[11.5px] text-[#9BA3B0] overflow-x-auto">
        {[
          ['2m ago', `${overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940'} transactions synchronized`],
          ['8m ago', `${overview?.activeDormantAccounts || 32} dormant accounts flagged by Customer Agent`],
          ['14m ago', `15% discount simulation completed (+₹${(topOpp.potentialRevenue || 28400).toLocaleString('en-IN')})`],
          ['22m ago', 'Campaign plan AP-904 prepared for operator execution'],
        ].map(([time, text]) => (
          <div key={text} className="flex items-start gap-2 whitespace-nowrap">
            <span className="mono text-[10.5px] text-[#C5CAD4] shrink-0 mt-0.5">{time}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
