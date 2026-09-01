import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { fetchCustomerSegments, fetchBusinessOverview } from '../services/apiService';
import { useDateRange } from '../context/DateRangeContext';

const RISK_COLORS = { low: '#05875F', medium: '#C97308', high: '#D92E2E' };

/* Flow arrow with count badge */
function FlowArrow({ count, color }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <div className="w-px h-6 bg-[#E4E7ED]" />
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
          <ArrowDown className="w-3 h-3" style={{ color }} />
        </div>
        <span className="text-[10.5px] font-bold" style={{ color }}>↓{count} this month</span>
      </div>
      <div className="w-px h-6 bg-[#E4E7ED]" />
    </div>
  );
}

export default function Customers() {
  const navigate = useNavigate();
  const { dateRange } = useDateRange();
  const [cohorts, setCohorts] = useState([]);
  const [overview, setOverview] = useState(null);
  const [selected, setSelected] = useState('dormant');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCustomerSegments(),
      fetchBusinessOverview(dateRange)
    ]).then(([segs, ov]) => {
      setCohorts(segs);
      setOverview(ov);
      if (segs.length > 0) {
        const found = segs.find(s => s.id === 'dormant') || segs[0];
        setSelected(found.id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [dateRange]);

  const selectedCohort = cohorts.find(c => c.id === selected) || cohorts[0];
  const totalAccounts = cohorts.reduce((s, c) => s + c.count, 0) || overview?.uniqueCustomersCount || 948;

  return (
    <div className="page-canvas space-y-5 max-w-[1080px]">

      {/* Header */}
      <div className="fade-up flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Customer Intelligence</h1>
          <p className="page-subtitle">
            {totalAccounts.toLocaleString('en-IN')} accounts · Behavioral segmentation and cohort lifecycle
          </p>
        </div>
        <button onClick={() => navigate('/simulate')} className="btn-primary shrink-0 gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Simulate segment strategy
        </button>
      </div>

      {/* ── BEHAVIORAL LANDSCAPE — cohort flow ── */}
      <div className="fade-up fade-up-delay-1 panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[13.5px] font-bold text-[#0E1117]">Customer lifecycle landscape</p>
            <p className="text-[12px] text-[#9BA3B0] mt-0.5">How customers move through your business. Click any stage to inspect.</p>
          </div>
          <div className="text-right text-[11px] text-[#9BA3B0]">
            <span className="font-semibold text-[#D92E2E]">{overview?.activeDormantAccounts || 32} moved to Dormant</span> this month
          </div>
        </div>

        {/* Landscape visualization */}
        <div className="grid grid-cols-4 gap-0 items-stretch">
          {cohorts.map((cohort) => {
            const isSelected = selected === cohort.id;
            const total = cohorts.reduce((s, c) => s + c.count, 0) || 1;
            const barHeight = Math.max(12, Math.round((cohort.count / total) * 140));
            return (
              <div key={cohort.id} className="flex flex-col items-center">
                {/* Movement from previous */}
                {cohort.moved > 0 ? (
                  <FlowArrow count={cohort.moved} color={cohort.color} />
                ) : (
                  <div className="h-16" />
                )}

                {/* Cohort column */}
                <button
                  onClick={() => setSelected(cohort.id)}
                  className={`w-full rounded-2xl p-4 text-center transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-current shadow-lg scale-[1.02]'
                      : 'border-transparent hover:border-[#E4E7ED] hover:scale-[1.01]'
                  }`}
                  style={{
                    background: isSelected ? cohort.color : `${cohort.color}08`,
                    borderColor: isSelected ? cohort.color : undefined,
                    boxShadow: isSelected ? `0 8px 24px ${cohort.color}30` : undefined,
                  }}
                >
                  {/* Population bar */}
                  <div className="flex justify-center mb-3">
                    <div className="w-10 bg-black/10 rounded-full flex flex-col-reverse" style={{ height: 80 }}>
                      <div
                        className="rounded-full transition-all duration-500"
                        style={{
                          height: barHeight,
                          background: isSelected ? 'rgba(255,255,255,0.4)' : cohort.color,
                        }}
                      />
                    </div>
                  </div>

                  <p className={`text-[22px] font-bold leading-none ${isSelected ? 'text-white' : 'text-[#0E1117]'}`}>
                    {cohort.count}
                  </p>
                  <p className={`text-[12px] font-semibold mt-1 ${isSelected ? 'text-white/80' : 'text-[#5C6370]'}`}>
                    {cohort.label}
                  </p>
                  <p className={`text-[11px] font-bold mt-1.5 ${isSelected ? 'text-white/70' : ''}`}
                    style={{ color: isSelected ? undefined : RISK_COLORS[cohort.risk] }}>
                    Churn {cohort.churn}%
                  </p>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── COHORT DEEP DIVE ── */}
      <AnimatePresence mode="wait">
        {selectedCohort && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`panel overflow-hidden ${selectedCohort.risk === 'high' ? 'ring-2 ring-[#D92E2E]/20' : ''}`}
          >
            {/* Header bar */}
            <div className="px-5 py-4 border-b border-[#E4E7ED] flex items-center justify-between" style={{ borderLeftColor: selectedCohort.color, borderLeftWidth: 4 }}>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: selectedCohort.color }} />
                <h3 className="text-[15px] font-bold text-[#0E1117]">{selectedCohort.label}</h3>
                <span className="text-[12.5px] text-[#9BA3B0]">{selectedCohort.count} accounts</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/simulate')} className="btn-primary !h-8 !text-[12px] gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Simulate strategy
                </button>
                <button onClick={() => navigate('/actions')} className="btn-secondary !h-8 !text-[12px]">
                  Build campaign
                </button>
              </div>
            </div>

            <div className="p-5 grid lg:grid-cols-4 gap-5 items-start">
              {[
                { label: 'Cohort Avg LTV', value: selectedCohort.avgLTV, sub: `${selectedCohort.description}` },
                { label: 'Churn risk', value: `${selectedCohort.churn}%`, sub: `${selectedCohort.risk} risk tier`, valueColor: RISK_COLORS[selectedCohort.risk] },
                { label: 'Recovery potential', value: selectedCohort.recoveryPotential ? `₹${(selectedCohort.recoveryPotential).toLocaleString('en-IN')}` : '—', sub: selectedCohort.recoveryPotential ? 'With 15% comeback offer' : 'Stable baseline', valueColor: '#05875F' },
                { label: 'Accounts moved', value: selectedCohort.moved > 0 ? `↓${selectedCohort.moved}` : '—', sub: 'Past 30 days drift' },
              ].map(item => (
                <div key={item.label}>
                  <p className="section-label mb-1">{item.label}</p>
                  <p className="text-[22px] font-bold leading-none mt-1" style={{ color: item.valueColor || '#0E1117' }}>
                    {item.value}
                  </p>
                  <p className="text-[11.5px] text-[#9BA3B0] mt-1">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* AI interpretation */}
            {selectedCohort.risk === 'high' && (
              <div className="mx-5 mb-5 p-4 bg-[#FEF1F1] border border-[#FECACA] rounded-xl flex items-start gap-3">
                <div className="w-1.5 h-full min-h-[24px] rounded-full bg-[#D92E2E] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-[#D92E2E] uppercase tracking-wider mb-1">Twinora insight</p>
                  <p className="text-[13px] text-[#374151] leading-relaxed">
                    Dispatch a 15% comeback discount to these {selectedCohort.count} high-LTV accounts before permanent churn.
                    Estimated recovery <strong>₹{(selectedCohort.recoveryPotential || 28400).toLocaleString('en-IN')}</strong> based on
                    {overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940'} purchase records and historical 32-day repurchase cycle.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
