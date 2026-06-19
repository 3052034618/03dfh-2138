import { forwardRef, useMemo } from 'react';
import { usePosterStore } from '../../store/posterStore';
import { TONE_THEMES } from '../../config/toneThemes';
import { SIZE_PRESETS, getSizeConfig } from '../../config/sizePresets';
import { getMissingCount, pickRandom } from '../../utils/seatGenerator';
import type { Seat } from '../../types';
import { getSeatDisplay } from '../../types';

interface PosterCanvasProps {
  sizeKey?: (typeof SIZE_PRESETS)[number]['key'];
}

const SeatMini = ({ seat }: { seat: Seat }) => {
  if (seat.status === 'filled') {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border-2"
        style={{
          borderColor: '#10B981',
          background: 'rgba(16,185,129,0.12)',
        }}
      >
        <div className="text-xl leading-none">✅</div>
        <div className="mt-0.5 w-full truncate px-1 text-center text-[10px] font-semibold text-emerald-800">
          {seat.memberTag}
        </div>
      </div>
    );
  }
  const d = getSeatDisplay(seat);
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed"
      style={{
        borderColor: d.color,
        background: `${d.color}1A`,
        boxShadow: `inset 0 0 0 1px ${d.color}33`,
      }}
    >
      <div className="text-xl leading-none">{d.emoji}</div>
      <div className="mt-0.5 text-[10px] font-extrabold" style={{ color: d.color }}>
        {d.label}
      </div>
    </div>
  );
};

