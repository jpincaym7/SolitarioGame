import React, { useEffect, useRef } from 'react';

export type SpotlightShape = 'circle' | 'beam';

export type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string;
  intensity?: number;
  spotlightSize?: number;
  softness?: number;
  shape?: SpotlightShape;
  borderGlow?: number;
  proximity?: number;
  smoothing?: number;
  ambient?: boolean;
  flare?: boolean;
  grain?: number;
  theme?: 'dark' | 'light';
};

type Palette = { surface: string; border: string; shadow: string; light: string; fill: number; edge: number };

type Settings = {
  shape: SpotlightShape;
  fill: string;
  edge: string;
  size: number;
  intensity: number;
  borderGlow: number;
  proximity: number;
  smoothing: number;
  ambient: boolean;
  flare: boolean;
  grain: number;
};

const THEMES: Record<'dark' | 'light', Palette> = {
  dark: {
    surface: '#0f172a',
    border: 'rgba(255, 255, 255, 0.12)',
    shadow: '0 24px 48px -24px rgba(0, 0, 0, 0.7)',
    light: '#fbbf24',
    fill: 0.8,
    edge: 1,
  },
  light: {
    surface: '#ffffff',
    border: 'rgba(24, 24, 27, 0.1)',
    shadow: '0 1px 2px rgba(24, 24, 27, 0.04), 0 18px 40px -20px rgba(24, 24, 27, 0.16)',
    light: '#18181b',
    fill: 0.28,
    edge: 0.7,
  },
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const falloff = (color: string, softness: number) => {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha: number, at: number) =>
    `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const list = [stop(1, 0)];
  for (let i = 0; i <= 14; i++) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return list.join(', ');
};

export const SpotlightCard = ({
  children,
  className = '',
  style,
  spotlightColor,
  intensity = 0.2,
  spotlightSize = 280,
  softness = 0.7,
  shape = 'circle',
  borderGlow = 0.8,
  proximity = 80,
  smoothing = 0.3,
  ambient = false,
  flare = true,
  grain = 0,
  theme = 'dark',
  ...rest
}: SpotlightCardProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLSpanElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const palette = THEMES[theme] ?? THEMES.dark;
  const color = spotlightColor ?? palette.light;
  const settings: Settings = {
    shape,
    fill: falloff(color, softness),
    edge: falloff(color, 1),
    size: Math.max(20, spotlightSize),
    intensity: clamp(intensity, 0, 1) * palette.fill,
    borderGlow: clamp(borderGlow, 0, 1) * palette.edge,
    proximity: Math.max(0, proximity),
    smoothing: clamp(smoothing, 0, 1),
    ambient,
    flare,
    grain: clamp(grain, 0, 1),
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    const light = lightRef.current;
    const edge = edgeRef.current;
    if (!root || !light || !edge) return undefined;

    const state = { x: 0, y: 0, presence: 0, flare: 0, time: 0, pressed: false, visible: true };
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0;
    let alive = true;

    const paint = (s: Settings) => {
      const x = state.x;
      const y = state.y;
      const radius = s.size;
      const opacity = state.presence * s.intensity;
      const edgeOpacity = state.presence * s.borderGlow;

      light.style.opacity = String(opacity);
      light.style.backgroundImage = `radial-gradient(${radius}px circle at ${x}px ${y}px, ${s.fill}, transparent)`;

      edge.style.opacity = String(edgeOpacity);
      edge.style.backgroundImage = `radial-gradient(${radius * 1.2}px circle at ${x}px ${y}px, ${s.edge}, transparent)`;
    };

    const tick = () => {
      if (!alive) return;
      const s = settingsRef.current;

      const rect = root.getBoundingClientRect();
      const localX = pointer.x - rect.left;
      const localY = pointer.y - rect.top;

      state.x += (localX - state.x) * 0.2;
      state.y += (localY - state.y) * 0.2;

      const inside = pointer.active && localX >= -s.proximity && localX <= rect.width + s.proximity && localY >= -s.proximity && localY <= rect.height + s.proximity;
      const targetPresence = inside ? 1 : 0;
      state.presence += (targetPresence - state.presence) * 0.15;

      paint(s);

      if (state.presence > 0.01 || inside) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const wake = () => {
      if (raf || !alive) return;
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      wake();
    };

    const onLeave = () => {
      pointer.active = false;
      wake();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      wakeRef.current = null;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative isolate overflow-hidden rounded-2xl border border-slate-700/80 [background-color:var(--spotlight-card-surface)] [box-shadow:var(--spotlight-card-shadow)] ${className}`}
      style={
        {
          '--spotlight-card-surface': palette.surface,
          '--spotlight-card-border': palette.border,
          '--spotlight-card-shadow': palette.shadow,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <span
        ref={lightRef}
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
      <span
        ref={edgeRef}
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] p-px opacity-0 transition-opacity duration-300"
        aria-hidden="true"
      />
    </div>
  );
};

export default SpotlightCard;
