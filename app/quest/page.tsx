"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Book, FileJson, Zap, Coins, ChevronLeft, Plus, Sparkles, Target } from "lucide-react";
import { Button } from "@heroui/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/features/user/useUserStore";
import { useQuestStore } from "@/features/quest/useQuestStore";
import QuestChapterGrid from "@/features/quest/QuestChapterGrid";
import QuestDetailView from "@/features/quest/QuestDetailView";
import ImportQuestModal from "@/features/quest/ImportQuestModal";
import GridBackground from "@/components/GridBackground";

type View = "chapters" | "detail";

export default function QuestPage() {
  const router = useRouter();
  const { user, loadUser } = useUserStore();
  const [view, setView] = useState<View>("chapters");

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const toggleImport = () => useQuestStore.getState().setImportModalOpen(true);

  return (
    <div className="relative min-h-[100dvh] bg-slate-50 dark:bg-[#0d0e1a] flex flex-col overflow-hidden transition-colors duration-500">
      <GridBackground />

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-400/10 dark:bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      {/* === HEADER SECTION === */}
      <header className="relative z-20 flex-shrink-0">
        {/* Banner with adaptive height */}
        <div className="absolute inset-0 h-[140px] sm:h-[180px] overflow-hidden">
          <Image
            src="/quest_banner_bg.png"
            alt="banner"
            fill
            className="object-cover opacity-30 dark:opacity-40"
            priority
          />
          {/* Gradients to blend banner */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-[#0d0e1a] dark:via-[#0d0e1a]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-[#0d0e1a]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-4 sm:px-8 pt-4 pb-2 sm:pt-6 mb-6">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            {/* Left: Navigation & Branding */}
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <Button
                isIconOnly
                onPress={() => view === "detail" ? setView("chapters") : router.push("/")}
                className="bg-white/60 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-2xl border border-slate-200/50 dark:border-white/10 backdrop-blur-xl shadow-sm transition-all"
              >
                <ArrowLeft size={18} className="sm:hidden" />
                <ChevronLeft size={20} className="hidden sm:block" />
              </Button>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: -10, scale: 0.9 }}
                    animate={{ rotate: 0, scale: 1 }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 shrink-0"
                  >
                    <Book size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                  </motion.div>
                  <h1 className="text-slate-900 dark:text-white font-black text-lg sm:text-2xl tracking-tight uppercase leading-none truncate">
                    {view === "detail" ? "Mission Log" : "Quest Archive"}
                  </h1>
                </div>
                <p className="text-slate-500 dark:text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] mt-1.5 ml-0 sm:ml-12 truncate">
                  {view === "detail" ? "Execution Phase" : "Select Your Path"}
                </p>
              </div>
            </div>

            {/* Right: Currency & Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              {user && (
                <div className="flex items-center gap-2 sm:gap-5 bg-white/40 dark:bg-black/20 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur-md">
                  {/* Gold */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 shadow-sm border-2 border-yellow-200/50 flex items-center justify-center">
                      <div className="w-1.5 h-2 border border-white/40 rounded-full" />
                    </div>
                    <span className="text-slate-900 dark:text-white font-black text-sm sm:text-lg tabular-nums">{user.coin}</span>
                  </div>
                  {/* XP */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Zap size={18} className="text-fuchsia-500 fill-fuchsia-500 sm:w-6 sm:h-6" />
                    <span className="text-slate-900 dark:text-white font-black text-sm sm:text-lg tabular-nums">{user.xp}</span>
                  </div>
                </div>
              )}

              {/* Desktop Import Button */}
              <Button
                onPress={toggleImport}
                className="hidden md:flex bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-black uppercase text-xs tracking-wider border-0 h-11 px-6 rounded-2xl shadow-lg shadow-purple-500/20 gap-2"
              >
                <FileJson size={16} /> Import Quest
              </Button>
            </div>
          </div>

          {/* Sub-nav / Breadcrumb style */}
          <div className="max-w-7xl mx-auto mt-4 sm:mt-6 px-1 flex items-center gap-3">
            <div className={`flex items-center gap-2 pb-2 px-1 border-b-2 transition-colors ${view === "chapters" ? "border-cyan-500 dark:border-cyan-400" : "border-transparent"}`}>
              <Sparkles size={14} className={view === "chapters" ? "text-cyan-500" : "text-slate-300 dark:text-white/10"} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${view === "chapters" ? "text-slate-900 dark:text-cyan-400" : "text-slate-400 dark:text-white/20"}`}>Chapters</span>
            </div>
            {view === "detail" && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
                <div className="flex items-center gap-2 pb-2 px-1 border-b-2 border-fuchsia-500 dark:border-fuchsia-400">
                  <Target size={14} className="text-fuchsia-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-fuchsia-400">Objectives</span>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* === MAIN CONTENT === */}
      <main className="relative z-10 flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {view === "chapters" ? (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar"
            >
              <div className="max-w-7xl mx-auto">
                <QuestChapterGrid onCardSelect={() => setView("detail")} />

                {/* Mobile FAB for Import */}
                <div className="md:hidden mt-12 mb-8 flex justify-center">
                  <Button
                    onPress={toggleImport}
                    className="bg-white dark:bg-zinc-900 text-slate-700 dark:text-white font-black uppercase text-[10px] tracking-widest px-6 h-12 rounded-full border-2 border-slate-200 dark:border-white/10 shadow-xl flex items-center gap-2"
                  >
                    <Plus size={16} className="text-fuchsia-500" />
                    Import New Quest
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, type: "spring", damping: 25 }}
              className="flex-1 flex flex-col p-0 sm:px-8 sm:pb-8 sm:pt-4 overflow-hidden"
            >
              <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
                <div className="flex-1 bg-white dark:bg-zinc-900 sm:rounded-[32px] overflow-hidden border-t sm:border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col">
                  <QuestDetailView onBack={() => setView("chapters")} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Sticky CTA for detail view navigation could go here, but back button is enough */}

      {/* Modals */}
      <ImportQuestModal />
    </div>
  );
}
