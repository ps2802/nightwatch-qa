type MetricTone = "neutral" | "positive" | "warning";

const toneClasses: Record<MetricTone, string> = {
  neutral: "text-muted",
  positive: "text-success",
  warning: "text-warning",
};

export function MetricRow({
  label,
  value,
  change,
  tone = "neutral",
}: {
  label: string;
  value: string;
  change?: string;
  tone?: MetricTone;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line py-3 last:border-b-0 last:pb-0 first:pt-0">
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-ink">
          {value}
        </p>
      </div>
      {change ? (
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${toneClasses[tone]}`}>
          {change}
        </p>
      ) : null}
    </div>
  );
}
