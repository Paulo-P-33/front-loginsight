import { deliveryStatusBreakdown } from "@/lib/dashboard-data";
import { DonutChart } from "./DonutChart";

export function DeliveryStatusCard() {
  const total = deliveryStatusBreakdown.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Status das Entregas</h2>
      <div className="mt-6">
        <DonutChart data={deliveryStatusBreakdown} centerValue={total.toLocaleString("pt-BR")} centerLabel="paradas" size={132} />
      </div>
    </section>
  );
}
