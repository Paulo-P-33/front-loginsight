"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, FileSpreadsheet } from "lucide-react";
import { formatCurrencyBRL, formatDateTimeBR } from "@/lib/format";
import type { ReportBatch } from "@/types/reports";

export function RecentImportsPanel() {
  const [batches, setBatches] = useState<ReportBatch[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/reports")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setBatches((data.batches as ReportBatch[]) ?? []);
      })
      .catch(() => {
        if (!cancelled) setBatches([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = batches === null;
  const hasImports = !isLoading && batches.length > 0;

  return (
    <section className="flex h-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">Últimas importações</h2>

      {isLoading && <p className="mt-6 text-center text-sm text-slate-400">Carregando...</p>}

      {!isLoading && !hasImports && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400" aria-hidden="true">
            <Clock className="h-6 w-6" />
          </span>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">Nenhuma importação realizada</h3>
          <p className="text-sm text-slate-500">Seus relatórios importados aparecerão aqui.</p>
        </div>
      )}

      {hasImports && (
        <ul className="mt-2 flex flex-col gap-3">
          {batches.slice(0, 4).map((batch) => (
            <li key={batch.id}>
              <Link
                href={`/relatorios?batch=${batch.id}`}
                className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-500" aria-hidden="true">
                  <FileSpreadsheet className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900" title={batch.fileName}>
                    {batch.fileName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDateTimeBR(batch.importedAt)} · {batch.routeCount} rotas
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-700">{formatCurrencyBRL(batch.totalValue)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/relatorios"
        className="mt-4 self-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        Ver todas importações
      </Link>
    </section>
  );
}
