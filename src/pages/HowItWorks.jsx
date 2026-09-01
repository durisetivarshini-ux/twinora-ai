import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'CONNECT',
      subtitle: 'Ingest Commerce Data',
      desc: 'Twinora connects securely to your payment gateway (Razorpay) and storefront (Shopify) via read-only APIs or CSV file uploads.',
      detail: 'Maps historical transactions, customer retention cohorts, refund rates, and SKU gross margins automatically.'
    },
    {
      title: 'UNDERSTAND',
      subtitle: 'Build Digital Twin Model',
      desc: 'The platform builds an active vector representation of your store’s financial mechanics and customer behavioral elasticity.',
      detail: 'Computes continuous baseline metrics for Revenue Velocity, RFM segments, and Price Sensitivity.'
    },
    {
      title: 'DISCOVER',
      subtitle: 'Identify Anomalies & Opportunities',
      desc: 'Growth & Customer Agents continuously scan transactions to uncover revenue leaks and underperforming segments.',
      detail: 'Example: Detects 43 inactive VIP customers with ₹18.4K potential revenue recovery.'
    },
    {
      title: 'SIMULATE',
      subtitle: 'Run Monte Carlo Risk Testing',
      desc: 'Test discounts, price increases, bundles, or promo campaigns in a virtual sandbox without risking real money or margins.',
      detail: 'Simulation Agent calculates projected revenue impact, order count delta, conversion changes, and confidence scores.'
    },
    {
      title: 'DECIDE',
      subtitle: 'Compare & Select Optimal Strategy',
      desc: 'Compare multiple simulated options side-by-side on predicted net profit, customer retention impact, and margin risk.',
      detail: 'AI recommends the single best strategy with clear rationale (e.g. Product Bundle over pure 15% discount).'
    },
    {
      title: 'EXECUTE',
      subtitle: 'Turn Into Action Plan',
      desc: 'Approve the recommendation to let the Action Agent generate executable discount codes and targeted broadcasts.',
      detail: 'Monitors real-world performance against simulated predictions for continuous machine learning.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 space-y-16 font-sans relative">
      <div className="absolute inset-0 backdrop-grid pointer-events-none -z-10" />

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[12px] font-mono font-bold text-[#4F46E5] uppercase tracking-wider">
          STEP-BY-STEP WALKTHROUGH
        </span>
        <h1 className="text-page font-sans font-extrabold text-[#0F172A] tracking-tight">
          How Twinora AI Operates
        </h1>
        <p className="text-[16px] text-[#475569]">
          From data ingestion to simulated decision-making and automated execution.
        </p>
      </div>

      {/* Pipeline Navigation Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeStep === idx
                ? 'bg-[#EEF2FF] border-2 border-[#4F46E5] shadow-sm text-[#0F172A] font-semibold'
                : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
            }`}
          >
            <span className="text-[10px] font-mono block text-[#4F46E5] font-bold">0{idx + 1}</span>
            <span className="text-[12px] font-bold uppercase">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Active Step Showcase */}
      <div className="p-8 sm:p-12 rounded-[14px] bg-white border border-[#E2E8F0] shadow-[0_8px_30px_rgba(15,23,42,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[12px] font-mono text-[#4F46E5] font-semibold">
            <span>Step 0{activeStep + 1} of 06</span>
          </div>

          <h2 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
            {steps[activeStep].title}: <span className="text-[#4F46E5]">{steps[activeStep].subtitle}</span>
          </h2>

          <p className="text-[15px] text-[#475569] leading-relaxed">
            {steps[activeStep].desc}
          </p>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#475569] leading-relaxed font-mono">
            💡 <strong>Technical Detail:</strong> {steps[activeStep].detail}
          </div>

          <div className="flex items-center gap-4 pt-2">
            {activeStep < steps.length - 1 && (
              <button
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="btn-primary !h-[44px] text-[13px]"
              >
                <span>Next Step ({steps[activeStep + 1].title})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <Link to="/signup" className="btn-secondary !h-[44px] text-[13px]">
              Try Interactive Setup
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4 font-mono text-[12px]">
          <div className="flex items-center justify-between text-[#64748B] border-b border-[#E2E8F0] pb-3">
            <span>PIPELINE ENGINE MONITOR</span>
            <span className="text-[#16A34A] font-bold">STATUS: ACTIVE</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] shadow-2xs">
              ✓ 3,482 Transactions ingesting via SSL
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] shadow-2xs">
              ✓ Customer RFM elasticity matrices calculated
            </div>
            <div className="p-3 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#4F46E5] font-bold">
              ➜ Agent pipeline focused on step 0{activeStep + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
