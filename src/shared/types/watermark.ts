import type { WatermarkPosition } from '@/shared/constants/watermark';

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Size {
  x: number;
  y: number;
}

export interface WatermarkLayout {
  position: WatermarkPosition;
  scalePercent: number;
  opacityPercent: number;
  marginPercent: number;
}

export interface SourceImage {
  id: string;
  file: File;
}

export interface WatermarkResult {
  id: string;
  fileName: string;
  blob: Blob;
}

export interface StoredLogo {
  id: string;
  name: string;
  blob: Blob;
  createdAt: number;
}
