import React from 'react';
import type { Suit } from '../../core/types';

interface SlotVisualProps {
  className?: string;
  isHighlighted?: boolean;
}

interface FoundationSlotProps extends SlotVisualProps {
  suit: Suit;
}

const SUIT_ASSET_MAP: Record<Suit, string> = {
  spades: '/assets/slots/foundation_spade.jpg',
  hearts: '/assets/slots/foundation_heart.jpg',
  clubs: '/assets/slots/foundation_club.jpg',
  diamonds: '/assets/slots/foundation_diamond.jpg',
};

// -----------------------------------------------------------------------------
// 1. FOUNDATION SLOTS: Full-Bleed 3:4 Portrait Cards (Edge-to-Edge Casino Slots)
// -----------------------------------------------------------------------------
export const FoundationSlotSVG: React.FC<FoundationSlotProps> = ({
  suit,
  className = 'w-full h-full',
  isHighlighted = false,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const imageSrc = SUIT_ASSET_MAP[suit];
  const isDiamond = suit === 'diamonds';

  return (
    <div
      className={`relative w-full h-full rounded-[8px] overflow-hidden flex items-center justify-center transition-all duration-200 select-none ${className} ${
        isHighlighted
          ? 'ring-2 ring-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.9)] scale-[1.03]'
          : 'border border-amber-500/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.5)]'
      }`}
    >
      {!imageError ? (
        isDiamond ? (
          /* For Diamond: Luxury emerald casino card container with centered glowing jewel medallion */
          <div className="relative w-full h-full bg-[#0a1e14] flex items-center justify-center overflow-hidden">
            {/* Emerald Velvet Texture overlay */}
            <div className="absolute inset-0 bg-radial from-[#123824] to-[#06140d] opacity-90" />
            
            {/* Gold Filigree Card Border */}
            <div className="absolute inset-1 rounded-[6px] border border-amber-400/40 pointer-events-none" />
            <div className="absolute inset-2 rounded-[4px] border border-amber-500/20 border-dashed pointer-events-none" />
            
            {/* Centered Diamond Gem Medallion */}
            <div className="relative z-10 w-[78%] aspect-square rounded-full overflow-hidden shadow-[0_0_18px_rgba(244,63,94,0.6),0_4px_12px_rgba(0,0,0,0.8)] border-2 border-amber-400/80">
              <img
                src={imageSrc}
                alt="Ranura de Diamantes"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover scale-110 filter brightness-105 contrast-110"
              />
            </div>

            {/* Corner Filigree Markers */}
            <div className="absolute top-1.5 left-2 text-[9px] font-bold text-amber-300/60 font-serif">A</div>
            <div className="absolute bottom-1.5 right-2 text-[9px] font-bold text-amber-300/60 font-serif rotate-180">A</div>
          </div>
        ) : (
          /* For Spades, Hearts, Clubs: Full portrait 3:4 cards that fill edge to edge */
          <img
            src={imageSrc}
            alt={`Ranura de ${suit}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover filter brightness-100 contrast-105 pointer-events-none transition-transform duration-300 hover:scale-[1.02]"
          />
        )
      ) : (
        /* Fallback */
        <div className="w-full h-full bg-[#0a1e14] flex items-center justify-center p-2">
          <span className="text-3xl text-amber-300 filter drop-shadow">
            {suit === 'spades' && '♠'}
            {suit === 'hearts' && '♥'}
            {suit === 'clubs' && '♣'}
            {suit === 'diamonds' && '♦'}
          </span>
        </div>
      )}

      {/* Luxury Golden Edge Rim */}
      <div className="absolute inset-0 rounded-[8px] pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border border-amber-400/30" />
    </div>
  );
};

// -----------------------------------------------------------------------------
// 2. KING TABLEAU SLOT: Full-Bleed 3:4 Portrait Royal King Card
// -----------------------------------------------------------------------------
export const KingSlotSVG: React.FC<SlotVisualProps> = ({
  className = 'w-full h-full',
  isHighlighted = false,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={`relative w-full h-full rounded-[8px] overflow-hidden flex items-center justify-center transition-all duration-200 select-none ${className} ${
        isHighlighted
          ? 'ring-2 ring-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.9)] scale-[1.03]'
          : 'border border-amber-500/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.5)]'
      }`}
    >
      {!imageError ? (
        /* Full 3:4 portrait King card filling the entire slot from edge to edge */
        <img
          src="/assets/slots/king_crown.jpg"
          alt="Ranura para Rey"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover filter brightness-100 contrast-105 pointer-events-none transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-[#0a1e14] flex items-center justify-center">
          <span className="text-3xl text-amber-400">👑</span>
        </div>
      )}

      {/* Gold Card Inset Rim */}
      <div className="absolute inset-0 rounded-[8px] pointer-events-none shadow-[inset_0_0_12px_rgba(0,0,0,0.5)] border border-amber-400/30" />
    </div>
  );
};

// -----------------------------------------------------------------------------
// 3. WASTE TRAY SLOT: Full Edge-to-Edge Velvet Discard Well
// -----------------------------------------------------------------------------
export const WasteSlotSVG: React.FC<SlotVisualProps> = ({
  className = 'w-full h-full',
  isHighlighted = false,
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={`relative w-full h-full rounded-[8px] overflow-hidden flex items-center justify-center transition-all duration-200 select-none ${className} ${
        isHighlighted
          ? 'ring-2 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
          : 'border border-amber-500/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.5)]'
      }`}
    >
      {!imageError ? (
        /* Zoom scale-[1.28] crops the outer black studio border so the gold frame fills the card slot */
        <img
          src="/assets/slots/waste_tray.jpg"
          alt="Bandeja de descarte"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover scale-[1.26] filter brightness-105 contrast-110 pointer-events-none"
        />
      ) : (
        <div className="w-full h-full bg-[#0a1e14] flex items-center justify-center" />
      )}

      {/* Inset Vignette & Gold Frame */}
      <div className="absolute inset-0 rounded-[8px] pointer-events-none shadow-[inset_0_0_12px_rgba(0,0,0,0.6)] border border-amber-400/30" />
    </div>
  );
};

// -----------------------------------------------------------------------------
// 4. STOCK RELOAD SLOT: 3D Casino Dial in Card Well (Perfect Space Occupation)
// -----------------------------------------------------------------------------
export const StockReloadSlotSVG: React.FC<SlotVisualProps> = ({
  className = 'w-full h-full',
}) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={`group relative w-full h-full rounded-[8px] overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-200 select-none hover:scale-[1.03] active:scale-95 border border-amber-400/60 hover:border-amber-300 shadow-[0_4px_16px_rgba(0,0,0,0.7)] hover:shadow-[0_0_26px_rgba(251,191,36,0.85)] bg-[#0a1e14] ${className}`}
      title="Clic para reiniciar el mazo de robo"
    >
      {/* Emerald Velvet Felt Texture */}
      <div className="absolute inset-0 bg-radial from-[#123824] to-[#06140d] opacity-90 pointer-events-none" />

      {/* Card Inset Borders & Corner Filigree */}
      <div className="absolute inset-1 rounded-[6px] border border-amber-400/40 pointer-events-none" />
      <div className="absolute inset-2 rounded-[4px] border border-amber-500/20 border-dashed pointer-events-none" />

      {!imageError ? (
        /* Perfectly centered circular 3D reload medal with glowing amber ring */
        <div className="relative z-10 w-[78%] aspect-square rounded-full overflow-hidden shadow-[0_0_20px_rgba(251,191,36,0.7),0_6px_16px_rgba(0,0,0,0.9)] border-2 border-amber-400 group-hover:scale-110 transition-transform duration-500">
          <img
            src="/assets/slots/stock_reload.jpg"
            alt="Recargar mazo"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover scale-110 filter brightness-105 contrast-115 group-hover:rotate-180 transition-transform duration-700 pointer-events-none"
          />
        </div>
      ) : (
        <div className="relative z-10 w-[78%] aspect-square rounded-full bg-slate-950/90 border-2 border-amber-400 flex items-center justify-center text-amber-400 text-3xl font-bold">
          ↺
        </div>
      )}

      {/* Inset Shadow & Outer Gold Rim */}
      <div className="absolute inset-0 rounded-[8px] pointer-events-none shadow-[inset_0_0_14px_rgba(0,0,0,0.6)] border border-amber-400/40 group-hover:border-amber-300 transition-colors" />

      {/* Floating Action Pill */}
      <div className="absolute bottom-2 z-20 px-2.5 py-0.5 rounded-full bg-slate-950/95 border border-amber-400 text-amber-300 text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl pointer-events-none backdrop-blur-sm">
        Reciclar
      </div>
    </div>
  );
};
