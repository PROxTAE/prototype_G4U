"use client";
import { WeeklyStatus } from "@/types/streak";
import { Check } from "lucide-react";

interface Props {
  status: WeeklyStatus;
}

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
] as const;

export default function WeeklyTracker({ status }: Props) {
  return (
    <div className="flex justify-between items-center w-full px-2 py-3 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
      {DAYS.map((day) => {
        const isDone = status[day.key];
        return (
          <div key={day.key} className="flex flex-col items-center gap-1.5">
            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300
              ${isDone 
                ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]" 
                : "bg-white/5 text-transparent border border-white/10"
              }
            `}>
              {isDone && <Check size={14} strokeWidth={4} />}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tighter ${isDone ? "text-white" : "text-white/30"}`}>
              {day.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
