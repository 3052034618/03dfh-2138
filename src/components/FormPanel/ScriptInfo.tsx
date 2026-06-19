import { usePosterStore } from '@/store/posterStore';

export const ScriptInfo = () => {
  const { form, updateForm } = usePosterStore();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">📜</span>
        <h4 className="text-base font-bold text-zinc-800">剧本信息</h4>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-zinc-600">剧本名</span>
        <input
          type="text"
          value={form.scriptName}
          onChange={(e) => updateForm({ scriptName: e.target.value })}
          placeholder="比如：搞钱、青楼、群星夺目..."
          className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 outline-none transition-colors focus:border-orange-400 focus:bg-white"
        />
      </label>
    </div>
  );
};
