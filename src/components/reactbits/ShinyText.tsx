import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type Easing = 'smooth' | 'linear' | 'snappy';
type Trigger = 'loop' | 'hover' | 'view';

export interface ShinyTextProps {
  text?: string;
  children?: ReactNode;
  color?: string;
  shineColor?: string;
  speed?: number;
  delay?: number;
  angle?: number;
  shineWidth?: number;
  softness?: number;
  bands?: number;
  glow?: number;
  direction?: 'left' | 'right';
  easing?: Easing;
  trigger?: Trigger;
  yoyo?: boolean;
  followPointer?: boolean;
  pauseOnHover?: boolean;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface Settings {
  color: string;
  shineColor: string;
  speed: number;
  delay: number;
  angle: number;
  shineWidth: number;
  softness: number;
  bands: number;
  glow: number;
  sign: number;
  ease: (t: number) => number;
  trigger: Trigger;
  yoyo: boolean;
  followPointer: boolean;
  pauseOnHover: boolean;
  disabled: boolean;
}

const EASINGS: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => 0.5 - Math.cos(Math.PI * t) / 2,
  snappy: (t) => (t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2),
};
const TRIGGERS: Trigger[] = ['loop', 'hover', 'view'];
const FALLOFF = [0, 0.2, 0.4, 0.6, 0.8, 1];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

let paint: CanvasRenderingContext2D | null = null;

const parseColor = (value: string): number[] | null => {
  if (typeof document === 'undefined') return null;
  if (!paint) paint = document.createElement('canvas').getContext('2d');
  if (!paint) return null;
  paint.fillStyle = '#000000';
  paint.fillStyle = value;
  const resolved = String(paint.fillStyle);
  if (resolved.startsWith('#')) {
    return [1, 3, 5].map((i) => parseInt(resolved.slice(i, i + 2), 16)).concat(1);
  }
  const parts = resolved.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return null;
  return [Number(parts[0]), Number(parts[1]), Number(parts[2]), parts.length > 3 ? Number(parts[3]) : 1];
};

