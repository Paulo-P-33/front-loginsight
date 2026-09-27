import { cycleBreakdown } from "@/lib/dashboard-data";
import { DonutChart } from "./DonutChart";

export function CycleBreakdownCard() {
  const total = cycleBreakdown.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Desempenho por Ciclo</h2>
      <div className="mt-6">
        <DonutChart data={cycleBreakdown} centerValue={total.toLocaleString("pt-BR")} centerLabel="rotas" size={132} />
      </div>
    </section>
  );
}
