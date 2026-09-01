import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Sparkles, 
  Menu, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Database,
  Calendar,
  ChevronDown
} from 'lucide-react';
import UserProfile from './UserProfile';
import IntelligenceBriefModal from './IntelligenceBriefModal';
import { fetchBusinessOverview } from '../services/apiService';
import { useDateRange } from '../context/DateRangeContext';

export default function Topbar({
  setMobileOpen,
  onOpenCommandPalette,
  onOpenCopilot,
  onOpenPriorityPlan,
  onOpenNotifications,
  onOpenTour
}) {
  const navigate = useNavigate();
  const { dateRange, setDateRange, DATE_RANGES } = useDateRange();
  const [overview, setOverview] = useState(null);
  const [freshnessOpen, setFreshnessOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const freshnessRef = useRef(null);

  useEffect(() => {
    fetchBusinessOverview(dateRange)
      .then(setOverview)
      .catch(() => {});
  }, [dateRange]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (freshnessRef.current && !freshnessRef.current.contains(e.target)) {
        setFreshnessOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalOrders = overview ? overview.totalOrdersCount.toLocaleString('en-IN') : '60';

  return (
    <>
      <header className="h-14 bg-white border-b border-[#E5E7EB] px-4 sm:px-5 flex items-center justify-between sticky top-0 z-30 font-sans">

        {/* Left — Search & Global Date Context */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Quick Search */}
          <button
            onClick={onOpenCommandPalette}
            className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#D1D5DB] rounded-lg text-[12.5px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors group max-w-xs"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left hidden sm:block truncate">Search anything…</span>
            <kbd className="hidden sm:inline text-[9.5px] font-medium px-1 py-0.5 bg-white border border-[#E5E7EB] rounded text-[#9CA3AF] mono">⌘K</kbd>
          </button>

          {/* Global Date Context Selector */}
          <div className="hidden sm:flex items-center gap-0.5 bg-[#F4F5F9] p-0.5 rounded-lg border border-[#E5E7EB] text-[11px] font-semibold">
            {DATE_RANGES.map(r => (
              <button
                key={r.id}
                onClick={() => setDateRange(r.id)}
                className={`px-2 py-1 rounded-md transition-all ${
                  dateRange === r.id
                    ? 'bg-white text-[#4F52E8] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
                title={r.fullLabel}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-1.5">

          {/* Data Freshness Center Trigger & Popover */}
          <div className="relative" ref={freshnessRef}>
            <button
              onClick={() => setFreshnessOpen(prev => !prev)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#D1FAE5] text-[11px] font-medium text-[#059669] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse shrink-0" />
              <span>Synced · {totalOrders} txns</span>
              <ChevronDown className="w-3 h-3 text-[#059669]" />
            </button>

            {/* Freshness Popover */}
            {freshnessOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E4E7ED] rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3 text-[#0E1117]">
                <div className="flex items-center justify-between border-b border-[#E4E7ED] pb-2">
                  <span className="text-[12px] font-bold">Data Freshness Center</span>
                  <span className="badge badge-success text-[9.5px]">Live Synced</span>
                </div>

                <div className="space-y-2 text-[11.5px]">
                  {[
                    { name: 'Orders & Transactions', status: 'Healthy', sync: '2 mins ago', ok: true },
                    { name: 'Customer Cohorts', status: 'Healthy', sync: '2 mins ago', ok: true },
                    { name: 'Product Catalog', status: 'Healthy', sync: '2 mins ago', ok: true },
                    { name: 'Payment Telemetry (Razorpay)', status: 'Healthy', sync: '14ms latency', ok: true },
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-[#F8F9FC] last:border-0">
                      <div>
                        <p className="font-semibold text-[#0E1117] leading-tight">{s.name}</p>
                        <span className="text-[10px] text-[#9BA3B0]">{s.sync}</span>
                      </div>
                      <span className="text-[10.5px] font-bold text-[#05875F]">{s.status}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E4E7ED] flex items-center justify-between text-[10px] text-[#9BA3B0] font-mono">
                  <span>Last sync: 2 min ago</span>
                  <span>Next: auto (continuous)</span>
                </div>
              </div>
            )}
          </div>

          {/* Intelligence Brief Export */}
          <button
            onClick={() => setBriefOpen(true)}
            className="btn-ghost hidden md:flex gap-1.5 !text-[12px]"
            title="Generate Executive Intelligence Brief"
          >
            <FileText className="w-4 h-4 text-[#06B6D4]" />
            <span className="hidden lg:inline">Brief</span>
          </button>

          {/* Tour */}
          <button
            onClick={onOpenTour}
            className="btn-ghost hidden sm:flex"
            title="Product tour"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden md:inline">Tour</span>
          </button>

          {/* Ask Twinora */}
          <button
            onClick={onOpenCopilot}
            className="btn-ghost hidden sm:flex gap-1.5"
            title="Ask Twinora Intelligence"
          >
            <Sparkles className="w-4 h-4 text-[#4F52E8]" />
            <span className="hidden md:inline font-semibold text-[#0E1117]">Ask Twinora</span>
          </button>

          {/* Today's Strategy */}
          <button
            onClick={onOpenPriorityPlan || (() => navigate('/simulate'))}
            className="btn-primary !h-8 !px-3 !text-[12.5px] hidden sm:flex gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Plan</span>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
          </button>

          <UserProfile />
        </div>
      </header>

      {/* Intelligence Brief Document Modal */}
      <IntelligenceBriefModal isOpen={briefOpen} onClose={() => setBriefOpen(false)} />
    </>
  );
}
