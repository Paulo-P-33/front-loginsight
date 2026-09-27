import type { DonutSlice } from "@/types/dashboard";

interface DonutChartProps {
  data: DonutSlice[];
  centerValue: string;
  centerLabel: string;
  showLegend?: boolean;
  size?: number;
}

const GAP_DEGREES = 3;

function buildConicGradient(data: DonutSlice[]): string {
  const stops: string[] = [];
  let cursor = 0;

  data.forEach((slice, index) => {
    const isLast = index === data.length - 1;
    const sliceDegrees = (slice.percentage / 100) * 360;
    const start = cursor;
    const end = isLast ? 360 - GAP_DEGREES : start + sliceDegrees;

    stops.push(`${slice.color} ${start}deg ${end}deg`);
    const gapEnd = isLast ? 360 : end + GAP_DEGREES;
    stops.push(`#ffffff ${end}deg ${gapEnd}deg`);
    cursor = gapEnd;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

export function DonutChart({ data, centerValue, centerLabel, showLegend = true, size = 160 }: DonutChartProps) {
  const holeInset = Math.round(size * 0.0875);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div
        className="relative shrink-0 rounded-full"
        style={{ width: size, height: size, background: buildConicGradient(data) }}
        role="img"
        aria-label={`${centerLabel}: ${centerValue}`}
      >
        <div
          className="absolute flex flex-col items-center justify-center rounded-full bg-white text-center"
          style={{ inset: holeInset }}
        >
          <span className="text-2xl font-semibold text-slate-900">{centerValue}</span>
          <span className="text-xs text-slate-500">{centerLabel}</span>
        </div>
      </div>

      {showLegend && (
        <ul className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
          {data.map((slice) => (
            <li key={slice.label} className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
                aria-hidden="true"
              />
              <span className="min-w-0 truncate text-xs font-medium text-slate-700">{slice.label}</span>
              <span className="ml-auto shrink-0 text-xs text-slate-500">
                {slice.value.toLocaleString("pt-BR")} ({slice.percentage.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%)
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
