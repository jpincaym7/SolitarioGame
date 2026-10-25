import { getSuitColor } from './deck';
import type { Card, FoundationIndex, TableauIndex } from './types';

export function canMoveToFoundation(card: Card, foundationPile: Card[]): boolean {
  if (foundationPile.length === 0) {
    return card.rank === 1;
  }
  const topCard = foundationPile[foundationPile.length - 1];
  return card.suit === topCard.suit && card.rank === topCard.rank + 1;
}

export function canMoveToTableau(card: Card, tableauColumn: Card[]): boolean {
  if (tableauColumn.length === 0) {
    return card.rank === 13;
  }
  const topCard = tableauColumn[tableauColumn.length - 1];
  if (!topCard.faceUp) return false;
  const isOppositeColor = getSuitColor(card.suit) !== getSuitColor(topCard.suit);
  const isDescending = card.rank === topCard.rank - 1;
  return isOppositeColor && isDescending;
}

export function isValidSubstack(cards: Card[]): boolean {
  if (cards.length === 0) return false;
  if (!cards.every((c) => c.faceUp)) return false;

  for (let i = 0; i < cards.length - 1; i++) {
    const current = cards[i];
    const next = cards[i + 1];
    const isOppositeColor = getSuitColor(current.suit) !== getSuitColor(next.suit);
    const isDescending = current.rank === next.rank + 1;
    if (!isOppositeColor || !isDescending) {
      return false;
    }
  }
  return true;
}

export function findLegalFoundation(
  card: Card,
  foundations: [Card[], Card[], Card[], Card[]]
): FoundationIndex | null {
  for (let i = 0; i < foundations.length; i++) {
    if (canMoveToFoundation(card, foundations[i])) {
      return i as FoundationIndex;
    }
  }
  return null;
}

export function findLegalTableau(
  card: Card,
  tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]],
  excludeCol?: number
): TableauIndex | null {
  let emptySlotIndex: TableauIndex | null = null;

  for (let i = 0; i < tableau.length; i++) {
    if (i === excludeCol) continue;
    const col = tableau[i];
    if (col.length > 0 && canMoveToTableau(card, col)) {
      return i as TableauIndex;
    }
    if (col.length === 0 && canMoveToTableau(card, col) && emptySlotIndex === null) {
      emptySlotIndex = i as TableauIndex;
    }
  }

  return emptySlotIndex;
}

export function isGameWon(foundations: [Card[], Card[], Card[], Card[]]): boolean {
  return foundations.every((f) => f.length === 13);
}

export function isTableauAllFaceUp(tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]]): boolean {
  return tableau.every((col) => col.every((card) => card.faceUp));
}
