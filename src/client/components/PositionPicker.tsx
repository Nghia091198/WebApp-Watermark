import {
  WATERMARK_POSITION_GRID,
  WATERMARK_POSITION_LABEL,
  type WatermarkPosition,
} from '@/shared/constants/watermark';

interface PositionPickerProps {
  value: WatermarkPosition;
  onChange: (position: WatermarkPosition) => void;
}

export function PositionPicker({ value, onChange }: PositionPickerProps) {
  return (
    <div className="position-picker">
      <div className="position-picker__grid" role="radiogroup" aria-label="Vị trí logo">
        {WATERMARK_POSITION_GRID.map((position) => {
          const isSelected = position === value;
          return (
            <button
              key={position}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={WATERMARK_POSITION_LABEL[position]}
              title={WATERMARK_POSITION_LABEL[position]}
              className={isSelected ? 'position-picker__cell position-picker__cell--selected' : 'position-picker__cell'}
              onClick={() => onChange(position)}
            >
              <span className="position-picker__dot" />
            </button>
          );
        })}
      </div>
      <p className="position-picker__label">{WATERMARK_POSITION_LABEL[value]}</p>
    </div>
  );
}
