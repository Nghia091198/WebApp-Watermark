export function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message ? `${error.name}: ${error.message}` : error.name;
  }
  return String(error);
}

export function withErrorDetail(message: string, error: unknown): string {
  return `${message} (${describeError(error)})`;
}
