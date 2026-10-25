import React from 'react';
import { PlayingCardsLogo } from './PlayingCardsLogo';
import {
  RotateCcw,
  Undo2,
  Redo2,
  Lightbulb,
  Sparkles,
  Zap,
  Menu,
  Clock,
  RotateCw,
  Swords,
} from 'lucide-react';

interface GameHUDProps {
  score: number;
  time: number;
  moves: number;
  drawCount: 1 | 3;
  canUndo: boolean;
  canRedo: boolean;
  canAutoComplete: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onAutoComplete: () => void;
  onNewGame: () => void;
  onToggleDrawCount: () => void;
  onOpenMenu: () => void;
  onOpenGuide?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  time,
  moves,
  drawCount,
  canUndo,
  canRedo,
  canAutoComplete,
  onUndo,
  onRedo,
  onHint,
  onAutoComplete,
  onNewGame,
  onToggleDrawCount,
  onOpenMenu,
  onOpenGuide,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full px-2 sm:px-4 pt-2.5 pb-1 select-none z-30">
      {/* High-Fantasy Console HUD Plaque */}
      <header className="max-w-7xl mx-auto bg-gradient-to-b from-[#141824]/95 via-[#0e111a]/98 to-[#080a10]/98 border border-amber-500/30 border-b-2 border-b-[#05060a] rounded-2xl px-3 sm:px-5 py-2 flex items-center justify-between text-white shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(251,191,36,0.15)] backdrop-blur-md relative overflow-hidden">
        {/* Subtle ambient fantasy gold glow line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* Left Module: Royal Crest & Title in Cinzel Fantasy Typography */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div
            onClick={onOpenMenu}
            className="flex items-center space-x-2.5 cursor-pointer group"
            title="Solitario Real • Desarrollado por Jordy Pincay (Esc / M)"
          >
            <div className="transition-transform duration-200 group-hover:scale-105 active:scale-95 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <PlayingCardsLogo size="sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-sm sm:text-base tracking-[0.2em] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] leading-none">
                SOLITARIO
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-amber-400/90 mt-1 hidden sm:inline">
                KLONDIKE REAL
              </span>
            </div>
          </div>

          {/* Runic Draw Mode Badge */}
          <button
            onClick={onToggleDrawCount}
            className="game-btn flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-b from-[#1e2332] to-[#121622] hover:from-[#272e42] hover:to-[#171c2b] border border-amber-500/40 text-amber-300 text-xs font-bold font-game-ui shadow-sm active:translate-y-0.5 cursor-pointer"
            title="Alternar entre Robo de 1 o 3 cartas"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" strokeWidth={2.4} />
            <span className="font-cinzel text-xs font-black tracking-wider">
              {drawCount === 1 ? '1 CARTA' : '3 CARTAS'}
            </span>
          </button>
        </div>

        {/* Center Module: High-Fantasy Meters (Score, Time, Moves) */}
        <div className="flex items-center space-x-2 sm:space-x-5 bg-[#05070d]/90 border border-[#232a3c] rounded-xl px-3 sm:px-5 py-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)]">
          {/* Puntos (Gold Runic Meter) */}
          <div className="flex flex-col items-center px-1">
            <span className="text-[9px] uppercase font-cinzel font-black tracking-[0.15em] text-amber-400/80 leading-none">
              PUNTOS
            </span>
            <span className="font-game-num text-lg sm:text-2xl font-black text-amber-300 leading-tight drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">
              {score}
            </span>
          </div>

          <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#2b334a] to-transparent" />

          {/* Tiempo (Cyan Chronometer) */}
          <div className="flex flex-col items-center px-1">
            <span className="text-[9px] uppercase font-cinzel font-black tracking-[0.15em] text-cyan-400/80 leading-none flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-cyan-400" strokeWidth={2.2} />
              TIEMPO
            </span>
            <span className="font-game-num text-lg sm:text-2xl font-black text-cyan-300 leading-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
              {formatTime(time)}
            </span>
          </div>

          <div className="w-px h-6 bg-gradient-to-b from-transparent via-[#2b334a] to-transparent" />

          {/* Movimientos (Emerald Tactician Meter) */}
          <div className="flex flex-col items-center px-1">
            <span className="text-[9px] uppercase font-cinzel font-black tracking-[0.15em] text-emerald-400/80 leading-none flex items-center gap-1">
              <RotateCw className="w-2.5 h-2.5 text-emerald-400" strokeWidth={2.2} />
              MOVS
            </span>
            <span className="font-game-num text-lg sm:text-2xl font-black text-emerald-400 leading-tight drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]">
              {moves}
            </span>
          </div>
        </div>

