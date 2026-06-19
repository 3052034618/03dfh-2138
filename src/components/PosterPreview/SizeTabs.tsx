import { usePosterStore } from '../../store/posterStore';
import { SIZE_PRESETS } from '../../config/sizePresets';
import { cn } from '../../lib/utils';

export const SizeTabs = () => {
  const { size, setSize } = usePosterStore();

  return (
    <div className="inline-flex rounded-2xl border border-zinc-200 bg-white p-1 shadow-sm">
      {SIZE_PRESETS.map((s) => {
        const active = size === s.key;
        return (
          <button
            key={s.key}
            onClick={() => setSize(s.key)}
            className={cn(
              'relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all',
              active
                ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg scale-[1.02]'
                : 'text-zinc-600 hover:bg-zinc-50'
            )}
          >
            <span className="text-lg">{s.emoji}</span>
            <span>{s.label}</span>
            <span
              className={cn(
                'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                active ? 'bg-white/25 text-white' : 'bg-zinc-100 text-zinc-500'
              )}
            >
              {s.width}×{s.height}
            </span>
          </button>
        );
      })}
    </div>
  );
};
