import React, { useEffect, useRef } from 'react';

export type StarBorderTheme = 'dark' | 'light';

export interface StarBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  color?: string;
  trailColor?: string;
  duration?: number;
  thickness?: number;
  radius?: number;
  stars?: number;
  direction?: 'clockwise' | 'counterclockwise';
  theme?: StarBorderTheme;
}

type Palette = { surface: string; text: string; track: string; light: string };
type Rgb = [number, number, number];
type Segment = { length: number; x: number; y: number; dx: number; dy: number; angle: number | null };
type Shape = { r: number; segments: Segment[]; total: number };
type Point = { x: number; y: number; nx: number; ny: number };

const ROOT =
  "relative isolate m-0 inline-flex items-center justify-center gap-2 rounded-[var(--star-border-radius)] border-0 px-4 py-2 font-bold text-xs leading-tight no-underline [background:var(--star-border-surface)] text-[color:var(--star-border-text)] [-webkit-tap-highlight-color:transparent] before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:shadow-[inset_0_0_0_var(--star-border-thickness)_var(--star-border-track)] before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[color:var(--star-border-track)] disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:scale-105 active:scale-95 cursor-pointer";

const LIGHT = 'pointer-events-none absolute top-[-48px] left-[-48px] -z-1 h-[calc(100%+96px)] w-[calc(100%+96px)]';

const THEMES: Record<StarBorderTheme, Palette> = {
  dark: {
    surface: '#022c22',
    text: '#ecfdf5',
    track: 'rgba(52, 211, 153, 0.3)',
    light: '#34d399',
  },
  light: {
    surface: '#ffffff',
    text: '#18181b',
    track: 'rgba(24, 24, 27, 0.12)',
    light: '#10b981',
  },
};

const BLEED = 48;
const TAU = Math.PI * 2;
const WHITE: Rgb = [255, 255, 255];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const wrap = (value: number, total: number) => ((value % total) + total) % total;
const rgba = (rgb: Rgb, alpha: number) =>
  `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${clamp(alpha, 0, 1).toFixed(3)})`;

let colorContext: CanvasRenderingContext2D | null = null;

const toRgb = (color: string): Rgb => {
  colorContext = colorContext ?? (typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null);
  if (!colorContext) return WHITE;
  colorContext.fillStyle = '#000000';
  colorContext.fillStyle = color;
  const value = String(colorContext.fillStyle);
  if (value.startsWith('#')) {
    const hex = parseInt(value.slice(1, 7), 16);
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
  }
  const parts = value.match(/[\d.]+/g)?.map(Number) ?? WHITE;
  return [parts[0], parts[1], parts[2]];
};

const outline = (width: number, height: number, radius: number): Shape => {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const arc = (Math.PI * r) / 2;
  const across = Math.max(0, width - 2 * r);
  const down = Math.max(0, height - 2 * r);
  const segments: Segment[] = [
    { length: across, x: r, y: 0, dx: 1, dy: 0, angle: null },
    { length: arc, x: width - r, y: r, dx: 0, dy: 0, angle: -Math.PI / 2 },
    { length: down, x: width, y: r, dx: 0, dy: 1, angle: null },
    { length: arc, x: width - r, y: height - r, dx: 0, dy: 0, angle: 0 },
    { length: across, x: width - r, y: height, dx: -1, dy: 0, angle: null },
    { length: arc, x: r, y: height - r, dx: 0, dy: 0, angle: Math.PI / 2 },
    { length: down, x: 0, y: height - r, dx: 0, dy: -1, angle: null },
    { length: arc, x: r, y: r, dx: 0, dy: 0, angle: Math.PI },
  ];
  const total = 2 * (across + down) + 4 * arc;
  return { r, segments, total };
};

const pointAt = (shape: Shape, distance: number, target: Point) => {
  let travel = wrap(distance, shape.total);
  for (const seg of shape.segments) {
    if (travel <= seg.length) {
      if (seg.angle === null) {
        target.x = seg.x + seg.dx * travel;
        target.y = seg.y + seg.dy * travel;
        target.nx = -seg.dy;
        target.ny = seg.dx;
      } else {
        const phi = seg.angle + travel / shape.r;
        target.x = seg.x + Math.cos(phi) * shape.r;
        target.y = seg.y + Math.sin(phi) * shape.r;
        target.nx = Math.cos(phi);
        target.ny = Math.sin(phi);
      }
      return;
    }
    travel -= seg.length;
  }
};

export const StarBorder: React.FC<StarBorderProps> = ({
  children,
  className = '',
  style,
  color,
  trailColor,
  duration = 3.5,
  thickness = 1.5,
  radius = 14,
  stars = 2,
  direction = 'clockwise',
  theme = 'dark',
  ...rest
}) => {
  const rootRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palette = THEMES[theme] ?? THEMES.dark;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let alive = true;
    let width = 0;
    let height = 0;
    let shape: Shape = { r: 0, segments: [], total: 0 };
    let phase = 0;
    const point: Point = { x: 0, y: 0, nx: 0, ny: 0 };

    const measure = () => {
      const rect = root.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = (width + BLEED * 2) * window.devicePixelRatio;
      canvas.height = (height + BLEED * 2) * window.devicePixelRatio;
      canvas.style.width = `${width + BLEED * 2}px`;
      canvas.style.height = `${height + BLEED * 2}px`;
      shape = outline(width, height, radius);
    };

    measure();

    const starColor = color ?? palette.light;
    const rgbStar = toRgb(starColor);
    const rgbTrail = toRgb(trailColor ?? starColor);

    const frame = () => {
      if (!alive) return;
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.translate(BLEED, BLEED);

      phase += (1 / (duration * 60)) * (direction === 'clockwise' ? 1 : -1);

      if (shape.total > 0) {
        const starSpacing = shape.total / stars;
        for (let i = 0; i < stars; i++) {
          const starDist = phase * shape.total + i * starSpacing;
          pointAt(shape, starDist, point);

          const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 14);
          grad.addColorStop(0, rgba(rgbStar, 0.95));
          grad.addColorStop(0.35, rgba(rgbTrail, 0.5));
          grad.addColorStop(1, rgba(rgbTrail, 0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 14, 0, TAU);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(point.x, point.y, thickness * 1.5, 0, TAU);
          ctx.fill();
        }
      }

      ctx.restore();
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [color, duration, direction, palette, radius, stars, thickness, trailColor]);

  return (
    <button
      ref={rootRef}
      type="button"
      className={`${ROOT} ${className}`}
      style={
        {
          '--star-border-radius': `${radius}px`,
          '--star-border-thickness': `${thickness}px`,
          '--star-border-surface': palette.surface,
          '--star-border-text': palette.text,
          '--star-border-track': palette.track,
          ...style,
        } as React.CSSProperties
      }
      {...rest}
    >
      <canvas ref={canvasRef} className={LIGHT} aria-hidden="true" />
      {children}
    </button>
  );
};

export default StarBorder;
