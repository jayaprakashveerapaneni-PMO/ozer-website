"use client";

/** Labeled numeric input with clamping — the only way numbers enter forms. */
export default function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  unit,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  unit?: string;
}) {
  const clamp = (v: number) => Math.min(Math.max(Math.round(v) || min, min), max);
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          className="w-24 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-foreground focus:border-primary"
        />
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
    </div>
  );
}
