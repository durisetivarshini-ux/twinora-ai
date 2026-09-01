import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Zap,
  Users,
  MessageSquare,
  Send,
  ChevronRight,
  Info,
  Sparkles,
  ArrowRight,
  Lock,
  Edit3,
  History,
  FileText,
  Download,
  Check,
  X,
  ExternalLink,
  Bot,
  Layers,
  HelpCircle,
  Database,
  Calendar,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  fetchActionPlanDetails, 
  approveActionPlan, 
  updateActionPlan, 
  fetchBusinessOverview 
} from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const TIMELINE_STAGES = [
  { id: 'strategy', label: 'Strategy', actor: 'Simulation SIM-208', status: 'completed', time: 'Today, 4:12 PM', desc: 'Generated baseline from Monte Carlo simulation.' },
  { id: 'approval', label: 'Approval', actor: 'Awaiting Owner', status: 'current', time: 'Pending', desc: 'Requires Owner/Admin sign-off before dispatch.' },
  { id: 'queued', label: 'Queued', actor: 'Scheduler Rail', status: 'upcoming', time: 'Sat, 6:00 PM', desc: 'Placed in broadcast queue upon approval.' },
  { id: 'running', label: 'Running', actor: 'Action Dispatcher', status: 'upcoming', time: 'In execution', desc: 'Live dispatch across WhatsApp & Email.' },
  { id: 'measuring', label: 'Measuring', actor: 'Analytics Engine', status: 'upcoming', time: '7-day window', desc: 'Tracking conversion vs simulated baseline.' },
  { id: 'result', label: 'Result', actor: 'Decision Memory', status: 'upcoming', time: 'Post-window', desc: 'Actual lift calibrated in Decision Memory.' },
];

