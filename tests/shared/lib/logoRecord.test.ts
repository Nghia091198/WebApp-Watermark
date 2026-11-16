import { describe, expect, it } from 'vitest';
import { mergeLogosById, sortNewestFirst, toStoredLogo } from '@/shared/lib/logoRecord';
import type { StoredLogo } from '@/shared/types/watermark';

function bytes(...values: number[]): ArrayBuffer {
  return new Uint8Array(values).buffer;
}

function logo(id: string, createdAt: number): StoredLogo {
  return { id, name: `${id}.png`, blob: new Blob([bytes(1)]), createdAt };
}

describe('toStoredLogo', () => {
  it('rebuilds a blob from an ArrayBuffer record', async () => {
    const stored = toStoredLogo({ id: 'a', name: 'a.png', mimeType: 'image/png', data: bytes(1, 2, 3), createdAt: 10 });
    expect(stored).not.toBeNull();
    expect(stored?.blob.type).toBe('image/png');
    expect(Array.from(new Uint8Array(await stored!.blob.arrayBuffer()))).toEqual([1, 2, 3]);
  });

  it('reads legacy records that stored a Blob', () => {
    const legacyBlob = new Blob([bytes(9)], { type: 'image/jpeg' });
    const stored = toStoredLogo({ id: 'b', name: 'b.jpg', blob: legacyBlob, createdAt: 5 });
    expect(stored?.blob).toBe(legacyBlob);
  });

  it('rejects malformed or empty records', () => {
    expect(toStoredLogo(null)).toBeNull();
    expect(toStoredLogo({ id: 'c', name: 'c.png', createdAt: 1 })).toBeNull();
    expect(toStoredLogo({ id: 'd', name: 'd.png', data: bytes(), mimeType: 'image/png', createdAt: 1 })).toBeNull();
    expect(toStoredLogo({ id: 1, name: 'e.png', data: bytes(1), createdAt: 1 })).toBeNull();
  });
});

describe('sortNewestFirst', () => {
  it('orders logos by creation time descending without mutating input', () => {
    const input = [logo('old', 1), logo('new', 3), logo('mid', 2)];
    expect(sortNewestFirst(input).map((item) => item.id)).toEqual(['new', 'mid', 'old']);
    expect(input.map((item) => item.id)).toEqual(['old', 'new', 'mid']);
  });
});

describe('mergeLogosById', () => {
  it('keeps logos from both lists without duplicates', () => {
    const justAdded = [logo('fresh', 5)];
    const loaded = [logo('fresh', 5), logo('saved', 1)];
    expect(mergeLogosById(justAdded, loaded).map((item) => item.id)).toEqual(['fresh', 'saved']);
  });

  it('keeps a logo added while the stored list was still loading', () => {
    const current = [logo('added-during-load', 9)];
    const loadedSnapshot = [logo('older', 1)];
    expect(mergeLogosById(current, loadedSnapshot).map((item) => item.id)).toEqual(['added-during-load', 'older']);
  });
});
