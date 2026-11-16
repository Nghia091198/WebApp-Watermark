import { BlobImage } from '@/client/components/BlobImage';
import type { EffectiveLogo } from '@/client/hooks/useEffectiveLogo';

interface LogoBackgroundOptionProps {
  isChecked: boolean;
  effectiveLogo: EffectiveLogo;
  onChange: (isChecked: boolean) => void;
}

export function LogoBackgroundOption({ isChecked, effectiveLogo, onChange }: LogoBackgroundOptionProps) {
  return (
    <div className="background-option">
      <label className="checkbox-field">
        <input type="checkbox" checked={isChecked} onChange={(event) => onChange(event.target.checked)} />
        <span>Xoá nền logo</span>
      </label>

      {isChecked && (
        <div className="background-option__preview">
          {effectiveLogo.isPreparing && <span className="hint">Đang xoá nền…</span>}
          {effectiveLogo.error && <p className="alert">{effectiveLogo.error}</p>}
          {effectiveLogo.logoBlob && (
            <>
              <BlobImage blob={effectiveLogo.logoBlob} alt="Logo sau khi xoá nền" className="background-option__image" />
              <span className="hint">Xem trước logo sau khi xoá nền</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
