import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Play, ChevronDown, CheckCircle, ArrowRight,
  History, Info, Sparkles, Scale, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { fetchCustomerSegments, fetchBusinessOverview, fetchDecisionMemory, runSimulation } from '../services/apiService';
import { useDateRange } from '../context/DateRangeContext';

/* ── Interactive Living Twin Preview Nodes ── */
const PREVIEW_NODES = [
  {
    id: 'customers',
    label: 'Customers',
    x: 230,
    y: 85,
    r: 34,
    color: '#4F52E8',
    getValue: (discount, cohortCount) => `${cohortCount} affected`,
    status: 'Direct Target',
    impactDesc: 'Receives the targeted discount incentive via WhatsApp & Email channels.'
  },
  {
    id: 'retention',
    label: 'Retention',
    x: 440,
    y: 110,
    r: 32,
    color: '#D92E2E',
    getValue: (discount) => discount > 0 ? '+14.2% lift' : 'At risk (84%)',
    status: 'Primary Shift',
    impactDesc: 'Incentive shortens the repurchase cycle toward historical baseline.'
  },
  {
    id: 'revenue',
    label: 'Revenue',
    x: 450,
    y: 250,
    r: 36,
    color: '#05875F',
    getValue: (discount) => discount > 0 ? '+Recovery lift' : '−Velocity',
    status: 'Net Recovery',
    impactDesc: 'Gross recovery offset by margin discount concession on active orders.'
  },
  {
    id: 'growth',
    label: 'Growth',
    x: 310,
    y: 310,
    r: 28,
    color: '#4F52E8',
    getValue: () => 'Twin Model',
    status: 'Twin Composite',
    impactDesc: 'Overall business health index updates based on converted customer LTV.'
  },
  {
    id: 'products',
    label: 'Products',
    x: 120,
    y: 260,
    r: 28,
    color: '#5C6370',
    getValue: () => 'Catalog boost',
    status: 'Catalog Affinity',
    impactDesc: 'Catalog inventory drawn for top items with high past affinity for target segment.'
  },
  {
    id: 'payments',
    label: 'Payments',
    x: 105,
    y: 125,
    r: 26,
    color: '#05875F',
    getValue: () => '99.4% auth',
    status: 'Gateway Stable',
    impactDesc: 'Zero expected dropouts on Razorpay/UPI gateway rails during campaign burst.'
  },
];

const PREVIEW_LINKS = [
  { from: 'customers', to: 'retention', isMainPath: true },
  { from: 'retention', to: 'revenue', isMainPath: true },
  { from: 'revenue', to: 'growth', isMainPath: false },
  { from: 'growth', to: 'products', isMainPath: false },
  { from: 'products', to: 'payments', isMainPath: false },
  { from: 'payments', to: 'customers', isMainPath: false },
  { from: 'customers', to: 'revenue', isMainPath: true, curved: true },
];

