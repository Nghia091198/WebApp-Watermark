import { renderWatermarkedImage } from '@/client/services/watermarkRenderer';
import { withDecodedImage } from '@/client/utils/decodedImage';
import { buildOutputFileName, ensureUniqueFileNames, resolveOutputMimeType } from '@/shared/lib/imageFile';
import type { SourceImage, WatermarkLayout, WatermarkResult } from '@/shared/types/watermark';

export interface WatermarkBatchOutcome {
  results: WatermarkResult[];
  failedFileNames: string[];
}

export function watermarkImages(
  images: readonly SourceImage[],
  logoBlob: Blob,
  layout: WatermarkLayout,
  onProgress: (completedCount: number) => void,
): Promise<WatermarkBatchOutcome> {
  return withDecodedImage(logoBlob, async (logo) => {
    const outputMimeTypes = images.map((image) => resolveOutputMimeType(image.file.type));
    const outputFileNames = ensureUniqueFileNames(
      images.map((image, index) => buildOutputFileName(image.file.name, outputMimeTypes[index])),
    );
    const results: WatermarkResult[] = [];
    const failedFileNames: string[] = [];

    for (const [index, image] of images.entries()) {
      try {
        const blob = await withDecodedImage(image.file, (source) =>
          renderWatermarkedImage(source, logo, layout, outputMimeTypes[index]),
        );
        results.push({ id: image.id, fileName: outputFileNames[index], blob });
      } catch {
        failedFileNames.push(image.file.name);
      }
      onProgress(index + 1);
    }

    return { results, failedFileNames };
  });
}
