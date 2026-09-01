import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import TwinoraLogo from './TwinoraLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'How It Works', to: '/how-it-works' },
    { name: 'Product', to: '/product' },
    { name: 'Digital Twin', to: '/twin' },
    { name: 'Simulation', to: '/simulate' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans">
      <nav className={`mx-auto max-w-6xl mt-3 mx-4 sm:mx-6 lg:mx-auto flex items-center justify-between px-5 rounded-[14px] transition-all duration-200 ${
        scrolled
          ? 'h-[56px] bg-white/95 backdrop-blur-lg border border-[#E2E8F0] shadow-card'
          : 'h-[60px] bg-white/80 backdrop-blur-sm border border-[#E2E8F0]/60'
      }`}>
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <TwinoraLogo className="w-6 h-6" active />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-[16px] text-[#0F172A] tracking-tight">
              Twinora<span className="text-[#4F46E5]"> AI</span>
            </span>
            <span className="text-[9px] font-semibold text-[#64748B] uppercase tracking-[0.08em] mt-0.5">
              Business Digital Twin
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.name}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#4F46E5] bg-[#EEF2FF]'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`
              }
            >
              {l.name}
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="hidden sm:flex items-center gap-2">
          <Link to="/login" className="px-3 py-1.5 text-[13px] font-semibold text-[#475569] hover:text-[#0F172A] transition-colors">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary !h-[36px] !px-4 !text-[13px]">
            Build Your Twin <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#475569] hover:text-[#0F172A]" aria-label="Menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[72px] left-4 right-4 bg-white border border-[#E2E8F0] rounded-[14px] p-4 shadow-elevated space-y-3 font-sans">
          {links.map((l) => (
            <Link key={l.name} to={l.to} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#4F46E5]">
              {l.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center text-[14px] font-semibold text-[#475569] py-2">Sign In</Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full !h-[42px]">Build Your Twin →</Link>
          </div>
        </div>
      )}
    </header>
  );
}
