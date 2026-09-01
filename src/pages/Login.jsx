import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, Check, AlertCircle } from 'lucide-react';
import TwinoraLogo from '../components/TwinoraLogo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userName, setUserName] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your business email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      let authUser = null;
      if (login) {
        authUser = await login(email.trim(), password);
      }
      
      const firstName = authUser?.fullName?.split(' ')[0] || email.split('@')[0] || 'Operator';
      setUserName(firstName);

      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } catch (err) {
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
        setErrorMsg('Unable to connect. Please try again.');
      } else {
        setErrorMsg('Incorrect email or password.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primaryText flex items-center justify-center p-4 lg:p-8 pt-24 font-sans relative">
      <div className="absolute inset-0 backdrop-grid pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[20%] w-[450px] h-[450px] rounded-full glow-radial-blue pointer-events-none -z-10" />

      <div className="w-full max-w-5xl rounded-[14px] bg-white border border-[#E2E8F0] shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8">
          <div>
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <TwinoraLogo className="w-9 h-9" active={true} />
              <span className="font-sans font-extrabold text-[20px] text-[#0F172A] tracking-tight">
                Twinora <span className="text-[#4F46E5] font-bold">AI</span>
              </span>
            </Link>

            <div className="mt-8 space-y-2">
              <h1 className="text-[26px] sm:text-[30px] font-extrabold font-sans text-[#0F172A] tracking-tight leading-tight">
                Welcome back.
              </h1>
              <p className="text-[14px] text-[#475569]">
                Sign in to continue to your business Twin.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-[#DC2626] text-[13px] font-sans font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[12px] font-semibold text-[#475569] block">Business Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  placeholder="you@business.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 text-[14px] text-[#0F172A] placeholder-[#94A3B8] font-medium focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[#475569]">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[12px] text-[#4F46E5] hover:underline font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-3 text-[14px] text-[#0F172A] placeholder-[#94A3B8] font-medium focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(userName)}
              className="btn-primary w-full !h-[48px] !rounded-xl mt-2 font-sans font-semibold text-[14px] transition-all"
            >
              {loading && !userName ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating Twinora...</span>
                </span>
              ) : userName ? (
                <span className="flex items-center gap-1.5 text-white">
                  <Check className="w-4 h-4 stroke-[3] text-white" />
                  <span>Welcome back, {userName}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>SIGN IN</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center text-[13px] text-[#475569] pt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#4F46E5] font-bold hover:underline">
              Create your Twin →
            </Link>
          </div>
        </div>

        {/* Right Twin Core Visual */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#F2F6FB] p-8 sm:p-10 flex-col justify-between border-l border-[#E2E8F0] relative overflow-hidden">
          <div className="space-y-1 z-10">
            <span className="text-[11px] font-mono text-[#4F46E5] font-bold uppercase tracking-wider">Twinora Intelligence Mesh</span>
            <h2 className="text-[20px] font-bold font-sans text-[#0F172A]">Business Decision Simulator</h2>
          </div>

          <div className="my-auto py-6 z-10 flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full border border-[#4F46E5]/20 bg-white flex items-center justify-center shadow-[0_12px_36px_rgba(79,70,229,0.12)]">
              <div className="w-32 h-32 rounded-full border border-[#0891B2]/30 bg-[#EEF2FF] flex items-center justify-center animate-orbit-slow">
                <TwinoraLogo className="w-14 h-14" active={true} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] z-10 flex items-center justify-between text-[12px] font-mono shadow-sm">
            <span className="text-[#475569] font-sans">System Status: <strong className="text-[#16A34A] font-bold font-mono">Live & Operational</strong></span>
            <span className="text-[#475569] font-sans">Engine: <strong className="text-[#4F46E5] font-bold font-mono">Monte Carlo AI</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
