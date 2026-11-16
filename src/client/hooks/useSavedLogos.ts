import { useCallback, useEffect, useState } from 'react';
import { deleteLogo, listLogos, saveLogo } from '@/client/services/logoStorage';
import { readSelectedLogoId, writeSelectedLogoId } from '@/client/services/settingsStorage';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import { isImageFile } from '@/shared/lib/imageFile';
import type { StoredLogo } from '@/shared/types/watermark';

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
        if (isActive) setLogos(storedLogos);
      })
      .catch(() => {
        if (isActive) setError(ERROR_MESSAGE.logoListFailed);
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
    try {
      const savedLogos = await Promise.all(imageFiles.map(saveLogo));
      setLogos((current) => [...savedLogos, ...current]);
      setPreferredLogoId(savedLogos[0].id);
    } catch {
      setError(ERROR_MESSAGE.logoSaveFailed);
    }
  }, []);

  const removeLogo = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteLogo(id);
      setLogos((current) => current.filter((logo) => logo.id !== id));
    } catch {
      setError(ERROR_MESSAGE.logoDeleteFailed);
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
