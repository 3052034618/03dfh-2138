import { usePosterStore } from '../store/posterStore';
import { TONE_THEMES } from '../config/toneThemes';
import type { Tone } from '../types';
import { cn } from '../lib/utils';

const TONES: Tone[] = ['沙雕招募', '认真找队友', '新手友好', '缺气氛担当'];

export const ToneSelector = () => {
  const { tone, setTone } = usePosterStore();

  return (
    <div className="w-full">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-zinc-800">
        <span className="text-2xl">🎨</span> 选择组局口吻
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TONES.map((t) => {
          const theme = TONE_THEMES[t];
          const isActive = tone === t;
          return (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300',
                'hover:-translate-y-1 hover:shadow-xl active:scale-95',
                isActive
                  ? 'scale-[1.02] border-transparent shadow-xl ring-2 ring-offset-2 ring-offset-white animate-wiggle'
                  : 'border-zinc-200 bg-white shadow-sm hover:border-zinc-300'
              )}
              style={
                isActive
                  ? {
                      background: theme.bg,
                      boxShadow: `0 10px 40px ${theme.primary}55`,
                      ['--tw-ring-color' as string]: theme.primary,
                    }
                  : undefined
              }
            >
              <div
                className="absolute -right-3 -top-3 text-5xl opacity-20 transition-opacity group-hover:opacity-40"
                aria-hidden
              >
                {theme.decorElements.slice(0, 3).join('')}
              </div>
              <div className="relative">
                <div className="mb-2 text-3xl">{theme.tagEmoji}</div>
                <div
                  className={cn(
                    'text-base font-extrabold',
                    isActive ? theme.text : 'text-zinc-800'
                  )}
                  style={isActive ? { color: theme.text } : undefined}
                >
                  {t}
                </div>
                <div
                  className={cn(
                    'mt-1 line-clamp-2 text-xs',
                    isActive ? 'opacity-80' : 'text-zinc-500'
                  )}
                  style={isActive ? { color: theme.text } : undefined}
                >
                  {theme.ctaCopy[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
