export const OUTPUT_MIME_TYPE = {
  jpeg: 'image/jpeg',
  png: 'image/png',
} as const;

export type OutputMimeType = (typeof OUTPUT_MIME_TYPE)[keyof typeof OUTPUT_MIME_TYPE];

export const OUTPUT_FILE_EXTENSION: Record<OutputMimeType, string> = {
  [OUTPUT_MIME_TYPE.jpeg]: 'jpg',
  [OUTPUT_MIME_TYPE.png]: 'png',
};

export const ALPHA_CAPABLE_INPUT_MIME_TYPES: ReadonlySet<string> = new Set([
  'image/png',
  'image/webp',
  'image/gif',
]);

export const OUTPUT_JPEG_QUALITY = 0.92;
export const OUTPUT_FILE_SUFFIX = '_wm';
export const FALLBACK_FILE_BASE_NAME = 'image';
export const OUTPUT_ZIP_FILE_NAME = 'watermarked-images.zip';

export const MAX_CANVAS_PIXELS = 16_777_216;

export const IMAGE_ACCEPT = 'image/*';
export const IMAGE_MIME_PREFIX = 'image/';

export const IMAGE_FILE_EXTENSIONS: ReadonlySet<string> = new Set([
  'jpg',
  'jpeg',
  'png',
  'webp',
  'gif',
  'heic',
  'heif',
  'avif',
  'bmp',
]);
