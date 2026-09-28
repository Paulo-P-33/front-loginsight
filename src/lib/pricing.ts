import type { VehicleType } from "@/types/reports";

interface VehicleRate {
  weekdayToSaturday: number;
  sundayOrHoliday: number;
}

// Valores de referência informados pela operação. Ajuste aqui caso a tabela mude.
export const VEHICLE_RATES: Record<VehicleType, VehicleRate> = {
  UTILITARIOS: { weekdayToSaturday: 295, sundayOrHoliday: 429 },
  VAN: { weekdayToSaturday: 355, sundayOrHoliday: 429 },
  VUC: { weekdayToSaturday: 495, sundayOrHoliday: 595 },
};

export const STOP_RATE_WEEKDAY_TO_SATURDAY = 0.15;
export const STOP_RATE_SUNDAY_OR_HOLIDAY = 0.45;

export function getDayRate(vehicleType: VehicleType, isSundayOrHoliday: boolean): number {
  const rate = VEHICLE_RATES[vehicleType];
  return isSundayOrHoliday ? rate.sundayOrHoliday : rate.weekdayToSaturday;
}

export function getStopRate(isSundayOrHoliday: boolean): number {
  return isSundayOrHoliday ? STOP_RATE_SUNDAY_OR_HOLIDAY : STOP_RATE_WEEKDAY_TO_SATURDAY;
}

export function calculateRouteValue(
  vehicleType: VehicleType,
  isSundayOrHoliday: boolean,
  stops: number
): { dayRate: number; stopsCharge: number; totalValue: number } {
  const dayRate = getDayRate(vehicleType, isSundayOrHoliday);
  const stopsCharge = Number((stops * getStopRate(isSundayOrHoliday)).toFixed(2));
  return { dayRate, stopsCharge, totalValue: Number((dayRate + stopsCharge).toFixed(2)) };
}

export function normalizeVehicleType(raw: string): VehicleType | null {
  const upper = raw.toUpperCase();
  if (upper.includes("VUC")) return "VUC";
  if (upper.includes("VAN")) return "VAN";
  if (upper.includes("UTILIT")) return "UTILITARIOS";
  return null;
}
