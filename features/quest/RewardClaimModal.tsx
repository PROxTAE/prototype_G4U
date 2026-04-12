"use client";
import { useEffect } from "react";
import { Modal, Button } from "@heroui/react";
import { Zap, Coins, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";
import { playSound } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";

interface RewardClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
  coin: number;
  isQuestComplete?: boolean;
  questTitle?: string;
}

export default function RewardClaimModal({
  isOpen,
  onClose,
  xp,
  coin,
  isQuestComplete = false,
  questTitle,
}: RewardClaimModalProps) {
  useEffect(() => {
    if (isOpen) {
      playSound("success");
    }
  }, [isOpen]);

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => !open && onClose()}
        variant="blur"
        className="" 
        isDismissable={false}
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog aria-label="Quest Rewards" className="overflow-hidden border-0 bg-transparent shadow-md p-0">
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="relative flex flex-col items-center text-center p-1"
                >
                  {/* Outer Frame with Glow */}
                  <div className="absolute inset-0" />

                  <div className="relative w-full bg-white dark:bg-zinc-950/90 border-2 rounded-3xl  overflow-hidden ">
                    
                    {/* Celebratory Background Image/Overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                       <Image
                         src="/quest_reward_popup_bg_1775967555871.png" // Using existing artifact path or similar pattern
                         alt="reward stars"
                         fill
                         className="object-cover opacity-60 mix-blend-screen scale-110"
                       />
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/20 dark:via-blue-950/50 dark:to-zinc-950" />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 flex flex-col items-center px-8 pt-12 pb-10 gap-6">
                      
                      {/* Top Icon Area */}
                      <motion.div 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.6)] border-4 border-white/50">
                          {isQuestComplete ? (
                            <Trophy size={48} className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]" />
                          ) : (
                            <Sparkles size={48} className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]" />
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-yellow-300/30 animate-[ping_3s_infinite]" />
                      </motion.div>

                      {/* Headline */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-1"
                      >
                        <p className="text-amber-500 dark:text-yellow-400 font-black text-xs uppercase tracking-[0.4em] drop-shadow-sm">
                           {isQuestComplete ? "🎉 QUEST COMPLETE! 🎉" : "✨ OBJECTIVE CLEARED! ✨"}
                        </p>
                        <p className="text-slate-500 dark:text-white/60 font-black text-[10px] uppercase tracking-widest truncate max-w-[200px] mb-1">
                           {questTitle || "Objective Completed"}
                        </p>
                        <h2 className="text-slate-900 dark:text-white font-black text-4xl leading-tight tracking-tighter drop-shadow-md">
                           REWARDS EARNED
                        </h2>
                      </motion.div>

                      {/* Reward Cards Staggered */}
                      <div className="flex gap-4 w-full justify-center">
                        <motion.div 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-5 min-w-[120px] group hover:scale-105 transition-all shadow-sm"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-700 flex items-center justify-center shadow-[0_5px_15px_rgba(217,70,239,0.4)] group-hover:rotate-6 transition-transform">
                             <Zap size={28} className="text-white fill-white" />
                          </div>
                          <div className="mt-1">
                             <p className="text-slate-900 dark:text-white font-black text-2xl leading-none">+{xp}</p>
                             <p className="text-fuchsia-500 dark:text-fuchsia-400 font-black text-[9px] uppercase tracking-widest mt-1">Experience</p>
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7 }}
                          className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-5 min-w-[120px] group hover:scale-105 transition-all shadow-sm"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-[0_5px_15px_rgba(251,191,36,0.4)] group-hover:-rotate-6 transition-transform">
                             <Coins size={28} className="text-white" />
                          </div>
                          <div className="mt-1">
                             <p className="text-slate-900 dark:text-white font-black text-2xl leading-none">+{coin}</p>
                             <p className="text-amber-500 dark:text-amber-400 font-black text-[9px] uppercase tracking-widest mt-1">Gold Coins</p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Main Button */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="w-full mt-2"
                      >
                         <Button
                           onPress={onClose}
                           className="w-full h-14 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white dark:text-slate-900 font-black text-base rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] border-0"
                         >
                           OK! COLLECT
                         </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
