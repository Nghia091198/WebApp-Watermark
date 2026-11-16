export const WATERMARK_POSITION = {
  topLeft: 'top-left',
  topCenter: 'top-center',
  topRight: 'top-right',
  middleLeft: 'middle-left',
  center: 'center',
  middleRight: 'middle-right',
  bottomLeft: 'bottom-left',
  bottomCenter: 'bottom-center',
  bottomRight: 'bottom-right',
} as const;

export type WatermarkPosition = (typeof WATERMARK_POSITION)[keyof typeof WATERMARK_POSITION];

export const WATERMARK_POSITION_GRID: readonly WatermarkPosition[] = [
  WATERMARK_POSITION.topLeft,
  WATERMARK_POSITION.topCenter,
  WATERMARK_POSITION.topRight,
  WATERMARK_POSITION.middleLeft,
  WATERMARK_POSITION.center,
  WATERMARK_POSITION.middleRight,
  WATERMARK_POSITION.bottomLeft,
  WATERMARK_POSITION.bottomCenter,
  WATERMARK_POSITION.bottomRight,
];

export const WATERMARK_POSITION_LABEL: Record<WatermarkPosition, string> = {
  [WATERMARK_POSITION.topLeft]: 'Góc trên trái',
  [WATERMARK_POSITION.topCenter]: 'Giữa cạnh trên',
  [WATERMARK_POSITION.topRight]: 'Góc trên phải',
  [WATERMARK_POSITION.middleLeft]: 'Giữa cạnh trái',
  [WATERMARK_POSITION.center]: 'Chính giữa',
  [WATERMARK_POSITION.middleRight]: 'Giữa cạnh phải',
  [WATERMARK_POSITION.bottomLeft]: 'Góc dưới trái',
  [WATERMARK_POSITION.bottomCenter]: 'Giữa cạnh dưới',
  [WATERMARK_POSITION.bottomRight]: 'Góc dưới phải',
};

export const DEFAULT_WATERMARK_POSITION: WatermarkPosition = WATERMARK_POSITION.bottomRight;

export const WATERMARK_LIMITS = {
  scalePercent: { min: 5, max: 60, step: 1, defaultValue: 20 },
  opacityPercent: { min: 10, max: 100, step: 5, defaultValue: 90 },
  marginPercent: { min: 0, max: 15, step: 1, defaultValue: 3 },
} as const;

export interface NumericRange {
  readonly min: number;
  readonly max: number;
  readonly defaultValue: number;
}
