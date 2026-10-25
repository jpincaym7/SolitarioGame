import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface DeveloperMedallionProps {
  onOpenCredits?: () => void;
  onSoundFeedback?: () => void;
}

export const DeveloperMedallion: React.FC<DeveloperMedallionProps> = ({
  onOpenCredits,
  onSoundFeedback,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close when clicking anywhere outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      onSoundFeedback?.();
      setIsOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    onSoundFeedback?.();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="fixed right-0 bottom-3 sm:bottom-4 z-40 select-none pointer-events-none"
    >
      <div className="relative flex flex-col items-end">
        {/* =========================================================================
            SPEECH BUBBLE: PLACED DIRECTLY ABOVE THE AVATAR (NEVER COVERS THE CARDS)
            ========================================================================= */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ type: 'spring', damping: 18, stiffness: 300 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenCredits?.();
              }}
              className="absolute bottom-full right-1 mb-2.5 px-3.5 py-2 rounded-2xl bg-[#0c101a]/95 border-2 border-amber-400 shadow-[0_12px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(245,158,11,0.3)] backdrop-blur-md pointer-events-auto cursor-pointer group whitespace-nowrap"
              title="Haz clic para ver más en los créditos"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">👋</span>
                <div className="leading-tight text-left">
                  <span className="text-[7.5px] font-cinzel font-black tracking-[0.25em] text-amber-400 uppercase block">
                    ¡HOLA!
                  </span>
                  <span className="font-cinzel text-xs font-black tracking-wide text-white block mt-0.5">
                    Desarrollado por <strong className="text-amber-300 font-black">Jordy Pincay</strong> 👑
                  </span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse ml-0.5" />
              </div>

              {/* Speech bubble arrow pointing down towards Jordy's head */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0c101a] border-r-2 border-b-2 border-amber-400 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            3D CHARACTER PEEKING (COMPACT SIZE, SITS BELOW CARDS IN RIGHT MARGIN)
            ========================================================================= */}
        <motion.div
          animate={{
            x: isOpen ? 0 : '40%',
            rotate: isOpen ? 0 : -8,
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 220,
          }}
          style={{ transformOrigin: 'bottom right' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="relative pointer-events-auto cursor-pointer w-20 sm:w-24 h-auto flex-shrink-0 filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.45)] transition-all"
        >
          {/* Character Image with Waving Hand and Red Beanie */}
          <img
            src="/assets/avatar/jordy_wave_bottom.png"
            alt="Jordy Pincay saludando"
            className="w-full h-auto object-contain block select-none pointer-events-none"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/avatar/jordy_avatar.png';
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperMedallion;
