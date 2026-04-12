import { create } from "zustand";
import { Card } from "@/types";
import * as cardService from "@/services/cardService";

interface CardState {
  cards: Card[];
  isLoading: boolean;
  selectedCardId: string | null;
  fetchCards: () => Promise<void>;
  addCard: (title: string) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  editCard: (id: string, title: string) => Promise<void>;
  selectCard: (id: string | null) => void;
}

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  isLoading: false,
  selectedCardId: null,
  
  fetchCards: async () => {
    set({ isLoading: true });
    const cards = await cardService.getCards();
    set({ cards, isLoading: false });
  },
  
  addCard: async (title: string) => {
    const newCard = await cardService.createCard(title);
    set((state) => ({ cards: [...state.cards, newCard] }));
  },
  
  removeCard: async (id: string) => {
    await cardService.deleteCard(id);
    set((state) => ({ 
      cards: state.cards.filter((c) => c.id !== id),
      selectedCardId: state.selectedCardId === id ? null : state.selectedCardId 
    }));
  },
  
  editCard: async (id: string, title: string) => {
    const updatedCard = await cardService.updateCard(id, title);
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? updatedCard : c))
    }));
  },
  
  selectCard: (id: string | null) => {
    set({ selectedCardId: id });
  }
}));
