export async function requestPersistentStorage(): Promise<void> {
  const storage = navigator.storage as StorageManager | undefined;
  if (!storage || typeof storage.persist !== 'function' || typeof storage.persisted !== 'function') {
    return;
  }
  try {
    if (!(await storage.persisted())) {
      await storage.persist();
    }
  } catch {
    return;
  }
}
