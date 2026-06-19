import type { SizeConfig, PosterSize } from '../types';

export const SIZE_PRESETS: SizeConfig[] = [
  {
    key: '朋友圈长图',
    width: 1080,
    height: 1920,
    previewScale: 0.28,
    label: '朋友圈',
    emoji: '📱',
  },
  {
    key: '微信群短图',
    width: 1080,
    height: 1080,
    previewScale: 0.42,
    label: '微信群',
    emoji: '💬',
  },
  {
    key: '店内屏幕图',
    width: 1920,
    height: 1080,
    previewScale: 0.32,
    label: '店内屏',
    emoji: '🖥️',
  },
];

export const getSizeConfig = (key: PosterSize): SizeConfig =>
  SIZE_PRESETS.find((s) => s.key === key) || SIZE_PRESETS[0];
