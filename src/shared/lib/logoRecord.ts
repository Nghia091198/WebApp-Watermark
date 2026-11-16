import { isRecord } from '@/shared/lib/isRecord';
import type { StoredLogo } from '@/shared/types/watermark';

function readLogoBlob(record: Record<string, unknown>): Blob | null {
  if (record.data instanceof ArrayBuffer) {
    const mimeType = typeof record.mimeType === 'string' ? record.mimeType : '';
    return new Blob([record.data], { type: mimeType });
  }
  if (record.blob instanceof Blob) {
    return record.blob;
  }
  return null;
}

export function toStoredLogo(value: unknown): StoredLogo | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.createdAt !== 'number') {
    return null;
  }

  const blob = readLogoBlob(value);
  if (!blob || blob.size === 0) return null;

  return { id: value.id, name: value.name, blob, createdAt: value.createdAt };
}

export function sortNewestFirst(logos: readonly StoredLogo[]): StoredLogo[] {
  return [...logos].sort((first, second) => second.createdAt - first.createdAt);
}

export function mergeLogosById(primary: readonly StoredLogo[], secondary: readonly StoredLogo[]): StoredLogo[] {
  const primaryIds = new Set(primary.map((logo) => logo.id));
  return sortNewestFirst([...primary, ...secondary.filter((logo) => !primaryIds.has(logo.id))]);
}
