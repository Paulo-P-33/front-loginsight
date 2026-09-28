import { Trash2 } from "lucide-react";
import { formatCurrencyBRL, formatDateTimeBR } from "@/lib/format";
import type { ReportBatch } from "@/types/reports";

interface ReportBatchListProps {
  batches: ReportBatch[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReportBatchList({ batches, selectedId, onSelect, onDelete }: ReportBatchListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {batches.map((batch) => {
        const isSelected = batch.id === selectedId;
        return (
          <li key={batch.id}>
            <div
              className={`group flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                isSelected ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <button type="button" onClick={() => onSelect(batch.id)} className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-slate-900" title={batch.fileName}>
                  {batch.fileName}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatDateTimeBR(batch.importedAt)} · {batch.routeCount} rotas · {batch.plateSummaries.length} placas
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">{formatCurrencyBRL(batch.totalValue)}</p>
              </button>
              <button
                type="button"
                onClick={() => onDelete(batch.id)}
                aria-label={`Excluir relatório ${batch.fileName}`}
                className="shrink-0 rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