export default function Actions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Role & RBAC State
  const [currentRole, setCurrentRole] = useState(user?.role || 'Owner');

  // Plan Data State
  const [plan, setPlan] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Execution State
  const [executing, setExecuting] = useState(false);
  const [executionStage, setExecutionStage] = useState(-1);
  const [isApproved, setIsApproved] = useState(false);

  // Modals & Drawers State
  const [selectedTimelineStage, setSelectedTimelineStage] = useState(null);
  const [selectedAgentStep, setSelectedAgentStep] = useState(null);
  const [provenanceOpen, setProvenanceOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [revisionsModalOpen, setRevisionsModalOpen] = useState(false);

  // Edit Form State
  const [editSchedule, setEditSchedule] = useState('Saturday, 6:00 PM');
  const [editTargetCount, setEditTargetCount] = useState(32);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchActionPlanDetails('AP-904'),
      fetchBusinessOverview('30d')
    ]).then(([p, ov]) => {
      setPlan(p);
      setOverview(ov);
      if (p?.scheduledTime) setEditSchedule(p.scheduledTime);
      if (p?.targetCount) setEditTargetCount(p.targetCount);
      if (p?.status === 'APPROVED' || p?.status === 'EXECUTED') {
        setIsApproved(true);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const canApprove = currentRole === 'Owner' || currentRole === 'Admin';

  const handleApproveConfirm = async () => {
    setConfirmModalOpen(false);
    setExecuting(true);
    setExecutionStage(0);

    // Step-by-step agent advancement
    const stepsCount = plan?.pipeline?.length || 4;
    for (let i = 0; i < stepsCount; i++) {
      setExecutionStage(i);
      await new Promise(r => setTimeout(r, 650));
    }

    try {
      const res = await approveActionPlan(plan?.id || 'AP-904');
      if (res?.plan) setPlan(res.plan);
    } catch {}

    setExecuting(false);
    setIsApproved(true);
    confetti({ particleCount: 85, spread: 65, origin: { y: 0.6 } });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await updateActionPlan(plan?.id || 'AP-904', {
        scheduledTime: editSchedule,
        targetCount: editTargetCount,
        author: user?.fullName || 'Alex Rivera (Owner)',
        changeSummary: `Scheduled dispatch updated to ${editSchedule} (${editTargetCount} accounts).`
      });
      if (res?.plan) {
        setPlan(res.plan);
      }
      setEditModalOpen(false);
    } catch {} finally {
      setSavingEdit(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ActionPlan_${plan?.id || 'AP-904'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading || !plan) {
    return (
      <div className="page-canvas flex items-center justify-center py-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#4F52E8] border-t-transparent rounded-full animate-spin" />
          <p className="text-[12.5px] text-[#9BA3B0] font-medium">Loading Action Execution Workspace…</p>
        </div>
      </div>
    );
  }

  const currentStatusLabel = isApproved ? 'LIVE MEASURING' : plan.status || 'AWAITING_APPROVAL';

  return (
    <div className="page-canvas space-y-5 max-w-[1140px] font-sans pb-16">
      
      {/* ── HEADER & COMPACT METADATA STRIP ── */}
      <div className="fade-up space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-brand mono text-[10px]">{plan.id}</span>
              <span className={`badge ${
                isApproved 
                  ? 'badge-success' 
                  : 'badge-warning'
              }`}>
                {currentStatusLabel.replace('_', ' ')}
              </span>
              <span className="badge badge-neutral text-[10px]">Mode: {plan.executionMode || 'READY'}</span>
            </div>
            <h1 className="page-title">Actions & Plans</h1>
            <p className="page-subtitle">Turn simulated decisions into monitored business actions.</p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate('/simulate')}
              className="btn-secondary !h-8 text-[12px] gap-1.5"
              title="View source simulation"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#4F52E8]" />
              <span>Source: {plan.simulationId}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="btn-secondary !h-8 text-[12px] gap-1.5"
              title="Export Plan Specification"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {/* Role Switcher Pill (RBAC Testing) */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E4E7ED] shadow-xs text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F52E8] ml-1" />
              <span className="text-[#9BA3B0] font-medium hidden sm:inline">Access:</span>
              {['Owner', 'Admin', 'Analyst', 'Viewer'].map(r => (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                    currentRole === r
                      ? 'bg-[#080E1C] text-[#12B5C6]'
                      : 'text-[#5C6370] hover:text-[#0E1117]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Metadata Strip */}
        <div className="p-3 bg-white border border-[#E4E7ED] rounded-xl flex items-center justify-between gap-4 text-[12px] flex-wrap">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <span className="text-[#9BA3B0] text-[11px] block">Owner / Author</span>
              <span className="font-semibold text-[#0E1117]">{plan.owner || 'Alex Rivera (Owner)'}</span>
            </div>
            <div>
              <span className="text-[#9BA3B0] text-[11px] block">Created From</span>
              <span className="font-mono text-[#4F52E8] font-bold">{plan.simulationId}</span>
            </div>
            <div>
              <span className="text-[#9BA3B0] text-[11px] block">Target Cohort</span>
              <span className="font-semibold text-[#0E1117]">{plan.targetCohort} ({plan.targetCount} accounts)</span>
            </div>
            <div>
              <span className="text-[#9BA3B0] text-[11px] block">Dispatch Window</span>
              <span className="font-semibold text-[#0E1117]">{plan.scheduledTime} ({plan.durationDays}d)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevisionsModalOpen(true)}
              className="text-[11.5px] text-[#4F52E8] font-semibold flex items-center gap-1 hover:underline"
            >
              <History className="w-3.5 h-3.5" />
              <span>Version {plan.version || 3} History</span>
            </button>
            {!isApproved && canApprove && (
              <button
                onClick={() => setEditModalOpen(true)}
                className="btn-secondary !h-7 !text-[11px] px-2.5 gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN WORKSPACE LAYOUT ── */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
        
        {/* ============================================================ */}
        {/* LEFT COLUMN (~65%): Timeline, Strategy, Evidence, Pipeline   */}
        {/* ============================================================ */}
        <div className="space-y-5">
          
          {/* 1. Interactive State Machine Execution Timeline */}
          <div className="panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E7ED]">
              <span className="section-label">Decision Execution Timeline</span>
              <span className="text-[11px] text-[#9BA3B0]">Click stage for audit requirements</span>
            </div>

            <div className="flex items-center justify-between overflow-x-auto pt-1 pb-1">
              {TIMELINE_STAGES.map((stg, i) => {
                const isPast = isApproved ? i <= 4 : i < 1;
                const isCurrent = isApproved ? i === 4 : i === 1;
                return (
                  <React.Fragment key={stg.id}>
                    <button
                      onClick={() => setSelectedTimelineStage(stg)}
                      className="flex flex-col items-center min-w-[76px] text-center group cursor-pointer"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                        isPast
                          ? 'bg-[#05875F] text-white shadow-xs'
                          : isCurrent
                            ? 'bg-[#4F52E8] text-white ring-4 ring-[#4F52E8]/15 shadow-sm'
                            : 'bg-[#F0F2F7] text-[#9BA3B0] group-hover:bg-[#E4E7ED]'
                      }`}>
                        {isPast ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#CDD1DC]" />
                        )}
                      </div>
                      <p className={`text-[11px] font-bold ${
                        isPast ? 'text-[#05875F]' : isCurrent ? 'text-[#4F52E8]' : 'text-[#9BA3B0]'
                      }`}>
                        {stg.label}
                      </p>
                      <span className="text-[9.5px] text-[#9BA3B0] mt-0.5 truncate max-w-[70px]">{stg.actor}</span>
                    </button>
                    {i < TIMELINE_STAGES.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1.5 rounded-full transition-all ${
                        isPast ? 'bg-[#05875F]' : 'bg-[#E4E7ED]'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* 2. Active Action Plan Card */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E4E7ED]">
              <div>
                <span className="text-[11px] font-bold text-[#4F52E8] uppercase tracking-wider block">
                  {plan.strategyName || '15% VIP Comeback Incentive'}
                </span>
                <h2 className="text-[18px] font-bold text-[#0E1117] mt-0.5 leading-snug">
                  {plan.title}
                </h2>
                <p className="text-[12.5px] text-[#5C6370] mt-1">
                  Targeted broadcast via WhatsApp & Email to {plan.targetCount} dormant VIP accounts.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10.5px] text-[#9BA3B0] block">Expected Net Recovery</span>
                <p className="text-[26px] font-bold text-[#05875F] leading-tight">
                  +₹{plan.expectedMid.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-[#7B93B0] font-mono">
                  Range: ₹{plan.expectedLow.toLocaleString('en-IN')} – ₹{plan.expectedHigh.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Structured Parameter Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
              <div className="p-3 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl">
                <span className="text-[#9BA3B0] text-[10.5px] font-medium block">Target Audience</span>
                <span className="font-bold text-[#0E1117] mt-0.5 block">{plan.targetCount} Dormant Accounts</span>
              </div>
              <div className="p-3 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl">
                <span className="text-[#9BA3B0] text-[10.5px] font-medium block">Delivery Channels</span>
                <span className="font-bold text-[#0E1117] mt-0.5 block">WhatsApp + Email</span>
              </div>
              <div className="p-3 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl">
                <span className="text-[#9BA3B0] text-[10.5px] font-medium block">Dispatch Window</span>
                <span className="font-bold text-[#0E1117] mt-0.5 block">{plan.scheduledTime}</span>
              </div>
              <div className="p-3 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl">
                <span className="text-[#9BA3B0] text-[10.5px] font-medium block">Evaluation Horizon</span>
                <span className="font-bold text-[#0E1117] mt-0.5 block">{plan.durationDays} Days</span>
              </div>
            </div>
          </div>

          {/* 3. Why Twinora Selected This Plan & Expected Impact Path */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F52E8]" />
                <h3 className="text-[14.5px] font-bold text-[#0E1117]">Why Twinora Selected This Plan</h3>
              </div>
              <button
                onClick={() => setProvenanceOpen(true)}
                className="text-[11.5px] text-[#4F52E8] font-semibold flex items-center gap-1 hover:underline"
              >
                <Info className="w-3.5 h-3.5" />
                <span>How this was calculated</span>
              </button>
            </div>

            <p className="text-[12.5px] text-[#5C6370] leading-relaxed">
              {plan.whyExplanation?.summary || 'Analysis across customer transaction intervals reveals 32 high-value VIP accounts have exceeded their historical 28-day repurchase cadence by more than 45 days. A 15% comeback offer shortens the repurchase loop with minimal margin concession.'}
            </p>

            {/* Evidence Bullet Points */}
            <div className="space-y-1.5 text-[12px] text-[#374151]">
              {(plan.whyExplanation?.evidencePoints || [
                '32 accounts identified with historical average LTV exceeding ₹2,840.',
                'Inactivity duration (>45 days) exceeds store baseline repurchase interval of 28 days.',
                'Modeled 18.2% comeback conversion yields 6–8 restored recurring accounts.'
              ]).map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4F52E8] mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Expected Impact Path Flow */}
            <div className="pt-3 border-t border-[#E4E7ED]">
              <span className="section-label mb-2 block">Expected Impact Path</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(plan.whyExplanation?.impactPath || ['Customers (32 VIPs)', 'Retention (+22%)', 'Repeat Orders (+31)', 'Revenue (+₹28.4K)']).map((st, i, arr) => (
                  <React.Fragment key={st}>
                    <span className="px-2.5 py-1 rounded-lg bg-[#EEF0FF] text-[#4F52E8] font-semibold text-[11px] border border-[#C7CAFF]">
                      {st}
                    </span>
                    {i < arr.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#9BA3B0] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Live Orchestration Pipeline (Agent Execution Rows) */}
          <div className="panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E7ED]">
              <div>
                <h3 className="text-[14.5px] font-bold text-[#0E1117]">Execution Pipeline & Agents</h3>
                <p className="text-[11.5px] text-[#9BA3B0]">Click any step to inspect agent telemetry and target rules.</p>
              </div>
              <span className="badge badge-neutral text-[10px]">Multi-Agent Rail</span>
            </div>

            <div className="space-y-2.5">
              {plan.pipeline?.map((step, idx) => {
                const isStepCompleted = isApproved || step.status === 'completed';
                const isStepActive = executing && executionStage === idx;

                return (
                  <button
                    key={step.id || step.name}
                    onClick={() => setSelectedAgentStep(step)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all group ${
                      isStepActive
                        ? 'bg-[#EEF0FF] border-[#4F52E8] shadow-xs'
                        : isStepCompleted
                          ? 'bg-[#F8FDFB] border-[#D1FAE5] hover:border-[#05875F]'
                          : 'bg-[#F8F9FC] border-[#E4E7ED] hover:border-[#D4D9E3]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isStepActive
                          ? 'bg-[#4F52E8] text-white'
                          : isStepCompleted
                            ? 'bg-[#05875F] text-white'
                            : 'bg-[#E4E7ED] text-[#9BA3B0]'
                      }`}>
                        {isStepActive ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isStepCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-bold text-[#0E1117] truncate">{step.name}</p>
                          <span className="text-[10px] text-[#9BA3B0] font-mono">({step.agent})</span>
                        </div>
                        <p className="text-[11.5px] text-[#5C6370] mt-0.5 truncate">{step.summary || step.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10.5px] text-[#9BA3B0] font-mono hidden sm:inline">{step.time}</span>
                      <ChevronRight className="w-4 h-4 text-[#9BA3B0] group-hover:text-[#0E1117] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Live Audit Trail Log */}
          <div className="panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E7ED]">
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#4F52E8]" />
                <span className="text-[13px] font-bold text-[#0E1117]">Activity & Audit Trail</span>
              </div>
              <span className="text-[10.5px] text-[#9BA3B0] font-mono">Immutable Log</span>
            </div>

            <div className="space-y-2 text-[11.5px]">
              {(plan.auditEvents || [
                { time: '4:12 PM', actor: 'Simulation SIM-208', action: 'Generated Action Plan AP-904' },
                { time: '4:15 PM', actor: 'Customer Intelligence Agent', action: 'Validated 32 target customer profiles' },
                { time: '4:17 PM', actor: 'Alex Rivera (Owner)', action: 'Scheduled dispatch for Saturday, 6:00 PM' },
                { time: '4:18 PM', actor: 'Twinora System', action: 'Waiting for Owner/Admin approval' }
              ]).map((evt, idx) => (
                <div key={idx} className="flex items-start justify-between py-1 border-b border-[#F8F9FC] last:border-0">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#05875F] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-[#0E1117]">{evt.action}</span>
                      <span className="text-[#9BA3B0] text-[10px] block">Actor: {evt.actor}</span>
                    </div>
                  </div>
                  <span className="text-[10.5px] text-[#9BA3B0] font-mono shrink-0 ml-2">{evt.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (~35%): Sticky Decision Intelligence & Approval */}
        {/* ============================================================ */}
        <div className="space-y-4 lg:sticky lg:top-20">
          
          {/* Active Live Execution Intelligence Zone (Deep Navy Mode when running) */}
          {executing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="panel-deep p-6 space-y-4 text-white relative overflow-hidden"
            >
              <div className="scan-line" />
              <div className="flex items-center justify-between text-[11px] text-[#12B5C6] font-bold">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-[#12B5C6]" />
                  <span>LIVE ORCHESTRATION</span>
                </span>
                <span className="mono">Stage {executionStage + 1} of 4</span>
              </div>

              <div>
                <p className="text-[18px] font-bold leading-tight">
                  {plan.pipeline?.[executionStage]?.name || 'Executing Campaign Step…'}
                </p>
                <p className="text-[12px] text-[#CAD4E0] mt-1">
                  {plan.pipeline?.[executionStage]?.summary || 'Validating recipient gateway tokens.'}
                </p>
              </div>

              <div className="w-full bg-[#1F3050] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#12B5C6] h-full transition-all duration-300"
                  style={{ width: `${((executionStage + 1) / 4) * 100}%` }}
                />
              </div>

              <span className="text-[10.5px] text-[#7B93B0] block">
                Processing 32 recipient profiles across WhatsApp & Email rails…
              </span>
            </motion.div>
          ) : isApproved ? (
            /* Post-Execution Performance & Measurement Card */
            <div className="panel p-5 space-y-3 bg-[#EDFAF5] border border-[#BBF7D0]">
              <div className="flex items-center justify-between">
                <span className="badge badge-success text-[10px]">Measuring Live Campaign</span>
                <span className="text-[11px] text-[#05875F] font-mono font-bold">7-Day Window</span>
              </div>

              <div>
                <p className="text-[14px] font-bold text-[#0E1117]">Campaign Dispatched</p>
                <p className="text-[11.5px] text-[#5C6370] mt-0.5">
                  Telemetry tracking active responses across 32 recipient accounts.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#BBF7D0] text-[11.5px]">
                <div>
                  <span className="text-[#9BA3B0] block">Recipients</span>
                  <span className="font-bold text-[#0E1117]">32 VIP Accounts</span>
                </div>
                <div>
                  <span className="text-[#9BA3B0] block">Delivery Rate</span>
                  <span className="font-bold text-[#05875F]">100% (32/32)</span>
                </div>
                <div>
                  <span className="text-[#9BA3B0] block">Expected Lift</span>
                  <span className="font-bold text-[#05875F]">+₹28,400</span>
                </div>
                <div>
                  <span className="text-[#9BA3B0] block">Decision Memory</span>
                  <span className="font-bold text-[#4F52E8]">Tracking (Sep 14)</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/simulate')}
                className="btn-secondary w-full !h-8 text-[11.5px] mt-2 gap-1"
              >
                <span>View in Decision Memory</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : null}

          {/* Decision Intelligence Panel */}
          <div className="panel p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E7ED]">
              <span className="section-label text-[#4F52E8]">Decision Intelligence</span>
              <span className="text-[10.5px] text-[#9BA3B0] font-mono">Live Telemetry</span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-[#9BA3B0] block">Expected Recovery</span>
                <p className="text-[28px] font-bold text-[#05875F] leading-tight">
                  +₹{plan.expectedMid.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#7B93B0] font-mono">
                  Confidence range: <strong>₹{plan.expectedLow.toLocaleString('en-IN')} – ₹{plan.expectedHigh.toLocaleString('en-IN')}</strong>
                </p>
              </div>

              <div className="space-y-1.5 py-2 border-y border-[#F0F2F7] text-[11.5px]">
                <div className="flex justify-between">
                  <span className="text-[#9BA3B0]">Risk Assessment:</span>
                  <span className="font-bold text-[#05875F]">{plan.risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA3B0]">Evidence Strength:</span>
                  <span className="font-bold text-[#0E1117]">{plan.evidenceStrength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA3B0]">Margin Impact:</span>
                  <span className="font-semibold text-[#0E1117]">{plan.marginImpact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9BA3B0]">Retention Lift:</span>
                  <span className="font-bold text-[#05875F]">{plan.retentionLift}</span>
                </div>
              </div>
            </div>

            {/* Channel Connections Status */}
            <div className="p-3 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl space-y-2 text-[11.5px]">
              <span className="text-[10px] font-bold text-[#9BA3B0] uppercase block">Delivery Channel Readiness</span>
              <div className="flex items-center justify-between">
                <span className="text-[#0E1117] font-semibold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#05875F]" /> WhatsApp Rail
                </span>
                <span className="badge badge-success text-[9px]">Simulation Ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#0E1117] font-semibold flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#4F52E8]" /> Email Relay
                </span>
                <span className="badge badge-success text-[9px]">Connected</span>
              </div>
            </div>

            {/* Action Approval Button & RBAC State */}
            {!isApproved && (
              <div className="pt-2 space-y-2.5">
                <button
                  onClick={() => setConfirmModalOpen(true)}
                  disabled={!canApprove || executing}
                  className={`btn-primary w-full !h-11 text-[13px] font-bold gap-2 shadow-md shadow-[#4F52E8]/20 ${
                    !canApprove ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {!canApprove ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Approval Restricted</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Queue Action</span>
                    </>
                  )}
                </button>

                {!canApprove && (
                  <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-[11.5px] text-[#D97706] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Approval requires <strong>Owner</strong> or <strong>Admin</strong> role (Current: <strong>{currentRole}</strong>). Switch role above to test approval.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── MODAL 1: APPROVAL CONFIRMATION MODAL ── */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setConfirmModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDFAF5] border border-[#BBF7D0] flex items-center justify-center text-[#05875F]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0E1117]">Approve Action Plan?</h3>
                  <p className="text-[12px] text-[#5C6370]">Confirm parameters before queueing broadcast execution.</p>
                </div>
              </div>
              <button onClick={() => setConfirmModalOpen(false)} className="p-1 text-[#9BA3B0] hover:text-[#0E1117] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl space-y-2 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#9BA3B0]">Target Accounts:</span>
                <span className="font-bold text-[#0E1117]">{plan.targetCount} Dormant VIPs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA3B0]">Incentive Offer:</span>
                <span className="font-bold text-[#4F52E8]">15% COMEBACK15 Voucher</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA3B0]">Delivery Channels:</span>
                <span className="font-semibold text-[#0E1117]">WhatsApp + Email Relay</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA3B0]">Scheduled Dispatch:</span>
                <span className="font-bold text-[#0E1117]">{plan.scheduledTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E4E7ED]">
                <span className="text-[#9BA3B0]">Expected Net Lift:</span>
                <span className="font-bold text-[#05875F]">+₹{plan.expectedMid.toLocaleString('en-IN')} (Range: ₹{plan.expectedLow.toLocaleString('en-IN')} – ₹{plan.expectedHigh.toLocaleString('en-IN')})</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setConfirmModalOpen(false)} className="btn-secondary !h-9 text-[12px] px-4">
                Cancel
              </button>
              <button onClick={handleApproveConfirm} className="btn-primary !h-9 text-[12.5px] px-5 gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Queue Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CALCULATION PROVENANCE DRAWER ── */}
      {provenanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setProvenanceOpen(false)} />
          <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#E4E7ED] pb-3">
              <div>
                <h3 className="text-[15.5px] font-bold text-[#0E1117]">Calculation Provenance</h3>
                <p className="text-[11.5px] text-[#5C6370]">Deterministic mathematical factors behind ₹{plan.expectedMid.toLocaleString('en-IN')} recovery.</p>
              </div>
              <button onClick={() => setProvenanceOpen(false)} className="p-1 text-[#9BA3B0] hover:text-[#0E1117] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-[12px]">
              {[
                { label: 'Data Source', val: plan.provenance?.dataSource || 'PostgreSQL Store Records' },
                { label: 'Baseline Horizon', val: plan.provenance?.baselinePeriod || 'Trailing 30 Days' },
                { label: 'Eligible VIP Accounts', val: `${plan.provenance?.eligibleAccounts || 32} accounts (>45d inactive)` },
                { label: 'Modeled Conversion Rate', val: plan.provenance?.historicalConversionRate || '18.2%' },
                { label: 'Historical Cohort AOV', val: plan.provenance?.baselineAOV || '₹2,840' },
                { label: 'Discount Concession', val: plan.provenance?.discountOffer || '15% (margin delta −1.2%)' },
                { label: 'Estimated Discount Cost', val: plan.provenance?.discountCostEstimate || '₹4,840' },
                { label: 'Expected Net Recovery', val: plan.provenance?.expectedRecoveryMid || '₹28,400' },
                { label: 'Mathematically Modeled Range', val: plan.provenance?.confidenceRange || '₹24,992 – ₹32,376' },
                { label: 'Data Freshness', val: plan.provenance?.lastSynced || '2 min ago' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-[#F8F9FC]">
                  <span className="text-[#9BA3B0]">{item.label}</span>
                  <span className="font-semibold text-[#0E1117]">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl text-[11px] text-[#5C6370]">
              All calculations are generated deterministically by the Twinora simulation engine without synthetic numbers or AI hallucinations.
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: AGENT RUN INSPECTOR ── */}
      {selectedAgentStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setSelectedAgentStep(null)} />
          <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#E4E7ED] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#4F52E8] uppercase">{selectedAgentStep.agent}</span>
                <h3 className="text-[15.5px] font-bold text-[#0E1117] mt-0.5">{selectedAgentStep.name}</h3>
              </div>
              <button onClick={() => setSelectedAgentStep(null)} className="p-1 text-[#9BA3B0] hover:text-[#0E1117] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-[12px]">
              <div>
                <span className="text-[#9BA3B0] text-[10.5px] font-bold uppercase block">Input Data:</span>
                <p className="font-semibold text-[#0E1117] mt-0.5">{selectedAgentStep.details?.input || selectedAgentStep.desc}</p>
              </div>

              <div>
                <span className="text-[#9BA3B0] text-[10.5px] font-bold uppercase block">Rules Evaluated:</span>
                <p className="text-[#5C6370] mt-0.5">{selectedAgentStep.details?.rulesPassed || 'All eligibility validations passed.'}</p>
              </div>

              {selectedAgentStep.details?.targetSample && (
                <div>
                  <span className="text-[#9BA3B0] text-[10.5px] font-bold uppercase block">Verified Sample Accounts:</span>
                  <div className="mt-1 space-y-1">
                    {selectedAgentStep.details.targetSample.map((s, idx) => (
                      <div key={idx} className="p-2 bg-[#F8F9FC] border border-[#E4E7ED] rounded-lg text-[11.5px] font-mono text-[#0E1117]">
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedAgentStep(null)} className="btn-secondary !h-8 text-[12px] px-4">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: TIMELINE STAGE DRAWER ── */}
      {selectedTimelineStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setSelectedTimelineStage(null)} />
          <div className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#E4E7ED] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#4F52E8] uppercase">Stage Details</span>
                <h3 className="text-[15.5px] font-bold text-[#0E1117] mt-0.5">{selectedTimelineStage.label} Stage</h3>
              </div>
              <button onClick={() => setSelectedTimelineStage(null)} className="p-1 text-[#9BA3B0] hover:text-[#0E1117] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#9BA3B0]">Assigned Actor:</span>
                <span className="font-semibold text-[#0E1117]">{selectedTimelineStage.actor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9BA3B0]">Timestamp:</span>
                <span className="font-mono text-[#0E1117]">{selectedTimelineStage.time}</span>
              </div>
              <div className="pt-2 border-t border-[#F8F9FC]">
                <span className="text-[#9BA3B0] block text-[11px] mb-1">Description & Audit Requirement:</span>
                <p className="text-[#5C6370] leading-relaxed">{selectedTimelineStage.desc}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedTimelineStage(null)} className="btn-secondary !h-8 text-[12px] px-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: PRE-APPROVAL EDIT MODAL ── */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setEditModalOpen(false)} />
          <form onSubmit={handleSaveEdit} className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#E4E7ED] pb-3">
              <div>
                <h3 className="text-[15.5px] font-bold text-[#0E1117]">Edit Plan Parameters</h3>
                <p className="text-[11.5px] text-[#5C6370]">Adjust dispatch schedule and audience size pre-approval.</p>
              </div>
              <button type="button" onClick={() => setEditModalOpen(false)} className="p-1 text-[#9BA3B0] hover:text-[#0E1117] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-[12.5px]">
              <div>
                <label className="section-label mb-1 block">Scheduled Dispatch Window</label>
                <input
                  type="text"
                  value={editSchedule}
                  onChange={(e) => setEditSchedule(e.target.value)}
                  className="input"
                  placeholder="e.g. Saturday, 6:00 PM"
                />
              </div>

              <div>
                <label className="section-label mb-1 block">Target Account Count</label>
                <input
                  type="number"
                  value={editTargetCount}
                  onChange={(e) => setEditTargetCount(e.target.value)}
                  className="input"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E7ED]">
              <button type="button" onClick={() => setEditModalOpen(false)} className="btn-secondary !h-8 text-[12px] px-4">
                Cancel
              </button>
              <button type="submit" disabled={savingEdit} className="btn-primary !h-8 text-[12px] px-4">
                {savingEdit ? 'Saving…' : 'Save & Bump Revision'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── MODAL 6: REVISION HISTORY MODAL ── */}
      {revisionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setRevisionsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#E4E7ED] pb-3">
              <div>
                <h3 className="text-[15.5px] font-bold text-[#0E1117]">Plan Version & Revision History</h3>
                <p className="text-[11.5px] text-[#5C6370]">Audit trail of parameter adjustments on {plan.id}.</p>
              </div>
              <button onClick={() => setRevisionsModalOpen(false)} className="p-1 text-[#9BA3B0] hover:text-[#0E1117] rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {(plan.revisions || [
                { version: 1, date: 'Aug 28, 4:12 PM', author: 'Simulation SIM-208', changes: 'Generated strategy baseline from Monte Carlo simulation.' },
                { version: 2, date: 'Aug 28, 4:15 PM', author: 'Customer Intelligence Agent', changes: 'Audience filter refined: 36 → 32 verified dormant VIPs.' },
                { version: 3, date: 'Aug 28, 4:17 PM', author: 'Alex Rivera', changes: 'Dispatch window scheduled for Saturday, 6:00 PM.' }
              ]).map((rev) => (
                <div key={rev.version} className="p-3.5 bg-[#F8F9FC] border border-[#E4E7ED] rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-bold text-[#4F52E8]">Version {rev.version}</span>
                    <span className="text-[#9BA3B0] font-mono">{rev.date}</span>
                  </div>
                  <p className="text-[12px] text-[#0E1117] font-medium">{rev.changes}</p>
                  <span className="text-[10.5px] text-[#9BA3B0] block">Author: {rev.author}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setRevisionsModalOpen(false)} className="btn-secondary !h-8 text-[12px] px-4">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
