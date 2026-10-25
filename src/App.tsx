import { useEffect, useState } from 'react';
import { Foundation } from './components/board/Foundation';
import { StockWaste } from './components/board/StockWaste';
import { Tableau } from './components/board/Tableau';
import { DragLayer } from './components/board/DragLayer';
import { GameHUD } from './components/ui/GameHUD';
import { GameMenuModal } from './components/ui/GameMenuModal';
import { TutorGuideModal } from './components/ui/TutorGuideModal';
import { HintBanner } from './components/ui/HintBanner';
import { WinCelebration } from './components/ui/WinCelebration';
import { JuiceOverlay } from './components/ui/JuiceOverlay';
import { ScoreNotification } from './components/ui/ScoreNotification';
import { DeveloperMedallion } from './components/ui/DeveloperMedallion';
import { ReactBitsBackground } from './components/reactbits/ReactBitsBackground';
import { useCardDrag } from './hooks/useCardDrag';
import { useGameStats } from './hooks/useGameStats';
import { useJuice } from './hooks/useJuice';
import { useSolitaireGame } from './hooks/useSolitaireGame';
import { useSoundEffects } from './hooks/useSoundEffects';

export function App() {
  const {
    stats,
    settings,
    recordGameStarted,
    recordGameWon,
    resetStats,
    updateSettings,
  } = useGameStats();

  const {
    ripples,
    notification,
    triggerClickRipple,
    triggerScoreEvent,
    resetJuice,
  } = useJuice();

  const {
    playCardFlip,
    playCardPlace,
    playDeal,
    playDealSequence,
    playInvalid,
    playVictory,
  } = useSoundEffects(settings.soundEnabled);

  const {
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
    canAutoComplete,
    recentArrivals,
    dealAnimationKey,
    isDealing,
  } = useSolitaireGame({
    initialDrawCount: settings.drawCount,
    onCardFlip: playCardFlip,
    onCardPlace: playCardPlace,
    onDeal: playDeal,
    onDealSequence: playDealSequence,
    onScoreEvent: triggerScoreEvent,
    onInvalid: playInvalid,
    onVictory: playVictory,
    onGameWon: (time, moves, score) => {
      recordGameWon(time, moves, score);
    },
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const { draggingData, startDrag, draggingCardIds, hoveredDropTarget } = useCardDrag({
    onDrop: (from, to, cards) => executeMove(from, to, cards),
    onAutoMove: (card, from) => smartAutoMove(card, from),
  });

  const handleNewGame = (drawCount = settings.drawCount) => {
    resetJuice();
    recordGameStarted();
    newGame(drawCount);
  };

  const handleRestartGame = () => {
    resetJuice();
    restartGame();
  };

  const handleToggleDrawCount = (count?: 1 | 3) => {
    const nextDrawCount: 1 | 3 = count !== undefined ? count : (settings.drawCount === 1 ? 3 : 1);
    updateSettings({ drawCount: nextDrawCount });
    handleNewGame(nextDrawCount);
  };

  // Keyboard accessibility shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGuideOpen) {
        if (e.key === 'Escape') {
          setIsGuideOpen(false);
        }
        return;
      }

      if (isMenuOpen) {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        requestHint();
      } else if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setIsGuideOpen(true);
      } else if (e.key.toLowerCase() === 'm' || e.key === 'Escape') {
        e.preventDefault();
        setIsMenuOpen(true);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewGame();
      } else if (e.key === ' ') {
        e.preventDefault();
        dealStock();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    canRedo,
    canUndo,
    dealStock,
    handleNewGame,
    isGuideOpen,
    isMenuOpen,
    redo,
    requestHint,
    undo,
  ]);

  // Trigger authentic deal audio sequence whenever a new deal/reset occurs
  useEffect(() => {
    playDealSequence();
  }, [dealAnimationKey, playDealSequence]);

  const highlightedCardId = activeHint?.from.card.id;
  const highlightedFoundationIndex =
    activeHint?.to.location.type === 'foundation' ? activeHint.to.location.index : null;
  const highlightedColumnIndex =
    activeHint?.to.location.type === 'tableau' ? activeHint.to.location.index : null;

  return (
    <div
      onPointerDown={(e) => triggerClickRipple(e.clientX, e.clientY)}
      className={`h-screen max-h-screen w-full flex flex-col theme-${settings.theme} transition-colors duration-300 relative select-none font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden`}
    >
      {/* React Bits FX Dynamic Atmosphere Layer (60fps, 0-lag, pointer-events-none) */}
      <ReactBitsBackground theme={settings.theme} />

      {/* Video Game Heads-Up Display (Top HUD) */}
      <GameHUD
        score={gameState.score}
        time={gameState.elapsedSeconds}
        moves={gameState.moves}
        drawCount={settings.drawCount}
        canUndo={canUndo}
        canRedo={canRedo}
        canAutoComplete={canAutoComplete}
        onUndo={undo}
        onRedo={redo}
        onHint={requestHint}
        onAutoComplete={startAutoComplete}
        onNewGame={() => handleNewGame()}
        onToggleDrawCount={() => handleToggleDrawCount()}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* COD-style Ephemeral Floating Score Feed (+10 PUNTOS, fades out, 0 clutter) */}
      <ScoreNotification
        notification={notification}
      />

      {/* Floating Click Sparks & Ripples on Cursor */}
      <JuiceOverlay
        ripples={ripples}
      />

      {/* Main Solitaire Board Felt Area (Fitted 100% in viewport, 0 scroll) */}
      <main className="flex-1 w-full max-w-[860px] lg:max-w-[940px] xl:max-w-[990px] mx-auto px-2 sm:px-4 py-2 sm:py-3 flex flex-col justify-start select-none overflow-hidden">
        {/* Upper Zone: 7-column aligned grid (Stock + Waste + Spacer + 4 Foundations) */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3 md:gap-3.5 w-full mb-3.5 sm:mb-5">
          {/* Stock & Waste across 2 columns */}
          <div className="col-span-2">
            <StockWaste
              stock={gameState.stock}
              waste={gameState.waste}
              cardBackStyle={settings.cardBack}
              highlightedCardId={highlightedCardId}
              draggingCardIds={draggingCardIds}
              onDealStock={dealStock}
              onStartDrag={startDrag}
              onAutoMove={smartAutoMove}
            />
          </div>

          {/* Neutral Spacer column */}
          <div className="col-span-1" />

          {/* 4 Foundations across 4 columns */}
          <div className="col-span-4">
            <Foundation
              foundations={gameState.foundations}
              cardBackStyle={settings.cardBack}
              highlightedFoundationIndex={highlightedFoundationIndex}
              hoveredFoundationIndex={
                hoveredDropTarget?.type === 'foundation' ? hoveredDropTarget.index : null
              }
              draggingCardIds={draggingCardIds}
              recentArrivals={recentArrivals}
              onStartDrag={startDrag}
              onAutoMove={smartAutoMove}
            />
          </div>
        </div>

        {/* Lower Zone: 7 Tableau Columns */}
        <div className="w-full">
          <Tableau
            tableau={gameState.tableau}
            cardBackStyle={settings.cardBack}
            highlightedCardId={highlightedCardId}
            highlightedColumnIndex={highlightedColumnIndex}
            hoveredColumnIndex={
              hoveredDropTarget?.type === 'tableau' ? hoveredDropTarget.index : null
            }
            draggingCardIds={draggingCardIds}
            recentArrivals={recentArrivals}
            dealAnimationKey={dealAnimationKey}
            isDealing={isDealing}
            onStartDrag={startDrag}
            onAutoMove={smartAutoMove}
          />
        </div>
      </main>



      {/* Royal Developer Cameo Medallion (Corner Cameo for Jordy Pincay) */}
      <DeveloperMedallion
        onOpenCredits={() => setIsMenuOpen(true)}
        onSoundFeedback={playCardPlace}
      />

      {/* Non-intrusive Game Toast for Hints */}
      <HintBanner
        hint={activeHint}
        onDismiss={clearHint}
      />

      {/* Interactive NPC Tutor Guide Modal */}
      <TutorGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        soundEnabled={settings.soundEnabled}
        onStepSound={playCardPlace}
      />

      {/* Video Game Pause & Menu Modal (Stats, Customization, Controls) */}
      <GameMenuModal
        isOpen={isMenuOpen}
        settings={settings}
        stats={stats}
        onClose={() => setIsMenuOpen(false)}
        onUpdateSettings={updateSettings}
        onRestartGame={handleRestartGame}
        onNewGameWithDraw={(drawCount) => handleNewGame(drawCount)}
        onResetStats={resetStats}
        onOpenGuide={() => setIsGuideOpen(true)}
        onSoundFeedback={playCardPlace}
      />

      {/* Floating Drag Layer for Active Dragging Stack */}
      <DragLayer
        draggingData={draggingData}
        cardBackStyle={settings.cardBack}
      />

      {/* Game Victory Celebration */}
      {gameState.status === 'won' && (
        <WinCelebration
          score={gameState.score}
          time={gameState.elapsedSeconds}
          moves={gameState.moves}
          onPlayAgain={() => handleNewGame()}
        />
      )}
    </div>
  );
}

export default App;
