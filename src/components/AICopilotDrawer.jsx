import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  RefreshCw,
  Layers,
  Network,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { askTwinora } from '../services/aiService';
import { useAuth } from '../context/AuthContext';

const PAGE_SUGGESTIONS = {
  '/dashboard': [
    'Why is revenue below target?',
    'What changed this month?',
    'Which product is performing best?',
    'What should I focus on today?'
  ],
  '/customers': [
    'Which customer cohort is most at risk?',
    'Why did the VIP cohort become inactive?',
    'Which cohort has highest recovery potential?'
  ],
  '/simulate': [
    'Explain this simulation.',
    'What is the downside risk?',
    'Compare this with another strategy.'
  ],
  '/opportunities': [
    'Why was this opportunity detected?',
    'What evidence supports this?',
    'What should I simulate first?'
  ],
  '/analytics': [
    'What changed in this chart?',
    'What caused the revenue anomaly?',
    'Which metric needs attention?'
  ],
  '/twin': [
    'How are customers and revenue connected?',
    'Which node is most vulnerable?',
    'Explain the twin health index.'
  ],
  '/actions': [
    'What is the expected ROI of this plan?',
    'What happens when I execute?',
    'Are there any channel risks?'
  ]
};

const LOADING_STAGES = [
  'Understanding question…',
  'Fetching business telemetry…',
  'Comparing signals…',
  'Preparing explanation…'
];

