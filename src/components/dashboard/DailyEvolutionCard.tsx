import { dailyEvolution } from "@/lib/dashboard-data";

const CHART_WIDTH = 280;
const BAR_CHART_HEIGHT = 90;
const BAR_WIDTH = 22;
const SERIES_COLOR = "#3b82f6";

const maxDeliveries = Math.ceil(Math.max(...dailyEvolution.map((point) => point.deliveries)) / 500) * 500;

const rateValues = dailyEvolution.map((point) => point.deliveryRate);
const rateMin = Math.floor(Math.min(...rateValues) / 2) * 2;
const rateMax = Math.ceil(Math.max(...rateValues) / 2) * 2;

function xPosition(index: number) {
  const step = CHART_WIDTH / dailyEvolution.length;
  return step * index + step / 2;
}

function ratePoints() {
  const step = CHART_WIDTH / dailyEvolution.length;
  return dailyEvolution.map((point, index) => {
    const x = step * index + step / 2;
    const ratio = (point.deliveryRate - rateMin) / (rateMax - rateMin || 1);
    const y = 44 - ratio * 34;
    return { x, y, point };
  });
}

export function DailyEvolutionCard() {
  const points = ratePoints();
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},52 L${points[0].x},52 Z`;
  const last = dailyEvolution[dailyEvolution.length - 1];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Evolução diária (últimos 7 dias)</h2>

      <p className="mt-4 text-xs font-medium text-slate-500">Entregas</p>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${BAR_CHART_HEIGHT + 20}`}
        className="mt-1 w-full"
        role="img"
        aria-label="Entregas realizadas por dia nos últimos 7 dias"
      >
        <line x1={0} y1={BAR_CHART_HEIGHT} x2={CHART_WIDTH} y2={BAR_CHART_HEIGHT} stroke="#e2e8f0" strokeWidth={1} />
        {dailyEvolution.map((point, index) => {
          const barHeight = (point.deliveries / maxDeliveries) * (BAR_CHART_HEIGHT - 4);
          const x = xPosition(index) - BAR_WIDTH / 2;
          const y = BAR_CHART_HEIGHT - barHeight;
          return (
            <g key={point.date}>
              <rect x={x} y={y} width={BAR_WIDTH} height={barHeight} rx={4} fill={SERIES_COLOR}>
                <title>{`${point.date}: ${point.deliveries.toLocaleString("pt-BR")} entregas`}</title>
              </rect>
              <text
                x={xPosition(index)}
                y={BAR_CHART_HEIGHT + 14}
                textAnchor="middle"
                className="fill-slate-400"
                fontSize={9}
              >
                {point.date}
              </text>
            </g>
          );
        })}
        <text x={CHART_WIDTH} y={BAR_CHART_HEIGHT - ((last.deliveries / maxDeliveries) * (BAR_CHART_HEIGHT - 4)) - 6} textAnchor="end" className="fill-slate-600" fontSize={10} fontWeight={600}>
          {last.deliveries.toLocaleString("pt-BR")}
        </text>
      </svg>

      <p className="mt-3 text-xs font-medium text-slate-500">% Entregas</p>
      <svg viewBox={`0 0 ${CHART_WIDTH} 56`} className="mt-1 w-full" role="img" aria-label="Percentual de entregas por dia nos últimos 7 dias">
        <line x1={0} y1={52} x2={CHART_WIDTH} y2={52} stroke="#e2e8f0" strokeWidth={1} />
        <path d={areaPath} fill="#10b981" opacity={0.1} />
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {points.map(({ x, y, point }) => (
          <circle key={point.date} cx={x} cy={y} r={3} fill="#10b981" stroke="#ffffff" strokeWidth={2}>
            <title>{`${point.date}: ${point.deliveryRate.toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`}</title>
          </circle>
        ))}
        <text x={points[points.length - 1].x} y={points[points.length - 1].y - 8} textAnchor="end" className="fill-slate-600" fontSize={10} fontWeight={600}>
          {last.deliveryRate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%
        </text>
      </svg>
    </section>
  );
}