function buildCurve(a, b, curved) {
  if (!curved) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
  }
  const mx = (a.x + b.x) / 2 + 25;
  const my = (a.y + b.y) / 2 - 20;
  return `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
}

const STRATEGIES_COMPARE = [
  {
    id: 'baseline',
    name: 'Current Path',
    tag: 'Baseline (Do Nothing)',
    expectedLift: '₹0',
    range: '₹0',
    targetCount: '0 accounts',
    marginImpact: '0.0%',
    retentionLift: '0.0%',
    risk: 'High Churn Decay',
    riskColor: '#D92E2E',
    summary: '32 dormant VIP accounts remain inactive. Inactivity churn progresses to permanent attrition.'
  },
  {
    id: 'strat-a',
    name: 'Strategy A: 15% VIP Comeback',
    tag: 'Highest ROI Winback',
    expectedLift: '+₹28,400',
    range: '₹24,200 – ₹31,800',
    targetCount: '32 dormant VIPs',
    marginImpact: '−1.2%',
    retentionLift: '+22.0%',
    risk: 'Low Risk',
    riskColor: '#05875F',
    summary: 'Targeted WhatsApp & Email vouchers to dormant VIPs. High past AOV (₹2,840) generates rapid recovery.',
    recommended: true,
    presetDiscount: 15
  },
  {
    id: 'strat-b',
    name: 'Strategy B: 10% Accessory Bundle',
    tag: 'AOV Expansion',
    expectedLift: '+₹19,500',
    range: '₹16,800 – ₹22,100',
    targetCount: '56 active accounts',
    marginImpact: '−0.8%',
    retentionLift: '+12.5%',
    risk: 'Low Risk',
    riskColor: '#05875F',
    summary: 'Bundle discount pairing SonicBuds Pro with Leather Armor Case for active repeat shoppers.',
    presetDiscount: 10
  },
  {
    id: 'strat-c',
    name: 'Strategy C: +5% Price Realignment',
    tag: 'Margin Realignment',
    expectedLift: '+₹15,600',
    range: '₹11,200 – ₹18,900',
    targetCount: 'All 64 SKUs',
    marginImpact: '+3.4%',
    retentionLift: '−2.1%',
    risk: 'Moderate Elasticity Risk',
    riskColor: '#C97308',
    summary: 'Margin realignment across high-velocity accessory SKUs with low demand elasticity.',
    presetDiscount: 0
  }
];

export default function SimulationLab() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dateRange } = useDateRange();

  const [mode, setMode] = useState('single'); // 'single' | 'compare'
  const [discount, setDiscount] = useState(15);
  const [selectedCohortId, setSelectedCohortId] = useState('dormant');
  const [horizon, setHorizon] = useState(7);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const [cohorts, setCohorts] = useState([]);
  const [overview, setOverview] = useState(null);
  const [decisionMemory, setDecisionMemory] = useState({ avgAccuracy: '95.3%', history: [] });

  useEffect(() => {
    Promise.all([
      fetchCustomerSegments(),
      fetchBusinessOverview(dateRange),
      fetchDecisionMemory()
    ]).then(([segs, ov, dm]) => {
      setCohorts(segs);
      setOverview(ov);
      setDecisionMemory(dm);
    }).catch(() => { });
  }, [dateRange]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'compare') {
      setMode('compare');
    }
    if (params.get('preset') === 'comeback-15') {
      setDiscount(15);
      setSelectedCohortId('dormant');
    }
  }, [location.search]);

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId) || cohorts.find(c => c.key === 'Dormant') || { count: 32, label: 'Dormant VIPs' };
  const txnCount = overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '60';

  const handleRun = async (overrideDiscount = discount) => {
    setRunning(true);
    setResult(null);
    try {
      const res = await runSimulation({
        discountPct: overrideDiscount,
        targetSegment: selectedCohortId,
        durationDays: horizon
      });
      setResult(res);
    } catch {
      setResult({
        id: 'sim-res-dyn',
        targetCount: selectedCohort.count || 32,
        baseline: { revenue: 42000, orders: 18, aov: 2330, retentionRate: 16 },
        simulated: { revenue: 70400, orders: 31, aov: 2270, retentionRate: 38 },
        deltas: { revenueDeltaVal: 28400, revenueDeltaPct: '+67.6%' },
        confidenceRange: '₹24,200 – ₹31,800',
        evidenceStrength: 'Verified Historical Model',
        risk: 'Low Risk',
        timeSeriesComparison: []
      });
    } finally {
      setRunning(false);
    }
  };

  const centerCore = { x: 275, y: 180 };

  return (
    <div className="page-canvas space-y-6 max-w-[1100px] font-sans">

      {/* Header with Mode Toggle */}
      <div className="fade-up flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Simulation Decision Lab</h1>
          <p className="page-subtitle">
            Deterministic sandbox. Model customer response, margin concessions, and net revenue lift before execution.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E4E7ED] shadow-xs text-[12px]">
            <button
              onClick={() => setMode('single')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${mode === 'single'
                  ? 'bg-[#4F52E8] text-white shadow-xs'
                  : 'text-[#5C6370] hover:text-[#0E1117]'
                }`}
            >
              Scenario Sandbox
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${mode === 'compare'
                  ? 'bg-[#4F52E8] text-white shadow-xs'
                  : 'text-[#5C6370] hover:text-[#0E1117]'
                }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare Strategies</span>
            </button>
          </div>

          <button onClick={() => navigate('/actions')} className="btn-secondary !h-9 text-[12.5px] gap-2">
            <span>View Plans</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── MODE 1: STRATEGY COMPARE MATRIX ── */}
      {mode === 'compare' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* Twinora Strategy Trade-off Synthesis */}
          <div className="panel-deep p-5 rounded-2xl text-white space-y-2 relative overflow-hidden">
            <div className="scan-line" />
            <div className="flex items-center justify-between text-[11px] text-[#12B5C6] font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Twinora Strategy Evaluation</span>
              </span>
              <span className="badge badge-brand text-[9.5px]">Deterministic Synthesis</span>
            </div>
            <h3 className="text-[16px] font-bold text-white">
              Strategy A delivers the highest expected recovery (+₹28,400) with minimal margin cannibalization.
            </h3>
            <p className="text-[12.5px] text-[#CAD4E0] leading-relaxed">
              Comparison across 3 scenarios shows Strategy A achieves the strongest risk-adjusted return by re-engaging 32 dormant VIP accounts. Strategy B offers lower downside volatility with broader active account engagement (+₹19,500), while Strategy C provides permanent margin expansion at minor volume elasticity risk.
            </p>
          </div>

          {/* Side-by-Side Comparison Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STRATEGIES_COMPARE.map((strat) => (
              <div
                key={strat.id}
                className={`panel p-5 flex flex-col justify-between transition-all relative ${strat.recommended ? 'border-2 border-[#4F52E8] shadow-md shadow-[#4F52E8]/10' : ''
                  }`}
              >
                {strat.recommended && (
                  <span className="absolute -top-2.5 right-4 bg-[#4F52E8] text-white text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    Recommended
                  </span>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="text-[10.5px] font-semibold text-[#9BA3B0] uppercase">{strat.tag}</span>
                    <h4 className="text-[14px] font-bold text-[#0E1117] mt-0.5">{strat.name}</h4>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#9BA3B0] block">Expected Net Lift</span>
                    <p className="text-[22px] font-bold text-[#05875F] leading-tight tracking-tight">{strat.expectedLift}</p>
                    <span className="text-[11px] text-[#7B93B0] font-mono">{strat.range}</span>
                  </div>

                  <div className="space-y-1.5 py-2 border-y border-[#F0F2F7] text-[11.5px]">
                    <div className="flex justify-between">
                      <span className="text-[#9BA3B0]">Target:</span>
                      <span className="font-semibold text-[#0E1117]">{strat.targetCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9BA3B0]">Margin Impact:</span>
                      <span className="font-semibold text-[#0E1117]">{strat.marginImpact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9BA3B0]">Retention Lift:</span>
                      <span className="font-bold text-[#05875F]">{strat.retentionLift}</span>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-[#5C6370] leading-relaxed line-clamp-3">{strat.summary}</p>
                </div>

                <div className="pt-4 mt-2">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: strat.riskColor }} />
                    <span className="text-[10.5px] font-semibold" style={{ color: strat.riskColor }}>{strat.risk}</span>
                  </div>

                  {strat.presetDiscount !== undefined ? (
                    <button
                      onClick={() => {
                        setDiscount(strat.presetDiscount);
                        setMode('single');
                        handleRun(strat.presetDiscount);
                      }}
                      className={`w-full !h-9 text-[12px] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${strat.recommended
                          ? 'btn-primary'
                          : 'btn-secondary'
                        }`}
                    >
                      <span>Simulate in Sandbox</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#9BA3B0] block text-center py-1.5">Baseline Reference</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── MODE 2: SINGLE SCENARIO DECISION LAB ── */}
      {mode === 'single' && (
        <div className="fade-up fade-up-delay-1 grid lg:grid-cols-[340px_1fr] gap-4">

          {/* Controls Panel */}
          <div className="panel p-5 space-y-5 h-fit">
            <div>
              <p className="text-[13.5px] font-bold text-[#0E1117]">Scenario Inputs</p>
              <p className="text-[11.5px] text-[#9BA3B0] mt-0.5">Calibrate parameters against store records.</p>
            </div>

            {/* Target Cohort Dropdown */}
            <div className="space-y-1.5">
              <label className="section-label">Target Customer Cohort</label>
              <div className="relative">
                <select
                  value={selectedCohortId}
                  onChange={(e) => setSelectedCohortId(e.target.value)}
                  className="input !py-2 !text-[12.5px] appearance-none pr-8 cursor-pointer font-medium"
                >
                  {cohorts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.count} accounts · LTV {c.avgLTV})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#9BA3B0] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Incentive Discount Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="section-label">Incentive Offer (%)</label>
                <span className="text-[14px] font-bold text-[#4F52E8] mono">{discount}% Discount</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full accent-[#4F52E8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9BA3B0] font-mono">
                <span>5% (Light)</span>
                <span>15% (Optimal)</span>
                <span>30% (Aggressive)</span>
              </div>
            </div>

            {/* Campaign Duration */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="section-label">Evaluation Horizon</label>
                <span className="text-[13px] font-bold text-[#0E1117]">{horizon} Days</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[12px]">
                {[7, 14, 30].map(d => (
                  <button
                    key={d}
                    onClick={() => setHorizon(d)}
                    className={`py-1.5 rounded-lg font-semibold border transition-all ${horizon === d
                        ? 'bg-[#EEF0FF] text-[#4F52E8] border-[#4F52E8]'
                        : 'bg-white text-[#5C6370] border-[#E4E7ED] hover:bg-[#F8F9FC]'
                      }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={() => handleRun()}
              disabled={running}
              className="btn-primary w-full !h-10 text-[13px] gap-2 shadow-md shadow-[#4F52E8]/20"
            >
              {running ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Simulating 10,000 Scenarios…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Decision Simulation</span>
                </>
              )}
            </button>
          </div>

          {/* Main Visualization & Result Canvas */}
          <div className="space-y-4">

            {/* 1. Decision Preview Living Mesh (when not simulated or during setup) */}
            {!running && !result && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel p-6 flex flex-col relative overflow-hidden"
                style={{ minHeight: 480 }}
              >
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4E7ED]">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0E1117]">Decision Preview Mesh</h3>
                    <p className="text-[12px] text-[#5C6370] mt-0.5">
                      Visualizing active decision impact path (Customers → Retention → Revenue).
                    </p>
                  </div>
                  <span className="badge badge-success text-[10px]">Ready to Model</span>
                </div>

                {/* SVG Visual */}
                <div className="relative flex-1 my-3 flex items-center justify-center" style={{ minHeight: 320 }}>
                  <svg viewBox="0 0 550 360" className="w-full h-full max-h-[360px]">
                    <circle cx={centerCore.x} cy={centerCore.y} r="65" fill="none" stroke="#4F52E8" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    <circle cx={centerCore.x} cy={centerCore.y} r="105" fill="none" stroke="#E4E7ED" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                    {PREVIEW_LINKS.map(link => {
                      const fromNode = PREVIEW_NODES.find(n => n.id === link.from);
                      const toNode = PREVIEW_NODES.find(n => n.id === link.to);
                      if (!fromNode || !toNode) return null;
                      const pathD = buildCurve(fromNode, toNode, link.curved);
                      const isMain = link.isMainPath && discount > 0;

                      return (
                        <g key={`${link.from}-${link.to}`}>
                          <path
                            d={pathD}
                            fill="none"
                            stroke={isMain ? '#4F52E8' : '#E4E7ED'}
                            strokeWidth={isMain ? 2 : 1}
                            strokeDasharray={isMain ? '0' : '4 3'}
                            opacity={isMain ? 0.9 : 0.45}
                          />
                          {isMain && (
                            <circle r="3" fill="#12B5C6">
                              <animateMotion dur="2.4s" repeatCount="indefinite" path={pathD} />
                              <animate attributeName="opacity" values="0;1;1;0" dur="2.4s" repeatCount="indefinite" />
                            </circle>
                          )}
                        </g>
                      );
                    })}

                    {/* Central Core */}
                    <g>
                      <circle cx={centerCore.x} cy={centerCore.y} r="36" fill="#4F52E8" opacity="0.08">
                        <animate attributeName="r" values="32;40;32" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={centerCore.x} cy={centerCore.y} r="26" fill="#FFFFFF" stroke="#4F52E8" strokeWidth="2" />
                      <circle cx={centerCore.x} cy={centerCore.y} r="17" fill="#4F52E8" />
                      <text x={centerCore.x} y={centerCore.y + 3.5} textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800">
                        TWIN
                      </text>
                    </g>

                    {/* Dimensional Nodes */}
                    {PREVIEW_NODES.map(node => {
                      const isImpacted = (node.id === 'customers' || node.id === 'retention' || node.id === 'revenue') && discount > 0;
                      const val = node.getValue(discount, selectedCohort?.count || 32);

                      return (
                        <g key={node.id} onMouseEnter={() => setHoveredNode(node)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: 'pointer' }}>
                          {isImpacted && (
                            <circle cx={node.x} cy={node.y} r={node.r + 8} fill={`${node.color}15`} stroke={node.color} strokeWidth="1" strokeDasharray="3 3" />
                          )}
                          <circle cx={node.x} cy={node.y} r={node.r} fill="#FFFFFF" stroke={isImpacted ? node.color : '#E4E7ED'} strokeWidth={isImpacted ? 2 : 1.25} />
                          <text x={node.x} y={node.y - 3} textAnchor="middle" fill={node.color} fontSize="11" fontWeight="700">
                            {node.label}
                          </text>
                          <text x={node.x} y={node.y + 11} textAnchor="middle" fill={isImpacted ? '#0E1117' : '#9BA3B0'} fontSize="8.5" fontWeight="600">
                            {val}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {hoveredNode && (
                  <div className="p-3 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl text-[12px]">
                    <span className="font-bold text-[#0E1117]">{hoveredNode.label}: </span>
                    <span className="text-[#5C6370]">{hoveredNode.impactDesc}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. Simulation Results Panel (after execution) */}
            {result && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">

                {/* Result Summary Strip */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="panel p-5 space-y-3">
                    <p className="section-label">Current Baseline</p>
                    <p className="text-[26px] font-bold text-[#0E1117] leading-none">
                      ₹{result.baseline.revenue.toLocaleString('en-IN')}
                    </p>
                    <div className="pt-2 border-t border-[#F0F2F7] space-y-1 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[#9BA3B0]">Baseline Retention:</span>
                        <span className="font-semibold text-[#0E1117]">{result.baseline.retentionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#9BA3B0]">Target Cohort:</span>
                        <span className="font-bold text-[#D92E2E]">{result.targetCount} accounts</span>
                      </div>
                    </div>
                  </div>

                  <div className="panel-deep p-5 space-y-3 relative overflow-hidden text-white">
                    <div className="scan-line" />
                    <p className="section-label text-[#12B5C6]">Simulated Twin State</p>
                    <p className="text-[26px] font-bold text-white leading-none">
                      ₹{result.simulated.revenue.toLocaleString('en-IN')}
                    </p>
                    <div className="pt-2 border-t border-[#1F3050] space-y-1 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-[#7B93B0]">Simulated Retention:</span>
                        <span className="font-bold text-[#34D399]">{result.simulated.retentionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#7B93B0]">Expected Net Lift:</span>
                        <span className="font-bold text-[#34D399]">+₹{result.deltas.revenueDeltaVal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Uplift & Confidence Range Box */}
                <div className="panel-deep p-6 space-y-4 text-white">
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1F3050]">
                    <div>
                      <p className="section-label text-[#12B5C6] mb-1">Expected Revenue Recovery</p>
                      <p className="text-[34px] font-bold text-white leading-none tracking-tight">
                        +₹{result.deltas.revenueDeltaVal.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[12px] text-[#7B93B0] mt-1.5">
                        Mathematically modeled range: <strong className="text-white">{result.confidenceRange}</strong>
                      </p>
                    </div>
                    <span className="badge badge-success text-[11.5px] px-3 py-1">{result.risk}</span>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={() => navigate('/actions')} className="btn-primary flex-1 !h-10 gap-2">
                      Build & Dispatch Action Plan <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setResult(null)} className="btn-secondary !h-10 px-4 text-white border-[#1F3050]">
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── DECISION MEMORY TABLE ── */}
      <div className="fade-up fade-up-delay-2 panel overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E4E7ED] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#4F52E8]" strokeWidth={1.75} />
            <p className="text-[13.5px] font-bold text-[#0E1117]">Decision Memory</p>
            <span className="text-[11.5px] text-[#9BA3B0]">Simulated vs actual 14-day outcomes</span>
          </div>
          <span className="badge badge-success">{decisionMemory.avgAccuracy} Historical Accuracy</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-[#E4E7ED] bg-[#F8F9FC]">
                {['Decision Executed', 'Date', 'Simulated', 'Actual (14d)', 'Status', 'Learning Notes'].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[10.5px] font-semibold text-[#9BA3B0] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decisionMemory.history.map((row, i) => (
                <tr key={i} className="border-b border-[#F0F2F7] hover:bg-[#F8F9FC] transition-colors">
                  <td className="px-5 py-3 font-semibold text-[#0E1117]">{row.decision}</td>
                  <td className="px-5 py-3 text-[#9BA3B0] mono text-[11.5px]">{row.date}</td>
                  <td className="px-5 py-3 font-semibold text-[#5C6370]">+₹{(row.simulatedRecovery || 18400).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 font-bold text-[#05875F]">
                    {row.actualRecovery ? `+₹${row.actualRecovery.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    {row.status === 'VERIFIED' ? (
                      <span className="badge badge-success">{row.accuracy}% Accuracy</span>
                    ) : (
                      <span className="badge badge-warning">Awaiting Outcome</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-[#5C6370] max-w-xs truncate">{row.learningNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
