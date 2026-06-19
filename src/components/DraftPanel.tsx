import { useMemo, useState } from 'react';
import { usePosterStore } from '../store/posterStore';
import { TONE_THEMES } from '../config/toneThemes';
import {
  Save,
  Trash2,
  FolderDown,
  Copy,
  X,
  Plus,
  Search,
  ArrowUpDown,
  CalendarClock,
  ScrollText,
  FileJson,
} from 'lucide-react';

type Tab = 'drafts' | 'departures';
type SortMode = 'updatedAt' | 'createdAt' | 'name';

export const DraftPanel = ({ onClose }: { onClose: () => void }) => {
  const {
    drafts,
    departures,
    saveDraft,
    deleteDraft,
    loadDraft,
    duplicateDraft,
    updateDraft,
    form,
    loadDeparture,
    deleteDeparture,
    departureToDraft,
  } = usePosterStore();
  const [tab, setTab] = useState<Tab>('drafts');
  const [newName, setNewName] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [depConfirmId, setDepConfirmId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<SortMode>('updatedAt');

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

  const filteredDrafts = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    let list = drafts;
    if (kw) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(kw) ||
          d.form.scriptName.toLowerCase().includes(kw) ||
          d.form.location.toLowerCase().includes(kw)
      );
    }
    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'zh-CN');
      if (sort === 'createdAt') return b.createdAt - a.createdAt;
      return b.updatedAt - a.updatedAt;
    });
    return list;
  }, [drafts, keyword, sort]);

  const filteredDepartures = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    let list = departures;
    if (kw) {
      list = list.filter(
        (d) =>
          d.form.scriptName.toLowerCase().includes(kw) ||
          d.form.location.toLowerCase().includes(kw)
      );
    }
    return [...list].sort((a, b) => b.sharedAt - a.sharedAt);
  }, [departures, keyword]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl animate-pop max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-xl text-white shadow-md">
            📁
          </div>
          <div>
            <h3 className="text-xl font-black text-zinc-800">发车管理</h3>
            <p className="text-xs text-zinc-500">草稿箱 + 发车历史，本地保存，刷新不丢</p>
          </div>
        </div>

        <div className="mb-3 flex gap-2 rounded-2xl bg-zinc-100 p-1">
          <button
            onClick={() => setTab('drafts')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
              tab === 'drafts'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <FileJson className="h-4 w-4" /> 草稿箱
            <span className="rounded-full bg-zinc-200 px-1.5 text-[10px]">{drafts.length}</span>
          </button>
          <button
            onClick={() => setTab('departures')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all ${
              tab === 'departures'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <ScrollText className="h-4 w-4" /> 发车记录
            <span className="rounded-full bg-zinc-200 px-1.5 text-[10px]">
              {departures.length}
            </span>
          </button>
        </div>

        <div className="mb-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={tab === 'drafts' ? '搜索草稿名 / 剧本名 / 地点...' : '搜索剧本名 / 地点...'}
              className="w-full rounded-xl border-2 border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-indigo-400"
            />
          </div>
          {tab === 'drafts' && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="inline-flex items-center gap-1 rounded-xl border-2 border-zinc-200 bg-white px-3 py-2 text-sm font-bold text-zinc-600 outline-none transition-colors focus:border-indigo-400"
            >
              <option value="updatedAt">按更新时间</option>
              <option value="createdAt">按创建时间</option>
              <option value="name">按名称排序</option>
            </select>
          )}
        </div>

        {tab === 'drafts' && (
          <div className="mb-3 flex gap-2 rounded-2xl bg-zinc-50 p-3">
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
        )}

        <div className="flex-1 overflow-y-auto pr-1">
          {tab === 'drafts' ? (
            filteredDrafts.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-10 text-center">
                <div className="mb-2 text-5xl opacity-50">📭</div>
                <div className="text-sm font-medium text-zinc-500">
                  {keyword ? '没有匹配的草稿' : '还没有草稿'}
                </div>
                <div className="mt-1 text-xs text-zinc-400">
                  {keyword ? '换个关键词试试' : '先编辑好海报，然后点上面「保存当前」按钮'}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDrafts.map((d) => {
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
                        <div className="mt-0.5 flex items-center gap-3 text-[10px] text-zinc-400">
                          <span className="inline-flex items-center gap-0.5">
                            <CalendarClock className="h-3 w-3" /> 更新于 {fmtTime(d.updatedAt)}
                          </span>
                          <span>创建于 {fmtTime(d.createdAt)}</span>
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
                })}
              </div>
            )
          ) : filteredDepartures.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-10 text-center">
              <div className="mb-2 text-5xl opacity-50">🚌</div>
              <div className="text-sm font-medium text-zinc-500">
                {keyword ? '没有匹配的发车记录' : '还没有发车记录'}
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                {keyword ? '换个关键词试试' : '分享海报或复制文案后会自动记录在这里'}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDepartures.map((d) => {
                const theme = TONE_THEMES[d.tone];
                const isConfirm = depConfirmId === d.id;
                return (
                  <div
                    key={d.id}
                    className="group relative flex items-center gap-3 rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-black text-zinc-800">
                          《{d.form.scriptName || '未命名'}》
                        </span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                            d.shareType === 'poster'
                              ? 'bg-pink-50 text-pink-600'
                              : d.shareType === 'copy'
                              ? 'bg-sky-50 text-sky-600'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}
                        >
                          {d.shareType === 'poster'
                            ? '海报'
                            : d.shareType === 'copy'
                            ? '文案'
                            : '海报+文案'}
                        </span>
                        {d.contactShown && (
                          <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                            带联系方式
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-zinc-500">
                        {d.form.dateTime || '（无时间）'} · {d.form.location || '（无地点）'} ·{' '}
                        {d.form.filledPlayers}/{d.form.totalPlayers}人（差{' '}
                        {Math.max(0, d.form.totalPlayers - d.form.filledPlayers)}）
                      </div>
                      <div className="mt-0.5 text-[10px] text-zinc-400">
                        分享于 {fmtTime(d.sharedAt)}
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => loadDeparture(d.id)}
                        title="重新打开继续改"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"
                      >
                        <FolderDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => departureToDraft(d.id)}
                        title="复制成新草稿再发车"
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors hover:bg-sky-100"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {isConfirm ? (
                        <div className="flex items-center gap-1 rounded-xl bg-red-50 px-2">
                          <span className="text-[10px] font-bold text-red-600">确定?</span>
                          <button
                            onClick={() => {
                              deleteDeparture(d.id);
                              setDepConfirmId(null);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500 text-white"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDepConfirmId(null)}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-zinc-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDepConfirmId(d.id)}
                          title="删除记录"
                          className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
