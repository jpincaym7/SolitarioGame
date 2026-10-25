import React from 'react';
import type { Suit } from '../../core/types';

interface SuitIconProps {
  suit: Suit;
  className?: string;
}

export const SuitIcon: React.FC<SuitIconProps> = ({ suit, className = 'w-4 h-4' }) => {
  switch (suit) {
    case 'hearts':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`text-red-600 ${className}`}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'diamonds':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`text-red-600 ${className}`}>
          <path d="M12 2L3.5 12 12 22l8.5-10L12 2z" />
        </svg>
      );
    case 'spades':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`text-slate-900 ${className}`}>
          <path d="M12 2C9.5 6 4 10 4 14.5 4 17.5 6.5 20 9.5 20c1.2 0 2.2-.4 2.5-1.2.3.8 1.3 1.2 2.5 1.2 3 0 5.5-2.5 5.5-5.5C20 10 14.5 6 12 2z" />
          <path d="M10.5 18h3l1 4h-5l1-4z" />
        </svg>
      );
    case 'clubs':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={`text-slate-900 ${className}`}>
          <circle cx="12" cy="7.5" r="4.5" />
          <circle cx="7.5" cy="14" r="4.5" />
          <circle cx="16.5" cy="14" r="4.5" />
          <path d="M10.5 14h3l1.2 8h-5.4l1.2-8z" />
        </svg>
      );
  }
};
