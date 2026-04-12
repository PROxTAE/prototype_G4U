"use client";
import { useEffect, useState } from "react";
import { Zap, Coins } from "lucide-react";

interface RewardToastProps {
  xp: number;
  coin: number;
  isBonus?: boolean;
  onDone: () => void;
}

export default function RewardToast({ xp, coin, isBonus = false, onDone }: RewardToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`
        fixed z-[9999] left-1/2 -translate-x-1/2 pointer-events-none
        transition-all duration-400
        ${visible ? "top-28 opacity-100 scale-100" : "top-20 opacity-0 scale-90"}
      `}
    >
      <div className={`
        flex flex-col items-center gap-1 px-6 py-3 rounded-2xl shadow-2xl border-2
        ${isBonus
          ? "bg-gradient-to-br from-yellow-400 to-amber-500 border-yellow-300 shadow-yellow-400/50"
          : "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-300 shadow-cyan-400/50"
        }
      `}>
        {isBonus && (
          <div className="text-white font-black text-xs uppercase tracking-widest opacity-80 -mb-1">
            ✨ QUEST COMPLETE BONUS ✨
          </div>
        )}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-white font-black text-2xl drop-shadow">
              +{xp} <span className="text-sm font-bold opacity-80">EXP</span>
            </span>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="flex items-center gap-1.5">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Coins size={18} className="text-white" />
            </div>
            <span className="text-white font-black text-2xl drop-shadow">
              +{coin} <span className="text-sm font-bold opacity-80">G</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
