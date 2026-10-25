import React, { useEffect } from 'react';
import type { Hint } from '../../core/types';
import { Lightbulb, X, ArrowRight } from 'lucide-react';

interface HintBannerProps {
  hint: Hint | null;
  onDismiss: () => void;
}

export const HintBanner: React.FC<HintBannerProps> = ({ hint, onDismiss }) => {
  // Auto-dismiss hint after 8 seconds
  useEffect(() => {
    if (!hint) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [hint, onDismiss]);

  if (!hint) return null;

  return (
    <div
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto bg-[#10141e]/95 backdrop-blur-md border-2 border-amber-500/80 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.9),0_0_20px_rgba(251,191,36,0.3)] flex items-center justify-between gap-3 text-white transition-all select-none animate-in fade-in slide-in-from-bottom-3 duration-200"
      role="alert"
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center flex-shrink-0 font-black shadow-md">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 fill-black stroke-black" strokeWidth={2} />
        </div>
        <div>
          <div className="text-[10px] sm:text-[11px] uppercase font-game-ui font-black text-amber-400 tracking-wider flex items-center gap-1">
            <span>PISTA LEGAL</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.4} />
          </div>
          <div className="text-xs sm:text-sm font-game-ui font-bold text-zinc-100 mt-0.5 leading-snug">
            {hint.reason}
          </div>
        </div>
      </div>

      <button
        onClick={onDismiss}
        className="game-btn p-1.5 rounded-xl bg-[#1e2230] hover:bg-[#282e42] text-zinc-400 hover:text-white transition-colors cursor-pointer flex-shrink-0 border border-zinc-700 ml-2"
        title="Cerrar pista (Esc)"
      >
        <X className="w-4 h-4" strokeWidth={2.2} />
      </button>
    </div>
  );
};

export default HintBanner;
