"use client";

import { DayRecord } from "@/lib/types";
import { Clock, CalendarDays, Coffee, FileText } from "lucide-react";

interface SummaryProps {
  records: DayRecord[];
}

export default function Summary({ records }: SummaryProps) {
  const workDays = records.filter((r) => r.startTime && r.endTime).length;
  const paidLeave = records.filter((r) => r.category === "有給").length;

  let totalMinutes = 0;
  records.forEach((r) => {
    if (r.startTime && r.endTime) {
      const [sh, sm] = r.startTime.split(":").map(Number);
      const [eh, em] = r.endTime.split(":").map(Number);
      let mins = eh * 60 + em - (sh * 60 + sm);
      if (mins < 0) mins += 24 * 60;
      if (r.breakTime) {
        const [bh, bm] = r.breakTime.split(":").map(Number);
        mins -= bh * 60 + bm;
      }
      if (mins > 0) totalMinutes += mins;
    }
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  const stats = [
    {
      icon: <CalendarDays size={18} />,
      label: "出勤日数",
      value: `${workDays}日`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Clock size={18} />,
      label: "総労働時間",
      value: `${totalHours}:${totalMins.toString().padStart(2, "0")}`,
      color: "bg-green-50 text-green-600",
    },
    {
      icon: <Coffee size={18} />,
      label: "有給取得",
      value: `${paidLeave}日`,
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: <FileText size={18} />,
      label: "入力済み",
      value: `${workDays}/${records.filter((r) => !r.isWeekend).length}`,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 px-4 py-3">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-2xl p-3 ${s.color}`}>
          <div className="flex items-center gap-2 mb-1">
            {s.icon}
            <span className="text-xs font-medium opacity-80">{s.label}</span>
          </div>
          <div className="text-xl font-bold">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
