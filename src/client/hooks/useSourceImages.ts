import { useCallback, useState } from 'react';
import { createId } from '@/client/utils/createId';
import { isImageFile } from '@/shared/lib/imageFile';
import type { SourceImage } from '@/shared/types/watermark';

export function useSourceImages() {
  const [images, setImages] = useState<SourceImage[]>([]);
  const [rejectedFileNames, setRejectedFileNames] = useState<string[]>([]);

  const addImages = useCallback((files: readonly File[]) => {
    const imageFiles = files.filter((file) => isImageFile(file.name, file.type));
    setRejectedFileNames(files.filter((file) => !imageFiles.includes(file)).map((file) => file.name));
    if (imageFiles.length === 0) return;
    setImages((current) => [...current, ...imageFiles.map((file) => ({ id: createId(), file }))]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((current) => current.filter((image) => image.id !== id));
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setRejectedFileNames([]);
  }, []);

  return { images, rejectedFileNames, addImages, removeImage, clearImages };
}
