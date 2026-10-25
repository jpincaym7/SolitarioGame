import React from 'react';
import { motion } from 'framer-motion';
import type { Card, CardBackStyle, CardLocation } from '../../core/types';
import { CardBack } from '../card/CardBacks';
import { CardComponent } from '../card/CardComponent';
import { WasteSlotSVG, StockReloadSlotSVG } from '../card/SlotSVGs';
import { StockCounterBadge } from '../card/StockCounterBadge';

interface StockWasteProps {
  stock: Card[];
  waste: Card[];
  cardBackStyle: CardBackStyle;
  highlightedCardId?: string;
  draggingCardIds?: Set<string>;
  onDealStock: () => void;
  onStartDrag: (e: React.PointerEvent, cards: Card[], from: CardLocation) => void;
  onAutoMove: (card: Card, from: CardLocation) => void;
}

export const StockWaste: React.FC<StockWasteProps> = ({
  stock,
  waste,
  cardBackStyle,
  highlightedCardId,
  draggingCardIds,
  onDealStock,
  onStartDrag,
  onAutoMove,
}) => {
  // Filter out any card currently being dragged
  const visibleWaste = waste.filter((c) => !draggingCardIds?.has(c.id));
  const topVisibleWasteCard = visibleWaste.length > 0 ? visibleWaste[visibleWaste.length - 1] : null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-3.5 w-full">
      {/* Stock Pile */}
      <div className="w-full flex items-center justify-center">
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onDealStock();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          className={`
            relative aspect-[5/7] w-full rounded-[8px]
            ${
              stock.length > 0
                ? 'cursor-pointer hover:scale-[1.03] transition-transform'
                : 'cursor-pointer hover:scale-[1.02] transition-all'
            }
            flex items-center justify-center select-none
          `}
          title={stock.length > 0 ? 'Mazo de reserva: Clic para robar carta' : 'Clic para reciclar mazo'}
        >
          {stock.length > 0 ? (
            <div className="w-full h-full relative">
              {/* Stack depth visual layers if more cards exist */}
              {stock.length > 5 && (
                <div className="absolute -bottom-1 -right-1 w-full h-full rounded-[6px] bg-slate-900 border border-amber-900/40 pointer-events-none -z-10 shadow-sm" />
              )}
              {stock.length > 15 && (
                <div className="absolute -bottom-2 -right-2 w-full h-full rounded-[6px] bg-slate-950 border border-amber-900/30 pointer-events-none -z-20 shadow-md" />
              )}
              <CardBack styleName={cardBackStyle} />

              {/* Luxury Casino Gold Deck Counter Badge */}
              <StockCounterBadge count={stock.length} />
            </div>
          ) : (
            <StockReloadSlotSVG />
          )}
        </motion.div>
      </div>

      {/* Waste Pile with Single-Card Crisp 3D Deal Animation */}
      <div className="w-full flex items-center justify-center">
        <div
          data-drop-target="waste"
          className="relative aspect-[5/7] w-full rounded-[8px] flex items-center justify-center select-none"
        >
          {topVisibleWasteCard ? (
            <div className="w-full h-full relative">
              {/* Single animated card flying from stock and flipping face up */}
              <motion.div
                key={topVisibleWasteCard.id}
                initial={{
                  x: 'calc(-100% - 10px)',
                  rotateY: 180,
                  scale: 1.02,
                }}
                animate={{
                  x: 0,
                  rotateY: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.22,
                  ease: [0.25, 1, 0.5, 1],
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: 1000,
                }}
                className="w-full h-full relative z-10"
              >
                {/* Front Face (Face Up) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(0deg)',
                  }}
                  className="w-full h-full absolute inset-0 rounded-[6px] overflow-hidden"
                >
                  <CardComponent
                    card={topVisibleWasteCard}
                    cardBackStyle={cardBackStyle}
                    isHighlighted={topVisibleWasteCard.id === highlightedCardId}
                    className="!transition-none"
                    onPointerDown={(e) => onStartDrag(e, [topVisibleWasteCard], { type: 'waste' })}
                    onDoubleClick={() => onAutoMove(topVisibleWasteCard, { type: 'waste' })}
                  />
                </div>

                {/* Back Face (Face Down while originating from stock) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className="w-full h-full absolute inset-0 rounded-[6px] overflow-hidden"
                >
                  <CardBack styleName={cardBackStyle} />
                </div>
              </motion.div>
            </div>
          ) : (
            <WasteSlotSVG />
          )}
        </div>
      </div>
    </div>
  );
};
