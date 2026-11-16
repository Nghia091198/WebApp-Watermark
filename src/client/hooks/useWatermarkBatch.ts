import { useCallback, useState } from 'react';
import { watermarkImages } from '@/client/services/watermarkBatch';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import type { SourceImage, WatermarkLayout, WatermarkResult } from '@/shared/types/watermark';

export interface BatchProgress {
  completed: number;
  total: number;
}

export function useWatermarkBatch() {
  const [results, setResults] = useState<WatermarkResult[]>([]);
  const [failedFileNames, setFailedFileNames] = useState<string[]>([]);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runBatch = useCallback(
    async (images: readonly SourceImage[], logoBlob: Blob, layout: WatermarkLayout) => {
      const total = images.length;
      setResults([]);
      setFailedFileNames([]);
      setError(null);
      setProgress({ completed: 0, total });

      try {
        const outcome = await watermarkImages(images, logoBlob, layout, (completed) =>
          setProgress({ completed, total }),
        );
        setResults(outcome.results);
        setFailedFileNames(outcome.failedFileNames);
      } catch {
        setError(ERROR_MESSAGE.logoUnreadable);
      } finally {
        setProgress(null);
      }
    },
    [],
  );

  return {
    results,
    failedFileNames,
    progress,
    isProcessing: progress !== null,
    error,
    runBatch,
  };
}
