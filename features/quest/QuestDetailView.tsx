"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Zap, Coins, Trophy, Trash2,
  CheckCircle2, Plus, Sparkles, Target, ChevronLeft,
  Clock, Brain, Lock, ChevronDown, ChevronUp, ListChecks,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { useTaskStore } from "@/features/task/useTaskStore";
import { useCardStore } from "@/features/card/useCardStore";
import { useUserStore } from "@/features/user/useUserStore";
import RewardClaimModal from "./RewardClaimModal";
import FocusMode from "./FocusMode";
import { useDailyQuestStore } from "@/features/dailyQuest/useDailyQuestStore";
import { playSound } from "@/lib/sounds";
import type { Task } from "@/types";

const DIFF_THEMES = {
  easy:    { gradient: "from-emerald-400 to-cyan-400",   glow: "shadow-[0_0_30px_rgba(52,211,153,0.3)]"  },
  medium:  { gradient: "from-violet-500 to-fuchsia-500", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]"  },
  hard:    { gradient: "from-rose-500 to-orange-500",    glow: "shadow-[0_0_30px_rgba(239,68,68,0.3)]"   },
  default: { gradient: "from-cyan-500 to-blue-500",      glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]"  },
} as const;

const ENERGY_CONFIG = {
  low:    { label: "Low", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800", icon: "🟢" },
  medium: { label: "Med", color: "text-amber-500",   bg: "bg-amber-100 dark:bg-amber-900/30",   border: "border-amber-200 dark:border-amber-800",   icon: "🟡" },
  high:   { label: "High", color: "text-red-500",    bg: "bg-red-100 dark:bg-red-900/30",       border: "border-red-200 dark:border-red-800",       icon: "🔴" },
};

const STATUS_CONFIG = {
  todo:        { label: "TODO",        color: "text-slate-500 dark:text-zinc-400", bg: "bg-slate-100 dark:bg-zinc-800" },
  in_progress: { label: "IN PROGRESS", color: "text-cyan-600 dark:text-cyan-400",  bg: "bg-cyan-100 dark:bg-cyan-900/30" },
  completed:   { label: "DONE",        color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  skipped:     { label: "SKIPPED",     color: "text-slate-400 dark:text-zinc-500", bg: "bg-slate-100 dark:bg-zinc-800" },
};

interface PendingReward {
  xp: number;
  coin: number;
  isQuestComplete: boolean;
  taskTitle?: string;
}

function TaskRow({
  task,
  allTasks,
  onClaim,
  onFocus,
  onDelete,
  isBlocked,
}: {
  task: Task;
  allTasks: Task[];
  onClaim: (task: Task) => void;
  onFocus: (task: Task) => void;
  onDelete: (id: string) => void;
  isBlocked: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const exp = task.exp ?? 10;
  const coin = Math.floor(exp * 0.5);
  const isDone = task.completed;
  const energy = task.energy_required || "low";
  const energyCfg = ENERGY_CONFIG[energy];
  const status = task.status || (isDone ? "completed" : "todo");
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.todo;

  // Find dependency task names
  const depNames = (task.depends_on || [])
    .map(depId => allTasks.find(t => t.id === depId)?.title)
    .filter(Boolean);

  return (
    <div
      className={`
        group relative flex flex-col rounded-2xl border transition-all duration-300
        ${isDone 
          ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/40 opacity-70" 
          : isBlocked
            ? "bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 opacity-50"
            : "!bg-white dark:!bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] shadow-sm"
        }
      `}
    >
      {/* Main Row */}
      <div className="flex items-center gap-3 p-4">
        {/* XP Icon Box */}
        <div 
          onClick={() => !isDone && !isBlocked && onClaim(task)}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border-2 shrink-0 transition-all ${
            isDone 
              ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
              : isBlocked
                ? "bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 cursor-not-allowed"
                : "bg-fuchsia-500/10 border-fuchsia-500/30 hover:border-fuchsia-400 cursor-pointer"
          }`}
        >
          {isBlocked ? (
            <Lock size={18} className="text-slate-400" />
          ) : (
            <>
              <span className={`text-[10px] font-black ${isDone ? "text-emerald-500" : "text-fuchsia-500"}`}>
                +{exp}
              </span>
              <Zap size={18} className={isDone ? "text-emerald-500" : "text-fuchsia-500"} />
            </>
          )}
        </div>

        {/* Title & Meta Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-black text-sm uppercase tracking-tight truncate ${isDone ? "text-slate-400 italic" : isBlocked ? "text-slate-400" : "text-slate-800 dark:text-zinc-200"}`}>
            {task.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {/* Time badge */}
            {task.estimated_minutes && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                <Clock size={8} /> {task.estimated_minutes}m
              </div>
            )}
            {/* Energy badge */}
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase ${energyCfg.bg} ${energyCfg.border} ${energyCfg.color}`}>
              <span>{energyCfg.icon}</span> {energyCfg.label}
            </div>
            {/* Gold badge */}
            <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase ${
              isDone 
               ? "bg-slate-100 dark:bg-zinc-800 border-transparent text-slate-400"
               : "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400"
            }`}>
              <Coins size={8} /> {coin}G
            </div>
            {/* Dependencies indicator */}
            {depNames.length > 0 && (
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400">
                🔗 {depNames.length}
              </div>
            )}
          </div>
        </div>

        {/* Action Area */}
        <div className="shrink-0 flex items-center gap-1.5">
          {/* Expand/Collapse details */}
          {(task.micro_action || task.verification) && (
            <Button
              isIconOnly
              onPress={() => setExpanded(!expanded)}
              className="w-7 h-7 min-w-0 p-0 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 rounded-lg transition-all border-0"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          )}

          {!isDone && !isBlocked ? (
            <div className="flex items-center gap-1.5">
              {task.micro_action && (
                <Button
                  onPress={() => onFocus(task)}
                  size="sm"
                  className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-black text-[10px] rounded-lg shadow-lg shadow-fuchsia-500/20 h-9 px-3 uppercase tracking-wider border-0 animate-pulse"
                >
                  ⚡ Focus
                </Button>
              )}
              <Button 
                onPress={() => onClaim(task)}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-cyan-600 text-white font-black text-[10px] rounded-lg shadow-lg shadow-cyan-500/20 h-9 px-4 uppercase tracking-wider border-0"
              >
                Done
              </Button>
            </div>
          ) : isBlocked ? (
            <div className="flex items-center gap-1 text-slate-400 font-black text-[10px] uppercase">
              <Lock size={12} /> Locked
            </div>
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

      {/* Expanded Detail Panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2 border-t border-slate-100 dark:border-zinc-800 pt-3 ml-[68px]">
              {/* Micro Action */}
              {task.micro_action && (
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-fuchsia-100 dark:bg-fuchsia-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <ListChecks size={10} className="text-fuchsia-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-fuchsia-500 uppercase tracking-widest block">Micro Action</span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{task.micro_action}</p>
                  </div>
                </div>
              )}
              {/* Verification */}
              {task.verification && (
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={10} className="text-cyan-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest block">Verification</span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{task.verification}</p>
                  </div>
                </div>
              )}
              {/* Dependencies */}
              {depNames.length > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle size={10} className="text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">Requires</span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">{depNames.join(", ")}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuestDetailView({ onBack }: { onBack: () => void }) {
  const { tasks, fetchTasks, toggleTask, addTask, removeTask, isTaskBlocked } = useTaskStore();
  const { selectedCardId, cards, removeCard } = useCardStore();
  const { gainRewards } = useUserStore();
  const [pendingReward, setPendingReward] = useState<PendingReward | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [focusTask, setFocusTask] = useState<Task | null>(null);

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
  const totalEstimatedMinutes = tasks.reduce((s, t) => s + (t.estimated_minutes ?? 15), 0);

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

  const handleFocusComplete = async (task: Task) => {
    setFocusTask(null);
    await handleClaim(task);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedCardId) return;
    await addTask(selectedCardId, newTitle);
    setNewTitle("");
  };

  return (
    <>
      {focusTask && (
        <FocusMode
          task={focusTask}
          onComplete={handleFocusComplete}
          onClose={() => setFocusTask(null)}
        />
      )}

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
        <div className={`relative flex-shrink-0 bg-gradient-to-r ${headerTheme.gradient} py-4 sm:py-3 shadow-lg flex items-center justify-center`}>
           <h2 className="text-white font-black text-lg sm:text-xl italic tracking-tighter uppercase drop-shadow-md">
             Mission Progress
           </h2>
           <Button
              isIconOnly
              onPress={onBack}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-2xl h-10 w-10 sm:h-8 sm:w-8 min-w-0 border border-white/30 backdrop-blur-md transition-all shadow-lg active:scale-90"
            >
              <ChevronLeft size={20} className="sm:w-[18px] sm:h-[18px]" />
            </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* Why & Definition of Done */}
          {(selectedCard?.why || selectedCard?.definition_of_done) && (
            <div className="px-4 sm:px-6 pt-4 space-y-3 sm:space-y-2">
              {selectedCard?.why && (
                <div className="flex items-start gap-2.5 bg-fuchsia-50 dark:bg-fuchsia-900/10 border border-fuchsia-200 dark:border-fuchsia-800/40 rounded-2xl p-3.5">
                  <div className="w-7 h-7 rounded-lg bg-fuchsia-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={14} className="text-fuchsia-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-fuchsia-500 uppercase tracking-widest">Why This Matters</span>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed mt-0.5">{selectedCard.why}</p>
                  </div>
                </div>
              )}
              {selectedCard?.definition_of_done && (
                <div className="flex items-start gap-2.5 bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800/40 rounded-2xl p-3.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Target size={14} className="text-cyan-500" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Definition of Done</span>
                    <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed mt-0.5">{selectedCard.definition_of_done}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Activity Progress Section (Styled like Daily Quest) */}
          <div className="px-4 sm:p-6 py-6 sm:py-6">
            <div className="flex justify-between items-end mb-4 px-1 sm:px-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                  <Target size={18} className="animate-pulse" />
                  <h3 className="text-lg font-black uppercase tracking-tighter">Mission Progress</h3>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master this quest book</p>
              </div>
              <div className="flex items-center gap-2">
                {totalEstimatedMinutes > 0 && (
                  <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-2.5 py-1 rounded-full">
                    <Clock size={10} className="text-blue-500" />
                    <span className="text-blue-600 dark:text-blue-400 font-black text-[10px]">~{totalEstimatedMinutes}m</span>
                  </div>
                )}
                {allDone && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    <span className="text-emerald-500 font-black text-[10px] uppercase">Book Completed</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 rounded-[32px] p-5 sm:p-6 border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden backdrop-blur-sm">
               {/* Activity Box Overlay */}
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05]">
                  <Sparkles size={80} className="text-cyan-500" />
               </div>

               <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${headerTheme.gradient} flex flex-col items-center justify-center shadow-lg ${headerTheme.glow}`}>
                    <span className="text-xl sm:text-2xl font-black text-white leading-none">{doneCount}</span>
                    <span className="text-[8px] font-black text-white/70 uppercase">/{tasks.length}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-zinc-200 uppercase italic leading-none truncate">
                      {selectedCard?.title}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1.5 flex items-center gap-1.5">
                      <Zap size={10} className="text-fuchsia-500" />
                      {totalExp} EXP Total Reward
                    </p>
                  </div>
               </div>

               {/* Large Progress Bar */}
               <div className="relative h-3 bg-slate-100 dark:bg-black/20 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full bg-gradient-to-r ${headerTheme.gradient} shadow-[0_0_15px_rgba(6,182,212,0.4)]`}
                  />
               </div>
               <div className="flex justify-between mt-2 px-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Initiated</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Goal Achieved</span>
               </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="px-4 sm:px-6 pb-web flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1 px-1">
               <div className="w-1.5 h-4 bg-cyan-500 rounded-full" />
               <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objectives List</h5>
               <span className="text-[9px] font-bold text-slate-300 dark:text-zinc-600 ml-auto">
                 {tasks.filter(t => t.micro_action).length > 0 && "✦ Has micro-actions"}
               </span>
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
                allTasks={tasks}
                onClaim={handleClaim}
                onFocus={setFocusTask}
                onDelete={removeTask}
                isBlocked={isTaskBlocked(task)}
              />
            ))
          )}
        </div>
      </div>

      {/* Add task bar */}
        <form
          onSubmit={handleCreate}
          className="flex-shrink-0 flex gap-2 px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl"
        >
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add objective..."
            className="flex-1 !bg-slate-50 dark:!bg-black/20 border-2 border-slate-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-800 focus:border-cyan-400 dark:focus:border-cyan-600 text-slate-800 dark:text-white font-bold rounded-2xl px-4 py-2.5 outline-none transition-all text-sm"
          />
          <Button
            type="submit"
            isIconOnly
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-cyan-600 text-white h-12 w-12 flex-shrink-0 rounded-2xl shadow-lg shadow-cyan-500/30 border-0 active:scale-95"
          >
            <Plus size={24} strokeWidth={3} />
          </Button>
        </form>
      </div>
    </>
  );
}
