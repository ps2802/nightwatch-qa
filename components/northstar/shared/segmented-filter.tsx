"use client";

type SegmentOption<T extends string> = {
  label: string;
  value: T;
};

export function SegmentedFilter<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex w-full flex-wrap gap-2 rounded-2xl border border-line bg-surfaceMuted p-1">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-xl px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-surface text-ink shadow-card"
                : "text-muted hover:bg-surface/70"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
