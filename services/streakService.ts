import { Streak, WeeklyStatus } from "@/types/streak";

/**
 * Get current game day as a string (YYYY-MM-DD)
 * A game day starts at 05:00 AM.
 */
export const getGameDay = (date: Date = new Date()): string => {
  const d = new Date(date);
  // Subtract 5 hours to align with 05:00 AM reset
  d.setHours(d.getHours() - 5);
  return d.toISOString().split("T")[0];
};

/**
 * Check if the streak should be reset because a day was missed.
 * Returns true if the last completion was more than 1 game day ago.
 */
export const isStreakBroken = (lastCompletedDate: string | null): boolean => {
  if (!lastCompletedDate) return false;

  const todayGameDay = getGameDay();
  const lastGameDay = lastCompletedDate;

  const todayDate = new Date(todayGameDay);
  const lastDate = new Date(lastGameDay);

  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 1;
};

/**
 * Updates the weekly status object based on the current day.
 */
export const updateWeeklyStatus = (currentStatus: WeeklyStatus, day: string): WeeklyStatus => {
  const date = new Date(day);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase() as keyof WeeklyStatus;
  
  return {
    ...currentStatus,
    [dayName]: true,
  };
};

/**
 * Check if we should reset the weekly tracker (on Monday morning)
 */
export const shouldResetWeekly = (lastCompletedDate: string | null): boolean => {
  if (!lastCompletedDate) return false;
  
  const today = new Date();
  const last = new Date(lastCompletedDate);
  
  // If today is a new week compared to last completed date
  // A simple way: check if Sunday has passed between last and today
  // Or simpler: check if Monday 05:00 AM has passed since the last completion.
  
  const mondayReset = new Date();
  mondayReset.setHours(5, 0, 0, 0);
  mondayReset.setDate(mondayReset.getDate() - (mondayReset.getDay() === 0 ? 6 : mondayReset.getDay() - 1));
  
  return last < mondayReset && today >= mondayReset;
};
