import {
  ALPHA_CAPABLE_INPUT_MIME_TYPES,
  FALLBACK_FILE_BASE_NAME,
  IMAGE_FILE_EXTENSIONS,
  IMAGE_MIME_PREFIX,
  MAX_CANVAS_PIXELS,
  OUTPUT_FILE_EXTENSION,
  OUTPUT_FILE_SUFFIX,
  OUTPUT_MIME_TYPE,
  type OutputMimeType,
} from '@/shared/constants/image';
import type { Size } from '@/shared/types/watermark';

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.startsWith(IMAGE_MIME_PREFIX);
}

export function resolveOutputMimeType(inputMimeType: string): OutputMimeType {
  return ALPHA_CAPABLE_INPUT_MIME_TYPES.has(inputMimeType) ? OUTPUT_MIME_TYPE.png : OUTPUT_MIME_TYPE.jpeg;
}

function splitExtension(fileName: string): { baseName: string; extension: string } {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex <= 0) {
    return { baseName: fileName, extension: '' };
  }
  return { baseName: fileName.slice(0, dotIndex), extension: fileName.slice(dotIndex) };
}

export function isImageFile(fileName: string, mimeType: string): boolean {
  if (isImageMimeType(mimeType)) {
    return true;
  }
  const extension = splitExtension(fileName).extension.slice(1).toLowerCase();
  return mimeType === '' && IMAGE_FILE_EXTENSIONS.has(extension);
}

export function buildOutputFileName(originalName: string, mimeType: OutputMimeType): string {
  const { baseName } = splitExtension(originalName.trim());
  return `${baseName || FALLBACK_FILE_BASE_NAME}${OUTPUT_FILE_SUFFIX}.${OUTPUT_FILE_EXTENSION[mimeType]}`;
}

export function ensureUniqueFileNames(fileNames: readonly string[]): string[] {
  const usedNames = new Set<string>();

  return fileNames.map((fileName) => {
    const { baseName, extension } = splitExtension(fileName);
    let candidate = fileName;
    let counter = 2;
    while (usedNames.has(candidate)) {
      candidate = `${baseName}-${counter}${extension}`;
      counter += 1;
    }
    usedNames.add(candidate);
    return candidate;
  });
}

export function fitWithinPixelLimit(size: Size, maxPixels: number = MAX_CANVAS_PIXELS): Size {
  const pixelCount = size.width * size.height;
  if (pixelCount <= maxPixels) {
    return size;
  }
  const scale = Math.sqrt(maxPixels / pixelCount);
  return {
    width: Math.floor(size.width * scale),
    height: Math.floor(size.height * scale),
  };
}
