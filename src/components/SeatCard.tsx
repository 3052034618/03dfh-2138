import { useState, useRef, useEffect } from 'react';
import type { Seat, SeatRole } from '../types';
import { SEAT_ROLES, getSeatDisplay } from '../types';
import { cn } from '../lib/utils';
import { usePosterStore } from '../store/posterStore';
import { Check, Edit3 } from 'lucide-react';

interface Props {
  seat: Seat;
  compact?: boolean;
  forPoster?: boolean;
}

export const SeatCard = ({ seat, compact = false, forPoster = false }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState(seat.customTag || '');
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSeatRole, setSeatCustomTag } = usePosterStore();
  const display = getSeatDisplay(seat);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setCustomMode(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (customMode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [customMode]);

  useEffect(() => {
    setCustomInput(seat.customTag || '');
  }, [seat.customTag]);

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

  const submitCustom = () => {
    const v = customInput.trim();
    if (v) {
      setSeatCustomTag(seat.id, v.slice(0, 8));
    } else {
      setSeatCustomTag(seat.id, '');
    }
    setCustomMode(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => !forPoster && !customMode && setMenuOpen((v) => !v)}
        className={cn(
          'group relative flex flex-col items-center justify-center rounded-xl border-2 transition-all',
          compact ? 'h-14 w-14 gap-0' : 'h-20 w-full gap-1',
          forPoster
            ? 'cursor-default border-dashed'
            : 'border-dashed hover:-translate-y-0.5 hover:shadow-lg active:scale-95',
          menuOpen && !forPoster ? 'ring-2 ring-orange-300' : ''
        )}
        style={{
          borderColor: forPoster ? display.color : display.color + '88',
          background: forPoster
            ? `linear-gradient(135deg, ${display.color}22, ${display.color}11)`
            : `linear-gradient(135deg, ${display.color}15, white)`,
        }}
      >
        {!forPoster && !compact && !customMode && (
          <div
            className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full"
            style={{ background: display.color }}
          />
        )}
        {customMode ? (
          <input
            ref={inputRef}
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onBlur={submitCustom}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitCustom();
              } else if (e.key === 'Escape') {
                setCustomMode(false);
                setCustomInput(seat.customTag || '');
              }
            }}
            maxLength={8}
            placeholder="自定义..."
            className="w-[90%] rounded-md border border-sky-400 bg-white/90 px-1 py-0.5 text-center text-[11px] font-bold text-sky-700 outline-none"
            style={{ color: display.color }}
          />
        ) : (
          <>
            <div className={cn(forPoster ? 'text-xl' : 'text-2xl')}>{display.emoji}</div>
            <div
              className={cn(
                'font-bold',
                compact ? 'text-[9px]' : forPoster ? 'text-[11px]' : 'text-[11px]'
              )}
              style={{ color: display.color }}
            >
              {display.label}
            </div>
            {!forPoster && !compact && (
              <div className="text-[9px] text-zinc-500">
                {seat.customTag ? '点我换/清空' : '点我换类型'}
              </div>
            )}
          </>
        )}
      </button>

      {menuOpen && !forPoster && !customMode && (
        <div className="absolute left-1/2 top-full z-30 mt-2 w-48 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl animate-pop">
          <div className="mb-1 px-2 pt-1 text-[10px] font-bold text-zinc-400">标记空位类型</div>
          {SEAT_ROLES.map((r) => {
            const active = !seat.customTag && seat.role === r.role;
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
          <div className="mt-1 border-t border-zinc-100 pt-1">
            <button
              onClick={() => {
                setCustomMode(true);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-sky-600 transition-colors hover:bg-sky-50"
            >
              <Edit3 className="h-4 w-4" />
              <div className="flex-1">
                <div className="text-sm font-bold">自定义标签</div>
                <div className="text-[10px] text-zinc-500">比如：高能玩家 / 别跳车</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
