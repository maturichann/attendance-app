"use client";

import { useEffect } from "react";
import { DayRecord, CATEGORIES, AttendanceCategory } from "@/lib/types";
import { calcWorkHours } from "@/lib/utils";
import QuickTimeButtons from "./QuickTimeButtons";
import { X, Clock, Coffee, MessageSquare, Save } from "lucide-react";

interface BottomSheetProps {
  record: DayRecord | null;
  onUpdate: (updated: Partial<DayRecord>) => void;
  onClose: () => void;
  onPunchNow: (type: "start" | "end") => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}

export default function BottomSheet({ record, onUpdate, onClose, onSave, saving, saved }: BottomSheetProps) {
  useEffect(() => {
    if (record) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [record]);

  if (!record) return null;

  const workHours = calcWorkHours(record.startTime, record.endTime, record.breakTime);
  const dayColor = record.isSunday
    ? "text-red-500"
    : record.isSaturday
    ? "text-indigo-500"
    : "text-gray-900";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="max-w-lg mx-auto bg-white rounded-t-[28px] shadow-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-2">
            <div className="flex items-center gap-3">
              <div className={`text-4xl font-bold ${dayColor}`}>
                {record.date}
              </div>
              <div>
                <span className={`text-base font-bold ${dayColor}`}>
                  {record.dayOfWeek}曜日
                </span>
                {record.isToday && (
                  <span className="ml-2 text-[10px] font-bold text-white bg-indigo-500 px-2 py-0.5 rounded-full">
                    TODAY
                  </span>
                )}
                {workHours && (
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                    勤務 {workHours}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 active:scale-90 transition"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-10 space-y-5 max-h-[65vh] overflow-y-auto stagger-children">
            {/* Category chips */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                区分
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onUpdate({ category: c.value as AttendanceCategory })}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-90 ${
                      record.category === c.value
                        ? "text-white shadow-lg"
                        : "bg-gray-50 text-gray-500 active:bg-gray-100"
                    }`}
                    style={
                      record.category === c.value
                        ? { backgroundColor: c.color, boxShadow: `0 4px 12px ${c.color}40` }
                        : undefined
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time inputs - big touch targets */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock size={12} /> 出勤
                </label>
                <input
                  type="time"
                  value={record.startTime}
                  onChange={(e) => onUpdate({ startTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock size={12} /> 退勤
                </label>
                <input
                  type="time"
                  value={record.endTime}
                  onChange={(e) => onUpdate({ endTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Coffee size={12} /> 休憩
                </label>
                <input
                  type="time"
                  value={record.breakTime}
                  onChange={(e) => onUpdate({ breakTime: e.target.value })}
                />
              </div>
            </div>

            {/* Quick presets */}
            <QuickTimeButtons
              onSelect={(start, end, breakTime) => onUpdate({ startTime: start, endTime: end, breakTime })}
            />

            {/* Note */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <MessageSquare size={12} /> 備考
              </label>
              <input
                type="text"
                value={record.note}
                onChange={(e) => onUpdate({ note: e.target.value })}
                placeholder="備考を入力..."
                className="w-full text-base px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              />
            </div>

            {/* Save button */}
            <button
              onClick={onSave}
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
      </div>
    </>
  );
}
