import { useCallback, useMemo, useState } from 'react';
import { downloadAsZip, isShareCancelled, resolveSaveMethod, saveFiles } from '@/client/services/fileExport';
import { OUTPUT_ZIP_FILE_NAME } from '@/shared/constants/image';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import type { WatermarkResult } from '@/shared/types/watermark';

export function useResultExport(results: readonly WatermarkResult[]) {
  const [isSaving, setIsSaving] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMethod = useMemo(() => resolveSaveMethod(results), [results]);

  const save = useCallback(
    async (files: readonly WatermarkResult[]) => {
      setError(null);
      setIsSaving(true);
      try {
        await saveFiles(files, saveMethod);
      } catch (saveError) {
        if (!isShareCancelled(saveError)) setError(ERROR_MESSAGE.saveFailed);
      } finally {
        setIsSaving(false);
      }
    },
    [saveMethod],
  );

  const saveOne = useCallback((result: WatermarkResult) => save([result]), [save]);

  const saveAll = useCallback(() => save(results), [save, results]);

  const downloadZip = useCallback(async () => {
    setError(null);
    setIsZipping(true);
    try {
      await downloadAsZip(results, OUTPUT_ZIP_FILE_NAME);
    } catch {
      setError(ERROR_MESSAGE.zipFailed);
    } finally {
      setIsZipping(false);
    }
  }, [results]);

  return { saveMethod, isSaving, isZipping, error, saveOne, saveAll, downloadZip };
}
