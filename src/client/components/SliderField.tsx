import { useId } from 'react';

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

export function SliderField({ label, value, min, max, step, unit, onChange }: SliderFieldProps) {
  const inputId = useId();

  return (
    <div className="slider-field">
      <label htmlFor={inputId} className="slider-field__label">
        <span>{label}</span>
        <span className="slider-field__value">
          {value}
          {unit}
        </span>
      </label>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
