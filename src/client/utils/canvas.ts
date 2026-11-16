import { OUTPUT_JPEG_QUALITY, type OutputMimeType } from '@/shared/constants/image';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import type { Size } from '@/shared/types/watermark';

export function createCanvas(size: Size): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, mimeType: OutputMimeType): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error(ERROR_MESSAGE.imageExportFailed))),
      mimeType,
      OUTPUT_JPEG_QUALITY,
    );
  });
}

export function releaseCanvasMemory(canvas: HTMLCanvasElement): void {
  canvas.width = 0;
  canvas.height = 0;
}
