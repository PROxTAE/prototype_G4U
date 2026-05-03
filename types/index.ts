export type User = {
  id: string;
  name: string;
  level: number;
  xp: number;
  coin: number;
  energy: number;
  gems: number;
  health: {
    current: number;
    max: number;
  };
  hearts: number;
  maxHearts: number;
};

export type Card = {
  id: string;
  title: string;
  createdAt: string;
  type?: "quest" | "default";
  description?: string;
  difficulty?: "easy" | "medium" | "hard";
  bonusExp?: number;
  /** Why this quest matters — motivation text */
  why?: string;
  /** Clear definition of when this quest is considered "done" */
  definition_of_done?: string;
};

export type TaskStatus = "todo" | "in_progress" | "completed" | "skipped";
export type EnergyLevel = "low" | "medium" | "high";

export type Task = {
  id: string;
  cardId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  exp?: number;
  /** Specific, actionable micro-action description */
  micro_action?: string;
  /** How to verify this task is truly done */
  verification?: string;
  /** Estimated time in minutes (max 30) */
  estimated_minutes?: number;
  /** Energy cost: low, medium, or high */
  energy_required?: EnergyLevel;
  /** Task workflow status */
  status?: TaskStatus;
  /** IDs of tasks that must be completed before this one */
  depends_on?: string[];
};

export type AppData = {
  user: User;
  cards: Card[];
  tasks: Task[];
};
