import React from 'react';

interface StockCounterBadgeProps {
  count: number;
  className?: string;
}

export const StockCounterBadge: React.FC<StockCounterBadgeProps> = ({ count, className = '' }) => {
  return (
    <div
      className={`absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 pointer-events-none select-none z-20 ${className}`}
      title={`${count} cartas restantes en el mazo`}
    >
      <svg
        width="132"
        height="64"
        viewBox="0 0 132 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[46px] h-[22px] sm:w-[52px] sm:h-[25px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
      >
        <defs>
          {/* Metallic Gold Gradients */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="25%" stopColor="#E5B842" />
            <stop offset="50%" stopColor="#8F6614" />
            <stop offset="75%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#AA7818" />
          </linearGradient>

          <linearGradient id="goldInnerRim" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7A520B" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#FFF1B8" />
          </linearGradient>

          <linearGradient id="tokenBody" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#1E2333" />
            <stop offset="40%" stopColor="#101420" />
            <stop offset="100%" stopColor="#080A10" />
          </linearGradient>

          <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="45%" stopColor="#FCD34D" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Soft Glow */}
          <filter id="badgeGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#F59E0B" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Outer Heavy Beveled Gold Rim */}
        <rect
          x="2"
          y="2"
          width="128"
          height="60"
          rx="30"
          fill="url(#goldRim)"
          stroke="#452B04"
          strokeWidth="1.5"
        />

        {/* Inner Dark Recessed Token Bed */}
        <rect
          x="6"
          y="6"
          width="120"
          height="52"
          rx="26"
          fill="url(#tokenBody)"
          stroke="url(#goldInnerRim)"
          strokeWidth="1.5"
        />

        {/* Subtle Guilloche / Hatching Pattern Line */}
        <rect
          x="9"
          y="9"
          width="114"
          height="46"
          rx="23"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.35"
        />

        {/* ----------------- LEFT: 3D Miniature Gold Deck / Fan of Cards ----------------- */}
        <g transform="translate(18, 14)">
          {/* Back Card (slanted left) */}
          <rect
            x="2"
            y="6"
            width="18"
            height="26"
            rx="2.5"
            transform="rotate(-15, 11, 19)"
            fill="#1E293B"
            stroke="url(#goldRim)"
            strokeWidth="1.2"
          />
          {/* Mid Card (slanted right) */}
          <rect
            x="8"
            y="5"
            width="18"
            height="26"
            rx="2.5"
            transform="rotate(12, 17, 18)"
            fill="#0F172A"
            stroke="url(#goldRim)"
            strokeWidth="1.2"
          />
          {/* Front Golden Card */}
          <rect
            x="6"
            y="5"
            width="18"
            height="26"
            rx="2.5"
            fill="url(#cardGrad2)"
            stroke="#FFF4D0"
            strokeWidth="1.4"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.7))"
          />
          {/* Spade Emblem inside Front Card */}
          <path
            d="M 15 13 C 15 13 11 17 11 19.5 C 11 21.2 12.3 22.2 13.7 22.2 C 14.7 22.2 15 21.5 15 21.5 C 15 21.5 15.3 22.2 16.3 22.2 C 17.7 22.2 19 21.2 19 19.5 C 19 17 15 13 15 13 Z"
            fill="#451A03"
          />
          <path
            d="M 14.5 21.5 L 13.5 24.5 L 16.5 24.5 L 15.5 21.5 Z"
            fill="#451A03"
          />
        </g>

        {/* Small Golden Gem Separator */}
        <g transform="translate(56, 32)">
          <path
            d="M 0 -6 L 4 0 L 0 6 L -4 0 Z"
            fill="url(#goldRim)"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
          />
        </g>

        {/* ----------------- RIGHT: High-Impact Gold Counter Number ----------------- */}
        {/* Subtle black shadow for 3D depth */}
        <text
          x="92"
          y="42"
          textAnchor="middle"
          fontSize="30"
          fontWeight="900"
          fontFamily="'Rajdhani', 'Oxanium', 'Plus Jakarta Sans', monospace, sans-serif"
          letterSpacing="1"
          fill="#000000"
          opacity="0.9"
          dy="1"
        >
          {count}
        </text>

        {/* Vibrant Gradient Gold Number */}
        <text
          x="92"
          y="41"
          textAnchor="middle"
          fontSize="30"
          fontWeight="900"
          fontFamily="'Rajdhani', 'Oxanium', 'Plus Jakarta Sans', monospace, sans-serif"
          letterSpacing="1"
          fill="url(#goldTextGrad)"
          filter="url(#badgeGlow)"
        >
          {count}
        </text>

        {/* Sparkle Star on top-right rim */}
        <g transform="translate(114, 12)">
          <path
            d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Q 0 0 0 -4 Z"
            fill="#FFFBEB"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
};
