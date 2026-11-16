import { useObjectUrl } from '@/client/hooks/useObjectUrl';

interface BlobImageProps {
  blob: Blob;
  alt: string;
  className?: string;
}

export function BlobImage({ blob, alt, className }: BlobImageProps) {
  const objectUrl = useObjectUrl(blob);

  if (!objectUrl) {
    return <span className={className} aria-hidden="true" />;
  }

  return <img src={objectUrl} alt={alt} className={className} loading="lazy" decoding="async" />;
}
