"use client";
import { useState, useEffect } from "react";
import { Plus, Zap, Trash2, CheckCircle2, Circle, Trophy, Target } from "lucide-react";
import { Button, Input } from "@heroui/react";
import { useTaskStore } from "@/features/task/useTaskStore";
import { useCardStore } from "@/features/card/useCardStore";
import { useUserStore } from "@/features/user/useUserStore";
import RewardToast from "@/components/RewardToast";
import type { Task } from "@/types";

interface ToastData {
  id: string;
  xp: number;
  coin: number;
  isBonus?: boolean;
}

function TaskRow({ task, onToggle, onDelete, onReward }: {
  task: Task;
  onToggle: (id: string, cb?: () => void) => void;
  onDelete: (id: string) => void;
  onReward: (xp: number, coin: number) => void;
}) {
  const exp = task.exp ?? 10;
  const coin = Math.floor(exp * 0.5);

  const handleToggle = () => {
    onToggle(task.id, task.completed ? undefined : () => onReward(exp, coin));
  };

  return (
    <div
      className={`
        group flex items-center gap-3 rounded-2xl border-2 p-3.5 transition-all cursor-pointer select-none
        ${task.completed
          ? "bg-slate-50 dark:bg-zinc-900/30 border-slate-200 dark:border-zinc-800 opacity-60"
          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
        }
      `}
      onClick={handleToggle}
    >
      {/* Checkbox */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
        task.completed
          ? "bg-emerald-500 border-emerald-500"
          : "border-slate-300 dark:border-zinc-600 group-hover:border-cyan-400"
      }`}>
        {task.completed && <CheckCircle2 size={14} className="text-white fill-white" />}
      </div>

      {/* Title */}
      <span className={`flex-1 font-bold text-sm transition-colors ${
        task.completed
          ? "line-through text-slate-400 dark:text-zinc-500"
          : "text-slate-800 dark:text-white"
      }`}>
        {task.title}
      </span>

      {/* EXP Badge */}
      <div className={`flex items-center gap-0.5 px-2 py-1 rounded-full flex-shrink-0 transition-all ${
        task.completed
          ? "bg-slate-100 dark:bg-zinc-800"
          : "bg-fuchsia-50 dark:bg-fuchsia-900/30 border border-fuchsia-200 dark:border-fuchsia-800"
      }`}>
        <Zap size={10} className={task.completed ? "text-slate-400" : "text-fuchsia-500 fill-fuchsia-400"} />
        <span className={`font-black text-[10px] ${task.completed ? "text-slate-400" : "text-fuchsia-600 dark:text-fuchsia-400"}`}>
          +{exp}
        </span>
      </div>

      {/* Coin hint */}
      {!task.completed && (
        <div className="flex items-center gap-0.5 px-2 py-1 rounded-full flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">+{coin}G</span>
        </div>
      )}

      {/* Delete */}
      <Button
        isIconOnly
        size="sm"
        onPress={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 border-none transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}

export default function QuestTaskPanel() {
  const { tasks, fetchTasks, addTask, toggleTask, removeTask } = useTaskStore();
  const { selectedCardId, cards } = useCardStore();
  const { gainRewards } = useUserStore();
  const [newTitle, setNewTitle] = useState("");
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const selectedCard = cards.find(c => c.id === selectedCardId);

  useEffect(() => {
    if (selectedCardId) fetchTasks(selectedCardId);
  }, [selectedCardId, fetchTasks]);

  const showToast = (xp: number, coin: number, isBonus = false) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, xp, coin, isBonus }]);
  };

  const triggerReward = (xp: number, coin: number) => {
    gainRewards(xp, coin);
    showToast(xp, coin);
    // Check quest complete → bonus
    const allTasks = useTaskStore.getState().tasks;
    if (allTasks.every(t => t.completed) && selectedCard?.bonusExp) {
      const bonusXp = selectedCard.bonusExp;
      const bonusCoin = Math.floor(bonusXp * 0.5);
      gainRewards(bonusXp, bonusCoin);
      setTimeout(() => showToast(bonusXp, bonusCoin, true), 800);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedCardId) return;
    await addTask(selectedCardId, newTitle);
    setNewTitle("");
  };

  const totalExp = tasks.reduce((s, t) => s + (t.exp ?? 10), 0) + (selectedCard?.bonusExp ?? 0);
  const doneExp = tasks.filter(t => t.completed).reduce((s, t) => s + (t.exp ?? 10), 0);
  const progress = tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0;
  const allDone = tasks.length > 0 && tasks.every(t => t.completed);

  // Not selected state
  if (!selectedCardId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
          <Target size={36} className="text-slate-400 dark:text-zinc-500" />
        </div>
        <div className="text-center">
          <p className="text-slate-600 dark:text-zinc-300 font-black text-lg uppercase tracking-wider">Select a Quest Book</p>
          <p className="text-slate-400 dark:text-zinc-600 text-sm mt-1">Choose from the left to view objectives</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {toasts.map(t => (
        <RewardToast key={t.id} xp={t.xp} coin={t.coin} isBonus={t.isBonus} onDone={() => setToasts(p => p.filter(x => x.id !== t.id))} />
      ))}

      <div className="flex flex-col h-full overflow-hidden">
        {/* Panel Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-slate-900 dark:text-white font-black text-xl uppercase tracking-wider truncate">
                {selectedCard?.title}
              </h2>
              {selectedCard?.description && (
                <p className="text-slate-500 dark:text-zinc-400 text-sm mt-0.5 line-clamp-1">{selectedCard.description}</p>
              )}
            </div>
            {allDone && (
              <div className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 px-3 py-1.5 rounded-full">
                <Trophy size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Complete!</span>
              </div>
            )}
          </div>

          {/* Progress section */}
          {tasks.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  {tasks.filter(t => t.completed).length} / {tasks.length} Objectives
                </span>
                <div className="flex items-center gap-1">
                  <Zap size={11} className="text-fuchsia-500 fill-fuchsia-500" />
                  <span className="text-[11px] font-black text-fuchsia-600 dark:text-fuchsia-400">
                    {doneExp} / {totalExp} EXP
                  </span>
                  {selectedCard?.bonusExp && (
                    <span className="ml-1 text-[9px] font-black text-amber-500 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded-full">
                      +{selectedCard.bonusExp} BONUS
                    </span>
                  )}
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden border border-slate-200 dark:border-zinc-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    allDone
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={removeTask}
              onReward={triggerReward}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                <Target size={24} className="text-slate-400 dark:text-zinc-500" />
              </div>
              <p className="text-slate-500 dark:text-zinc-500 font-bold text-sm">No objectives yet</p>
              <p className="text-slate-400 dark:text-zinc-600 text-xs">Add tasks below to get started</p>
            </div>
          )}
        </div>

        {/* Add Task Form */}
        <form
          onSubmit={handleCreate}
          className="flex-shrink-0 flex gap-2 px-6 py-4 border-t border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50"
        >
          <Input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Add new objective..."
            className="flex-1 !bg-white dark:!bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 hover:border-cyan-300 dark:hover:border-cyan-700 focus-within:!border-cyan-400 font-bold rounded-xl"
            fullWidth
          />
          <Button
            type="submit"
            isIconOnly
            className="bg-cyan-500 hover:bg-cyan-600 text-white h-12 w-12 flex-shrink-0 rounded-xl shadow-[0_0_12px_rgba(34,211,238,0.2)]"
          >
            <Plus size={22} strokeWidth={3} />
          </Button>
        </form>
      </div>
    </>
  );
}
