import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  TrendingUp,
  Zap
} from 'lucide-react';
import { getPriorityPlan } from '../services/aiService';

export default function PriorityPlanDrawer({ isOpen, onClose }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getPriorityPlan().then((res) => {
        setPlans(res);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-20 px-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[#0F172A]">Today's Growth Plan</h3>
            <span className="text-xs text-[#64748B] font-mono">Synthesized by Twinora Agent Team</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-[#0F172A] rounded-xl hover:bg-slate-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#4F46E5] animate-spin mx-auto" />
            <p className="text-sm font-mono text-[#475569] font-bold">Synthesizing highest ROI growth priorities...</p>
          </div>
        ) : (
          plans.map((item) => (
            <div
              key={item.priority}
              className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#4F46E5] hover:bg-white transition-all space-y-3 shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-lg border border-[#C7D2FE]">
                  Priority 0{item.priority}
                </span>
                <span className="text-xs text-[#64748B] font-mono font-bold">{item.category}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors">
                  {item.title}
                </h4>
                <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                  <span className="text-[#16A34A] font-extrabold">Potential: {item.potentialRevenue}</span>
                  <span className="text-[#64748B]">Confidence: {item.confidence}</span>
                  <span className="text-[#64748B]">Effort: {item.effort}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  navigate(item.route);
                  onClose();
                }}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white hover:bg-[#4F46E5] text-[#0F172A] hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-[#E2E8F0]"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bottom Action */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <button
          onClick={() => {
            navigate('/simulate');
            onClose();
          }}
          className="btn-primary w-full !h-[48px] !rounded-xl text-sm font-bold flex items-center justify-center gap-2"
        >
          <FlaskConical className="w-4 h-4" />
          <span>Simulate All 3 Strategies in Lab →</span>
        </button>
      </div>
    </div>
  );
}
