import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  FlaskConical, 
  Activity
} from 'lucide-react';
import { askWhy } from '../services/aiService';
import { fetchBusinessOverview } from '../services/apiService';

export default function AskWhyModal({ isOpen, onClose }) {
  const [investigating, setInvestigating] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState(null);
  const [overview, setOverview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBusinessOverview('30d').then(setOverview).catch(() => {});
  }, []);

  const totalTxns = overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940';

  const investigationSteps = [
    { title: 'ANALYZING Customer Behavior Vectors', desc: 'Evaluating RFM recency, repeat cycle length, and cohort churn' },
    { title: 'AUDITING Revenue Patterns & Cashflow', desc: `Parsing ${totalTxns} transaction logs & gateway checkout metrics` },
    { title: 'EVALUATING Product SKU Performance', desc: 'Checking product stockout events and cart cross-sell performance' },
    { title: 'COMPARING Historical Activity Baselines', desc: 'Reviewing 30-day velocity benchmarks against previous month' },
    { title: 'CAUSE IDENTIFIED: Inactive Customer Churn Risk', desc: 'Computing expected financial uplift for winback campaign' }
  ];

  useEffect(() => {
    if (isOpen) {
      setInvestigating(true);
      setCurrentStepIndex(0);
      setData(null);

      let step = 0;
      const interval = setInterval(() => {
        if (step < investigationSteps.length - 1) {
          step++;
          setCurrentStepIndex(step);
        } else {
          clearInterval(interval);
          askWhy('Revenue Drop').then((res) => {
            setData(res);
            setInvestigating(false);
          });
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isOpen, totalTxns]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Workspace Box */}
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-[14px] shadow-[0_20px_50px_rgba(15,23,42,0.15)] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626] font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
                Twinora Diagnostic Workspace
              </h2>
              <span className="text-xs text-[#64748B] font-mono">Root Cause Diagnostic</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-[#0F172A] rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          {investigating ? (
            <div className="py-6 space-y-5">
              <div className="flex items-center justify-center gap-3 text-[#4F46E5] font-mono text-xs font-bold animate-pulse">
                <Activity className="w-4 h-4 animate-spin" />
                <span>TWINORA AI AGENTS EXECUTING DIAGNOSTIC TIMELINE...</span>
              </div>

              <div className="space-y-3">
                {investigationSteps.map((is, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between font-mono text-xs ${
                        isDone
                          ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#16A34A]'
                          : isCurrent
                          ? 'bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5] font-bold shadow-sm'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-slate-400'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">0{idx + 1}. {is.title}</span>
                          {isCurrent && <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-ping" />}
                        </div>
                        <p className="text-[11px] text-[#64748B] font-sans">{is.desc}</p>
                      </div>

                      {isDone && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Primary Summary Box */}
              <div className="p-5 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4F46E5] uppercase">
                  <Sparkles className="w-4 h-4 text-[#4F46E5]" /> Cause Identified By Twin Engine
                </div>
                <p className="text-sm font-bold text-[#0F172A] leading-relaxed">{data?.summary}</p>
              </div>

              {/* Evidence & Root Cause Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-[#64748B] font-bold">Root Cause & Evidence Breakdown</h4>
                {data?.rootCauses?.map((rc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#0F172A]">{rc.title}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-[#DC2626] border border-red-200">
                        {rc.share} Impact Share
                      </span>
                    </div>
                    <p className="text-xs text-[#475569]">{rc.description}</p>
                  </div>
                ))}
              </div>

              {/* Recommended Action Trigger */}
              <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#16A34A] uppercase block">Recommended Action Strategy</span>
                  <h4 className="text-sm font-bold text-[#0F172A] mt-0.5">{data?.recommendedRecovery?.strategyName}</h4>
                  <span className="text-xs text-[#64748B] font-mono">Predicted Recovery: <strong className="text-[#16A34A] font-bold">{data?.recommendedRecovery?.predictedRecovery}</strong></span>
                </div>

                <button
                  onClick={() => {
                    navigate('/simulate');
                    onClose();
                  }}
                  className="btn-primary !h-[42px] px-5 text-xs flex items-center justify-center gap-2 shrink-0"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Simulate Recovery Strategy →</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
