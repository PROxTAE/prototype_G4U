"use client";
import { useEffect } from "react";
import { useStreakStore } from "./useStreakStore";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function StreakMini() {
  const { streak, xpProgress, xpTarget, initStreak } = useStreakStore();

  useEffect(() => {
    initStreak();
  }, [initStreak]);

  const percent = Math.min(100, (xpProgress / xpTarget) * 100);
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

  return (
    <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-white/80 dark:bg-zinc-950/90 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Mini Streak Icon */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)]">
           <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,2C12,2 10,7.5 10,10.5C10,12.43 11.57,14 13.5,14C15.43,14 17,12.43 17,10.5C17,8 14.5,5.5 12,2Z" opacity="0.5" />
            <path d="M10.5,22C8,22 6,19.5 6,17C6,14 8,10 12,5C11,8.5 10.5,12 10.5,12.5C10.5,13.88 11.62,15 13,15C14.38,15 15.5,13.88 15.5,12.5C15.5,12 15,10 13,8.5C16.5,10 18.5,13 18.5,16C18.5,19 16,22 13.5,22H10.5Z" />
          </svg>
        </div>
        <div className="flex flex-col">
           <span className="text-slate-900 dark:text-white font-black text-xs leading-none">{streak.current}</span>
           <span className="text-[7px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-tighter">Streak</span>
        </div>
      </div>

      <div className="w-px h-6 bg-slate-200 dark:bg-white/10 shrink-0" />

      {/* Progress Bar Mini - Fixed width for compactness */}
      <div className="w-24 flex flex-col gap-1 shrink-0">
         <div className="flex justify-between text-[7px] font-black text-slate-500 dark:text-white/40 uppercase tracking-tighter">
            <span>EXP</span>
            <span>{Math.floor(percent)}%</span>
         </div>
         <div className="h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-slate-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.1)] dark:shadow-[0_0_8px_white]"
            />
         </div>
      </div>

      <div className="w-px h-6 bg-slate-200 dark:bg-white/10 shrink-0" />

      {/* Mini Weekly Status */}
      <div className="flex gap-1 items-center shrink-0">
        {days.map((day) => {
          const isDone = streak.weeklyStatus[day];
          return (
            <div 
              key={day} 
              className={`w-1.5 h-1.5 rounded-full ${isDone ? "bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]" : "bg-slate-200 dark:bg-white/10"}`} 
              title={day}
            />
          );
        })}
      </div>
    </div>
  );
}
