import React, { useState } from 'react';
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
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import TwinoraLogo from './TwinoraLogo';

const NODES = [
  { 
    id: 'revenue', 
    label: 'Revenue Engine', 
    category: 'CASHFLOW',
    value: '₹12.45L', 
    sub: '-14% velocity alert', 
    icon: DollarSign, 
    color: '#4F46E5', 
    size: 'lg',
    x: 50, 
    y: 16 
  },
  { 
    id: 'customers', 
    label: 'Customer Mesh', 
    category: 'ACCOUNTS',
    value: '1,240', 
    sub: '43 dormant VIPs', 
    icon: Users, 
    color: '#0891B2', 
    size: 'md',
    x: 82, 
    y: 35 
  },
  { 
    id: 'retention', 
    label: 'Retention Loop', 
    category: 'LTV VECTOR',
    value: '72.4%', 
    sub: '34% repeat rate', 
    icon: RefreshCw, 
    color: '#16A34A', 
    size: 'md',
    x: 80, 
    y: 72 
  },
  { 
    id: 'growth', 
    label: 'Growth Index', 
    category: 'MODEL SCORE',
    value: '87 / 100', 
    sub: '+₹47.8K unrealized', 
    icon: TrendingUp, 
    color: '#4F46E5', 
    size: 'lg',
    x: 50, 
    y: 86 
  },
  { 
    id: 'payments', 
    label: 'Payment Mesh', 
    category: 'GATEWAY',
    value: '99.4%', 
    sub: '14ms latency', 
    icon: CreditCard, 
    color: '#2563EB', 
    size: 'sm',
    x: 18, 
    y: 72 
  },
  { 
    id: 'products', 
    label: 'Product Catalog', 
    category: 'ELASTICITY',
    value: '142 SKUs', 
    sub: '0.84 price index', 
    icon: ShoppingBag, 
    color: '#D97706', 
    size: 'sm',
    x: 18, 
    y: 35 
  },
];

export default function TwinNodeGraph({ interactive = true, onSelectNode }) {
  const [activeNode, setActiveNode] = useState('revenue');

  const handleNodeClick = (nodeId) => {
    if (!interactive) return;
    setActiveNode(nodeId);
    if (onSelectNode) onSelectNode(nodeId);
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background Orbital Rings & Subtle Grid */}
      <div className="absolute inset-0 backdrop-grid opacity-40 pointer-events-none" />
      
      {/* Dynamic Radial Glow Behind Active Node */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#4F46E5]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-dashed border-[#CBD5E1]/60 pointer-events-none animate-spin-very-slow" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border border-[#E2E8F0] pointer-events-none" />

      {/* SVG Vector Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
        {NODES.map((node) => {
          const isSelected = activeNode === node.id;
          return (
            <g key={node.id}>
              {/* Static Path */}
              <line
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={isSelected ? '#4F46E5' : '#CBD5E1'}
                strokeWidth={isSelected ? '1.8' : '0.9'}
                strokeDasharray={isSelected ? 'none' : '3,3'}
                className="transition-colors duration-200"
              />
              {/* Traveling Signal Pulse */}
              <circle r={isSelected ? '1.8' : '1.1'} fill={isSelected ? '#4F46E5' : '#0891B2'}>
                <animateMotion
                  path={`M 50 50 L ${node.x} ${node.y}`}
                  dur={isSelected ? '1.8s' : '3.2s'}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Center Core: Living Twin Engine */}
      <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative w-24 h-24 rounded-full bg-white border-2 border-[#4F46E5]/40 shadow-[0_12px_32px_rgba(79,70,229,0.22)] flex items-center justify-center p-2.5">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#EEF2FF] to-[#E0F2FE] flex items-center justify-center animate-pulse">
            <TwinoraLogo className="w-10 h-10" active={true} />
          </div>
          <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-[#0F172A] text-white text-[8.5px] font-mono font-bold uppercase tracking-wider shadow-sm">
            TWIN CORE
          </span>
        </div>
      </div>

      {/* Interactive Floating Nodes */}
      {NODES.map((node) => {
        const Icon = node.icon;
        const isSelected = activeNode === node.id;

        return (
          <motion.button
            key={node.id}
            onClick={() => handleNodeClick(node.id)}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            className={`z-30 px-4 py-2.5 rounded-2xl flex items-center gap-3 transition-all duration-150 text-left cursor-pointer ${
              isSelected 
                ? 'bg-white border-2 border-[#4F46E5] shadow-[0_10px_30px_rgba(79,70,229,0.25)] scale-105' 
                : 'bg-white/95 hover:bg-white border border-[#E2E8F0] shadow-card hover:border-[#CBD5E1]'
            }`}
          >
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
              style={{ backgroundColor: `${node.color}15`, color: node.color }}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div className="flex flex-col pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                  {node.category}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-ping" />
                )}
              </div>
              <span className="text-[13px] font-extrabold text-[#0F172A] font-mono leading-tight">
                {node.value}
              </span>
              <span className="text-[10px] text-[#64748B] font-sans">
                {node.label}
              </span>
            </div>
          </motion.button>
        );
      })}

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-[11px] font-mono text-[#64748B]">
        <span className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E2E8F0]">
          Interactive Model: Click any node to inspect telemetry
        </span>
        <span className="hidden sm:inline bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-[#16A34A] font-semibold">
          ● Synchronized with Express Database
        </span>
      </div>
    </div>
  );
}
