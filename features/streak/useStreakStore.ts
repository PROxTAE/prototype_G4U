import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Streak, StreakState, WeeklyStatus } from "@/types/streak";
import * as streakService from "@/services/streakService";

const initialWeeklyStatus: WeeklyStatus = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false,
};

const initialStreak: Streak = {
  current: 0,
  longest: 0,
  lastCompletedDate: null,
  weeklyStatus: initialWeeklyStatus,
};

interface StreakStore extends StreakState {
  initStreak: () => void;
  completeDaily: () => void;
  addXp: (amount: number) => void;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      streak: initialStreak,
      xpProgress: 5863, // Starting with mock data from reference
      xpTarget: 8000,

      initStreak: () => {
        const { streak } = get();
        
        // 1. Check if streak is broken
        if (streakService.isStreakBroken(streak.lastCompletedDate)) {
          set((state) => ({
            streak: {
              ...state.streak,
              current: 0,
              // Keep longest
            }
          }));
        }

        // 2. Check if weekly status should reset (Monday 05:00 AM)
        if (streakService.shouldResetWeekly(streak.lastCompletedDate)) {
          set((state) => ({
            streak: {
              ...state.streak,
              weeklyStatus: initialWeeklyStatus
            }
          }));
        }
      },

      completeDaily: () => {
        const { streak } = get();
        const todayGameDay = streakService.getGameDay();

        // Avoid double completion on the same game day
        if (streak.lastCompletedDate === todayGameDay) return;

        const newCurrent = streak.current + 1;
        const newLongest = Math.max(newCurrent, streak.longest);
        const newWeekly = streakService.updateWeeklyStatus(streak.weeklyStatus, todayGameDay);

        set({
          streak: {
            current: newCurrent,
            longest: newLongest,
            lastCompletedDate: todayGameDay,
            weeklyStatus: newWeekly,
          }
        });
      },

      addXp: (amount: number) => {
        set((state) => {
          let newProgress = state.xpProgress + amount;
          let newTarget = state.xpTarget;
          
          // Level up logic (simple)
          if (newProgress >= newTarget) {
            newProgress -= newTarget;
            newTarget += 1000; // Increase target for next level
          }

          return { xpProgress: newProgress, xpTarget: newTarget };
        });
      },
    }),
    {
      name: "g4u-streak-data",
    }
  )
);
