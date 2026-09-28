export type VehicleType = "UTILITARIOS" | "VAN" | "VUC";

export interface RouteEntry {
  date: string; // ISO yyyy-mm-dd
  weekday: string; // Portuguese weekday label
  isSundayOrHoliday: boolean;
  holidayName: string | null;
  svc: string;
  city: string;
  plate: string;
  vehicleType: VehicleType;
  cycle: string;
  driverName: string;
  driverEmail: string;
  stops: number;
  deliveries: number;
  ds: number; // entregues / paradas, 0-1
  dayRate: number;
  stopsCharge: number;
  totalValue: number;
}

export interface PlateSummary {
  plate: string;
  vehicleType: VehicleType;
  driverName: string;
  driverEmail: string;
  routeCount: number;
  totalStops: number;
  totalDeliveries: number;
  ds: number; // total entregues / total paradas, 0-1
  totalValue: number;
}

export interface ReportBatch {
  id: string;
  fileName: string;
  importedAt: string; // ISO datetime
  routeCount: number;
  skippedRowCount: number;
  totalValue: number;
  plateSummaries: PlateSummary[];
  entries: RouteEntry[];
}
