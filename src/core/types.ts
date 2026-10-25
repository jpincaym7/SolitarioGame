export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type SuitColor = 'red' | 'black';

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export type FoundationIndex = 0 | 1 | 2 | 3;
export type TableauIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type CardLocation =
  | { type: 'stock' }
  | { type: 'waste' }
  | { type: 'foundation'; index: FoundationIndex }
  | { type: 'tableau'; index: TableauIndex; cardIndex: number };

export interface MoveRecord {
  type: 'tableau-to-tableau' | 'waste-to-tableau' | 'waste-to-foundation' | 'tableau-to-foundation' | 'foundation-to-tableau' | 'deal-stock' | 'recycle-stock';
  from: CardLocation;
  to: CardLocation;
  cards: Card[];
  revealedCardUnderneath?: boolean;
  scoreDelta: number;
  previousStockCards?: Card[]; // Used when recycling waste back to stock
}

export interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: [Card[], Card[], Card[], Card[]];
  tableau: [Card[], Card[], Card[], Card[], Card[], Card[], Card[]];
  score: number;
  moves: number;
  drawCount: 1 | 3;
  status: 'playing' | 'won' | 'paused';
  startedAt: number | null;
  elapsedSeconds: number;
  dealSeed?: number;
}

export interface Hint {
  from: {
    location: CardLocation;
    card: Card;
  };
  to: {
    location: CardLocation;
    targetDescription: string;
  };
  reason: string;
}

export type BoardTheme =
  | 'felt-green'
  | 'midnight-blue'
  | 'dark-wood'
  | 'royal-purple'
  | 'casino-red'
  | 'gradient-ascii'
  | 'silk'
  | 'flux-lines';
export type CardBackStyle = 'classic-blue' | 'classic-red' | 'royal-gold' | 'cyber-dark' | 'geometric-emerald';

export interface GameSettings {
  drawCount: 1 | 3;
  theme: BoardTheme;
  cardBack: CardBackStyle;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  autoHints: boolean;
  leftHanded: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number | null; // in seconds
  bestMoves: number | null;
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
}
