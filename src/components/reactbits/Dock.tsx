import React, { useRef, useState } from 'react';

export interface DockItemData {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  highlighted?: boolean;
  badge?: React.ReactNode;
}

export interface DockProps {
  items: DockItemData[];
  className?: string;
}

export const Dock: React.FC<DockProps> = ({ items, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getScale = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) return 1.35;
    if (distance === 1) return 1.18;
    if (distance === 2) return 1.05;
    return 1;
  };

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 select-none ${className}`}>
      <div
        ref={containerRef}
        onMouseLeave={() => setHoveredIndex(null)}
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-amber-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(251,191,36,0.15)] ring-1 ring-white/10"
      >
        {items.map((item, index) => {
          const scale = getScale(index);
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredIndex(index)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-10 px-2.5 py-1 rounded-lg bg-slate-900/95 text-amber-200 text-[11px] font-bold tracking-wide border border-amber-400/40 shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-90 duration-150">
                  {item.label}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                </div>
              )}

              <button
                type="button"
                disabled={item.disabled}
                onClick={item.onClick}
                style={{
                  transform: `scale(${scale})`,
                  transition: 'transform 0.18s cubic-bezier(0.2, 1.2, 0.4, 1), background-color 0.2s',
                }}
                className={`
                  relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center
                  cursor-pointer transition-colors shadow-sm
                  ${
                    item.disabled
                      ? 'opacity-35 cursor-not-allowed bg-white/5 text-white/30'
                      : item.highlighted
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400 animate-pulse'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40'
                  }
                `}
                aria-label={item.label}
              >
                {item.icon}

                {/* Badge if present */}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full border border-slate-900 shadow">
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
