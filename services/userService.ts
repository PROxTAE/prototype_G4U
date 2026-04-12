import { User } from "@/types";
import { loadData, saveData } from "@/lib/storage";

export const getUser = async (): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return loadData().user;
};

export const addRewards = async (xp: number, coin: number): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  const data = loadData();
  
  data.user.xp += xp;
  data.user.coin += coin;
  
  data.user.level = Math.floor(Math.sqrt(data.user.xp / 100)) + 1;
  
  saveData(data);
  return data.user;
};
