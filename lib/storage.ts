import { AppData, User, Card, Task } from "@/types";

const STORAGE_KEY = "g4u-data";

const defaultData: AppData = {
  user: {
    id: "256",
    name: "LAU REN",
    level: 17,
    xp: 0,
    coin: 0,
    energy: 623410,
    gems: 233,
    health: { current: 68, max: 100 },
    hearts: 3,
    maxHearts: 4,
  },
  cards: [],
  tasks: [],
};

// Ready for API migration (currently wrapping localStorage in async-like behavior)

export const loadData = (): AppData => {
  if (typeof window === "undefined") return defaultData;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    saveData(defaultData);
    return defaultData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultData;
  }
};

export const saveData = (data: AppData) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
