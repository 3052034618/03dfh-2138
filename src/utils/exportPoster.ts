import html2canvas from 'html2canvas';
import type { PosterSize } from '../types';
import { getSizeConfig } from '../config/sizePresets';

export const exportPoster = async (
  element: HTMLElement,
  sizeKey: PosterSize,
  scriptName: string
): Promise<void> => {
  const size = getSizeConfig(sizeKey);
  const originalParent = element.parentElement;
  const originalNextSibling = element.nextSibling;
  const originalStyle = element.getAttribute('style') || '';

  const scaleX = size.width / element.offsetWidth;
  const scaleY = size.height / element.offsetHeight;
  const uniformScale = Math.min(scaleX, scaleY);

  element.style.transformOrigin = 'top left';
  element.style.transform = `scale(${uniformScale})`;
  element.style.width = `${size.width / uniformScale}px`;
  element.style.height = `${size.height / uniformScale}px`;

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-99999px';
  wrapper.style.top = '0';
  wrapper.style.width = `${size.width}px`;
  wrapper.style.height = `${size.height}px`;
  wrapper.style.overflow = 'hidden';
  document.body.appendChild(wrapper);
  wrapper.appendChild(element);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      width: size.width / uniformScale,
      height: size.height / uniformScale,
    });

    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = size.width;
    targetCanvas.height = size.height;
    const ctx = targetCanvas.getContext('2d')!;
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, size.width, size.height);

    const dataUrl = targetCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeName = scriptName.replace(/[\\/:*?"<>|]/g, '_') || '组局海报';
    link.download = `组局_${safeName}_${size.label}_${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    element.setAttribute('style', originalStyle);
    if (originalParent) {
      if (originalNextSibling) {
        originalParent.insertBefore(element, originalNextSibling);
      } else {
        originalParent.appendChild(element);
      }
    }
    document.body.removeChild(wrapper);
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  }
};
