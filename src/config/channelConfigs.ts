import type { ChannelConfig, PublishChannel } from '../types';

export const CHANNEL_CONFIGS: ChannelConfig[] = [
  {
    key: '朋友圈',
    label: '朋友圈',
    emoji: '📱',
    suggestSize: '朋友圈长图',
    copyLength: 'long',
    hint: '朋友圈文案可以写长一点，海报建议用竖版长图',
  },
  {
    key: '微信群',
    label: '微信群',
    emoji: '💬',
    suggestSize: '微信群短图',
    copyLength: 'medium',
    hint: '群聊文案适中，用方图在群里显示最好',
  },
  {
    key: '店铺群',
    label: '店铺群',
    emoji: '🏪',
    suggestSize: '微信群短图',
    copyLength: 'short',
    hint: '熟人群里简短点，信息清晰最重要',
  },
  {
    key: '私聊',
    label: '私聊',
    emoji: '💌',
    suggestSize: '微信群短图',
    copyLength: 'short',
    hint: '发给个人的可以短一点，更亲切',
  },
];

export const getChannelConfig = (key: PublishChannel): ChannelConfig =>
  CHANNEL_CONFIGS.find((c) => c.key === key) || CHANNEL_CONFIGS[0];
