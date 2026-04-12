"use client";
import { Modal, Button } from "@heroui/react";
import { X, Trophy, Target } from "lucide-react";
import DailyQuestList from "@/features/dailyQuest/DailyQuestList";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DailyQuestModal({ isOpen, onOpenChange }: Props) {
  return (
    <Modal>
      <Modal.Backdrop 
        className="bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
      >
        <Modal.Container placement="center" size="lg">
           <Modal.Dialog aria-label="Daily Missions" className="bg-white/90 dark:bg-zinc-950/90 border-2 border-white/20 dark:border-zinc-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="relative">
                 {/* Top Mission Header (Reference Style) */}
                 <div className="bg-gradient-to-r from-cyan-600 to-blue-700 py-3 flex items-center justify-center relative">
                    <h2 className="text-white font-black text-xl italic tracking-tighter uppercase">Mission</h2>
                    <Button 
                      isIconOnly 
                      onPress={() => onOpenChange(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-8 w-8 min-w-0"
                    >
                      <X size={16} />
                    </Button>
                 </div>

                 {/* Tab Bar (Mock for aesthetic) */}
                 <div className="flex bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                    <button className="flex-1 py-3 text-[10px] font-black uppercase text-cyan-500 border-b-2 border-cyan-500 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-950">
                       <Target size={12} /> Daily
                    </button>
                    <button className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400 dark:text-zinc-600 flex items-center justify-center gap-1.5 opacity-50">
                       <Target size={12} /> Weekly
                    </button>
                    <button className="flex-1 py-3 text-[10px] font-black uppercase text-slate-400 dark:text-zinc-600 flex items-center justify-center gap-1.5 opacity-50">
                       <Trophy size={12} /> Achievement
                    </button>
                 </div>

                 {/* Content */}
                 <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <DailyQuestList />
                 </div>

                 {/* Footer Button */}
                 <div className="p-6 pt-0">
                    <Button 
                      onPress={() => onOpenChange(false)}
                      className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-base rounded-2xl shadow-xl shadow-cyan-500/20 uppercase tracking-widest"
                    >
                       Collect All Rewards
                    </Button>
                 </div>
              </div>
           </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
