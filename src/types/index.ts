export type Tone = '沙雕招募' | '认真找队友' | '新手友好' | '缺气氛担当';

export type SeatRole = '控场位' | '搞笑位' | '脑洞位' | '随缘位';

export type PosterSize = '朋友圈长图' | '微信群短图' | '店内屏幕图';

export interface Seat {
  id: number;
  status: 'filled' | 'empty';
  role?: SeatRole;
  customTag?: string;
  memberTag?: string;
}

export interface ContactInfo {
  enabled: boolean;
  wechat: string;
  password: string;
  needConfirm: boolean;
}

export interface FormData {
  scriptName: string;
  totalPlayers: number;
  filledPlayers: number;
  dateTime: string;
  location: string;
  fee: string;
  allowCross: boolean;
  allowNewbie: boolean;
  memberFeatures: string[];
  contact: ContactInfo;
}

export interface SizeConfig {
  key: PosterSize;
  width: number;
  height: number;
  previewScale: number;
  label: string;
  emoji: string;
}

export interface ToneTheme {
  name: Tone;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  bgPattern: string;
  text: string;
  textOnPrimary: string;
  ctaCopy: string[];
  tagEmoji: string;
  borderRadius: string;
  decorElements: string[];
  seatGradient: string;
  badgeBg: string;
  borderColor: string;
}

export interface Draft {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  tone: Tone;
  form: FormData;
  seats: Seat[];
  size: PosterSize;
}

export type ShareType = 'poster' | 'copy' | 'both';

export type PublishChannel = '朋友圈' | '微信群' | '店铺群' | '私聊';

export interface DepartureRecord {
  id: string;
  sharedAt: number;
  tone: Tone;
  form: FormData;
  seats: Seat[];
  size: PosterSize;
  shareType: ShareType;
  contactShown: boolean;
  channel: PublishChannel;
}

export interface ShareSuggestion {
  severity: 'err' | 'warn';
  title: string;
  detail: string;
}

export interface ChannelConfig {
  key: PublishChannel;
  label: string;
  emoji: string;
  suggestSize: PosterSize;
  copyLength: 'short' | 'medium' | 'long';
  hint: string;
}

export interface DepartureStats {
  total: number;
  last7Days: number;
  missingMoreThan2: number;
  withContact: number;
  byChannel: Record<PublishChannel, number>;
  byScript: { name: string; count: number }[];
}

export const SEAT_ROLES: { role: SeatRole; emoji: string; desc: string; color: string }[] = [
  { role: '控场位', emoji: '🎙️', desc: '能带节奏', color: '#FF6B35' },
  { role: '搞笑位', emoji: '🤡', desc: '气氛担当', color: '#F72585' },
  { role: '脑洞位', emoji: '🧠', desc: '脑洞大', color: '#7209B7' },
  { role: '随缘位', emoji: '🎲', desc: '都可以', color: '#4CC9F0' },
];

export const getSeatDisplay = (seat: Seat): { label: string; emoji: string; color: string } => {
  if (seat.status === 'filled') {
    return { label: seat.memberTag || '已到', emoji: '✅', color: '#10B981' };
  }
  if (seat.customTag && seat.customTag.trim()) {
    return { label: seat.customTag.trim(), emoji: '✨', color: '#0EA5E9' };
  }
  const roleCfg = SEAT_ROLES.find((r) => r.role === seat.role) || SEAT_ROLES[3];
  return { label: roleCfg.role, emoji: roleCfg.emoji, color: roleCfg.color };
};

export const isContactActuallyShown = (contact: ContactInfo): boolean => {
  if (!contact.enabled) return false;
  return !!(contact.wechat?.trim() || contact.password?.trim() || contact.needConfirm);
};

