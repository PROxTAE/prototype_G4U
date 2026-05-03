"use client";
import { useState, useEffect } from "react";
import { Book, Plus, Trash2, Zap, Shield, Swords, Star, Clock } from "lucide-react";
import { Button, Card, Input } from "@heroui/react";
import { useCardStore } from "@/features/card/useCardStore";
import { useTaskStore } from "@/features/task/useTaskStore";
import { useQuestStore } from "./useQuestStore";
import type { Card as CardType } from "@/types";

const DIFFICULTY_CONFIG = {
  easy:   { label: "EASY",   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", border: "border-emerald-300 dark:border-emerald-700", icon: Shield },
  medium: { label: "MEDIUM", color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-100 dark:bg-amber-900/30",   border: "border-amber-300 dark:border-amber-700",   icon: Swords },
  hard:   { label: "HARD",   color: "text-red-600 dark:text-red-400",       bg: "bg-red-100 dark:bg-red-900/30",       border: "border-red-300 dark:border-red-700",       icon: Star },
};

function QuestBookCard({ card, isSelected, onSelect, onDelete }: {
  card: CardType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { tasks } = useTaskStore();
  const allTasks = useTaskStore.getState();

  // Get task data for this card from storage directly
  const [cardTasks, setCardTasks] = useState<{ total: number; done: number; totalExp: number; estimatedMinutes: number }>({ total: 0, done: 0, totalExp: 0, estimatedMinutes: 0 });

  useEffect(() => {
    // Load fresh from storage when needed
    import("@/services/taskService").then(({ getTasksByCardId }) => {
      getTasksByCardId(card.id).then(t => {
        setCardTasks({
          total: t.length,
          done: t.filter(x => x.completed).length,
          totalExp: t.reduce((sum, x) => sum + (x.exp ?? 10), 0) + (card.bonusExp ?? 0),
          estimatedMinutes: t.reduce((sum, x) => sum + (x.estimated_minutes ?? 15), 0),
        });
      });
    });
  }, [card.id, card.bonusExp, isSelected]);

  const diff = card.difficulty ?? "medium";
  const diffCfg = DIFFICULTY_CONFIG[diff] || DIFFICULTY_CONFIG.medium;
  const DiffIcon = diffCfg.icon;
  const progress = cardTasks.total > 0 ? (cardTasks.done / cardTasks.total) * 100 : 0;
  const isCompleted = cardTasks.total > 0 && cardTasks.done === cardTasks.total;

  return (
    <div
      onClick={() => onSelect(card.id)}
      className={`
        group relative cursor-pointer rounded-2xl border-2 p-4 transition-all
        ${isSelected
          ? "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-400 dark:border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          : "bg-white dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800/40"
        }
        ${isCompleted ? "opacity-75" : ""}
      `}
    >
      {/* Glow when selected */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 to-blue-400/5 pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-2">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isSelected
              ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              : "bg-slate-100 dark:bg-zinc-800"
          }`}>
            <Book size={18} className={isSelected ? "text-white" : "text-slate-500 dark:text-zinc-400"} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`font-black truncate text-base leading-tight ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-zinc-200"}`}>
              {card.title}
            </p>
            {card.type === "quest" && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase border ${diffCfg.bg} ${diffCfg.color} ${diffCfg.border}`}>
                  <DiffIcon size={8} />
                  {diffCfg.label}
                </div>
                {cardTasks.estimatedMinutes > 0 && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Clock size={7} /> {cardTasks.estimatedMinutes}m
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete */}
        <Button
          isIconOnly
          size="sm"
          onPress={(e) => { onDelete(card.id); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-red-400 bg-transparent hover:bg-red-100 dark:hover:bg-red-900/30 border-none"
          onClick={(e) => e.stopPropagation()}
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {/* Why text (brief) */}
      {card.why && (
        <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1.5 line-clamp-1 pl-[52px]">
          💡 {card.why}
        </p>
      )}

      {/* Progress + EXP row */}
      {cardTasks.total > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500">
              {cardTasks.done}/{cardTasks.total} tasks
            </span>
            <div className="flex items-center gap-1">
              <Zap size={10} className="text-fuchsia-500 fill-fuchsia-500" />
              <span className="text-[10px] font-black text-fuchsia-600 dark:text-fuchsia-400">{cardTasks.totalExp} EXP</span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCompleted
                  ? "bg-gradient-to-r from-emerald-400 to-green-500"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mt-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 text-center uppercase tracking-wider">
          ✓ COMPLETED
        </div>
      )}
    </div>
  );
}

export default function QuestSidebar() {
  const { cards, fetchCards, addCard, removeCard, selectCard, selectedCardId } = useCardStore();
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const card = await addCard(newTitle);
    setNewTitle("");
    setIsAdding(false);
  };

  const questCards = cards.filter(c => c.type === "quest");
  const defaultCards = cards.filter(c => c.type !== "quest");

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Sidebar Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-slate-50/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-zinc-800">
        <span className="text-slate-700 dark:text-zinc-200 font-black text-sm uppercase tracking-widest">Books</span>
        <Button
          isIconOnly
          size="sm"
          onPress={() => setIsAdding(!isAdding)}
          className={`rounded-xl border transition-colors ${
            isAdding
              ? "bg-red-100 dark:bg-red-900/30 text-red-500 border-red-200 dark:border-red-800"
              : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:text-cyan-600 dark:hover:text-cyan-400"
          }`}
        >
          <Plus size={16} strokeWidth={3} />
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="flex gap-2 p-3 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <Input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Quest name..."
            autoFocus
            className="flex-1 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-sm font-bold"
          />
          <Button type="submit" size="sm" className="bg-cyan-500 text-white font-bold flex-shrink-0 rounded-xl">
            ADD
          </Button>
        </form>
      )}

      <div className="flex flex-col gap-3 p-3">
        {/* Quest Cards section */}
        {questCards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="h-px flex-1 bg-fuchsia-200 dark:bg-fuchsia-900/40" />
              <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">AI Quests</span>
              <div className="h-px flex-1 bg-fuchsia-200 dark:bg-fuchsia-900/40" />
            </div>
            <div className="flex flex-col gap-2">
              {questCards.map(card => (
                <QuestBookCard
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onSelect={selectCard}
                  onDelete={removeCard}
                />
              ))}
            </div>
          </div>
        )}

        {/* Default Cards section */}
        {defaultCards.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
              <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Books</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
            </div>
            <div className="flex flex-col gap-2">
              {defaultCards.map(card => (
                <QuestBookCard
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onSelect={selectCard}
                  onDelete={removeCard}
                />
              ))}
            </div>
          </div>
        )}

        {cards.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Book size={28} className="text-slate-400 dark:text-zinc-500" />
            </div>
            <p className="text-slate-500 dark:text-zinc-500 font-bold text-sm">No quest books yet</p>
            <p className="text-slate-400 dark:text-zinc-600 text-xs">Create one or import from JSON</p>
          </div>
        )}
      </div>
    </div>
  );
}
