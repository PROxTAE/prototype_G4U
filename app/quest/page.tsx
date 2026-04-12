"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Book, FileJson, Zap, Coins } from "lucide-react";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useUserStore } from "@/features/user/useUserStore";
import { useQuestStore } from "@/features/quest/useQuestStore";
import QuestChapterGrid from "@/features/quest/QuestChapterGrid";
import QuestDetailView from "@/features/quest/QuestDetailView";
import ImportQuestModal from "@/features/quest/ImportQuestModal";

type View = "chapters" | "detail";

export default function QuestPage() {
  const router = useRouter();
  const { user, loadUser } = useUserStore();
  const [view, setView] = useState<View>("chapters");

  useEffect(() => { loadUser(); }, [loadUser]);

  return (
    <div className="relative min-h-[100dvh] bg-slate-50 dark:bg-[#0d0e1a] flex flex-col overflow-hidden transition-colors duration-500">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-400/10 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-400/10 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* === BANNER HEADER === */}
      <header className="relative z-20 overflow-hidden flex-shrink-0">
        {/* Banner image */}
        <div className="absolute inset-0">
          <Image src="/quest_banner_bg.png" alt="banner" fill className="object-cover opacity-40 dark:opacity-60" />
          {/* Light mode gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/70 to-transparent dark:hidden" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:hidden" />
          {/* Dark mode gradient */}
          <div className="absolute inset-0 hidden dark:block bg-gradient-to-r from-[#0d0e1a]/90 via-[#0d0e1a]/60 to-transparent" />
          <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-transparent to-[#0d0e1a]" />
        </div>

        <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-4">
            <Button
              isIconOnly
              onPress={() => view === "detail" ? setView("chapters") : router.push("/")}
              className="bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-xl border border-slate-200 dark:border-white/20 backdrop-blur-md"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                  <Book size={14} className="text-white" />
                </div>
                <h1 className="text-slate-900 dark:text-white font-black text-xl tracking-wider uppercase leading-none">
                  {view === "detail" ? "Quest Detail" : "Quest Books"}
                </h1>
              </div>
              <p className="text-slate-500 dark:text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 ml-9">
                {view === "detail" ? "completing objectives" : "select your chapter"}
              </p>
            </div>
          </div>

          {/* Right: user stats + import */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-3 bg-white/60 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-xl px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-fuchsia-500 rounded flex items-center justify-center shadow-sm">
                    <Zap size={12} className="text-white fill-white" />
                  </div>
                  <span className="text-slate-800 dark:text-white font-black text-sm">{user.xp} XP</span>
                </div>
                <div className="w-px h-4 bg-slate-300 dark:bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-amber-400 rounded flex items-center justify-center shadow-sm">
                    <Coins size={12} className="text-white" />
                  </div>
                  <span className="text-slate-800 dark:text-white font-black text-sm">{user.coin}G</span>
                </div>
              </div>
            )}
            <Button
              onPress={() => useQuestStore.getState().setImportModalOpen(true)}
              className="hidden sm:flex bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold border-0 gap-1.5 shadow-[0_5px_15px_rgba(168,85,247,0.3)]"
            >
              <FileJson size={15} /> Import JSON
            </Button>
          </div>
        </div>

        {/* Tab nav for view state */}
        {view === "chapters" && (
          <nav className="relative z-10 flex gap-1 px-8 pb-0">
            <div className="flex items-center gap-2 border-b-2 border-cyan-500 dark:border-cyan-400 pb-2 px-1">
              <Book size={14} className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-slate-800 dark:text-cyan-400 font-black text-sm uppercase tracking-wider">All Books</span>
            </div>
          </nav>
        )}
      </header>

      {/* === MAIN CONTENT === */}
      <main className={`relative z-10 flex-1 px-4 sm:px-8 py-6 ${view === "chapters" ? "overflow-y-auto" : "overflow-hidden"}`}>
        {view === "chapters" ? (
          <QuestChapterGrid onCardSelect={() => setView("detail")} />
        ) : (
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl flex-1 flex flex-col">
              <QuestDetailView onBack={() => setView("chapters")} />
            </div>
          </div>
        )}
      </main>

      {/* Import JSON modal */}
      <ImportQuestModal />
    </div>
  );
}
