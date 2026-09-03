import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { fetchOpportunities, fetchBusinessOverview } from '../services/apiService';
import { useDateRange } from '../context/DateRangeContext';

const PRIORITY_COLORS = {
  HIGH: { dot: '#D92E2E', badge: 'badge-danger', bar: '#D92E2E' },
  MEDIUM: { dot: '#C97308', badge: 'badge-warning', bar: '#C97308' },
  LOW: { dot: '#05875F', badge: 'badge-success', bar: '#05875F' },
};

/* Signal strength bars (3 bars, filled based on priority) */
function SignalBars({ priority }) {
  const bars = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const n = bars[priority] || 1;
  const color = PRIORITY_COLORS[priority]?.bar || '#9BA3B0';
  return (
    <div className="flex items-end gap-0.5 h-4">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="w-1 rounded-sm transition-all"
          style={{
            height: `${(i / 3) * 100}%`,
            background: i <= n ? color : '#E4E7ED',
          }}
        />
      ))}
    </div>
  );
}

/* Mini cause-flow used in inspector */
function CausePath({ steps }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <span className="px-1.5 py-0.5 bg-[#EEF0FF] text-[#4F52E8] text-[10px] font-semibold rounded">{s}</span>
          {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-[#CDD1DC] shrink-0" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Opportunities() {
  const navigate = useNavigate();
  const { dateRange } = useDateRange();
  const [opps, setOpps] = useState([]);
  const [overview, setOverview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchOpportunities(),
      fetchBusinessOverview(dateRange)
    ]).then(([d, ov]) => {
      setOpps(d);
      setSelected(d[0] || null);
      setOverview(ov);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [dateRange]);

  const total = opps.reduce((s, o) => s + (o.potentialRevenue || 0), 0);

  const cause_flows = {
    0: [`Revenue ${overview?.revenueChangePct || -19.8}%`, 'Repeat velocity', 'Dormant VIPs'],
    1: ['Catalog elasticity', 'Cross-sell affinity', 'Bundle test'],
    2: ['Pricing tier', 'Margin concession', 'Price elasticity'],
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-7 h-7 border-2 border-[#4F52E8] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="page-canvas space-y-4 max-w-[1100px]">

      {/* Header */}
      <div className="fade-up flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Opportunity Radar</h1>
          <p className="page-subtitle">
            {opps.length} ranked strategies · <span className="text-[#05875F] font-semibold">₹{(total / 1000).toFixed(1)}K</span> identified recovery potential
          </p>
        </div>
        <button onClick={() => navigate('/simulate')} className="btn-primary shrink-0 gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Simulate top opportunity
        </button>
      </div>

      {/* ── SPLIT LAYOUT: FEED + INSPECTOR ── */}
      <div className="fade-up fade-up-delay-1 grid lg:grid-cols-[340px_1fr] gap-4" style={{ minHeight: 520 }}>

        {/* LEFT: Ranked intelligence feed */}
        <div className="panel overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E4E7ED]">
            <p className="text-[11.5px] font-semibold text-[#9BA3B0] uppercase tracking-wider">Live intelligence feed</p>
          </div>
          <div className="divide-y divide-[#F0F2F7]">
            {opps.map((opp, i) => {
              const isSelected = selected?.id === opp.id;
              return (
                <button
                  key={opp.id}
                  onClick={() => setSelected(opp)}
                  className={`w-full px-4 py-4 text-left transition-all ${isSelected ? 'bg-[#F4F5FE] border-r-2 border-r-[#4F52E8]' : 'hover:bg-[#F8F9FC]'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <SignalBars priority={opp.impact} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10.5px] font-bold mono text-[#9BA3B0]">{String(i + 1).padStart(2, '0')}</span>
                          <span className="text-[10px] text-[#9BA3B0]">·</span>
                          <span className="text-[10.5px] font-semibold text-[#9BA3B0]">{opp.category}</span>
                        </div>
                        <p className={`text-[13px] font-semibold leading-snug ${isSelected ? 'text-[#4F52E8]' : 'text-[#0E1117]'}`}>
                          {opp.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-bold text-[#05875F]">+₹{((opp.potentialRevenue || 0) / 1000).toFixed(1)}K</p>
                      <p className="text-[10px] text-[#9BA3B0] mt-0.5">{opp.impact} priority</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Persistent intelligence inspector */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="space-y-3"
            >
              {/* Strategy headline */}
              <div className="panel-deep p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B5C6] ping-dot" />
                  <span className="text-[11px] font-semibold text-[#12B5C6] uppercase tracking-widest">Intelligence</span>
                </div>
                <h2 className="text-[20px] font-bold text-white leading-snug mb-2">{selected.title}</h2>
                <p className="text-[13px] text-[#7B93B0] leading-relaxed mb-5">{selected.description}</p>

                {/* Cause flow */}
                <div className="mb-5">
                  <p className="section-label text-[#4F7A9E] mb-2">Signal path</p>
                  <CausePath steps={cause_flows[opps.indexOf(selected)] || ['Signal', 'Cause', 'Opportunity']} />
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { label: 'Revenue potential', value: `+₹${((selected.potentialRevenue || 0) / 1000).toFixed(1)}K` },
                    { label: 'Target segment', value: selected.targetCohort || 'Customer Accounts' },
                    { label: 'Risk level', value: selected.risk || 'Low' },
                    { label: 'Evidence confidence', value: `${selected.confidenceScore || 88}%` },
                  ].map(item => (
                    <div key={item.label} className="panel-deep-3 px-3 py-2.5">
                      <p className="text-[10px] text-[#7B93B0] font-medium mb-0.5">{item.label}</p>
                      <p className="text-[14px] font-bold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Suggested offer */}
                <div className="bg-[#4F52E8]/15 border border-[#4F52E8]/25 rounded-xl px-4 py-3 mb-4">
                  <p className="text-[10.5px] text-[#8B8FFF] font-semibold uppercase tracking-wider mb-1">Suggested approach</p>
                  <p className="text-[13.5px] font-bold text-white">{selected.suggestedOffer || '15% comeback discount'}</p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => navigate('/simulate')} className="btn-primary flex-1 gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Simulate strategy
                  </button>
                  <button onClick={() => navigate('/actions')} className="btn-secondary flex-1">
                    Build action plan
                  </button>
                </div>
              </div>

              {/* Evidence */}
              <div className="panel p-4">
                <p className="section-label mb-3">Evidence sources</p>
                <div className="space-y-2">
                  {[
                    `${overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940'} orders analyzed from database`,
                    `${overview ? overview.uniqueCustomersCount.toLocaleString('en-IN') : '948'} customer RFM profiles computed`,
                    `${overview?.activeDormantAccounts || 32} accounts inactive for 45+ days`,
                    '32-day historical repurchase baseline',
                  ].map(e => (
                    <div key={e} className="flex items-center gap-2 text-[12px] text-[#5C6370]">
                      <div className="w-1 h-1 rounded-full bg-[#4F52E8] shrink-0" />
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="panel flex items-center justify-center text-[#9BA3B0] text-[13px]">
              Select an opportunity to inspect
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
