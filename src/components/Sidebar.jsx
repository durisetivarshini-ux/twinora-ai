import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Network,
  Radar,
  UsersRound,
  FlaskConical,
  Workflow,
  Bot,
  BarChart2,
  Settings2,
  LogOut,
  X,
} from 'lucide-react';
import TwinoraLogo from './TwinoraLogo';
import { useAuth } from '../context/AuthContext';

const NAV = [
  {
    label: 'Workspace',
    items: [
      { name: 'Command Center', to: '/dashboard', icon: LayoutDashboard },
      { name: 'Digital Twin', to: '/twin', icon: Network },
      { name: 'Opportunities', to: '/opportunities', icon: Radar },
      { name: 'Customers', to: '/customers', icon: UsersRound },
    ],
  },
  {
    label: 'Simulate & Act',
    items: [
      { name: 'Simulation Lab', to: '/simulate', icon: FlaskConical },
      { name: 'Actions & Plans', to: '/actions', icon: Workflow },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'AI Agents', to: '/agents', icon: Bot },
      { name: 'Analytics', to: '/analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', to: '/settings', icon: Settings2 },
    ],
  },
];

const initials = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'OP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Sidebar({ mobileOpen = false, setMobileOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = user?.fullName || 'Business Operator';
  const displayRole = user?.role || 'Store Owner';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-[220px] bg-white border-r border-[#E5E7EB] flex flex-col z-50 transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E7EB] shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center p-1.5 group-hover:bg-[#E0E7FF] transition-colors">
              <TwinoraLogo className="w-4.5 h-4.5" active />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[14.5px] text-[#111827] tracking-tight">
                Twinora<span className="text-[#5455E7]"> AI</span>
              </span>
              <span className="text-[9px] font-medium text-[#9CA3AF] mt-0.5 tracking-wide">
                Business Intelligence
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen?.(false)}
            className="lg:hidden p-1 text-[#9CA3AF] hover:text-[#111827] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
          {NAV.map((group) => (
            <div key={group.label}>
              <p className="px-2 mb-1 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-[0.08em]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(({ name, to, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen?.(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[13px] transition-all duration-100 relative group select-none ${
                        isActive
                          ? 'bg-[#EEF2FF] text-[#4344D0] font-semibold'
                          : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] font-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#5455E7] rounded-r-full" />
                        )}
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-[#5455E7]' : 'text-[#9CA3AF] group-hover:text-[#6B7280]'
                          }`}
                          strokeWidth={isActive ? 2 : 1.75}
                        />
                        <span className="truncate">{name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-[#E5E7EB] shrink-0 space-y-1.5">
          {/* Live status */}
          <div className="px-2.5 py-1.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#059669]" />
              </span>
              <span className="text-[11px] font-semibold text-[#374151]">Twin live</span>
            </div>
            <span className="text-[10px] font-medium text-[#6B7280] mono">
              {user?.businessName ? 'Synchronized' : 'Online'}
            </span>
          </div>

          {/* User profile */}
          <div
            onClick={() => navigate('/profile')}
            className="p-2 rounded-lg hover:bg-[#F9FAFB] cursor-pointer flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5455E7] to-[#16B8C8] text-white text-[10px] font-bold flex items-center justify-center shrink-0 overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : initials(displayName)}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-[#111827] truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-[#9CA3AF] truncate leading-none mt-0.5">
                  {displayRole}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              title="Sign out"
              className="p-1 text-[#D1D5DB] hover:text-[#DC2626] transition-colors rounded"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
