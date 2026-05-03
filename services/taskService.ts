import { Task, TaskStatus, EnergyLevel } from "@/types";
import { loadData, saveData } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export const getTasksByCardId = async (cardId: string): Promise<Task[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  return data.tasks.filter(t => t.cardId === cardId);
};

export interface CreateTaskOptions {
  cardId: string;
  title: string;
  micro_action?: string;
  verification?: string;
  estimated_minutes?: number;
  exp?: number;
  energy_required?: EnergyLevel;
  depends_on?: string[];
}

export const createTask = async (cardId: string, title: string, options?: Partial<CreateTaskOptions>): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  const newTask: Task = {
    id: uuidv4(),
    cardId,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    exp: options?.exp,
    micro_action: options?.micro_action,
    verification: options?.verification,
    estimated_minutes: options?.estimated_minutes,
    energy_required: options?.energy_required || "low",
    status: "todo",
    depends_on: options?.depends_on || [],
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
  
  const task = data.tasks[taskIndex];
  task.completed = !task.completed;
  task.status = task.completed ? "completed" : "todo";
  
  saveData(data);
  return task;
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

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  const taskIndex = data.tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) throw new Error("Task not found");
  
  data.tasks[taskIndex].status = status;
  if (status === "completed") {
    data.tasks[taskIndex].completed = true;
  } else if (status === "todo") {
    data.tasks[taskIndex].completed = false;
  }
  
  saveData(data);
  return data.tasks[taskIndex];
};

export const deleteTask = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const data = loadData();
  data.tasks = data.tasks.filter(t => t.id !== id);
  saveData(data);
};

/**
 * Check if all dependencies of a task are completed
 */
export const areTaskDependenciesMet = (task: Task, allTasks: Task[]): boolean => {
  if (!task.depends_on || task.depends_on.length === 0) return true;
  return task.depends_on.every(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return depTask?.completed ?? false;
  });
};
