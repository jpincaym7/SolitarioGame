export const SCORE_VALUES = {
  WASTE_TO_TABLEAU: 5,
  WASTE_TO_FOUNDATION: 10,
  TABLEAU_TO_FOUNDATION: 10,
  REVEAL_TABLEAU_CARD: 5,
  FOUNDATION_TO_TABLEAU: -15,
  RECYCLE_WASTE_TURN1: -100,
  RECYCLE_WASTE_TURN3: -20,
};

export function calculateTimeBonus(elapsedSeconds: number, baseScore: number): number {
  if (elapsedSeconds <= 0) return 0;
  // Standard Windows Solitaire time bonus formula
  const bonus = Math.floor(700000 / Math.max(elapsedSeconds, 10));
  return Math.min(bonus, 10000) + baseScore;
}
