"use client";
import { useState, useEffect } from "react";
import { Zap, Book, Shield, Swords, Star, ChevronRight, Plus, FileJson, Sparkles, Target, Trash2, Clock } from "lucide-react";
import { Button } from "@heroui/react";
import { useCardStore } from "@/features/card/useCardStore";
import { playSound } from "@/lib/sounds";
import DeleteConfirmModal from "./DeleteConfirmModal";
import type { Card as CardType } from "@/types";
import * as taskService from "@/services/taskService";

const DIFF_THEMES = {
  easy: {
    label: "EASY",
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
    glow: "shadow-[0_8px_32px_rgba(52,211,153,0.45)]",
    border: "border-emerald-400/60",
    badge: "bg-emerald-500 text-white",
    icon: Shield,
  },
  medium: {
    label: "MEDIUM",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "shadow-[0_8px_32px_rgba(168,85,247,0.45)]",
    border: "border-purple-400/60",
    badge: "bg-purple-500 text-white",
    icon: Swords,
  },
  hard: {
    label: "HARD",
    gradient: "from-rose-500 via-red-500 to-orange-500",
    glow: "shadow-[0_8px_32px_rgba(239,68,68,0.45)]",
    border: "border-red-400/60",
    badge: "bg-red-500 text-white",
    icon: Star,
  },
  default: {
    label: "BOOK",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    glow: "shadow-[0_8px_32px_rgba(59,130,246,0.45)]",
    border: "border-blue-400/60",
    badge: "bg-blue-500 text-white",
    icon: Book,
  },
} as const;

const CHAPTER_ICONS = ["⚔️", "🛡️", "🌟", "💎", "🔥", "🌙", "⚡", "🎯"];

interface CardStats {
  total: number;
  done: number;
  totalExp: number;
  estimatedMinutes: number;
}

