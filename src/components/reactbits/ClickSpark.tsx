import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties, type ReactNode } from 'react';

export type ClickSparkShape = 'line' | 'streak' | 'dot' | 'star';
export type ClickSparkEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';

export interface ClickSparkProps {
  sparkColor?: string | string[];
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  sparkWidth?: number;
  duration?: number;
  easing?: ClickSparkEasing;
  extraScale?: number;
  shape?: ClickSparkShape;
  randomness?: number;
  gravity?: number;
  spread?: number;
  direction?: number;
  glow?: number;
  ring?: boolean;
  layer?: 'front' | 'back';
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export interface ClickSparkHandle {
  spark: (x?: number, y?: number) => void;
}

interface Settings {
  colors: string[];
  size: number;
  radius: number;
  count: number;
  width: number;
  duration: number;
  ease: (t: number) => number;
  shape: ClickSparkShape;
  randomness: number;
  gravity: number;
  spread: number;
  direction: number;
  glow: number;
  ring: boolean;
  disabled: boolean;
}

interface Spark {
  angle: number;
  reach: number;
  scale: number;
  life: number;
  spin: number;
  color: string;
  clear: string;
  glow: number;
}

interface Burst {
  x: number;
  y: number;
  start: number;
  sparks: Spark[];
  settings: Settings;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ratio: number;
  left: number;
  top: number;
}

const EASINGS: Record<string, (t: number) => number> = {
  linear: (t) => t,
  'ease-in': (t) => t * t,
  'ease-out': (t) => 1 - Math.pow(1 - t, 3),
  'ease-in-out': (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  spring: (t) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2),
};

const MAX_BURSTS = 32;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

const toColors = (value: string | string[]): string[] => {
  const list = (Array.isArray(value) ? value : [value]).filter(Boolean);
  return list.length ? list : ['#ffffff'];
};

const starPath = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rotation: number) => {
  const pinch = radius * 0.16;
  ctx.beginPath();
  ctx.moveTo(x + Math.cos(rotation) * radius, y + Math.sin(rotation) * radius);
  for (let i = 1; i <= 4; i++) {
    const a = rotation + (i * Math.PI) / 2;
    const mid = a - Math.PI / 4;
    ctx.quadraticCurveTo(
      x + Math.cos(mid) * pinch,
      y + Math.sin(mid) * pinch,
      x + Math.cos(a) * radius,
      y + Math.sin(a) * radius
    );
  }
  ctx.closePath();
};

