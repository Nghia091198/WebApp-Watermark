import { PositionPicker } from '@/client/components/PositionPicker';
import { SliderField } from '@/client/components/SliderField';
import { WATERMARK_LIMITS } from '@/shared/constants/watermark';
import type { WatermarkLayout } from '@/shared/types/watermark';

interface WatermarkControlsProps {
  layout: WatermarkLayout;
  onChange: (patch: Partial<WatermarkLayout>) => void;
}

const { scalePercent, opacityPercent, marginPercent } = WATERMARK_LIMITS;

export function WatermarkControls({ layout, onChange }: WatermarkControlsProps) {
  return (
    <section className="panel">
      <h2 className="panel__title">3. Vị trí & kích thước</h2>
      <div className="controls">
        <PositionPicker value={layout.position} onChange={(position) => onChange({ position })} />
        <div className="controls__sliders">
          <SliderField
            label="Kích thước logo"
            unit="%"
            min={scalePercent.min}
            max={scalePercent.max}
            step={scalePercent.step}
            value={layout.scalePercent}
            onChange={(value) => onChange({ scalePercent: value })}
          />
          <SliderField
            label="Độ đậm"
            unit="%"
            min={opacityPercent.min}
            max={opacityPercent.max}
            step={opacityPercent.step}
            value={layout.opacityPercent}
            onChange={(value) => onChange({ opacityPercent: value })}
          />
          <SliderField
            label="Khoảng cách mép"
            unit="%"
            min={marginPercent.min}
            max={marginPercent.max}
            step={marginPercent.step}
            value={layout.marginPercent}
            onChange={(value) => onChange({ marginPercent: value })}
          />
        </div>
      </div>
    </section>
  );
}
