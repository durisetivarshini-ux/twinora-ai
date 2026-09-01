import React from 'react';

export default function TwinoraLogo({ className = 'w-6 h-6', active = false }) {
  return (
    <svg 
      className={`${className} transition-transform duration-200 group-hover:scale-105 shrink-0`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Business Loop: Indigo to Blue */}
        <linearGradient id="twinLogoBusiness" x1="12" y1="18" x2="52" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Future Loop: Cyan to Indigo */}
        <linearGradient id="twinLogoFuture" x1="88" y1="18" x2="48" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Left Infinity / Twin Node (Business Reality) */}
      <path 
        d="M32 26 C16 26 8 36 8 50 C8 64 16 74 32 74 C44 74 50 62 50 50 C50 38 44 26 32 26 Z" 
        stroke="url(#twinLogoBusiness)" 
        strokeWidth="8" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Infinity / Twin Node (Simulated Future) */}
      <path 
        d="M68 26 C84 26 92 36 92 50 C92 64 84 74 68 74 C56 74 50 62 50 50 C50 38 56 26 68 26 Z" 
        stroke="url(#twinLogoFuture)" 
        strokeWidth="8" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Dynamic Nexus Point */}
      <circle cx="50" cy="50" r="5" fill="#4F46E5" />
      <circle cx="50" cy="50" r="2" fill="#FFFFFF" />

      {/* Active Sync Indicator */}
      {active && (
        <circle cx="80" cy="50" r="3.5" fill="#06B6D4">
          <animate 
            attributeName="opacity" 
            values="0.4;1;0.4" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </circle>
      )}
    </svg>
  );
}
