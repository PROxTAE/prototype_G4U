"use client";
import { useEffect, useState } from "react";
import { useDailyQuestStore } from "./useDailyQuestStore";
import DailyQuestItem from "./DailyQuestItem";
import { Package, Trophy, Sparkles, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/sounds";
import * as dailyQuestService from "@/services/dailyQuestService";

const MILESTONES = [20, 40, 60, 80, 100];

export default function DailyQuestList() {
  const { quests, totalPoints, initQuests, claimedMilestones, claimMilestone } = useDailyQuestStore();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    initQuests();
    
    // Timer for reset countdown
    const updateTimer = () => {
      const nextReset = dailyQuestService.getNextResetTime();
      const diff = nextReset.getTime() - new Date().getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`Resets in ${hours}h ${mins}m`);

      // If timer reaches 0, trigger refresh
      if (diff <= 0) {
        initQuests();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [initQuests]);

  const handleClaimMilestone = (point: number) => {
    const result = claimMilestone(point);
    if (result) {
      playSound("success");
      // Could trigger a special modal here
    }
  };

  const progressPercent = Math.min(100, (totalPoints / 100) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-end px-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400">
             <Trophy size={18} />
             <h3 className="text-lg font-black uppercase tracking-tighter">Daily Missions</h3>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Mission Requirement</p>
        </div>
        <div className="flex items-center gap-1.5 bg-black/10 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-800">
           <Clock size={12} className="text-slate-400" />
           <span className="text-[10px] font-black text-slate-500 uppercase">{timeLeft}</span>
        </div>
      </div>

      {/* Progress Multi-Reward Bar */}
      <div className="relative bg-slate-50 dark:bg-zinc-950/50 rounded-3xl p-6 border border-slate-200 dark:border-zinc-800 shadow-inner">
        {/* Point Display */}
        <div className="flex items-center gap-3 mb-6">
           <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
             <Sparkles size={16} className="text-white/50 absolute top-1.5 right-1.5" />
             <span className="text-2xl font-black text-white leading-none">{totalPoints}</span>
             <span className="text-[8px] font-black text-white/70 uppercase">/100</span>
           </div>
           <div className="flex flex-col">
              <span className="text-xs font-black text-slate-800 dark:text-zinc-300 uppercase italic">Activity Progress</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Earn points to unlock rare rewards</span>
           </div>
        </div>

        {/* The Bar */}
        <div className="relative h-4 bg-slate-200 dark:bg-zinc-800 rounded-full mb-8">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${progressPercent}%` }}
             className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-300 via-cyan-500 to-blue-600 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
           />
           
           {/* Milestone Boxes */}
           <div className="absolute inset-0 flex justify-between px-0">
             {MILESTONES.map((point) => {
               const isReached = totalPoints >= point;
               const isClaimed = claimedMilestones.includes(point);
               
               return (
                 <div key={point} className="relative flex flex-col items-center -top-2">
                   <motion.div 
                     whileHover={{ scale: isReached && !isClaimed ? 1.2 : 1 }}
                     onClick={() => isReached && !isClaimed && handleClaimMilestone(point)}
                     className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-all duration-300 ${
                       isClaimed 
                        ? "bg-slate-200 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 opacity-50" 
                        : isReached 
                          ? "bg-gradient-to-br from-yellow-300 to-amber-500 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-bounce"
                          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800"
                     }`}
                   >
                     <Package size={20} className={isReached && !isClaimed ? "text-white" : "text-slate-400"} />
                   </motion.div>
                   <span className={`text-[8px] font-black mt-2 ${isReached ? "text-cyan-500" : "text-slate-400"}`}>
                      {point}P
                   </span>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      {/* Quest List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {quests.map((quest) => (
            <DailyQuestItem key={quest.id} quest={quest} />
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-2 mt-4 text-slate-400 dark:text-zinc-600">
         <div className="h-[1px] flex-1 bg-slate-200 dark:bg-zinc-800" />
         <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">End of Missions</span>
         <div className="h-[1px] flex-1 bg-slate-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
