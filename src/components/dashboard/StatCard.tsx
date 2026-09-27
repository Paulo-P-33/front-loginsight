import type { StatMetric } from "@/types/dashboard";

export function StatCard({ label, value, helperText, icon: Icon, iconClassName }: StatMetric) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-400">{helperText}</p>
      </div>
    </div>
  );
}
