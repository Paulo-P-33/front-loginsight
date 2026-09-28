import { CheckCircle2, MapPin, ShieldCheck, Truck, XCircle, MinusCircle, Waypoints } from "lucide-react";
import { cycleBreakdown, dailyEvolution } from "@/lib/dashboard-data";
import { DonutChart } from "@/components/dashboard/DonutChart";

const previewStats = [
  { label: "Total de Rotas", value: "154", icon: Waypoints, iconClassName: "bg-blue-50 text-blue-500" },
  { label: "Entregas Realizadas", value: "7.981", icon: CheckCircle2, iconClassName: "bg-emerald-50 text-emerald-500" },
  { label: "Insucessos", value: "451", icon: XCircle, iconClassName: "bg-rose-50 text-rose-500" },
  { label: "Não Visitadas", value: "123", icon: MinusCircle, iconClassName: "bg-slate-100 text-slate-400" },
];

const maxDeliveries = Math.max(...dailyEvolution.map((point) => point.deliveries));

export function LoginShowcase() {
  return (
    <div className="flex h-full flex-col justify-between gap-10 overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 px-10 py-12 sm:px-14">
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Truck className="h-6 w-6" />
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-900">RouteManager</p>
            <p className="text-sm text-slate-500">Gestão de Rotas Inteligente</p>
          </div>
        </div>

        <h1 className="mt-10 text-4xl font-bold leading-tight text-slate-900">
          Dados que movem
          <br />
          sua operação.
        </h1>
        <p className="mt-4 max-w-md text-slate-600">
          Centralize seus relatórios de rotas, acompanhe indicadores em tempo real e tome decisões com base em
          dados confiáveis.
        </p>
      </div>

      <div className="rounded-2xl border border-white bg-white/90 p-5 shadow-xl backdrop-blur">
        <p className="text-sm font-semibold text-slate-900">Dashboard</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previewStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-100 p-2.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-md ${stat.iconClassName}`}
                aria-hidden="true"
              >
                <stat.icon className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 text-base font-semibold text-slate-900">{stat.value}</p>
              <p className="truncate text-[11px] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-xs font-semibold text-slate-700">Desempenho por Ciclo</p>
            <div className="mt-2 flex justify-center">
              <DonutChart data={cycleBreakdown} centerValue="154" centerLabel="rotas" showLegend={false} size={80} />
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 p-3">
            <p className="text-xs font-semibold text-slate-700">Evolução diária (últimos 7 dias)</p>
            <svg viewBox="0 0 160 70" className="mt-2 w-full" role="img" aria-hidden="true">
              {dailyEvolution.map((point, index) => {
                const barWidth = 14;
                const gap = 8;
                const x = index * (barWidth + gap) + 4;
                const barHeight = (point.deliveries / maxDeliveries) * 46;
                return (
                  <rect
                    key={point.date}
                    x={x}
                    y={54 - barHeight}
                    width={barWidth}
                    height={barHeight}
                    rx={2}
                    fill="#3b82f6"
                  />
                );
              })}
              <line x1={0} y1={54} x2={160} y2={54} stroke="#e2e8f0" strokeWidth={1} />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <div className="relative h-28">
          <svg viewBox="0 0 400 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path
              d="M20 80 L 150 80 L 210 40 L 380 40"
              fill="none"
              stroke="#93c5fd"
              strokeWidth={3}
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            <circle cx={150} cy={80} r={5} fill="#2563eb" />
            <circle cx={380} cy={40} r={5} fill="#2563eb" />
          </svg>

          <span className="absolute left-[110px] top-[52px] flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <span className="absolute left-[350px] top-[12px] flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white">
            <MapPin className="h-3.5 w-3.5" />
          </span>

          <div className="absolute bottom-0 left-0 flex h-11 w-20 items-center justify-center rounded-lg bg-slate-800 text-white shadow-lg">
            <Truck className="h-6 w-6" />
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
          Seguro, confiável e feito para otimizar sua logística.
        </p>
      </div>
    </div>
  );
}
