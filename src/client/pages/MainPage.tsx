import { useEffect, useRef, useState } from 'react';
import { ImageDropzone } from '@/client/components/ImageDropzone';
import { LogoBackgroundOption } from '@/client/components/LogoBackgroundOption';
import { LogoLibrary } from '@/client/components/LogoLibrary';
import { ResultGallery } from '@/client/components/ResultGallery';
import { WatermarkControls } from '@/client/components/WatermarkControls';
import { useEffectiveLogo, type EffectiveLogo } from '@/client/hooks/useEffectiveLogo';
import { useSavedLogos } from '@/client/hooks/useSavedLogos';
import { useSourceImages } from '@/client/hooks/useSourceImages';
import { useWatermarkBatch, type BatchProgress } from '@/client/hooks/useWatermarkBatch';
import { useWatermarkLayout } from '@/client/hooks/useWatermarkLayout';
import type { StoredLogo } from '@/shared/types/watermark';

interface ApplyStatusInput {
  progress: BatchProgress | null;
  hasLogo: boolean;
  effectiveLogo: EffectiveLogo;
  imageCount: number;
}

function describeApplyStatus({ progress, hasLogo, effectiveLogo, imageCount }: ApplyStatusInput): string {
  if (progress) return `Đang xử lý ${progress.completed}/${progress.total}…`;
  if (!hasLogo) return 'Hãy thêm hoặc chọn một logo';
  if (effectiveLogo.isPreparing) return 'Đang xoá nền logo…';
  if (effectiveLogo.error) return 'Logo chưa sẵn sàng';
  if (imageCount === 0) return 'Hãy chọn ảnh cần đóng logo';
  return `Sẵn sàng: ${imageCount} ảnh`;
}

export function MainPage() {
  const { layout, updateLayout } = useWatermarkLayout();
  const savedLogos = useSavedLogos();
  const [shouldRemoveLogoBackground, setShouldRemoveLogoBackground] = useState(false);
  const effectiveLogo = useEffectiveLogo(savedLogos.selectedLogo, shouldRemoveLogoBackground);
  const { images, rejectedFileNames, addImages, removeImage, clearImages } = useSourceImages();
  const { results, failedFileNames, progress, isProcessing, error: batchError, runBatch } = useWatermarkBatch();
  const resultsRef = useRef<HTMLDivElement>(null);

  const { selectedLogo } = savedLogos;
  const canApply = effectiveLogo.logoBlob !== null && images.length > 0 && !isProcessing;
  const hasBatchOutcome = results.length > 0 || failedFileNames.length > 0;

  useEffect(() => {
    if (results.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  const handleApply = () => {
    if (effectiveLogo.logoBlob) void runBatch(images, effectiveLogo.logoBlob, layout);
  };

  const handleRemoveLogo = (logo: StoredLogo) => {
    if (window.confirm(`Xoá logo "${logo.name}" khỏi danh sách đã lưu?`)) {
      void savedLogos.removeLogo(logo.id);
    }
  };

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Đóng logo hàng loạt</h1>
        <p className="page__subtitle">Ảnh được xử lý ngay trên thiết bị của bạn, không tải lên máy chủ.</p>
      </header>

      <div className="page__settings">
        <LogoLibrary
          logos={savedLogos.logos}
          selectedLogoId={selectedLogo?.id ?? null}
          isLoading={savedLogos.isLoading}
          error={savedLogos.error}
          onSelect={savedLogos.selectLogo}
          onAdd={(files) => void savedLogos.addLogos(files)}
          onRemove={handleRemoveLogo}
        >
          {selectedLogo && (
            <LogoBackgroundOption
              isChecked={shouldRemoveLogoBackground}
              effectiveLogo={effectiveLogo}
              onChange={setShouldRemoveLogoBackground}
            />
          )}
        </LogoLibrary>
        <WatermarkControls layout={layout} onChange={updateLayout} />
      </div>

      <ImageDropzone
        images={images}
        rejectedFileNames={rejectedFileNames}
        isDisabled={isProcessing}
        onAdd={addImages}
        onRemove={removeImage}
        onClear={clearImages}
      />

      <div className="apply-bar">
        <span className="apply-bar__status">
          {describeApplyStatus({
            progress,
            hasLogo: selectedLogo !== null,
            effectiveLogo,
            imageCount: images.length,
          })}
        </span>
        <button type="button" className="button button--primary button--large" onClick={handleApply} disabled={!canApply}>
          {isProcessing ? 'Đang xử lý…' : 'Áp dụng logo'}
        </button>
      </div>

      {batchError && <p className="alert">{batchError}</p>}

      {hasBatchOutcome && (
        <div ref={resultsRef}>
          <ResultGallery results={results} failedFileNames={failedFileNames} />
        </div>
      )}
    </div>
  );
}
