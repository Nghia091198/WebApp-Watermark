export function createId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const randomPart = Array.from(crypto.getRandomValues(new Uint32Array(2)), (value) => value.toString(36)).join('');
  return `${Date.now().toString(36)}-${randomPart}`;
}
