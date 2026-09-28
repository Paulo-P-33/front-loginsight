import { recentAlerts } from "@/lib/dashboard-data";

export function AlertsCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-slate-900">Alertas recentes</h2>
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white">
          {recentAlerts.length}
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-3">
        {recentAlerts.map((alert) => (
          <li key={alert.title} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600"
              aria-hidden="true"
            >
              <alert.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
              <p className="text-sm text-slate-500">{alert.description}</p>
            </div>
            <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">{alert.timeAgo}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
