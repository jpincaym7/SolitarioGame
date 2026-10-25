import { canMoveToFoundation, isGameWon } from './rules';
import type { Card, FoundationIndex, GameState, TableauIndex } from './types';

export function isSolvableByAutoComplete(state: GameState): boolean {
  if (isGameWon(state.foundations)) return false;

  for (const col of state.tableau) {
    for (const card of col) {
      if (!card.faceUp) return false;
    }
  }

  return true;
}

export interface AutoMove {
  from:
    | { type: 'waste' }
    | { type: 'tableau'; index: TableauIndex };
  toFoundationIndex: FoundationIndex;
  card: Card;
}

export function findNextAutoCompleteMove(state: GameState): AutoMove | null {
  if (isGameWon(state.foundations)) return null;

  if (state.waste.length > 0) {
    const wasteCard = state.waste[state.waste.length - 1];
    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(wasteCard, state.foundations[f])) {
        return {
          from: { type: 'waste' },
          toFoundationIndex: f as FoundationIndex,
          card: wasteCard,
        };
      }
    }
  }

  let lowestCandidate: { move: AutoMove; rank: number } | null = null;

  for (let c = 0; c < 7; c++) {
    const col = state.tableau[c];
    if (col.length === 0) continue;
    const topCard = col[col.length - 1];

    for (let f = 0; f < 4; f++) {
      if (canMoveToFoundation(topCard, state.foundations[f])) {
        if (!lowestCandidate || topCard.rank < lowestCandidate.rank) {
          lowestCandidate = {
            move: {
              from: { type: 'tableau', index: c as TableauIndex },
              toFoundationIndex: f as FoundationIndex,
              card: topCard,
            },
            rank: topCard.rank,
          };
        }
      }
    }
  }

  return lowestCandidate ? lowestCandidate.move : null;
}
