import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDateRange } from '../context/DateRangeContext';
import { fetchBusinessOverview, fetchCustomerSegments } from '../services/apiService';
import { getTwinNodeDetails } from '../services/aiService';

/* ── EDGES (from→to) ── */
const EDGES = [
  { from: 'revenue',   to: 'customers', strong: true },
  { from: 'customers', to: 'retention' },
  { from: 'retention', to: 'growth' },
  { from: 'growth',    to: 'payments' },
  { from: 'payments',  to: 'revenue' },
  { from: 'revenue',   to: 'products',  weak: true },
  { from: 'customers', to: 'products' },
  { from: 'products',  to: 'retention', weak: true },
];

function buildPath(a, b) {
  const dx = b.cx - a.cx, dy = b.cy - a.cy;
  const mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2;
  const cpx = mx - dy * 0.12, cpy = my + dx * 0.12;
  return `M${a.cx},${a.cy} Q${cpx},${cpy} ${b.cx},${b.cy}`;
}

function Particle({ path, delay = 0, color = '#4F52E8' }) {
  return (
    <circle r="2.5" fill={color} opacity="0">
      <animateMotion
        dur="2.2s"
        begin={`${delay}s`}
        repeatCount="indefinite"
        path={path}
      />
      <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" begin={`${delay}s`} repeatCount="indefinite" />
    </circle>
  );
}

