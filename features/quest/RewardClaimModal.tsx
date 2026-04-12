"use client";
import { useState } from "react";
import { Modal, Button } from "@heroui/react";
import { Zap, Coins, Trophy, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { playSound } from "@/lib/sounds";

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
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      variant="blur"
      className="bg-black/70"
      isDismissable={false}
    >
      <Modal.Container placement="center" size="sm">
        <Modal.Dialog aria-label="Quest Rewards" className="overflow-hidden border-0 bg-transparent shadow-none">
          <div className="relative flex flex-col items-center text-center">
            {/* Glow background */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <Image
                src="/quest_reward_bg.png"
                alt="reward bg"
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center px-8 pt-10 pb-8 gap-5">
              {/* Trophy / Sparkle icon */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.8)] animate-[pulse_1.5s_ease-in-out_infinite]">
                  {isQuestComplete ? (
                    <Trophy size={44} className="text-white drop-shadow-lg" />
                  ) : (
                    <Sparkles size={44} className="text-white drop-shadow-lg" />
                  )}
                </div>
                {/* Ring effect */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-300/40 animate-ping" />
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <p className="text-yellow-300 font-black text-xs uppercase tracking-[0.3em]">
                  {isQuestComplete ? "🎉 QUEST COMPLETE! 🎉" : "✨ OBJECTIVE CLEARED! ✨"}
                </p>
                {questTitle && (
                  <p className="text-white font-bold text-sm opacity-80 line-clamp-1">{questTitle}</p>
                )}
                <h2 className="text-white font-black text-2xl drop-shadow-lg mt-1">
                  Rewards Earned
                </h2>
              </div>

              {/* Reward Items */}
              <div className="flex gap-4">
                {/* EXP reward card */}
                <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm border border-fuchsia-400/30 rounded-2xl px-5 py-4 min-w-[100px]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.6)]">
                    <Zap size={24} className="text-white fill-white" />
                  </div>
                  <p className="text-white font-black text-2xl leading-none">+{xp}</p>
                  <p className="text-fuchsia-300 font-bold text-xs uppercase tracking-wider">EXP</p>
                </div>

                {/* Coin reward card */}
                <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm border border-amber-400/30 rounded-2xl px-5 py-4 min-w-[100px]">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.6)]">
                    <Coins size={24} className="text-white" />
                  </div>
                  <p className="text-white font-black text-2xl leading-none">+{coin}</p>
                  <p className="text-amber-300 font-bold text-xs uppercase tracking-wider">GOLD</p>
                </div>
              </div>

              {/* Confirm Button */}
              <Button
                onPress={onClose}
                className="w-full max-w-[220px] h-12 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-base rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all uppercase tracking-wider border-0"
              >
                OK! Collect
              </Button>
            </div>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
