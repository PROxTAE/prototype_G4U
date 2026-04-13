export type WeeklyStatus = {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
};

export type Streak = {
  current: number;
  longest: number;
  lastCompletedDate: string | null; // ISO string
  weeklyStatus: WeeklyStatus;
};

export type StreakState = {
  streak: Streak;
  xpProgress: number;
  xpTarget: number;
};
