import type { Tone, FormData, Seat, SeatRole } from '../types';
import { getTemplates } from '../config/copyTemplates';
import { TONE_THEMES } from '../config/toneThemes';
import { pickRandom, getMissingCount } from '../utils/seatGenerator';

const roleLabel: Record<SeatRole, string> = {
  控场位: '🎙️控场',
  搞笑位: '🤡搞笑',
  脑洞位: '🧠脑洞',
  随缘位: '🎲随缘',
};

const buildSeatGapList = (seats: Seat[]): string => {
  const empties = seats.filter((s) => s.status === 'empty');
  if (empties.length === 0) return '满员！🚀';
  const counts: Record<string, number> = {};
  empties.forEach((s) => {
    const key = roleLabel[s.role || '随缘位'];
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([k, v]) => (v > 1 ? `${k}×${v}` : k))
    .join('、');
};

export const generateCopyText = (tone: Tone, form: FormData, seats: Seat[]): string => {
  const tpl = pickRandom(getTemplates(tone));
  const theme = TONE_THEMES[tone];
  const missing = getMissingCount(form.totalPlayers, form.filledPlayers);

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
  };

  let result = tpl;
  Object.entries(replacements).forEach(([k, v]) => {
    result = result.split(k).join(v);
  });
  return result;
};
