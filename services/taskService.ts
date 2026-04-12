import { Task } from "@/types";
import { loadData, saveData } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export const getTasksByCardId = async (cardId: string): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  return data.tasks.filter(t => t.cardId === cardId);
};

export const createTask = async (cardId: string, title: string): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  const newTask: Task = {
    id: uuidv4(),
    cardId,
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  data.tasks.push(newTask);
  saveData(data);
  return newTask;
};

export const toggleTask = async (id: string): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  const taskIndex = data.tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) throw new Error("Task not found");
  
  data.tasks[taskIndex].completed = !data.tasks[taskIndex].completed;
  saveData(data);
  return data.tasks[taskIndex];
};

export const updateTask = async (id: string, title: string): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  const taskIndex = data.tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) throw new Error("Task not found");
  
  data.tasks[taskIndex].title = title;
  saveData(data);
  return data.tasks[taskIndex];
};

export const deleteTask = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  data.tasks = data.tasks.filter(t => t.id !== id);
  saveData(data);
};
