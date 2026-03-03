"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthSelector({ year, month, onPrev, onNext }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <button
        onClick={onPrev}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm active:scale-90 active:bg-gray-50 transition-all duration-200"
      >
        <ChevronLeft size={20} className="text-gray-500" />
      </button>
      <div className="text-center">
        <span className="text-xs font-medium text-gray-400">{year}年</span>
        <h2 className="text-2xl font-bold text-gray-800 -mt-0.5">{month}月</h2>
      </div>
      <button
        onClick={onNext}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm active:scale-90 active:bg-gray-50 transition-all duration-200"
      >
        <ChevronRight size={20} className="text-gray-500" />
      </button>
    </div>
  );
}
