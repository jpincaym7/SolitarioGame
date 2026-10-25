import { describe, expect, it } from 'vitest';
import { createInitialGame } from './deck';
import { findBestHint } from './hints';
import { canMoveToFoundation, canMoveToTableau, isGameWon, isValidSubstack } from './rules';
import type { Card } from './types';

describe('Solitaire Core Rules', () => {
  it('should initialize a valid 52-card game', () => {
    const game = createInitialGame(1, 12345);
    expect(game.stock.length).toBe(24);
    expect(game.waste.length).toBe(0);
    expect(game.foundations.every((f) => f.length === 0)).toBe(true);

    const totalTableauCards = game.tableau.reduce((acc, col) => acc + col.length, 0);
    expect(totalTableauCards).toBe(28);

    for (let i = 0; i < 7; i++) {
      expect(game.tableau[i].length).toBe(i + 1);
      expect(game.tableau[i][i].faceUp).toBe(true);
      for (let j = 0; j < i; j++) {
        expect(game.tableau[i][j].faceUp).toBe(false);
      }
    }
  });

  it('validates Foundation moves correctly', () => {
    const aceOfHearts: Card = { id: 'hearts-1', suit: 'hearts', rank: 1, faceUp: true };
    const twoOfHearts: Card = { id: 'hearts-2', suit: 'hearts', rank: 2, faceUp: true };
    const twoOfSpades: Card = { id: 'spades-2', suit: 'spades', rank: 2, faceUp: true };
    const kingOfHearts: Card = { id: 'hearts-13', suit: 'hearts', rank: 13, faceUp: true };

    const foundation: Card[] = [];

    expect(canMoveToFoundation(aceOfHearts, foundation)).toBe(true);
    expect(canMoveToFoundation(kingOfHearts, foundation)).toBe(false);
    expect(canMoveToFoundation(twoOfHearts, foundation)).toBe(false);

    foundation.push(aceOfHearts);
    expect(canMoveToFoundation(twoOfHearts, foundation)).toBe(true);
    expect(canMoveToFoundation(twoOfSpades, foundation)).toBe(false);
  });

  it('validates Tableau moves correctly', () => {
    const kingOfSpades: Card = { id: 'spades-13', suit: 'spades', rank: 13, faceUp: true };
    const queenOfHearts: Card = { id: 'hearts-12', suit: 'hearts', rank: 12, faceUp: true };
    const queenOfSpades: Card = { id: 'spades-12', suit: 'spades', rank: 12, faceUp: true };
    const jackOfClubs: Card = { id: 'clubs-11', suit: 'clubs', rank: 11, faceUp: true };

    const emptyColumn: Card[] = [];

    expect(canMoveToTableau(kingOfSpades, emptyColumn)).toBe(true);
    expect(canMoveToTableau(queenOfHearts, emptyColumn)).toBe(false);

    const columnWithKing = [kingOfSpades];
    expect(canMoveToTableau(queenOfHearts, columnWithKing)).toBe(true);
    expect(canMoveToTableau(queenOfSpades, columnWithKing)).toBe(false);

    const columnWithQueen = [kingOfSpades, queenOfHearts];
    expect(canMoveToTableau(jackOfClubs, columnWithQueen)).toBe(true);
  });

  it('validates substacks in tableau', () => {
    const validStack: Card[] = [
      { id: 'spades-13', suit: 'spades', rank: 13, faceUp: true },
      { id: 'hearts-12', suit: 'hearts', rank: 12, faceUp: true },
      { id: 'clubs-11', suit: 'clubs', rank: 11, faceUp: true },
    ];
    expect(isValidSubstack(validStack)).toBe(true);

    const invalidStack: Card[] = [
      { id: 'spades-13', suit: 'spades', rank: 13, faceUp: true },
      { id: 'clubs-12', suit: 'clubs', rank: 12, faceUp: true },
    ];
    expect(isValidSubstack(invalidStack)).toBe(false);
  });

  it('detects win condition', () => {
    const emptyGame = createInitialGame();
    expect(isGameWon(emptyGame.foundations)).toBe(false);

    const winningFoundations: [Card[], Card[], Card[], Card[]] = [
      Array.from({ length: 13 }, (_, i) => ({ id: `hearts-${i + 1}`, suit: 'hearts', rank: (i + 1) as any, faceUp: true })),
      Array.from({ length: 13 }, (_, i) => ({ id: `diamonds-${i + 1}`, suit: 'diamonds', rank: (i + 1) as any, faceUp: true })),
      Array.from({ length: 13 }, (_, i) => ({ id: `clubs-${i + 1}`, suit: 'clubs', rank: (i + 1) as any, faceUp: true })),
      Array.from({ length: 13 }, (_, i) => ({ id: `spades-${i + 1}`, suit: 'spades', rank: (i + 1) as any, faceUp: true })),
    ];
    expect(isGameWon(winningFoundations)).toBe(true);
  });

  it('hints provide valid suggestions', () => {
    const game = createInitialGame(1, 42);
    const hint = findBestHint(game);
    expect(hint).not.toBeNull();
    expect(hint?.reason).toBeDefined();
  });
});
