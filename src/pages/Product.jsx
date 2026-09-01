import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import TwinoraLogo from '../components/TwinoraLogo';

export default function Product() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 space-y-20 font-sans relative">
      <div className="absolute inset-0 backdrop-grid pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[12px] font-mono font-bold text-[#4F46E5] uppercase tracking-wider">
          ARCHITECTURE & CAPABILITIES
        </span>
        <h1 className="text-page font-sans font-extrabold text-[#0F172A] tracking-tight">
          The Twinora AI Engine Architecture
        </h1>
        <p className="text-[16px] text-[#475569]">
          A high-performance decision intelligence platform built for modern merchants.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-[14px] bg-white border border-[#E2E8F0] space-y-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-bold text-[#0F172A]">Digital Twin Core</h3>
          <p className="text-[14px] text-[#475569] leading-relaxed">
            Constructs a real-time vector representation of merchant cashflow, customer elasticity, order frequency, and inventory margins.
          </p>
        </div>

        <div className="p-8 rounded-[14px] bg-white border border-[#E2E8F0] space-y-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-bold text-[#0F172A]">Agentic Orchestrator</h3>
          <p className="text-[14px] text-[#475569] leading-relaxed">
            Four specialized AI agents collaborate continuously to detect growth leaks, model scenario risk, and draft executable campaigns.
          </p>
        </div>

        <div className="p-8 rounded-[14px] bg-white border border-[#E2E8F0] space-y-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center justify-center text-[#0891B2] font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-[18px] font-bold text-[#0F172A]">Fintech Security</h3>
          <p className="text-[14px] text-[#475569] leading-relaxed">
            Bank-grade AES-256 encryption at rest and in transit. Read-only API scope ensures your storefront integration is safe.
          </p>
        </div>
      </div>

      {/* Integration Ecosystem */}
      <div className="p-10 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-8 shadow-sm">
        <div className="flex justify-center">
          <TwinoraLogo className="w-16 h-16" active={true} />
        </div>
        <h2 className="text-[22px] font-bold text-[#0F172A] text-center">Seamless Commerce Integration Ecosystem</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {['Razorpay Payments', 'Shopify Storefront', 'WhatsApp Business', 'WooCommerce', 'Stripe Global', 'Custom Webhooks', 'Meta Ads Manager', 'Google Analytics 4'].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] flex items-center justify-center gap-2 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-6 pt-10">
        <h2 className="text-[24px] font-bold text-[#0F172A]">Ready to model your business?</h2>
        <Link to="/signup" className="btn-primary inline-flex !h-[50px] !px-8 text-[15px] font-sans">
          <span>Build Your Twin Today</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
