import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Users, Database, Zap, ArrowRight, X, Play } from 'lucide-react';
import { fetchAgents, runAgentTask, fetchBusinessOverview } from '../services/apiService';

const AGENT_META = {
  growth: { icon: BarChart2, color: '#4F52E8' },
  customer: { icon: Users, color: '#12B5C6' },
  simulation: { icon: Database, color: '#9BA3B0' },
  action: { icon: Zap, color: '#C97308' },
};

const STATUS = {
  completed: { label: 'Completed', color: '#05875F', dot: '#05875F' },
  running: { label: 'Running', color: '#4F52E8', dot: '#4F52E8' },
  ready: { label: 'Ready', color: '#9BA3B0', dot: '#9BA3B0' },
  idle: { label: 'Idle', color: '#C97308', dot: '#C97308' },
};

export default function Agents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [overview, setOverview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [runningId, setRunningId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      fetchAgents(),
      fetchBusinessOverview('30d')
    ]).then(([ags, ov]) => {
      setAgents(ags);
      setOverview(ov);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAgent = async (agentId) => {
    setRunningId(agentId);
    await runAgentTask(agentId);
    setTimeout(() => {
      setRunningId(null);
      loadData();
    }, 2100);
  };

  return (
    <div className="page-canvas space-y-4 max-w-[1000px]">

      {/* Header */}
      <div className="fade-up flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">AI Agents</h1>
          <p className="page-subtitle">Intelligence control room — stateful agents running across merchant telemetry.</p>
        </div>
        <button onClick={() => navigate('/actions')} className="btn-primary gap-2">
          View action plan <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── CONTROL ROOM — deep navy horizontal pipeline ── */}
      <div className="fade-up fade-up-delay-1 panel-deep p-6 relative overflow-hidden">
        <p className="section-label text-[#4F7A9E] mb-5">Intelligence pipeline</p>

        {/* Horizontal pipeline */}
        <div className="flex items-start gap-0 relative mb-6">
          <div className="absolute top-5 left-0 right-0 h-px bg-[#1F3050]" />

          <div className="absolute top-[18px] left-0 right-0 h-px overflow-hidden pointer-events-none">
            {[0, 1].map(i => (
              <div
                key={i}
                className="agent-particle absolute top-0 w-6 h-px"
                style={{
                  background: 'linear-gradient(to right, transparent, #4F52E8, transparent)',
                  animationDelay: `${i * 1}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>

          {agents.map((agent) => {
            const meta = AGENT_META[agent.id] || { icon: Zap, color: '#4F52E8' };
            const cfg = STATUS[agent.status] || STATUS.idle;
            const Icon = meta.icon;
            const isSelected = selected?.id === agent.id;
            const isCurrentlyRunning = runningId === agent.id;

            return (
              <div key={agent.id} className="flex-1 flex flex-col items-center relative">
                <button
                  onClick={() => setSelected(isSelected ? null : agent)}
                  className={`w-10 h-10 rounded-xl z-10 flex items-center justify-center transition-all mb-3 ${isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#080E1C]'
                      : 'hover:scale-110'
                    }`}
                  style={{
                    background: isSelected ? meta.color : `${meta.color}20`,
                    border: `1px solid ${meta.color}40`,
                  }}
                >
                  {isCurrentlyRunning ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" style={{ color: isSelected ? '#fff' : meta.color }} strokeWidth={1.75} />
                  )}
                </button>

                <p className="text-[11.5px] font-bold text-white text-center leading-tight px-2">{agent.name}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 ping-dot" style={{ background: cfg.dot }} />
                  <span className="text-[10px] font-medium" style={{ color: cfg.color }}>
                    {isCurrentlyRunning ? 'Running' : cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspector inside dark panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#1F3050] pt-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-[15px] font-bold text-white">{selected.name}</p>
                    <p className="text-[12px] text-[#7B93B0] mt-0.5">{selected.currentOutput}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1 text-[#4F7A9E] hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Role & Function', value: selected.role },
                    { label: 'Telemetry Ingested', value: selected.metricsProcessed },
                    { label: 'Latest Output', value: selected.currentOutput },
                  ].map(item => (
                    <div key={item.label} className="panel-deep-3 p-3">
                      <p className="text-[10px] font-semibold text-[#4F7A9E] uppercase tracking-wider mb-1.5">{item.label}</p>
                      <p className="text-[12px] text-[#E8ECF2] leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRunAgent(selected.id)}
                    disabled={runningId === selected.id}
                    className="btn-primary gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Trigger Execution
                  </button>
                  <button
                    onClick={() => navigate(selected.nextRoute || '/dashboard')}
                    className="btn-secondary gap-2"
                  >
                    {selected.nextAction || 'View Output'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Agent cards below */}
      <div className="fade-up fade-up-delay-2 grid sm:grid-cols-2 gap-3">
        {agents.map((agent) => {
          const meta = AGENT_META[agent.id] || { icon: Zap, color: '#4F52E8' };
          const Icon = meta.icon;
          const cfg = STATUS[agent.status] || STATUS.idle;
          return (
            <button
              key={agent.id}
              onClick={() => setSelected(agent)}
              className="panel p-4 text-left hover:border-[#CDD1DC] transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${meta.color}10` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: meta.color }} strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13.5px] font-bold text-[#0E1117]">{agent.name}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                      <span className="text-[10.5px] font-medium text-[#9BA3B0]">{cfg.label}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#9BA3B0] mt-0.5 leading-snug line-clamp-1">{agent.role}</p>
                  <p className="text-[11.5px] font-semibold mt-1.5 text-[#5C6370] line-clamp-1">{agent.currentOutput}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
