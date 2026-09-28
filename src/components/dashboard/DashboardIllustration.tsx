import { BarChart3, Upload } from "lucide-react";

export function DashboardIllustration() {
  return (
    <div className="relative hidden h-32 w-48 shrink-0 sm:block" aria-hidden="true">
      <div className="absolute right-2 top-2 h-24 w-40 rounded-xl bg-blue-100" />
      <div className="absolute right-6 top-0 flex h-24 w-40 flex-col justify-between rounded-xl border border-blue-200 bg-white p-3 shadow-sm">
        <BarChart3 className="h-6 w-10 text-blue-300" />
        <div className="h-1.5 w-full rounded-full bg-slate-100" />
        <div className="h-1.5 w-2/3 rounded-full bg-slate-100" />
      </div>
      <span className="absolute -bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg ring-4 ring-white">
        <Upload className="h-5 w-5" />
      </span>
    </div>
  );
}
