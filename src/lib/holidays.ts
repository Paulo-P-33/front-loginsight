const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function getNationalHolidays(year: number): Map<string, string> {
  const easter = getEasterSunday(year);
  const holidays = new Map<string, string>();

  holidays.set(toIsoDate(new Date(Date.UTC(year, 0, 1))), "Confraternização Universal");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 3, 21))), "Tiradentes");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 4, 1))), "Dia do Trabalho");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 8, 7))), "Independência do Brasil");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 9, 12))), "Nossa Senhora Aparecida");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 10, 2))), "Finados");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 10, 15))), "Proclamação da República");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 10, 20))), "Dia da Consciência Negra");
  holidays.set(toIsoDate(new Date(Date.UTC(year, 11, 25))), "Natal");

  holidays.set(toIsoDate(addDays(easter, -47)), "Carnaval");
  holidays.set(toIsoDate(addDays(easter, -2)), "Sexta-feira Santa");
  holidays.set(toIsoDate(easter), "Páscoa");
  holidays.set(toIsoDate(addDays(easter, 60)), "Corpus Christi");

  return holidays;
}

const holidayCache = new Map<number, Map<string, string>>();

function getHolidaysForYear(year: number): Map<string, string> {
  const cached = holidayCache.get(year);
  if (cached) return cached;
  const holidays = getNationalHolidays(year);
  holidayCache.set(year, holidays);
  return holidays;
}

export interface DayInfo {
  weekday: string;
  isSunday: boolean;
  isHoliday: boolean;
  holidayName: string | null;
  isSundayOrHoliday: boolean;
}

export function getDayInfo(isoDate: string): DayInfo {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = date.getUTCDay();
  const holidayName = getHolidaysForYear(year).get(isoDate) ?? null;
  const isSunday = dayOfWeek === 0;

  return {
    weekday: WEEKDAY_LABELS[dayOfWeek],
    isSunday,
    isHoliday: holidayName !== null,
    holidayName,
    isSundayOrHoliday: isSunday || holidayName !== null,
  };
}
