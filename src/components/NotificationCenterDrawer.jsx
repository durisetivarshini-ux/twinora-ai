import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  Sparkles, 
  AlertTriangle, 
  FlaskConical, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown,
  Clock
} from 'lucide-react';

export default function NotificationCenterDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('ALL');

  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      category: 'SIGNALS',
      title: 'Revenue Leakage Signal Isolated',
      desc: '43 high-value VIP accounts showed zero transactions in the last 45+ days.',
      time: '12m ago',
      unread: true,
      route: '/opportunities',
      icon: TrendingDown,
      color: '#DC2626',
      badgeBg: 'bg-red-50 text-[#DC2626] border-red-200'
    },
    {
      id: 'notif-2',
      category: 'SIMULATION',
      title: 'Monte Carlo Simulation #SIM-203 Converged',
      desc: '15% Comeback Discount on Inactive VIPs predicts +₹18,400 net revenue uplift.',
      time: '34m ago',
      unread: true,
      route: '/simulate?preset=scen-inactive-15',
      icon: FlaskConical,
      color: '#4F46E5',
      badgeBg: 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]'
    },
    {
      id: 'notif-3',
      category: 'ALERTS',
      title: 'Retention Health Velocity Slipped Below Target',
      desc: 'Repeat customer velocity dipped to 72.4% (Threshold: 75.0%).',
      time: '1h ago',
      unread: false,
      route: '/customers',
      icon: AlertTriangle,
      color: '#D97706',
      badgeBg: 'bg-amber-50 text-[#D97706] border-amber-200'
    },
    {
      id: 'notif-4',
      category: 'ACTIONS',
      title: 'Action Plan Ready For Dispatch',
      desc: 'Personalized recovery vouchers crafted for dormant customer accounts.',
      time: '2h ago',
      unread: false,
      route: '/actions',
      icon: Zap,
      color: '#16A34A',
      badgeBg: 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]'
    }
  ];

  const categories = ['ALL', 'SIGNALS', 'SIMULATION', 'ALERTS', 'ACTIONS'];

  const filtered = notifications.filter(n => 
    activeCategory === 'ALL' ? true : n.category === activeCategory
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-[#E2E8F0] shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="h-16 px-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5]">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-[14px] text-[#0F172A]">Notification Center</h3>
            <span className="text-[11px] text-[#64748B] font-mono">Twin Telemetry Alerts</span>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="p-1.5 text-slate-400 hover:text-[#0F172A] rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="p-3 border-b border-[#E2E8F0] bg-white flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#4F46E5] text-white'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]/50">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => {
                navigate(item.route);
                onClose();
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 group ${
                item.unread
                  ? 'bg-white border-[#C7D2FE] shadow-card hover:border-[#4F46E5]'
                  : 'bg-white/80 border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border ${item.badgeBg}`}>
                    {item.category}
                  </span>
                  {item.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                  )}
                </div>
                <span className="text-[10.5px] font-mono text-[#94A3B8] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.time}
                </span>
              </div>

              <div>
                <h4 className="text-[13.5px] font-bold text-[#0F172A] group-hover:text-[#4F46E5] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-1.5 flex items-center justify-between text-[11px] font-mono text-[#4F46E5] font-semibold border-t border-[#E2E8F0]/60">
                <span>View in workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3.5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-[11.5px] font-mono text-[#64748B]">
        <span>All signals live</span>
        <button 
          onClick={onClose}
          className="text-[#4F46E5] font-bold hover:underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
