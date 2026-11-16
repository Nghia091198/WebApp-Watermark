import { describe, expect, it } from 'vitest';
import { detectBackgroundColor, removeSolidBackground } from '@/shared/lib/backgroundRemoval';

type Rgba = [number, number, number, number];

const WHITE: Rgba = [255, 255, 255, 255];
const BLACK: Rgba = [0, 0, 0, 255];
const GREEN: Rgba = [0, 200, 0, 255];
const RED: Rgba = [220, 30, 30, 255];
const TRANSPARENT: Rgba = [0, 0, 0, 0];

function toPixels(rows: Rgba[][]): Uint8ClampedArray {
  return new Uint8ClampedArray(rows.flat(2));
}

function alphaAt(pixels: Uint8ClampedArray, index: number): number {
  return pixels[index * 4 + 3];
}

describe('detectBackgroundColor', () => {
  it('averages the opaque corner colors', () => {
    const pixels = toPixels([
      [WHITE, BLACK, WHITE],
      [BLACK, BLACK, BLACK],
      [WHITE, BLACK, WHITE],
    ]);
    expect(detectBackgroundColor(pixels, 3, 3)).toEqual({ red: 255, green: 255, blue: 255 });
  });

  it('returns null when the logo is already transparent', () => {
    const pixels = toPixels([
      [TRANSPARENT, BLACK, TRANSPARENT],
      [BLACK, BLACK, BLACK],
      [TRANSPARENT, BLACK, WHITE],
    ]);
    expect(detectBackgroundColor(pixels, 3, 3)).toBeNull();
  });
});

describe('removeSolidBackground', () => {
  it('makes a white background transparent and keeps the logo', () => {
    const pixels = toPixels([
      [WHITE, WHITE, WHITE],
      [WHITE, BLACK, WHITE],
      [WHITE, WHITE, WHITE],
    ]);
    const result = removeSolidBackground(pixels, 3, 3);
    expect(alphaAt(result, 0)).toBe(0);
    expect(alphaAt(result, 3)).toBe(0);
    expect(alphaAt(result, 4)).toBe(255);
    expect(Array.from(result.slice(16, 20))).toEqual(BLACK);
  });

  it('removes enclosed background areas such as holes inside letters', () => {
    const pixels = toPixels([
      [WHITE, WHITE, WHITE, WHITE, WHITE],
      [WHITE, RED, RED, RED, WHITE],
      [WHITE, RED, WHITE, RED, WHITE],
      [WHITE, RED, RED, RED, WHITE],
      [WHITE, WHITE, WHITE, WHITE, WHITE],
    ]);
    const result = removeSolidBackground(pixels, 5, 5);
    expect(alphaAt(result, 12)).toBe(0);
    expect(alphaAt(result, 6)).toBe(255);
  });

  it('works with a colored background', () => {
    const pixels = toPixels([
      [GREEN, GREEN, GREEN],
      [GREEN, WHITE, GREEN],
      [GREEN, GREEN, GREEN],
    ]);
    const result = removeSolidBackground(pixels, 3, 3);
    expect(alphaAt(result, 0)).toBe(0);
    expect(alphaAt(result, 4)).toBe(255);
  });

  it('gives anti-aliased edge pixels partial transparency', () => {
    const edgeGray: Rgba = [200, 200, 200, 255];
    const pixels = toPixels([
      [WHITE, WHITE],
      [edgeGray, WHITE],
    ]);
    const result = removeSolidBackground(pixels, 2, 2, { hardTolerance: 36, softTolerance: 196 });
    const edgeAlpha = alphaAt(result, 2);
    expect(edgeAlpha).toBeGreaterThan(0);
    expect(edgeAlpha).toBeLessThan(255);
  });

  it('leaves already transparent logos unchanged', () => {
    const pixels = toPixels([
      [TRANSPARENT, TRANSPARENT],
      [TRANSPARENT, WHITE],
    ]);
    expect(removeSolidBackground(pixels, 2, 2)).toEqual(pixels);
  });

  it('does not mutate the input pixels', () => {
    const pixels = toPixels([
      [WHITE, WHITE],
      [WHITE, BLACK],
    ]);
    const snapshot = new Uint8ClampedArray(pixels);
    removeSolidBackground(pixels, 2, 2);
    expect(pixels).toEqual(snapshot);
  });
});
