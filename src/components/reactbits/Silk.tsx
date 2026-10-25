import { useEffect, useRef } from 'react';

export interface SilkProps {
  color?: string;
  sheenColor?: string;
  speed?: number;
  scale?: number;
  rotation?: number;
  sheen?: number;
  depth?: number;
  glow?: number;
  noiseIntensity?: number;
  mouseInteraction?: boolean;
  clickRipple?: boolean;
  intro?: boolean;
  ripple?: number;
  wave?: number;
  variation?: number;
  interactionStrength?: number;
  fade?: number;
  lightMode?: boolean;
  className?: string;
}

export function Silk({
  color = '#5227FF',
  sheenColor = '#ffffff',
  speed = 5,
  scale = 1,
  rotation = 0,
  sheen = 0.5,
  depth = 0.5,
  glow = 0.3,
  noiseIntensity = 1.5,
  mouseInteraction = true,
  clickRipple = true,
  intro = true,
  ripple = 1,
  wave = 1,
  variation = 0,
  interactionStrength = 1,
  fade = 0,
  lightMode = false,
  className = '',
}: SilkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const ripplesRef = useRef<{ x: number; y: number; radius: number; strength: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Optimized DPR scaling for silky performance with low GPU draw
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteraction) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickRipple) return;
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        strength: 1.0 * ripple,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let time = 0;
    let lastTime = performance.now();

    const folds = [
      { yRatio: 0.25, amp: 45, freq: 0.003, speedMult: 0.08, phase: 0.5 },
      { yRatio: 0.42, amp: 65, freq: 0.0025, speedMult: 0.12, phase: 1.8 },
      { yRatio: 0.60, amp: 85, freq: 0.002, speedMult: 0.09, phase: 3.2 },
      { yRatio: 0.78, amp: 105, freq: 0.0018, speedMult: 0.14, phase: 4.6 },
      { yRatio: 0.95, amp: 120, freq: 0.0015, speedMult: 0.11, phase: 5.9 },
    ];

    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      time += dt * (speed * 0.25);

      ctx.clearRect(0, 0, width, height);

      // Base deep background
      ctx.fillStyle = '#060314';
      ctx.fillRect(0, 0, width, height);

      // Update click ripples
      for (let r = ripplesRef.current.length - 1; r >= 0; r--) {
        const rip = ripplesRef.current[r];
        rip.radius += dt * 320;
        rip.strength -= dt * 0.8;
        if (rip.strength <= 0) {
          ripplesRef.current.splice(r, 1);
        }
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.save();
      if (rotation !== 0) {
        ctx.translate(width / 2, height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);
      }

      // Draw flowing silk ribbons
      const steps = 40;

      for (let f = 0; f < folds.length; f++) {
        const fold = folds[f];
        const baseY = height * fold.yRatio;
        const currentAmp = fold.amp * wave * scale;

        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * width;
          let yOffset =
            Math.sin(time * fold.speedMult + x * fold.freq + fold.phase) * currentAmp +
            Math.cos(time * fold.speedMult * 0.7 + x * fold.freq * 1.5) * (currentAmp * 0.45);

          // Mouse dragging fold interaction
          if (mouseInteraction && mx >= 0 && my >= 0) {
            const dx = x - mx;
            const dy = (baseY + yOffset) - my;
            const distSq = dx * dx + dy * dy;
            const maxDist = 200;
            if (distSq < maxDist * maxDist && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const push = (1 - dist / maxDist) * 35 * interactionStrength;
              yOffset += push * Math.sin((dy / dist) * Math.PI);
            }
          }

          // Active ripples interaction
          for (let r = 0; r < ripplesRef.current.length; r++) {
            const rip = ripplesRef.current[r];
            const dx = x - rip.x;
            const dy = (baseY + yOffset) - rip.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const diff = Math.abs(d - rip.radius);
            if (diff < 40) {
              yOffset += Math.sin((diff / 40) * Math.PI) * (20 * rip.strength);
            }
          }

          const y = baseY + yOffset;
          if (i === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Shading gradient: rich satin shadow to luminous sheen
        const grad = ctx.createLinearGradient(0, baseY - currentAmp, 0, height);
        grad.addColorStop(0, color);
        grad.addColorStop(0.35, sheen > 0 ? sheenColor : color);
        grad.addColorStop(0.7, color);
        grad.addColorStop(1, '#020108');

        ctx.globalAlpha = 0.55 + (f / folds.length) * 0.35;
        ctx.fillStyle = grad;

        if (glow > 0) {
          ctx.shadowColor = color;
          ctx.shadowBlur = glow * 16;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    color,
    sheenColor,
    speed,
    scale,
    rotation,
    sheen,
    depth,
    glow,
    noiseIntensity,
    mouseInteraction,
    clickRipple,
    intro,
    ripple,
    wave,
    variation,
    interactionStrength,
    fade,
    lightMode,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 w-full h-full select-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

export default Silk;
