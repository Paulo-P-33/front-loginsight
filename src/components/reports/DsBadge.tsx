import { getDsTier } from "@/lib/ds";
import { formatPercentBR } from "@/lib/format";

const TIER_CLASSNAMES: Record<ReturnType<typeof getDsTier>, string> = {
  below: "bg-rose-50 text-rose-600",
  target: "bg-emerald-50 text-emerald-600",
  normal: "bg-slate-100 text-slate-600",
};

const TIER_TITLES: Record<ReturnType<typeof getDsTier>, string> = {
  below: "Abaixo de 95% — atenção",
  target: "Meta de 98,5% atingida",
  normal: "Dentro do esperado",
};

interface DsBadgeProps {
  ds: number;
}

export function DsBadge({ ds }: DsBadgeProps) {
  const tier = getDsTier(ds);

  return (
    <span
      title={TIER_TITLES[tier]}
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_CLASSNAMES[tier]}`}
    >
      {formatPercentBR(ds)}
    </span>
  );
}
