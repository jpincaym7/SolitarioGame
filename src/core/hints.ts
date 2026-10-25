import { getRankName, getSuitSymbol } from './deck';
import { canMoveToFoundation, canMoveToTableau, isValidSubstack } from './rules';
import type { FoundationIndex, GameState, Hint, TableauIndex } from './types';

export function findBestHint(state: GameState): Hint | null {
  // Strategy 1: Move card to Foundation (gives points, clears space)
  for (let c = 0; c < 7; c++) {
    const col = state.tableau[c];
    if (col.length === 0) continue;
    const card = col[col.length - 1];
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, state.foundations[f])) {
        return {
          from: {
            location: { type: 'tableau', index: c as TableauIndex, cardIndex: col.length - 1 },
            card,
          },
          to: {
            location: { type: 'foundation', index: f as FoundationIndex },
            targetDescription: `Fundación ${f + 1}`,
          },
          reason: `Mueve el ${getRankName(card.rank)} de ${getSuitSymbol(card.suit)} a la Fundación para asegurar puntos.`,
        };
      }
    }
  }

  // Strategy 2: Move Waste card to Foundation
  if (state.waste.length > 0) {
    const card = state.waste[state.waste.length - 1];
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(card, state.foundations[f])) {
        return {
          from: {
            location: { type: 'waste' },
            card,
          },
          to: {
            location: { type: 'foundation', index: f as FoundationIndex },
            targetDescription: `Fundación ${f + 1}`,
          },
          reason: `Coloca el ${getRankName(card.rank)} de ${getSuitSymbol(card.suit)} del descarte en la Fundación.`,
        };
      }
    }
  }

  // Strategy 3: Tableau to Tableau move that uncovers a face-down card!
  for (let sourceColIdx = 0; sourceColIdx < 7; sourceColIdx++) {
    const sourceCol = state.tableau[sourceColIdx];
    if (sourceCol.length === 0) continue;

    const firstFaceUpIdx = sourceCol.findIndex((c) => c.faceUp);
    if (firstFaceUpIdx === -1) continue;

    const revealsCard = firstFaceUpIdx > 0;

    for (let cardIdx = firstFaceUpIdx; cardIdx < sourceCol.length; cardIdx++) {
      const movingSubstack = sourceCol.slice(cardIdx);
      if (!isValidSubstack(movingSubstack)) continue;

      const movingCard = movingSubstack[0];

      if (movingCard.rank === 13 && cardIdx === 0) continue;

      for (let targetColIdx = 0; targetColIdx < 7; targetColIdx++) {
        if (targetColIdx === sourceColIdx) continue;
        const targetCol = state.tableau[targetColIdx];

        if (canMoveToTableau(movingCard, targetCol)) {
          if (revealsCard || targetCol.length > 0) {
            return {
              from: {
                location: { type: 'tableau', index: sourceColIdx as TableauIndex, cardIndex: cardIdx },
                card: movingCard,
              },
              to: {
                location: {
                  type: 'tableau',
                  index: targetColIdx as TableauIndex,
                  cardIndex: targetCol.length,
                },
                targetDescription: `Columna ${targetColIdx + 1}`,
              },
              reason: revealsCard
                ? `Mueve la secuencia que empieza con ${getRankName(movingCard.rank)} de ${getSuitSymbol(movingCard.suit)} para revelar una carta oculta.`
                : `Coloca el ${getRankName(movingCard.rank)} de ${getSuitSymbol(movingCard.suit)} sobre la columna ${targetColIdx + 1}.`,
            };
          }
        }
      }
    }
  }

  // Strategy 4: Move Waste card to Tableau
  if (state.waste.length > 0) {
    const card = state.waste[state.waste.length - 1];
    for (let targetColIdx = 0; targetColIdx < 7; targetColIdx++) {
      const targetCol = state.tableau[targetColIdx];
      if (canMoveToTableau(card, targetCol)) {
        return {
          from: {
            location: { type: 'waste' },
            card,
          },
          to: {
            location: {
              type: 'tableau',
              index: targetColIdx as TableauIndex,
              cardIndex: targetCol.length,
            },
            targetDescription: `Columna ${targetColIdx + 1}`,
          },
          reason: `Coloca el ${getRankName(card.rank)} de ${getSuitSymbol(card.suit)} del descarte en la Columna ${targetColIdx + 1}.`,
        };
      }
    }
  }

  // Strategy 5: Deal cards from stock
  if (state.stock.length > 0 || state.waste.length > 0) {
    return {
      from: {
        location: { type: 'stock' },
        card: {
          id: 'stock-card',
          suit: 'spades',
          rank: 1,
          faceUp: false,
        },
      },
      to: {
        location: { type: 'waste' },
        targetDescription: 'Descarte',
      },
      reason: state.stock.length > 0 ? 'Roba cartas del mazo de reserva para buscar nuevas opciones.' : 'Recicla el mazo de descarte para una nueva ronda.',
    };
  }

  return null;
}