export const ClickSpark = forwardRef<ClickSparkHandle, ClickSparkProps>(
  (
    {
      sparkColor = '#fff',
      sparkSize = 14,
      sparkRadius = 30,
      sparkCount = 8,
      sparkWidth = 2,
      duration = 500,
      easing = 'ease-out',
      extraScale = 1,
      shape = 'line',
      randomness = 0.2,
      gravity = 0,
      spread = 360,
      direction = 0,
      glow = 0,
      ring = false,
      layer = 'front',
      disabled = false,
      className = '',
      style,
      children,
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<HTMLSpanElement>(null);
    const engineRef = useRef<ClickSparkHandle | null>(null);
    const settings: Settings = {
      colors: toColors(sparkColor),
      size: Math.max(0, sparkSize),
      radius: Math.max(0, sparkRadius) * Math.max(0, extraScale),
      count: clamp(Math.round(sparkCount), 1, 64),
      width: Math.max(0.5, sparkWidth),
      duration: Math.max(120, duration),
      ease: EASINGS[easing] ?? EASINGS['ease-out'],
      shape,
      randomness: clamp(randomness, 0, 1),
      gravity: Math.max(0, gravity),
      spread: clamp(spread, 10, 360),
      direction,
      glow: clamp(glow, 0, 1),
      ring,
      disabled,
    };
    const settingsRef = useRef(settings);
    settingsRef.current = settings;

    useEffect(() => {
      const root = rootRef.current;
      const layer = layerRef.current;
      if (!root || !layer) return undefined;

      const bursts: Burst[] = [];
      let raf = 0;

      const drop = (s: Settings, t: number) => (s.gravity ? 0.5 * s.gravity * 500 * t * t : 0);

      const remove = (burst: Burst) => {
        burst.canvas.remove();
        const index = bursts.indexOf(burst);
        if (index >= 0) bursts.splice(index, 1);
      };

      const frame = (now: number) => {
        for (let i = bursts.length - 1; i >= 0; i--) {
          const b = bursts[i];
          const s = b.settings;
          const elapsed = now - b.start;
          const linear = elapsed / s.duration;

          if (linear >= 1) {
            remove(b);
            continue;
          }

          const ctx = b.ctx;
          const ratio = b.ratio;
          ctx.clearRect(0, 0, b.canvas.width, b.canvas.height);

          const localX = (b.x - b.left) * ratio;
          const localY = (b.y - b.top) * ratio;

          for (const spark of b.sparks) {
            const life = clamp(linear / spark.life, 0, 1);
            if (life >= 1) continue;

            const progress = s.ease(life);
            const dist = s.radius * spark.reach * progress * ratio;
            const currentX = localX + Math.cos(spark.angle) * dist;
            const currentY = localY + Math.sin(spark.angle) * dist + drop(s, (elapsed / 1000) * life) * ratio;

            const fade = 1 - smoothstep(0.6, 1, life);
            const scale = (1 - life * 0.5) * spark.scale;
            const size = s.size * scale * ratio;

            ctx.save();
            ctx.fillStyle = spark.color;
            ctx.globalAlpha = fade;

            if (s.shape === 'star') {
              starPath(ctx, currentX, currentY, size, spark.spin + life * Math.PI);
              ctx.fill();
            } else if (s.shape === 'dot') {
              ctx.beginPath();
              ctx.arc(currentX, currentY, Math.max(1, size * 0.5), 0, Math.PI * 2);
              ctx.fill();
            } else {
              // line / streak
              const lineLen = size * 1.5;
              ctx.strokeStyle = spark.color;
              ctx.lineWidth = s.width * ratio;
              ctx.beginPath();
              ctx.moveTo(currentX, currentY);
              ctx.lineTo(
                currentX + Math.cos(spark.angle) * lineLen,
                currentY + Math.sin(spark.angle) * lineLen
              );
              ctx.stroke();
            }

            ctx.restore();
          }
        }

        if (bursts.length) {
          raf = requestAnimationFrame(frame);
        } else {
          raf = 0;
        }
      };

      const spawn = (clientX: number, clientY: number) => {
        const s = settingsRef.current;
        if (s.disabled) return;
        const rect = root.getBoundingClientRect();
        const heading = (s.direction * Math.PI) / 180;
        const arc = (s.spread * Math.PI) / 180;
        const step = s.count > 1 ? arc / (s.spread >= 360 ? s.count : s.count - 1) : 0;
        const offset = Math.floor(Math.random() * s.colors.length);

        const sparks: Spark[] = Array.from({ length: s.count }, (_, i) => {
          const base = s.spread >= 360 ? heading + step * i : s.count > 1 ? heading - arc / 2 + step * i : heading;
          const jitter = (Math.random() - 0.5) * s.randomness;
          return {
            angle: base + jitter * (step || arc || 1) * 0.9,
            reach: 1 + (Math.random() - 0.5) * 0.7 * s.randomness,
            scale: 1 + (Math.random() - 0.5) * 0.8 * s.randomness,
            life: 1 + (Math.random() - 0.5) * 0.5 * s.randomness,
            spin: Math.random() - 0.5,
            color: s.colors[(i + offset) % s.colors.length],
            clear: '',
            glow: 0,
          };
        });

        const reach = s.radius * 1.5 + s.size * 2 + 20;
        const box = {
          left: Math.max(clientX - reach, 0),
          top: Math.max(clientY - reach, 0),
          right: Math.min(clientX + reach, window.innerWidth),
          bottom: Math.min(clientY + reach, window.innerHeight),
        };

        if (box.right - box.left < 1 || box.bottom - box.top < 1) return;

        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil((box.right - box.left) * ratio);
        canvas.height = Math.ceil((box.bottom - box.top) * ratio);
        Object.assign(canvas.style, {
          position: 'absolute',
          left: `${box.left - rect.left}px`,
          top: `${box.top - rect.top}px`,
          width: `${box.right - box.left}px`,
          height: `${box.bottom - box.top}px`,
          display: 'block',
          pointerEvents: 'none',
        });
        canvas.setAttribute('aria-hidden', 'true');
        layer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          canvas.remove();
          return;
        }

        bursts.push({
          x: clientX,
          y: clientY,
          start: performance.now(),
          sparks,
          settings: { ...s },
          canvas,
          ctx,
          ratio,
          left: box.left,
          top: box.top,
        });

        while (bursts.length > MAX_BURSTS) remove(bursts[0]);
        if (!raf) raf = requestAnimationFrame(frame);
      };

      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return;
        spawn(event.clientX, event.clientY);
      };

      root.addEventListener('pointerdown', onPointerDown);

      engineRef.current = {
        spark: (x?: number, y?: number) => {
          const rect = root.getBoundingClientRect();
          spawn(rect.left + (x ?? rect.width / 2), rect.top + (y ?? rect.height / 2));
        },
      };

      return () => {
        cancelAnimationFrame(raf);
        root.removeEventListener('pointerdown', onPointerDown);
        for (const burst of [...bursts]) remove(burst);
        engineRef.current = null;
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        spark: (x?: number, y?: number) => engineRef.current?.spark(x, y),
      }),
      []
    );

    return (
      <div ref={rootRef} className={`relative isolate h-full w-full ${className}`.trim()} style={style}>
        {children}
        <span
          ref={layerRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 overflow-visible ${layer === 'back' ? 'z-[-1]' : 'z-[999]'}`}
        />
      </div>
    );
  }
);

ClickSpark.displayName = 'ClickSpark';

export default ClickSpark;
