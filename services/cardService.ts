import { Card } from "@/types";
import { loadData, saveData } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export const getCards = async (): Promise<Card[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  return data.cards;
};

export const createCard = async (title: string): Promise<Card> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  const newCard: Card = {
    id: uuidv4(),
    title,
    createdAt: new Date().toISOString()
  };
  data.cards.push(newCard);
  saveData(data);
  return newCard;
};

export const updateCard = async (id: string, title: string): Promise<Card> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  const cardIndex = data.cards.findIndex(c => c.id === id);
  if (cardIndex === -1) throw new Error("Card not found");
  data.cards[cardIndex].title = title;
  saveData(data);
  return data.cards[cardIndex];
};

export const deleteCard = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  data.cards = data.cards.filter(c => c.id !== id);
  // Also delete associated tasks
  data.tasks = data.tasks.filter(t => t.cardId !== id);
  saveData(data);
};
