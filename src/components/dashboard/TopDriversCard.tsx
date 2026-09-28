import { topDrivers } from "@/lib/dashboard-data";

export function TopDriversCard() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Top 5 Motoristas - Taxa de Entrega</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-medium text-slate-400">
              <th scope="col" className="pb-2 pr-1.5 font-medium">
                #
              </th>
              <th scope="col" className="pb-2 pr-1.5 font-medium">
                Motorista
              </th>
              <th scope="col" className="pb-2 pr-1.5 text-right font-medium">
                Rotas
              </th>
              <th scope="col" className="pb-2 pr-1.5 text-right font-medium">
                Paradas
              </th>
              <th scope="col" className="pb-2 pr-1.5 text-right font-medium">
                Entregas
              </th>
              <th scope="col" className="pb-2 pr-1.5 text-right font-medium">
                Insuc.
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                % Entrega
              </th>
            </tr>
          </thead>
          <tbody>
            {topDrivers.map((driver, index) => (
              <tr key={driver.name} className="border-t border-slate-100">
                <td className="py-2 pr-1.5 text-slate-400">{index + 1}</td>
                <td className="max-w-[100px] truncate py-2 pr-1.5 font-medium text-slate-700" title={driver.name}>
                  {driver.name}
                </td>
                <td className="py-2 pr-1.5 text-right text-slate-600">{driver.routes}</td>
                <td className="py-2 pr-1.5 text-right text-slate-600">{driver.stops}</td>
                <td className="py-2 pr-1.5 text-right text-slate-600">{driver.deliveries}</td>
                <td className="py-2 pr-1.5 text-right text-slate-600">{driver.failures}</td>
                <td className="py-2 text-right">
                  <span className="inline-flex rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                    {driver.rate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="mt-4 self-center text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        Ver todos os motoristas
      </button>
    </section>
  );
}
