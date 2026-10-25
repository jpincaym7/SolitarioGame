import React from 'react';
import type { Card, CardBackStyle, CardLocation, TableauIndex } from '../../core/types';
import type { RecentArrivals } from '../../hooks/useSolitaireGame';
import { CardComponent } from '../card/CardComponent';
import { KingSlotSVG } from '../card/SlotSVGs';

interface TableauProps {
  tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]];
  cardBackStyle: CardBackStyle;
  highlightedCardId?: string;
  highlightedColumnIndex?: number | null;
  hoveredColumnIndex?: number | null;
  draggingCardIds?: Set<string>;
  recentArrivals?: RecentArrivals | null;
  dealAnimationKey?: number;
  isDealing?: boolean;
  onStartDrag: (e: React.PointerEvent, cards: Card[], from: CardLocation) => void;
  onAutoMove: (card: Card, from: CardLocation) => void;
}

export const Tableau: React.FC<TableauProps> = ({
  tableau,
  cardBackStyle,
  highlightedCardId,
  highlightedColumnIndex,
  hoveredColumnIndex,
  draggingCardIds,
  recentArrivals,
  dealAnimationKey = 1,
  isDealing = false,
  onStartDrag,
  onAutoMove,
}) => {
  return (
    <div
      className={`grid grid-cols-7 gap-2 sm:gap-3 md:gap-3.5 w-full [--tableau-col-gap:8px] sm:[--tableau-col-gap:12px] md:[--tableau-col-gap:14px] [--tableau-row-gap:14px] sm:[--tableau-row-gap:20px] ${
        isDealing ? 'pointer-events-none' : ''
      }`}
    >
      {tableau.map((column, colIndex) => {
        const isHovered = hoveredColumnIndex === colIndex;
        const isHintHighlighted = highlightedColumnIndex === colIndex;
        const isColumnActive = isHovered || isHintHighlighted;

        const hasRecentLanding =
          recentArrivals?.to.type === 'tableau' && recentArrivals.to.index === colIndex;

        // Check if all visible cards in this column are currently lifted
        const hasVisibleCards = column.some((c) => !draggingCardIds?.has(c.id));

        const totalCards = column.length;
        // Adaptive vertical cascade: gently auto-condenses when column grows to avoid any screen overflow
        // Face-down cards only expose the patterned top strip
        const faceDownStep = totalCards > 11 ? 8 : totalCards > 8 ? 10 : 12;
        // Face-up cards keep the index (number & suit) crisp and visible
        const faceUpStep = totalCards > 12 ? 16 : totalCards > 9 ? 20 : totalCards > 6 ? 24 : 28;

        let maxTopOffset = 0;
        for (let i = 0; i < totalCards - 1; i++) {
          maxTopOffset += column[i].faceUp ? faceUpStep : faceDownStep;
        }

        return (
          <div
            key={colIndex}
            data-drop-target={`tableau-${colIndex}`}
            style={{
              minHeight: maxTopOffset > 0 ? `calc(100% + ${maxTopOffset}px)` : undefined,
            }}
            className={`
              relative w-full rounded-[8px]
              transition-all duration-200
              ${
                isColumnActive
                  ? 'ring-2 ring-amber-400 bg-amber-400/15 shadow-[0_0_22px_rgba(251,191,36,0.55)] scale-[1.01]'
                  : ''
              }
              ${hasRecentLanding ? 'animate-slot-flash' : ''}
            `}
          >
            {/* Show King slot if column is physically empty OR all its cards are lifted */}
            {!hasVisibleCards ? (
              <div className="w-full aspect-[5/7] select-none pointer-events-none">
                <KingSlotSVG isHighlighted={isColumnActive} />
              </div>
            ) : (
              /* Invisible anchor defining the baseline card height for the column */
              <div className="w-full aspect-[5/7] pointer-events-none opacity-0 select-none" />
            )}

            {column.map((card, cardIndex) => {
              let topOffset = 0;
              for (let i = 0; i < cardIndex; i++) {
                topOffset += column[i].faceUp ? faceUpStep : faceDownStep;
              }

              const isCardHighlighted = card.id === highlightedCardId;
              const isBeingDragged = draggingCardIds?.has(card.id);

              const isNewArrival =
                recentArrivals &&
                recentArrivals.to.type === 'tableau' &&
                recentArrivals.to.index === colIndex &&
                recentArrivals.cardIds.has(card.id);

              const arrivalIndex = isNewArrival
                ? recentArrivals.cardOrder.indexOf(card.id)
                : 0;

              // Deal flight vector from Stock pile (Column 0, top row)
              const dealDx = `calc(-${colIndex} * (100% + var(--tableau-col-gap, 12px)))`;
              const dealDy = `calc(-100% - var(--tableau-row-gap, 16px) - ${topOffset}px)`;

              // Classic Klondike dealing order (row-by-row cascade, 0 to 27)
              let dealIndex = 0;
              for (let r = 0; r < cardIndex; r++) {
                dealIndex += 7 - r;
              }
              dealIndex += colIndex - cardIndex;
              const dealDelayMs = dealIndex * 26;

              return (
                <div
                  key={`${dealAnimationKey}-${card.id}`}
                  style={{
                    top: `${topOffset}px`,
                    '--deal-dx': dealDx,
                    '--deal-dy': dealDy,
                    animationDelay: isDealing
                      ? `${dealDelayMs}ms`
                      : isNewArrival
                      ? `${Math.max(0, arrivalIndex) * 35}ms`
                      : undefined,
                  } as React.CSSProperties}
                  className={`absolute w-full transition-opacity duration-150 ${
                    isBeingDragged ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  } ${
                    isDealing
                      ? 'animate-card-deal-fly'
                      : isNewArrival
                      ? 'animate-card-land'
                      : ''
                  }`}
                >
                  <CardComponent
                    card={card}
                    cardBackStyle={cardBackStyle}
                    isHighlighted={isCardHighlighted}
                    onPointerDown={(e) => {
                      if (!card.faceUp) return;
                      const subStack = column.slice(cardIndex);
                      onStartDrag(e, subStack, {
                        type: 'tableau',
                        index: colIndex as TableauIndex,
                        cardIndex,
                      });
                    }}
                    onDoubleClick={() => {
                      if (card.faceUp) {
                        onAutoMove(card, {
                          type: 'tableau',
                          index: colIndex as TableauIndex,
                          cardIndex,
                        });
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
