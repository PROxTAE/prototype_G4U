"use client";
import { useEffect } from "react";
import { useStreakStore } from "./useStreakStore";
import StreakBadge from "./StreakBadge";
import ProgressBar from "./ProgressBar";
import WeeklyTracker from "./WeeklyTracker";
import { motion } from "framer-motion";

export default function StreakCard() {
  const { streak, xpProgress, xpTarget, initStreak } = useStreakStore();

  useEffect(() => {
    initStreak();
  }, [initStreak]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto p-5 rounded-[2.5rem] bg-black/40 border-2 border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative"
    >
      {/* Background radial glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex gap-6 relative z-10">
        {/* Left: Streak Badge */}
        <div className="w-[160px] shrink-0">
          <StreakBadge count={streak.current} />
        </div>

        {/* Right: Progress and Weekly */}
        <div className="flex-1 flex flex-col justify-between py-1 gap-6">
          <ProgressBar progress={xpProgress} target={xpTarget} />
          <WeeklyTracker status={streak.weeklyStatus} />
        </div>
      </div>
    </motion.div>
  );
}
