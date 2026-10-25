import React from 'react';
import type { Card, CardBackStyle } from '../../core/types';
import { CardBack } from './CardBacks';
import { CardFace } from './CardFace';

interface CardComponentProps {
  card: Card;
  cardBackStyle: CardBackStyle;
  isHighlighted?: boolean;
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  cardBackStyle,
  isHighlighted = false,
  isDragging = false,
  onClick,
  onDoubleClick,
  onPointerDown,
  className = '',
  style,
}) => {
  return (
    <div
      onPointerDown={onPointerDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={style}
      className={`
        relative select-none aspect-[5/7] rounded-[6px] transition-all duration-150
        touch-none cursor-pointer overflow-hidden
        ${
          isDragging
            ? 'opacity-95 scale-105 z-50 shadow-[0_24px_38px_rgba(0,0,0,0.55),0_10px_16px_rgba(0,0,0,0.4)] rotate-1 cursor-grabbing'
            : 'shadow-[0_3px_6px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.35)] hover:-translate-y-0.5'
        }
        ${
          isHighlighted
            ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-emerald-950 shadow-[0_0_22px_rgba(251,191,36,0.9)] animate-pulse'
            : ''
        }
        ${className}
      `}
    >
      {card.faceUp ? (
        <CardFace card={card} />
      ) : (
        <CardBack styleName={cardBackStyle} />
      )}
    </div>
  );
};
