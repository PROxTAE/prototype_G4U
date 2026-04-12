import { create } from "zustand";
import { Task } from "@/types";
import * as taskService from "@/services/taskService";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: (cardId: string) => Promise<void>;
  addTask: (cardId: string, title: string) => Promise<void>;
  toggleTask: (id: string, onComplete?: () => void) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  editTask: (id: string, title: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  
  fetchTasks: async (cardId: string) => {
    set({ isLoading: true });
    const tasks = await taskService.getTasksByCardId(cardId);
    set({ tasks, isLoading: false });
  },
  
  addTask: async (cardId: string, title: string) => {
    const newTask = await taskService.createTask(cardId, title);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  toggleTask: async (id: string, onComplete?: () => void) => {
    const updatedTask = await taskService.toggleTask(id);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t))
    }));
    
    // Gamification hook
    if (updatedTask.completed && onComplete) {
      onComplete();
    }
  },
  
  removeTask: async (id: string) => {
    await taskService.deleteTask(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },
  
  editTask: async (id: string, title: string) => {
    const updatedTask = await taskService.updateTask(id, title);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t))
    }));
  }
}));
