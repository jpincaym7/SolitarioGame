import { useEffect, useRef } from 'react';

export interface GradientASCIIProps {
  colors?: string[];
  shape?: 'horizon' | 'radial' | 'diagonal';
  characters?: string;
  cellSize?: number;
  density?: number;
  glyphOpacity?: number;
  glow?: number;
  depthOfField?: number;
  flicker?: number;
  softness?: number;
  scale?: number;
  flow?: number;
  speed?: number;
  gradientOpacity?: number;
  grain?: number;
  variation?: number;
  mouseInteraction?: boolean;
  scrambleRadius?: number;
  clickEffect?: 'wave' | 'ripple' | 'none';
  intro?: boolean;
  lightMode?: boolean;
  className?: string;
}

export function GradientASCII({
  colors = ['#1e3fd8', '#f6f8ff', '#a5d8ff', '#38bdf8'],
  shape = 'horizon',
  characters = ' =+xX0S8#@',
  cellSize = 18,
  density = 0.8,
  glyphOpacity = 0.85,
  glow = 0.2,
  depthOfField = 0,
  flicker = 0.2,
  softness = 0.5,
  scale = 1,
  flow = 0.5,
  speed = 1,
  gradientOpacity = 0.9,
  grain = 0.08,
  variation = 0,
  mouseInteraction = true,
  scrambleRadius = 0.1,
  clickEffect = 'wave',
  intro = true,
  lightMode = false,
  className = '',
}: GradientASCIIProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const wavesRef = useRef<{ x: number; y: number; radius: number; life: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Optimized DPR scaling capped at 1.5 for ultra-low GPU/CPU overhead
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
      if (clickEffect === 'none') return;
      wavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
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

    const charList = characters.length > 0 ? characters : ' =+xX0S8#@';
    const charLen = charList.length;

    let time = 0;
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      time += dt * speed * 0.8;

      ctx.clearRect(0, 0, width, height);

      // 1. Smooth ambient gradient backdrop
      const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
      const c0 = colors[0] || '#1e3fd8';
      const c1 = colors[1] || '#f6f8ff';
      const c2 = colors[2] || '#a5d8ff';
      const c3 = colors[3] || '#38bdf8';

      baseGrad.addColorStop(0, '#040817');
      baseGrad.addColorStop(0.35, c0);
      baseGrad.addColorStop(0.65, c3);
      baseGrad.addColorStop(1, '#02050e');

      ctx.save();
      ctx.globalAlpha = gradientOpacity * 0.45;
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Update click waves
      for (let w = wavesRef.current.length - 1; w >= 0; w--) {
        const wave = wavesRef.current[w];
        wave.radius += dt * 400;
        wave.life -= dt * 1.5;
        if (wave.life <= 0) {
          wavesRef.current.splice(w, 1);
        }
      }

      // 3. Render ASCII Matrix
      const step = Math.max(12, Math.floor(cellSize * scale));
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const maxScrambleDist = Math.max(width, height) * scrambleRadius;

      ctx.save();
      ctx.font = `600 ${Math.floor(step * 0.85)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const flickerOffset = flicker > 0 ? (Math.random() - 0.5) * flicker * 0.2 : 0;
      const baseAlpha = Math.max(0.1, glyphOpacity + flickerOffset);

      for (let y = step / 2; y < height; y += step) {
        const ny = y / height;
        for (let x = step / 2; x < width; x += step) {
          const nx = x / width;

          // Horizon shape harmonic wave calculation
          let wave = Math.sin(nx * 4 + time * flow) * 0.3 + Math.cos(ny * 3 - time * flow * 0.6) * 0.3;
          if (shape === 'radial') {
            const dx = nx - 0.5;
            const dy = ny - 0.5;
            wave = Math.sin(Math.sqrt(dx * dx + dy * dy) * 8 - time * flow) * 0.4;
          }

          let intensity = Math.max(0, Math.min(1, ny + wave * 0.5 + softness * 0.2));

          // Scramble & mouse interaction
          let isScrambled = false;
          if (mouseInteraction && mx >= 0 && my >= 0) {
            const dx = x - mx;
            const dy = y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxScrambleDist) {
              isScrambled = true;
              intensity = Math.min(1, intensity + (1 - dist / maxScrambleDist) * 0.6);
            }
          }

          // Click wave ripple influence
          for (let w = 0; w < wavesRef.current.length; w++) {
            const wave = wavesRef.current[w];
            const dx = x - wave.x;
            const dy = y - wave.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (Math.abs(d - wave.radius) < 35) {
              intensity = Math.min(1, intensity + wave.life * 0.5);
              isScrambled = true;
            }
          }

          const charIndex = isScrambled
            ? Math.floor(Math.random() * charLen)
            : Math.floor(intensity * (charLen - 1));

          const char = charList[Math.max(0, Math.min(charLen - 1, charIndex))];

          // Text color interpolation
          ctx.fillStyle = intensity > 0.6 ? c1 : intensity > 0.3 ? c2 : c3;
          ctx.globalAlpha = baseAlpha * Math.max(0.2, intensity);

          if (glow > 0) {
            ctx.shadowColor = c3;
            ctx.shadowBlur = glow * 8;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, x, y);
        }
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
    shape,
    characters,
    cellSize,
    density,
    glyphOpacity,
    glow,
    depthOfField,
    flicker,
    softness,
    scale,
    flow,
    speed,
    gradientOpacity,
    grain,
    variation,
    mouseInteraction,
    scrambleRadius,
    clickEffect,
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

export default GradientASCII;
