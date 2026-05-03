import { Card, Task, EnergyLevel, TaskStatus } from "@/types";
import { loadData, saveData } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export interface QuestTaskJSON {
  id?: string;
  title: string;
  micro_action: string;
  verification: string;
  estimated_minutes: number;
  exp: number;
  energy_required: EnergyLevel;
  status?: TaskStatus;
  depends_on?: string[];
}

export interface QuestJSON {
  title: string;
  why: string;
  definition_of_done: string;
  difficulty: "easy" | "medium" | "hard";
  bonusExp: number;
  description?: string;
  tasks: QuestTaskJSON[];
}

export const validateQuest = (jsonText: string): QuestJSON => {
  try {
    const data = JSON.parse(jsonText);
    
    if (!data.title || typeof data.title !== 'string') {
      throw new Error("Invalid Quest: 'title' is required and must be a string");
    }
    if (!data.why || typeof data.why !== 'string') {
      throw new Error("Invalid Quest: 'why' is required and must be a string");
    }
    if (!data.definition_of_done || typeof data.definition_of_done !== 'string') {
      throw new Error("Invalid Quest: 'definition_of_done' is required and must be a string");
    }
    if (!["easy", "medium", "hard"].includes(data.difficulty)) {
      throw new Error("Invalid Quest: 'difficulty' must be 'easy', 'medium', or 'hard'");
    }
    if (typeof data.bonusExp !== 'number') {
      throw new Error("Invalid Quest: 'bonusExp' is required and must be a number");
    }
    if (!Array.isArray(data.tasks)) {
      throw new Error("Invalid Quest: 'tasks' must be an array");
    }
    if (data.tasks.length < 1) {
      throw new Error("Invalid Quest: at least 1 task is required");
    }
    
    for (const task of data.tasks) {
      if (!task.title || typeof task.title !== 'string') {
        throw new Error("Invalid Task: 'title' is required and must be a string");
      }
      if (!task.micro_action || typeof task.micro_action !== 'string') {
        throw new Error("Invalid Task: 'micro_action' is required and must be a string");
      }
      if (!task.verification || typeof task.verification !== 'string') {
        throw new Error("Invalid Task: 'verification' is required and must be a string");
      }
      if (typeof task.exp !== 'number') {
        throw new Error("Invalid Task: 'exp' is required and must be a number");
      }
      if (typeof task.estimated_minutes !== 'number') {
        throw new Error("Invalid Task: 'estimated_minutes' must be a number");
      }
      if (!["low", "medium", "high"].includes(task.energy_required)) {
        throw new Error("Invalid Task: 'energy_required' must be 'low', 'medium', or 'high'");
      }
    }
    
    return data as QuestJSON;
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON format — please check your syntax");
    }
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
    description: validQuest.description || validQuest.definition_of_done,
    difficulty: validQuest.difficulty,
    bonusExp: validQuest.bonusExp,
    why: validQuest.why,
    definition_of_done: validQuest.definition_of_done,
  };
  
  // Build a map of user-provided task IDs → generated UUIDs for dependency resolution
  const taskIdMap: Record<string, string> = {};
  for (const t of validQuest.tasks) {
    const userTaskId = t.id || t.title; // fallback to title as key
    taskIdMap[userTaskId] = uuidv4();
  }
  
  const newTasks: Task[] = validQuest.tasks.map(t => {
    const userTaskId = t.id || t.title;
    const resolvedDependencies = (t.depends_on || [])
      .map(depId => taskIdMap[depId])
      .filter(Boolean);

    return {
      id: taskIdMap[userTaskId],
      cardId: newCard.id,
      title: t.title,
      completed: false,
      createdAt: new Date().toISOString(),
      exp: t.exp,
      micro_action: t.micro_action,
      verification: t.verification,
      estimated_minutes: t.estimated_minutes,
      energy_required: t.energy_required,
      status: (t.status as TaskStatus) || "todo",
      depends_on: resolvedDependencies,
    };
  });
  
  data.cards.push(newCard);
  data.tasks.push(...newTasks);
  
  saveData(data);
  return { card: newCard, tasks: newTasks };
};
