import JSZip from 'jszip';
import { isAppleMobileDevice } from '@/client/utils/platform';
import { SAVE_METHOD, SEQUENTIAL_DOWNLOAD_GAP_MS, type SaveMethod } from '@/shared/constants/export';

export interface ExportFile {
  fileName: string;
  blob: Blob;
}

const DOWNLOAD_URL_REVOKE_DELAY_MS = 1_000;

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), DOWNLOAD_URL_REVOKE_DELAY_MS);
}

async function downloadSequentially(files: readonly ExportFile[]): Promise<void> {
  for (const [index, file] of files.entries()) {
    if (index > 0) await wait(SEQUENTIAL_DOWNLOAD_GAP_MS);
    downloadBlob(file.blob, file.fileName);
  }
}

export async function downloadAsZip(files: readonly ExportFile[], zipFileName: string): Promise<void> {
  const zip = new JSZip();
  files.forEach((file) => zip.file(file.fileName, file.blob));
  const archive = await zip.generateAsync({ type: 'blob' });
  downloadBlob(archive, zipFileName);
}

function toShareableFiles(files: readonly ExportFile[]): File[] {
  return files.map((file) => new File([file.blob], file.fileName, { type: file.blob.type }));
}

function canShareFiles(files: readonly ExportFile[]): boolean {
  if (typeof navigator.canShare !== 'function') {
    return false;
  }
  return navigator.canShare({ files: toShareableFiles(files) });
}

export function resolveSaveMethod(files: readonly ExportFile[]): SaveMethod {
  return isAppleMobileDevice() && canShareFiles(files) ? SAVE_METHOD.shareSheet : SAVE_METHOD.download;
}

export function saveFiles(files: readonly ExportFile[], method: SaveMethod): Promise<void> {
  if (method === SAVE_METHOD.shareSheet) {
    return navigator.share({ files: toShareableFiles(files) });
  }
  return downloadSequentially(files);
}

export function isShareCancelled(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
