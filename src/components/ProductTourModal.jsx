import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Check, 
  Layers, 
  Activity, 
  FlaskConical, 
  Zap, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import TwinoraLogo from './TwinoraLogo';

export default function ProductTourModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      badge: 'STEP 01 OF 04',
      title: 'Your Living Digital Twin',
      subtitle: 'An interactive vector mesh modeling your complete business',
      desc: 'Twinora creates a real-time living model across Revenue, Customer Cohorts, Products, and Payment Latency. Every transaction constantly recalibrates your model.',
      icon: Layers,
      color: '#4F46E5',
      metric: '6 Dimensions Modeled'
    },
    {
      badge: 'STEP 02 OF 04',
      title: 'Autonomous Business Signals',
      subtitle: 'Detecting revenue leaks before they become permanent',
      desc: 'Our intelligence agents continuously audit RFM customer elasticity, identifying at-risk accounts, churn vectors, and unrealized bundling upside automatically.',
      icon: Activity,
      color: '#06B6D4',
      metric: '3 Prioritized Signals'
    },
    {
      badge: 'STEP 03 OF 04',
      title: 'Monte Carlo Simulation Lab',
      subtitle: 'Test "What if?" decisions in a zero-risk sandbox',
      desc: 'Adjust discounts, pricing shifts, and cohort targeting. Twinora executes 10,000 Monte Carlo iterations to forecast exact revenue delta, cannibalization risk, and confidence.',
      icon: FlaskConical,
      color: '#2563EB',
      metric: '10,000 Iteration Sandbox'
    },
    {
      badge: 'STEP 04 OF 04',
      title: 'Action Plans & Decision Memory',
      subtitle: 'Execute high-conviction moves & track model accuracy',
      desc: 'Convert any simulated strategy into an executable campaign. Twinora tracks the actual outcome over 14 days and logs prediction accuracy into Decision Memory.',
      icon: Zap,
      color: '#16A34A',
      metric: '93.7% Model Calibration'
    }
  ];

  const stepData = tourSteps[currentStep];
  const Icon = stepData.icon;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      localStorage.setItem('twinora_tour_completed', 'true');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-elevated overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <TwinoraLogo className="w-6 h-6" active />
            <span className="font-extrabold text-[14px] text-[#0F172A]">Twinora AI Product Tour</span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-[#0F172A] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE]">
              {stepData.badge}
            </span>
            <span className="text-[11px] font-mono text-[#16A34A] font-bold bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#DCFCE7]">
              {stepData.metric}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
              style={{ backgroundColor: `${stepData.color}15`, color: stepData.color }}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-[18px] font-extrabold text-[#0F172A] tracking-tight">
                {stepData.title}
              </h3>
              <p className="text-[12.5px] font-semibold text-[#4F46E5]">
                {stepData.subtitle}
              </p>
            </div>
          </div>

          <p className="text-[13.5px] text-[#475569] leading-relaxed">
            {stepData.desc}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-1.5">
              {tourSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-6 bg-[#4F46E5]'
                      : 'w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="btn-primary !h-[40px] px-5 text-[13px] font-semibold"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Start Exploring Twinora →' : 'Next Step →'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
