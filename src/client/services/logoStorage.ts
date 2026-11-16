import { createStore, del, set, values, type UseStore } from 'idb-keyval';
import { requestPersistentStorage } from '@/client/services/storagePersistence';
import { createId } from '@/client/utils/createId';
import { LOGO_DATABASE } from '@/shared/constants/storage';
import { sortNewestFirst, toStoredLogo } from '@/shared/lib/logoRecord';
import type { LogoRecord, StoredLogo } from '@/shared/types/watermark';

let logoStore: UseStore | null = null;

function getLogoStore(): UseStore {
  logoStore ??= createStore(LOGO_DATABASE.name, LOGO_DATABASE.storeName);
  return logoStore;
}

export async function listLogos(): Promise<StoredLogo[]> {
  const records = await values<unknown>(getLogoStore());
  const logos = records.map(toStoredLogo).filter((logo): logo is StoredLogo => logo !== null);
  return sortNewestFirst(logos);
}

export async function saveLogo(file: File): Promise<StoredLogo> {
  const record: LogoRecord = {
    id: createId(),
    name: file.name,
    mimeType: file.type,
    data: await file.arrayBuffer(),
    createdAt: Date.now(),
  };
  await set(record.id, record, getLogoStore());
  void requestPersistentStorage();

  return {
    id: record.id,
    name: record.name,
    blob: new Blob([record.data], { type: record.mimeType }),
    createdAt: record.createdAt,
  };
}

export function deleteLogo(id: string): Promise<void> {
  return del(id, getLogoStore());
}
