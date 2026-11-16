import { ERROR_MESSAGE } from '@/shared/constants/messages';

export async function withDecodedImage<T>(blob: Blob, render: (image: HTMLImageElement) => Promise<T>): Promise<T> {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      throw new Error(ERROR_MESSAGE.imageDecodeFailed);
    }
    return await render(image);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
