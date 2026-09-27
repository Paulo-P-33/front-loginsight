import { statMetrics } from "@/lib/dashboard-data";
import type { StatMetric } from "@/types/dashboard";
import { StatCard } from "./StatCard";

interface StatsGridProps {
  metrics?: StatMetric[];
}

export function StatsGrid({ metrics = statMetrics }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {metrics.map((metric) => (
        <StatCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}
