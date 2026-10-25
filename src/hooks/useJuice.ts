import { useState, useCallback, useRef } from 'react';

export interface ClickRipple {
  id: string;
  x: number;
  y: number;
}

export interface ScoreNotificationItem {
  id: string;
  delta: number;
  totalScore: number;
  label: string;
}

export function useJuice() {
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [notification, setNotification] = useState<ScoreNotificationItem | null>(null);

  const timeoutRef = useRef<number | null>(null);
  const lastEventRef = useRef<{ time: number; key: string }>({ time: 0, key: '' });

  // 1. Subtle golden click sparks at pointer coordinates
  const triggerClickRipple = useCallback((x: number, y: number) => {
    const id = `ripple-${Date.now()}-${Math.random()}`;
    setRipples((prev) => [...prev.slice(-4), { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 380);
  }, []);

  // 2. COD / Arcade ephemeral score popup: single clean line, auto-vanishes in 1.3s
  const triggerScoreEvent = useCallback(
    (delta: number, label: string, totalScore: number) => {
      if (delta === 0) return;

      const now = Date.now();
      const eventKey = `${delta}-${label}-${totalScore}`;

      // Prevent duplicate triggers within 350ms
      if (lastEventRef.current.key === eventKey && now - lastEventRef.current.time < 350) {
        return;
      }
      lastEventRef.current = { time: now, key: eventKey };

      // Set single active notification
      setNotification({
        id: `notif-${now}`,
        delta,
        totalScore,
        label,
      });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setNotification(null);
      }, 2200);
    },
    []
  );

  const resetJuice = useCallback(() => {
    setNotification(null);
    setRipples([]);
  }, []);

  return {
    ripples,
    notification,
    triggerClickRipple,
    triggerScoreEvent,
    resetJuice,
  };
}
