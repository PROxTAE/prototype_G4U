"use client";
import { Lock, Book } from "lucide-react";
import Link from "next/link";
import ImportQuestModal from "@/features/quest/ImportQuestModal";

export default function RightActions() {
  return (
    <>
      <div className="absolute right-2 sm:right-6 py-20 sm:py-32 top-1/2 -translate-y-1/2 flex flex-col gap-4 sm:gap-6 z-10 scale-85 sm:scale-100 origin-right">

        {/* Quest Books → Navigate to /quest page */}
        <Link href="/quest" className="flex flex-col items-center gap-1 group cursor-pointer outline-none">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-[0_5px_15px_rgba(34,211,238,0.3)] dark:shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform border border-cyan-500 dark:border-cyan-300">
            <div className="bg-black/10 dark:bg-black/20 p-3 rounded-2xl backdrop-blur-sm">
              <Book className="text-white" size={32} />
            </div>
          </div>
          <span className="text-slate-800 dark:text-white font-black text-xs uppercase tracking-wider text-center leading-tight transition-colors">Quest<br />Books</span>
        </Link>

        {/* Monthly Card / Habit Tracker */}
        <div className="flex flex-col items-center gap-1 group cursor-pointer relative">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-amber-500 dark:from-amber-200 dark:to-yellow-500 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-amber-400 dark:border-amber-300">
            <div className="relative font-black text-white text-4xl">
              M
              <div className="absolute -top-1 -right-2 bg-red-500 w-4 h-4 rounded-full border border-white flex items-center justify-center">
                <span className="text-[8px]">!</span>
              </div>
            </div>
          </div>
          <span className="text-slate-800 dark:text-white font-black text-xs uppercase tracking-wider text-center leading-tight transition-colors">Monthly<br />Card</span>
        </div>

        {/* Battle Pass / Challenge Mode */}
        <div className="flex flex-col items-center gap-1 group cursor-pointer">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-400 dark:from-zinc-700 dark:to-zinc-900 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-slate-300 dark:border-zinc-600">
            <div className="relative">
              <Lock className="text-slate-500 dark:text-zinc-400" size={32} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-slate-400 dark:border-zinc-500 rounded-full opacity-50" />
              </div>
            </div>
          </div>
          <span className="text-slate-800 dark:text-white font-black text-xs uppercase tracking-wider text-center leading-tight transition-colors">Battle<br />Pass</span>
        </div>

      </div>

      <ImportQuestModal />
    </>
  );
}
