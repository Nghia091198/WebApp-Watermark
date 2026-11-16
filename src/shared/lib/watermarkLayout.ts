import {
  DEFAULT_WATERMARK_POSITION,
  WATERMARK_LIMITS,
  WATERMARK_POSITION,
  type NumericRange,
  type WatermarkPosition,
} from '@/shared/constants/watermark';
import { isRecord } from '@/shared/lib/isRecord';
import type { Rect, Size, WatermarkLayout } from '@/shared/types/watermark';

const AXIS_ALIGNMENT = {
  start: 'start',
  center: 'center',
  end: 'end',
} as const;

type AxisAlignment = (typeof AXIS_ALIGNMENT)[keyof typeof AXIS_ALIGNMENT];

interface PositionAlignment {
  horizontal: AxisAlignment;
  vertical: AxisAlignment;
}

const POSITION_ALIGNMENT: Record<WatermarkPosition, PositionAlignment> = {
  [WATERMARK_POSITION.topLeft]: { horizontal: AXIS_ALIGNMENT.start, vertical: AXIS_ALIGNMENT.start },
  [WATERMARK_POSITION.topCenter]: { horizontal: AXIS_ALIGNMENT.center, vertical: AXIS_ALIGNMENT.start },
  [WATERMARK_POSITION.topRight]: { horizontal: AXIS_ALIGNMENT.end, vertical: AXIS_ALIGNMENT.start },
  [WATERMARK_POSITION.middleLeft]: { horizontal: AXIS_ALIGNMENT.start, vertical: AXIS_ALIGNMENT.center },
  [WATERMARK_POSITION.center]: { horizontal: AXIS_ALIGNMENT.center, vertical: AXIS_ALIGNMENT.center },
  [WATERMARK_POSITION.middleRight]: { horizontal: AXIS_ALIGNMENT.end, vertical: AXIS_ALIGNMENT.center },
  [WATERMARK_POSITION.bottomLeft]: { horizontal: AXIS_ALIGNMENT.start, vertical: AXIS_ALIGNMENT.end },
  [WATERMARK_POSITION.bottomCenter]: { horizontal: AXIS_ALIGNMENT.center, vertical: AXIS_ALIGNMENT.end },
  [WATERMARK_POSITION.bottomRight]: { horizontal: AXIS_ALIGNMENT.end, vertical: AXIS_ALIGNMENT.end },
};

const WATERMARK_POSITIONS: ReadonlySet<string> = new Set(Object.values(WATERMARK_POSITION));

export const DEFAULT_WATERMARK_LAYOUT: WatermarkLayout = {
  position: DEFAULT_WATERMARK_POSITION,
  scalePercent: WATERMARK_LIMITS.scalePercent.defaultValue,
  opacityPercent: WATERMARK_LIMITS.opacityPercent.defaultValue,
  marginPercent: WATERMARK_LIMITS.marginPercent.defaultValue,
};

function alignOnAxis(alignment: AxisAlignment, containerLength: number, itemLength: number, margin: number): number {
  switch (alignment) {
    case AXIS_ALIGNMENT.start:
      return margin;
    case AXIS_ALIGNMENT.end:
      return containerLength - itemLength - margin;
    case AXIS_ALIGNMENT.center:
      return (containerLength - itemLength) / 2;
  }
}

function percentOf(length: number, percent: number): number {
  return (length * percent) / 100;
}

export function computeWatermarkRect(image: Size, logo: Size, layout: WatermarkLayout): Rect {
  const shortestSide = Math.min(image.width, image.height);
  const boxSide = percentOf(shortestSide, layout.scalePercent);
  const fitRatio = Math.min(boxSide / logo.width, boxSide / logo.height);
  const width = Math.round(logo.width * fitRatio);
  const height = Math.round(logo.height * fitRatio);
  const margin = Math.round(percentOf(shortestSide, layout.marginPercent));
  const alignment = POSITION_ALIGNMENT[layout.position];

  return {
    x: Math.round(alignOnAxis(alignment.horizontal, image.width, width, margin)),
    y: Math.round(alignOnAxis(alignment.vertical, image.height, height, margin)),
    width,
    height,
  };
}

export function isWatermarkPosition(value: unknown): value is WatermarkPosition {
  return typeof value === 'string' && WATERMARK_POSITIONS.has(value);
}

function clampToRange(value: unknown, range: NumericRange): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return range.defaultValue;
  }
  return Math.min(range.max, Math.max(range.min, value));
}

export function normalizeLayout(value: unknown): WatermarkLayout {
  const candidate = isRecord(value) ? value : {};

  return {
    position: isWatermarkPosition(candidate.position) ? candidate.position : DEFAULT_WATERMARK_LAYOUT.position,
    scalePercent: clampToRange(candidate.scalePercent, WATERMARK_LIMITS.scalePercent),
    opacityPercent: clampToRange(candidate.opacityPercent, WATERMARK_LIMITS.opacityPercent),
    marginPercent: clampToRange(candidate.marginPercent, WATERMARK_LIMITS.marginPercent),
  };
}
