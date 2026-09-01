import React from 'react';

export function GlassCard({ children, className = '', hover = true, glow = false }) {
  return (
    <div
      className={`rounded-2xl glass-card p-6 ${
        hover ? 'glass-card-hover' : ''
      } ${glow ? 'shadow-glow-sm border-brand-500/30' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function MetricCard({ title, value, change, isNegative = false, subtitle, icon: Icon, color = 'brand' }) {
  return (
    <GlassCard className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-midnight-950 border border-white/10 text-brand-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {change && (
          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
            isNegative
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          }`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 font-mono pt-1">{subtitle}</p>
      )}
    </GlassCard>
  );
}
