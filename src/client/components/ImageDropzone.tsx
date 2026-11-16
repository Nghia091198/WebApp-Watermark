import { useState, type DragEvent } from 'react';
import { BlobImage } from '@/client/components/BlobImage';
import { FilePickerButton } from '@/client/components/FilePickerButton';
import { IMAGE_ACCEPT } from '@/shared/constants/image';
import type { SourceImage } from '@/shared/types/watermark';

interface ImageDropzoneProps {
  images: readonly SourceImage[];
  rejectedFileNames: readonly string[];
  isDisabled: boolean;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function ImageDropzone({ images, rejectedFileNames, isDisabled, onAdd, onRemove, onClear }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onAdd(Array.from(event.dataTransfer.files));
  };

  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">3. Ảnh cần đóng logo {images.length > 0 && `(${images.length})`}</h2>
        {images.length > 0 && (
          <button type="button" className="button button--ghost" onClick={onClear} disabled={isDisabled}>
            Xoá hết
          </button>
        )}
      </div>

      <div
        className={isDragging ? 'dropzone dropzone--active' : 'dropzone'}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="dropzone__text">Kéo thả ảnh vào đây, hoặc</p>
        <FilePickerButton label="Chọn ảnh từ máy / điện thoại" accept={IMAGE_ACCEPT} multiple variant="primary" onFilesSelected={onAdd} />
        <p className="hint">Chọn được nhiều ảnh cùng lúc, có thể bấm thêm nhiều lần</p>
      </div>

      {rejectedFileNames.length > 0 && (
        <p className="alert">Đã bỏ qua {rejectedFileNames.length} file không phải ảnh: {rejectedFileNames.join(', ')}</p>
      )}

      {images.length > 0 && (
        <ul className="thumb-grid">
          {images.map((image) => (
            <li key={image.id} className="thumb">
              <BlobImage blob={image.file} alt={image.file.name} className="thumb__image" />
              <button
                type="button"
                className="thumb__remove"
                aria-label={`Bỏ ảnh ${image.file.name}`}
                onClick={() => onRemove(image.id)}
                disabled={isDisabled}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
