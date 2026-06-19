import type { Tone, FormData, Seat, SeatRole } from '../types';
import { getTemplates } from '../config/copyTemplates';
import { TONE_THEMES } from '../config/toneThemes';
import { pickRandom, getMissingCount } from '../utils/seatGenerator';
import { getSeatDisplay } from '../types';

const buildSeatGapList = (seats: Seat[]): string => {
  const empties = seats.filter((s) => s.status === 'empty');
  if (empties.length === 0) return '满员！🚀';
  const counts: Record<string, number> = {};
  empties.forEach((s) => {
    const key = getSeatDisplay(s).label;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([k, v]) => (v > 1 ? `${k}×${v}` : k))
    .join('、');
};

export const generateCopyText = (
  tone: Tone,
  form: FormData,
  seats: Seat[],
  length: 'short' | 'medium' | 'long' = 'medium'
): string => {
  const missing = getMissingCount(form.totalPlayers, form.filledPlayers);

  const contactLines: string[] = [];
  if (form.contact.enabled) {
    if (form.contact.wechat.trim()) {
      contactLines.push(`💚 微信：${form.contact.wechat.trim()}`);
    }
    if (form.contact.password.trim()) {
      contactLines.push(`🔑 备注：${form.contact.password.trim()}`);
    }
    if (form.contact.needConfirm) {
      contactLines.push('🤝 需私聊确认');
    }
  }
  const contactBlock =
    contactLines.length > 0 ? `\n\n📞 联系方式：\n${contactLines.join('\n')}` : '';

  if (length === 'short') {
    const parts = [
      `🚗 《${form.scriptName || '神秘好本'}》`,
      `🕒 ${form.dateTime || '待定'}`,
      `📍 ${form.location || '待定'}`,
      `👥 ${form.filledPlayers}/${form.totalPlayers}，还差 ${missing} 人`,
      form.fee?.trim() ? `💰 ${form.fee.trim()}` : '',
      form.allowCross ? '✅可反串' : '❌不反串',
      form.allowNewbie ? '✅新手ok' : '❌仅老手',
    ]
      .filter(Boolean)
      .join(' · ');
    return parts + contactBlock;
  }

  const tpl = pickRandom(getTemplates(tone));
  const theme = TONE_THEMES[tone];
  const cta = pickRandom(theme.ctaCopy);
  const memberTags =
    form.memberFeatures.length > 0
      ? Array.from(new Set(form.memberFeatures)).join('、')
      : '一群有趣的灵魂';

  const replacements: Record<string, string> = {
    '{{剧本名}}': form.scriptName || '神秘好本',
    '{{已到}}': String(form.filledPlayers),
    '{{总人数}}': String(form.totalPlayers),
    '{{缺人数}}': String(missing),
    '{{时间}}': form.dateTime || '待定',
    '{{地点}}': form.location || '待定',
    '{{费用}}': form.fee || '私聊',
    '{{车位缺口}}': buildSeatGapList(seats),
    '{{成员特点}}': memberTags,
    '{{反串说明}}': form.allowCross ? '✅可反串\n' : '❌不接受反串\n',
    '{{新手说明}}': form.allowNewbie ? '✅接受新手' : '❌仅老手',
    '{{CTA}}': cta,
    '{{联系方式}}': contactBlock,
  };

  let result = tpl;
  Object.entries(replacements).forEach(([k, v]) => {
    result = result.split(k).join(v);
  });
  if (!result.includes('联系方式') && contactBlock) {
    result = result.trimEnd() + contactBlock;
  }

  if (length === 'long') {
    const decorEmojis = theme.decorElements;
    const headDecor = `${pickRandom(decorEmojis)} ${pickRandom(decorEmojis)} ${pickRandom(decorEmojis)}`;
    result = `${headDecor}\n\n${result}\n\n${headDecor}`;
  }

  return result;
};

export type { SeatRole };
