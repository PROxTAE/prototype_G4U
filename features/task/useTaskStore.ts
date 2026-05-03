import { create } from "zustand";
import { Task, TaskStatus } from "@/types";
import * as taskService from "@/services/taskService";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: (cardId: string) => Promise<void>;
  addTask: (cardId: string, title: string, options?: Partial<taskService.CreateTaskOptions>) => Promise<void>;
  toggleTask: (id: string, onComplete?: () => void) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  editTask: (id: string, title: string) => Promise<void>;
  updateStatus: (id: string, status: TaskStatus) => Promise<void>;
  isTaskBlocked: (task: Task) => boolean;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  
  fetchTasks: async (cardId: string) => {
    set({ isLoading: true });
    const tasks = await taskService.getTasksByCardId(cardId);
    set({ tasks, isLoading: false });
  },
  
  addTask: async (cardId: string, title: string, options?: Partial<taskService.CreateTaskOptions>) => {
    const newTask = await taskService.createTask(cardId, title, options);
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  
  toggleTask: async (id: string, onComplete?: () => void) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === id);
    
    // Block if dependencies aren't met
    if (task && !task.completed && !taskService.areTaskDependenciesMet(task, tasks)) {
      return; // Don't toggle — task is locked
    }
    
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
  },

  updateStatus: async (id: string, status: TaskStatus) => {
    const updatedTask = await taskService.updateTaskStatus(id, status);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t))
    }));
  },

  isTaskBlocked: (task: Task): boolean => {
    const { tasks } = get();
    return !taskService.areTaskDependenciesMet(task, tasks);
  },
}));
