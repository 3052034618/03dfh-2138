import { useState } from 'react';
import { usePosterStore } from '@/store/posterStore';
import { Plus, X } from 'lucide-react';

const MEMBER_PRESET_TAGS = [
  '推土机',
  '水龙头',
  '气氛组',
  '搞笑男',
  '搞笑女',
  '情感本战神',
  '情感本选手',
  '菠萝头',
  '推理机器',
  '戏精',
  '老骗子',
];

export const PlayerConfig = () => {
  const { form, updateForm } = usePosterStore();
  const [tagInput, setTagInput] = useState('');

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t) return;
    if (form.memberFeatures.includes(t)) return;
    updateForm({ memberFeatures: [...form.memberFeatures, t] });
  };

  const removeTag = (tag: string) => {
    updateForm({ memberFeatures: form.memberFeatures.filter((t) => t !== tag) });
  };

  const updateContact = (patch: Partial<typeof form.contact>) => {
    updateForm({ contact: { ...form.contact, ...patch } });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">👥</span>
        <h4 className="text-base font-bold text-zinc-800">人员配置</h4>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600">总人数</span>
          <select
            value={form.totalPlayers}
            onChange={(e) => {
              const total = Number(e.target.value);
              updateForm({
                totalPlayers: total,
                filledPlayers: Math.min(form.filledPlayers, total),
              });
            }}
            className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
          >
            {Array.from({ length: 10 }, (_, i) => i + 3).map((n) => (
              <option key={n} value={n}>
                {n} 人
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-zinc-600">已到人数</span>
          <select
            value={form.filledPlayers}
            onChange={(e) =>
              updateForm({ filledPlayers: Math.min(Number(e.target.value), form.totalPlayers) })
            }
            className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
          >
            {Array.from({ length: form.totalPlayers + 1 }, (_, i) => i).map((n) => (
              <option key={n} value={n}>
                {n} 人
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 transition-colors hover:border-orange-300">
          <span className="text-sm text-zinc-700">🔄 可反串</span>
          <input
            type="checkbox"
            checked={form.allowCross}
            onChange={(e) => updateForm({ allowCross: e.target.checked })}
            className="h-5 w-5 accent-orange-500"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 transition-colors hover:border-orange-300">
          <span className="text-sm text-zinc-700">🌱 接受新手</span>
          <input
            type="checkbox"
            checked={form.allowNewbie}
            onChange={(e) => updateForm({ allowNewbie: e.target.checked })}
            className="h-5 w-5 accent-orange-500"
          />
        </label>
      </div>

      <div className="mb-4">
        <span className="mb-2 block text-xs font-medium text-zinc-600">
          ✨ 已有成员特点（点标签添加/删除）
        </span>
        <p className="mb-2 text-[11px] text-zinc-400">修改不会影响你标好的空位类型～</p>
        <div className="mb-2 flex flex-wrap gap-2">
          {MEMBER_PRESET_TAGS.map((tag) => {
            const active = form.memberFeatures.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => (active ? removeTag(tag) : addTag(tag))}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  active
                    ? 'border-orange-400 bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(tagInput);
                setTagInput('');
              }
            }}
            placeholder="自定义标签，回车添加"
            className="flex-1 rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => {
              addTag(tagInput);
              setTagInput('');
            }}
            className="flex items-center gap-1 rounded-xl bg-orange-500 px-3 py-2 text-sm font-medium text-white shadow-md shadow-orange-200 transition-colors hover:bg-orange-600 active:scale-95"
          >
            <Plus className="h-4 w-4" /> 添加
          </button>
        </div>
        {form.memberFeatures.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-zinc-500">已选：</span>
            {form.memberFeatures.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700"
              >
                {t}
                <button onClick={() => removeTag(t)} className="hover:text-orange-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-zinc-100 pt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📞</span>
            <h4 className="text-base font-bold text-zinc-800">局头联系方式</h4>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full bg-zinc-100 px-3 py-1">
            <span className="text-xs font-medium text-zinc-600">显示在海报和文案</span>
            <input
              type="checkbox"
              checked={form.contact.enabled}
              onChange={(e) => updateContact({ enabled: e.target.checked })}
              className="h-4 w-4 accent-orange-500"
            />
          </label>
        </div>

        {form.contact.enabled && (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600">💚 微信号</span>
              <input
                type="text"
                value={form.contact.wechat}
                onChange={(e) => updateContact({ wechat: e.target.value })}
                placeholder="例如：ju_tou_888"
                className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-zinc-600">🔑 备注口令（加好友时说）</span>
              <input
                type="text"
                value={form.contact.password}
                onChange={(e) => updateContact({ password: e.target.value })}
                placeholder="例如：剧本杀"
                className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none transition-colors focus:border-orange-400 focus:bg-white"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-zinc-200 bg-zinc-50 px-3 py-2 transition-colors hover:border-orange-300">
              <span className="text-sm text-zinc-700">🤝 需要先私聊确认再上车</span>
              <input
                type="checkbox"
                checked={form.contact.needConfirm}
                onChange={(e) => updateContact({ needConfirm: e.target.checked })}
                className="h-5 w-5 accent-orange-500"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