export default function AICopilotDrawer({ isOpen, onClose }) {
  const { user, merchant } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const pageContextName = currentPath.replace('/', '') || 'dashboard';

  const defaultSuggestions = PAGE_SUGGESTIONS[currentPath] || PAGE_SUGGESTIONS['/dashboard'];

  const [dateRange, setDateRange] = useState('30d');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStageIdx, setLoadingStageIdx] = useState(0);
  const [showReasoningMap, setShowReasoningMap] = useState({});
  const [activeExpandedMethodology, setActiveExpandedMethodology] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [lastFailedQuestion, setLastFailedQuestion] = useState('');

  const [history, setHistory] = useState([]);

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStageIdx(0);
      interval = setInterval(() => {
        setLoadingStageIdx(prev => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleAsk = async (questionText = input) => {
    const q = questionText.trim();
    if (!q || loading) return;

    setInput('');
    setLoading(true);
    setHasError(false);
    setLastFailedQuestion(q);

    try {
      const response = await askTwinora(q, pageContextName, dateRange);

      setHistory(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          question: q,
          dateRange,
          answer: response
        }
      ]);
    } catch (err) {
      console.warn('Ask Twinora failed:', err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedQuestion) {
      handleAsk(lastFailedQuestion);
    }
  };

  const handleNavigate = (route) => {
    if (route) {
      navigate(route);
      onClose();
    }
  };

  const toggleReasoning = (id) => {
    setShowReasoningMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-xs"
      />

      {/* Drawer Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="absolute inset-y-0 right-0 w-full max-w-[480px] bg-white border-l border-[#E4E7ED] shadow-2xl flex flex-col font-sans"
      >
        {/* Top Header */}
        <div className="px-6 py-3 border-b border-[#E4E7ED] bg-white shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#080E1C] border border-[#1F3050] flex items-center justify-center text-[#12B5C6] shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[14.5px] text-[#0E1117] tracking-tight">Ask Twinora</h3>
                  <span className="badge badge-brand text-[9.5px]">Grounded Copilot</span>
                </div>
                <p className="text-[11px] text-[#7B93B0] truncate max-w-[260px]">
                  Context-aware intelligence for {merchant?.businessName || user?.businessName || 'your store'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9BA3B0] hover:text-[#0E1117] hover:bg-[#F4F5F9] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Date Context Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
            <span className="text-[#9BA3B0] font-medium mr-1 shrink-0">Context:</span>
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: 'Quarter' },
              { id: 'all', label: '1 Year' },
            ].map(chip => (
              <button
                key={chip.id}
                onClick={() => setDateRange(chip.id)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 ${
                  dateRange === chip.id
                    ? 'bg-[#080E1C] text-[#12B5C6] border border-[#1F3050]'
                    : 'bg-[#F8F9FC] text-[#5C6370] hover:text-[#0E1117] border border-[#E4E7ED]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#F8F9FC]">
          {history.length === 0 && (
            <div className="p-6 text-center space-y-3 my-8">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] text-[#4F52E8] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-[16px] font-bold text-[#0E1117]">What would you like to understand?</h4>
              <p className="text-[12.5px] text-[#5C6370] max-w-sm mx-auto leading-relaxed">
                Ask anything about your revenue, customer cohorts, simulation outcomes, or top performing products.
              </p>
            </div>
          )}

          {history.map((item) => (
            <div key={item.id} className="space-y-3 fade-up">
              {/* User Question Bubble */}
              {item.question && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-xs bg-[#4F52E8] text-white text-[13px] font-semibold shadow-sm leading-relaxed">
                    {item.question}
                  </div>
                </div>
              )}

              {/* Grounded Twinora AI Insight Container */}
              <div className="panel-deep p-5 relative overflow-hidden text-white space-y-4">
                <div className="scan-line" />

                {/* Header */}
                <div className="flex items-center justify-between text-[11px] border-b border-[#1F3050] pb-2.5 text-[#7B93B0]">
                  <div className="flex items-center gap-1.5 text-[#12B5C6] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#12B5C6] ping-dot" />
                    <span>Twinora Intelligence</span>
                  </div>
                  <span className="mono text-[10px] text-[#4F7A9E]">
                    {item.answer.dataFreshness || 'Live Synchronized'}
                  </span>
                </div>

                {/* Title & Summary */}
                <div>
                  <h4 className="text-[15.5px] font-bold text-white leading-snug tracking-tight mb-1.5">
                    {item.answer.title}
                  </h4>
                  <p className="text-[13px] text-[#CAD4E0] leading-relaxed">
                    {item.answer.summary}
                  </p>
                </div>

                {/* ── TWINORA INTELLIGENCE TRACE ── */}
                {item.answer.trace && (
                  <div className="p-3.5 bg-[#0F1929] rounded-xl border border-[#1F3050] space-y-2 text-[11.5px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#12B5C6] font-semibold uppercase tracking-wider text-[10px]">
                        Intelligence Trace
                      </span>
                      <button
                        onClick={() => toggleReasoning(item.id)}
                        className="text-[10.5px] text-[#4F7A9E] hover:text-[#12B5C6] flex items-center gap-1 transition-colors"
                      >
                        <Network className="w-3 h-3" />
                        <span>{showReasoningMap[item.id] ? 'Hide map' : 'Show reasoning map'}</span>
                      </button>
                    </div>

                    <div className="space-y-1 text-[#CAD4E0]">
                      <div className="flex gap-2">
                        <span className="text-[#7B93B0] shrink-0">Signals:</span>
                        <span className="text-white font-medium">{item.answer.trace.signalsChecked?.join(' · ')}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#7B93B0] shrink-0">Key factor:</span>
                        <span className="text-[#34D399] font-bold">{item.answer.trace.strongestSignal}</span>
                      </div>
                    </div>

                    {/* Expandable Reasoning Map */}
                    <AnimatePresence>
                      {showReasoningMap[item.id] && item.answer.reasoningMap && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-2 border-t border-[#1F3050] space-y-1.5"
                        >
                          {item.answer.reasoningMap.map((rm, rIdx) => (
                            <div key={rIdx} className="flex items-center gap-2 text-[11px]">
                              <span className="w-4 h-4 rounded-full bg-[#4F52E8]/30 text-[#8B8FFF] flex items-center justify-center font-bold text-[9px] shrink-0">
                                {rm.step}
                              </span>
                              <span className="font-semibold text-white">{rm.label}:</span>
                              <span className="text-[#7B93B0] truncate">{rm.detail}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Structured Evidence Badges */}
                {item.answer.evidence && item.answer.evidence.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="section-label text-[#4F7A9E] text-[10px]">Telemetry Evidence</p>
                    <div className="grid grid-cols-2 gap-2">
                      {item.answer.evidence.map((ev, evIdx) => (
                        <div key={evIdx} className="panel-deep-3 p-2.5">
                          <p className="text-[10px] text-[#7B93B0] font-medium truncate">{ev.metric || ev.label}</p>
                          <p className="text-[13px] font-bold text-white mt-0.5">{ev.current || ev.value}</p>
                          {ev.change && (
                            <p className="text-[10px] text-[#34D399] mt-0.5">{ev.change}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Action & CTA */}
                {item.answer.nextAction && (
                  <div className="pt-2 border-t border-[#1F3050] flex flex-col gap-2">
                    {item.answer.recommendedAction && (
                      <p className="text-[11.5px] text-[#7B93B0]">
                        <span className="text-[#34D399] font-semibold">Recommended Next Step:</span> {item.answer.recommendedAction}
                      </p>
                    )}
                    <button
                      onClick={() => handleNavigate(item.answer.nextAction.route)}
                      className="btn-primary !h-9 text-[12.5px] gap-2 w-full justify-center shadow-md shadow-[#4F52E8]/20"
                    >
                      <span>{item.answer.nextAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Methodology Disclosure */}
                {item.answer.methodology && (
                  <div className="pt-2 border-t border-[#1F3050]">
                    <button
                      onClick={() => setActiveExpandedMethodology(activeExpandedMethodology === item.id ? null : item.id)}
                      className="text-[11px] text-[#4F7A9E] hover:text-[#12B5C6] flex items-center justify-between w-full transition-colors py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>How Twinora reached this conclusion</span>
                      </span>
                      {activeExpandedMethodology === item.id ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <AnimatePresence>
                      {activeExpandedMethodology === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 bg-[#080E1C] rounded-xl border border-[#1F3050] space-y-2 text-[11px] text-[#7B93B0]">
                            <div>
                              <span className="text-white font-semibold block">Metrics Used:</span>
                              <span>{item.answer.methodology.metricsUsed}</span>
                            </div>
                            <div>
                              <span className="text-white font-semibold block">Comparison Window:</span>
                              <span>{item.answer.methodology.comparisonPeriod}</span>
                            </div>
                            <div>
                              <span className="text-white font-semibold block">Assumptions:</span>
                              <span>{item.answer.methodology.assumptions}</span>
                            </div>
                            <div>
                              <span className="text-white font-semibold block">Calculation Source:</span>
                              <span className="text-[#34D399]">{item.answer.methodology.calculationSource}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Staged Processing Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel-deep p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-[#12B5C6] text-[12px] font-semibold">
                <div className="w-3.5 h-3.5 border-2 border-[#12B5C6] border-t-transparent rounded-full animate-spin" />
                <span>{LOADING_STAGES[loadingStageIdx]}</span>
              </div>
              <div className="w-full bg-[#1F3050] h-1 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[#4F52E8] to-[#12B5C6] h-full rounded-full"
                  animate={{ width: `${((loadingStageIdx + 1) / LOADING_STAGES.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {/* Graceful Error State */}
          {hasError && (
            <div className="p-4 rounded-xl bg-[#FEF1F1] border border-[#FECACA] text-[#D92E2E] space-y-2 text-[12px]">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Twinora Intelligence is temporarily unavailable.</span>
              </div>
              <p className="text-[#5C6370] text-[11.5px]">
                Your business data and simulations are still available and synchronized.
              </p>
              <button
                onClick={handleRetry}
                className="btn-secondary !h-7 !text-[11px] gap-1.5 text-[#D92E2E] border-[#FECACA] hover:bg-white"
              >
                <RefreshCw className="w-3 h-3" />
                <span>TRY AGAIN →</span>
              </button>
            </div>
          )}
        </div>

        {/* Page-Contextual Suggestions */}
        <div className="p-3 border-t border-[#E4E7ED] bg-white space-y-1.5 shrink-0">
          <p className="text-[10px] font-semibold text-[#9BA3B0] uppercase tracking-wider px-1">
            Suggested for {pageContextName.charAt(0).toUpperCase() + pageContextName.slice(1)}
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {defaultSuggestions.map((sug, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleAsk(sug)}
                className="px-2.5 py-1.5 rounded-lg bg-[#F8F9FC] hover:bg-[#EEF0FF] border border-[#E4E7ED] hover:border-[#4F52E8]/40 text-[#4B5563] hover:text-[#4F52E8] text-[11px] font-medium whitespace-nowrap transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="p-3.5 border-t border-[#E4E7ED] bg-white flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask Twinora about your business metrics, cohorts, simulations…"
            className="input !py-2.5 !text-[13px] flex-1"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="btn-primary !h-10 !w-10 !p-0 shrink-0"
            title="Ask Twinora"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
