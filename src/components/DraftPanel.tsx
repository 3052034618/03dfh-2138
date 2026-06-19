import { useState } from 'react';
import { usePosterStore } from '../store/posterStore';
import { TONE_THEMES } from '../config/toneThemes';
import { Save, Trash2, FolderDown, Copy, X, Plus } from 'lucide-react';

export const DraftPanel = ({ onClose }: { onClose: () => void }) => {
  const { drafts, saveDraft, deleteDraft, loadDraft, duplicateDraft, updateDraft, form } =
    usePosterStore();
  const [newName, setNewName] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleSaveNew = () => {
    const name = newName.trim() || form.scriptName || undefined;
    saveDraft(name);
    setNewName('');
  };

  const fmtTime = (t: number) =>
    new Date(t).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl animate-pop">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xl text-white shadow-md">
            📁
          </div>
          <div>
            <h3 className="text-xl font-black text-zinc-800">本地草稿箱</h3>
            <p className="text-xs text-zinc-500">存在浏览器里，刷新不丢～最多随便存</p>
          </div>
        </div>

        <div className="mb-4 flex gap-2 rounded-2xl bg-zinc-50 p-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="给这个草稿起个名字（可留空）"
            className="flex-1 rounded-xl border-2 border-zinc-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-400"
          />
          <button
            onClick={handleSaveNew}
            className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 px-4 py-2 text-sm font-black text-white shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-4 w-4" /> 保存当前
          </button>
        </div>

        <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {drafts.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-10 text-center">
              <div className="mb-2 text-5xl opacity-50">📭</div>
              <div className="text-sm font-medium text-zinc-500">还没有草稿</div>
              <div className="mt-1 text-xs text-zinc-400">先编辑好海报，然后点上面「保存当前」按钮</div>
            </div>
          ) : (
            drafts.map((d) => {
              const theme = TONE_THEMES[d.tone];
              const isConfirm = confirmId === d.id;
              return (
                <div
                  key={d.id}
                  className="group relative flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div
                    className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white shadow-md"
                    style={{ background: theme.bg, color: theme.text }}
                  >
                    <span className="text-lg leading-none">{theme.tagEmoji}</span>
                    <span className="mt-0.5 text-[10px] font-black leading-none">
                      {d.tone.slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black text-zinc-800">{d.name}</div>
                    <div className="mt-0.5 truncate text-xs text-zinc-500">
                      《{d.form.scriptName}》· {d.form.filledPlayers}/{d.form.totalPlayers}人 ·{' '}
                      {d.size}
                    </div>
                    <div className="mt-0.5 text-[10px] text-zinc-400">
                      更新于 {fmtTime(d.updatedAt)}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => loadDraft(d.id)}
                      title="载入草稿"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"
                    >
                      <FolderDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => duplicateDraft(d.id)}
                      title="复制一份"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors hover:bg-sky-100"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateDraft(d.id)}
                      title="覆盖保存"
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    {isConfirm ? (
                      <div className="flex items-center gap-1 rounded-xl bg-red-50 px-2">
                        <span className="text-[10px] font-bold text-red-600">确定?</span>
                        <button
                          onClick={() => {
                            deleteDraft(d.id);
                            setConfirmId(null);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-500"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(d.id)}
                        title="删除草稿"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
