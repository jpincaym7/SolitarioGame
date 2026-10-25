import React from 'react';
import type { CardBackStyle } from '../../core/types';

interface CardBackProps {
  styleName: CardBackStyle;
}

export const CardBack: React.FC<CardBackProps> = ({ styleName }) => {
  switch (styleName) {
    case 'classic-red':
      return (
        <div className="w-full h-full rounded-md p-1 bg-[#881337] flex items-center justify-center border border-red-500/70 shadow-inner overflow-hidden select-none">
          <div className="w-full h-full rounded border-2 border-red-300/40 p-1 flex items-center justify-center bg-[#4c0519] relative">
            <svg viewBox="0 0 100 140" className="w-full h-full">
              <pattern id="back-red-guilloche" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="14" height="14" fill="#881337" />
                <path d="M0 7 C 3 3, 11 3, 14 7 C 11 11, 3 11, 0 7 Z" fill="none" stroke="#fecdd3" strokeWidth="0.8" opacity="0.6" />
                <circle cx="7" cy="7" r="2.5" fill="#f43f5e" />
              </pattern>
              <rect width="100" height="140" fill="url(#back-red-guilloche)" rx="3" />
              <rect x="10" y="14" width="80" height="112" rx="4" fill="none" stroke="#fecdd3" strokeWidth="1.5" strokeDasharray="3,2" />
              <rect x="14" y="18" width="72" height="104" rx="3" fill="none" stroke="#fda4af" strokeWidth="0.8" />
              <circle cx="50" cy="70" r="18" fill="#4c0519" stroke="#fecdd3" strokeWidth="1.5" />
              <circle cx="50" cy="70" r="14" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
              <polygon points="50,59 53,67 62,67 55,72 58,81 50,76 42,81 45,72 38,67 47,67" fill="#ffe4e6" />
            </svg>
          </div>
        </div>
      );

    case 'royal-gold':
      return (
        <div className="w-full h-full rounded-md p-1 bg-[#18181b] flex items-center justify-center border border-amber-500/70 shadow-inner overflow-hidden select-none">
          <div className="w-full h-full rounded border-2 border-amber-400/50 p-1 flex items-center justify-center bg-[#09090b] relative">
            <svg viewBox="0 0 100 140" className="w-full h-full">
              <pattern id="back-royal-pat" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#18181b" />
                <path d="M0 8 L8 0 L16 8 L8 16 Z" fill="none" stroke="#b45309" strokeWidth="0.8" opacity="0.5" />
                <circle cx="8" cy="8" r="1.5" fill="#f59e0b" />
              </pattern>
              <rect width="100" height="140" fill="url(#back-royal-pat)" rx="3" />
              <rect x="8" y="12" width="84" height="116" rx="4" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
              <rect x="12" y="16" width="76" height="108" rx="3" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="3,2" />
              <circle cx="50" cy="70" r="20" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
              {/* Heraldic Crown */}
              <path d="M42 66 L44 74 L56 74 L58 66 L54 69 L50 64 L46 69 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              <circle cx="50" cy="62" r="1.5" fill="#fef08a" />
              <circle cx="42" cy="64" r="1.2" fill="#fef08a" />
              <circle cx="58" cy="64" r="1.2" fill="#fef08a" />
            </svg>
          </div>
        </div>
      );

    case 'cyber-dark':
      return (
        <div className="w-full h-full rounded-md p-1 bg-[#09090b] flex items-center justify-center border border-cyan-500/60 shadow-inner overflow-hidden select-none">
          <div className="w-full h-full rounded border border-cyan-500/40 p-1 flex items-center justify-center bg-[#030712] relative">
            <svg viewBox="0 0 100 140" className="w-full h-full">
              <pattern id="back-cyber-hex" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="16" fill="#030712" />
                <polygon points="8,1 15,5 15,12 8,15 1,12 1,5" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.35" />
                <circle cx="8" cy="8" r="1" fill="#22d3ee" opacity="0.7" />
              </pattern>
              <rect width="100" height="140" fill="url(#back-cyber-hex)" rx="3" />
              <rect x="10" y="14" width="80" height="112" rx="4" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.6" />
              <circle cx="50" cy="70" r="18" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
              <path d="M42 70 L50 62 L58 70 L50 78 Z" fill="#0284c7" stroke="#67e8f9" strokeWidth="1.5" />
              <circle cx="50" cy="70" r="3" fill="#a5f3fc" />
            </svg>
          </div>
        </div>
      );

    case 'geometric-emerald':
      return (
        <div className="w-full h-full rounded-md p-1 bg-[#064e3b] flex items-center justify-center border border-emerald-500/60 shadow-inner overflow-hidden select-none">
          <div className="w-full h-full rounded border-2 border-emerald-300/40 p-1 flex items-center justify-center bg-[#022c22] relative">
            <svg viewBox="0 0 100 140" className="w-full h-full">
              <pattern id="back-emerald-deco" width="14" height="14" patternUnits="userSpaceOnUse">
                <rect width="14" height="14" fill="#064e3b" />
                <path d="M0 7 L7 0 L14 7 L7 14 Z" fill="#047857" stroke="#34d399" strokeWidth="0.7" opacity="0.6" />
                <circle cx="7" cy="7" r="1.5" fill="#a7f3d0" />
              </pattern>
              <rect width="100" height="140" fill="url(#back-emerald-deco)" rx="3" />
              <rect x="8" y="12" width="84" height="116" rx="4" fill="none" stroke="#6ee7b7" strokeWidth="1.6" />
              <rect x="12" y="16" width="76" height="108" rx="3" fill="none" stroke="#34d399" strokeWidth="0.8" strokeDasharray="3,2" />
              <circle cx="50" cy="70" r="18" fill="#022c22" stroke="#6ee7b7" strokeWidth="1.8" />
              <path d="M50 58 L54 67 L63 67 L56 73 L58 82 L50 77 L42 82 L44 73 L37 67 L46 67 Z" fill="#a7f3d0" />
            </svg>
          </div>
        </div>
      );

    case 'classic-blue':
    default:
      return (
        <div className="w-full h-full rounded-md p-1 bg-[#1e3a8a] flex items-center justify-center border border-blue-500/60 shadow-inner overflow-hidden select-none">
          <div className="w-full h-full rounded border-2 border-blue-300/40 p-1 flex items-center justify-center bg-[#0f172a] relative">
            <svg viewBox="0 0 100 140" className="w-full h-full">
              <pattern id="back-blue-mandala" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="14" height="14" fill="#1e3a8a" />
                <path d="M0 7 C 3 3, 11 3, 14 7 C 11 11, 3 11, 0 7 Z" fill="none" stroke="#93c5fd" strokeWidth="0.8" opacity="0.6" />
                <circle cx="7" cy="7" r="2.5" fill="#3b82f6" />
              </pattern>
              <rect width="100" height="140" fill="url(#back-blue-mandala)" rx="3" />
              <rect x="10" y="14" width="80" height="112" rx="4" fill="none" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="3,2" />
              <rect x="14" y="18" width="72" height="104" rx="3" fill="none" stroke="#60a5fa" strokeWidth="0.8" />
              <circle cx="50" cy="70" r="18" fill="#0f172a" stroke="#bfdbfe" strokeWidth="1.5" />
              <circle cx="50" cy="70" r="14" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" />
              <polygon points="50,59 53,67 62,67 55,72 58,81 50,76 42,81 45,72 38,67 47,67" fill="#dbeafe" />
            </svg>
          </div>
        </div>
      );
  }
};

export default CardBack;
