import { useRef, useState } from 'react';
import { usePosterStore } from '../../store/posterStore';
import { getSizeConfig } from '../../config/sizePresets';
import { PosterCanvas } from './PosterCanvas';
import { SizeTabs } from './SizeTabs';
import { ShareCheckModal } from '../ShareCheckModal';
import { exportPoster, copyToClipboard } from '../../utils/exportPoster';
import { generateCopyText } from '../../hooks/useCopyWriter';
import { Download, Loader2, ClipboardCheck } from 'lucide-react';

type ShareTarget = 'poster' | 'copy' | 'both';

export const PosterPreview = () => {
  const { size, form, tone, seats } = usePosterStore();
  const cfg = getSizeConfig(size);
  const posterRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [copying, setCopying] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [checkTarget, setCheckTarget] = useState<ShareTarget>('both');

  const handleExport = async () => {
    if (!posterRef.current || exporting) return;
    setExporting(true);
    try {
      await exportPoster(posterRef.current, size, form.scriptName);
    } finally {
      setTimeout(() => setExporting(false), 600);
    }
  };

  const handleCopy = async () => {
    setCopying(true);
    try {
      const text = generateCopyText(tone, form, seats);
      await copyToClipboard(text);
    } finally {
      setTimeout(() => setCopying(false), 1200);
    }
  };

  const openCheck = (target: ShareTarget) => {
    setCheckTarget(target);
    setCheckOpen(true);
  };

  const handleConfirm = (target: ShareTarget) => {
    if (target === 'poster' || target === 'both') {
      handleExport();
    }
    if (target === 'copy' || target === 'both') {
      handleCopy();
    }
  };

  const previewWidth = Math.min(
    560,
    cfg.width * (cfg.height > cfg.width ? 0.32 : cfg.width > cfg.height ? 0.26 : 0.42)
  );
  const ratio = cfg.height / cfg.width;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <SizeTabs />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openCheck('both')}
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            <ClipboardCheck className="h-4 w-4 transition-transform group-hover:rotate-6" />
            检查后分享
          </button>
          <button
            type="button"
            onClick={() => openCheck('poster')}
            disabled={exporting}
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95 disabled:opacity-60"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 transition-transform group-hover:rotate-12" />
                下载海报 PNG
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className="relative flex items-center justify-center rounded-3xl bg-zinc-900/80 p-5 shadow-2xl ring-1 ring-white/10"
        style={{
          width: previewWidth + 48,
          aspectRatio: `${cfg.width} / ${cfg.height}`,
        }}
      >
        <div className="absolute left-4 top-4 flex h-2 w-8 items-center gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
          <span className="h-2 w-2 rounded-full bg-green-500/80" />
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
          {cfg.label}预览
        </div>

        <div
          className="overflow-hidden rounded-2xl"
          style={{
            width: previewWidth,
            height: previewWidth * ratio,
          }}
        >
          <div
            style={{
              width: cfg.width,
              height: cfg.height,
              transform: `scale(${previewWidth / cfg.width})`,
              transformOrigin: 'top left',
            }}
          >
            <PosterCanvas ref={posterRef} />
          </div>
        </div>
      </div>

      {checkOpen && (
        <ShareCheckModal
          onClose={() => setCheckOpen(false)}
          exporting={exporting || copying}
          initialTarget={checkTarget}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
