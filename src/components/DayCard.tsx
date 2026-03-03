"use client";

import { DayRecord, CATEGORIES, AttendanceCategory } from "@/lib/types";
import { calcWorkHours } from "@/lib/utils";
import QuickTimeButtons from "./QuickTimeButtons";
import { Clock, MessageSquare, ChevronDown } from "lucide-react";
import { useState } from "react";

interface DayCardProps {
  record: DayRecord;
  onUpdate: (updated: Partial<DayRecord>) => void;
}

export default function DayCard({ record, onUpdate }: DayCardProps) {
  const [expanded, setExpanded] = useState(false);
  const workHours = calcWorkHours(record.startTime, record.endTime, record.breakTime);

  const dayColor = record.isSunday
    ? "text-sunday"
    : record.isSaturday
    ? "text-saturday"
    : "text-foreground";

  const bgColor = record.isSunday
    ? "bg-holiday-bg"
    : record.isSaturday
    ? "bg-saturday-bg"
    : "bg-card";

  const todayRing = record.isToday
    ? "ring-2 ring-today-ring ring-offset-2"
    : "";

  const hasData = record.startTime || record.endTime || record.category !== "-";

  return (
    <div
      className={`rounded-2xl ${bgColor} ${todayRing} shadow-sm overflow-hidden transition-all duration-200`}
    >
      {/* Header - always visible, tappable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3.5 active:bg-black/5 transition"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center w-10">
            <span className={`text-xl font-bold ${dayColor}`}>{record.date}</span>
            <span className={`text-xs font-medium ${dayColor}`}>{record.dayOfWeek}</span>
          </div>
          {record.isToday && (
            <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded-full">
              TODAY
            </span>
          )}
          {record.category !== "-" && (
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white"
              style={{
                backgroundColor: CATEGORIES.find((c) => c.value === record.category)?.color,
              }}
            >
              {record.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasData && (
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                {record.startTime && record.endTime
                  ? `${record.startTime} - ${record.endTime}`
                  : record.startTime || record.endTime || ""}
              </div>
              {workHours && (
                <div className="text-xs text-muted">{workHours}h</div>
              )}
            </div>
          )}
          <ChevronDown
            size={18}
            className={`text-muted transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border">
          {/* Category */}
          <div className="pt-3">
            <label className="text-xs font-medium text-muted mb-1 block">区分</label>
            <select
              value={record.category}
              onChange={(e) => onUpdate({ category: e.target.value as AttendanceCategory })}
              className="w-full"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted mb-1 flex items-center gap-1">
                <Clock size={12} /> 出勤
              </label>
              <input
                type="time"
                value={record.startTime}
                onChange={(e) => onUpdate({ startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted mb-1 flex items-center gap-1">
                <Clock size={12} /> 退勤
              </label>
              <input
                type="time"
                value={record.endTime}
                onChange={(e) => onUpdate({ endTime: e.target.value })}
              />
            </div>
          </div>

          {/* Quick time buttons */}
          <QuickTimeButtons
            onSelect={(start, end) => onUpdate({ startTime: start, endTime: end })}
          />

          {/* Note */}
          <div>
            <label className="text-xs font-medium text-muted mb-1 flex items-center gap-1">
              <MessageSquare size={12} /> 備考
            </label>
            <input
              type="text"
              value={record.note}
              onChange={(e) => onUpdate({ note: e.target.value })}
              placeholder="備考を入力..."
              className="w-full text-sm px-3 py-2.5 rounded-xl border-[1.5px] border-border bg-card focus:outline-none focus:border-primary focus:ring-3 focus:ring-blue-500/15"
            />
          </div>
        </div>
      )}
    </div>
  );
}
