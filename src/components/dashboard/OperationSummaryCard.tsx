import { operationSummary } from "@/lib/dashboard-data";

export function OperationSummaryCard() {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Resumo da Operação</h2>

      <dl className="mt-4 flex flex-1 flex-col justify-center gap-4">
        {operationSummary.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <dt className="text-sm text-slate-500">{item.label}</dt>
            <dd>
              {item.badge ? (
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-emerald-600">
                  {item.value}
                </span>
              ) : (
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
