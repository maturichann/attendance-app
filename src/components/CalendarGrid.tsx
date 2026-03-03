"use client";

import { DayRecord, DAY_NAMES } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarGridProps {
  year: number;
  month: number;
  records: DayRecord[];
  selectedDate: number | null;
  onSelectDate: (date: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarGrid({
  year,
  month,
  records,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="mx-4 mt-2 rounded-[22px] bg-white shadow-sm px-3 py-3">
      {/* Month header integrated */}
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          onClick={onPrevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100 active:scale-90 transition-all"
        >
          <ChevronLeft size={18} className="text-gray-400" />
        </button>
        <div className="text-center">
          <span className="text-sm font-bold text-gray-800">{year}年{month}月</span>
        </div>
        <button
          onClick={onNextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100 active:scale-90 transition-all"
        >
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[10px] font-bold py-0.5 ${
              i === 0 ? "text-red-300" : i === 6 ? "text-indigo-300" : "text-gray-300"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-[2px]">
        {blanks.map((i) => (
          <div key={`blank-${i}`} />
        ))}
        {records.map((r) => {
          const hasData = !!(r.startTime && r.endTime);
          const isSelected = selectedDate === r.date;
          const hasCategory = r.category !== "-";

          return (
            <button
              key={r.date}
              onClick={() => onSelectDate(r.date)}
              className={`
                relative flex flex-col items-center justify-center
                aspect-square rounded-xl text-[12px] font-semibold
                transition-all duration-200 active:scale-[0.82]
                ${isSelected
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30 scale-[1.05]"
                  : r.isToday
                  ? "bg-indigo-50 text-indigo-600 ring-[1.5px] ring-indigo-400/40"
                  : r.isSunday
                  ? "text-red-400"
                  : r.isSaturday
                  ? "text-indigo-400"
                  : hasData
                  ? "text-gray-700 bg-emerald-50/80"
                  : "text-gray-500"
                }
              `}
            >
              <span>{r.date}</span>
              <div className="flex gap-px mt-px h-1">
                {hasData && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/80" : "bg-emerald-400"}`} />
                )}
                {hasCategory && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/60" : "bg-amber-400"}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
