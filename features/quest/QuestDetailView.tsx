"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Zap, Coins, Trophy, Trash2,
  CheckCircle2, Plus, Sparkles, Target, ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { useTaskStore } from "@/features/task/useTaskStore";
import { useCardStore } from "@/features/card/useCardStore";
import { useUserStore } from "@/features/user/useUserStore";
import RewardClaimModal from "./RewardClaimModal";
import { useDailyQuestStore } from "@/features/dailyQuest/useDailyQuestStore";
import { playSound } from "@/lib/sounds";
import type { Task } from "@/types";

const DIFF_THEMES = {
  easy:    { gradient: "from-emerald-400 to-cyan-400",   glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]"  },
  medium:  { gradient: "from-violet-500 to-fuchsia-500", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]"  },
  hard:    { gradient: "from-rose-500 to-orange-500",    glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]"   },
  default: { gradient: "from-cyan-500 to-blue-500",      glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]"  },
} as const;

interface PendingReward {
  xp: number;
  coin: number;
  isQuestComplete: boolean;
  taskTitle?: string;
}

function TaskRow({
  task,
  onClaim,
  onDelete,
}: {
  task: Task;
  onClaim: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const exp = task.exp ?? 10;
  const coin = Math.floor(exp * 0.5);
  const isDone = task.completed;

  return (
    <div
      className={`
        group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
        ${isDone 
          ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/40 opacity-70" 
          : "!bg-white dark:!bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] shadow-sm"
        }
      `}
    >
      {/* XP Icon Box */}
      <div 
        onClick={() => !isDone && onClaim(task)}
        className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 shrink-0 cursor-pointer transition-all ${
          isDone 
            ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
            : "bg-fuchsia-500/10 border-fuchsia-500/30 hover:border-fuchsia-400"
        }`}
      >
        <span className={`text-[10px] font-black ${isDone ? "text-emerald-500" : "text-fuchsia-500"}`}>
          +{exp}
        </span>
        <Zap size={18} className={isDone ? "text-emerald-500" : "text-fuchsia-500"} />
      </div>

      {/* Title & Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-black text-sm uppercase tracking-tight truncate ${isDone ? "text-slate-400 italic" : "text-slate-800 dark:text-zinc-200"}`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
           <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${
             isDone 
              ? "bg-slate-100 dark:bg-zinc-800 border-transparent text-slate-400"
              : "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
           }`}>
             <Coins size={10} /> {coin} Gold
           </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="shrink-0 flex items-center gap-2">
        {!isDone ? (
          <Button 
            onPress={() => onClaim(task)}
            size="sm"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-cyan-600 text-white font-black text-[10px] rounded-lg shadow-lg shadow-cyan-500/20 h-9 px-4 uppercase tracking-wider border-0"
          >
            Done
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-emerald-500 font-black text-[10px] uppercase">
            <CheckCircle2 size={14} /> Completed
          </div>
        )}

        {/* Delete - only show on group hover */}
        <Button
          isIconOnly
          onPress={() => onDelete(task.id)}
          className="w-8 h-8 min-w-0 p-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent rounded-lg transition-all"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

export default function QuestDetailView({ onBack }: { onBack: () => void }) {
  const { tasks, fetchTasks, toggleTask, addTask, removeTask } = useTaskStore();
  const { selectedCardId, cards, removeCard } = useCardStore();
  const { gainRewards } = useUserStore();
  const [pendingReward, setPendingReward] = useState<PendingReward | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const selectedCard = cards.find((c) => c.id === selectedCardId);

  useEffect(() => {
    if (selectedCardId) fetchTasks(selectedCardId);
  }, [selectedCardId, fetchTasks]);

  const diff = (selectedCard?.difficulty ?? "default") as keyof typeof DIFF_THEMES;
  const headerTheme = DIFF_THEMES[diff] ?? DIFF_THEMES.default;

  const totalExp = tasks.reduce((s, t) => s + (t.exp ?? 10), 0) + (selectedCard?.bonusExp ?? 0);
  const doneCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;
  const allDone = tasks.length > 0 && tasks.every((t) => t.completed);

  const handleClaim = async (task: Task) => {
    const exp = task.exp ?? 10;
    const coin = Math.floor(exp * 0.5);
    await toggleTask(task.id); // mark complete
    
    // Daily Quest Hook
    useDailyQuestStore.getState().updateProgress(task);

    const nowAllDone = useTaskStore.getState().tasks.every((t) => t.completed);
    const bonusExp = nowAllDone && selectedCard?.bonusExp ? selectedCard.bonusExp : 0;
    const totalXp = exp + bonusExp;
    const totalCoin = coin + Math.floor(bonusExp * 0.5);

    gainRewards(totalXp, totalCoin);
    playSound("reward");

    setPendingReward({
      xp: totalXp,
      coin: totalCoin,
      isQuestComplete: nowAllDone,
      taskTitle: task.title,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedCardId) return;
    await addTask(selectedCardId, newTitle);
    setNewTitle("");
  };

  return (
    <>
      <RewardClaimModal
        isOpen={!!pendingReward}
        xp={pendingReward?.xp ?? 0}
        coin={pendingReward?.coin ?? 0}
        isQuestComplete={pendingReward?.isQuestComplete}
        questTitle={selectedCard?.title}
        onClose={() => setPendingReward(null)}
      />

      <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-zinc-950">
        {/* Quest Header (Standard Mission Style) */}
        <div className={`relative flex-shrink-0 bg-gradient-to-r ${headerTheme.gradient} py-3 shadow-lg flex items-center justify-center`}>
           <h2 className="text-white font-black text-xl italic tracking-tighter uppercase drop-shadow-md">
             Quest Log
           </h2>
           <Button
              isIconOnly
              onPress={onBack}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-xl h-8 w-8 min-w-0 border border-white/30 backdrop-blur-sm transition-all"
            >
              <ChevronLeft size={18} />
            </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Activity Progress Section (Styled like Daily Quest) */}
          <div className="p-6">
            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                  <Target size={18} className="animate-pulse" />
                  <h3 className="text-lg font-black uppercase tracking-tighter">Mission Progress</h3>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master this quest book</p>
              </div>
              {allDone && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                  <span className="text-emerald-500 font-black text-[10px] uppercase">Book Completed</span>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-5 border border-slate-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
               {/* Activity Box Overlay */}
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={40} className="text-cyan-500" />
               </div>

               <div className="flex items-center gap-4 mb-6">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${headerTheme.gradient} flex flex-col items-center justify-center shadow-lg ${headerTheme.glow}`}>
                    <span className="text-2xl font-black text-white leading-none">{doneCount}</span>
                    <span className="text-[8px] font-black text-white/70 uppercase">/{tasks.length}</span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase italic leading-none">
                      {selectedCard?.title}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">
                      Current streak: {totalExp} Exp Pool
                    </p>
                  </div>
               </div>

               {/* Large Progress Bar */}
               <div className="relative h-2.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full bg-gradient-to-r ${headerTheme.gradient} shadow-[0_0_10px_rgba(6,182,212,0.5)]`}
                  />
               </div>
               <div className="flex justify-between mt-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase italic">Start</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase italic">Goal Reached</span>
               </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="px-6 pb-web flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1 px-1">
               <div className="w-1.5 h-4 bg-cyan-500 rounded-full" />
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objectives List</h5>
            </div>
          {tasks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="text-5xl">🎯</div>
              <p className="text-slate-500 dark:text-zinc-500 font-black text-base uppercase tracking-wider">No Objectives Yet</p>
              <p className="text-slate-400 dark:text-zinc-600 text-sm">Add your first task below</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onClaim={handleClaim}
                onDelete={removeTask}
              />
            ))
          )}
        </div>
      </div>

      {/* Add task bar */}
        <form
          onSubmit={handleCreate}
          className="flex-shrink-0 flex gap-2 px-6 py-4 border-t border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new objective..."
            className="flex-1 !bg-slate-50 dark:!bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 hover:border-cyan-300 dark:hover:border-cyan-700 focus:border-cyan-400 dark:focus:border-cyan-500 text-slate-800 dark:text-white font-bold rounded-xl px-4 py-2.5 outline-none transition-colors"
          />
          <Button
            type="submit"
            isIconOnly
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-cyan-600 text-white h-12 w-12 flex-shrink-0 rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.3)] border-0"
          >
            <Plus size={22} strokeWidth={3} />
          </Button>
        </form>
      </div>
    </>
  );
}
