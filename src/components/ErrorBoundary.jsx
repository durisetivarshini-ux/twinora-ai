import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import TwinoraLogo from './TwinoraLogo';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Twinora AI Runtime Exception caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] flex flex-col items-center justify-center p-6 font-sans relative">
          <div className="w-full max-w-lg p-8 rounded-[14px] bg-white border border-[#E2E8F0] shadow-[0_20px_50px_rgba(15,23,42,0.08)] text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-[20px] font-bold text-[#0F172A]">
                Temporary Viewport Exception
              </h2>
              <p className="text-[14px] text-[#475569] leading-relaxed">
                Twinora AI intercepted a runtime rendering exception. Your session data and business telemetry remain safely intact.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-left text-[12px] font-mono text-[#DC2626] overflow-x-auto max-h-40">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="btn-primary !h-[44px] px-6 text-[13px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
