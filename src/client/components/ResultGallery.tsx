import { BlobImage } from '@/client/components/BlobImage';
import { useResultExport } from '@/client/hooks/useResultExport';
import { SAVE_METHOD_HINT } from '@/shared/constants/export';
import type { WatermarkResult } from '@/shared/types/watermark';

interface ResultGalleryProps {
  results: readonly WatermarkResult[];
  failedFileNames: readonly string[];
}

export function ResultGallery({ results, failedFileNames }: ResultGalleryProps) {
  const { saveMethod, isSaving, isZipping, error, saveOne, saveAll, downloadZip } = useResultExport(results);
  const hasResults = results.length > 0;
  const isBusy = isSaving || isZipping;

  return (
    <section className="panel">
      <div className="panel__header">
        <h2 className="panel__title">4. Kết quả ({results.length})</h2>
        {hasResults && (
          <div className="panel__actions">
            <button type="button" className="button button--secondary" onClick={() => void downloadZip()} disabled={isBusy}>
              {isZipping ? 'Đang nén…' : 'Tải file .zip'}
            </button>
            <button type="button" className="button button--primary" onClick={() => void saveAll()} disabled={isBusy}>
              {isSaving ? 'Đang lưu…' : `Lưu tất cả (${results.length})`}
            </button>
          </div>
        )}
      </div>

      {hasResults && <p className="hint save-hint">{SAVE_METHOD_HINT[saveMethod]}</p>}

      {failedFileNames.length > 0 && (
        <p className="alert">
          Không xử lý được {failedFileNames.length} ảnh: {failedFileNames.join(', ')}. Ảnh HEIC chỉ đọc được trên
          Safari — với trình duyệt khác hãy chuyển ảnh sang JPG.
        </p>
      )}
      {error && <p className="alert">{error}</p>}

      {hasResults && (
        <ul className="thumb-grid thumb-grid--large">
          {results.map((result) => (
            <li key={result.id} className="thumb">
              <BlobImage blob={result.blob} alt={result.fileName} className="thumb__image" />
              <button type="button" className="thumb__download" onClick={() => void saveOne(result)} disabled={isBusy}>
                Lưu ảnh
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
