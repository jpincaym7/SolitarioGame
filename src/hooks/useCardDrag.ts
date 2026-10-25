import { useCallback, useMemo, useRef, useState } from 'react';
import type { Card, CardLocation, FoundationIndex, TableauIndex } from '../core/types';

export interface DraggingData {
  cards: Card[];
  from: CardLocation;
  startPos: { x: number; y: number };
  currentPos: { x: number; y: number };
  offset: { x: number; y: number };
  cardWidth: number;
  cardHeight: number;
  tilt: number;
}

export type HoveredDropTarget =
  | { type: 'tableau'; index: TableauIndex }
  | { type: 'foundation'; index: FoundationIndex }
  | null;

interface UseCardDragProps {
  onDrop: (from: CardLocation, to: CardLocation, cards: Card[]) => boolean;
  onAutoMove: (card: Card, from: CardLocation) => void;
}

export function useCardDrag({ onDrop, onAutoMove }: UseCardDragProps) {
  const [draggingData, setDraggingData] = useState<DraggingData | null>(null);
  const [hoveredDropTarget, setHoveredDropTarget] = useState<HoveredDropTarget>(null);
  const dragRef = useRef<DraggingData | null>(null);
  const hasMovedRef = useRef<boolean>(false);
  const clickTimerRef = useRef<{ time: number; cardId: string } | null>(null);
  const lastXRef = useRef<number>(0);

  const startDrag = useCallback(
    (
      e: React.PointerEvent,
      cards: Card[],
      from: CardLocation
    ) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      const targetEl = e.currentTarget as HTMLElement;
      const rect = targetEl.getBoundingClientRect();

      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      hasMovedRef.current = false;
      lastXRef.current = e.clientX;

      const newDrag: DraggingData = {
        cards,
        from,
        startPos: { x: e.clientX, y: e.clientY },
        currentPos: { x: e.clientX, y: e.clientY },
        offset: { x: offsetX, y: offsetY },
        cardWidth: rect.width,
        cardHeight: rect.height,
        tilt: 0,
      };

      dragRef.current = newDrag;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!dragRef.current) return;
        const dx = Math.abs(moveEvent.clientX - dragRef.current.startPos.x);
        const dy = Math.abs(moveEvent.clientY - dragRef.current.startPos.y);

        if (dx > 4 || dy > 4) {
          hasMovedRef.current = true;
          
          // Calculate subtle physical tilt based on horizontal velocity (-3deg to +3deg)
          const deltaX = moveEvent.clientX - lastXRef.current;
          lastXRef.current = moveEvent.clientX;
          const tilt = Math.max(-4, Math.min(4, deltaX * 0.4));

          dragRef.current = {
            ...dragRef.current,
            currentPos: { x: moveEvent.clientX, y: moveEvent.clientY },
            tilt,
          };
          setDraggingData({ ...dragRef.current });

          // Detect drop target under cursor in real-time
          const elements = document.elementsFromPoint(moveEvent.clientX, moveEvent.clientY);
          let targetFound: HoveredDropTarget = null;

          for (const el of elements) {
            const targetAttr = el.getAttribute('data-drop-target');
            if (!targetAttr) continue;

            if (targetAttr.startsWith('tableau-')) {
              const index = parseInt(targetAttr.replace('tableau-', ''), 10) as TableauIndex;
              if (index >= 0 && index <= 6) {
                targetFound = { type: 'tableau', index };
                break;
              }
            } else if (targetAttr.startsWith('foundation-')) {
              const index = parseInt(targetAttr.replace('foundation-', ''), 10) as FoundationIndex;
              if (index >= 0 && index <= 3) {
                targetFound = { type: 'foundation', index };
                break;
              }
            }
          }

          setHoveredDropTarget(targetFound);
        }
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);

        const currentDrag = dragRef.current;
        dragRef.current = null;
        setDraggingData(null);
        setHoveredDropTarget(null);

        if (!currentDrag) return;

        // If pointer barely moved, treat as single or double click auto-move
        if (!hasMovedRef.current) {
          const now = Date.now();
          const cardId = currentDrag.cards[0]?.id;

          if (
            clickTimerRef.current &&
            clickTimerRef.current.cardId === cardId &&
            now - clickTimerRef.current.time < 350
          ) {
            clickTimerRef.current = null;
            onAutoMove(currentDrag.cards[0], currentDrag.from);
          } else {
            clickTimerRef.current = { time: now, cardId };
            onAutoMove(currentDrag.cards[0], currentDrag.from);
          }
          return;
        }

        // Search for drop target on pointer up
        const elements = document.elementsFromPoint(upEvent.clientX, upEvent.clientY);
        let dropTargetFound: CardLocation | null = null;

        for (const el of elements) {
          const targetAttr = el.getAttribute('data-drop-target');
          if (!targetAttr) continue;

          if (targetAttr.startsWith('foundation-')) {
            const index = parseInt(targetAttr.replace('foundation-', ''), 10);
            if (index >= 0 && index <= 3) {
              dropTargetFound = { type: 'foundation', index: index as FoundationIndex };
              break;
            }
          }

          if (targetAttr.startsWith('tableau-')) {
            const index = parseInt(targetAttr.replace('tableau-', ''), 10);
            if (index >= 0 && index <= 6) {
              dropTargetFound = { type: 'tableau', index: index as TableauIndex, cardIndex: 0 };
              break;
            }
          }
        }

        if (dropTargetFound) {
          onDrop(currentDrag.from, dropTargetFound, currentDrag.cards);
        }
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerup', handlePointerUp, { passive: true });
    },
    [onDrop, onAutoMove]
  );

  const draggingCardIds = useMemo(() => {
    if (!draggingData) return new Set<string>();
    return new Set(draggingData.cards.map((c) => c.id));
  }, [draggingData]);

  return {
    draggingData,
    startDrag,
    draggingCardIds,
    hoveredDropTarget,
  };
}
