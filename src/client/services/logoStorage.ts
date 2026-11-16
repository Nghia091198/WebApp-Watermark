import { createStore, del, entries, set } from 'idb-keyval';
import { createId } from '@/client/utils/createId';
import { LOGO_DATABASE } from '@/shared/constants/storage';
import type { StoredLogo } from '@/shared/types/watermark';

const logoStore = createStore(LOGO_DATABASE.name, LOGO_DATABASE.storeName);

export async function listLogos(): Promise<StoredLogo[]> {
  const records = await entries<string, StoredLogo>(logoStore);
  return records.map(([, logo]) => logo).sort((first, second) => second.createdAt - first.createdAt);
}

export async function saveLogo(file: File): Promise<StoredLogo> {
  const logo: StoredLogo = {
    id: createId(),
    name: file.name,
    blob: file.slice(0, file.size, file.type),
    createdAt: Date.now(),
  };
  await set(logo.id, logo, logoStore);
  return logo;
}

export function deleteLogo(id: string): Promise<void> {
  return del(id, logoStore);
}
