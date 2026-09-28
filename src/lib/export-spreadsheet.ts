import * as XLSX from "xlsx";
import { formatDateBR, formatPercentBR } from "./format";
import type { ReportBatch, RouteEntry, VehicleType } from "@/types/reports";

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  UTILITARIOS: "Utilitário",
  VAN: "Van",
  VUC: "VUC",
};

const CURRENCY_FORMAT = '"R$" #,##0.00';
const PERCENT_FORMAT = "0.00%";

function safeFileBaseName(batch: ReportBatch): string {
  return `relatorio-pagamento-${batch.fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-")}`;
}

function sortedEntries(batch: ReportBatch): RouteEntry[] {
  return [...batch.entries].sort((a, b) => a.plate.localeCompare(b.plate) || a.date.localeCompare(b.date));
}

function applyNumberFormat(sheet: XLSX.WorkSheet, columnIndexes: number[], rowCount: number, format: string) {
  for (let row = 1; row <= rowCount; row++) {
    for (const col of columnIndexes) {
      const address = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = sheet[address];
      if (cell && typeof cell.v === "number") {
        cell.z = format;
      }
    }
  }
}

function buildSummarySheet(batch: ReportBatch): XLSX.WorkSheet {
  const header = [
    "Placa",
    "Motorista",
    "Email",
    "Tipo de Veículo",
    "Qtd. Rotas",
    "Total de Paradas",
    "DS",
    "Valor Total (R$)",
  ];
  const rows: (string | number)[][] = batch.plateSummaries.map((plate) => [
    plate.plate,
    plate.driverName || "—",
    plate.driverEmail || "—",
    VEHICLE_TYPE_LABELS[plate.vehicleType],
    plate.routeCount,
    plate.totalStops,
    plate.ds,
    plate.totalValue,
  ]);
  rows.push(["", "", "", "", "", "", "Total geral", batch.totalValue]);

  const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  applyNumberFormat(sheet, [6], rows.length, PERCENT_FORMAT);
  applyNumberFormat(sheet, [7], rows.length, CURRENCY_FORMAT);
  sheet["!cols"] = [
    { wch: 14 },
    { wch: 26 },
    { wch: 28 },
    { wch: 16 },
    { wch: 12 },
    { wch: 16 },
    { wch: 10 },
    { wch: 16 },
  ];
  return sheet;
}

function buildDetailSheet(batch: ReportBatch): XLSX.WorkSheet {
  const header = [
    "Placa",
    "Motorista",
    "Email",
    "Tipo de Veículo",
    "SVC",
    "Cidade",
    "Data",
    "Dia da Semana",
    "Feriado",
    "Ciclo",
    "Paradas",
    "DS",
    "Diária (R$)",
    "Paradas (R$)",
    "Valor Total (R$)",
  ];

  const rows = sortedEntries(batch).map((entry) => [
    entry.plate,
    entry.driverName || "—",
    entry.driverEmail || "—",
    VEHICLE_TYPE_LABELS[entry.vehicleType],
    entry.svc,
    entry.city,
    formatDateBR(entry.date),
    entry.weekday,
    entry.holidayName ?? "",
    entry.cycle,
    entry.stops,
    entry.ds,
    entry.dayRate,
    entry.stopsCharge,
    entry.totalValue,
  ]);

  const sheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
  applyNumberFormat(sheet, [11], rows.length, PERCENT_FORMAT);
  applyNumberFormat(sheet, [12, 13, 14], rows.length, CURRENCY_FORMAT);
  sheet["!cols"] = [
    { wch: 12 },
    { wch: 26 },
    { wch: 28 },
    { wch: 14 },
    { wch: 8 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 24 },
    { wch: 8 },
    { wch: 9 },
    { wch: 9 },
    { wch: 12 },
    { wch: 13 },
    { wch: 14 },
  ];
  return sheet;
}

export function exportReportBatchToXlsx(batch: ReportBatch): void {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildSummarySheet(batch), "Resumo por Placa");
  XLSX.utils.book_append_sheet(workbook, buildDetailSheet(batch), "Detalhamento");
  XLSX.writeFile(workbook, `${safeFileBaseName(batch)}.xlsx`);
}

function toCsvField(value: string | number): string {
  const text = String(value);
  return /[;"\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function formatCsvNumber(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportBatchToCsv(batch: ReportBatch): void {
  const header = [
    "Placa",
    "Motorista",
    "Email",
    "Tipo de Veículo",
    "SVC",
    "Cidade",
    "Data",
    "Dia da Semana",
    "Feriado",
    "Ciclo",
    "Paradas",
    "DS",
    "Diária (R$)",
    "Paradas (R$)",
    "Valor Total (R$)",
  ];

  const rows = sortedEntries(batch).map((entry) => [
    entry.plate,
    entry.driverName || "—",
    entry.driverEmail || "—",
    VEHICLE_TYPE_LABELS[entry.vehicleType],
    entry.svc,
    entry.city,
    formatDateBR(entry.date),
    entry.weekday,
    entry.holidayName ?? "",
    entry.cycle,
    String(entry.stops),
    formatPercentBR(entry.ds),
    formatCsvNumber(entry.dayRate),
    formatCsvNumber(entry.stopsCharge),
    formatCsvNumber(entry.totalValue),
  ]);

  const lines = [header, ...rows].map((row) => row.map(toCsvField).join(";"));
  // BOM so Excel opens the UTF-8 file with accented characters intact.
  const csvContent = "\uFEFF" + lines.join("\r\n");

  downloadTextFile(csvContent, `${safeFileBaseName(batch)}.csv`, "text/csv;charset=utf-8;");
}
