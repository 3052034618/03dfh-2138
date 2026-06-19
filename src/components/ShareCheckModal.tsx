import { useMemo, useState } from 'react';
import { usePosterStore } from '../store/posterStore';
import { getMissingCount } from '../utils/seatGenerator';
import { getSeatDisplay, isContactActuallyShown } from '../types';
import { generateShareSuggestions } from '../utils/shareSuggestions';
import { CHANNEL_CONFIGS, getChannelConfig } from '../config/channelConfigs';
import { getSizeConfig } from '../config/sizePresets';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  ChevronRight,
  Sparkles,
  AlertOctagon,
  AlertCircle,
  Send,
  Image,
  FileText,
} from 'lucide-react';
import type { ShareType, PublishChannel } from '../types';

type CheckType = 'ok' | 'warn' | 'err';
interface CheckItem {
  label: string;
  value: string;
  status: CheckType;
  tip: string;
}

type ShareTarget = 'poster' | 'copy' | 'both';

interface Props {
  onClose: () => void;
  exporting: boolean;
  initialTarget?: ShareTarget;
  onConfirm: (target: ShareTarget, channel: PublishChannel) => void;
}

export const ShareCheckModal = ({
  onClose,
  exporting,
  initialTarget = 'both',
  onConfirm,
}: Props) => {
  const { form, tone, size, seats, addDeparture, setSize } = usePosterStore();
  const [channel, setChannel] = useState<PublishChannel>('微信群');
  const missing = getMissingCount(form.totalPlayers, form.filledPlayers);

  const channelCfg = useMemo(() => getChannelConfig(channel), [channel]);
  const contactActuallyShown = useMemo(
    () => isContactActuallyShown(form.contact),
    [form.contact]
  );

  const checks: CheckItem[] = useMemo(() => {
    const items: CheckItem[] = [];

    items.push({
      label: '剧本名',
      value: form.scriptName || '（未填）',
      status: form.scriptName?.trim() ? 'ok' : 'warn',
      tip: form.scriptName?.trim() ? '' : '建议填写剧本名以便识别',
    });

    items.push({
      label: '发车进度',
      value: `${form.filledPlayers}/${form.totalPlayers} 人，还差 ${missing} 位`,
      status: missing === 0 ? 'ok' : missing >= form.totalPlayers ? 'warn' : 'ok',
      tip: missing === 0 ? '满员啦，可以直接发车！🎉' : '',
    });

    const empties = seats.filter((s) => s.status === 'empty');
    items.push({
      label: '空位标记',
      value:
        empties.length === 0
          ? '已满员'
          : empties
              .map((s) => getSeatDisplay(s).label)
              .filter((v, i, a) => a.indexOf(v) === i)
              .join(' / '),
      status: empties.every((s) => s.role || s.customTag) ? 'ok' : 'warn',
      tip: empties.length > 0 ? '空位最好标记需要什么类型的玩家' : '',
    });

    items.push({
      label: '开局时间',
      value: form.dateTime || '（未填）',
      status: form.dateTime?.trim() ? 'ok' : 'err',
      tip: form.dateTime?.trim() ? '' : '一定要写时间！别人不知道什么时候来',
    });

    items.push({
      label: '地点',
      value: form.location || '（未填）',
      status: form.location?.trim() ? 'ok' : 'err',
      tip: form.location?.trim() ? '' : '地点必填，不然人找不到',
    });

    items.push({
      label: '费用',
      value: form.fee || '（未填）',
      status: form.fee?.trim() ? 'ok' : 'warn',
      tip: form.fee?.trim() ? '' : '建议写清楚费用，避免尴尬',
    });

    items.push({
      label: '反串政策',
      value: form.allowCross ? '✅ 可反串' : '❌ 不接受反串',
      status: 'ok',
      tip: '',
    });

    items.push({
      label: '新手政策',
      value: form.allowNewbie ? '✅ 接受新手' : '❌ 仅老手',
      status: 'ok',
      tip: '',
    });

    if (form.contact.enabled) {
      items.push({
        label: '局头联系方式',
        value: contactActuallyShown
          ? [
              form.contact.wechat && `微信：${form.contact.wechat}`,
              form.contact.password && `口令：${form.contact.password}`,
              form.contact.needConfirm ? '需要私聊确认' : '',
            ]
              .filter(Boolean)
              .join(' · ')
          : '（开关已开但未填任何实际内容）',
        status: contactActuallyShown ? 'ok' : 'warn',
        tip: contactActuallyShown
          ? ''
          : '已开启显示但微信号/口令都为空，不会显示在海报和文案里',
      });
    } else {
      items.push({
        label: '联系方式',
        value: '未开启（不会出现在海报和文案里）',
        status: 'warn',
        tip: '别人看到海报怎么联系你？建议开启～',
      });
    }

    items.push({
      label: '口吻',
      value: tone,
      status: 'ok',
      tip: '',
    });

    items.push({
      label: '导出尺寸',
      value: size,
      status: 'ok',
      tip: '',
    });

    return items;
  }, [form, tone, size, seats, missing, contactActuallyShown]);

  const suggestions = useMemo(() => generateShareSuggestions(tone, form, seats), [tone, form, seats]);

  const summary = useMemo(() => {
    const err = checks.filter((c) => c.status === 'err').length;
    const warn = checks.filter((c) => c.status === 'warn').length;
    if (err > 0)
      return { status: 'err' as const, text: `有 ${err} 项必填没填，最好先补一下` };
    if (warn > 0)
      return {
        status: 'warn' as const,
        text: `有 ${warn} 项建议完善，可以直接发但可能漏掉信息`,
      };
    return { status: 'ok' as const, text: '信息都很完整，可以放心发了！🚀' };
  }, [checks]);

  const statusColor: Record<CheckType, string> = {
    ok: 'text-emerald-600 bg-emerald-50',
    warn: 'text-amber-600 bg-amber-50',
    err: 'text-red-600 bg-red-50',
  };
  const statusIcon: Record<CheckType, JSX.Element> = {
    ok: <CheckCircle2 className="h-4 w-4" />,
    warn: <AlertTriangle className="h-4 w-4" />,
    err: <AlertTriangle className="h-4 w-4" />,
  };

  const showPoster = initialTarget === 'both' || initialTarget === 'poster';
  const showCopy = initialTarget === 'both' || initialTarget === 'copy';
  const showBoth = initialTarget === 'both';

  const handleConfirm = (target: ShareTarget) => {
    const shareType: ShareType = target === 'both' ? 'both' : target;
    addDeparture(shareType, channel);
    onConfirm(target, channel);
  };

  const targetLabel =
    initialTarget === 'both' ? '海报+文案' : initialTarget === 'poster' ? '海报' : '文案';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl animate-pop max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-md ${
              summary.status === 'ok'
                ? 'bg-emerald-500 text-white'
                : summary.status === 'warn'
                ? 'bg-amber-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <Send className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-zinc-800">
              准备发布 · {targetLabel}
            </h3>
            <p className="text-sm text-zinc-500">{summary.text}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-xs font-bold text-zinc-500">选择发布渠道</div>
          <div className="grid grid-cols-2 gap-2">
            {CHANNEL_CONFIGS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setChannel(c.key)}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition-all ${
                  channel === c.key
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                }`}
              >
                <span className="text-lg">{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold">{c.label}</div>
                  <div className="text-[10px] text-zinc-500">{c.hint}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-zinc-50 px-3 py-2">
            <div className="min-w-0 flex-1 text-[11px] text-zinc-600">
              {channelCfg.suggestSize !== size && (
                <>
                  建议尺寸：
                  <span className="font-bold text-indigo-600">{channelCfg.suggestSize}</span>
                  ，当前是 <span className="text-zinc-500">{size}</span>
                </>
              )}
              {channelCfg.suggestSize === size && (
                <span className="text-emerald-600">
                  ✅ 当前尺寸适合 {channelCfg.label}
                </span>
              )}
            </div>
            {channelCfg.suggestSize !== size && (
              <button
                type="button"
                onClick={() => setSize(channelCfg.suggestSize)}
                className="shrink-0 rounded-lg bg-indigo-500 px-2.5 py-1 text-[10px] font-bold text-white transition-colors hover:bg-indigo-600"
              >
                一键切换
              </button>
            )}
          </div>
          <div className="mt-1 text-[10px] text-zinc-400">
            文案长度：
            {channelCfg.copyLength === 'short'
              ? '精简版'
              : channelCfg.copyLength === 'medium'
              ? '标准版'
              : '完整版'}
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="mb-4 space-y-2 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-3 border border-indigo-100">
            <div className="flex items-center gap-1.5 text-sm font-black text-indigo-700">
              <Sparkles className="h-4 w-4" />
              口吻化缺口建议
            </div>
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-xl px-2.5 py-2 ${
                  s.severity === 'err' ? 'bg-red-50' : 'bg-white/70'
                }`}
              >
                {s.severity === 'err' ? (
                  <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-700">{s.title}</div>
                  <div className="mt-0.5 text-[11px] leading-relaxed text-zinc-600">
                    {s.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-5 max-h-[25vh] space-y-1.5 overflow-y-auto pr-1">
          {checks.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${statusColor[c.status]}`}
              >
                {statusIcon[c.status]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-500">{c.label}</span>
                  <ChevronRight className="h-3 w-3 text-zinc-300" />
                  <span className="truncate text-sm font-semibold text-zinc-800">
                    {c.value}
                  </span>
                </div>
                {c.tip && (
                  <div className="mt-0.5 text-[11px] text-zinc-500">💡 {c.tip}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-600 transition-all hover:bg-zinc-50 active:scale-[0.98]"
          >
            再改改
          </button>
          {showCopy && !showBoth && (
            <button
              onClick={() => handleConfirm('copy')}
              disabled={exporting}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-black text-white shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
            >
              <Copy className="h-4 w-4" /> 复制文案并发布
            </button>
          )}
          {showPoster && !showBoth && (
            <button
              onClick={() => handleConfirm('poster')}
              disabled={exporting}
              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 px-4 py-2.5 text-sm font-black text-white shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {exporting ? '生成中...' : '下载海报并发布'}
            </button>
          )}
          {showBoth && (
            <button
              onClick={() => handleConfirm('both')}
              disabled={exporting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 px-4 py-2.5 text-sm font-black text-white shadow-md transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
            >
              <Image className="h-4 w-4" />
              <FileText className="h-4 w-4" />
              {exporting ? '生成中...' : '确认发布（海报+文案）'}
            </button>
          )}
        </div>

        <p className="mt-3 text-center text-[10px] text-zinc-400">
          确认后会自动记录到「发车历史」，发布到：{channelCfg.label}
        </p>
      </div>
    </div>
  );
};
