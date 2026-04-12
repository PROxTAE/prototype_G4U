import { create } from "zustand";
import { User } from "@/types";
import * as userService from "@/services/userService";

interface UserState {
  user: User | null;
  loadUser: () => Promise<void>;
  gainRewards: (xp: number, coin: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  
  loadUser: async () => {
    const user = await userService.getUser();
    set({ user });
  },
  
  gainRewards: async (xp: number, coin: number) => {
    const updatedUser = await userService.addRewards(xp, coin);
    set({ user: updatedUser });
  }
}));