const blend = (from: number[], to: number[], amount: number) => {
  const channel = (a: number, b: number) =>
    Math.round(Math.pow(Math.pow(a / 255, 2.2) * (1 - amount) + Math.pow(b / 255, 2.2) * amount, 1 / 2.2) * 255);
  const alpha = from[3] * (1 - amount) + to[3] * amount;
  if (alpha <= 0) return 'rgba(0, 0, 0, 0)';
  const weigh = (a: number, b: number) => (a * from[3] * (1 - amount) + b * to[3] * amount) / alpha;
  const r = from[3] === to[3] ? channel(from[0], to[0]) : Math.round(weigh(from[0], to[0]));
  const g = from[3] === to[3] ? channel(from[1], to[1]) : Math.round(weigh(from[1], to[1]));
  const b = from[3] === to[3] ? channel(from[2], to[2]) : Math.round(weigh(from[2], to[2]));
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 1000) / 1000})`;
};

export const ShinyText = ({
  text,
  children,
  color = '#b5b5b5',
  shineColor = '#ffffff',
  speed = 2,
  delay = 0,
  angle = 120,
  shineWidth = 40,
  softness = 0.8,
  bands = 1,
  glow = 0,
  direction = 'left',
  easing = 'smooth',
  trigger = 'loop',
  yoyo = false,
  followPointer = false,
  pauseOnHover = false,
  disabled = false,
  className = '',
  style,
}: ShinyTextProps) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const settingsRef = useRef<Settings | null>(null);
  const syncRef = useRef<(() => void) | null>(null);
  const content = children ?? text;

  settingsRef.current = {
    color,
    shineColor,
    speed: Math.max(0.1, speed),
    delay: Math.max(0, delay),
    angle,
    shineWidth: clamp(shineWidth, 2, 200),
    softness: clamp(softness, 0, 1),
    bands: clamp(Math.round(bands), 1, 3),
    glow: clamp(glow, 0, 1),
    sign: direction === 'right' ? 1 : -1,
    ease: EASINGS[easing as Easing] ?? EASINGS.smooth,
    trigger: TRIGGERS.includes(trigger as Trigger) ? (trigger as Trigger) : 'loop',
    yoyo,
    followPointer,
    pauseOnHover,
    disabled,
  };

  useEffect(() => {
    syncRef.current?.();
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = {
      pos: null as number | null,
      vel: 0,
      phase: 'idle',
      from: 0,
      to: 0,
      start: 0,
      duration: 0,
      resume: 0,
      target: 0,
      inside: false,
      visible: true,
      seen: false,
      flip: false,
    };

    let timer = 0;
    let raf = 0;
    let alive = true;

    const span = () => {
      const s = settingsRef.current!;
      const radians = (s.angle * Math.PI) / 180;
      const rect = root.getBoundingClientRect();
      const length = Math.abs(rect.width * Math.sin(radians)) + Math.abs(rect.height * Math.cos(radians)) || 1;
      return length * (s.shineWidth / 100);
    };

    const entry = () => {
      const s = settingsRef.current!;
      const edge = 50 + (s.sign * (50 + span())) / 2;
      return s.sign > 0 ? -edge : edge;
    };

    const exit = () => {
      const s = settingsRef.current!;
      const edge = 50 + (s.sign * (50 + span())) / 2;
      return s.sign > 0 ? edge : -edge;
    };

    const sweep = (from: number, to: number, now: number) => {
      const s = settingsRef.current!;
      state.phase = 'sweep';
      state.from = from;
      state.to = to;
      state.start = now;
      state.duration = (s.speed * 1000) / 2;
    };

    const draw = () => {
      const s = settingsRef.current!;
      if (s.disabled || state.pos === null) {
        root.style.removeProperty('background-image');
        return;
      }
      const c1 = parseColor(s.color) || [181, 181, 181, 1];
      const c2 = parseColor(s.shineColor) || [255, 255, 255, 1];
      const stops: string[] = [];
      const half = s.shineWidth / 2;

      for (let b = 0; b < s.bands; b++) {
        const offset = (b - (s.bands - 1) / 2) * (s.shineWidth * 0.8);
        const center = state.pos + offset;
        for (const t of FALLOFF) {
          const at = center - half + t * s.shineWidth;
          const factor = Math.cos(t * Math.PI - Math.PI / 2);
          stops.push(`${blend(c1, c2, factor)} ${at.toFixed(2)}%`);
        }
      }

      root.style.backgroundImage = `linear-gradient(${s.angle}deg, ${stops.join(', ')})`;
    };

    const tick = (now: number) => {
      if (!alive) return;
      const s = settingsRef.current!;

      if (state.phase === 'sweep') {
        const t = clamp((now - state.start) / state.duration, 0, 1);
        state.pos = state.from + (state.to - state.from) * s.ease(t);
        draw();
        if (t < 1) {
          raf = requestAnimationFrame(tick);
          return;
        }
        if (s.trigger !== 'loop' || reduce) {
          state.phase = 'idle';
          state.pos = null;
          draw();
          return;
        }
        state.phase = 'wait';
        state.resume = now + s.delay * 1000;
      }

      if (state.phase === 'wait') {
        if (!state.visible) return;
        if (now < state.resume) {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => requestAnimationFrame(tick), state.resume - now);
          return;
        }
        sweep(entry(), exit(), now);
        raf = requestAnimationFrame(tick);
        return;
      }

      if (state.phase === 'idle' && s.trigger === 'loop' && !reduce && state.visible) {
        sweep(entry(), exit(), now);
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((item) => item.isIntersecting);
      state.visible = visible;
      if (visible) wake();
    });
    observer.observe(root);

    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <span
      ref={rootRef}
      className={`relative inline-block bg-no-repeat [background-size:100%_100%] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] ${className}`}
      style={{ backgroundImage: `linear-gradient(${color}, ${color})`, ...style }}
    >
      {content}
      {glow > 0 ? (
        <span
          ref={glowRef}
          className="absolute inset-0 bg-no-repeat [background-size:100%_100%] bg-clip-text [-webkit-background-clip:text] [filter:blur(0.14em)] pointer-events-none select-none"
          aria-hidden="true"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
};

export default ShinyText;
