import type { Card, GameState, Rank, Suit, SuitColor } from './types';

export const SUITS: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];
export const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function getSuitColor(suit: Suit): SuitColor {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}

export function getRankSymbol(rank: Rank): string {
  switch (rank) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return rank.toString();
  }
}

export function getRankName(rank: Rank): string {
  switch (rank) {
    case 1:
      return 'As';
    case 11:
      return 'Jota';
    case 12:
      return 'Reina';
    case 13:
      return 'Rey';
    default:
      return rank.toString();
  }
}

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'spades':
      return '♠';
    case 'hearts':
      return '♥';
    case 'clubs':
      return '♣';
    case 'diamonds':
      return '♦';
  }
}

export function createDeck(): Card[] {
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        faceUp: false,
      });
    }
  }
  return cards;
}

// Deterministic PRNG (Mulberry32) for reproducible deals
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleDeck(deck: Card[], seed?: number): Card[] {
  const shuffled = deck.map((c) => ({ ...c }));
  const randomFn = seed !== undefined ? mulberry32(seed) : Math.random;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function createInitialGame(drawCount: 1 | 3 = 1, seed?: number): GameState {
  const activeSeed = seed ?? Math.floor(Math.random() * 1000000);
  const deck = shuffleDeck(createDeck(), activeSeed);

  const tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]] = [
    [], [], [], [], [], [], []
  ];

  let cardIndex = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[cardIndex++];
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }

  const stock: Card[] = deck.slice(cardIndex).map((card) => ({
    ...card,
    faceUp: false,
  }));

  return {
    stock,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    score: 0,
    moves: 0,
    drawCount,
    status: 'playing',
    startedAt: null,
    elapsedSeconds: 0,
    dealSeed: activeSeed,
  };
}
