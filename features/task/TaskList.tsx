"use client";
import { useState, useEffect } from "react";
import { useTaskStore } from "./useTaskStore";
import { useCardStore } from "../card/useCardStore";
import { useUserStore } from "../user/useUserStore";
import TaskItem from "./TaskItem";
import RewardToast from "@/components/RewardToast";
import { Plus, Zap } from "lucide-react";
import { Input, Button } from "@heroui/react";

interface ToastData {
  id: string;
  xp: number;
  coin: number;
  isBonus?: boolean;
}

export default function TaskList() {
  const { tasks, fetchTasks, addTask, toggleTask, removeTask } = useTaskStore();
  const { selectedCardId, cards } = useCardStore();
  const { gainRewards } = useUserStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [toasts, setToasts] = useState<ToastData[]>([]);
  
  const selectedCard = cards.find(c => c.id === selectedCardId);

  useEffect(() => {
    if (selectedCardId) fetchTasks(selectedCardId);
  }, [selectedCardId, fetchTasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedCardId) return;
    await addTask(selectedCardId, newTaskTitle);
    setNewTaskTitle("");
  };

  const showToast = (xp: number, coin: number, isBonus = false) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, xp, coin, isBonus }]);
  };
  
  const triggerReward = (xp: number, coin: number) => {
    gainRewards(xp, coin);
    showToast(xp, coin);
    
    // Check if all tasks are now complete → bonus
    const allTasks = useTaskStore.getState().tasks;
    if (allTasks.every(t => t.completed)) {
      if (selectedCard?.bonusExp) {
        const bonusXp = selectedCard.bonusExp;
        const bonusCoin = Math.floor(bonusXp * 0.5);
        gainRewards(bonusXp, bonusCoin);
        setTimeout(() => showToast(bonusXp, bonusCoin, true), 800);
      }
    }
  };

  // Total EXP a quest card gives
  const totalExp = tasks.reduce((sum, t) => sum + (t.exp ?? 10), 0) + (selectedCard?.bonusExp ?? 0);
  const completedExp = tasks.filter(t => t.completed).reduce((sum, t) => sum + (t.exp ?? 10), 0);
  const progress = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  if (!selectedCardId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-400 dark:text-zinc-500 h-[80%] border-2 border-dashed border-slate-300 dark:border-zinc-700 rounded-2xl mx-4 my-8 bg-slate-50 dark:bg-black/20 transition-colors">
        <div className="font-bold text-center">SELECT A QUEST BOOK<br/>TO VIEW OBJECTIVES</div>
      </div>
    );
  }

  return (
    <>
      {/* Reward Toasts */}
      {toasts.map(t => (
        <RewardToast
          key={t.id}
          xp={t.xp}
          coin={t.coin}
          isBonus={t.isBonus}
          onDone={() => setToasts(prev => prev.filter(p => p.id !== t.id))}
        />
      ))}

      <div className="flex flex-col gap-4 w-full h-full p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-2 border-b-2 border-slate-200 dark:border-zinc-800 transition-colors">
          <div className="flex justify-between items-center">
            <h3 className="text-cyan-600 dark:text-cyan-400 font-black text-xl tracking-wider uppercase truncate">{selectedCard?.title}</h3>
            {selectedCard?.bonusExp && (
              <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-full px-2 py-0.5">
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">BONUS</span>
                <Zap size={10} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">+{selectedCard.bonusExp}</span>
              </div>
            )}
          </div>

          {/* Quest EXP progress bar */}
          {tasks.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase">Quest Progress</span>
                <span className="text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-400">
                  {completedExp} / {totalExp} EXP
                </span>
              </div>
              <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right text-[10px] font-bold text-slate-400 dark:text-zinc-500">{progress}%</div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2 flex-1 relative z-10">
          {tasks.map(task => (
             <TaskItem 
               key={task.id} 
               task={task} 
               onToggle={toggleTask} 
               onDelete={removeTask}
               onRewardTrigger={triggerReward}
             />
          ))}
          {tasks.length === 0 && (
            <div className="text-slate-400 dark:text-zinc-600 text-center py-6 font-bold text-sm italic transition-colors">
              NO OBJECTIVES FOUND
            </div>
          )}
        </div>

        <form onSubmit={handleCreate} className="mt-auto flex gap-2 relative z-10 pt-4 border-t-2 border-slate-200 dark:border-zinc-800 transition-colors pb-4">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New objective..."
            className="flex-1 !bg-white dark:!bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-400 focus-within:!border-cyan-500 text-slate-800 dark:text-white font-bold rounded-xl"
            fullWidth
          />
          <Button 
            type="submit" 
            isIconOnly
            className="bg-cyan-500 text-white dark:text-black h-12 w-12 flex-shrink-0"
          >
            <Plus size={24} strokeWidth={3} />
          </Button>
        </form>
      </div>
    </>
  );
}

