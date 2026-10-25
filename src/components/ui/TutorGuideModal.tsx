import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Shield,
  Swords,
  Crown,
  RotateCcw,
  Volume2,
  VolumeX,
  RotateCw,
} from 'lucide-react';
import { useTutorVoice } from '../../hooks/useTutorVoice';

export interface TutorGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onStepChange?: (stepIndex: number) => void;
  onStepSound?: () => void;
  soundEnabled?: boolean;
}

interface StepDialog {
  speech: string;
  tacticalTip: string;
}

interface StepData {
  id: string;
  stepNumber: number;
  badge: string;
  title: string;
  characterSide: 'right' | 'left';
  ike: StepDialog;
  lucina: StepDialog;
}

const TUTOR_STEPS: StepData[] = [
  {
    id: 'foundations',
    stepNumber: 1,
    badge: 'OBJETIVO SUPREMO',
    title: 'Las 4 Fundaciones (Ases al Rey)',
    characterSide: 'right',
    ike: {
      speech:
        '¡Saludos! Soy Ike, comandante de los Mercenarios de Greil. El objetivo de la batalla es trasladar las 52 cartas a las 4 casillas superiores, las Fundaciones. Cada montón se forja desde el As hasta el Rey en orden ascendente y agrupando el mismo palo. ¡En cuanto veas un As libre, envíalo a su fundación de inmediato!',
      tacticalTip:
        'Consejo de Ike: En cuanto veas un As libre en el tablero o en el descarte, envíalo a su fundación de inmediato. Es el cimiento de la victoria.',
    },
    lucina: {
      speech:
        '¡Soy Lucina de Ylisse! He venido para guiarte hacia un futuro victorioso en la mesa. Nuestro primer deber táctico es enviar las 52 cartas a las 4 Fundaciones superiores, ordenadas del As al Rey. ¡Asegura los Ases en cuanto queden al descubierto!',
      tacticalTip:
        'Consejo de Lucina: Asegura los Ases en cuanto queden al descubierto. Desbloquearán las cadenas de la victoria.',
    },
  },
  {
    id: 'tableau',
    stepNumber: 2,
    badge: 'CAMPO DE BATALLA',
    title: 'Las 7 Columnas del Tablero',
    characterSide: 'left',
    ike: {
      speech:
        'El campo de batalla principal son las 7 columnas del tablero. Las cartas descubiertas se ordenan en escala descendente, de Rey a As, alternando estrictamente los colores: ¡Rojo sobre Negro y Negro sobre Rojo! Concéntrate en liberar y voltear las cartas ocultas en las columnas más profundas.',
      tacticalTip:
        'Consejo de Ike: Concéntrate en liberar y voltear las cartas ocultas boca abajo en las columnas más profundas.',
    },
    lucina: {
      speech:
        'En las 7 columnas del tablero forjamos nuestro avance. Las cartas se organizan en orden descendente alternando colores: rojo sobre negro y negro sobre rojo. ¡Puedes maniobrar escuadrones enteros ya alineados! Prioriza destapar cartas boca abajo para ampliar nuestras opciones.',
      tacticalTip:
        'Consejo de Lucina: Prioriza destapar cartas boca abajo; cada una que reveles amplía nuestras opciones estratégicas.',
    },
  },
  {
    id: 'stock',
    stepNumber: 3,
    badge: 'SUMINISTROS Y REFUERZOS',
    title: 'Mazo de Reserva y Montón de Descarte',
    characterSide: 'right',
    ike: {
      speech:
        '¿Te quedaste sin jugadas directas en el tablero? Acude a los suministros en el Mazo de Reserva, arriba a la izquierda. Al hacer clic, extraerás refuerzos al descarte para incorporarlos a tus columnas o a las fundaciones. Cuando agotes el mazo, haz clic de nuevo para reciclarlo sin penalización.',
      tacticalTip:
        'Consejo de Ike: Cuando agotes el mazo, haz clic de nuevo para reciclar todas las cartas de reserva sin penalización.',
    },
    lucina: {
      speech:
        'Si el frente se estanca, acude a los suministros del Mazo de Reserva superior. Cada carta extraída al descarte representa un nuevo refuerzo que puede cambiar el rumbo de la batalla. Recicla el mazo cuando lo agotes; la paciencia y el ritmo aseguran la victoria.',
      tacticalTip:
        'Consejo de Lucina: Recicla el mazo cuando lo agotes; la paciencia y el ritmo adecuado aseguran la victoria.',
    },
  },
  {
    id: 'kings',
    stepNumber: 4,
    badge: 'REGLA DE HIERRO',
    title: 'Columnas Vacías y el Rango Real',
    characterSide: 'left',
    ike: {
      speech:
        '¡Despejar una columna completa del tablero es una posición táctica clave! Recuerda esta regla de hierro: únicamente un Rey, o una formación encabezada por un Rey, tiene el rango necesario para reclamar ese espacio vacío. Despeja columnas para transferir Reyes y destapar cartas cruciales.',
      tacticalTip:
        'Consejo de Ike: Despeja columnas para transferir Reyes y destapar cartas cruciales que desbloqueen la mesa.',
    },
    lucina: {
      speech:
        '¡Una columna despejada es una posición sagrada! Recuerda esta ley inquebrantable: únicamente un Rey, o una formación comandada por un Rey, tiene el rango de ocupar ese espacio vacío. Usa los espacios libres para maniobrar a los Reyes y liberar las columnas más bloqueadas.',
      tacticalTip:
        'Consejo de Lucina: Usa los espacios libres para maniobrar a los Reyes y liberar las columnas más bloqueadas.',
    },
  },
  {
    id: 'controls',
    stepNumber: 5,
    badge: 'TÁCTICAS AVANZADAS',
    title: 'Maniobras Rápidas y Atajos de Combate',
    characterSide: 'right',
    ike: {
      speech:
        '¡Tienes madera de estratega! Un par de maniobras rápidas: haz doble clic en cualquier carta para enviarla automáticamente a su fundación. Usa la tecla H para pedir una pista táctica, Control Z para replegar tu último movimiento, y la barra espaciadora para robar. ¡Toma tu mazo y despeja el tapete!',
      tacticalTip:
        '¡Toma tu mazo y despeja el tapete! ¡Que la victoria acompañe a tu estrategia en esta partida!',
    },
    lucina: {
      speech:
        '¡El destino de la partida está en tus manos! Haz doble clic en cualquier carta para enviarla a su fundación, presiona la tecla H para recibir una pista táctica, y Control Z para revertir cualquier error. ¡Confía en tu estrategia, desafía al destino y triunfa!',
      tacticalTip:
        '¡Confía en tu estrategia y no te rindas! ¡El tapete será tuyo!',
    },
  },
];

