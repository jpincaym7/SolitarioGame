import { useCallback, useEffect, useState } from 'react';
import type { GameSettings, GameStats } from '../core/types';

const STATS_STORAGE_KEY = 'solitaire_pro_stats_v1';
const SETTINGS_STORAGE_KEY = 'solitaire_pro_settings_v1';

const DEFAULT_SETTINGS: GameSettings = {
  drawCount: 1,
  theme: 'felt-green',
  cardBack: 'classic-blue',
  soundEnabled: true,
  hapticEnabled: true,
  autoHints: false,
  leftHanded: false,
};

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: null,
  bestMoves: null,
  currentStreak: 0,
  bestStreak: 0,
  totalScore: 0,
};

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Storage unavailable fallback
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable fallback
    }
  }, [settings]);

  const recordGameStarted = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  }, []);

  const recordGameWon = useCallback((elapsedSeconds: number, moves: number, finalScore: number) => {
    setStats((prev) => {
      const newStreak = prev.currentStreak + 1;
      return {
        ...prev,
        gamesWon: prev.gamesWon + 1,
        bestTime: prev.bestTime === null ? elapsedSeconds : Math.min(prev.bestTime, elapsedSeconds),
        bestMoves: prev.bestMoves === null ? moves : Math.min(prev.bestMoves, moves),
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalScore: prev.totalScore + finalScore,
      };
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    stats,
    settings,
    recordGameStarted,
    recordGameWon,
    resetStats,
    updateSettings,
  };
}
