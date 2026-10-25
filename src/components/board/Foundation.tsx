import React from 'react';
import type { Card, CardBackStyle, CardLocation, FoundationIndex, Suit } from '../../core/types';
import type { RecentArrivals } from '../../hooks/useSolitaireGame';
import { CardComponent } from '../card/CardComponent';
import { FoundationSlotSVG } from '../card/SlotSVGs';

interface FoundationProps {
  foundations: [Card[], Card[], Card[], Card[]];
  cardBackStyle: CardBackStyle;
  highlightedFoundationIndex?: number | null;
  hoveredFoundationIndex?: number | null;
  draggingCardIds?: Set<string>;
  recentArrivals?: RecentArrivals | null;
  onStartDrag: (e: React.PointerEvent, cards: Card[], from: CardLocation) => void;
  onAutoMove: (card: Card, from: CardLocation) => void;
}

const FOUNDATION_SUITS: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

export const Foundation: React.FC<FoundationProps> = ({
  foundations,
  cardBackStyle,
  highlightedFoundationIndex,
  hoveredFoundationIndex,
  draggingCardIds,
  recentArrivals,
  onStartDrag,
  onAutoMove,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-3.5 w-full">
      {foundations.map((pile, index) => {
        const isHovered = hoveredFoundationIndex === index;
        const isHintHighlighted = highlightedFoundationIndex === index;
        const isSlotActive = isHovered || isHintHighlighted;

        const hasRecentLanding =
          recentArrivals?.to.type === 'foundation' && recentArrivals.to.index === index;

        // Filter out cards currently being dragged
        const visibleCards = pile.filter((c) => !draggingCardIds?.has(c.id));
        const topVisibleCard = visibleCards.length > 0 ? visibleCards[visibleCards.length - 1] : null;

        const isTopCardNewArrival =
          topVisibleCard &&
          recentArrivals &&
          recentArrivals.to.type === 'foundation' &&
          recentArrivals.to.index === index &&
          recentArrivals.cardIds.has(topVisibleCard.id);

        return (
          <div
            key={index}
            data-drop-target={`foundation-${index}`}
            className={`
              relative aspect-[5/7] w-full rounded-[8px]
              transition-all duration-200
              ${
                isSlotActive
                  ? 'ring-2 ring-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.85)] scale-[1.02]'
                  : ''
              }
              ${hasRecentLanding ? 'animate-slot-flash' : ''}
              flex items-center justify-center
            `}
          >
            {topVisibleCard ? (
              <div
                className={`w-full h-full relative ${
                  isTopCardNewArrival ? 'animate-card-land' : ''
                }`}
              >
                {visibleCards.length > 1 && (
                  <div className="absolute -bottom-1 -right-1 w-full h-full rounded-[6px] bg-slate-900/60 pointer-events-none -z-10 shadow-sm" />
                )}
                <CardComponent
                  card={topVisibleCard}
                  cardBackStyle={cardBackStyle}
                  onPointerDown={(e) =>
                    onStartDrag(e, [topVisibleCard], {
                      type: 'foundation',
                      index: index as FoundationIndex,
                    })
                  }
                  onDoubleClick={() =>
                    onAutoMove(topVisibleCard, {
                      type: 'foundation',
                      index: index as FoundationIndex,
                    })
                  }
                />
              </div>
            ) : (
              <FoundationSlotSVG
                suit={FOUNDATION_SUITS[index]}
                isHighlighted={isSlotActive}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
