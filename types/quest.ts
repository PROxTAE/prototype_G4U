export type ConditionType = "complete_task_with_tag" | "complete_task_count";

export type Condition =
  | { type: "complete_task_with_tag"; tag: string; count: number }
  | { type: "complete_task_count"; count: number };

export type DailyQuest = {
  id: string;
  title: string;
  description: string;
  exp: number;
  coin: number;
  pointValue: number; // For the top 0/100 bar
  completed: boolean;
  rewardClaimed: boolean;
  progress: number;
  targetCount: number;
  condition: Condition;
  createdAt: string;
};

export type DailyQuestState = {
  quests: DailyQuest[];
  totalPoints: number;
  lastResetDate: number | null;
  streak: number;
  claimedMilestones: number[]; // e.g. [20, 40, 60, 80, 100]
};
