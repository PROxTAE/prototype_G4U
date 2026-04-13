import { v4 as uuidv4 } from "uuid";
import { DailyQuest, Condition } from "@/types/quest";

const QUEST_TEMPLATES: Omit<DailyQuest, "id" | "progress" | "completed" | "rewardClaimed" | "createdAt">[] = [
  {
    title: "Morning Routine",
    description: "Complete any 3 tasks today",
    exp: 50,
    coin: 20,
    pointValue: 20,
    targetCount: 3,
    condition: { type: "complete_task_count", count: 3 }
  },
  {
    title: "Focus Master",
    description: "Complete a task related to 'Study' or 'Work'",
    exp: 40,
    coin: 15,
    pointValue: 20,
    targetCount: 1,
    condition: { type: "complete_task_count", count: 1 }
  },
  {
    title: "Goal Getter",
    description: "Clear 5 objectives to boost your streak",
    exp: 100,
    coin: 50,
    pointValue: 40,
    targetCount: 5,
    condition: { type: "complete_task_count", count: 5 }
  },
  {
    title: "Specialist",
    description: "Clear 8 objectives to boost your streak",
    exp: 150,
    coin: 50,
    pointValue: 40,
    targetCount: 8,
    condition: { type: "complete_task_count", count: 8 }
  }
];

export const generateDailyQuests = (): DailyQuest[] => {
  // Randomly pick 3 distinct templates
  const shuffled = [...QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map(template => ({
    ...template,
    id: uuidv4(),
    progress: 0,
    completed: false,
    rewardClaimed: false,
    createdAt: new Date().toISOString()
  }));
};

export const getNextResetTime = (): Date => {
  const now = new Date();
  const resetTime = new Date(now);
  
  // Set to 05:00:00.000
  resetTime.setHours(5, 0, 0, 0);
  
  // If we already passed 05:00 today, the next reset is tomorrow 05:00
  if (now >= resetTime) {
    resetTime.setDate(resetTime.getDate() + 1);
  }
  
  return resetTime;
};

export const shouldResetQuests = (lastResetTimestamp: number | null): boolean => {
  if (!lastResetTimestamp) return true;
  
  const now = new Date().getTime();
  const lastReset = new Date(lastResetTimestamp);
  
  // Calculate what the reset time WOULD have been relative to the last reset
  // If more than 24 hours passed, or if we crossed a 05:00 AM boundary
  const nextResetFromLast = new Date(lastReset);
  nextResetFromLast.setHours(5, 0, 0, 0);
  if (lastReset >= nextResetFromLast) {
    nextResetFromLast.setDate(nextResetFromLast.getDate() + 1);
  }

  return now >= nextResetFromLast.getTime();
};
