export const BACKGROUND_REMOVAL = {
  hardTolerance: 36,
  softTolerance: 96,
  transparentAlphaThreshold: 16,
  minTransparentCornersToSkip: 3,
} as const;

export interface BackgroundRemovalOptions {
  hardTolerance: number;
  softTolerance: number;
}

export const LOGO_PROCESSING_MAX_PIXELS = 4_194_304;
