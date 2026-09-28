"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, FileDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Popover } from "@/components/ui/Popover";
import { formatCurrencyBRL, formatDateBR } from "@/lib/format";
import { exportReportBatchToPdf } from "@/lib/export-pdf";
import { exportReportBatchToCsv, exportReportBatchToXlsx } from "@/lib/export-spreadsheet";
import { DsBadge } from "./DsBadge";
import type { ReportBatch, VehicleType } from "@/types/reports";

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  UTILITARIOS: "Utilitário",
  VAN: "Van",
  VUC: "VUC",
};

type ExportFormat = "pdf" | "xlsx" | "csv";

const EXPORT_OPTIONS: { format: ExportFormat; label: string; description: string; icon: typeof FileText }[] = [
  { format: "pdf", label: "PDF", description: "Documento para impressão", icon: FileText },
  { format: "xlsx", label: "Excel (.xlsx)", description: "Resumo + detalhamento em planilha", icon: FileSpreadsheet },
  { format: "csv", label: "CSV (.csv)", description: "Detalhamento por rota", icon: FileSpreadsheet },
];

interface PlateValueTableProps {
  batch: ReportBatch;
}

export function PlateValueTable({ batch }: PlateValueTableProps) {
  const [expandedPlate, setExpandedPlate] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  function handleExport(format: ExportFormat) {
    setIsExporting(true);
    window.setTimeout(() => {
      try {
        if (format === "pdf") exportReportBatchToPdf(batch);
        else if (format === "xlsx") exportReportBatchToXlsx(batch);
        else exportReportBatchToCsv(batch);
      } finally {
        setIsExporting(false);
      }
    }, 0);
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Valor a pagar por placa</h2>
          <p className="text-sm text-slate-500" title={batch.fileName}>
            {batch.fileName}
            {batch.skippedRowCount > 0 && ` · ${batch.skippedRowCount} linhas ignoradas`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-lg font-semibold text-slate-900">{formatCurrencyBRL(batch.totalValue)}</p>
          <Popover
            align="right"
            panelClassName="w-64 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            trigger={({ open, toggle }) => (
              <button
                type="button"
                onClick={toggle}
                disabled={isExporting}
                aria-haspopup="true"
                aria-expanded={open}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <FileDown className="h-4 w-4" aria-hidden="true" />
                )}
                Exportar
              </button>
            )}
          >
            {({ close }) => (
              <ul role="menu" aria-label="Formatos de exportação">
                {EXPORT_OPTIONS.map((option) => (
                  <li key={option.format} role="none">
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        handleExport(option.format);
                        close();
                      }}
                      className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-slate-50"
                    >
                      <option.icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-medium text-slate-700">{option.label}</span>
                        <span className="block text-xs text-slate-400">{option.description}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Popover>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs font-medium text-slate-400">
              <th scope="col" className="w-8 pb-2" />
              <th scope="col" className="pb-2 pr-2 font-medium">
                Placa
              </th>
              <th scope="col" className="pb-2 pr-2 font-medium">
                Motorista
              </th>
              <th scope="col" className="pb-2 pr-2 font-medium">
                Email
              </th>
              <th scope="col" className="pb-2 pr-2 font-medium">
                Tipo
              </th>
              <th scope="col" className="pb-2 pr-2 text-right font-medium">
                Rotas
              </th>
              <th scope="col" className="pb-2 pr-2 text-right font-medium">
                Paradas
              </th>
              <th scope="col" className="pb-2 pr-2 text-right font-medium">
                DS
              </th>
              <th scope="col" className="pb-2 text-right font-medium">
                Valor total
              </th>
            </tr>
          </thead>
          <tbody>
            {batch.plateSummaries.map((plate) => {
              const isExpanded = expandedPlate === plate.plate;
              const entries = batch.entries
                .filter((entry) => entry.plate === plate.plate)
                .sort((a, b) => a.date.localeCompare(b.date));

              return (
                <Fragment key={plate.plate}>
                  <tr className="border-t border-slate-100">
                    <td className="py-2.5">
                      <button
                        type="button"
                        onClick={() => setExpandedPlate(isExpanded ? null : plate.plate)}
                        aria-label={isExpanded ? "Recolher detalhes" : "Ver detalhes das rotas"}
                        aria-expanded={isExpanded}
                        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </td>
                    <td className="py-2.5 pr-2 font-medium text-slate-900">{plate.plate}</td>
                    <td className="py-2.5 pr-2 text-slate-600">{plate.driverName || "—"}</td>
                    <td className="py-2.5 pr-2 text-slate-600">{plate.driverEmail || "—"}</td>
                    <td className="py-2.5 pr-2 text-slate-600">{VEHICLE_TYPE_LABELS[plate.vehicleType]}</td>
                    <td className="py-2.5 pr-2 text-right text-slate-600">{plate.routeCount}</td>
                    <td className="py-2.5 pr-2 text-right text-slate-600">{plate.totalStops}</td>
                    <td className="py-2.5 pr-2 text-right">
                      <DsBadge ds={plate.ds} />
                    </td>
                    <td className="py-2.5 text-right font-semibold text-slate-900">
                      {formatCurrencyBRL(plate.totalValue)}
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="border-t border-slate-100 bg-slate-50">
                      <td colSpan={9} className="p-3">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="text-slate-400">
                              <th scope="col" className="pb-1.5 pr-2 font-medium">
                                Data
                              </th>
                              <th scope="col" className="pb-1.5 pr-2 font-medium">
                                Dia
                              </th>
                              <th scope="col" className="pb-1.5 pr-2 font-medium">
                                Ciclo
                              </th>
                              <th scope="col" className="pb-1.5 pr-2 text-right font-medium">
                                Paradas
                              </th>
                              <th scope="col" className="pb-1.5 pr-2 text-right font-medium">
                                DS
                              </th>
                              <th scope="col" className="pb-1.5 pr-2 text-right font-medium">
                                Diária
                              </th>
                              <th scope="col" className="pb-1.5 pr-2 text-right font-medium">
                                Paradas (R$)
                              </th>
                              <th scope="col" className="pb-1.5 text-right font-medium">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map((entry, index) => (
                              <tr key={`${entry.date}-${entry.cycle}-${index}`} className="border-t border-slate-200">
                                <td className="py-1.5 pr-2 text-slate-700">{formatDateBR(entry.date)}</td>
                                <td className="py-1.5 pr-2 text-slate-600">
                                  {entry.weekday}
                                  {entry.holidayName && (
                                    <span className="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                                      {entry.holidayName}
                                    </span>
                                  )}
                                </td>
                                <td className="py-1.5 pr-2 text-slate-600">{entry.cycle || "—"}</td>
                                <td className="py-1.5 pr-2 text-right text-slate-600">{entry.stops}</td>
                                <td className="py-1.5 pr-2 text-right">
                                  <DsBadge ds={entry.ds} />
                                </td>
                                <td className="py-1.5 pr-2 text-right text-slate-600">{formatCurrencyBRL(entry.dayRate)}</td>
                                <td className="py-1.5 pr-2 text-right text-slate-600">{formatCurrencyBRL(entry.stopsCharge)}</td>
                                <td className="py-1.5 text-right font-semibold text-slate-800">
                                  {formatCurrencyBRL(entry.totalValue)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
