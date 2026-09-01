import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Building, Settings, Shield, Bell, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user, merchant, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigateToProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  // Generate initials from actual authenticated user
  const getInitials = (name) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = user?.fullName || 'Business Operator';
  const displayEmail = user?.email || 'operator@business.com';
  const displayRole = user?.role || 'Store Owner';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Card Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full border transition-all duration-200 group
          ${isOpen 
            ? 'bg-[#EEF2FF] border-[#4F46E5]/40 shadow-sm' 
            : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]'
          }
        `}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-white bg-gradient-to-br from-[#4F46E5] to-[#0891B2] shadow-sm border border-white overflow-hidden font-sans">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(displayName)
            )}
          </div>
          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#16A34A] border-2 border-white rounded-full"></div>
        </div>

        {/* User Info */}
        <div className="hidden sm:flex flex-col items-start text-left max-w-[130px]">
          <span className="text-[13px] font-bold text-[#0F172A] leading-tight truncate w-full">{displayName}</span>
          <span className="text-[11px] text-[#64748B] leading-none mt-0.5 truncate w-full font-mono">
            {displayRole}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-[#64748B] ml-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0F172A]' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.12)] overflow-hidden z-50 origin-top-right font-sans"
          >
            {/* Header Section */}
            <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#F8FAFC]">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] text-white bg-gradient-to-br from-[#4F46E5] to-[#0891B2] shadow-sm border border-white overflow-hidden shrink-0">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(displayName)
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-bold text-[#0F172A] truncate">{displayName}</span>
                <span className="text-[12px] text-[#4F46E5] font-mono truncate font-semibold">{displayEmail}</span>
                <span className="text-[11px] text-[#64748B] truncate mt-0.5">{displayRole}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-0.5">
              <button 
                onClick={navigateToProfile} 
                className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#475569] font-semibold rounded-xl hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-colors"
              >
                <User className="w-4 h-4 text-[#4F46E5]" /> My Profile
              </button>
              <button 
                onClick={() => { setIsOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#475569] font-semibold rounded-xl hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-colors"
              >
                <Building className="w-4 h-4 text-[#0891B2]" /> Business Profile
              </button>
              <button 
                onClick={() => { setIsOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#475569] font-semibold rounded-xl hover:bg-[#EEF2FF] hover:text-[#4F46E5] transition-colors"
              >
                <Settings className="w-4 h-4 text-[#64748B]" /> Account Settings
              </button>
            </div>

            <div className="h-px bg-[#E2E8F0] w-full"></div>

            <div className="p-2">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[#DC2626] font-semibold rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
