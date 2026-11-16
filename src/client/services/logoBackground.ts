import { canvasToBlob, createCanvas, releaseCanvasMemory } from '@/client/utils/canvas';
import { withDecodedImage } from '@/client/utils/decodedImage';
import { LOGO_PROCESSING_MAX_PIXELS } from '@/shared/constants/backgroundRemoval';
import { OUTPUT_MIME_TYPE } from '@/shared/constants/image';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import { removeSolidBackground } from '@/shared/lib/backgroundRemoval';
import { fitWithinPixelLimit } from '@/shared/lib/imageFile';

export function removeLogoBackground(logoBlob: Blob): Promise<Blob> {
  return withDecodedImage(logoBlob, async (logo) => {
    const size = fitWithinPixelLimit(
      { width: logo.naturalWidth, height: logo.naturalHeight },
      LOGO_PROCESSING_MAX_PIXELS,
    );
    const canvas = createCanvas(size);

    try {
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        throw new Error(ERROR_MESSAGE.canvasUnavailable);
      }

      context.drawImage(logo, 0, 0, size.width, size.height);
      const imageData = context.getImageData(0, 0, size.width, size.height);
      imageData.data.set(removeSolidBackground(imageData.data, size.width, size.height));
      context.putImageData(imageData, 0, 0);

      return await canvasToBlob(canvas, OUTPUT_MIME_TYPE.png);
    } finally {
      releaseCanvasMemory(canvas);
    }
  });
}
