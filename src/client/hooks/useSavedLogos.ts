import { useCallback, useEffect, useState } from 'react';
import { deleteLogo, listLogos, saveLogo } from '@/client/services/logoStorage';
import { readSelectedLogoId, writeSelectedLogoId } from '@/client/services/settingsStorage';
import { withErrorDetail } from '@/client/utils/describeError';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import { isImageFile } from '@/shared/lib/imageFile';
import { mergeLogosById } from '@/shared/lib/logoRecord';
import type { StoredLogo } from '@/shared/types/watermark';

function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

function isRejected<T>(result: PromiseSettledResult<T>): result is PromiseRejectedResult {
  return result.status === 'rejected';
}

export function useSavedLogos() {
  const [logos, setLogos] = useState<StoredLogo[]>([]);
  const [preferredLogoId, setPreferredLogoId] = useState<string | null>(readSelectedLogoId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedLogo = logos.find((logo) => logo.id === preferredLogoId) ?? logos[0] ?? null;
  const selectedLogoId = selectedLogo?.id ?? null;

  useEffect(() => {
    let isActive = true;
    listLogos()
      .then((storedLogos) => {
        if (isActive) setLogos((current) => mergeLogosById(current, storedLogos));
      })
      .catch((loadError: unknown) => {
        if (isActive) setError(withErrorDetail(ERROR_MESSAGE.logoListFailed, loadError));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) writeSelectedLogoId(selectedLogoId);
  }, [isLoading, selectedLogoId]);

  const addLogos = useCallback(async (files: readonly File[]) => {
    const imageFiles = files.filter((file) => isImageFile(file.name, file.type));
    if (imageFiles.length === 0) return;

    setError(null);
    const outcomes = await Promise.allSettled(imageFiles.map(saveLogo));
    const savedLogos = outcomes.filter(isFulfilled).map((outcome) => outcome.value);
    const firstFailure = outcomes.find(isRejected);

    if (savedLogos.length > 0) {
      setLogos((current) => mergeLogosById(savedLogos, current));
      setPreferredLogoId(savedLogos[0].id);
    }
    if (firstFailure) {
      setError(withErrorDetail(ERROR_MESSAGE.logoSaveFailed, firstFailure.reason));
    }
  }, []);

  const removeLogo = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteLogo(id);
      setLogos((current) => current.filter((logo) => logo.id !== id));
    } catch (deleteError) {
      setError(withErrorDetail(ERROR_MESSAGE.logoDeleteFailed, deleteError));
    }
  }, []);

  return {
    logos,
    selectedLogo,
    selectLogo: setPreferredLogoId,
    addLogos,
    removeLogo,
    isLoading,
    error,
  };
}
