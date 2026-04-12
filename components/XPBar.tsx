"use client";
import { useUserStore } from "@/features/user/useUserStore";
import { useEffect } from "react";
import { Zap } from "lucide-react";

// XP to reach level N+1: current formula: level = floor(sqrt(xp/100)) + 1
// So xp for level L = (L-1)^2 * 100
function getXpForLevel(level: number) {
  return (level - 1) * (level - 1) * 100;
}
function getXpForNextLevel(level: number) {
  return level * level * 100;
}

export default function XPBar() {
  const { user, loadUser } = useUserStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (!user) return null;

  const xpCurrentLevel = getXpForLevel(user.level);
  const xpNextLevel = getXpForNextLevel(user.level);
  const xpInLevel = user.xp - xpCurrentLevel;
  const xpNeeded = xpNextLevel - xpCurrentLevel;
  const progress = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));
  const xpToNext = xpNextLevel - user.xp;

  return (
    <div className="flex flex-col gap-1 w-full max-w-[220px] sm:max-w-[280px]">
      {/* Label row */}
      <div className="flex justify-between items-center px-0.5">
        <div className="flex items-center gap-1">
          <Zap size={12} className="text-fuchsia-500 fill-fuchsia-500" />
          <span className="text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider">
            EXP
          </span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
          {xpToNext > 0 ? `Next Lv: ${xpToNext} XP` : "MAX LV"}
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-3 rounded-full bg-slate-200 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 overflow-hidden shadow-inner">
        {/* Glow BG */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Shimmer stripe */}
        <div
          className="absolute top-0 h-full w-8 bg-white/30 skew-x-[-20deg] animate-[shimmer_2s_infinite] rounded-full"
          style={{ left: `calc(${progress}% - 2rem)` }}
        />
      </div>

      {/* Value row */}
      <div className="flex justify-between items-center px-0.5">
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
          {user.xp.toLocaleString()} XP
        </span>
        <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
          {xpNextLevel.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
}
