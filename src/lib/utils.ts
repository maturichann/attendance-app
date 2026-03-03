import { DayRecord, DAY_NAMES } from "./types";

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getDayOfWeek(year: number, month: number, date: number): string {
  const day = new Date(year, month - 1, date).getDay();
  return DAY_NAMES[day];
}

export function isWeekend(year: number, month: number, date: number): boolean {
  const day = new Date(year, month - 1, date).getDay();
  return day === 0 || day === 6;
}

export function isSaturday(year: number, month: number, date: number): boolean {
  return new Date(year, month - 1, date).getDay() === 6;
}

export function isSunday(year: number, month: number, date: number): boolean {
  return new Date(year, month - 1, date).getDay() === 0;
}

export function isToday(year: number, month: number, date: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === date
  );
}

export function generateMonthRecords(year: number, month: number): DayRecord[] {
  const days = getDaysInMonth(year, month);
  const records: DayRecord[] = [];

  for (let d = 1; d <= days; d++) {
    records.push({
      date: d,
      dayOfWeek: getDayOfWeek(year, month, d),
      category: "-",
      startTime: "",
      endTime: "",
      breakTime: "",
      note: "",
      isWeekend: isWeekend(year, month, d),
      isSaturday: isSaturday(year, month, d),
      isSunday: isSunday(year, month, d),
      isToday: isToday(year, month, d),
    });
  }

  return records;
}

export function calcWorkHours(start: string, end: string, breakTime: string): string {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let totalMinutes = eh * 60 + em - (sh * 60 + sm);
  // 日またぎ（夜勤）対応: 退勤が出勤より前なら+24h
  if (totalMinutes < 0) totalMinutes += 24 * 60;

  if (breakTime) {
    const [bh, bm] = breakTime.split(":").map(Number);
    totalMinutes -= bh * 60 + bm;
  }

  if (totalMinutes <= 0) return "";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}