export default function DigitalTwin() {
  const navigate = useNavigate();
  const { user, merchant } = useAuth();
  const { dateRange } = useDateRange();
  const [activeId, setActiveId] = useState('revenue');
  const [simMode, setSimMode] = useState(false);
  const [overview, setOverview] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchBusinessOverview(dateRange),
      fetchCustomerSegments()
    ]).then(([ov, segs]) => {
      setOverview(ov);
      setCohorts(segs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [dateRange]);

  const businessName = user?.businessName || merchant?.businessName || overview?.businessName || 'Your Business';
  const totalRevL = overview ? (overview.totalRevenue / 100000).toFixed(2) : '8.42';
  const revChange = overview ? overview.revenueChangePct : -19.8;

  const nodes = [
    { id: 'revenue',   label: 'Revenue',   value: `₹${totalRevL}L`, delta: `${revChange > 0 ? '+' : ''}${revChange}%`,   neg: revChange < 0,  r: 52, cx: 380, cy: 200, color: revChange < 0 ? '#C97308' : '#05875F' },
    { id: 'customers', label: 'Customers', value: overview ? `${overview.uniqueCustomersCount.toLocaleString('en-IN')}` : '948', delta: `+${overview?.activeDormantAccounts ? overview.activeDormantAccounts * 2 : 48}`, neg: false, r: 44, cx: 620, cy: 145, color: '#4F52E8' },
    { id: 'products',  label: 'Products',  value: '64 SKUs', delta: `AOV ₹${overview?.aov || 864}`, neg: false, r: 38, cx: 680, cy: 310, color: '#4F52E8' },
    { id: 'retention', label: 'Retention', value: `${overview?.repeatRate || 34}%`, delta: '−2.8%', neg: true, r: 40, cx: 490, cy: 350, color: '#D92E2E' },
    { id: 'growth',    label: 'Growth',    value: `${overview?.growthScore || 82}/100`, delta: '+3 pts', neg: false, r: 36, cx: 220, cy: 310, color: '#05875F' },
    { id: 'payments',  label: 'Payments',  value: `${overview?.paymentHealthRate || 99.4}%`, delta: '14ms', neg: false, r: 30, cx: 180, cy: 155, color: '#05875F' },
  ];

  const active = nodes.find(n => n.id === activeId) || nodes[0];
  const detail = getTwinNodeDetails(activeId, overview || {});

  const affectedEdges = EDGES.filter(e => e.from === activeId || e.to === activeId);
  const affectedNodeIds = new Set([activeId, ...affectedEdges.map(e => e.from), ...affectedEdges.map(e => e.to)]);

  return (
    <div className="page-canvas space-y-4 max-w-[1100px]">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 fade-up">
        <div>
          <h1 className="page-title">Digital Twin — {businessName}</h1>
          <p className="page-subtitle">
            Live model of your business. Node intensity and connections update from database telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSimMode(s => !s)}
            className={`btn-secondary !h-8 !text-[12.5px] gap-2 ${simMode ? 'border-[#4F52E8] text-[#4F52E8] bg-[#EEF0FF]' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {simMode ? 'Exit simulation view' : 'Simulation view'}
          </button>
          <button onClick={() => navigate('/simulate')} className="btn-primary gap-2">
            Simulate from twin <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── TWIN CANVAS ── */}
      <div className="fade-up fade-up-delay-1 grid lg:grid-cols-[1fr_300px] gap-4">

        {/* SVG canvas */}
        <div className="panel overflow-hidden relative" style={{ minHeight: 420 }}>
          <div className="absolute top-3 left-4 z-10">
            <span className="section-label">Living business mesh</span>
          </div>

          <svg
            viewBox="0 0 860 470"
            className="w-full h-full"
            style={{ minHeight: 380 }}
          >
            {/* ── EDGE PATHS ── */}
            {EDGES.map(edge => {
              const a = nodes.find(n => n.id === edge.from);
              const b = nodes.find(n => n.id === edge.to);
              if (!a || !b) return null;
              const path = buildPath(a, b);
              const isActive = affectedEdges.some(e => e.from === edge.from && e.to === edge.to);
              const isSimAffected = simMode && (edge.from === 'retention' || edge.to === 'retention' || edge.from === 'revenue' || edge.to === 'revenue');
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke={isSimAffected ? '#D92E2E' : isActive ? '#4F52E8' : '#E4E7ED'}
                    strokeWidth={isActive ? 1.5 : edge.weak ? 0.75 : 1}
                    strokeDasharray={edge.weak ? '4 3' : isActive ? '0' : '0'}
                    opacity={isActive ? 1 : 0.6}
                    style={{ transition: 'stroke 0.3s ease, opacity 0.3s ease' }}
                  />
                  {isActive && (
                    <Particle path={path} delay={0} color={isSimAffected ? '#D92E2E' : '#4F52E8'} />
                  )}
                  {isActive && (
                    <Particle path={path} delay={1.1} color={isSimAffected ? '#D92E2E' : '#12B5C6'} />
                  )}
                </g>
              );
            })}

            {/* ── NODES ── */}
            {nodes.map(node => {
              const isActive = node.id === activeId;
              const isAffected = affectedNodeIds.has(node.id);
              const simShift = simMode && (node.id === 'retention' || node.id === 'revenue');
              return (
                <g
                  key={node.id}
                  onClick={() => setActiveId(node.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer glow ring */}
                  {isActive && (
                    <circle
                      cx={node.cx} cy={node.cy}
                      r={node.r + 12}
                      fill={`${node.color}12`}
                      stroke={`${node.color}30`}
                      strokeWidth={1}
                    />
                  )}

                  {/* Main circle */}
                  <circle
                    cx={node.cx} cy={node.cy}
                    r={node.r}
                    fill={isActive ? node.color : simShift ? '#D92E2E' : '#FFFFFF'}
                    stroke={isActive ? node.color : isAffected ? `${node.color}60` : '#E4E7ED'}
                    strokeWidth={isActive ? 0 : isAffected ? 1.5 : 1}
                    style={{ transition: 'fill 0.25s ease, stroke 0.25s ease' }}
                  />

                  {/* Value text */}
                  <text
                    x={node.cx} y={node.cy - 4}
                    textAnchor="middle"
                    fill={isActive ? '#FFFFFF' : node.color}
                    fontSize={node.r * 0.38}
                    fontWeight="700"
                    fontFamily="Inter, sans-serif"
                    style={{ transition: 'fill 0.25s ease' }}
                  >
                    {node.value}
                  </text>
                  <text
                    x={node.cx} y={node.cy + node.r * 0.42}
                    textAnchor="middle"
                    fill={isActive ? 'rgba(255,255,255,0.75)' : '#9BA3B0'}
                    fontSize={node.r * 0.28}
                    fontFamily="Inter, sans-serif"
                  >
                    {node.delta}
                  </text>

                  {/* Label below */}
                  <text
                    x={node.cx} y={node.cy + node.r + 16}
                    textAnchor="middle"
                    fill={isActive ? node.color : '#5C6370'}
                    fontSize="11"
                    fontWeight={isActive ? '700' : '500'}
                    fontFamily="Inter, sans-serif"
                    style={{ transition: 'fill 0.25s ease' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Status bar */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-[#9BA3B0]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#05875F] ping-dot" />
              <span>Synchronized ({overview?.lastSynced || '2 mins ago'}) · Click any node to inspect</span>
            </div>
            {simMode && (
              <span className="text-[#D92E2E] font-semibold">Simulation mode active</span>
            )}
          </div>
        </div>

        {/* Inspector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="section-label">Inspecting</span>
                <span className="badge badge-neutral text-[10px]">{active?.label}</span>
              </div>
              <p className="text-[15.5px] font-bold text-[#0E1117] leading-tight mb-1">{detail?.name}</p>
              <p
                className="text-[26px] font-bold leading-none tracking-tight mb-0.5"
                style={{ color: active?.color }}
              >
                {active?.value}
              </p>
              <p className={`text-[12px] font-semibold mb-4 ${active?.neg ? 'text-[#D92E2E]' : 'text-[#05875F]'}`}>
                {active?.delta}
              </p>
              <p className="text-[12.5px] text-[#5C6370] leading-relaxed mb-4">{detail?.description}</p>
              <button
                onClick={() => navigate('/simulate')}
                className="btn-primary w-full gap-2 !h-9"
              >
                {detail?.action} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Health ring */}
            <div className="panel p-4 flex items-center gap-4">
              <div className="relative w-12 h-12 shrink-0">
                <svg viewBox="0 0 40 40" className="rotate-[-90deg]">
                  <circle cx="20" cy="20" r="17" fill="none" stroke="#E4E7ED" strokeWidth="3.5" />
                  <circle
                    cx="20" cy="20" r="17" fill="none"
                    stroke="#4F52E8" strokeWidth="3.5"
                    strokeDasharray={`${overview?.growthScore || 82} 18`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[12px] font-extrabold text-[#0E1117]">
                  {overview?.growthScore || 82}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#0E1117]">Twin Health Index</p>
                <p className="text-[11px] text-[#9BA3B0] mt-0.5">
                  Grounded across {overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940'} orders
                </p>
              </div>
            </div>

            {/* Connected dimensions */}
            <div className="panel p-4">
              <p className="section-label mb-2.5">Connected dimensions</p>
              <div className="flex flex-wrap gap-1.5">
                {[...affectedNodeIds].filter(id => id !== activeId).map(id => {
                  const n = nodes.find(x => x.id === id);
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveId(id)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-[#E4E7ED] hover:border-[#4F52E8]/30 hover:bg-[#EEF0FF] transition-all"
                      style={{ color: n?.color }}
                    >
                      {n?.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
