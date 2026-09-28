import { topFailureRoutes } from "@/lib/dashboard-data";

export function TopFailureRoutesCard() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Top 5 Rotas - Mais Insucessos</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-medium text-slate-400">
              <th scope="col" className="pb-2 pr-1.5 font-medium">
                #
              </th>
              <th scope="col" className="pb-2 pr-1.5 font-medium">
                Rota
              </th>
              <th scope="col" className="pb-2 pr-1.5 font-medium">
                Motorista
              </th>
              <th scope="col" className="pb-2 pr-1.5 text-right font-medium">
                Insuc.
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                % Insuc.
              </th>
            </tr>
          </thead>
          <tbody>
            {topFailureRoutes.map((route, index) => (
              <tr key={route.code} className="border-t border-slate-100">
                <td className="py-2 pr-1.5 text-slate-400">{index + 1}</td>
                <td className="py-2 pr-1.5 font-medium text-slate-700">{route.code}</td>
                <td className="max-w-[110px] truncate py-2 pr-1.5 text-slate-600" title={route.driver}>
                  {route.driver}
                </td>
                <td className="py-2 pr-1.5 text-right text-slate-600">{route.failures}</td>
                <td className="py-2 text-right">
                  <span className="inline-flex rounded-full bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-600">
                    {route.failureRate.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%
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
        Ver todas as rotas
      </button>
    </section>
  );
}
