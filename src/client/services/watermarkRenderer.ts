import { canvasToBlob, createCanvas, releaseCanvasMemory } from '@/client/utils/canvas';
import type { OutputMimeType } from '@/shared/constants/image';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import { fitWithinPixelLimit } from '@/shared/lib/imageFile';
import { computeWatermarkRect } from '@/shared/lib/watermarkLayout';
import type { WatermarkLayout } from '@/shared/types/watermark';

export async function renderWatermarkedImage(
  source: HTMLImageElement,
  logo: HTMLImageElement,
  layout: WatermarkLayout,
  mimeType: OutputMimeType,
): Promise<Blob> {
  const canvasSize = fitWithinPixelLimit({ width: source.naturalWidth, height: source.naturalHeight });
  const canvas = createCanvas(canvasSize);

  try {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error(ERROR_MESSAGE.canvasUnavailable);
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, canvasSize.width, canvasSize.height);

    const logoRect = computeWatermarkRect(
      canvasSize,
      { width: logo.naturalWidth, height: logo.naturalHeight },
      layout,
    );
    context.globalAlpha = layout.opacityPercent / 100;
    context.drawImage(logo, logoRect.x, logoRect.y, logoRect.width, logoRect.height);

    return await canvasToBlob(canvas, mimeType);
  } finally {
    releaseCanvasMemory(canvas);
  }
}
