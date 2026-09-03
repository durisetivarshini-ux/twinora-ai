import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TwinoraLogo from '../components/TwinoraLogo';
import { useAuth } from '../context/AuthContext';

const FloatingLabel = ({ label, value, top, left, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    className="absolute flex flex-col items-center pointer-events-none"
    style={{ top, left }}
  >
    <span className="text-[10px] font-bold text-[#64748B] tracking-wider mb-1 font-mono">{label}</span>
    <span className="text-xs font-mono font-semibold text-[#0F172A] bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-sm">
      {value}
    </span>
  </motion.div>
);

const TwinCore = ({ successStage }) => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center font-sans">
      {/* Orbital Paths */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[280px] h-[280px] border border-[#4F46E5]/15 rounded-full"
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[380px] h-[380px] border border-[#0891B2]/20 rounded-full"
      />

      {/* Floating Particles on Orbits */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[280px] h-[280px]"
      >
        <div className="w-3 h-3 bg-[#4F46E5] rounded-full absolute -top-1.5 left-1/2 transform -translate-x-1/2 shadow-[0_0_12px_rgba(79,70,229,0.5)]" />
      </motion.div>

      {/* Central Core */}
      <motion.div
        animate={{ 
          scale: successStage > 0 ? [1, 1.15, 1.1] : [1, 1.05, 1],
        }}
        transition={{ duration: successStage > 0 ? 1 : 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center z-10 border-2 border-[#4F46E5]/30 shadow-[0_12px_36px_rgba(79,70,229,0.18)]"
      >
        <div className="w-20 h-20 bg-[#EEF2FF] rounded-full flex items-center justify-center">
          <TwinoraLogo className="w-9 h-9" active={true} />
        </div>
      </motion.div>

      {/* Floating Metrics */}
      <FloatingLabel label="REVENUE" value="₹8.42L" top="10%" left="15%" delay={0.5} />
      <FloatingLabel label="CUSTOMERS" value="948" top="75%" left="20%" delay={0.7} />
      <FloatingLabel label="RETENTION" value="34.0%" top="20%" left="70%" delay={0.9} />
      <FloatingLabel label="GROWTH" value="82 / 100" top="80%" left="65%" delay={1.1} />
      <FloatingLabel label="SIGNALS" value="03" top="45%" left="85%" delay={1.3} />
    </div>
  );
};

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [successStage, setSuccessStage] = useState(0);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const successMessages = [
    "YOUR TWIN IS COMING TO LIFE.",
    "Connecting business profile...",
    "Mapping revenue vectors...",
    "Synthesizing customer cohorts...",
    "Modeling product elasticity...",
    "Analyzing growth potential...",
    "Activating intelligence mesh...",
    "YOUR TWIN IS READY."
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'This field is required.';
    if (!formData.businessName.trim()) newErrors.businessName = 'This field is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'This field is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid work email.';
    }
    if (!formData.password) {
      newErrors.password = 'This field is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Use at least 8 characters.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    
    try {
      if (typeof signup === 'function') {
        await signup(formData.fullName, formData.businessName, formData.email, formData.password);
      } else {
        const res = await apiService.signup(formData.fullName, formData.businessName, formData.email, formData.password);
        if (res?.token) {
          localStorage.setItem('twinora_token', res.token);
          if (res.user) localStorage.setItem('twinora_user', JSON.stringify(res.user));
          if (res.merchant) localStorage.setItem('twinora_merchant', JSON.stringify(res.merchant));
        }
      }
      
      setIsSuccess(true);
      for (let i = 0; i < successMessages.length; i++) {
        setSuccessStage(i);
        await new Promise(r => setTimeout(r, i === successMessages.length - 1 ? 400 : 900));
      }
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      setLoading(false);
      if (err.message.toLowerCase().includes('email') || err.message.toLowerCase().includes('exist')) {
        setErrors({ email: err.message });
      } else {
        setErrors({ general: err.message || 'An error occurred during signup.' });
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-canvas text-primaryText flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 backdrop-grid pointer-events-none -z-10" />
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
          <div className="w-full md:w-1/2 flex justify-center">
            <TwinCore successStage={successStage} />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left space-y-4">
            <span className="text-[12px] font-mono font-bold text-[#4F46E5] uppercase tracking-wider">
              Twinora Intelligence Activation
            </span>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={successStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-2xl md:text-3xl font-extrabold text-[#0F172A] leading-tight"
              >
                {successMessages[successStage]}
              </motion.h2>
            </AnimatePresence>
            
            {successStage === successMessages.length - 1 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => navigate('/onboarding')}
                className="btn-primary !h-[52px] px-8 !rounded-xl text-[15px]"
              >
                <span>ENTER COMMAND CENTER →</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-primaryText flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-6 lg:p-8 flex items-center justify-between z-20 pointer-events-none">
        <Link to="/" className="flex items-center gap-2.5 pointer-events-auto">
          <TwinoraLogo className="w-8 h-8" active={true} />
          <span className="font-extrabold tracking-tight text-[19px] text-[#0F172A]">Twinora AI</span>
        </Link>
        <div className="text-[14px] text-[#475569] pointer-events-auto">
          Already have an account?{' '}
          <Link to="/login" className="text-[#4F46E5] font-bold hover:underline">
            Sign In →
          </Link>
        </div>
      </div>

      {/* Left Side - Twinora Visual (55%) */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center relative z-10 pt-24 lg:pt-0 p-8 min-h-[50vh] lg:min-h-screen">
        <div className="max-w-md w-full mb-8 text-center lg:text-left space-y-3">
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
            BUILD THE BUSINESS <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#0891B2]">
              YOU CAN SEE.
            </span>
          </h1>
          <p className="text-[16px] text-[#475569] font-medium">
            Your business. Simulated before you risk real capital.
          </p>
          <p className="text-[14px] text-[#64748B] leading-relaxed">
            Twinora creates a living digital model of your business so you can explore opportunities, test decisions, and understand what could happen next.
          </p>
        </div>
        
        <div className="w-full max-w-lg">
          <TwinCore successStage={0} />
        </div>
      </div>

      {/* Right Side - Form (45%) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10 min-h-[50vh] lg:min-h-screen pb-12 lg:pb-0">
        <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[14px] p-8 lg:p-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)] relative">
          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-6 text-[11px] font-mono font-bold tracking-widest">
            <span className="text-[#4F46E5] bg-[#EEF2FF] px-2.5 py-1 rounded-md border border-[#C7D2FE]">01 BUSINESS</span>
            <span className="text-[#94A3B8]">02 DATA</span>
            <span className="text-[#94A3B8]">03 TWIN</span>
          </div>

          <div className="mb-6 space-y-1">
            <h2 className="text-[22px] font-extrabold text-[#0F172A]">CREATE YOUR BUSINESS TWIN</h2>
            <p className="text-[13px] text-[#64748B]">
              Tell Twinora a little about your business to build your first digital model.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[#DC2626] text-xs font-medium">
                {errors.general}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="text-[12px] font-semibold text-[#475569] block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all font-medium"
                />
              </div>
              {errors.fullName && <p className="text-[#DC2626] text-[11px] mt-1">{errors.fullName}</p>}
            </div>

            {/* Business Name */}
            <div>
              <label className="text-[12px] font-semibold text-[#475569] block mb-1">Business Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Your store or company name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all font-medium"
                />
              </div>
              {errors.businessName && <p className="text-[#DC2626] text-[11px] mt-1">{errors.businessName}</p>}
            </div>

            {/* Work Email */}
            <div>
              <label className="text-[12px] font-semibold text-[#475569] block mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all font-medium"
                />
              </div>
              {errors.email && <p className="text-[#DC2626] text-[11px] mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] font-semibold text-[#475569] block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password (8+ chars)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-10 py-2.5 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[#DC2626] text-[11px] mt-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !h-[48px] !rounded-xl mt-4 font-semibold text-[14px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>INITIALIZING TWIN...</span>
                </span>
              ) : (
                <span>CREATE MY TWIN →</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
