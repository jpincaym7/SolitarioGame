import React, { useState } from 'react';

interface PlayingCardsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PlayingCardsLogo: React.FC<PlayingCardsLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeMap = {
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none flex-shrink-0 ${sizeMap[size]} ${className}`}
    >
      {!hasError ? (
        <img
          src="/assets/logo/solitario_real_logo.png"
          alt="Solitario Real Emblema Oficial"
          className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(245,158,11,0.4)] transition-transform duration-200 hover:scale-105 active:scale-95"
          onError={() => setHasError(true)}
        />
      ) : (
        /* Vector SVG Fallback with Gold Relief */
        <svg
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
        >
          <defs>
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <linearGradient id="cardBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f4f4f5" />
            </linearGradient>
          </defs>

          {/* Golden Laurel Circle */}
          <circle
            cx="34"
            cy="34"
            r="31"
            stroke="url(#goldRim)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            className="opacity-50"
          />

          {/* Left Card: Ace of Hearts */}
          <g transform="translate(34, 40) rotate(-22) translate(-34, -40)">
            <rect
              x="12"
              y="14"
              width="22"
              height="32"
              rx="3.5"
              fill="url(#cardBg)"
              stroke="url(#goldRim)"
              strokeWidth="1.2"
            />
            <text x="14" y="21" fill="#dc2626" fontSize="5" fontWeight="900" fontFamily="serif">
              A
            </text>
            <path d="M 15 23 C 14 21, 12 23, 14 25 L 15 26 L 16 25 C 18 23, 16 21, 15 23 Z" fill="#dc2626" />
          </g>

          {/* Right Card: Ace of Diamonds */}
          <g transform="translate(34, 40) rotate(22) translate(-34, -40)">
            <rect
              x="34"
              y="14"
              width="22"
              height="32"
              rx="3.5"
              fill="url(#cardBg)"
              stroke="url(#goldRim)"
              strokeWidth="1.2"
            />
            <text x="36" y="21" fill="#dc2626" fontSize="5" fontWeight="900" fontFamily="serif">
              A
            </text>
            <path d="M 37 23 L 38.5 25 L 37 27 L 35.5 25 Z" fill="#dc2626" />
          </g>

          {/* Center Card: Royal Ace of Spades */}
          <rect
            x="23"
            y="11"
            width="22"
            height="33"
            rx="3.5"
            fill="url(#cardBg)"
            stroke="url(#goldRim)"
            strokeWidth="1.5"
          />
          <text x="25" y="19" fill="#09090b" fontSize="5.5" fontWeight="900" fontFamily="serif">
            A
          </text>
          <path
            d="M 34 22 C 34 22, 28 26, 30 29.5 C 31.5 32, 33.5 31, 33.5 32.5 L 32.5 35 L 35.5 35 L 34.5 32.5 C 34.5 31, 36.5 32, 38 29.5 C 40 26, 34 22, 34 22 Z"
            fill="#09090b"
          />

          {/* Imperial Crown on Center Card */}
          <path
            d="M 30 16 L 31 18 L 34 16 L 37 18 L 38 16 L 37.5 20 L 30.5 20 Z"
            fill="url(#goldRim)"
          />
        </svg>
      )}
    </div>
  );
};

export default PlayingCardsLogo;
