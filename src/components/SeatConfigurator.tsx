import { usePosterStore } from '../store/posterStore';
import { SeatCard } from './SeatCard';
import { getMissingCount } from '../utils/seatGenerator';

export const SeatConfigurator = () => {
  const { seats, form, tone } = usePosterStore();
  const missing = getMissingCount(form.totalPlayers, form.filledPlayers);

  const gridCols =
    seats.length <= 4 ? 'grid-cols-2 md:grid-cols-4'
    : seats.length <= 6 ? 'grid-cols-3 md:grid-cols-6'
    : seats.length <= 8 ? 'grid-cols-4'
    : 'grid-cols-3 md:grid-cols-5';

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚌</span>
          <h4 className="text-base font-bold text-zinc-800">车位配置</h4>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-emerald-100 px-2 py-1 font-bold text-emerald-700">
            已到 {form.filledPlayers}
          </span>
          <span className="rounded-full bg-orange-100 px-2 py-1 font-bold text-orange-700">
            缺 {missing}
          </span>
          <span className="rounded-full bg-zinc-100 px-2 py-1 font-bold text-zinc-600">
            共 {form.totalPlayers}
          </span>
        </div>
      </div>

      <p className="mb-3 text-xs text-zinc-500">
        💡 点击空位卡片，可标记需要什么类型的玩家（
        <span className="font-medium" style={{ color: tone === '认真找队友' ? '#1D3557' : '#FF6B35' }}>
          控场/搞笑/脑洞/随缘
        </span>
        ）
      </p>

      <div className={`grid gap-3 ${gridCols}`}>
        {seats.map((seat) => (
          <SeatCard key={seat.id} seat={seat} />
        ))}
      </div>
    </div>
  );
};
