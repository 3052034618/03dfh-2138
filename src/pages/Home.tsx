import { useState } from 'react';
import { ToneSelector } from '@/components/ToneSelector';
import { FormPanel } from '@/components/FormPanel';
import { SeatConfigurator } from '@/components/SeatConfigurator';
import { PosterPreview } from '@/components/PosterPreview';
import { CopyWriterPanel } from '@/components/CopyWriterPanel';
import { DraftPanel } from '@/components/DraftPanel';
import { Dices, PartyPopper, FolderOpen } from 'lucide-react';
import { usePosterStore } from '@/store/posterStore';

export default function Home() {
  const { drafts } = usePosterStore();
  const [draftOpen, setDraftOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#FFF7ED_0%,_#FDF2F8_40%,_#F5F3FF_100%)]">
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 20% 0%, #FFE66D33 0%, transparent 70%), radial-gradient(60% 60% at 80% 0%, #F7258522 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-zinc-200/60 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-2xl shadow-lg shadow-pink-500/30">
              <Dices className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1
                className="text-2xl font-black text-zinc-900 sm:text-3xl"
                style={{ fontFamily: '"ZCOOL KuaiLe", "ZCOOL QingKe HuangYou", system-ui' }}
              >
                欢乐机制本 · 一分钟组局海报生成器{' '}
                <PartyPopper className="ml-1 inline h-7 w-7 -translate-y-1 text-pink-500" />
              </h1>
              <p className="mt-0.5 text-xs text-zinc-500 sm:text-sm">
                选口吻 → 填车况 → 标车位 → 导出海报，告别反复解释，组局就是玩儿～
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDraftOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              我的草稿箱
              {drafts.length > 0 && (
                <span className="ml-0.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[10px]">
                  {drafts.length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold text-zinc-600 shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              零门槛 · 无需登录 · 打开就用
            </div>
          </div>
        </header>

        <section className="mb-6">
          <ToneSelector />
        </section>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-3xl border border-zinc-200/70 bg-white/70 p-4 shadow-xl shadow-zinc-200/50 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <h2 className="text-lg font-black text-zinc-800">填写车况信息</h2>
                </div>
              </div>
              <FormPanel />
            </div>

            <SeatConfigurator />
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-3xl border border-zinc-200/70 bg-white/70 p-4 shadow-xl shadow-zinc-200/50 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  <h2 className="text-lg font-black text-zinc-800">海报实时预览</h2>
                </div>
                <div className="text-xs font-bold text-zinc-500">左栏修改 · 右栏实时更新</div>
              </div>
              <PosterPreview />
            </div>

            <CopyWriterPanel />
          </div>
        </div>

        <footer className="mt-10 border-t border-zinc-200/60 pt-6 text-center text-xs text-zinc-500">
          <p className="mb-2 flex items-center justify-center gap-2">
            <span>🎭</span>
            <span>
              Made with
              <span className="mx-1 text-pink-500">♥</span>
              for 剧本杀 / 桌游 爱好者 · 让每一次组局都轻松愉快
            </span>
            <span>🎲</span>
          </p>
          <p className="opacity-60">
            海报仅在本地生成，草稿保存在你自己浏览器里，不上传任何数据，放心使用～
          </p>
        </footer>
      </div>

      {draftOpen && <DraftPanel onClose={() => setDraftOpen(false)} />}
    </div>
  );
}
