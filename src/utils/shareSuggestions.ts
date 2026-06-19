import type { Tone, FormData, Seat, ShareSuggestion } from '../types';
import { getMissingCount } from './seatGenerator';
import { getSeatDisplay } from '../types';

const TONE_SUGGEST_TEMPLATES: Record<
  Tone,
  { missing: (n: number) => string; contact: () => string; repeatTag: (t: string) => string; time: () => string; location: () => string; fee: () => string }
> = {
  '沙雕招募': {
    missing: (n) => `还差 ${n} 个人！！是兄弟就来砍我啊（不是）快来发车 🚗💨`,
    contact: () => `联系方式没开哦，别人看到海报只会一脸懵——"我咋加群啊？"🤪`,
    repeatTag: (t) => `空位一堆"${t}"？怕不是要开个${t}主题 party 哦，换几个标签吸引不同类型玩家嘛～`,
    time: () => `开局时间忘了写！难道要大家盲猜"随缘见"？🤣`,
    location: () => `地点呢？让大家在你家门口集合吗？🏠`,
    fee: () => `费用没写？到时候AA还是请客啊？先说好避免尴尬嘛😂`,
  },
  '认真找队友': {
    missing: (n) => `目前还差 ${n} 位靠谱玩家，建议确认人数后再发出，吸引同样认真的队友。`,
    contact: () => `联系方式未启用，建议补充微信号方便潜在队友快速联系。`,
    repeatTag: (t) => `空位"${t}"占比过高，建议丰富空位类型，便于匹配不同风格的玩家。`,
    time: () => `开局时间未填写，这是组局的核心信息，请补充。`,
    location: () => `地点信息缺失，建议填写详细地址方便大家到场。`,
    fee: () => `费用信息建议补充，避免沟通反复。`,
  },
  '新手友好': {
    missing: (n) => `还差 ${n} 个空位～萌新小天使们快来一起玩呀 🌱 我们会带着你的！`,
    contact: () => `联系方式没开启哦～萌新想加也找不到你呀，快填上吧 💕`,
    repeatTag: (t) => `好多空位都是"${t}"～混合一下标签更容易吸引不同小伙伴哦 🌈`,
    time: () => `时间没写呀，萌新不知道什么时候来捏 🌸`,
    location: () => `地点补上嘛～别让萌新迷路啦 🧭`,
    fee: () => `说一下费用嘛～萌新不想糊里糊涂的 🍑`,
  },
  '缺气氛担当': {
    missing: (n) => `还缺 ${n} 个人！！没有你们气氛组这车怎么炸？！🔥 速来速来！`,
    contact: () => `联系方式不展示？气氛担当怎么找到组织？🕺 速度开启！`,
    repeatTag: (t) => `全是"${t}"？这局的 vibe 有点单一啊，换几个标签让气氛嗨起来 🎆`,
    time: () => `开局时间都没？怎么约兄弟们出来搞事情 🕺`,
    location: () => `地点不发？让大家在大街上随机蹦迪吗 💃`,
    fee: () => `费用不说清楚？等下嗨完没人买单就尴尬了啊喂 🎊`,
  },
};

export function generateShareSuggestions(
  tone: Tone,
  form: FormData,
  seats: Seat[]
): ShareSuggestion[] {
  const out: ShareSuggestion[] = [];
  const tpl = TONE_SUGGEST_TEMPLATES[tone];
  const missing = getMissingCount(form.totalPlayers, form.filledPlayers);

  if (!form.dateTime?.trim()) {
    out.push({ severity: 'err', title: '缺少开局时间', detail: tpl.time() });
  }
  if (!form.location?.trim()) {
    out.push({ severity: 'err', title: '缺少地点', detail: tpl.location() });
  }

  if (missing > 0) {
    out.push({
      severity: missing >= Math.ceil(form.totalPlayers / 2) ? 'warn' : 'warn',
      title: `还差 ${missing} 人发车`,
      detail: tpl.missing(missing),
    });
  }

  if (!form.fee?.trim()) {
    out.push({ severity: 'warn', title: '建议补充费用', detail: tpl.fee() });
  }

  if (!form.contact.enabled) {
    out.push({ severity: 'warn', title: '联系方式未开启', detail: tpl.contact() });
  } else if (!form.contact.wechat?.trim()) {
    out.push({ severity: 'warn', title: '微信号未填', detail: '联系方式已开启但微信号为空，别人加不上你哦～' });
  }

  const empties = seats.filter((s) => s.status === 'empty');
  if (empties.length > 1) {
    const labelCounts = new Map<string, number>();
    empties.forEach((s) => {
      const lbl = getSeatDisplay(s).label;
      labelCounts.set(lbl, (labelCounts.get(lbl) || 0) + 1);
    });
    let topLabel = '';
    let topCount = 0;
    labelCounts.forEach((c, l) => {
      if (c > topCount) {
        topCount = c;
        topLabel = l;
      }
    });
    if (topCount >= Math.ceil(empties.length * 0.6) && empties.length >= 3) {
      out.push({
        severity: 'warn',
        title: `空位标签重复：${topLabel}`,
        detail: tpl.repeatTag(topLabel),
      });
    }
  }

  const untagged = empties.filter((s) => !s.role && !s.customTag);
  if (untagged.length > 0) {
    out.push({
      severity: 'warn',
      title: `有 ${untagged.length} 个空位未标记`,
      detail: '给空位标上类型，更容易吸引对口玩家加入～',
    });
  }

  return out;
}
