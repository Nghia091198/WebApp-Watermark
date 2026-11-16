import type { ReactNode } from 'react';
import { BlobImage } from '@/client/components/BlobImage';
import { FilePickerButton } from '@/client/components/FilePickerButton';
import { IMAGE_ACCEPT } from '@/shared/constants/image';
import type { StoredLogo } from '@/shared/types/watermark';

interface LogoLibraryProps {
  logos: readonly StoredLogo[];
  selectedLogoId: string | null;
  isLoading: boolean;
  error: string | null;
  children?: ReactNode;
  onSelect: (id: string) => void;
  onAdd: (files: File[]) => void;
  onRemove: (logo: StoredLogo) => void;
}

export function LogoLibrary({
  logos,
  selectedLogoId,
  isLoading,
  error,
  children,
  onSelect,
  onAdd,
  onRemove,
}: LogoLibraryProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">1. Chọn logo</h2>
        <FilePickerButton label="+ Thêm logo" accept={IMAGE_ACCEPT} multiple onFilesSelected={onAdd} />
      </div>

      {error && <p className="alert">{error}</p>}

      {!isLoading && logos.length === 0 && (
        <p className="hint">Chưa có logo nào. Nên dùng ảnh PNG nền trong suốt — logo sẽ được lưu lại trên máy này.</p>
      )}

      <ul className="logo-grid">
        {logos.map((logo) => {
          const isSelected = logo.id === selectedLogoId;
          return (
            <li key={logo.id} className={isSelected ? 'logo-card logo-card--selected' : 'logo-card'}>
              <button
                type="button"
                className="logo-card__select"
                aria-pressed={isSelected}
                title={logo.name}
                onClick={() => onSelect(logo.id)}
              >
                <BlobImage blob={logo.blob} alt={logo.name} className="logo-card__image" />
              </button>
              <button
                type="button"
                className="logo-card__remove"
                aria-label={`Xoá logo ${logo.name}`}
                onClick={() => onRemove(logo)}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>

      {children}
    </section>
  );
}
