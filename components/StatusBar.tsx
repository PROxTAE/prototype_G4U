"use client";
import { useEffect } from "react";
import { Gift, Heart, Package } from "lucide-react";
import { useUserStore } from "@/features/user/useUserStore";

export default function StatusBar() {
  const { user, loadUser } = useUserStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Fallback skeleton while loading
  if (!user) return (
    <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 px-2 sm:px-8 py-4 flex justify-between items-end z-10 h-24" />
  );

  return (
    <div className="absolute bottom-20 sm:bottom-24 left-0 right-0 px-2 sm:px-8 py-4 flex justify-between items-end z-10 scale-90 sm:scale-100 origin-bottom transform-gpu transition-all">
      
      {/* Left: Gift Box */}
      <div className="flex flex-col items-center">
        <button className="bg-white/80 dark:bg-zinc-800/80 p-3 rounded-xl border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors backdrop-blur-sm shadow-md">
          <Gift className="text-slate-700 dark:text-white" size={24} />
        </button>
      </div>

      {/* Center: Health & Hearts */}
      <div className="flex flex-col items-center gap-2 max-w-[200px] w-full mb-1">
        <div className="flex gap-1.5">
          {[...Array(user.maxHearts)].map((_, i) => (
            <Heart
              key={i}
              className={i < user.hearts
                ? "text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] dark:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                : "text-slate-300 dark:text-zinc-600 fill-slate-200 dark:fill-zinc-800"}
              size={28}
            />
          ))}
        </div>

        {/* HP Progress Bar */}
        <div className="w-full relative h-6 bg-slate-200 dark:bg-zinc-950 rounded-md border-2 border-slate-300 dark:border-zinc-800 overflow-hidden shadow-inner">
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-orange-400 to-green-500 dark:from-orange-500 dark:to-green-400 transition-all duration-500"
            style={{ width: `${(user.health.current / user.health.max) * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-white mix-blend-overlay dark:mix-blend-difference">
            {user.health.current}/{user.health.max}
          </div>
        </div>
      </div>

      {/* Right: Level display */}
      <div className="flex flex-col items-end">
        <div className="text-slate-500 dark:text-zinc-500 font-bold text-xs uppercase italic mr-4 -mb-1">LEVEL</div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-white to-slate-100 dark:from-zinc-800 dark:to-zinc-900 pr-4 pl-2 py-1 rounded-xl shadow-lg border border-slate-300 dark:border-zinc-700">
          <div className="bg-purple-500 p-2 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.3)] dark:shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            <Package className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-black text-xl italic leading-none">{user.level}</span>
            <span className="text-slate-500 dark:text-zinc-400 font-bold text-[10px] leading-none uppercase">
              {user.xp} XP
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
