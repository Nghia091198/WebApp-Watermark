import { STORAGE_KEY } from '@/shared/constants/storage';
import { normalizeLayout } from '@/shared/lib/watermarkLayout';
import type { WatermarkLayout } from '@/shared/types/watermark';

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function readLayout(): WatermarkLayout {
  return normalizeLayout(readJson(STORAGE_KEY.layout));
}

export function writeLayout(layout: WatermarkLayout): void {
  writeJson(STORAGE_KEY.layout, layout);
}

export function readSelectedLogoId(): string | null {
  const value = readJson(STORAGE_KEY.selectedLogoId);
  return typeof value === 'string' ? value : null;
}

export function writeSelectedLogoId(id: string | null): void {
  writeJson(STORAGE_KEY.selectedLogoId, id);
}
