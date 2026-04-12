"use client";
import { useState, useEffect } from "react";
import { useCardStore } from "./useCardStore";
import CardItem from "./CardItem";
import { Plus } from "lucide-react";
import { Input, Button } from "@heroui/react";
import { useQuestStore } from "../quest/useQuestStore";

export default function CardList() {
  const { cards, fetchCards, addCard, removeCard, selectCard, selectedCardId } = useCardStore();
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addCard(newTitle);
    setNewTitle("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-2 gap-2">
        <h3 className="text-slate-800 dark:text-white font-black text-xl tracking-wider transition-colors flex-1 truncate">QUEST BOOKS</h3>
        <Button 
          onPress={() => useQuestStore.getState().setImportModalOpen(true)}
          className="bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white font-bold h-10 px-3 transition-colors text-xs"
        >
          JSON
        </Button>
        <Button 
          isIconOnly
          onPress={() => setIsAdding(!isAdding)}
          className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors h-10 w-10 min-w-10"
        >
          <Plus size={20} className="font-bold" />
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="flex gap-2 mb-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter book name..."
            className="flex-1 bg-white dark:bg-zinc-900 border-2 border-slate-300 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-400 focus-within:!border-cyan-500 text-slate-800 dark:text-white rounded-xl"
            fullWidth
            autoFocus
          />
          <Button 
            type="submit" 
            className="bg-cyan-500 text-white font-bold h-12"
          >
            ADD
          </Button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {cards.map(card => (
          <CardItem 
            key={card.id} 
            card={card} 
            isSelected={selectedCardId === card.id}
            onSelect={selectCard}
            onDelete={removeCard}
          />
        ))}
        {cards.length === 0 && !isAdding && (
          <div className="text-slate-500 dark:text-zinc-500 text-center py-8 font-bold italic transition-colors">
            No active quest books. Create one!
          </div>
        )}
      </div>
    </div>
  );
}