export const TutorGuideModal: React.FC<TutorGuideProps> = ({
  isOpen,
  onClose,
  onStepChange,
  onStepSound,
  soundEnabled = true,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [characterType, setCharacterType] = useState<'ike' | 'lucina'>('ike');

  const {
    playAnimeVoice,
    stop,
    isSpeaking,
    isVoiceEnabled,
    setIsVoiceEnabled,
  } = useTutorVoice(soundEnabled);

  const currentStep = TUTOR_STEPS[currentStepIndex];
  const activeDialog =
    characterType === 'ike' ? currentStep.ike : currentStep.lucina;

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    } else {
      stop();
    }
  }, [isOpen, stop]);

  useEffect(() => {
    if (isOpen && onStepChange) {
      onStepChange(currentStepIndex);
    }
  }, [currentStepIndex, isOpen, onStepChange]);

  // Voice narration triggers on step or character change with small buffer
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        playAnimeVoice(characterType, currentStepIndex);
      }, 140);

      return () => {
        clearTimeout(timer);
        stop();
      };
    } else {
      stop();
    }
  }, [isOpen, currentStepIndex, characterType, playAnimeVoice, stop]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        stop();
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, stop]);

  const handleNext = () => {
    onStepSound?.();
    if (currentStepIndex < TUTOR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      stop();
      onClose();
    }
  };

  const handlePrev = () => {
    onStepSound?.();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleToggleCharacter = () => {
    onStepSound?.();
    setCharacterType((prev) => (prev === 'ike' ? 'lucina' : 'ike'));
  };

  const handleToggleVoice = () => {
    if (isVoiceEnabled) {
      stop();
      setIsVoiceEnabled(false);
    } else {
      setIsVoiceEnabled(true);
      playAnimeVoice(characterType, currentStepIndex);
    }
  };

  const handleReplayVoice = () => {
    onStepSound?.();
    playAnimeVoice(characterType, currentStepIndex);
  };

  const isLastStep = currentStepIndex === TUTOR_STEPS.length - 1;
  const isRightSide = currentStep.characterSide === 'right';

  const characterSrc =
    characterType === 'ike'
      ? '/assets/npc/fepr_ike.png'
      : '/assets/npc/lucina_ssbu.png';

  const characterName =
    characterType === 'ike'
      ? 'Ike • Mercenarios de Greil'
      : 'Lucina • Princesa de Ylisse';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden">
          {/* Dimmed atmospheric board backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={() => {
              stop();
              onClose();
            }}
            className="absolute inset-0 bg-black/65 backdrop-blur-[2px] pointer-events-auto"
          />

          {/* Full standing character */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${characterType}-${currentStep.characterSide}`}
              initial={{
                opacity: 0,
                x: isRightSide ? 140 : -140,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: isRightSide ? 140 : -140,
                scale: 0.94,
              }}
              transition={{
                type: 'spring',
                damping: 24,
                stiffness: 160,
                mass: 0.9,
              }}
              className={`absolute bottom-0 z-30 pointer-events-none flex items-end ${
                isRightSide
                  ? 'right-2 sm:right-6 md:right-10 lg:right-16'
                  : 'left-2 sm:left-6 md:left-10 lg:left-16'
              }`}
            >
              <motion.img
                src={characterSrc}
                alt={characterName}
                animate={{
                  y: [0, -9, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`h-[68vh] sm:h-[75vh] md:h-[82vh] max-h-[700px] min-h-[380px] w-auto object-contain object-bottom filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] ${
                  !isRightSide ? 'scale-x-[-1]' : ''
                }`}
                onError={(e) => {
                  e.currentTarget.src = '/assets/npc/fepr_ike.png';
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Visual Novel Dialogue Box */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{ opacity: 0, y: 50, scale: 0.96 }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 180,
            }}
            className={`absolute bottom-3 sm:bottom-6 z-40 pointer-events-auto w-[95%] sm:w-[90%] md:w-[620px] lg:w-[660px] max-w-[calc(100vw-24px)] ${
              isRightSide
                ? 'left-3 sm:left-6 md:left-10 lg:left-16'
                : 'right-3 sm:right-6 md:right-10 lg:right-16'
            }`}
          >
            {/* Character Name Plaque */}
            <motion.div
              layout
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={`absolute -top-4 sm:-top-5 z-20 ${
                isRightSide ? 'left-6 sm:left-8' : 'right-6 sm:right-8'
              }`}
            >
              <div className="flex items-center gap-1.5 px-4 sm:px-5 py-1 rounded-xl bg-gradient-to-r from-[#4a2e16] via-[#6d4420] to-[#4a2e16] border-2 border-[#e6b749] shadow-[0_4px_16px_rgba(0,0,0,0.95)] text-[#fff3d4]">
                {characterType === 'ike' ? (
                  <Swords className="w-3.5 h-3.5 text-amber-300 drop-shadow" />
                ) : (
                  <Crown className="w-3.5 h-3.5 text-amber-300 drop-shadow" />
                )}
                <span className="font-cinzel text-xs sm:text-sm font-black tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {characterName}
                </span>
              </div>
            </motion.div>

            {/* Main Dialogue Panel Frame */}
            <div className="vn-dialog-frame relative bg-gradient-to-b from-[#1b1510]/98 via-[#130f0c]/98 to-[#0b0806]/98 border-2 border-[#b8860b] rounded-2xl p-4 sm:p-5 backdrop-blur-md text-amber-50 shadow-2xl">
              {/* Corner Filigrees */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400/60 rounded-tl pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400/60 rounded-tr pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400/60 rounded-bl pointer-events-none" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400/60 rounded-br pointer-events-none" />

              {/* Dialogue Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-900/40">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-[10px] sm:text-xs font-black tracking-wider text-amber-300 font-game-ui">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    {currentStep.badge}
                  </span>

                  <span className="text-[10px] sm:text-xs font-bold text-amber-200/70 font-cinzel">
                    PASO {currentStepIndex + 1} DE {TUTOR_STEPS.length}
                  </span>

                  {/* Animated Speaking Soundwave Bar Indicator */}
                  {isSpeaking && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/25 border border-amber-400/60 text-[10px] text-amber-300 font-bold font-game-ui animate-pulse">
                      <span>Voz Anime en Español</span>
                      <div className="flex items-end gap-[2px] h-2.5 ml-1">
                        <span className="w-[2px] h-2 bg-amber-400 rounded animate-[bounce_0.6s_infinite_100ms]" />
                        <span className="w-[2px] h-3 bg-amber-400 rounded animate-[bounce_0.6s_infinite_200ms]" />
                        <span className="w-[2px] h-1.5 bg-amber-400 rounded animate-[bounce_0.6s_infinite_300ms]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Voice Controls, Character Switcher & Close */}
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  {/* Voice Replay */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReplayVoice}
                    className="p-1 sm:p-1.5 rounded-xl bg-[#2a1d13] hover:bg-[#3d2a1b] border border-[#7a4e23] hover:border-amber-400 text-amber-300 transition-colors shadow-sm cursor-pointer"
                    title="Repetir voz anime"
                  >
                    <RotateCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </motion.button>

                  {/* Voice Mute Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleVoice}
                    className={`p-1 sm:p-1.5 rounded-xl border transition-colors shadow-sm cursor-pointer ${
                      isVoiceEnabled
                        ? 'bg-amber-400/20 border-amber-400/70 text-amber-300'
                        : 'bg-[#2a1d13] border-[#7a4e23] text-zinc-500'
                    }`}
                    title={isVoiceEnabled ? 'Silenciar narración de voz' : 'Activar narración de voz'}
                  >
                    {isVoiceEnabled ? (
                      <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    ) : (
                      <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    )}
                  </motion.button>

                  {/* Switch Character */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleToggleCharacter}
                    className="px-2 sm:px-2.5 py-1 rounded-xl bg-[#2a1d13] hover:bg-[#3d2a1b] border border-[#7a4e23] hover:border-amber-400 text-[10px] sm:text-xs font-bold font-cinzel text-amber-300 flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                    title="Alternar entre Lucina e Ike"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>{characterType === 'ike' ? 'Lucina' : 'Ike'}</span>
                  </motion.button>

                  {/* Close Guide */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      stop();
                      onClose();
                    }}
                    className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/80 text-amber-200/80 hover:text-white flex items-center justify-center transition-colors border border-amber-700/50 shadow-sm cursor-pointer"
                    title="Cerrar Guía (Esc)"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>

              {/* Animated Dialogue Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`dialogue-${characterType}-${currentStepIndex}`}
                  initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="space-y-2"
                >
                  <h3 className="font-cinzel text-sm sm:text-base text-amber-300 tracking-wide leading-snug font-bold">
                    {currentStep.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#fdf4dc] leading-relaxed font-game-ui tracking-wide">
                    {activeDialog.speech}
                  </p>

                  {/* Tactical Tip Banner */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.25 }}
                    className="p-2 sm:p-2.5 rounded-xl bg-[#251b13]/85 border border-[#8a5d2b]/60 flex items-start gap-2 text-amber-200 text-[11px] sm:text-xs shadow-inner"
                  >
                    <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{activeDialog.tacticalTip}</span>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-900/40">
                {/* Step Dots Indicator */}
                <div className="flex items-center space-x-1.5">
                  {TUTOR_STEPS.map((step, idx) => (
                    <motion.button
                      key={step.id}
                      onClick={() => {
                        onStepSound?.();
                        setCurrentStepIndex(idx);
                      }}
                      animate={{
                        width: idx === currentStepIndex ? 28 : 9,
                        backgroundColor:
                          idx === currentStepIndex ? '#fbbf24' : '#451a03',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="h-2 sm:h-2.5 rounded-full cursor-pointer"
                      title={`Ir al paso ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {currentStepIndex > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handlePrev}
                      className="game-btn px-3.5 py-1.5 rounded-xl bg-[#2a1d13] hover:bg-[#3a281a] border border-[#6d4624] border-b-2 border-b-[#1c120a] text-amber-200 text-xs font-bold font-game-ui flex items-center space-x-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className={`game-btn px-4 sm:px-5 py-1.5 rounded-xl font-game-ui font-black text-xs flex items-center space-x-1.5 shadow-md cursor-pointer ${
                      isLastStep
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border border-emerald-400 border-b-3 border-b-emerald-900 shadow-emerald-900/40'
                        : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:to-yellow-400 text-black border border-amber-300 border-b-3 border-b-amber-800 shadow-amber-950/40'
                    }`}
                  >
                    {isLastStep ? (
                      <>
                        <Swords className="w-4 h-4 text-white" />
                        <span>¡A la Batalla!</span>
                      </>
                    ) : (
                      <>
                        <span>Siguiente</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Bouncing Prompt Arrow */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-2 right-2 sm:right-3 pointer-events-none"
              >
                <span className="text-amber-400 font-black text-xs drop-shadow">▼</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TutorGuideModal;
