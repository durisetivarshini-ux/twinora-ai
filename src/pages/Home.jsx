import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  ChevronRight,
  Shield,
  Layers,
  Users,
  Cpu,
  BarChart3,
  Bot,
  Zap,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  X,
  Database,
  ShoppingBag,
  CreditCard,
  Lock,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import LivingTwinCore from '../components/LivingTwinCore';
import { apiService } from '../services/apiService';

export default function Home() {
  const navigate = useNavigate();

  // Interactive Simulation Sandbox State
  const [selectedScenario, setSelectedScenario] = useState('discount15');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState('');
  const [simResults, setSimResults] = useState({
    baseline: 124500,
    simulated: 139800,
    difference: 15300,
    percent: '+12.3%',
    orders: '+16 orders',
    retention: '+4.0% velocity',
    timeSeries: [
      { day: 'Day 1', baseline: 16000, simulated: 18000, difference: '+₹2,000' },
      { day: 'Day 2', baseline: 17500, simulated: 19800, difference: '+₹2,300' },
      { day: 'Day 3', baseline: 16800, simulated: 19200, difference: '+₹2,400' },
      { day: 'Day 4', baseline: 18200, simulated: 20900, difference: '+₹2,700' },
      { day: 'Day 5', baseline: 19000, simulated: 21800, difference: '+₹2,800' },
      { day: 'Day 6', baseline: 18500, simulated: 20500, difference: '+₹2,000' },
      { day: 'Day 7', baseline: 18500, simulated: 19600, difference: '+₹1,100' },
    ]
  });

  const [activeModalStrategy, setActiveModalStrategy] = useState(null);

  const simulationPresets = {
    discount15: {
      title: 'Offer 15% Comeback Discount',
      desc: 'Target inactive VIP accounts (43 dormant high LTV customers)',
      discountPct: 15,
      targetSegment: 'inactive'
    },
    bundleCrossSell: {
      title: 'Bundle Wireless Earbuds + Case',
      desc: 'Target active buyers with 12% bundle savings',
      discountPct: 12,
      targetSegment: 'active'
    },
    priceIncrease5: {
      title: 'Optimized Pricing (+5% on Premium)',
      desc: 'Leverage low price elasticity on charging docks',
      discountPct: 0,
      priceChangePct: 5,
      targetSegment: 'all'
    }
  };

  const handleRunPreset = async (key) => {
    setSelectedScenario(key);
    setIsSimulating(true);

    const steps = [
      'Extracting customer cohort elasticity vectors...',
      'Synthesizing 3,482 transaction cashflows...',
      'Executing Monte Carlo sandbox iterations...',
      'Twinora AI model convergence reached.'
    ];

    for (let i = 0; i < steps.length; i++) {
      setSimulationStep(steps[i]);
      await new Promise(r => setTimeout(r, 220));
    }

    try {
      const preset = simulationPresets[key];
      const res = await apiService.runSimulation({
        discountPct: preset.discountPct,
        targetSegment: preset.targetSegment,
        priceChangePct: preset.priceChangePct || 0
      });

      if (res && res.baseline) {
        setSimResults({
          baseline: res.baseline.revenue,
          simulated: res.simulated.revenue,
          difference: res.deltas.revenueDeltaVal,
          percent: res.deltas.revenueDeltaPct,
          orders: `+${res.simulated.orders - res.baseline.orders} orders`,
          retention: `+${res.simulated.retentionRate - res.baseline.retentionRate}% velocity`,
          timeSeries: res.timeSeriesComparison
        });
      }
    } catch (err) {
      console.warn('Simulation fallback', err);
    } finally {
      setIsSimulating(false);
      setSimulationStep('');
    }
  };

  return (
    <div className="bg-canvas text-primaryText min-h-screen font-sans selection:bg-[#4F46E5] selection:text-white">
      
      {/* ========================================================================= */}
      {/* HERO SECTION (Clean, Confident, Business-Focused) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[88vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-10 left-1/4 w-[480px] h-[480px] rounded-full glow-radial-blue pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[440px] h-[440px] rounded-full glow-radial-cyan pointer-events-none -z-10" />
        <div className="absolute inset-0 backdrop-grid pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[11px] font-mono text-[#4F46E5] font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-pulse" />
              <span>AI BUSINESS SIMULATION & DECISION INTELLIGENCE</span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-extrabold text-[#0F172A] tracking-tight leading-[1.02]">
              SEE TOMORROW. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#2563EB] to-[#06B6D4]">
                BEFORE YOU DECIDE.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-[16px] sm:text-[17px] text-[#475569] leading-relaxed max-w-xl">
              Twinora creates a living digital model of your business, simulates possible decisions, and helps you choose the move with the strongest potential.
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/signup"
                className="btn-primary !h-[50px] !px-7 !text-[14px] !rounded-xl group"
              >
                <span>BUILD YOUR TWIN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                onClick={() => {
                  const el = document.getElementById('story-signals');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary !h-[50px] !px-6 !text-[14px] !rounded-xl"
              >
                <span>EXPLORE THE DIGITAL TWIN →</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-5 pt-3 text-[12px] text-[#64748B] font-mono">
              <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Live Monte Carlo Engine
              </span>
              <span>•</span>
              <span>SOC-2 Type II Secure</span>
            </div>
          </div>

          {/* Right Column: Floating Signature Living Twinora Core */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <LivingTwinCore />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7-STEP PRODUCT STORY FLOW */}
      {/* ========================================================================= */}
      
      {/* Step 1: YOUR BUSINESS GENERATES SIGNALS */}
      <section id="story-signals" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E2E8F0] bg-[#F9FAFD]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="text-[11px] font-mono text-[#4F46E5] font-bold uppercase tracking-wider">
              Step 01 • Telemetry Ingestion
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              YOUR BUSINESS GENERATES SIGNALS.
            </h2>
            <p className="text-[15px] text-[#64748B]">
              Every customer order, refund, payment latency, and SKU view streams into your model automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Orders & Cashflow', icon: DollarSign, metric: '3,482 monthly orders', sub: '₹892 average order value', color: '#4F46E5' },
              { title: 'Customer Lifetime Value', icon: Users, metric: '1,240 tracked accounts', sub: '4 behavioral cohorts', color: '#06B6D4' },
              { title: 'Product Elasticity', icon: ShoppingBag, metric: '142 catalog SKUs', sub: 'Price sensitivity modeling', color: '#D97706' },
              { title: 'Payment Mesh', icon: CreditCard, metric: '99.4% authorization rate', sub: 'Zero gateway latency', color: '#2563EB' },
              { title: 'Retention Velocity', icon: RefreshCw, metric: '72.4% repeat cohort rate', sub: 'Recency risk monitoring', color: '#16A34A' },
              { title: 'Growth Score', icon: TrendingUp, metric: '87 / 100 Health Score', sub: '₹47,800 unrealized upside', color: '#4F46E5' },
            ].map((stream, idx) => {
              const Icon = stream.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stream.color}15`, color: stream.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-[#16A34A] font-bold bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#DCFCE7]">
                      LIVE
                    </span>
                  </div>

                  <div>
                    <h3 className="text-[15px] font-bold text-[#0F172A]">{stream.title}</h3>
                    <div className="text-[13px] font-bold text-[#4F46E5] font-mono mt-0.5">{stream.metric}</div>
                    <p className="text-[12px] text-[#64748B] font-mono mt-0.5">{stream.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Step 2: "WHAT IF?" INTERACTIVE SIMULATION SANDBOX */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E2E8F0] bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="text-[11px] font-mono text-[#4F46E5] font-bold uppercase tracking-wider">
              Step 02 • Decision Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              ASK: "WHAT IF WE CHANGE THIS?"
            </h2>
            <p className="text-[15px] text-[#64748B]">
              Simulate discounts, pricing changes, or campaign timings before risking capital.
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(simulationPresets).map((key) => {
              const preset = simulationPresets[key];
              const isSelected = selectedScenario === key;
              return (
                <button
                  key={key}
                  onClick={() => handleRunPreset(key)}
                  disabled={isSimulating}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-[#EEF2FF] border-2 border-[#4F46E5] shadow-sm'
                      : 'bg-[#F9FAFD] border-[#E2E8F0] hover:bg-white hover:border-[#CBD5E1]'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase font-bold text-[#4F46E5] block mb-1">
                    Scenario Preset
                  </span>
                  <h4 className="text-[14px] font-bold text-[#0F172A]">{preset.title}</h4>
                  <p className="text-[12px] text-[#64748B] mt-0.5">{preset.desc}</p>
                </button>
              );
            })}
          </div>

          {/* Sandbox Output Preview */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#F9FAFD] border border-[#E2E8F0] shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#06B6D4] font-bold uppercase tracking-wider">
                  Live Prediction Output
                </span>
                <h3 className="text-[18px] font-bold text-[#0F172A]">
                  {simulationPresets[selectedScenario].title}
                </h3>
              </div>

              {isSimulating ? (
                <div className="flex items-center gap-2 text-[12px] font-mono text-[#4F46E5] bg-[#EEF2FF] px-3 py-1.5 rounded-lg border border-[#C7D2FE] animate-pulse font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>{simulationStep}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7] text-[11px] font-mono font-bold">
                    Confidence: 87%
                  </span>
                  <Link
                    to={`/simulate?preset=${selectedScenario}`}
                    className="btn-primary !h-[34px] !px-3.5 !text-[12px]"
                  >
                    <span>Open Full Lab →</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Metrics Delta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[10px] font-mono text-[#64748B]">Revenue Baseline</span>
                <div className="text-[17px] font-extrabold text-[#0F172A] font-mono mt-0.5">₹1,24,500</div>
                <span className="text-[10px] text-[#64748B] font-mono">7-day run-rate</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[10px] font-mono text-[#64748B]">Predicted Outcome</span>
                <div className="text-[17px] font-extrabold text-[#4F46E5] font-mono mt-0.5">₹{simResults.simulated.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-[#16A34A] font-mono font-bold">{simResults.percent} uplift</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[10px] font-mono text-[#64748B]">Net Revenue Delta</span>
                <div className="text-[17px] font-extrabold text-[#16A34A] font-mono mt-0.5">+₹{simResults.difference.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-[#16A34A] font-mono font-bold">{simResults.orders}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
                <span className="text-[10px] font-mono text-[#64748B]">Retention Velocity</span>
                <div className="text-[17px] font-extrabold text-[#06B6D4] font-mono mt-0.5">{simResults.retention}</div>
                <span className="text-[10px] text-[#64748B] font-mono">Low margin risk</span>
              </div>
            </div>

            {/* Comparison Area Chart */}
            <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#64748B]">7-Day Trajectory (Baseline vs Simulated)</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[#64748B]">
                    <span className="w-2 h-2 rounded bg-slate-300" /> Baseline
                  </span>
                  <span className="flex items-center gap-1 text-[#4F46E5] font-bold">
                    <span className="w-2 h-2 rounded bg-[#4F46E5]" /> Simulated
                  </span>
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simResults.timeSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A' }}
                    />
                    <Area type="monotone" dataKey="baseline" stroke="#94A3B8" strokeWidth={2} fill="#F1F5F9" />
                    <Area type="monotone" dataKey="simulated" stroke="#4F46E5" strokeWidth={2.5} fill="#EEF2FF" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: COMPARE POSSIBLE FUTURES & SELECT OPTIMAL MOVE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E2E8F0] bg-[#F9FAFD]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <span className="text-[11px] font-mono text-[#4F46E5] font-bold uppercase tracking-wider">
              Step 03 • Strategy Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">
              COMPARE POSSIBLE FUTURES.
            </h2>
            <p className="text-[15px] text-[#64748B]">
              Side-by-side strategy matrix ranking predicted revenue upside against margin risk.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F9FAFD] text-[11px] font-mono text-[#0F172A] uppercase">
                    <th className="p-4 font-bold">Strategy Option</th>
                    <th className="p-4 font-bold">Target Cohort</th>
                    <th className="p-4 font-bold">Predicted Uplift</th>
                    <th className="p-4 font-bold">Margin Risk</th>
                    <th className="p-4 font-bold">Recommendation</th>
                    <th className="p-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[13px] font-sans">
                  {/* Option 1: AI Recommended */}
                  <tr className="bg-[#EEF2FF]/40 hover:bg-[#EEF2FF]/70 transition-colors">
                    <td className="p-4 font-bold text-[#0F172A]">
                      15% Comeback Discount
                      <span className="block text-[11px] text-[#64748B] font-mono font-normal">VIP customer re-engagement</span>
                    </td>
                    <td className="p-4 font-mono text-[#475569]">43 Inactive VIPs</td>
                    <td className="p-4 font-mono font-bold text-[#16A34A]">+₹18,400 (+14.8%)</td>
                    <td className="p-4 font-mono text-[#16A34A] font-semibold">Low Risk</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded bg-[#4F46E5] text-white text-[10px] font-mono font-bold">
                        AI RECOMMENDED
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setActiveModalStrategy('winback')}
                        className="text-[12px] font-bold text-[#4F46E5] hover:underline"
                      >
                        Why This Wins →
                      </button>
                    </td>
                  </tr>

                  {/* Option 2 */}
                  <tr className="hover:bg-[#F9FAFD] transition-colors">
                    <td className="p-4 font-bold text-[#0F172A]">
                      12% Bundle Cross-Sell
                      <span className="block text-[11px] text-[#64748B] font-mono font-normal">Earbuds + Leather Case</span>
                    </td>
                    <td className="p-4 font-mono text-[#475569]">156 Active Buyers</td>
                    <td className="p-4 font-mono font-bold text-[#4F46E5]">+₹12,700 (+10.2%)</td>
                    <td className="p-4 font-mono text-[#16A34A] font-semibold">Low Risk</td>
                    <td className="p-4 font-mono text-[#64748B]">Alternative</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setActiveModalStrategy('bundle')}
                        className="text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A]"
                      >
                        Review
                      </button>
                    </td>
                  </tr>

                  {/* Option 3 */}
                  <tr className="hover:bg-[#F9FAFD] transition-colors">
                    <td className="p-4 font-bold text-[#0F172A]">
                      +5% Pricing Optimization
                      <span className="block text-[11px] text-[#64748B] font-mono font-normal">High-margin accessories</span>
                    </td>
                    <td className="p-4 font-mono text-[#475569]">All Purchases</td>
                    <td className="p-4 font-mono font-bold text-[#4F46E5]">+₹16,700 (+13.4%)</td>
                    <td className="p-4 font-mono text-[#D97706] font-semibold">Medium Risk</td>
                    <td className="p-4 font-mono text-[#64748B]">Test In Lab</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setActiveModalStrategy('pricing')}
                        className="text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A]"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E2E8F0] bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            DON'T GUESS YOUR NEXT MOVE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]">
              SIMULATE IT TODAY.
            </span>
          </h2>
          <p className="text-[16px] text-[#475569] max-w-xl mx-auto">
            Build your living business twin in minutes and explore what happens before risking real capital.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="btn-primary !h-[50px] !px-8 !text-[15px] !rounded-xl"
            >
              <span>BUILD YOUR DIGITAL TWIN →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Explainer Modal */}
      {activeModalStrategy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs font-sans">
          <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-elevated space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="text-[17px] font-bold text-[#0F172A]">Why This Strategy Wins</h3>
              </div>
              <button 
                onClick={() => setActiveModalStrategy(null)}
                className="p-1 text-slate-400 hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13px] text-[#475569] leading-relaxed">
              Targeting the <strong>43 dormant VIP accounts</strong> generates the highest expected revenue uplift (<strong>+₹18,400</strong>) because these customers previously exhibited high purchasing power (AOV &gt; ₹1,800). The 15% comeback incentive overcomes churn resistance with near-zero cannibalization risk on active buyers.
            </p>

            <div className="p-3.5 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#4F46E5] font-bold">Predicted Net ROI: 4.8x</span>
              <span className="text-[#16A34A] font-bold">Confidence: 87%</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveModalStrategy(null)}
                className="w-1/2 py-2 text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveModalStrategy(null);
                  navigate('/simulate?preset=scen-inactive-15');
                }}
                className="w-1/2 btn-primary !h-[38px] !text-[12px]"
              >
                Simulate in Lab →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
