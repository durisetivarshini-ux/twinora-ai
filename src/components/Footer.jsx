import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, ArrowUpRight } from 'lucide-react';
import TwinoraLogo from './TwinoraLogo';

export default function Footer() {
  return (
    <footer className="bg-[#F2F6FB] border-t border-[#E2E8F0] text-[#475569] font-sans">
      <div className="max-w-7xl mx-auto px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <TwinoraLogo className="w-8 h-8" active={true} />
              <span className="font-sans font-extrabold text-[20px] text-[#0F172A] tracking-tight">
                Twinora <span className="text-[#4F46E5] font-bold">AI</span>
              </span>
            </Link>
            <p className="text-[14px] text-[#64748B] leading-relaxed max-w-sm">
              Continuous AI business simulation, opportunity detection, and decision intelligence. See tomorrow before you decide.
            </p>
            <div className="flex items-center gap-4 text-[12px] font-mono text-[#64748B] pt-2">
              <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
                <Shield className="w-3.5 h-3.5" /> SOC-2 Type II
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#0F172A] font-semibold">
                <Lock className="w-3.5 h-3.5 text-[#4F46E5]" /> 256-bit AES
              </span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold font-mono text-[#0F172A] uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/twin" className="hover:text-[#4F46E5] transition-colors">Digital Twin Mesh</Link></li>
              <li><Link to="/simulate" className="hover:text-[#4F46E5] transition-colors">Simulation Lab</Link></li>
              <li><Link to="/opportunities" className="hover:text-[#4F46E5] transition-colors">Opportunity Radar</Link></li>
              <li><Link to="/agents" className="hover:text-[#4F46E5] transition-colors">AI Agents Room</Link></li>
              <li><Link to="/analytics" className="hover:text-[#4F46E5] transition-colors">Analytics Pulse</Link></li>
            </ul>
          </div>

          {/* Col 3: Integrations */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold font-mono text-[#0F172A] uppercase tracking-wider">Integrations</h4>
            <ul className="space-y-2 text-[13px]">
              <li><span className="text-[#64748B]">Shopify Connect</span></li>
              <li><span className="text-[#64748B]">Razorpay Sync</span></li>
              <li><span className="text-[#64748B]">Stripe Billing</span></li>
              <li><span className="text-[#64748B]">WooCommerce API</span></li>
              <li><span className="text-[#64748B]">Custom Webhooks</span></li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold font-mono text-[#0F172A] uppercase tracking-wider">Trust & Security</h4>
            <ul className="space-y-2 text-[13px]">
              <li><a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#4F46E5] transition-colors">Privacy Architecture</a></li>
              <li><a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#4F46E5] transition-colors">Terms of Simulation</a></li>
              <li><a href="#compliance" onClick={(e) => e.preventDefault()} className="hover:text-[#4F46E5] transition-colors">Enterprise Compliance</a></li>
              <li><a href="#status" onClick={(e) => e.preventDefault()} className="hover:text-[#4F46E5] transition-colors flex items-center gap-1">System Status <ArrowUpRight className="w-3 h-3 text-[#16A34A]" /></a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#64748B] font-mono gap-3">
          <div>
            © 2026 Twinora AI Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Built for Modern Commerce</span>
            <span>Version 4.2 Light</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
