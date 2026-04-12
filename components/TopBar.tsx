"use client";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useUserStore } from "@/features/user/useUserStore";
import { useEffect } from "react";
import XPBar from "./XPBar";

export default function TopBar() {
  const { user, loadUser } = useUserStore();
  
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Fallback to avoid hydration errors
  if (!user) return <div className="flex w-full justify-between items-start p-2 sm:p-6 lg:p-8 z-10 relative mt-4 sm:mt-8 h-24"></div>;

  return (
    <div className="flex w-full justify-between items-start p-2 sm:p-6 lg:p-8 z-10 relative mt-4 sm:mt-8">
      <div className="flex gap-2">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-[1.5rem] border-[3px] border-cyan-500 dark:border-cyan-300 overflow-hidden bg-slate-200 dark:bg-zinc-800 shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:shadow-[0_0_15px_rgba(103,232,249,0.5)] relative">
             <Image src="/character/T_IconRole_Pile_zanni_UI.png" alt="Avatar" fill sizes="64px" className="object-cover" />
          </div>
          <div className="absolute -bottom-3 -left-2 bg-white dark:bg-black text-slate-900 dark:text-white px-2 py-1 rounded-[0.7rem] border-2 border-cyan-500 dark:border-cyan-400 text-xs font-bold shadow-lg">
             <div className="text-center text-lg text-white  leading-none mt-1">{user.level}</div>
             <div className="text-[8px] uppercase text-cyan-500 dark:text-cyan-400 leading-none">LEVEL</div>
          </div>
        </div>
        
        {/* Name, ID, and XP Bar */}
        <div className="flex flex-col justify-center ml-2 gap-1">
          <h2 className="text-slate-900 dark:text-white font-black text-xl tracking-wider leading-none uppercase">{user.name}</h2>
          <span className="text-slate-500 dark:text-zinc-400 text-sm font-semibold tracking-widest uppercase">ID: {user.id}</span>
          <XPBar />
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-3">
           {/* Currency 1: Coin */}
           <div className="flex items-center gap-2">
              <div className="bg-green-400 px-1 py-1.5 rounded-sm transform -rotate-12"><div className="w-3 h-4 border-2 border-white/50 rounded-sm" /></div>
              <span className="text-slate-800 dark:text-white font-black text-lg">{user.coin}</span>
           </div>
           {/* Currency 2: XP */}
           <div className="flex items-center gap-2 ml-2">
              <div className="w-5 h-6 bg-fuchsia-500 rounded-sm transform rotate-[30deg] shadow-[0_0_10px_rgba(217,70,239,0.4)] dark:shadow-[0_0_10px_rgba(217,70,239,0.8)]" />
              <span className="text-slate-800 dark:text-white font-black text-lg">{user.xp}</span>
           </div>
           {/* Add Button */}
           <button className="bg-slate-800 text-white dark:bg-white/90 dark:text-black p-1 rounded-sm ml-2 hover:bg-slate-700 dark:hover:bg-white transition-colors">
             <Plus size={20} strokeWidth={4} />
           </button>
        </div>
      </div>
    </div>
  )
}
