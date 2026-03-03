"use client";

interface QuickTimeButtonsProps {
  onSelect: (start: string, end: string, breakTime: string) => void;
}

const PRESETS = [
  { label: "17:00〜8:30", sub: "休憩2h", start: "17:00", end: "08:30", breakTime: "02:00", primary: true },
  { label: "9:00〜18:00", sub: "休憩1h", start: "09:00", end: "18:00", breakTime: "01:00", primary: false },
  { label: "10:00〜19:00", sub: "休憩1h", start: "10:00", end: "19:00", breakTime: "01:00", primary: false },
];

export default function QuickTimeButtons({ onSelect }: QuickTimeButtonsProps) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
        クイック入力
      </label>
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => onSelect(p.start, p.end, p.breakTime)}
            className={`flex-1 py-2 text-center rounded-2xl transition-all duration-200 active:scale-[0.92] ${
              p.primary
                ? "text-indigo-700 bg-indigo-50 ring-1 ring-indigo-200 active:bg-indigo-100"
                : "text-gray-500 bg-gray-50 active:bg-gray-100"
            }`}
          >
            <span className="block text-xs font-bold">{p.label}</span>
            <span className="block text-[10px] opacity-60">{p.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
