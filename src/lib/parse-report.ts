import * as XLSX from "xlsx";
import { calculateDs } from "./ds";
import { getDayInfo } from "./holidays";
import { calculateRouteValue, normalizeVehicleType } from "./pricing";
import type { PlateSummary, RouteEntry } from "@/types/reports";

interface ColumnMap {
  date: number;
  svc: number;
  city: number;
  plate: number;
  vehicleType: number;
  cycle: number;
  stops: number;
  deliveries: number;
  failures: number;
  driverName?: number;
  driverEmail?: number;
}

// Layout observado no relatório padrão quando a planilha não traz uma linha de
// cabeçalho reconhecível: A=seq, B=Data, C=SVC, D=Cidade, E/F=IDs internos,
// G=Placa, H=Tipo de veículo, I=Ciclo, J/K=horários, L=Paradas planejadas,
// N=Paradas realizadas (colunas N, O e U trazem o mesmo valor nesse layout),
// P=Entregas realizadas, R=Insucessos (não entregues).
const FALLBACK_COLUMNS: ColumnMap = {
  date: 1,
  svc: 2,
  city: 3,
  plate: 6,
  vehicleType: 7,
  cycle: 8,
  stops: 13,
  deliveries: 15,
  failures: 17,
};

function normalizeHeaderText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function detectColumns(rows: unknown[][]): { headerRowIndex: number; columns: ColumnMap } | null {
  const rowsToScan = Math.min(rows.length, 5);

  for (let i = 0; i < rowsToScan; i++) {
    const row = rows[i];
    if (!row) continue;

    const normalized = row.map(normalizeHeaderText);
    const plateIdx = normalized.findIndex((cell) => cell.includes("placa"));
    const dateIdx = normalized.findIndex((cell) => cell.includes("data"));
    const vehicleIdx = normalized.findIndex((cell) => cell.includes("veic") || cell.includes("tipo"));

    if (plateIdx === -1 || dateIdx === -1 || vehicleIdx === -1) continue;

    // "Despachados" é o total que baliza o DS (ver Insuc./Entr. abaixo); só cai para
    // "Paradas" (planejadas) quando a planilha não tiver uma coluna de despachados.
    const despachadosIdx = normalized.findIndex((cell) => cell.includes("despach"));
    const stopsRealizedIdx = normalized.findIndex((cell) => cell.includes("parada") && cell.includes("realiz"));
    const stopsGenericIdx = normalized.findIndex((cell) => cell.includes("parada"));
    const stopsIdx =
      despachadosIdx !== -1 ? despachadosIdx : stopsRealizedIdx !== -1 ? stopsRealizedIdx : stopsGenericIdx;

    const deliveriesFullIdx = normalized.findIndex(
      (cell) => cell.includes("entreg") && !cell.includes("nao") && !cell.includes("não")
    );
    // "Entr." é a forma abreviada usada em alguns relatórios.
    const deliveriesAbbrevIdx = normalized.findIndex(
      (cell) => cell.includes("entr") && !cell.includes("nao") && !cell.includes("não")
    );
    const deliveriesIdx = deliveriesFullIdx !== -1 ? deliveriesFullIdx : deliveriesAbbrevIdx;

    const failuresFullIdx = normalized.findIndex(
      (cell) => cell.includes("insucesso") || cell.includes("nao entreg") || cell.includes("não entreg")
    );
    // "Insuc." é a forma abreviada usada em alguns relatórios.
    const failuresAbbrevIdx = normalized.findIndex((cell) => cell.includes("insuc"));
    const failuresIdx = failuresFullIdx !== -1 ? failuresFullIdx : failuresAbbrevIdx;

    const svcIdx = normalized.findIndex((cell) => cell.includes("svc"));
    const cityIdx = normalized.findIndex((cell) => cell.includes("cidade") || cell.includes("local"));
    const cycleIdx = normalized.findIndex((cell) => cell.includes("ciclo") || cell.includes("turno"));
    const driverNameFullIdx = normalized.findIndex((cell) => cell.includes("motorista"));
    // Evita casar com colunas de identificador como "ID Driver".
    const driverNameFallbackIdx = normalized.findIndex((cell) => cell.includes("driver") && !cell.includes("id"));
    const driverNameIdx = driverNameFullIdx !== -1 ? driverNameFullIdx : driverNameFallbackIdx;
    const driverEmailIdx = normalized.findIndex((cell) => cell.includes("email") || cell.includes("e-mail"));

    return {
      headerRowIndex: i,
      columns: {
        date: dateIdx,
        plate: plateIdx,
        vehicleType: vehicleIdx,
        stops: stopsIdx !== -1 ? stopsIdx : FALLBACK_COLUMNS.stops,
        deliveries: deliveriesIdx !== -1 ? deliveriesIdx : FALLBACK_COLUMNS.deliveries,
        failures: failuresIdx !== -1 ? failuresIdx : FALLBACK_COLUMNS.failures,
        svc: svcIdx !== -1 ? svcIdx : FALLBACK_COLUMNS.svc,
        city: cityIdx !== -1 ? cityIdx : FALLBACK_COLUMNS.city,
        cycle: cycleIdx !== -1 ? cycleIdx : FALLBACK_COLUMNS.cycle,
        driverName: driverNameIdx !== -1 ? driverNameIdx : undefined,
        driverEmail: driverEmailIdx !== -1 ? driverEmailIdx : undefined,
      },
    };
  }

  return null;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.trim().replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseDateCell(value: unknown, fallbackYear: number): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getUTCFullYear()}-${pad2(value.getUTCMonth() + 1)}-${pad2(value.getUTCDate())}`;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const excelEpoch = Date.UTC(1899, 11, 30);
    const date = new Date(excelEpoch + value * 86_400_000);
    return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
  }

  if (typeof value === "string") {
    const match = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/.exec(value.trim());
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    let year = match[3] ? Number(match[3]) : fallbackYear;
    if (match[3] && match[3].length === 2) year += 2000;

    if (day < 1 || day > 31 || month < 1 || month > 12) return null;
    return `${year}-${pad2(month)}-${pad2(day)}`;
  }

  return null;
}

export interface ParseResult {
  entries: RouteEntry[];
  skippedRowCount: number;
}

export function parseRouteReport(buffer: Buffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: "" });

  const detected = detectColumns(rows);
  const columns = detected?.columns ?? FALLBACK_COLUMNS;
  const dataStartIndex = detected ? detected.headerRowIndex + 1 : 0;
  const fallbackYear = new Date().getFullYear();

  const entries: RouteEntry[] = [];
  let skippedRowCount = 0;

  for (let i = dataStartIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((cell) => cell === "" || cell == null)) continue;

    const isoDate = parseDateCell(row[columns.date], fallbackYear);
    const plate = String(row[columns.plate] ?? "").trim().toUpperCase();
    const vehicleType = normalizeVehicleType(String(row[columns.vehicleType] ?? ""));
    const stops = toNumber(row[columns.stops]);

    if (!isoDate || !plate || !vehicleType || stops === null) {
      skippedRowCount += 1;
      continue;
    }

    // Entregas com sucesso = paradas - insucessos, que é como o DS deve ser
    // calculado. Só recorre à coluna "Entregas" quando a planilha não traz uma
    // coluna de insucessos identificável.
    const failuresRaw = toNumber(row[columns.failures]);
    const deliveries =
      failuresRaw !== null ? Math.max(0, stops - failuresRaw) : toNumber(row[columns.deliveries]) ?? 0;
    const dayInfo = getDayInfo(isoDate);
    const { dayRate, stopsCharge, totalValue } = calculateRouteValue(vehicleType, dayInfo.isSundayOrHoliday, stops);
    const driverName = columns.driverName !== undefined ? String(row[columns.driverName] ?? "").trim() : "";
    const driverEmail = columns.driverEmail !== undefined ? String(row[columns.driverEmail] ?? "").trim() : "";

    entries.push({
      date: isoDate,
      weekday: dayInfo.weekday,
      isSundayOrHoliday: dayInfo.isSundayOrHoliday,
      holidayName: dayInfo.holidayName,
      svc: String(row[columns.svc] ?? "").trim(),
      city: String(row[columns.city] ?? "").trim(),
      plate,
      vehicleType,
      cycle: String(row[columns.cycle] ?? "").trim(),
      driverName,
      driverEmail,
      stops,
      deliveries,
      ds: calculateDs(deliveries, stops),
      dayRate,
      stopsCharge,
      totalValue,
    });
  }

  return { entries, skippedRowCount };
}

export function summarizeByPlate(entries: RouteEntry[]): PlateSummary[] {
  const summaries = new Map<string, PlateSummary>();

  for (const entry of entries) {
    const existing = summaries.get(entry.plate);
    if (existing) {
      existing.routeCount += 1;
      existing.totalStops += entry.stops;
      existing.totalDeliveries += entry.deliveries;
      existing.totalValue = Number((existing.totalValue + entry.totalValue).toFixed(2));
    } else {
      summaries.set(entry.plate, {
        plate: entry.plate,
        vehicleType: entry.vehicleType,
        driverName: entry.driverName,
        driverEmail: entry.driverEmail,
        routeCount: 1,
        totalStops: entry.stops,
        totalDeliveries: entry.deliveries,
        ds: 0,
        totalValue: entry.totalValue,
      });
    }
  }

  const results = [...summaries.values()];
  for (const summary of results) {
    summary.ds = calculateDs(summary.totalDeliveries, summary.totalStops);
  }

  return results.sort((a, b) => b.totalValue - a.totalValue);
}
