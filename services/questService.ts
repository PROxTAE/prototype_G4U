import { Card, Task } from "@/types";
import { loadData, saveData } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export interface QuestJSON {
  title: string;
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  tasks: {
    title: string;
    exp: number;
  }[];
  bonusExp?: number;
}

export const validateQuest = (jsonText: string): QuestJSON => {
  try {
    const data = JSON.parse(jsonText);
    
    if (!data.title || typeof data.title !== 'string') {
      throw new Error("Invalid Quest: 'title' is required and must be a string");
    }
    if (!Array.isArray(data.tasks)) {
      throw new Error("Invalid Quest: 'tasks' must be an array");
    }
    
    for (const task of data.tasks) {
      if (!task.title || typeof task.title !== 'string') {
        throw new Error("Invalid Task: 'title' is required and must be a string");
      }
      if (typeof task.exp !== 'number') {
        throw new Error("Invalid Task: 'exp' is required and must be a number");
      }
    }
    
    return data as QuestJSON;
  } catch (error: any) {
    throw new Error(error.message || "Invalid JSON format");
  }
};

export const importQuestFromJSON = async (jsonText: string): Promise<{ card: Card, tasks: Task[] }> => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate async save
  const validQuest = validateQuest(jsonText);
  
  const data = loadData();
  
  const newCard: Card = {
    id: uuidv4(),
    title: validQuest.title,
    createdAt: new Date().toISOString(),
    type: "quest",
    description: validQuest.description,
    difficulty: validQuest.difficulty || "medium",
    bonusExp: validQuest.bonusExp || 0
  };
  
  const newTasks: Task[] = validQuest.tasks.map(t => ({
    id: uuidv4(),
    cardId: newCard.id,
    title: t.title,
    completed: false,
    createdAt: new Date().toISOString(),
    exp: t.exp
  }));
  
  data.cards.push(newCard);
  data.tasks.push(...newTasks);
  
  saveData(data);
  return { card: newCard, tasks: newTasks };
};