        {/* Right Module: Console-Style Action Buttons with Key Prompts */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Autocomplete Button (When Solvable) */}
          {canAutoComplete && (
            <button
              onClick={onAutoComplete}
              className="game-btn px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/70 border-b-2 border-b-emerald-950 text-white font-cinzel font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/30 animate-pulse cursor-pointer"
              title="Autocompletar partida resuelta"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2.2} />
              <span className="hidden md:inline tracking-wider">RESOLVER</span>
            </button>
          )}

          {/* Undo Button with Key Prompt */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`game-btn px-2.5 sm:px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 text-xs font-game-ui transition-all ${
              canUndo
                ? 'bg-[#151926] hover:bg-[#202638] text-zinc-200 border-[#2b354d] border-b-2 border-b-[#0b0d14] cursor-pointer'
                : 'bg-[#0f121a]/50 text-zinc-600 border-transparent cursor-not-allowed shadow-none'
            }`}
            title="Deshacer jugada (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5 text-zinc-300" strokeWidth={2} />
            <span className="hidden lg:inline text-xs font-bold">Deshacer</span>
            <span className="hidden xl:inline text-[9px] font-mono text-zinc-400 bg-black/40 px-1 rounded">
              Z
            </span>
          </button>

          {/* Redo Button */}
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`game-btn p-1.5 sm:px-2.5 rounded-xl border flex items-center text-xs font-game-ui transition-all ${
              canRedo
                ? 'bg-[#151926] hover:bg-[#202638] text-zinc-200 border-[#2b354d] border-b-2 border-b-[#0b0d14] cursor-pointer'
                : 'bg-[#0f121a]/50 text-zinc-600 border-transparent cursor-not-allowed shadow-none'
            }`}
            title="Rehacer jugada (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5 text-zinc-300" strokeWidth={2} />
          </button>

          {/* Hint Button with Console Glyph */}
          <button
            onClick={onHint}
            className="game-btn px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#2a2416] to-[#1c170c] hover:from-[#3a311e] hover:to-[#241e10] border border-amber-500/50 border-b-2 border-b-[#0d0b06] text-amber-300 font-cinzel font-black flex items-center space-x-1.5 text-xs shadow-sm cursor-pointer"
            title="Pedir pista táctica (H)"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse" strokeWidth={2.2} />
            <span className="hidden sm:inline tracking-wider">Pista</span>
            <span className="text-[9px] font-mono font-bold text-amber-200 bg-black/40 px-1 py-0.5 rounded border border-amber-500/30">
              H
            </span>
          </button>

          {/* Interactive Tutor Guide Button */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="game-btn px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-500 hover:to-yellow-500 text-white border border-amber-300/80 border-b-2 border-b-amber-950 font-cinzel font-black text-xs flex items-center space-x-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
              title="Guía con Lucina & Ike (G)"
            >
              <Swords className="w-3.5 h-3.5 text-amber-100" strokeWidth={2.2} />
              <span className="hidden md:inline tracking-wider">Tutor</span>
              <span className="text-[9px] font-mono font-bold text-white bg-black/40 px-1 py-0.5 rounded">
                G
              </span>
            </button>
          )}

          {/* New Game Button */}
          <button
            onClick={onNewGame}
            className="game-btn px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#151926] hover:bg-[#202638] text-zinc-200 hover:text-white border border-[#2b354d] border-b-2 border-b-[#0b0d14] font-game-ui font-bold text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer transition-colors"
            title="Nueva Partida (N)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" strokeWidth={2.2} />
            <span className="hidden sm:inline">Nuevo</span>
            <span className="hidden sm:inline text-[9px] font-mono text-zinc-400 bg-black/40 px-1 rounded">
              N
            </span>
          </button>

          {/* Main Menu & Pause Button */}
          <button
            onClick={onOpenMenu}
            className="game-btn px-2.5 py-1.5 rounded-xl bg-[#181d2c] hover:bg-[#242c42] border border-amber-500/40 border-b-2 border-b-[#0a0c12] text-amber-300 flex items-center gap-1 shadow-sm cursor-pointer"
            title="Menú de Pausa (Esc / M)"
          >
            <Menu className="w-4 h-4 text-amber-300" strokeWidth={2.2} />
            <span className="text-[9px] font-mono font-bold text-amber-200 bg-black/40 px-1 rounded border border-amber-500/20">
              ESC
            </span>
          </button>
        </div>
      </header>
    </div>
  );
};

export default GameHUD;
