import { useEffect, useState } from 'react';
import { removeLogoBackground } from '@/client/services/logoBackground';
import { ERROR_MESSAGE } from '@/shared/constants/messages';
import type { StoredLogo } from '@/shared/types/watermark';

interface ProcessedLogo {
  sourceLogoId: string;
  blob: Blob;
}

interface ProcessingError {
  sourceLogoId: string;
  message: string;
}

export interface EffectiveLogo {
  logoBlob: Blob | null;
  isPreparing: boolean;
  error: string | null;
}

export function useEffectiveLogo(logo: StoredLogo | null, shouldRemoveBackground: boolean): EffectiveLogo {
  const [processedLogo, setProcessedLogo] = useState<ProcessedLogo | null>(null);
  const [processingError, setProcessingError] = useState<ProcessingError | null>(null);
  const logoId = logo?.id ?? null;
  const logoBlob = logo?.blob ?? null;

  useEffect(() => {
    if (!shouldRemoveBackground || !logoId || !logoBlob) return;

    let isActive = true;
    removeLogoBackground(logoBlob)
      .then((blob) => {
        if (isActive) setProcessedLogo({ sourceLogoId: logoId, blob });
      })
      .catch(() => {
        if (isActive) setProcessingError({ sourceLogoId: logoId, message: ERROR_MESSAGE.logoBackgroundRemovalFailed });
      });
    return () => {
      isActive = false;
    };
  }, [shouldRemoveBackground, logoId, logoBlob]);

  if (!logo) {
    return { logoBlob: null, isPreparing: false, error: null };
  }
  if (!shouldRemoveBackground) {
    return { logoBlob: logo.blob, isPreparing: false, error: null };
  }

  const readyBlob = processedLogo && processedLogo.sourceLogoId === logo.id ? processedLogo.blob : null;
  const error = processingError && processingError.sourceLogoId === logo.id ? processingError.message : null;

  return { logoBlob: readyBlob, isPreparing: readyBlob === null && error === null, error };
}
