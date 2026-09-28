import { quickActions } from "@/lib/dashboard-data";

export function QuickActionsCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Ações rápidas</h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center hover:border-slate-300 hover:bg-slate-50"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full ${action.iconClassName}`}
              aria-hidden="true"
            >
              <action.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-slate-700">{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