export const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(({ sizeKey }, ref) => {
  const { tone, form, seats, size: storeSize } = usePosterStore();
  const actualSize = sizeKey || storeSize;
  const theme = TONE_THEMES[tone];
  const cfg = getSizeConfig(actualSize);
  const missing = getMissingCount(form.totalPlayers, form.filledPlayers);
  const progress = form.totalPlayers > 0 ? form.filledPlayers / form.totalPlayers : 0;
  const contact = form.contact;
  const contactVisible =
    contact.enabled && (contact.wechat.trim() || contact.password.trim() || contact.needConfirm);

  const decor = useMemo(() => {
    const pool = theme.decorElements;
    return [0, 1, 2, 3, 4, 5].map(() => pickRandom(pool));
  }, [theme]);

  const seatsGridCols =
    seats.length <= 4 ? 'grid-cols-2'
    : seats.length <= 6 ? 'grid-cols-3'
    : seats.length <= 8 ? 'grid-cols-4'
    : seats.length <= 10 ? 'grid-cols-5'
    : 'grid-cols-6';

  const isLong = cfg.height > cfg.width;
  const isWide = cfg.width > cfg.height;

  const infoItems = [
    { emoji: '🕒', label: '时间', value: form.dateTime || '待定' },
    { emoji: '📍', label: '地点', value: form.location || '待定' },
    { emoji: '💸', label: '费用', value: form.fee || '私聊' },
    { emoji: '🔄', label: '反串', value: form.allowCross ? '✅可反串' : '❌不接受' },
    { emoji: '🌱', label: '新手', value: form.allowNewbie ? '✅欢迎萌新' : '❌仅老手' },
  ];

  return (
    <div
      ref={ref}
      className="relative overflow-hidden shadow-2xl"
      style={{
        width: `${cfg.width}px`,
        height: `${cfg.height}px`,
        background: theme.bg,
        borderRadius: theme.borderRadius,
        color: theme.text,
        fontFamily:
          '"ZCOOL KuaiLe", "ZCOOL QingKe HuangYou", "Noto Sans SC", system-ui, sans-serif',
      }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: theme.bgPattern }} />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M0 0h30v30H0zM30 30h30v30H30z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="pointer-events-none absolute -left-10 top-20 rotate-12 text-[120px] opacity-10">
        {decor[0]}
      </div>
      <div className="pointer-events-none absolute -right-8 top-10 -rotate-12 text-[100px] opacity-10">
        {decor[1]}
      </div>
      <div className="pointer-events-none absolute bottom-40 -left-8 text-[110px] opacity-10">
        {decor[2]}
      </div>
      <div className="pointer-events-none absolute bottom-20 right-4 rotate-6 text-[90px] opacity-10">
        {decor[3]}
      </div>

      <div
        className="relative z-10 flex h-full flex-col"
        style={{ padding: isLong ? '56px 48px' : isWide ? '40px 72px' : '52px 56px' }}
      >
        <div
          className="mb-4 flex items-center justify-between rounded-2xl px-5 py-3"
          style={{
            background: theme.primary,
            color: theme.textOnPrimary,
            boxShadow: `0 10px 30px ${theme.primary}55`,
            transform: 'rotate(-1.2deg)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{theme.tagEmoji}</span>
            <div className="text-xl font-black tracking-wide" style={{ letterSpacing: '0.05em' }}>
              {tone}
            </div>
          </div>
          <div className="flex gap-1 text-2xl">
            {theme.decorElements.slice(6, 9).map((e, i) => (
              <span key={i} style={{ animation: `bounce-slow 2.5s ease-in-out ${i * 120}ms infinite` }}>
                {e}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3 text-center">
          <div
            className="mb-2 inline-block rounded-full px-4 py-1 text-sm font-bold"
            style={{ background: `${theme.accent}22`, color: theme.accent }}
          >
            🎭 欢乐机制本 · 组局招募
          </div>
          <div
            className="leading-tight"
            style={{
              fontSize: isLong ? '64px' : isWide ? '56px' : '60px',
              fontWeight: 900,
              color: theme.text,
              WebkitTextStroke: `2px ${theme.primary}`,
              textShadow: `4px 4px 0 ${theme.primary}44`,
              letterSpacing: '0.02em',
            }}
          >
            {form.scriptName || '神秘好本'}
          </div>
        </div>

        <div
          className="mb-4 rounded-2xl border-4 p-4"
          style={{
            borderStyle: 'dashed',
            borderColor: theme.borderColor,
            background: `${theme.secondary}22`,
          }}
        >
          <div className="mb-1 flex items-center justify-between">
            <div className="text-lg font-black">
              🚌 发车进度 {form.filledPlayers}/{form.totalPlayers}
            </div>
            <div
              className="rounded-full px-3 py-1 text-sm font-black"
              style={{
                background: missing > 0 ? theme.primary : '#10B981',
                color: theme.textOnPrimary,
              }}
            >
              {missing > 0 ? `还差 ${missing} 位！` : '满员发车 🚀'}
            </div>
          </div>
          <div className="relative h-5 overflow-hidden rounded-full bg-white/60">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress * 100}%`,
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 12px ${theme.primary}88`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-zinc-800 mix-blend-multiply">
              {Math.round(progress * 100)}% 已入座
            </div>
          </div>
        </div>

        <div
          className={`mb-4 grid gap-3 ${seatsGridCols}`}
          style={{
            gridAutoRows: isLong ? '100px' : isWide ? '110px' : '104px',
          }}
        >
          {seats.map((seat) => (
            <SeatMini key={seat.id} seat={seat} />
          ))}
        </div>

        <div
          className="mb-4 grid gap-3"
          style={{ gridTemplateColumns: isWide ? 'repeat(3,1fr)' : 'repeat(2,1fr)' }}
        >
          {infoItems.slice(0, isWide ? 5 : 4).map((it, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border-2 p-3"
              style={{
                borderColor: theme.borderColor,
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <span className="text-2xl">{it.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold opacity-70">{it.label}</div>
                <div className="truncate text-sm font-black">{it.value}</div>
              </div>
            </div>
          ))}
          {!isWide && (
            <div
              className="col-span-2 flex items-center gap-3 rounded-xl border-2 p-3"
              style={{
                borderColor: theme.borderColor,
                background: 'rgba(255,255,255,0.55)',
              }}
            >
              <span className="text-2xl">🌱</span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold opacity-70">新手</div>
                <div className="truncate text-sm font-black">
                  {form.allowNewbie ? '✅欢迎萌新' : '❌仅老手'}
                </div>
              </div>
            </div>
          )}
        </div>

        {contactVisible && (
          <div
            className="mb-4 rounded-2xl border-2 p-4"
            style={{
              borderColor: theme.accent,
              background: `${theme.accent}15`,
            }}
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-black" style={{ color: theme.accent }}>
              <span className="text-xl">📞</span> 局头联系方式
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.wechat.trim() && (
                <div
                  className="rounded-full px-3 py-1 text-sm font-black"
                  style={{
                    background: 'white',
                    color: theme.accent,
                    border: `2px solid ${theme.accent}`,
                  }}
                >
                  💚 微信：{contact.wechat.trim()}
                </div>
              )}
              {contact.password.trim() && (
                <div
                  className="rounded-full px-3 py-1 text-sm font-black"
                  style={{
                    background: 'white',
                    color: theme.accent,
                    border: `2px solid ${theme.accent}`,
                  }}
                >
                  🔑 备注：{contact.password.trim()}
                </div>
              )}
              {contact.needConfirm && (
                <div
                  className="rounded-full px-3 py-1 text-sm font-black"
                  style={{
                    background: theme.accent,
                    color: theme.textOnPrimary,
                  }}
                >
                  🤝 先私聊确认再上车
                </div>
              )}
            </div>
          </div>
        )}

        {form.memberFeatures.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-black">
              <span>✨ 同车队友特点</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.memberFeatures.slice(0, 12).map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="rounded-full border-2 px-3 py-1 text-sm font-bold"
                  style={{
                    borderColor: theme.badgeBg,
                    background: `${theme.badgeBg}22`,
                    color: theme.badgeBg,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto">
          <div
            className="rounded-2xl p-4 text-center font-black leading-snug"
            style={{
              background: theme.accent,
              color: theme.textOnPrimary,
              boxShadow: `0 10px 40px ${theme.accent}55`,
              fontSize: isLong ? '28px' : '26px',
              transform: 'rotate(0.6deg)',
            }}
          >
            {theme.ctaCopy[0]}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-bold opacity-80">
            <span>{decor[4]} 扫码/私信戳我上车</span>
            <span>由 · 组局海报生成器 · 提供 {decor[5]}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

PosterCanvas.displayName = 'PosterCanvas';
