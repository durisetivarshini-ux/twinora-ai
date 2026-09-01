import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Sparkles,
  Database,
  UploadCloud,
  ArrowRight,
  Check
} from 'lucide-react';
import TwinoraLogo from '../components/TwinoraLogo';
import { useAuth } from '../context/AuthContext';
import { fetchBusinessOverview, fetchCustomerSegments, fetchOpportunities } from '../services/apiService';

export default function Onboarding() {
  const { user, merchant } = useAuth();
  const [step, setStep] = useState(1);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentLogText, setCurrentLogText] = useState('');
  const [activeStepTitle, setActiveStepTitle] = useState('Mapping revenue');
  const [isDone, setIsDone] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

  const [overview, setOverview] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  // Animated numbers
  const [growthScore, setGrowthScore] = useState(0);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const [potentialRevenue, setPotentialRevenue] = useState(0);

  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    businessName: user?.businessName || merchant?.businessName || 'NovaCart Electronics',
    industry: 'D2C Retail & Electronics',
    businessType: 'E-commerce & Direct-to-Consumer',
    country: 'India (INR ₹)'
  });

  const [dataOption, setDataOption] = useState('demo');

  useEffect(() => {
    Promise.all([
      fetchBusinessOverview('30d'),
      fetchCustomerSegments(),
      fetchOpportunities()
    ]).then(([ov, segs, opps]) => {
      setOverview(ov);
      setCohorts(segs);
      setOpportunities(opps);
    }).catch(() => {});
  }, []);

  const totalTxns = overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '2,940';
  const totalOppVal = opportunities.reduce((s, o) => s + (o.potentialRevenue || 0), 0) || 28400;

  useEffect(() => {
    if (step === 4) {
      const logs = [
        { pct: 15, title: 'STAGE 01 — Mapping revenue', text: `Parsing ${totalTxns} transaction logs & cashflow velocity...` },
        { pct: 35, title: 'STAGE 02 — Analyzing customers', text: 'Mapping RFM behavioral cohorts & retention elasticity...' },
        { pct: 55, title: 'STAGE 03 — Understanding products', text: 'Auditing SKU gross margins & cross-sell propensities...' },
        { pct: 75, title: 'STAGE 04 — Modeling retention', text: 'Calculating churn probability and repeat purchase cycles...' },
        { pct: 90, title: 'STAGE 05 — Detecting opportunities', text: `Uncovered growth leaks with ₹${(totalOppVal).toLocaleString('en-IN')} upside...` },
        { pct: 100, title: 'STAGE 06 — Activating AI agents', text: `Discovered ₹${(totalOppVal).toLocaleString('en-IN')} in growth opportunities!` }
      ];

      let idx = 0;
      const interval = setInterval(() => {
        if (idx < logs.length) {
          setTrainingProgress(logs[idx].pct);
          setActiveStepTitle(logs[idx].title);
          setCurrentLogText(logs[idx].text);
          idx++;
        } else {
          clearInterval(interval);
          setIsDone(true);

          let g = 0;
          const targetG = overview?.growthScore || 82;
          const gInt = setInterval(() => {
            if (g < targetG) {
              g += 3;
              setGrowthScore(Math.min(targetG, g));
            } else clearInterval(gInt);
          }, 30);

          let o = 0;
          const targetO = opportunities.length || 3;
          const oInt = setInterval(() => {
            if (o < targetO) {
              o += 1;
              setOpportunitiesCount(o);
            } else clearInterval(oInt);
          }, 200);

          let p = 0;
          const pInt = setInterval(() => {
            if (p < totalOppVal) {
              p += 1200;
              setPotentialRevenue(Math.min(totalOppVal, p));
            } else clearInterval(pInt);
          }, 30);
        }
      }, 550);

      return () => clearInterval(interval);
    }
  }, [step, totalTxns, totalOppVal, overview, opportunities]);

  const handleEnterCommandCenter = () => {
    setIsExpanding(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 450);
  };

  const stepsList = [
    { num: 1, name: 'Business' },
    { num: 2, name: 'Data' },
    { num: 3, name: 'Customers' },
    { num: 4, name: 'Twin' }
  ];

  return (
    <div className={`min-h-screen bg-canvas text-primaryText flex items-center justify-center p-4 lg:p-8 font-sans relative transition-all duration-500 ${isExpanding ? 'scale-105 opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 backdrop-grid pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[20%] w-[450px] h-[450px] rounded-full glow-radial-blue pointer-events-none -z-10" />

      <div className="w-full max-w-3xl rounded-3xl bg-white border border-[#E5EAF2] shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-8 sm:p-12 space-y-8">

        {/* Step Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF2] pb-6">
          <div className="flex items-center gap-3">
            <TwinoraLogo className="w-8 h-8" active={true} />
            <span className="font-sans font-extrabold text-[17px] text-[#0B1220] tracking-tight">
              Twinora <span className="text-[#4F46E5]">AI</span> Setup
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            {stepsList.map((s, idx) => {
              const isPast = step > s.num;
              const isCurrent = step === s.num;
              return (
                <React.Fragment key={s.num}>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${isPast
                      ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]'
                      : isCurrent
                        ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] font-bold shadow-xs'
                        : 'bg-slate-100 text-[#94A3B8] border border-transparent'
                    }`}>
                    {isPast ? (
                      <Check className="w-3 h-3 text-[#16A34A] stroke-[3]" />
                    ) : (
                      <span>0{s.num}</span>
                    )}
                    <span className="font-sans font-semibold">{s.name}</span>
                  </div>
                  {idx < stepsList.length - 1 && (
                    <span className="text-slate-300">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* STEP 1: BUSINESS PROFILE */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-[22px] font-bold font-sans text-[#0B1220]">Store & Business Profile</h2>
              <p className="text-[14px] text-[#475569]">Twinora uses industry benchmarks to tune customer elasticity models.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#475569] block">Store / Brand Name</label>
                <input
                  type="text"
                  value={profile.businessName}
                  onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E5EAF2] rounded-xl px-4 py-3 text-[14px] text-[#0B1220] font-medium focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#475569] block">Industry Category</label>
                <select
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E5EAF2] rounded-xl px-4 py-3 text-[14px] text-[#0B1220] font-medium focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
                >
                  <option>D2C Retail & Electronics</option>
                  <option>Apparel & Fashion</option>
                  <option>Beauty & Personal Care</option>
                  <option>SaaS & Subscriptions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#475569] block">Business Model</label>
                <input
                  type="text"
                  value={profile.businessType}
                  onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E5EAF2] rounded-xl px-4 py-3 text-[14px] text-[#0B1220] font-medium focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#475569] block">Operating Currency</label>
                <input
                  type="text"
                  value={profile.country}
                  onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E5EAF2] rounded-xl px-4 py-3 text-[14px] text-[#0B1220] font-medium focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="btn-primary w-full !h-[48px] !rounded-xl text-[14px] font-semibold"
            >
              <span>Continue to Data Integration →</span>
            </button>
          </div>
        )}

        {/* STEP 2: CONNECT COMMERCE DATA */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-[22px] font-bold font-sans text-[#0B1220]">Connect Commerce Data Source</h2>
              <p className="text-[14px] text-[#475569]">Select how Twinora will ingest transaction history.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setDataOption('demo')}
                className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${dataOption === 'demo'
                    ? 'bg-[#EEF2FF] border-2 border-[#4F46E5] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E5EAF2] hover:bg-white hover:border-[#CBD5E1]'
                  }`}
              >
                <div className="p-2.5 rounded-xl bg-white text-[#4F46E5] w-fit font-bold border border-[#E5EAF2] shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0B1220] font-sans">Use Store Database</h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed font-sans">Pre-connected with {totalTxns} transaction records.</p>
              </button>

              <button
                onClick={() => setDataOption('razorpay')}
                className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${dataOption === 'razorpay'
                    ? 'bg-[#EEF2FF] border-2 border-[#4F46E5] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E5EAF2] hover:bg-white hover:border-[#CBD5E1]'
                  }`}
              >
                <div className="p-2.5 rounded-xl bg-white text-[#0891B2] w-fit font-bold border border-[#E5EAF2] shadow-xs">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0B1220] font-sans">Connect Razorpay</h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed font-sans">Read-only OAuth integration to fetch gateway telemetry.</p>
              </button>

              <button
                onClick={() => setDataOption('csv')}
                className={`p-5 rounded-2xl border text-left space-y-3 transition-all ${dataOption === 'csv'
                    ? 'bg-[#EEF2FF] border-2 border-[#4F46E5] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E5EAF2] hover:bg-white hover:border-[#CBD5E1]'
                  }`}
              >
                <div className="p-2.5 rounded-xl bg-white text-[#475569] w-fit font-bold border border-[#E5EAF2] shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0B1220] font-sans">Upload CSV Dataset</h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed font-sans">Import custom customer and order CSV files.</p>
              </button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary !h-[48px] px-6 !rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-primary flex-1 !h-[48px] !rounded-xl font-semibold text-[14px]"
              >
                <span>Continue to Customer Mapping →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMER COHORTS */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-[22px] font-bold font-sans text-[#0B1220]">Customer Behavioral Cohorts</h2>
              <p className="text-[14px] text-[#475569]">Reviewing RFM recency, frequency, and churn probability parameters.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] space-y-4">
              <div className="flex items-center justify-between text-[13px] font-mono text-[#475569]">
                <span className="font-sans font-medium">Total Detected Customer Accounts</span>
                <span className="text-[#0B1220] font-bold text-[16px]">
                  {overview ? overview.uniqueCustomersCount.toLocaleString('en-IN') : '948'} Profiles
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[12px] text-center">
                {cohorts.map(c => (
                  <div key={c.id} className="p-3.5 bg-white border border-[#E5EAF2] rounded-xl shadow-xs">
                    <span className="font-bold block text-[14px]" style={{ color: c.color }}>
                      {c.count} {c.label}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-sans">Churn {c.churn}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setStep(2)}
                className="btn-secondary !h-[48px] px-6 !rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="btn-primary flex-1 !h-[48px] !rounded-xl font-semibold text-[14px]"
              >
                <span>Construct Twinora AI Model →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MODEL ASSEMBLY & TWIN READY */}
        {step === 4 && (
          <div className="py-6 space-y-8 text-center animate-fade-in">
            {!isDone ? (
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                  <div className="w-24 h-24 bg-[#EEF2FF] rounded-2xl flex items-center justify-center border border-[#C7D2FE] shadow-[0_8px_25px_rgba(79,70,229,0.18)]">
                    <Sparkles className="w-12 h-12 text-[#4F46E5] animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-[22px] font-bold font-sans text-[#0B1220]">Building Your Twinora AI Model...</h2>
                  <p className="text-[13px] font-mono text-[#4F46E5] font-semibold animate-pulse">{currentLogText}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#4F46E5] to-[#0891B2] rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                  <span className="text-[12px] font-mono text-[#64748B] font-medium">{trainingProgress}% Complete</span>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A] mx-auto shadow-xs">
                  <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-[28px] font-extrabold font-sans text-[#0B1220]">Your Twin is Ready.</h2>
                  <p className="text-[14px] text-[#475569]">
                    Initial business intelligence vector generated successfully for <strong className="text-[#0B1220]">{profile.businessName}</strong>.
                  </p>
                </div>

                {/* Summary Metrics with Live Counter Animation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto font-mono">
                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] text-center space-y-1">
                    <span className="text-[11px] text-[#64748B] font-medium block font-sans">Growth Health</span>
                    <span className="text-[26px] font-bold text-[#16A34A] font-sans">{growthScore} / 100</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] text-center space-y-1">
                    <span className="text-[11px] text-[#64748B] font-medium block font-sans">Opportunities</span>
                    <span className="text-[26px] font-bold text-[#4F46E5] font-sans">{opportunitiesCount} Active</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2] text-center space-y-1">
                    <span className="text-[11px] text-[#64748B] font-medium block font-sans">Potential Recovery</span>
                    <span className="text-[26px] font-bold text-[#0B1220] font-sans">₹{potentialRevenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleEnterCommandCenter}
                  className="btn-primary w-full max-w-md !h-[52px] !rounded-xl mx-auto text-[15px] font-semibold flex items-center justify-center gap-2"
                >
                  <span>Enter Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
