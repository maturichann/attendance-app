export type AttendanceCategory =
  | "-"
  | "欠勤"
  | "有給"
  | "振替・代替"
  | "特別休暇"
  | "休日出勤"
  | "遅刻・早退";

export interface DayRecord {
  date: number;
  dayOfWeek: string;
  category: AttendanceCategory;
  startTime: string;
  endTime: string;
  breakTime: string;
  note: string;
  isWeekend: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  isToday: boolean;
}

export const CATEGORIES: { value: AttendanceCategory; label: string; color: string }[] = [
  { value: "-", label: "通常", color: "#64748b" },
  { value: "欠勤", label: "欠勤", color: "#ef4444" },
  { value: "有給", label: "有給", color: "#10b981" },
  { value: "振替・代替", label: "振替・代替", color: "#8b5cf6" },
  { value: "特別休暇", label: "特別休暇", color: "#f59e0b" },
  { value: "休日出勤", label: "休日出勤", color: "#3b82f6" },
  { value: "遅刻・早退", label: "遅刻・早退", color: "#f97316" },
];

export const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];
