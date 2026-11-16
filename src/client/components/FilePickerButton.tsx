import type { ChangeEvent } from 'react';

interface FilePickerButtonProps {
  label: string;
  accept: string;
  multiple?: boolean;
  variant?: 'primary' | 'secondary';
  onFilesSelected: (files: File[]) => void;
}

export function FilePickerButton({
  label,
  accept,
  multiple = false,
  variant = 'secondary',
  onFilesSelected,
}: FilePickerButtonProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length > 0) onFilesSelected(files);
  };

  return (
    <label className={`button button--${variant}`}>
      {label}
      <input className="visually-hidden" type="file" accept={accept} multiple={multiple} onChange={handleChange} />
    </label>
  );
}
