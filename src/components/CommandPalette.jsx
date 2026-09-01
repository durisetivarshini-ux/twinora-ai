import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  FlaskConical, 
  Radar, 
  Users, 
  Bot, 
  Sparkles, 
  Network, 
  HelpCircle, 
  Zap, 
  BarChart3,
  X,
  ArrowRight,
  Package,
  FileText,
  Clock,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onOpenCopilot, onOpenAskWhy, onOpenPriorityPlan }) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const commands = [
    // Pages
    { id: 'p-dash', title: 'Command Center (Dashboard)', category: 'Pages', icon: BarChart3, badge: 'Overview', action: () => { navigate('/dashboard'); onClose(); } },
    { id: 'p-twin', title: 'Living Digital Twin Mesh', category: 'Pages', icon: Network, badge: 'Model', action: () => { navigate('/twin'); onClose(); } },
    { id: 'p-opp', title: 'Opportunity Radar', category: 'Pages', icon: Radar, badge: 'Intelligence', action: () => { navigate('/opportunities'); onClose(); } },
    { id: 'p-cust', title: 'Customer Behavioral Landscape', category: 'Pages', icon: Users, badge: 'Cohorts', action: () => { navigate('/customers'); onClose(); } },
    { id: 'p-sim', title: 'Simulation Decision Lab', category: 'Pages', icon: FlaskConical, badge: 'Sandbox', action: () => { navigate('/simulate'); onClose(); } },
    { id: 'p-act', title: 'Actions & Execution Pipeline', category: 'Pages', icon: Workflow, badge: 'Dispatch', action: () => { navigate('/actions'); onClose(); } },
    { id: 'p-agent', title: 'AI Agents Control Room', category: 'Pages', icon: Bot, badge: 'Automation', action: () => { navigate('/agents'); onClose(); } },
    { id: 'p-analytics', title: 'Evidence & Financial Analytics', category: 'Pages', icon: BarChart3, badge: 'Metrics', action: () => { navigate('/analytics'); onClose(); } },
    { id: 'p-settings', title: 'Data Connections & Settings', category: 'Pages', icon: Zap, badge: 'Config', action: () => { navigate('/settings'); onClose(); } },
    { id: 'p-profile', title: 'Operator Profile & Credentials', category: 'Pages', icon: Users, badge: 'Account', action: () => { navigate('/profile'); onClose(); } },

    // Cohorts & Customers
    { id: 'c-dormant', title: 'Dormant VIP Customers (32 accounts at 84% churn)', category: 'Cohorts', icon: Users, badge: 'Critical Risk', action: () => { navigate('/customers?cohort=dormant'); onClose(); } },
    { id: 'c-champions', title: 'Champions & High-Frequency VIP Cohort', category: 'Cohorts', icon: Users, badge: '42 Accounts', action: () => { navigate('/customers?cohort=champions'); onClose(); } },
    { id: 'c-atrisk', title: 'At-Risk Accounts (Exceeded 32-day cycle)', category: 'Cohorts', icon: Users, badge: '71 Accounts', action: () => { navigate('/customers?cohort=at-risk'); onClose(); } },

    // Opportunities
    { id: 'o-winback', title: 'Retention: 15% Comeback Broadcast to Dormant VIPs (+₹28.4K)', category: 'Opportunities', icon: Radar, badge: 'High Impact', action: () => { navigate('/opportunities'); onClose(); } },
    { id: 'o-bundle', title: 'AOV Expansion: SonicBuds + Leather Case Cross-Sell (+₹19.5K)', category: 'Opportunities', icon: Radar, badge: 'Cross-Sell', action: () => { navigate('/opportunities'); onClose(); } },
    { id: 'o-gateway', title: 'Payment Reliability: High-Volume UPI Telemetry Audit (+₹9.2K)', category: 'Opportunities', icon: Radar, badge: 'Gateway', action: () => { navigate('/analytics'); onClose(); } },

    // Simulations
    { id: 's-comeback', title: 'Simulate: 15% Incentive on 32 Dormant VIP Accounts', category: 'Simulations', icon: FlaskConical, badge: 'SIM-203', action: () => { navigate('/simulate?preset=comeback-15'); onClose(); } },
    { id: 's-price', title: 'Simulate: +5% Product Margin Price Shift', category: 'Simulations', icon: FlaskConical, badge: 'Elasticity', action: () => { navigate('/simulate?preset=price-shift-5'); onClose(); } },
    { id: 's-compare', title: 'Decision Compare: Current Path vs Strategy A vs Strategy B', category: 'Simulations', icon: FlaskConical, badge: 'Compare Mode', action: () => { navigate('/simulate?mode=compare'); onClose(); } },

    // Products
    { id: 'pr-buds', title: 'SonicBuds Pro Wireless Earbuds (Top Revenue Driver: ₹2,499)', category: 'Products', icon: Package, badge: '142 in stock', action: () => { navigate('/analytics'); onClose(); } },
    { id: 'pr-dock', title: 'MagCharge 3-in-1 Wireless Fast Dock (₹3,199)', category: 'Products', icon: Package, badge: '88 in stock', action: () => { navigate('/analytics'); onClose(); } },

    // Actions & AI Copilot
    { id: 'a-plan', title: 'Action Plan AP-904 (Awaiting Approval)', category: 'Actions', icon: Zap, badge: 'Ready to Dispatch', action: () => { navigate('/actions'); onClose(); } },
    { id: 'a-copilot', title: 'Ask Twinora: Why did revenue decrease?', category: 'Ask Twinora', icon: Sparkles, badge: 'AI Copilot', action: () => { onOpenCopilot?.(); onClose(); } },
    { id: 'a-why', title: 'Diagnostic: Root Cause Analysis (Ask Why)', category: 'Ask Twinora', icon: HelpCircle, badge: 'Diagnostic', action: () => { onOpenAskWhy?.(); onClose(); } },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase()) ||
    (cmd.badge && cmd.badge.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 font-sans" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_25px_60px_rgba(15,23,42,0.2)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-[#E2E8F0] bg-white">
          <Search className="w-4.5 h-4.5 text-[#4F52E8] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages, customers, cohorts, opportunities, simulations, products…"
            className="w-full bg-transparent py-3.5 text-[14px] text-[#0E1117] font-medium placeholder-[#9BA3B0] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-[#9BA3B0] hover:text-[#0E1117] rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected ? 'bg-[#EEF0FF] text-[#4F52E8]' : 'text-[#374151] hover:bg-[#F8F9FC]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                      isSelected ? 'bg-white text-[#4F52E8] shadow-xs' : 'bg-[#F4F5F9] text-[#9BA3B0]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[13px] font-semibold truncate ${isSelected ? 'text-[#4F52E8]' : 'text-[#0E1117]'}`}>
                        {cmd.title}
                      </p>
                      <span className="text-[10.5px] font-medium text-[#9BA3B0] uppercase tracking-wider">{cmd.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {cmd.badge && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        isSelected ? 'bg-white text-[#4F52E8] border-[#C7CAFF]' : 'bg-[#F8F9FC] text-[#6B7280] border-[#E4E7ED]'
                      }`}>
                        {cmd.badge}
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#4F52E8] translate-x-0.5' : 'text-[#D4D9E3]'}`} />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-[#9BA3B0] text-[13px]">
              No matching commands or entities found for "<strong className="text-[#0E1117]">{search}</strong>"
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#F8F9FC] border-t border-[#E4E7ED] flex items-center justify-between text-[11px] text-[#9BA3B0] font-medium">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="px-1.5 py-0.5 bg-white border border-[#E4E7ED] rounded font-mono text-[10px] text-[#0E1117]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-[#E4E7ED] rounded font-mono text-[10px] text-[#0E1117]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-[#E4E7ED] rounded font-mono text-[10px] text-[#0E1117]">↵</kbd> to select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 bg-white border border-[#E4E7ED] rounded font-mono text-[10px] text-[#0E1117]">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
