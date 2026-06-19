import { useState, useRef, useEffect } from 'react';
import type { Seat, SeatRole } from '../types';
import { SEAT_ROLES } from '../types';
import { cn } from '../lib/utils';
import { usePosterStore } from '../store/posterStore';
import { Check } from 'lucide-react';

interface Props {
  seat: Seat;
  compact?: boolean;
  forPoster?: boolean;
  posterTone?: string;
}

export const SeatCard = ({ seat, compact = false, forPoster = false }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setSeatRole, tone } = usePosterStore();
  const currentRole = SEAT_ROLES.find((r) => r.role === seat.role) || SEAT_ROLES[3];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (seat.status === 'filled') {
    return (
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 bg-white/90 backdrop-blur',
          compact ? 'h-14 w-14 gap-0' : 'h-20 w-full gap-1',
          forPoster ? 'border-green-400' : 'border-emerald-200'
        )}
        style={
          forPoster
            ? {
                borderColor: '#10B981',
                boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.2)',
              }
            : undefined
        }
      >
        <div className={cn(forPoster ? 'text-xl' : 'text-2xl')}>✅</div>
        {!compact && (
          <div className="line-clamp-1 px-1 text-center text-[10px] font-medium text-emerald-700">
            {seat.memberTag}
          </div>
        )}
        {!forPoster && (
          <div className="absolute -right-1 -top-1 rounded-full bg-emerald-500 p-0.5 text-white shadow">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => !forPoster && setMenuOpen((v) => !v)}
        className={cn(
          'group relative flex flex-col items-center justify-center rounded-xl border-2 transition-all',
          compact ? 'h-14 w-14 gap-0' : 'h-20 w-full gap-1',
          forPoster
            ? 'cursor-default border-dashed'
            : 'border-dashed hover:-translate-y-0.5 hover:shadow-lg active:scale-95',
          menuOpen && !forPoster ? 'ring-2 ring-orange-300' : ''
        )}
        style={{
          borderColor: forPoster ? currentRole.color : undefined,
          background: forPoster
            ? `linear-gradient(135deg, ${currentRole.color}22, ${currentRole.color}11)`
            : `linear-gradient(135deg, ${currentRole.color}15, white)`,
        }}
      >
        {!forPoster && !compact && (
          <div className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full" style={{ background: currentRole.color }} />
        )}
        <div className={cn(forPoster ? 'text-xl' : 'text-2xl')}>{currentRole.emoji}</div>
        <div
          className={cn(
            'font-bold',
            compact ? 'text-[9px]' : forPoster ? 'text-[11px]' : 'text-[11px]'
          )}
          style={{ color: currentRole.color }}
        >
          {currentRole.role}
        </div>
        {!forPoster && !compact && (
          <div className="text-[9px] text-zinc-500">{currentRole.desc}</div>
        )}
      </button>

      {menuOpen && !forPoster && (
        <div className="absolute left-1/2 top-full z-30 mt-2 w-44 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl animate-pop">
          <div className="mb-1 px-2 pt-1 text-[10px] font-bold text-zinc-400">标记空位类型</div>
          {SEAT_ROLES.map((r) => {
            const active = seat.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => {
                  setSeatRole(seat.id, r.role as SeatRole);
                  setMenuOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition-colors',
                  active ? 'bg-zinc-100 font-bold' : 'hover:bg-zinc-50'
                )}
                style={active ? { color: r.color } : undefined}
              >
                <span className="text-lg">{r.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm" style={active ? { color: r.color } : undefined}>
                    {r.role}
                  </div>
                  <div className="text-[10px] text-zinc-500">{r.desc}</div>
                </div>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
