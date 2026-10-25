import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Sparkles, Crown } from 'lucide-react';
import { SpotlightCard } from '../reactbits/SpotlightCard';

interface WinCelebrationProps {
  score: number;
  time: number;
  moves: number;
  onPlayAgain: () => void;
}

interface BouncingCard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  suit: string;
  rank: string;
  isRed: boolean;
  bounces: number;
}

export const WinCelebration: React.FC<WinCelebrationProps> = ({
  score,
  time,
  moves,
  onPlayAgain,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger confetti burst on mount
  useEffect(() => {
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.6 },
    });

    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Classic Windows Solitaire Bouncing Cards Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const cardWidth = 72;
    const cardHeight = 100;

    const cards: BouncingCard[] = [];
    const suits = ['♠', '♥', '♣', '♦'];
    const ranks = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];

    let cardSpawnIndex = 0;
    let spawnTimer = 0;

    const drawCard = (card: BouncingCard) => {
      ctx.save();
      ctx.translate(card.x, card.y);

      // Card Body
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(0, 0, cardWidth, cardHeight, 6);
      ctx.fill();
      ctx.stroke();

      // Card Rank & Suit
      ctx.fillStyle = card.isRed ? '#dc2626' : '#0f172a';
      ctx.font = 'bold 14px system-ui';
      ctx.fillText(card.rank, 6, 18);
      ctx.fillText(card.suit, 6, 32);

      // Inverted rank & suit at bottom right
      ctx.fillText(card.rank, cardWidth - 18, cardHeight - 20);
      ctx.fillText(card.suit, cardWidth - 18, cardHeight - 8);

      ctx.restore();
    };

    const animate = () => {
      spawnTimer++;
      if (spawnTimer % 18 === 0 && cardSpawnIndex < 52) {
        const suitIdx = cardSpawnIndex % 4;
        const rankIdx = Math.floor(cardSpawnIndex / 4);

        cards.push({
          x: width * 0.5 + (suitIdx - 1.5) * 85,
          y: 70,
          vx: (Math.random() - 0.5) * 8 - (suitIdx < 2 ? 3 : -3),
          vy: Math.random() * -3 - 2,
          suit: suits[suitIdx],
          rank: ranks[rankIdx],
          isRed: suitIdx === 1 || suitIdx === 3,
          bounces: 0,
        });

        cardSpawnIndex++;
      }

      const gravity = 0.5;
      const bounceDamping = -0.82;

      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        drawCard(c);

        c.x += c.vx;
        c.y += c.vy;
        c.vy += gravity;

        if (c.y + cardHeight >= height) {
          c.y = height - cardHeight;
          c.vy *= bounceDamping;
          c.bounces++;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Canvas Cascade Animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Floating Victory Modal */}
      <SpotlightCard
        spotlightColor="rgba(251, 191, 36, 0.35)"
        borderGlow={0.9}
        className="relative z-10 p-6 sm:p-8 max-w-sm sm:max-w-md w-full mx-4 text-center animate-in fade-in zoom-in-95 duration-300 shadow-2xl"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-400/50 shadow-lg shadow-amber-500/20 animate-bounce">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
        </div>

        <div className="mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="font-game-title text-2xl sm:text-3xl text-amber-400 tracking-wider">
            ¡VICTORIA TOTAL!
          </h2>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>

        <p className="text-zinc-300 font-game-ui text-sm mb-6 font-semibold">
          Has completado los cuatro palos de la baraja con maestría.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6 bg-[#0b0c10] p-3 rounded-2xl border border-[#232632] shadow-inner">
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-game-ui font-black">Puntos</div>
            <div className="font-game-num text-2xl font-black text-amber-400">{score}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-game-ui font-black">Tiempo</div>
            <div className="font-game-num text-2xl font-black text-cyan-300">{formatTime(time)}</div>
          </div>
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-game-ui font-black">Movimientos</div>
            <div className="font-game-num text-2xl font-black text-emerald-400">{moves}</div>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="game-btn w-full py-4 px-6 rounded-2xl bg-[#059669] hover:bg-[#10b981] border-2 border-[#34d399] border-b-4 border-b-[#064e3b] text-white font-game-title text-sm tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" strokeWidth={2.4} />
          JUGAR OTRA PARTIDA
        </button>

        {/* Developer Attribution Signature */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-cinzel text-[10px] tracking-[0.2em] text-amber-200 font-bold uppercase">
              DESARROLLADO POR <strong className="text-amber-300 font-black">JORDY PINCAY</strong>
            </span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};
