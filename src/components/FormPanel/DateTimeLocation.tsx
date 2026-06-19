import { usePosterStore } from '@/store/posterStore';

export const DateTimeLocation = () => {
  const { form, updateForm } = usePosterStore();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">📍</span>
        <h4 className="text-base font-bold text-zinc-800">时间地点费用</h4>
      </div>
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600">🕒 开局时间</span>
          <input
            type="text"
            value={form.dateTime}
            onChange={(e) => updateForm({ dateTime: e.target.value })}
            placeholder="本周六 14:00"
            className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600">📍 地点</span>
          <input
            type="text"
            value={form.location}
            onChange={(e) => updateForm({ location: e.target.value })}
            placeholder="XX剧本杀·朝阳店"
            className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600">💸 费用</span>
          <input
            type="text"
            value={form.fee}
            onChange={(e) => updateForm({ fee: e.target.value })}
            placeholder="128元/人"
            className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
          />
        </label>
      </div>
    </div>
  );
};
