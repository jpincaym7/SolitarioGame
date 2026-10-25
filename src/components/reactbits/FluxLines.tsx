import { useEffect, useRef } from 'react';

export interface FluxLinesProps {
  colors?: string[];
  glow?: number;
  rimWidth?: number;
  lineWidth?: number;
  flowDirection?: 'down' | 'up' | 'left' | 'right';
  mouseInteraction?: boolean;
  clickSwirl?: boolean;
  speed?: number;
  scale?: number;
  turbulence?: number;
  fluidity?: number;
  sharpness?: number;
  shimmer?: number;
  mouseStrength?: number;
  mouseRadius?: number;
  intro?: boolean;
  lightMode?: boolean;
  className?: string;
}

export function FluxLines({
  colors = ['#ffffff', '#ffffff', '#ffffff'],
  glow = 2,
  rimWidth = 0.2,
  lineWidth = 1,
  flowDirection = 'down',
  mouseInteraction = true,
  clickSwirl = true,
  speed = 0.5,
  scale = 1.6,
  turbulence = 1,
  fluidity = 0.1,
  sharpness = 2.5,
  shimmer = 1.5,
  mouseStrength = 1,
  mouseRadius = 0.35,
  intro = true,
  lightMode = false,
  className = '',
}: FluxLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const swirlsRef = useRef<{ x: number; y: number; angle: number; life: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Optimized DPR scaling for crisp lines without heavy GPU cost
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
      if (!clickSwirl) return;
      swirlsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        angle: 0,
        life: 1.0,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Streamlines generator
    const lineCount = 38;
    const streamlines = Array.from({ length: lineCount }, (_, i) => ({
      xRatio: (i + 0.5) / lineCount,
      phase: Math.random() * Math.PI * 2,
      speedFactor: 0.8 + Math.random() * 0.4,
      color: colors[i % colors.length] || '#ffffff',
      seed: Math.random() * 100,
    }));

    let time = 0;
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      time += dt * speed;

      ctx.clearRect(0, 0, width, height);

      // Deep dark canvas background
      ctx.fillStyle = '#05070c';
      ctx.fillRect(0, 0, width, height);

      // Update click swirls
      for (let s = swirlsRef.current.length - 1; s >= 0; s--) {
        const sw = swirlsRef.current[s];
        sw.angle += dt * 5;
        sw.life -= dt * 1.2;
        if (sw.life <= 0) {
          swirlsRef.current.splice(s, 1);
        }
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseRange = Math.max(width, height) * mouseRadius;

      ctx.save();
      ctx.lineWidth = Math.max(0.8, lineWidth * scale * 0.7);
      ctx.globalCompositeOperation = 'screen';

      if (glow > 0) {
        ctx.shadowColor = colors[0] || '#ffffff';
        ctx.shadowBlur = glow * 6;
      }

      const pointsPerLine = 32;

      for (let i = 0; i < streamlines.length; i++) {
        const stream = streamlines[i];
        const baseX = stream.xRatio * width;

        ctx.strokeStyle = stream.color;

        // Dynamic shimmering alpha
        const shimmerAlpha = 0.25 + 0.35 * Math.sin(time * shimmer * 2 + stream.phase);
        ctx.globalAlpha = Math.max(0.12, Math.min(0.85, shimmerAlpha));

        ctx.beginPath();

        for (let p = 0; p <= pointsPerLine; p++) {
          const t = p / pointsPerLine;
          const y = t * height;

          // Flow and turbulence calculation
          const flowOffset = (flowDirection === 'down' ? y : -y) * 0.003;
          const turb =
            Math.sin(time * stream.speedFactor + flowOffset + stream.seed) * (18 * turbulence * scale) +
            Math.cos(time * 0.5 + y * 0.005 * fluidity) * (12 * turbulence);

          let x = baseX + turb;

          // Mouse swirl & repulsion
          if (mouseInteraction && mx >= 0 && my >= 0) {
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouseRange && dist > 0) {
              const force = (1 - dist / mouseRange) * (35 * mouseStrength);
              x += (dx / dist) * force;
            }
          }

          // Active click swirls
          for (let s = 0; s < swirlsRef.current.length; s++) {
            const sw = swirlsRef.current[s];
            const dx = x - sw.x;
            const dy = y - sw.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 0) {
              const angle = Math.atan2(dy, dx) + sw.angle * (1 - dist / 180);
              x = sw.x + Math.cos(angle) * dist * sw.life;
            }
          }

          if (p === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
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
    colors,
    glow,
    rimWidth,
    lineWidth,
    flowDirection,
    mouseInteraction,
    clickSwirl,
    speed,
    scale,
    turbulence,
    fluidity,
    sharpness,
    shimmer,
    mouseStrength,
    mouseRadius,
    intro,
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

export default FluxLines;
