"use client";

import { useState, useCallback } from "react";
import { DayRecord } from "@/lib/types";
import { generateMonthRecords } from "@/lib/utils";
import CalendarGrid from "@/components/CalendarGrid";
import BottomSheet from "@/components/BottomSheet";
import Summary from "@/components/Summary";
import PunchCard from "@/components/PunchCard";
import { Save, BarChart3, CalendarDays } from "lucide-react";

type ViewMode = "calendar" | "summary";

export default function AttendancePage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [records, setRecords] = useState<DayRecord[]>(() =>
    generateMonthRecords(now.getFullYear(), now.getMonth() + 1)
  );
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  const todayRecord = isCurrentMonth
    ? records.find((r) => r.isToday) ?? null
    : null;

  const changeMonth = useCallback(
    (delta: number) => {
      let newMonth = month + delta;
      let newYear = year;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
      setYear(newYear);
      setMonth(newMonth);
      setRecords(generateMonthRecords(newYear, newMonth));
      setSelectedDate(null);
    },
    [year, month]
  );

  const updateRecord = useCallback((date: number, updated: Partial<DayRecord>) => {
    setRecords((prev) =>
      prev.map((r) => (r.date === date ? { ...r, ...updated } : r))
    );
  }, []);

  const handlePunchNow = useCallback(
    (type: "start" | "end") => {
      const target = selectedDate ?? todayRecord?.date;
      if (!target) return;
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      updateRecord(target, type === "start" ? { startTime: time } : { endTime: time });
    },
    [selectedDate, todayRecord, updateRecord]
  );

  const handleSave = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }, []);

  const selectedRecord = selectedDate
    ? records.find((r) => r.date === selectedDate) ?? null
    : null;

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-950 text-white">
        <div className="max-w-lg mx-auto px-5 py-2.5">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold tracking-tight">勤怠管理</h1>
            <div className="flex items-center gap-0.5 bg-white/10 rounded-full p-0.5">
              <button
                onClick={() => setViewMode("calendar")}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  viewMode === "calendar" ? "bg-white text-slate-800 shadow-sm" : "text-white/50"
                }`}
              >
                <CalendarDays size={14} />
              </button>
              <button
                onClick={() => setViewMode("summary")}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  viewMode === "summary" ? "bg-white text-slate-800 shadow-sm" : "text-white/50"
                }`}
              >
                <BarChart3 size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content area - flex-1 to fill remaining space */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full min-h-0">
        {/* Punch card */}
        {isCurrentMonth && (
          <div className="shrink-0">
            <PunchCard todayRecord={todayRecord} onPunch={handlePunchNow} />
          </div>
        )}

        {viewMode === "summary" ? (
          <div className="flex-1 overflow-y-auto mt-2">
            <Summary records={records} />
          </div>
        ) : (
          /* Calendar fills remaining space */
          <div className="flex-1 flex flex-col min-h-0">
            <CalendarGrid
              year={year}
              month={month}
              records={records}
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              onPrevMonth={() => changeMonth(-1)}
              onNextMonth={() => changeMonth(1)}
            />
          </div>
        )}

        {/* Save button - fixed at bottom */}
        <div className="shrink-0 px-4 pb-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm shadow-lg active:scale-[0.97] transition-all duration-300 disabled:opacity-60 ${
              saved
                ? "bg-emerald-500 text-white shadow-emerald-500/30"
                : "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-500/30"
            }`}
          >
            {saved ? (
              <>
                <span className="animate-check-pop">&#10003;</span>
                保存しました
              </>
            ) : (
              <>
                <Save size={16} />
                {saving ? "保存中..." : "保存する"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <BottomSheet
        record={selectedRecord}
        onUpdate={(updated) => selectedDate && updateRecord(selectedDate, updated)}
        onClose={() => setSelectedDate(null)}
        onPunchNow={handlePunchNow}
      />
    </div>
  );
}
