import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameSettings, GameStats, BoardTheme, CardBackStyle } from '../../core/types';
import { PlayingCardsLogo } from './PlayingCardsLogo';
import {
  X,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  RotateCw,
  Clock,
  Flame,
  Check,
  Swords,
  ChevronRight,
  Sparkles,
  Crown,
  Palette,
  BookOpen,
} from 'lucide-react';

interface GameMenuModalProps {
  isOpen: boolean;
  settings: GameSettings;
  stats: GameStats;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onRestartGame: () => void;
  onNewGameWithDraw: (drawCount: 1 | 3) => void;
  onResetStats: () => void;
  onOpenGuide?: () => void;
  onSoundFeedback?: () => void;
}

type MenuItemId =
  | 'resume'
  | 'new_game'
  | 'draw_mode'
  | 'audio'
  | 'themes'
  | 'rules'
  | 'stats'
  | 'credits';

export const GameMenuModal: React.FC<GameMenuModalProps> = ({
  isOpen,
  settings,
  stats,
  onClose,
  onUpdateSettings,
  onRestartGame,
  onNewGameWithDraw,
  onResetStats,
  onOpenGuide,
  onSoundFeedback,
}) => {
  const [selectedId, setSelectedId] = useState<MenuItemId>('resume');
  const [companion, setCompanion] = useState<'lucina' | 'ike'>('lucina');

  // Menu items list matching the AAA console reference design
  const menuItems: { id: MenuItemId; label: string; sublabel: string; icon: React.ReactNode }[] = [
    { id: 'resume', label: 'CONTINUAR PARTIDA', sublabel: 'Reanudar partida en curso', icon: <Play className="w-4 h-4 text-emerald-400" /> },
    { id: 'new_game', label: 'NUEVA PARTIDA', sublabel: 'Repartir o reiniciar mesa', icon: <RotateCcw className="w-4 h-4 text-amber-400" /> },
    { id: 'draw_mode', label: 'MODO DE ROBO', sublabel: '1 carta casual o 3 de torneo', icon: <Zap className="w-4 h-4 text-sky-400" /> },
    { id: 'audio', label: 'AUDIO & EFECTOS', sublabel: 'Efectos sonoros y voces', icon: <Volume2 className="w-4 h-4 text-purple-400" /> },
    { id: 'themes', label: 'MESA & TAPETES', sublabel: 'Personalizar fieltro y dorsos', icon: <Palette className="w-4 h-4 text-pink-400" /> },
    { id: 'rules', label: 'REGLAS OFICIALES', sublabel: 'Objetivo y puntuación Klondike', icon: <BookOpen className="w-4 h-4 text-teal-400" /> },
    { id: 'stats', label: 'RÉCORDS & LOGROS', sublabel: 'Estadísticas y mejores marcas', icon: <Trophy className="w-4 h-4 text-yellow-400" /> },
    { id: 'credits', label: 'CRÉDITOS', sublabel: 'Jordy Pincay', icon: <Crown className="w-4 h-4 text-amber-400" /> },
  ];

  // Keyboard navigation across the menu items (Up, Down, Enter, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = menuItems.findIndex((m) => m.id === selectedId);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onSoundFeedback?.();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        setSelectedId(menuItems[nextIndex].id);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onSoundFeedback?.();
        const prevIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        setSelectedId(menuItems[prevIndex].id);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSoundFeedback?.();
        if (selectedId === 'resume') {
          onClose();
        } else if (selectedId === 'new_game') {
          onNewGameWithDraw(settings.drawCount);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedId, menuItems, onClose, onNewGameWithDraw, settings.drawCount, onSoundFeedback]);

  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const themes: { id: BoardTheme; name: string; color: string; desc: string; badge?: string }[] = [
    { id: 'felt-green', name: 'Verde Casino Real', color: '#0b2316', desc: 'Tapete clásico de mesa de alta corte' },
    { id: 'midnight-blue', name: 'Azul Medianoche', color: '#0a1122', desc: 'Edición club de alta fidelidad' },
    { id: 'dark-wood', name: 'Madera Caoba', color: '#12100e', desc: 'Mesa de madera de lujo barnizada' },
    { id: 'royal-purple', name: 'Púrpura Imperial', color: '#150b24', desc: 'Terciopelo señorial de palacio' },
    { id: 'casino-red', name: 'Borgoña Carmesí', color: '#1e0910', desc: 'Salón de juego tradicional' },
    { id: 'gradient-ascii', name: 'Horizonte ASCII Ciber', color: '#1e3fd8', desc: 'Matriz ASCII interactiva con ondas de cursor', badge: 'DINÁMICO' },
    { id: 'silk', name: 'Seda Púrpura Fluida', color: '#5227FF', desc: 'Ondulaciones de satín con brillo y ondas al clic', badge: 'DINÁMICO' },
    { id: 'flux-lines', name: 'Líneas de Flujo Polar', color: '#ffffff', desc: 'Corrientes luminosas descendentes con turbulencia', badge: 'DINÁMICO' },
  ];

  const cardBacks: { id: CardBackStyle; name: string; color: string; desc: string }[] = [
    { id: 'classic-blue', name: 'Azul Real', color: '#1e3a8a', desc: 'Mandala geométrico dorado' },
    { id: 'classic-red', name: 'Rojo Carmesí', color: '#881337', desc: 'Guilloche de casino oficial' },
    { id: 'royal-gold', name: 'Dorado Imperial', color: '#18181b', desc: 'Emblema de corona heráldica' },
    { id: 'geometric-emerald', name: 'Esmeralda Deco', color: '#064e3b', desc: 'Estilo Art Deco clásico' },
    { id: 'cyber-dark', name: 'Obsidiana Dark', color: '#09090b', desc: 'Mosaico hexagonal mate' },
  ];

  const companionInfo = {
    lucina: {
      name: 'Lucina de Ylisse',
      title: 'Princesa Heroica • Fire Emblem Awakening',
      quote: '«El destino no está grabado en piedra. Con una mente clara y estrategia paciente, cualquier tablero puede ser conquistado.»',
      img: '/assets/npc/lucina_ssbu.png',
    },
    ike: {
      name: 'Ike de Crimea',
      title: 'Comandante de Greil • Fire Emblem Radiant Dawn',
      quote: '«No te apresures en combate. Libera los ases, mantén tus columnas equilibradas y avanza con firmeza paso a paso.»',
      img: '/assets/npc/fepr_ike.png',
    },
  };

  const currentCompanion = companionInfo[companion];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/92 backdrop-blur-2xl select-none overflow-hidden animate-in fade-in duration-200">
      {/* Cinematic Ambient Atmosphere: Vignette, Warm Torches, and Subtle Floating Embers */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_25%,rgba(245,158,11,0.08)_0%,transparent_50%),radial-gradient(circle_at_85%_75%,rgba(245,158,11,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]" />

      {/* Top Banner Bar */}
      <header className="relative z-10 px-6 sm:px-10 py-4 flex items-center justify-between border-b border-amber-500/20 bg-black/40 backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <div className="drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            <PlayingCardsLogo size="sm" />
          </div>
          <div>
            <h1 className="font-cinzel text-base sm:text-lg font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-200 leading-none drop-shadow">
              SOLITARIO REAL
            </h1>
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-amber-400/80 block mt-0.5">
              PAUSA & CONFIGURACIÓN DE MESA
            </span>
          </div>
        </div>

        {/* Developer Attribution Luxury Pill in Header */}
        <div
          onClick={() => {
            onSoundFeedback?.();
            setSelectedId('credits');
          }}
          className="hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/5 to-transparent border border-amber-400/30 hover:border-amber-400/60 shadow-sm transition-all cursor-pointer group"
          title="Ver créditos oficiales del desarrollador"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-300 shadow-sm flex-shrink-0 bg-amber-950/40">
            <img
              src="/assets/avatar/jordy_avatar.png"
              alt="Jordy Pincay"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/avatar/jordy_avatar_ref.png';
              }}
            />
          </div>
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-amber-200/90 uppercase font-bold">
            DESARROLLADO POR <strong className="text-amber-300 font-black group-hover:text-amber-200">JORDY PINCAY</strong>
          </span>
        </div>

        {/* Companion Toggle & Close Button */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center p-1 rounded-xl bg-[#121622] border border-[#242d42]">
            <button
              onClick={() => {
                onSoundFeedback?.();
                setCompanion('lucina');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
                companion === 'lucina'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Lucina
            </button>
            <button
              onClick={() => {
                onSoundFeedback?.();
                setCompanion('ike');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
                companion === 'ike'
                  ? 'bg-amber-400 text-black shadow-md font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Ike
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#161b28] hover:bg-[#222b40] text-zinc-400 hover:text-white flex items-center justify-center border border-[#2a354e] border-b-2 border-b-black transition-colors cursor-pointer"
            title="Cerrar menú (Esc)"
          >
            <X className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
      </header>

      {/* Main Cinematic Stage: 3 Columns matching the user reference */}
      <main className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-y-auto sm:overflow-hidden min-h-0">
        {/* =========================================================================
            COLUMN 1: CLASSICAL SERIF VERTICAL MENU (LEFT - EXACTLY LIKE REFERENCE)
            ========================================================================= */}
        <section className="md:col-span-4 lg:col-span-3.5 px-5 sm:px-8 py-5 sm:py-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1e2638] bg-black/35 overflow-y-auto">
          <div>
            {/* Grand SETTINGS Title from Reference */}
            <div className="mb-3.5">
              <span className="text-[9.5px] font-cinzel uppercase tracking-[0.25em] font-bold text-amber-400/80 block">
                MENÚ DE SISTEMA
              </span>
              <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-50 drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)] leading-tight mt-0.5">
                SETTINGS
              </h2>
              <div className="w-14 h-[2px] bg-gradient-to-r from-amber-400 to-transparent mt-1.5" />
            </div>

            {/* Vertical Menu List with icons & zero squishing */}
            <nav className="space-y-1 sm:space-y-1.5 font-cinzel">
              {menuItems.map((item) => {
                const isActive = selectedId === item.id;
                const isCredits = item.id === 'credits';
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSoundFeedback?.();
                      setSelectedId(item.id);
                    }}
                    onMouseEnter={() => {
                      if (!isActive) onSoundFeedback?.();
                      setSelectedId(item.id);
                    }}
                    className={`w-full py-2 px-3 sm:px-3.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/25 via-amber-500/10 to-transparent border-l-4 border-amber-400 text-amber-200 shadow-sm'
                        : isCredits
                        ? 'text-amber-200/90 hover:text-amber-100 hover:bg-amber-400/[0.08] border-l-2 border-amber-400/40 bg-amber-500/[0.03]'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                      <div className={`flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`}>
                        {item.icon}
                      </div>
                      <div className="truncate">
                        <span
                          className={`text-xs sm:text-[13px] font-black tracking-[0.14em] block leading-none transition-colors truncate ${
                            isActive
                              ? 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                              : isCredits
                              ? 'text-amber-200 group-hover:text-amber-100'
                              : 'group-hover:text-white'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className={`text-[9.5px] font-game-ui block mt-1 truncate ${
                          isCredits ? 'text-amber-300/80 font-bold' : 'text-zinc-500'
                        }`}>
                          {item.sublabel}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-amber-400 animate-pulse hidden sm:block flex-shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Elegant Studio Plaque at bottom of left column (Replaces redundant button) */}
          <div className="pt-3 border-t border-[#1e2638]/70 mt-3">
            <div
              onClick={() => {
                onSoundFeedback?.();
                setSelectedId('credits');
              }}
              className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 hover:border-amber-400/60 transition-all flex items-center gap-2.5 cursor-pointer group"
              title="Ver créditos oficiales de desarrollo"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400/70 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 bg-amber-950/40">
                <img
                  src="/assets/avatar/jordy_avatar.png"
                  alt="Avatar Jordy Pincay"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/avatar/jordy_avatar_ref.png';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <span className="text-[7.5px] font-cinzel uppercase tracking-[0.24em] text-amber-400/90 font-bold block">
                  DESARROLLADO POR
                </span>
                <span className="text-xs font-cinzel font-black text-amber-100 tracking-wider block mt-0.5 group-hover:text-amber-300 transition-colors truncate">
                  JORDY PINCAY
                </span>
              </div>
              <Crown className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 transition-colors flex-shrink-0" />
            </div>
          </div>
        </section>

        {/* =========================================================================
            COLUMN 2: CENTRAL INTERACTIVE SETTINGS STAGE (AMPLE SPACE, ZERO CLUTTER)
            ========================================================================= */}
        <section className="md:col-span-5 lg:col-span-5 px-6 sm:px-10 py-6 sm:py-8 overflow-y-auto border-b md:border-b-0 md:border-r border-[#1e2638] bg-black/15">
          <AnimatePresence mode="wait">
            {/* 1. RESUME & TABLE OVERVIEW */}
            {selectedId === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <div className="border-b border-[#222a3d] pb-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    VISTA GENERAL
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    ESTADO DE LA PARTIDA
                  </h3>
                </div>

                {/* Score & Timing Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] text-center">
                    <span className="text-[10px] font-cinzel uppercase text-zinc-400 block">PUNTUACIÓN</span>
                    <span className="font-game-num text-2xl font-black text-amber-300 mt-1 block">
                      {stats.totalScore}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] text-center">
                    <span className="text-[10px] font-cinzel uppercase text-zinc-400 block">VICTORIAS</span>
                    <span className="font-game-num text-2xl font-black text-emerald-400 mt-1 block">
                      {stats.gamesWon}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] text-center">
                    <span className="text-[10px] font-cinzel uppercase text-zinc-400 block">RATIO ÉXITO</span>
                    <span className="font-game-num text-2xl font-black text-sky-300 mt-1 block">
                      {winRate}%
                    </span>
                  </div>
                </div>

                {/* Game Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={onClose}
                    className="game-btn w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-cinzel font-black text-sm tracking-wider flex items-center justify-between shadow-md border border-emerald-400/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 fill-white" />
                      <div className="text-left">
                        <span className="block leading-none">CONTINUAR PARTIDA</span>
                        <span className="text-[10px] font-game-ui text-emerald-200 block mt-1">
                          Vuelve al tapete de juego en su estado exacto
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-black/30 font-mono text-xs text-emerald-200">
                      ESC
                    </span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onNewGameWithDraw(settings.drawCount);
                        onClose();
                      }}
                      className="game-btn p-3.5 rounded-2xl bg-[#121624] hover:bg-[#1a2034] border border-[#252f46] text-zinc-200 hover:text-white font-cinzel font-bold text-xs flex items-center gap-3 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      <div className="text-left">
                        <span className="block leading-none">NUEVA PARTIDA</span>
                        <span className="text-[9px] font-game-ui text-zinc-500 block mt-0.5">Baraja aleatoria [N]</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        onRestartGame();
                        onClose();
                      }}
                      className="game-btn p-3.5 rounded-2xl bg-[#121624] hover:bg-[#1a2034] border border-[#252f46] text-zinc-200 hover:text-white font-cinzel font-bold text-xs flex items-center gap-3 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div className="text-left">
                        <span className="block leading-none">REINICIAR MESA</span>
                        <span className="text-[9px] font-game-ui text-zinc-500 block mt-0.5">Mismo reparto</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Banner with Companion Interactive Guide */}
                {onOpenGuide && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#141824] to-[#0c0f18] border border-amber-500/40 flex items-center justify-between gap-3 shadow-md mt-4">
                    <div className="flex items-center gap-3">
                      <Swords className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-cinzel text-xs font-black text-amber-200">
                          Tutoría con {companion === 'lucina' ? 'Lucina' : 'Ike'}
                        </h4>
                        <p className="text-[10px] text-zinc-400 font-game-ui mt-0.5">
                          Aprende aperturas, jugadas maestras y tácticas sobre la mesa viva.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenGuide();
                      }}
                      className="game-btn px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-cinzel font-black text-xs whitespace-nowrap cursor-pointer shadow-sm"
                    >
                      ABRIR GUÍA [G]
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. NEW GAME OPTIONS */}
            {selectedId === 'new_game' && (
              <motion.div
                key="new_game"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <div className="border-b border-[#222a3d] pb-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    DISTRIBUCIÓN
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    NUEVO REPARTO DE NAIPES
                  </h3>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onNewGameWithDraw(1);
                      onClose();
                    }}
                    className="game-btn w-full p-4 rounded-2xl bg-[#0e121c] hover:bg-[#161c2c] border border-[#242e44] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="font-cinzel text-sm font-black text-white group-hover:text-amber-300 block">
                        PARTIDA ESTÁNDAR (ROBO DE 1 CARTA)
                      </span>
                      <span className="text-xs text-zinc-400 font-game-ui block mt-1">
                        Reparte 52 cartas con modalidad de 1 carta por extracción. Fluida y relajada.
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      onNewGameWithDraw(3);
                      onClose();
                    }}
                    className="game-btn w-full p-4 rounded-2xl bg-[#0e121c] hover:bg-[#161c2c] border border-[#242e44] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="font-cinzel text-sm font-black text-white group-hover:text-amber-300 block">
                        PARTIDA DE TORNEO (ROBO DE 3 CARTAS)
                      </span>
                      <span className="text-xs text-zinc-400 font-game-ui block mt-1">
                        Reglas oficiales de torneo Klondike con extracción de 3 cartas por turno.
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      onRestartGame();
                      onClose();
                    }}
                    className="game-btn w-full p-4 rounded-2xl bg-[#0e121c] hover:bg-[#161c2c] border border-[#242e44] text-left transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <span className="font-cinzel text-sm font-black text-amber-300 block">
                        REINICIAR MANO ACTUAL
                      </span>
                      <span className="text-xs text-zinc-400 font-game-ui block mt-1">
                        Vuelve a jugar la misma distribución de cartas desde cero para perfeccionar tu puntuación.
                      </span>
                    </div>
                    <RotateCw className="w-5 h-5 text-amber-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. DRAW MODE SETTINGS */}
            {selectedId === 'draw_mode' && (
              <motion.div
                key="draw_mode"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <div className="border-b border-[#222a3d] pb-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    MODALIDAD DE REGLAS
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    EXTRACCIÓN DE CARTAS (STOCK)
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Mode 1 */}
                  <div
                    onClick={() => {
                      onSoundFeedback?.();
                      onUpdateSettings({ drawCount: 1 });
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      settings.drawCount === 1
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-md'
                        : 'bg-[#0e121c] border-[#20283c] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <h4 className="font-cinzel text-sm font-black text-white">
                          MODO CASUAL: 1 CARTA POR TURNO
                        </h4>
                      </div>
                      {settings.drawCount === 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-cinzel font-black text-[10px]">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-game-ui leading-relaxed">
                      Cada clic en el mazo de robo descubre exactamente una carta en el descarte. Permite partidas accesibles y dinámicas, ideal para practicar y disfrutar del juego sin frustraciones.
                    </p>
                  </div>

                  {/* Mode 3 */}
                  <div
                    onClick={() => {
                      onSoundFeedback?.();
                      onUpdateSettings({ drawCount: 3 });
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      settings.drawCount === 3
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-md'
                        : 'bg-[#0e121c] border-[#20283c] text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <h4 className="font-cinzel text-sm font-black text-white">
                          MODO TORNEO: 3 CARTAS POR TURNO
                        </h4>
                      </div>
                      {settings.drawCount === 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-cinzel font-black text-[10px]">
                          ACTIVO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-game-ui leading-relaxed">
                      Reglamento clásico de casino y torneos. Cada extracción reparte 3 cartas fanned; solo la carta superior queda legal para jugar, requiriendo profunda previsión y cálculo de secuencias.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. AUDIO & SOUND SETTINGS */}
            {selectedId === 'audio' && (
              <motion.div
                key="audio"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <div className="border-b border-[#222a3d] pb-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    SONIDO Y AMBIENTE
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    AUDIO DEL CASINO
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-cinzel text-sm font-black text-white">
                        EFECTOS SONOROS DE NAIPES
                      </h4>
                      <p className="text-xs text-zinc-400 font-game-ui mt-0.5">
                        Grabaciones acústicas de cartas reales al deslizar, colocar y repartir.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSoundFeedback?.();
                      onUpdateSettings({ soundEnabled: !settings.soundEnabled });
                    }}
                    className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer border border-[#2e374e] ${
                      settings.soundEnabled ? 'bg-amber-400' : 'bg-[#151926]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full transition-transform absolute top-1 ${
                        settings.soundEnabled ? 'right-1 bg-black' : 'left-1 bg-zinc-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound Test Button */}
                <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] flex items-center justify-between">
                  <div>
                    <h5 className="font-cinzel text-xs font-black text-zinc-300">
                      PROBAR SONIDO DE LA MESA
                    </h5>
                    <p className="text-[11px] text-zinc-500 font-game-ui">
                      Reproduce una muestra acústica de colocación de carta
                    </p>
                  </div>
                  <button
                    onClick={() => onSoundFeedback?.()}
                    className="game-btn px-3 py-1.5 rounded-xl bg-[#182030] hover:bg-[#222c42] border border-[#2e3b56] text-amber-300 font-cinzel text-xs font-bold cursor-pointer"
                  >
                    PROBAR AUDIO
                  </button>
                </div>
              </motion.div>
            )}

            {/* 5. THEMES & CARD BACKS */}
            {selectedId === 'themes' && (
              <motion.div
                key="themes"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >
                <div className="border-b border-[#222a3d] pb-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    ATMÓSFERA VISUAL
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    TAPETES Y DORSOS
                  </h3>
                </div>

                {/* Table Felts */}
                <div>
                  <span className="font-cinzel text-xs font-black text-amber-300 block mb-2">
                    TAPETE DE LA MESA
                  </span>
                  <div className="space-y-1.5">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSoundFeedback?.();
                          onUpdateSettings({ theme: t.id });
                        }}
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          settings.theme === t.id
                            ? 'border-amber-400 bg-amber-500/10 text-white shadow-md'
                            : 'border-[#20283c] bg-[#0e121c] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-5 h-5 rounded-lg border border-white/20 shadow-inner flex-shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: t.color }}
                          >
                            {t.badge && <Sparkles className="w-2.5 h-2.5 text-black drop-shadow" />}
                          </span>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-cinzel text-xs font-black block leading-none">{t.name}</span>
                              {t.badge && (
                                <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {t.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-500 font-game-ui">{t.desc}</span>
                          </div>
                        </div>
                        {settings.theme === t.id && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Backs */}
                <div className="pt-2">
                  <span className="font-cinzel text-xs font-black text-amber-300 block mb-2">
                    DORSO DE LA BARAJA
                  </span>
                  <div className="space-y-1.5">
                    {cardBacks.map((cb) => (
                      <button
                        key={cb.id}
                        onClick={() => {
                          onSoundFeedback?.();
                          onUpdateSettings({ cardBack: cb.id });
                        }}
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          settings.cardBack === cb.id
                            ? 'border-amber-400 bg-amber-500/10 text-white shadow-md'
                            : 'border-[#20283c] bg-[#0e121c] text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-4 h-6 rounded border border-white/20 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: cb.color }}
                          />
                          <div className="text-left">
                            <span className="font-cinzel text-xs font-black block leading-none">{cb.name}</span>
                            <span className="text-[10px] text-zinc-500 font-game-ui">{cb.desc}</span>
                          </div>
                        </div>
                        {settings.cardBack === cb.id && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. RULES */}
            {selectedId === 'rules' && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4 text-xs font-game-ui"
              >
                <div className="border-b border-[#222a3d] pb-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    MANUAL KLONDIKE
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    REGLAMENTO OFICIAL
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] space-y-1.5">
                  <h4 className="font-cinzel text-xs font-black text-amber-300">
                    1. Objetivo: Las 4 Fundaciones Superiores
                  </h4>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Construir 4 pilas ordenadas por palo desde el <strong className="text-white">As (A)</strong> hasta el <strong className="text-white">Rey (K)</strong> en orden ascendente (A → 2 → 3 → ... → K).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] space-y-1.5">
                  <h4 className="font-cinzel text-xs font-black text-amber-300">
                    2. Columnas del Tablero (7 Pilas)
                  </h4>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Apilar alternando colores (<strong className="text-red-400">Rojo</strong> sobre <strong className="text-zinc-200">Negro</strong>) en orden descendente. Las casillas vacías solo pueden ser ocupadas por un <strong className="text-amber-300">Rey (K)</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] space-y-2">
                  <h4 className="font-cinzel text-xs font-black text-amber-300">
                    3. Sistema de Puntuación
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-cinzel">
                    <span className="p-2 rounded-xl bg-[#141824] flex justify-between">
                      <span className="text-zinc-400">A Fundación</span>
                      <strong className="text-amber-400">+10 PTS</strong>
                    </span>
                    <span className="p-2 rounded-xl bg-[#141824] flex justify-between">
                      <span className="text-zinc-400">Carta Revelada</span>
                      <strong className="text-emerald-400">+5 PTS</strong>
                    </span>
                    <span className="p-2 rounded-xl bg-[#141824] flex justify-between">
                      <span className="text-zinc-400">Mazo a Tablero</span>
                      <strong className="text-emerald-400">+5 PTS</strong>
                    </span>
                    <span className="p-2 rounded-xl bg-[#141824] flex justify-between">
                      <span className="text-zinc-400">De Fundación</span>
                      <strong className="text-rose-400">-15 PTS</strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. STATS & RECORDS */}
            {selectedId === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="border-b border-[#222a3d] pb-3">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    SALÓN DE LA GLORIA
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    RÉCORDS Y ESTADÍSTICAS
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e121c] border border-[#20283c] space-y-3 font-cinzel">
                  <div className="flex items-center justify-between text-xs border-b border-[#182030] pb-2">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      Puntos Totales Acumulados:
                    </span>
                    <span className="font-game-num font-black text-amber-300 text-base">{stats.totalScore} pts</span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-b border-[#182030] pb-2">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Mejor Tiempo de Victoria:
                    </span>
                    <span className="font-game-num font-black text-cyan-300 text-base">{formatTime(stats.bestTime)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-b border-[#182030] pb-2">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-emerald-400" />
                      Mínimo de Movimientos:
                    </span>
                    <span className="font-game-num font-black text-emerald-400 text-base">
                      {stats.bestMoves !== null ? `${stats.bestMoves} MOVS` : '--'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-400" />
                      Mejor Racha de Victorias:
                    </span>
                    <span className="font-game-num font-black text-rose-400 text-base">{stats.bestStreak} WINS</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('¿Deseas reiniciar los marcadores acumulados?')) {
                      onResetStats();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#141824] hover:bg-[#1e2436] border border-[#242e44] text-zinc-500 hover:text-zinc-300 font-cinzel text-xs font-bold cursor-pointer"
                >
                  REINICIAR MARCADORES ARCADE
                </button>
              </motion.div>
            )}

            {/* 8. CRÉDITOS & AUTOR (CONCRETO, DIRECTO Y SIN PALABRERÍA) */}
            {selectedId === 'credits' && (
              <motion.div
                key="credits"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                <div className="border-b border-[#222a3d] pb-2.5">
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] font-bold text-amber-400/80 block">
                    CRÉDITOS
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-white mt-0.5">
                    AUTOR DEL JUEGO
                  </h3>
                </div>

                {/* Tarjeta Concreta del Desarrollador */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161b26] via-[#10131d] to-[#0a0c14] border border-amber-400/40 shadow-xl flex flex-col items-center text-center">
                  {/* Avatar con corona */}
                  <div className="relative mb-3.5">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] bg-[#121622]">
                      <img
                        src="/assets/avatar/jordy_avatar.png"
                        alt="Jordy Pincay"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/avatar/jordy_avatar_ref.png';
                        }}
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center border border-amber-200 shadow">
                      <Crown className="w-4 h-4 text-black" strokeWidth={2.4} />
                    </div>
                  </div>

                  {/* Nombre y Rol */}
                  <span className="text-[10px] font-cinzel tracking-[0.25em] text-amber-400 uppercase font-bold">
                    DESARROLLADO POR
                  </span>
                  <h4 className="font-cinzel text-2xl sm:text-3xl font-black text-white mt-1 mb-2">
                    Jordy Pincay
                  </h4>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-cinzel text-xs font-bold tracking-wider mb-5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    CREADOR & DESARROLLADOR
                  </div>

                  {/* Datos concretos directos */}
                  <div className="w-full grid grid-cols-2 gap-2 text-xs font-cinzel border-t border-[#20283c] pt-4">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-[#20283c]/60">
                      <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Juego</span>
                      <strong className="text-amber-200 text-xs">Solitario Real</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-[#20283c]/60">
                      <span className="text-zinc-500 text-[10px] block uppercase tracking-wider">Versión</span>
                      <strong className="text-white text-xs">v1.0.0</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* =========================================================================
            COLUMN 3: FULL STANDING COMPANION CHARACTER (RIGHT FLANK - EXACTLY LIKE REF)
            ========================================================================= */}
        <section className="hidden md:flex md:col-span-3 lg:col-span-3.5 px-6 sm:px-8 py-6 sm:py-8 flex-col justify-between items-center bg-gradient-to-b from-[#111624]/90 via-[#0a0d16]/95 to-[#05070c]/98 relative overflow-hidden">
          {/* Ambient golden aura behind companion */}
          <div className="absolute top-1/4 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Companion Title Header */}
          <div className="w-full text-center z-10">
            <span className="text-[10px] font-cinzel uppercase tracking-[0.25em] font-bold text-amber-400/80 block">
              COMPAÑERO DE BATALLA
            </span>
            <h3 className="font-cinzel text-sm lg:text-base font-black text-white mt-0.5">
              {currentCompanion.name}
            </h3>
            <span className="text-[10px] font-game-ui text-zinc-400 block mt-0.5">
              {currentCompanion.title}
            </span>
          </div>

          {/* Full Standing Character with Natural Idle Breathing Animation */}
          <motion.div
            key={companion}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
              y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="relative my-auto flex items-center justify-center z-10 max-h-[380px] lg:max-h-[440px]"
          >
            <img
              src={currentCompanion.img}
              alt={currentCompanion.name}
              className="max-h-[360px] lg:max-h-[420px] w-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] filter brightness-105"
            />
          </motion.div>

          {/* Dialogue Quote Parchment */}
          <div className="w-full bg-black/60 border border-amber-500/35 rounded-2xl p-3 text-center z-10 backdrop-blur-md shadow-lg shadow-black/60">
            <p className="text-[11px] text-amber-100/90 font-cinzel italic leading-relaxed">
              {currentCompanion.quote}
            </p>
          </div>
        </section>
      </main>

      {/* =========================================================================
          BOTTOM CONSOLE CONTROLLER PROMPT STRIP (EXACTLY LIKE THE REFERENCE IMAGE)
          ========================================================================= */}
      <footer className="relative z-10 px-5 sm:px-10 py-2.5 sm:py-3 bg-[#06080e] border-t border-amber-500/20 flex items-center justify-between gap-3 text-xs font-cinzel text-zinc-300 overflow-hidden">
        <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
          {/* (B) BACK prompt */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/50 flex items-center justify-center font-bold text-[10px] shadow-sm">
              B
            </span>
            <span className="tracking-wider text-zinc-300 hidden sm:inline">[ESC] VOLVER AL JUEGO</span>
            <span className="tracking-wider text-zinc-300 sm:hidden">VOLVER</span>
          </div>

          {/* (A) SELECT prompt */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-400/20 text-sky-400 border border-sky-400/50 flex items-center justify-center font-bold text-[10px] shadow-sm">
              A
            </span>
            <span className="tracking-wider text-zinc-300 hidden sm:inline">[ENTER] SELECCIONAR</span>
            <span className="tracking-wider text-zinc-300 sm:hidden">ELEGIR</span>
          </div>

          {/* Navigation with Arrow Keys */}
          <div className="hidden md:flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10px]">
              ▲▼
            </span>
            <span className="tracking-wider text-zinc-400">NAVEGAR</span>
          </div>
        </div>

        {/* Developer Attribution Seal (Console Master Signature - Single Line, Ultra Prestigious) */}
        <div
          onClick={() => {
            onSoundFeedback?.();
            setSelectedId('credits');
          }}
          className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-amber-950/40 border border-amber-400/50 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.18)] flex-shrink-0 cursor-pointer hover:border-amber-300 hover:shadow-[0_0_22px_rgba(245,158,11,0.28)] transition-all group"
          title="Ver créditos oficiales de desarrollo"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-300 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0 bg-amber-950/40">
            <img
              src="/assets/avatar/jordy_avatar.png"
              alt="Avatar Jordy Pincay"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/avatar/jordy_avatar_ref.png';
              }}
            />
          </div>
          <div className="text-left leading-none whitespace-nowrap">
            <span className="text-[7.5px] font-cinzel font-black tracking-[0.24em] text-amber-400/90 uppercase block">
              DIRECCIÓN & DESARROLLO
            </span>
            <span className="font-cinzel text-[11px] sm:text-xs font-black tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-100 block mt-0.5 group-hover:text-amber-200">
              JORDY PINCAY
            </span>
          </div>
          <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 ml-0.5 drop-shadow" />
        </div>
      </footer>
    </div>
  );
};

export default GameMenuModal;
