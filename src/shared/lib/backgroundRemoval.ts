import { BACKGROUND_REMOVAL, type BackgroundRemovalOptions } from '@/shared/constants/backgroundRemoval';

const RGBA_CHANNELS = 4;
const ALPHA_CHANNEL = 3;

interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

function pixelOffset(x: number, y: number, width: number): number {
  return (y * width + x) * RGBA_CHANNELS;
}

function cornerOffsets(width: number, height: number): number[] {
  return [
    pixelOffset(0, 0, width),
    pixelOffset(width - 1, 0, width),
    pixelOffset(0, height - 1, width),
    pixelOffset(width - 1, height - 1, width),
  ];
}

function averageColor(pixels: Uint8ClampedArray, offsets: readonly number[]): RgbColor {
  const sum = offsets.reduce(
    (total, offset) => ({
      red: total.red + pixels[offset],
      green: total.green + pixels[offset + 1],
      blue: total.blue + pixels[offset + 2],
    }),
    { red: 0, green: 0, blue: 0 },
  );
  return { red: sum.red / offsets.length, green: sum.green / offsets.length, blue: sum.blue / offsets.length };
}

export function detectBackgroundColor(pixels: Uint8ClampedArray, width: number, height: number): RgbColor | null {
  const corners = cornerOffsets(width, height);
  const opaqueCorners = corners.filter(
    (offset) => pixels[offset + ALPHA_CHANNEL] >= BACKGROUND_REMOVAL.transparentAlphaThreshold,
  );
  const transparentCornerCount = corners.length - opaqueCorners.length;
  if (transparentCornerCount >= BACKGROUND_REMOVAL.minTransparentCornersToSkip) {
    return null;
  }
  return averageColor(pixels, opaqueCorners);
}

function colorDistance(pixels: Uint8ClampedArray, offset: number, color: RgbColor): number {
  const redDelta = pixels[offset] - color.red;
  const greenDelta = pixels[offset + 1] - color.green;
  const blueDelta = pixels[offset + 2] - color.blue;
  return Math.sqrt(redDelta * redDelta + greenDelta * greenDelta + blueDelta * blueDelta);
}

function unblendChannel(observed: number, background: number, coverage: number): number {
  return (observed - background * (1 - coverage)) / coverage;
}

export function removeSolidBackground(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  options: BackgroundRemovalOptions = BACKGROUND_REMOVAL,
): Uint8ClampedArray {
  const result = new Uint8ClampedArray(pixels);
  const background = detectBackgroundColor(pixels, width, height);
  if (!background) {
    return result;
  }

  const softRange = options.softTolerance - options.hardTolerance;

  for (let offset = 0; offset < result.length; offset += RGBA_CHANNELS) {
    const distance = colorDistance(result, offset, background);
    if (distance >= options.softTolerance) continue;

    if (distance <= options.hardTolerance) {
      result[offset + ALPHA_CHANNEL] = 0;
      continue;
    }

    const coverage = (distance - options.hardTolerance) / softRange;
    result[offset] = unblendChannel(result[offset], background.red, coverage);
    result[offset + 1] = unblendChannel(result[offset + 1], background.green, coverage);
    result[offset + 2] = unblendChannel(result[offset + 2], background.blue, coverage);
    result[offset + ALPHA_CHANNEL] = result[offset + ALPHA_CHANNEL] * coverage;
  }

  return result;
}
