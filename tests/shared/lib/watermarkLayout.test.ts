import { describe, expect, it } from 'vitest';
import { WATERMARK_LIMITS, WATERMARK_POSITION } from '@/shared/constants/watermark';
import {
  DEFAULT_WATERMARK_LAYOUT,
  computeWatermarkRect,
  isWatermarkPosition,
  normalizeLayout,
} from '@/shared/lib/watermarkLayout';
import type { WatermarkLayout } from '@/shared/types/watermark';

const image = { width: 1000, height: 800 };
const squareLogo = { width: 200, height: 200 };

function layoutAt(position: WatermarkLayout['position']): WatermarkLayout {
  return { position, scalePercent: 10, opacityPercent: 100, marginPercent: 5 };
}

describe('computeWatermarkRect', () => {
  it('sizes the logo relative to the shortest image side', () => {
    const rect = computeWatermarkRect(image, squareLogo, layoutAt(WATERMARK_POSITION.topLeft));
    expect(rect.width).toBe(80);
    expect(rect.height).toBe(80);
  });

  it('places the logo at the top-left corner with margin', () => {
    const rect = computeWatermarkRect(image, squareLogo, layoutAt(WATERMARK_POSITION.topLeft));
    expect(rect).toEqual({ x: 40, y: 40, width: 80, height: 80 });
  });

  it('places the logo at the bottom-right corner with margin', () => {
    const rect = computeWatermarkRect(image, squareLogo, layoutAt(WATERMARK_POSITION.bottomRight));
    expect(rect).toEqual({ x: 880, y: 680, width: 80, height: 80 });
  });

  it('centers the logo without applying margin', () => {
    const rect = computeWatermarkRect(image, squareLogo, layoutAt(WATERMARK_POSITION.center));
    expect(rect).toEqual({ x: 460, y: 360, width: 80, height: 80 });
  });

  it('centers horizontally at the bottom edge', () => {
    const rect = computeWatermarkRect(image, squareLogo, layoutAt(WATERMARK_POSITION.bottomCenter));
    expect(rect).toEqual({ x: 460, y: 680, width: 80, height: 80 });
  });

  it('keeps aspect ratio of a wide logo inside the scale box', () => {
    const rect = computeWatermarkRect(image, { width: 400, height: 100 }, layoutAt(WATERMARK_POSITION.topLeft));
    expect(rect.width).toBe(80);
    expect(rect.height).toBe(20);
  });

  it('keeps a tall logo within the scale box', () => {
    const rect = computeWatermarkRect(image, { width: 100, height: 400 }, layoutAt(WATERMARK_POSITION.topLeft));
    expect(rect.width).toBe(20);
    expect(rect.height).toBe(80);
  });
});

describe('isWatermarkPosition', () => {
  it('accepts known positions and rejects others', () => {
    expect(isWatermarkPosition(WATERMARK_POSITION.middleRight)).toBe(true);
    expect(isWatermarkPosition('somewhere')).toBe(false);
    expect(isWatermarkPosition(42)).toBe(false);
  });
});

describe('normalizeLayout', () => {
  it('returns defaults for invalid input', () => {
    expect(normalizeLayout(null)).toEqual(DEFAULT_WATERMARK_LAYOUT);
    expect(normalizeLayout('broken')).toEqual(DEFAULT_WATERMARK_LAYOUT);
  });

  it('keeps valid values', () => {
    const layout = { position: WATERMARK_POSITION.topRight, scalePercent: 30, opacityPercent: 50, marginPercent: 2 };
    expect(normalizeLayout(layout)).toEqual(layout);
  });

  it('clamps out-of-range numbers and replaces unknown positions', () => {
    const normalized = normalizeLayout({ position: 'nowhere', scalePercent: 999, opacityPercent: -5, marginPercent: 'x' });
    expect(normalized).toEqual({
      position: DEFAULT_WATERMARK_LAYOUT.position,
      scalePercent: WATERMARK_LIMITS.scalePercent.max,
      opacityPercent: WATERMARK_LIMITS.opacityPercent.min,
      marginPercent: WATERMARK_LIMITS.marginPercent.defaultValue,
    });
  });
});
