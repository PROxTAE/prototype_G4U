import { create } from "zustand";
import * as questService from "@/services/questService";
import { useCardStore } from "@/features/card/useCardStore";
import { useTaskStore } from "@/features/task/useTaskStore";

interface QuestState {
  isImportModalOpen: boolean;
  setImportModalOpen: (isOpen: boolean) => void;
  importQuest: (jsonText: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useQuestStore = create<QuestState>((set) => ({
  isImportModalOpen: false,
  setImportModalOpen: (isOpen: boolean) => set({ isImportModalOpen: isOpen }),
  isLoading: false,
  error: null,
  setError: (error: string | null) => set({ error }),
  importQuest: async (jsonText: string) => {
    set({ isLoading: true, error: null });
    try {
      const { card, tasks } = await questService.importQuestFromJSON(jsonText);
      // Update other stores
      useCardStore.setState((state) => ({ cards: [...state.cards, card], selectedCardId: card.id }));
      useTaskStore.setState({ tasks: tasks });
      
      set({ isLoading: false, isImportModalOpen: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to import quest", isLoading: false });
      throw err;
    }
  }
}));
