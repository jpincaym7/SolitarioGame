import React from 'react';
import type { ScoreNotificationItem } from '../../hooks/useJuice';

interface ScoreNotificationProps {
  notification: ScoreNotificationItem | null;
}

export const ScoreNotification: React.FC<ScoreNotificationProps> = ({ notification }) => {
  if (!notification) return null;

  const isPositive = notification.delta > 0;

  return (
    <div
      className="fixed left-4 sm:left-6 md:left-8 top-20 sm:top-24 z-30 pointer-events-none select-none"
      aria-live="polite"
    >
      <div
        key={notification.id}
        className="animate-cod-score flex flex-col items-start drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
      >
        {/* Línea 1: Cuánto le sumó + Motivo */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 leading-tight">
          <span
            className={`font-game-num font-black text-sm sm:text-base tracking-wide ${
              isPositive
                ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                : 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]'
            }`}
          >
            {isPositive ? `+${notification.delta}` : notification.delta} PUNTOS
          </span>

          <span className="font-game-ui font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-zinc-100/90">
            {notification.label}
          </span>
        </div>

        {/* Línea 2: Cuánto suma en total (abajo, para no alargar el texto) */}
        <span className="font-game-num font-bold text-[10px] sm:text-[11px] text-amber-300/80 tracking-widest mt-0.5 leading-none">
          ({notification.totalScore} TOTAL)
        </span>
      </div>
    </div>
  );
};
