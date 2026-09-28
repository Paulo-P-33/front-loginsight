"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FileSpreadsheet } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ReportBatchList } from "@/components/reports/ReportBatchList";
import { PlateValueTable } from "@/components/reports/PlateValueTable";
import type { ReportBatch } from "@/types/reports";

function ReportsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [batches, setBatches] = useState<ReportBatch[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadBatches = useCallback(async () => {
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();

      if (!response.ok) {
        setLoadError(data.error ?? "Não foi possível carregar os relatórios.");
        setBatches([]);
        return;
      }

      setLoadError(null);
      const loaded = (data.batches as ReportBatch[]) ?? [];
      setBatches(loaded);

      const requestedId = searchParams.get("batch");
      if (requestedId && loaded.some((batch) => batch.id === requestedId)) {
        setSelectedId(requestedId);
      } else if (loaded.length > 0) {
        setSelectedId(loaded[0].id);
      }
    } catch {
      setLoadError("Falha de conexão ao carregar os relatórios.");
      setBatches([]);
    }
  }, [searchParams]);

  useEffect(() => {
    void loadBatches();
  }, [loadBatches]);

  async function handleDelete(id: string) {
    await fetch(`/api/reports?id=${id}`, { method: "DELETE" });
    const remaining = (batches ?? []).filter((batch) => batch.id !== id);
    setBatches(remaining);
    if (selectedId === id) {
      const nextId = remaining[0]?.id ?? null;
      setSelectedId(nextId);
      router.replace(nextId ? `/relatorios?batch=${nextId}` : "/relatorios");
    }
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    router.replace(`/relatorios?batch=${id}`);
  }

  const isLoading = batches === null;
  const selectedBatch = batches?.find((batch) => batch.id === selectedId) ?? null;

  return (
    <DashboardShell sidebarActive="Relatórios">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Relatórios de pagamento</h1>
          <p className="text-sm text-slate-500">Valor total a pagar por placa, calculado a partir das planilhas importadas.</p>
        </div>

        {isLoading && <p className="text-sm text-slate-400">Carregando...</p>}

        {loadError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{loadError}</p>
        )}

        {!isLoading && !loadError && batches.length === 0 && (
          <section className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400" aria-hidden="true">
              <FileSpreadsheet className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">Nenhum relatório importado</h2>
            <p className="max-w-md text-sm text-slate-500">
              Importe uma planilha de rotas na tela inicial para calcular os valores a pagar por placa.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Ir para o Início
            </Link>
          </section>
        )}

        {!isLoading && batches.length > 0 && selectedBatch && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
            <div className="min-w-0">
              <ReportBatchList
                batches={batches}
                selectedId={selectedBatch.id}
                onSelect={handleSelect}
                onDelete={handleDelete}
              />
            </div>
            <div className="min-w-0">
              <PlateValueTable batch={selectedBatch} />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={null}>
      <ReportsContent />
    </Suspense>
  );
}
