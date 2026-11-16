import { describe, expect, it } from 'vitest';
import { OUTPUT_MIME_TYPE } from '@/shared/constants/image';
import {
  buildOutputFileName,
  ensureUniqueFileNames,
  fitWithinPixelLimit,
  isImageFile,
  isImageMimeType,
  resolveOutputMimeType,
} from '@/shared/lib/imageFile';

describe('isImageMimeType', () => {
  it('detects image mime types', () => {
    expect(isImageMimeType('image/jpeg')).toBe(true);
    expect(isImageMimeType('application/pdf')).toBe(false);
    expect(isImageMimeType('')).toBe(false);
  });
});

describe('isImageFile', () => {
  it('accepts files with an image mime type', () => {
    expect(isImageFile('photo.jpg', 'image/jpeg')).toBe(true);
  });

  it('falls back to the extension when the mime type is empty', () => {
    expect(isImageFile('IMG_0001.HEIC', '')).toBe(true);
    expect(isImageFile('scan.png', '')).toBe(true);
  });

  it('rejects non-image files', () => {
    expect(isImageFile('notes.txt', '')).toBe(false);
    expect(isImageFile('report.pdf', 'application/pdf')).toBe(false);
    expect(isImageFile('fake.jpg', 'application/pdf')).toBe(false);
    expect(isImageFile('noextension', '')).toBe(false);
  });
});

describe('resolveOutputMimeType', () => {
  it('keeps PNG for inputs that may have transparency', () => {
    expect(resolveOutputMimeType('image/png')).toBe(OUTPUT_MIME_TYPE.png);
    expect(resolveOutputMimeType('image/webp')).toBe(OUTPUT_MIME_TYPE.png);
  });

  it('uses JPEG for other inputs', () => {
    expect(resolveOutputMimeType('image/jpeg')).toBe(OUTPUT_MIME_TYPE.jpeg);
    expect(resolveOutputMimeType('image/heic')).toBe(OUTPUT_MIME_TYPE.jpeg);
  });
});

describe('buildOutputFileName', () => {
  it('adds suffix and matching extension', () => {
    expect(buildOutputFileName('photo.HEIC', OUTPUT_MIME_TYPE.jpeg)).toBe('photo_wm.jpg');
    expect(buildOutputFileName('my.shop.banner.png', OUTPUT_MIME_TYPE.png)).toBe('my.shop.banner_wm.png');
  });

  it('handles names without extension or empty names', () => {
    expect(buildOutputFileName('snapshot', OUTPUT_MIME_TYPE.jpeg)).toBe('snapshot_wm.jpg');
    expect(buildOutputFileName('', OUTPUT_MIME_TYPE.jpeg)).toBe('image_wm.jpg');
  });
});

describe('ensureUniqueFileNames', () => {
  it('appends counters to duplicated names', () => {
    expect(ensureUniqueFileNames(['image_wm.jpg', 'image_wm.jpg', 'other.jpg', 'image_wm.jpg'])).toEqual([
      'image_wm.jpg',
      'image_wm-2.jpg',
      'other.jpg',
      'image_wm-3.jpg',
    ]);
  });

  it('does not collide with an existing counter-like name', () => {
    expect(ensureUniqueFileNames(['a-2.jpg', 'a.jpg', 'a.jpg'])).toEqual(['a-2.jpg', 'a.jpg', 'a-3.jpg']);
  });
});

describe('fitWithinPixelLimit', () => {
  it('returns the same size when under the limit', () => {
    expect(fitWithinPixelLimit({ width: 100, height: 50 }, 10_000)).toEqual({ width: 100, height: 50 });
  });

  it('scales down proportionally when over the limit', () => {
    const fitted = fitWithinPixelLimit({ width: 400, height: 200 }, 20_000);
    expect(fitted).toEqual({ width: 200, height: 100 });
    expect(fitted.width * fitted.height).toBeLessThanOrEqual(20_000);
  });
});
