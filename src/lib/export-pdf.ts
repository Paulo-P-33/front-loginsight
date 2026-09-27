import { jsPDF } from "jspdf";
import autoTable, { type CellHookData } from "jspdf-autotable";
import { getDsTier } from "./ds";
import { formatCurrencyBRL, formatDateBR, formatDateTimeBR, formatPercentBR } from "./format";
import type { ReportBatch, VehicleType } from "@/types/reports";

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  UTILITARIOS: "Utilitário",
  VAN: "Van",
  VUC: "VUC",
};

const PAGE_MARGIN = 14;
const PAGE_BOTTOM_LIMIT = 275;
const DS_COLUMN_INDEX = 6;

const DS_TIER_COLORS: Record<ReturnType<typeof getDsTier>, [number, number, number]> = {
  below: [225, 29, 72],
  target: [5, 150, 105],
  normal: [71, 85, 105],
};

function getFinalY(doc: jsPDF): number {
  const docWithTable = doc as unknown as { lastAutoTable?: { finalY?: number } };
  return docWithTable.lastAutoTable?.finalY ?? PAGE_MARGIN;
}

function styleDsCell(data: CellHookData): void {
  if (data.column.index !== DS_COLUMN_INDEX || data.cell.section !== "body") return;

  const ds = Number(data.cell.raw);
  if (!Number.isFinite(ds)) return;

  data.cell.text = [formatPercentBR(ds)];
  data.cell.styles.textColor = DS_TIER_COLORS[getDsTier(ds)];
  data.cell.styles.fontStyle = "bold";
}

export function exportReportBatchToPdf(batch: ReportBatch): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  doc.setFontSize(16);
  doc.text("Relatório de Pagamento por Placa", PAGE_MARGIN, 18);

  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(`Arquivo: ${batch.fileName}`, PAGE_MARGIN, 25);
  doc.text(`Importado em: ${formatDateTimeBR(batch.importedAt)}`, PAGE_MARGIN, 30);
  doc.text(`Gerado em: ${formatDateTimeBR(new Date().toISOString())}`, PAGE_MARGIN, 35);
  doc.setTextColor(20);
  doc.setFontSize(11);
  doc.text(`Total geral a pagar: ${formatCurrencyBRL(batch.totalValue)}`, PAGE_MARGIN, 42);

  autoTable(doc, {
    startY: 47,
    margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    head: [["Placa", "Motorista", "Email", "Tipo", "Rotas", "Paradas", "DS", "Valor total"]],
    body: batch.plateSummaries.map((plate) => [
      plate.plate,
      plate.driverName || "—",
      plate.driverEmail || "—",
      VEHICLE_TYPE_LABELS[plate.vehicleType],
      String(plate.routeCount),
      String(plate.totalStops),
      plate.ds,
      formatCurrencyBRL(plate.totalValue),
    ]),
    didParseCell: styleDsCell,
  });

  let cursorY = getFinalY(doc) + 12;

  for (const plate of batch.plateSummaries) {
    const entries = batch.entries
      .filter((entry) => entry.plate === plate.plate)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (cursorY > PAGE_BOTTOM_LIMIT) {
      doc.addPage();
      cursorY = 20;
    }

    doc.setFontSize(11);
    doc.setTextColor(20);
    let driverInfo = "";
    if (plate.driverName) {
      driverInfo = plate.driverEmail ? ` — ${plate.driverName} (${plate.driverEmail})` : ` — ${plate.driverName}`;
    }
    doc.text(
      `${plate.plate} — ${VEHICLE_TYPE_LABELS[plate.vehicleType]}${driverInfo} — Total: ${formatCurrencyBRL(plate.totalValue)}`,
      PAGE_MARGIN,
      cursorY
    );
    cursorY += 4;

    autoTable(doc, {
      startY: cursorY,
      margin: { left: PAGE_MARGIN, right: PAGE_MARGIN },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [100, 116, 139] },
      head: [["Data", "Dia", "Ciclo", "Paradas", "DS", "Diária", "Paradas (R$)", "Total"]],
      body: entries.map((entry) => [
        formatDateBR(entry.date),
        entry.holidayName ? `${entry.weekday} (${entry.holidayName})` : entry.weekday,
        entry.cycle || "—",
        String(entry.stops),
        entry.ds,
        formatCurrencyBRL(entry.dayRate),
        formatCurrencyBRL(entry.stopsCharge),
        formatCurrencyBRL(entry.totalValue),
      ]),
      didParseCell: styleDsCell,
    });

    cursorY = getFinalY(doc) + 12;
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Página ${page} de ${pageCount}`, PAGE_MARGIN, 290);
  }

  const safeFileName = batch.fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-");
  doc.save(`relatorio-pagamento-${safeFileName}.pdf`);
}
