"use client";
import { DailyQuest } from "@/types/quest";
import { Button, Progress } from "@heroui/react";
import { Zap, Coins, CheckCircle2, ChevronRight, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useDailyQuestStore } from "./useDailyQuestStore";
import { useUserStore } from "@/features/user/useUserStore";
import { playSound } from "@/lib/sounds";

interface Props {
  quest: DailyQuest;
}

export default function DailyQuestItem({ quest }: Props) {
  const { claimReward } = useDailyQuestStore();
  const { gainRewards } = useUserStore();

  const handleClaim = () => {
    const reward = claimReward(quest.id);
    if (reward) {
      playSound("success");
      gainRewards(reward.exp, reward.coin);
    }
  };

  const isDone = quest.completed;
  const isClaimed = quest.rewardClaimed;
  const progressPercent = (quest.progress / quest.targetCount) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
        isClaimed 
          ? "bg-slate-50/50 dark:bg-zinc-900/40 border-slate-200 dark:border-zinc-800 opacity-60" 
          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] shadow-sm"
      }`}
    >
      {/* Icon/Reward Value */}
      <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 shrink-0 ${
        isDone ? "bg-emerald-500/10 border-emerald-500/50" : "bg-cyan-500/10 border-cyan-500/30"
      }`}>
        <span className={`text-xs font-black ${isDone ? "text-emerald-500" : "text-cyan-500"}`}>
          {quest.pointValue}P
        </span>
        <Target size={18} className={isDone ? "text-emerald-500" : "text-cyan-500"} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-black text-sm uppercase tracking-tight truncate ${isClaimed ? "text-slate-400" : "text-slate-800 dark:text-zinc-200"}`}>
          {quest.title}
        </h4>
        <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold mt-0.5 line-clamp-1 uppercase">
          {quest.description}
        </p>

        {/* Local Progress Indicator */}
        {!isClaimed && (
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className={`h-full rounded-full ${isDone ? "bg-emerald-500" : "bg-cyan-500"}`}
               />
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-zinc-600">
               {quest.progress}/{quest.targetCount}
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {isClaimed ? (
          <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase">
            <CheckCircle2 size={14} /> Claimed
          </div>
        ) : isDone ? (
          <Button 
            onPress={handleClaim}
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-black text-[10px] rounded-lg shadow-lg shadow-cyan-500/30 h-9 px-4 uppercase tracking-wider"
          >
            Claim
          </Button>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 transition-colors">
            <ChevronRight size={18} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
