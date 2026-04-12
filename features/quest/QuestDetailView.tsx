"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Zap, Coins, Trophy, Trash2,
  CheckCircle2, Plus, Sparkles, Target, ChevronLeft
} from "lucide-react";
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

  return (
    <div
      className={`
        group flex items-center gap-3 rounded-2xl border-2 p-4 transition-all
        ${task.completed
          ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/40"
          : "!bg-white dark:!bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600"
        }
      `}
    >
      {/* Checkbox icon */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
        task.completed
          ? "bg-emerald-500 border-emerald-500"
          : "border-slate-300 dark:border-zinc-600"
      }`}>
        {task.completed && <CheckCircle2 size={16} className="text-white" />}
      </div>

      {/* Title */}
      <span className={`flex-1 font-bold text-sm ${
        task.completed
          ? "line-through text-slate-400 dark:text-zinc-500"
          : "text-slate-800 dark:text-white"
      }`}>
        {task.title}
      </span>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="flex items-center gap-0.5 bg-fuchsia-50 dark:bg-fuchsia-900/20 border border-fuchsia-200 dark:border-fuchsia-800 rounded-full px-2 py-0.5">
          <Zap size={9} className="text-fuchsia-500 fill-fuchsia-500" />
          <span className="text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-400">+{exp}</span>
        </div>
        <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-0.5">
          <Coins size={9} className="text-amber-500" />
          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">+{coin}G</span>
        </div>
      </div>

      {/* Collect / Done button */}
      {!task.completed ? (
        <Button
          size="sm"
          onPress={() => onClaim(task)}
          className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-xs rounded-xl px-4 border-0 shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all"
        >
          Done
        </Button>
      ) : (
        <span className="flex-shrink-0 text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-0.5">
          <CheckCircle2 size={12} /> Done
        </span>
      )}

      {/* Delete */}
      <Button
        isIconOnly
        size="sm"
        onPress={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 border-none transition-opacity"
      >
        <Trash2 size={13} />
      </Button>
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

      <div className="flex flex-col h-full overflow-hidden">
        {/* Quest Header Banner */}
        <div className={`relative overflow-hidden flex-shrink-0 bg-gradient-to-r ${headerTheme.gradient} p-6 ${headerTheme.glow}`}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

          <div className="relative z-10 flex items-start gap-4">
            <Button
              isIconOnly
              onPress={onBack}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white rounded-xl border border-white/30 backdrop-blur-sm"
            >
              <ChevronLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-white/70 font-bold text-xs uppercase tracking-[0.2em] mb-0.5">Quest Book</p>
              <h2 className="text-white font-black text-2xl leading-tight drop-shadow-lg truncate">
                {selectedCard?.title}
              </h2>
              {selectedCard?.description && (
                <p className="text-white/70 text-sm mt-1 line-clamp-1">{selectedCard.description}</p>
              )}

              {/* XP + Progress */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-yellow-300 fill-yellow-300" />
                  <span className="text-yellow-200 font-black text-sm">{totalExp} Total EXP</span>
                </div>
                <span className="text-white/60 text-sm font-bold">
                  {doneCount}/{tasks.length} completed
                </span>
              </div>

              <div className="mt-2 h-2 rounded-full bg-black/30 overflow-hidden w-full max-w-sm">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${allDone ? "bg-yellow-300" : "bg-white/80"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {allDone && (
              <div className="flex-shrink-0 flex flex-col items-center bg-yellow-300/20 border border-yellow-300/50 rounded-2xl px-3 py-2 backdrop-blur-sm">
                <Trophy size={24} className="text-yellow-300" />
                <span className="text-yellow-200 font-black text-[10px] uppercase mt-1">Done!</span>
              </div>
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
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
            className="bg-cyan-500 hover:bg-cyan-600 text-white h-12 w-12 flex-shrink-0 rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.3)] border-0"
          >
            <Plus size={22} strokeWidth={3} />
          </Button>
        </form>
      </div>
    </>
  );
}
