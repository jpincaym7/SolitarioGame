import { useCallback, useEffect, useRef, useState } from 'react';
import { createInitialGame } from '../core/deck';
import { findBestHint } from '../core/hints';
import { cloneGameState, HistoryManager } from '../core/history';
import {
  canMoveToFoundation,
  canMoveToTableau,
  findLegalFoundation,
  findLegalTableau,
  isGameWon,
  isValidSubstack,
} from '../core/rules';
import { SCORE_VALUES } from '../core/scoring';
import { findNextAutoCompleteMove, isSolvableByAutoComplete } from '../core/solver';
import type { Card, CardLocation, GameState, Hint } from '../core/types';

export interface RecentArrivals {
  cardIds: Set<string>;
  cardOrder: string[];
  to: CardLocation;
  timestamp: number;
}

interface UseSolitaireGameProps {
  initialDrawCount?: 1 | 3;
  onCardFlip?: () => void;
  onCardPlace?: (count?: number, isFoundation?: boolean) => void;
  onDeal?: () => void;
  onDealSequence?: () => void;
  onScoreEvent?: (delta: number, label: string, totalScore: number) => void;
  onInvalid?: () => void;
  onVictory?: () => void;
  onGameWon?: (time: number, moves: number, score: number) => void;
}

export function useSolitaireGame({
  initialDrawCount = 1,
  onCardFlip,
  onCardPlace,
  onDeal,
  onDealSequence,
  onScoreEvent,
  onInvalid,
  onVictory,
  onGameWon,
}: UseSolitaireGameProps) {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGame(initialDrawCount));
  const historyRef = useRef<HistoryManager>(new HistoryManager());
  const [activeHint, setActiveHint] = useState<Hint | null>(null);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [recentArrivals, setRecentArrivals] = useState<RecentArrivals | null>(null);
  const [dealAnimationKey, setDealAnimationKey] = useState<number>(1);
  const [isDealing, setIsDealing] = useState<boolean>(true);
  const autoCompleteTimerRef = useRef<number | null>(null);

  const prevScoreRef = useRef<number>(gameState.score);
  const lastScoreEventRef = useRef<{ delta: number; label: string } | null>(null);
  const lastDealTimeRef = useRef<number>(0);

  // Trigger score events reliably whenever committed gameState.score changes
  useEffect(() => {
    const diff = gameState.score - prevScoreRef.current;
    prevScoreRef.current = gameState.score;

    if (diff !== 0 && gameState.startedAt !== null) {
      const label = lastScoreEventRef.current?.label || (diff > 0 ? 'Puntos' : 'Penalización');
      onScoreEvent?.(diff, label, gameState.score);
      lastScoreEventRef.current = null;
    }
  }, [gameState.score, gameState.startedAt, onScoreEvent]);

  // Manage dealing animation lifecycle (1050ms deal duration)
  useEffect(() => {
    setIsDealing(true);
    const timer = setTimeout(() => {
      setIsDealing(false);
    }, 1050);
    return () => clearTimeout(timer);
  }, [dealAnimationKey]);

  // Timer loop
  useEffect(() => {
    if (gameState.status !== 'playing' || gameState.startedAt === null) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;
        return {
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, gameState.startedAt]);

  const markGameStarted = useCallback(() => {
    setGameState((prev) => {
      if (prev.startedAt !== null) return prev;
      return {
        ...prev,
        startedAt: Date.now(),
      };
    });
  }, []);

  const clearHint = useCallback(() => {
    setActiveHint(null);
  }, []);

  // Stock / Waste dealing logic
  const dealStock = useCallback(() => {
    const now = Date.now();
    // Guard against double clicks / rapid synthetic event bounces (260ms cooldown)
    if (now - lastDealTimeRef.current < 260) {
      return;
    }
    lastDealTimeRef.current = now;

    clearHint();
    markGameStarted();

    setGameState((prev) => {
      const next = cloneGameState(prev);
      historyRef.current.pushState(prev);

      if (next.stock.length > 0) {
        const countToDraw = Math.min(next.drawCount, next.stock.length);
        const drawnCards: Card[] = [];

        for (let i = 0; i < countToDraw; i++) {
          const card = next.stock.pop()!;
          card.faceUp = true;
          drawnCards.push(card);
        }

        next.waste.push(...drawnCards);
        next.moves += 1;
        onDeal?.();
      } else if (next.waste.length > 0) {
        next.stock = next.waste.reverse().map((c) => ({ ...c, faceUp: false }));
        next.waste = [];
        next.moves += 1;
        const penalty =
          next.drawCount === 1 ? SCORE_VALUES.RECYCLE_WASTE_TURN1 : SCORE_VALUES.RECYCLE_WASTE_TURN3;
        next.score = Math.max(0, next.score + penalty);
        lastScoreEventRef.current = { delta: penalty, label: 'Reciclar Mazo' };
        onDeal?.();
      } else {
        onInvalid?.();
        return prev;
      }

      return next;
    });
  }, [clearHint, markGameStarted, onDeal, onInvalid]);

  // Execute a valid move between any two locations
  const executeMove = useCallback(
    (
      from: CardLocation,
      to: CardLocation,
      cardsToMove: Card[]
    ): boolean => {
      clearHint();
      markGameStarted();

      let success = false;

      setGameState((prev) => {
        const next = cloneGameState(prev);
        let scoreDelta = 0;

        // 1. Destination validation
        if (to.type === 'foundation') {
          if (cardsToMove.length !== 1) {
            onInvalid?.();
            return prev;
          }
          const targetFoundation = next.foundations[to.index];
          if (!canMoveToFoundation(cardsToMove[0], targetFoundation)) {
            onInvalid?.();
            return prev;
          }

          scoreDelta = from.type === 'waste' ? SCORE_VALUES.WASTE_TO_FOUNDATION : SCORE_VALUES.TABLEAU_TO_FOUNDATION;
        } else if (to.type === 'tableau') {
          const targetColumn = next.tableau[to.index];
          if (!canMoveToTableau(cardsToMove[0], targetColumn)) {
            onInvalid?.();
            return prev;
          }

          scoreDelta = from.type === 'waste' ? SCORE_VALUES.WASTE_TO_TABLEAU : 0;
        } else {
          onInvalid?.();
          return prev;
        }

        // 2. Remove cards from source
        let cardRevealed = false;
        if (from.type === 'waste') {
          next.waste.pop();
        } else if (from.type === 'tableau') {
          const sourceCol = next.tableau[from.index];
          sourceCol.splice(from.cardIndex, cardsToMove.length);

          if (sourceCol.length > 0) {
            const topCard = sourceCol[sourceCol.length - 1];
            if (!topCard.faceUp) {
              topCard.faceUp = true;
              scoreDelta += SCORE_VALUES.REVEAL_TABLEAU_CARD;
              cardRevealed = true;
              onCardFlip?.();
            }
          }
        } else if (from.type === 'foundation') {
          next.foundations[from.index].pop();
          scoreDelta += SCORE_VALUES.FOUNDATION_TO_TABLEAU;
        }

        // 3. Add cards to destination
        if (to.type === 'foundation') {
          next.foundations[to.index].push(cardsToMove[0]);
        } else if (to.type === 'tableau') {
          next.tableau[to.index].push(...cardsToMove);
        }

        historyRef.current.pushState(prev);

        next.moves += 1;
        next.score = Math.max(0, next.score + scoreDelta);
        onCardPlace?.(cardsToMove.length, to.type === 'foundation');

        if (scoreDelta !== 0) {
          let scoreLabel = 'Movimiento';
          if (to.type === 'foundation') {
            scoreLabel = cardRevealed ? 'A Fundación + Revelar' : 'A Fundación';
          } else if (cardRevealed) {
            scoreLabel = 'Carta Revelada';
          } else if (from.type === 'waste' && to.type === 'tableau') {
            scoreLabel = 'Mazo a Columna';
          } else if (from.type === 'foundation') {
            scoreLabel = 'De Fundación';
          }
          lastScoreEventRef.current = { delta: scoreDelta, label: scoreLabel };
        }

        // Track recently arrived cards for tactile physical landing animation
        setRecentArrivals({
          cardIds: new Set(cardsToMove.map((c) => c.id)),
          cardOrder: cardsToMove.map((c) => c.id),
          to,
          timestamp: Date.now(),
        });

        // Clear arrival animation state after settle duration
        window.setTimeout(() => {
          setRecentArrivals((curr) => (curr && Date.now() - curr.timestamp >= 400 ? null : curr));
        }, 450);

        if (isGameWon(next.foundations)) {
          next.status = 'won';
          onVictory?.();
          onGameWon?.(next.elapsedSeconds, next.moves, next.score);
        }

        success = true;
        return next;
      });

      return success;
    },
    [clearHint, markGameStarted, onCardFlip, onCardPlace, onGameWon, onInvalid, onVictory]
  );

  // Smart Auto-Move
  const smartAutoMove = useCallback(
    (card: Card, fromLocation: CardLocation) => {
      if (!card.faceUp) return;

      const foundationIdx = findLegalFoundation(card, gameState.foundations);
      if (foundationIdx !== null) {
        executeMove(fromLocation, { type: 'foundation', index: foundationIdx }, [card]);
        return;
      }

      if (fromLocation.type === 'tableau') {
        const sourceCol = gameState.tableau[fromLocation.index];
        const cardsToMove = sourceCol.slice(fromLocation.cardIndex);
        if (isValidSubstack(cardsToMove)) {
          const targetColIdx = findLegalTableau(card, gameState.tableau, fromLocation.index);
          if (targetColIdx !== null) {
            executeMove(fromLocation, { type: 'tableau', index: targetColIdx, cardIndex: 0 }, cardsToMove);
            return;
          }
        }
      } else if (fromLocation.type === 'waste') {
        const targetColIdx = findLegalTableau(card, gameState.tableau);
        if (targetColIdx !== null) {
          executeMove(fromLocation, { type: 'tableau', index: targetColIdx, cardIndex: 0 }, [card]);
          return;
        }
      }

      onInvalid?.();
    },
    [executeMove, gameState.foundations, gameState.tableau, onInvalid]
  );

  // Undo / Redo
  const undo = useCallback(() => {
    clearHint();
    const previous = historyRef.current.undo(gameState);
    if (previous) {
      setGameState(previous);
      onCardPlace?.();
    }
  }, [clearHint, gameState, onCardPlace]);

  const redo = useCallback(() => {
    clearHint();
    const next = historyRef.current.redo(gameState);
    if (next) {
      setGameState(next);
      onCardPlace?.();
    }
  }, [clearHint, gameState, onCardPlace]);

  const canUndo = historyRef.current.canUndo();
  const canRedo = historyRef.current.canRedo();

  const requestHint = useCallback(() => {
    const hint = findBestHint(gameState);
    setActiveHint(hint);
  }, [gameState]);

  const startAutoComplete = useCallback(() => {
    if (!isSolvableByAutoComplete(gameState)) return;
    setIsAutoCompleting(true);
  }, [gameState]);

  useEffect(() => {
    if (!isAutoCompleting) {
      if (autoCompleteTimerRef.current) clearTimeout(autoCompleteTimerRef.current);
      return;
    }

    const nextMove = findNextAutoCompleteMove(gameState);
    if (!nextMove) {
      setIsAutoCompleting(false);
      return;
    }

    autoCompleteTimerRef.current = window.setTimeout(() => {
      if (nextMove.from.type === 'waste') {
        executeMove(
          { type: 'waste' },
          { type: 'foundation', index: nextMove.toFoundationIndex },
          [nextMove.card]
        );
      } else {
        const sourceCol = gameState.tableau[nextMove.from.index];
        executeMove(
          {
            type: 'tableau',
            index: nextMove.from.index,
            cardIndex: sourceCol.length - 1,
          },
          { type: 'foundation', index: nextMove.toFoundationIndex },
          [nextMove.card]
        );
      }
    }, 120);

    return () => {
      if (autoCompleteTimerRef.current) clearTimeout(autoCompleteTimerRef.current);
    };
  }, [isAutoCompleting, gameState, executeMove]);

  const newGame = useCallback(
    (drawCount: 1 | 3 = gameState.drawCount, seed?: number) => {
      clearHint();
      setIsAutoCompleting(false);
      historyRef.current.clear();
      prevScoreRef.current = 0;
      lastScoreEventRef.current = null;
      setGameState(createInitialGame(drawCount, seed));
      setDealAnimationKey((k) => k + 1);
      onDealSequence ? onDealSequence() : onDeal?.();
    },
    [clearHint, gameState.drawCount, onDeal, onDealSequence]
  );

  const restartGame = useCallback(() => {
    clearHint();
    setIsAutoCompleting(false);
    historyRef.current.clear();
    prevScoreRef.current = 0;
    lastScoreEventRef.current = null;
    setGameState(createInitialGame(gameState.drawCount, gameState.dealSeed));
    setDealAnimationKey((k) => k + 1);
    onDealSequence ? onDealSequence() : onDeal?.();
  }, [clearHint, gameState.dealSeed, gameState.drawCount, onDeal, onDealSequence]);

  return {
    gameState,
    activeHint,
    dealStock,
    executeMove,
    smartAutoMove,
    undo,
    redo,
    canUndo,
    canRedo,
    requestHint,
    clearHint,
    newGame,
    restartGame,
    startAutoComplete,
    isAutoCompleting,
    canAutoComplete: isSolvableByAutoComplete(gameState),
    recentArrivals,
    dealAnimationKey,
    isDealing,
  };
}
