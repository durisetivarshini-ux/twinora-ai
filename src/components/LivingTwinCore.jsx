import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  RefreshCw, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import TwinoraLogo from './TwinoraLogo';

const NODES = [
  { id: 'revenue', label: 'Revenue Vector', value: '₹12.45L', sub: '+12.4% projected', icon: DollarSign, color: '#4F46E5', x: 50, y: 12 },
  { id: 'customers', label: 'Customer Mesh', value: '1,240', sub: '4 cohorts active', icon: Users, color: '#0891B2', x: 86, y: 32 },
  { id: 'retention', label: 'Retention Loop', value: '72.4%', sub: '+4.2% velocity', icon: RefreshCw, color: '#16A34A', x: 86, y: 72 },
  { id: 'growth', label: 'Growth Score', value: '87 / 100', sub: 'Strong potential', icon: TrendingUp, color: '#4F46E5', x: 50, y: 90 },
  { id: 'payments', label: 'Payment Gateway', value: '99.4%', sub: 'Zero latency', icon: CreditCard, color: '#2563EB', x: 14, y: 72 },
  { id: 'products', label: 'Product Elasticity', value: '0.84', sub: 'High pricing leverage', icon: ShoppingBag, color: '#D97706', x: 14, y: 32 },
];

export default function LivingTwinCore({ onSelectNode, activeNodeId = 'revenue' }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [pulseKey, setPulseKey] = useState(0);

  // Periodic intelligence wave pulse every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeNode = NODES.find(n => n.id === (hoveredNode || activeNodeId)) || NODES[0];

  return (
    <div className="relative w-full max-w-[580px] h-[520px] mx-auto flex items-center justify-center select-none font-sans">
      
      {/* Layer 1: Ambient Light Background Depth Glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-[#4F46E5]/10 via-[#06B6D4]/10 to-transparent blur-3xl" />
      </div>

      {/* Layer 2: 3D Counter-Rotating Subtle Light Orbital Ellipses */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer Orbit */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="w-[440px] h-[440px] rounded-full border border-[#4F46E5]/15 border-dashed"
        />
        {/* Inner Counter Orbit */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="w-[310px] h-[310px] rounded-full border border-[#0891B2]/20"
        />
      </div>

      {/* Layer 3: Dynamic SVG Vector Connection Web & Traveling Particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="connGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0891B2" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {NODES.map((node) => {
          const isSelected = (hoveredNode === node.id) || (!hoveredNode && activeNodeId === node.id);
          return (
            <g key={node.id}>
              {/* Connection Vector from Center (50, 50) to Node */}
              <line
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={isSelected ? '#4F46E5' : 'rgba(148, 163, 184, 0.3)'}
                strokeWidth={isSelected ? '1.5' : '0.8'}
                strokeDasharray={isSelected ? 'none' : '2,2'}
                className="transition-all duration-300"
              />

              {/* Live Flowing Particle */}
              <circle r={isSelected ? '1.5' : '1.0'} fill={isSelected ? '#4F46E5' : '#0891B2'}>
                <animateMotion
                  path={`M 50 50 L ${node.x} ${node.y}`}
                  dur={isSelected ? '1.8s' : '3.2s'}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Central Pulse Ring Effect */}
        <motion.circle
          key={pulseKey}
          cx="50"
          cy="50"
          r="10"
          fill="none"
          stroke="#4F46E5"
          strokeWidth="1.2"
          initial={{ r: 10, opacity: 0.8 }}
          animate={{ r: 46, opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      </svg>

      {/* Center Nexus: Floating Twinora Core */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="absolute z-30 flex flex-col items-center justify-center cursor-pointer"
      >
        <div className="relative w-24 h-24 rounded-full bg-white border border-[#E2E8F0] p-1.5 shadow-[0_12px_36px_rgba(79,70,229,0.18)] flex items-center justify-center group">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#EEF2FF] to-[#E0F2FE] border border-[#CBD5E1] flex flex-col items-center justify-center p-2 text-center">
            <TwinoraLogo className="w-9 h-9" active={true} />
            <span className="text-[9px] font-mono font-bold text-[#4F46E5] uppercase tracking-wider mt-0.5">
              TWINORA
            </span>
          </div>
        </div>
      </motion.div>

      {/* Surrounding Dimension Nodes (Clean Floating Light Cards) */}
      {NODES.map((node) => {
        const Icon = node.icon;
        const isHovered = hoveredNode === node.id;
        const isSelected = isHovered || (!hoveredNode && activeNodeId === node.id);

        return (
          <motion.div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => {
              setHoveredNode(node.id);
              if (onSelectNode) onSelectNode(node.id);
            }}
            onMouseLeave={() => setHoveredNode(null)}
            className="z-20 cursor-pointer"
          >
            <motion.div
              animate={{
                scale: isSelected ? 1.08 : 1,
                y: isSelected ? -2 : 0,
              }}
              transition={{ duration: 0.2 }}
              className={`px-3.5 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-200 ${
                isSelected 
                  ? 'bg-white border-2 border-[#4F46E5] shadow-[0_12px_30px_rgba(79,70,229,0.2)]' 
                  : 'bg-white/95 hover:bg-white border border-[#E2E8F0] shadow-[0_4px_16px_rgba(15,23,42,0.06)]'
              }`}
            >
              {/* Icon Pill */}
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                style={{ 
                  backgroundColor: isSelected ? `${node.color}15` : '#F1F5F9',
                  color: node.color 
                }}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>

              {/* Text Data */}
              <div className="flex flex-col text-left pr-1">
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">
                  {node.label}
                </span>
                <span className="text-[13px] font-bold text-[#0F172A] font-mono leading-none mt-0.5">
                  {node.value}
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Floating Bottom Telemetry Strip */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-[92%] max-w-[420px] bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-xl px-4 py-2.5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] flex items-center justify-between z-30 text-[12px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-[#0F172A] font-sans font-bold">{activeNode.label}</span>
        </div>
        <div className="flex items-center gap-2 text-[#475569]">
          <span>{activeNode.sub}</span>
          <span className="text-[#4F46E5] font-bold">({activeNode.value})</span>
        </div>
      </div>

    </div>
  );
}