function QuestChapterCard({
  card,
  index,
  stats,
  onSelect,
  onDelete,
}: {
  card: CardType;
  index: number;
  stats: CardStats;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const diff = (card.difficulty ?? "default") as keyof typeof DIFF_THEMES;
  const theme = DIFF_THEMES[diff] ?? DIFF_THEMES.default;
  const DiffIcon = theme.icon;
  const progress = stats.total > 0 ? (stats.done / stats.total) * 100 : 0;
  const allDone = stats.total > 0 && stats.done === stats.total;
  const emoji = CHAPTER_ICONS[index % CHAPTER_ICONS.length];

  return (
    <div
      onClick={() => {
        playSound("click");
        onSelect();
      }}
      className={`
        group relative cursor-pointer rounded-3xl border-2 overflow-hidden transition-all duration-300
        hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98]
        ${theme.border} ${theme.glow}
        ${allDone ? "opacity-80" : ""}
      `}
    >
      {/* Delete Button (Hover) */}
      <button 
        onClick={onDelete}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-red-500 text-white border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 backdrop-blur-md"
      >
        <Trash2 size={14} />
      </button>

      {/* Card gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Pattern dots */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 text-white"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "12px 12px" }}
      />

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col gap-3 min-h-[200px]">
        {/* Top row: Chapter badge + icon */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-white/70 font-black text-[10px] uppercase tracking-[0.2em]">
              Chapter {(index + 1).toString().padStart(2, "0")}
            </span>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${theme.badge}`}>
              <DiffIcon size={9} />
              {theme.label}
            </div>
          </div>
          <div className="text-4xl filter drop-shadow-lg">{emoji}</div>
        </div>

        {/* Title + Why */}
        <div className="mt-auto">
          <h3 className="text-white font-black text-lg leading-tight drop-shadow-md line-clamp-2">
            {card.title}
          </h3>
          {card.why && (
            <p className="text-white/60 text-[10px] font-medium mt-1 line-clamp-2 leading-relaxed">
              {card.why}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-yellow-300 fill-yellow-300" />
              <span className="text-yellow-100 dark:text-yellow-200 font-black text-sm drop-shadow-sm">{stats.totalExp} EXP</span>
            </div>
            {stats.estimatedMinutes > 0 && (
              <div className="flex items-center gap-0.5 bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
                <Clock size={8} className="text-white/80" />
                <span className="text-white/80 text-[9px] font-bold">{stats.estimatedMinutes}m</span>
              </div>
            )}
          </div>
          <span className="text-white/80 dark:text-white/70 text-xs font-bold drop-shadow-sm">
            {stats.done}/{stats.total} tasks
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full bg-black/20 dark:bg-black/30 border border-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${allDone ? "bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.5)]" : "bg-white/90"}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between">
          {allDone ? (
            <span className="text-yellow-200 font-black text-xs uppercase tracking-wider flex items-center gap-1 drop-shadow-sm">
              <Sparkles size={11} /> COMPLETED
            </span>
          ) : (
            <span className="text-white/80 font-bold text-xs drop-shadow-sm">
              {Math.round(progress)}% done
            </span>
          )}
          <button className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-black text-xs px-3 py-1.5 rounded-xl transition-all backdrop-blur-md border border-white/20">
            {allDone ? "Review" : "Start"} <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuestChapterGrid({
  onCardSelect,
}: {
  onCardSelect: (cardId: string) => void;
}) {
  const { cards, fetchCards, addCard, removeCard } = useCardStore();
  const [statsMap, setStatsMap] = useState<Record<string, CardStats>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  
  // Deletion state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CardType | null>(null);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    const loadStats = async () => {
      const results: Record<string, CardStats> = {};
      for (const card of cards) {
        const tasks = await taskService.getTasksByCardId(card.id);
        results[card.id] = {
          total: tasks.length,
          done: tasks.filter((t) => t.completed).length,
          totalExp: tasks.reduce((s, t) => s + (t.exp ?? 10), 0) + (card.bonusExp ?? 0),
          estimatedMinutes: tasks.reduce((s, t) => s + (t.estimated_minutes ?? 15), 0),
        };
      }
      setStatsMap(results);
    };
    if (cards.length > 0) loadStats();
  }, [cards]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addCard(newTitle);
    setNewTitle("");
    setIsAdding(false);
  };

  const handleOpenDelete = (e: React.MouseEvent, card: CardType) => {
    e.stopPropagation();
    setCardToDelete(card);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (cardToDelete) {
      await removeCard(cardToDelete.id);
      setIsDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={cardToDelete?.title ?? ""}
      />

      {/* Add new book row */}
      <div className="flex gap-2">
        {isAdding ? (
          <form onSubmit={handleCreate} className="flex gap-2 flex-1">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Quest book name..."
              className="flex-1 bg-white/50 dark:bg-white/10 border-2 border-slate-200 dark:border-white/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 font-bold rounded-xl px-4 py-2 outline-none focus:border-cyan-500"
            />
            <Button type="submit" className="bg-cyan-500 text-white font-bold rounded-xl">ADD</Button>
            <Button type="button" onPress={() => setIsAdding(false)} className="bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white rounded-xl">✕</Button>
          </form>
        ) : (
          <Button
            onPress={() => setIsAdding(true)}
            className="bg-white/80 dark:bg-white/10 hover:bg-white/100 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-slate-200 dark:border-white/20 font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} /> New Book
          </Button>
        )}
      </div>

      {/* Grid */}
      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="text-6xl">📖</div>
          <p className="text-slate-400 dark:text-white/60 font-black text-lg uppercase tracking-wider">No Quest Books Yet</p>
          <p className="text-slate-300 dark:text-white/40 text-sm">Create a book or import a quest JSON to start</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <QuestChapterCard
              key={card.id}
              card={card}
              index={i}
              stats={statsMap[card.id] ?? { total: 0, done: 0, totalExp: 0, estimatedMinutes: 0 }}
              onSelect={() => {
                useCardStore.getState().selectCard(card.id);
                onCardSelect(card.id);
              }}
              onDelete={(e) => handleOpenDelete(e, card)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
