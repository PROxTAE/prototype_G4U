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
};

export type Task = {
  id: string;
  cardId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  exp?: number;
};

export type AppData = {
  user: User;
  cards: Card[];
  tasks: Task[];
};
