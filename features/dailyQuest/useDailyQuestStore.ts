import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DailyQuest, DailyQuestState } from "@/types/quest";
import * as dailyQuestService from "@/services/dailyQuestService";
import { evaluateTaskForQuest } from "@/services/conditionEngine";
import { Task } from "@/types";

interface DailyQuestStore extends DailyQuestState {
  initQuests: () => void;
  updateProgress: (task: Task) => boolean; // returns true if any quest was progressed
  claimReward: (questId: string) => { exp: number, coin: number } | null;
  claimMilestone: (point: number) => { reward: string } | null;
}

export const useDailyQuestStore = create<DailyQuestStore>()(
  persist(
    (set, get) => ({
      quests: [],
      totalPoints: 0,
      lastResetDate: null,
      streak: 0,
      claimedMilestones: [],

      initQuests: () => {
        const { lastResetDate } = get();
        if (dailyQuestService.shouldResetQuests(lastResetDate as number)) {
          console.log("🌞 Resetting Daily Quests at 05:00 AM Bangkok Time!");
          set({
            quests: dailyQuestService.generateDailyQuests(),
            totalPoints: 0,
            lastResetDate: new Date().getTime(),
            claimedMilestones: [],
          });
        }
      },

      updateProgress: (task: Task) => {
        const { quests } = get();
        let changed = false;

        const updatedQuests = quests.map(quest => {
          if (!quest.completed && evaluateTaskForQuest(task, quest)) {
            const newProgress = quest.progress + 1;
            const completed = newProgress >= quest.targetCount;
            changed = true;
            return { ...quest, progress: newProgress, completed };
          }
          return quest;
        });

        if (changed) {
          set({ quests: updatedQuests });
        }
        return changed;
      },

      claimReward: (questId: string) => {
        const { quests, totalPoints } = get();
        const quest = quests.find(q => q.id === questId);

        if (quest && quest.completed && !quest.rewardClaimed) {
          const updatedQuests = quests.map(q => 
            q.id === questId ? { ...q, rewardClaimed: true } : q
          );
          
          set({ 
            quests: updatedQuests, 
            totalPoints: totalPoints + quest.pointValue 
          });

          return { exp: quest.exp, coin: quest.coin };
        }
        return null;
      },

      claimMilestone: (point: number) => {
        const { totalPoints, claimedMilestones } = get();
        if (totalPoints >= point && !claimedMilestones.includes(point)) {
          set({ claimedMilestones: [...claimedMilestones, point] });
          return { reward: "Legendary Loot Box" };
        }
        return null;
      }
    }),
    {
      name: "g4u-daily-quests",
    }
  )
);
