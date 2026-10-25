import React from 'react';
import type { ClickRipple } from '../../hooks/useJuice';

interface JuiceOverlayProps {
  ripples: ClickRipple[];
}

export const JuiceOverlay: React.FC<JuiceOverlayProps> = ({ ripples }) => {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-50 overflow-hidden">
      {/* Golden Click Sparks & Ripples on Cursor */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{ left: ripple.x, top: ripple.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {/* Expanding luxury gold shockwave ring */}
          <div className="w-4 h-4 rounded-full border-2 border-amber-400/80 animate-click-ring" />

          {/* Golden micro-sparks shooting outward */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24] animate-spark-1" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_#fde68a] animate-spark-2" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-spark-3" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24] animate-spark-4" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_6px_#fef08a] animate-spark-5" />
          </div>
        </div>
      ))}
    </div>
  );
};
