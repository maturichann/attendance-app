"use client";

import { DayRecord } from "@/lib/types";
import { calcWorkHours } from "@/lib/utils";
import { LogIn, LogOut, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface PunchCardProps {
  todayRecord: DayRecord | null;
  onPunch: (type: "start" | "end") => void;
}

export default function PunchCard({ todayRecord, onPunch }: PunchCardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const dateStr = now.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  const hasStart = !!todayRecord?.startTime;
  const hasEnd = !!todayRecord?.endTime;
  const workHours = todayRecord
    ? calcWorkHours(todayRecord.startTime, todayRecord.endTime, todayRecord.breakTime)
    : "";

  return (
    <div className="mx-4 mt-2 rounded-[22px] bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 text-white px-5 py-4 shadow-xl shadow-slate-900/40 overflow-hidden relative">
      {/* Decorative blurs */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-indigo-500/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl" />

      <div className="flex items-center justify-between relative z-10">
        {/* Left: Time display */}
        <div>
          <p className="text-[11px] text-slate-400">{dateStr}</p>
          <div className="flex items-baseline mt-0.5">
            <span className="text-3xl font-bold tracking-wider font-mono">{hours}</span>
            <span className="text-3xl font-bold mx-0.5 animate-pulse">:</span>
            <span className="text-3xl font-bold tracking-wider font-mono">{minutes}</span>
            <span className="text-sm text-slate-500 font-mono ml-1">{seconds}</span>
          </div>
          {/* Status */}
          {hasStart && (
            <div className="flex items-center gap-3 mt-1.5 animate-float-up">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                出勤 <span className="text-white font-bold">{todayRecord?.startTime}</span>
              </span>
              {hasEnd && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400 animate-scale-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  退勤 <span className="text-white font-bold">{todayRecord?.endTime}</span>
                </span>
              )}
              {workHours && (
                <span className="text-[11px] text-emerald-400 font-bold">{workHours}</span>
              )}
            </div>
          )}
        </div>

        {/* Right: Punch buttons */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onPunch("start")}
              disabled={hasStart && !hasEnd}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-85 ${
                hasStart
                  ? "bg-white/10"
                  : "bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/40 punch-pulse punch-pulse-blue"
              }`}
            >
              {hasStart ? (
                <Check size={22} className="text-emerald-400 animate-check-pop" />
              ) : (
                <LogIn size={22} className="text-white" />
              )}
            </button>
            <span className={`text-[10px] font-bold ${hasStart ? "text-emerald-400" : "text-slate-400"}`}>
              {hasStart ? "済" : "出勤"}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => onPunch("end")}
              disabled={!hasStart || hasEnd}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 active:scale-85 ${
                hasEnd
                  ? "bg-white/10"
                  : hasStart
                  ? "bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-red-500/40 punch-pulse punch-pulse-red"
                  : "bg-white/5"
              }`}
            >
              {hasEnd ? (
                <Check size={22} className="text-emerald-400 animate-check-pop" />
              ) : (
                <LogOut size={22} className={hasStart ? "text-white" : "text-slate-600"} />
              )}
            </button>
            <span className={`text-[10px] font-bold ${
              hasEnd ? "text-emerald-400" : hasStart ? "text-slate-400" : "text-slate-600"
            }`}>
              {hasEnd ? "済" : "退勤"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
