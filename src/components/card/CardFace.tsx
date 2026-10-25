import React from 'react';
import type { Card } from '../../core/types';
import { getRankName, getSuitSymbol } from '../../core/deck';

interface CardFaceProps {
  card: Card;
}

export const CardFace: React.FC<CardFaceProps> = ({ card }) => {
  const suitLetter = card.suit[0]; // 'h', 'd', 'c', 's'
  const svgPath = `/cards/${card.rank}${suitLetter}.svg`;

  return (
    <div className="w-full h-full relative rounded-md overflow-hidden bg-white flex items-center justify-center select-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]">
      <img
        src={svgPath}
        alt={`${getRankName(card.rank)} de ${getSuitSymbol(card.suit)}`}
        className="w-full h-full object-fill pointer-events-none select-none"
        draggable={false}
        loading="eager"
      />
    </div>
  );
};
