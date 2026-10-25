import React from 'react';
import type { CardBackStyle } from '../../core/types';
import { CardComponent } from '../card/CardComponent';
import type { DraggingData } from '../../hooks/useCardDrag';

interface DragLayerProps {
  draggingData: DraggingData | null;
  cardBackStyle: CardBackStyle;
}

export const DragLayer: React.FC<DragLayerProps> = ({ draggingData, cardBackStyle }) => {
  if (!draggingData) return null;

  const { cards, currentPos, offset, cardWidth, tilt } = draggingData;

  const left = currentPos.x - offset.x;
  const top = currentPos.y - offset.y;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${cardWidth}px`,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `rotate(${tilt}deg) scale(1.05)`,
        transition: 'transform 0.08s ease-out',
      }}
      className="select-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)]"
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          style={{
            position: index === 0 ? 'relative' : 'absolute',
            top: index === 0 ? 0 : `${index * 32}px`,
            left: 0,
            width: '100%',
          }}
        >
          <CardComponent
            card={card}
            cardBackStyle={cardBackStyle}
            isDragging
          />
        </div>
      ))}
    </div>
  );
};
