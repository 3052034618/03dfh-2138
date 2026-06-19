import { useEffect, useState } from 'react';
import { usePosterStore } from '../store/posterStore';
import { generateCopyText } from '../hooks/useCopyWriter';
import { copyToClipboard } from '../utils/exportPoster';
import { getChannelConfig } from '../config/channelConfigs';
import { ShareCheckModal } from './ShareCheckModal';
import { Copy, Check, RefreshCw } from 'lucide-react';
import type { PublishChannel } from '../types';

type ShareTarget = 'poster' | 'copy' | 'both';

export const CopyWriterPanel = () => {
  const { tone, form, seats } = usePosterStore();
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [regenKey, setRegenKey] = useState(0);
  const [checkOpen, setCheckOpen] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    setText(generateCopyText(tone, form, seats));
  }, [tone, form, seats, regenKey]);

  const doCopy = async (channel: PublishChannel = '微信群') => {
    setCopying(true);
    const chCfg = getChannelConfig(channel);
    const finalText = generateCopyText(tone, form, seats, chCfg.copyLength);
    setText(finalText);
    const ok = await copyToClipboard(finalText);
    setTimeout(() => setCopying(false), 1200);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleConfirm = (target: ShareTarget, channel: PublishChannel) => {
    if (target === 'copy' || target === 'both') {
      doCopy(channel);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h4 className="text-base font-bold text-zinc-800">配套群聊文案</h4>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRegenKey((k) => k + 1)}
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-bold text-zinc-600 transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600 active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" /> 换一条
          </button>
          <button
            type="button"
            onClick={() => setCheckOpen(true)}
            className="relative inline-flex items-center gap-1 overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 px-4 py-1.5 text-xs font-black text-white shadow-md shadow-pink-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> 已复制 ✅
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> 一键复制
              </>
            )}
            {copied && (
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-emerald-500 text-white animate-fly-toast">
                复制成功！发群去吧~
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 p-4 pl-10 shadow-inner">
        <div className="absolute left-3 top-4 text-2xl">💚</div>
        <pre
          className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-zinc-800"
          style={{ fontFamily: '"Noto Sans SC", system-ui, sans-serif' }}
        >
          {text}
        </pre>
        <div className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-emerald-100" aria-hidden />
      </div>
      <p className="mt-2 text-[11px] text-zinc-500">
        💡 文案根据口吻、车况、车位自动生成，点复制前会先做分享检查，避免漏掉关键信息～
      </p>

      {checkOpen && (
        <ShareCheckModal
          onClose={() => setCheckOpen(false)}
          exporting={copying}
          initialTarget="copy"
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};
