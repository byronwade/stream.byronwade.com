"use client";

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  chartData?: number[];
  onExpand?: () => void;
}

export function AnalyticsCard({ label, value, delta, chartData, onExpand }: AnalyticsCardProps) {
  const max = chartData ? Math.max(...chartData, 1) : 1;

  return (
    <button
      type="button"
      onClick={onExpand}
      className="solid-surface w-full text-left transition-colors hover:border-accent-primary/30 focus-ring"
    >
      <p className="muted-label">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {delta && <p className="mt-1 text-xs text-success">{delta}</p>}
      {chartData && (
        <svg viewBox="0 0 100 30" className="mt-3 h-8 w-full" aria-hidden>
          <polyline
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth="2"
            points={chartData
              .map((v, i) => `${(i / (chartData.length - 1)) * 100},${30 - (v / max) * 28}`)
              .join(" ")}
          />
        </svg>
      )}
    </button>
  );
}
