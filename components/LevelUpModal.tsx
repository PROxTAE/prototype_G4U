"use client";
import { Modal, Button } from "@heroui/react";
import Image from "next/image";
import { Star, Trophy, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { playSound } from "@/lib/sounds";

interface LevelUpModalProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function LevelUpModal({ level, isOpen, onClose }: LevelUpModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playSound("levelUp");
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  return (
    <Modal.Backdrop 
      isOpen={isOpen} 
      onOpenChange={onClose}
      variant="blur"
      className="bg-black/80"
      isDismissable={false}
    >
      <Modal.Container placement="center" size="sm">
        <Modal.Dialog aria-label="Level Up Announcement" className="bg-transparent border-0 shadow-none overflow-hidden">
          <div className="relative flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
            
            {/* Background Effect */}
            <div className={`absolute inset-0 transition-all duration-1000 transform ${showContent ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}`}>
               <Image 
                 src="/level_up_bg.png" 
                 alt="Level Up Background" 
                 fill 
                 sizes="(max-width: 768px) 100vw, 400px"
                 className="object-cover rounded-full"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-full" />
            </div>

            {/* Content Container */}
            <div className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-700 delay-300 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              
              {/* Icon Section */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.8)] animate-pulse">
                   <Trophy size={60} className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]" />
                </div>
                {/* Decorative Stars */}
                <Star className="absolute -top-4 -left-4 text-yellow-400 animate-bounce fill-yellow-400" size={24} />
                <Star className="absolute -top-2 -right-6 text-yellow-300 animate-[bounce_1.2s_infinite] fill-yellow-300" size={32} />
                <Star className="absolute bottom-2 -right-8 text-yellow-500 animate-[bounce_0.8s_infinite] fill-yellow-500" size={20} />
              </div>

              {/* Text Section */}
              <div className="flex flex-col gap-2">
                <h2 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-amber-500 drop-shadow-[0_5px_15px_rgba(251,191,36,0.5)] tracking-tighter">
                  LEVEL UP!
                </h2>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="text-4xl font-black text-white/50">{level - 1}</div>
                  <ArrowUp size={32} className="text-green-400" strokeWidth={4} />
                  <div className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">{level}</div>
                </div>
              </div>

              {/* Message */}
              <p className="text-white/90 font-bold text-lg max-w-[280px] drop-shadow-md">
                You've reached a new tier of productivity! Keep going!
              </p>

              {/* Reward Hint (Optional visual) */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 flex gap-4">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">HP Refilled</span>
                    <div className="h-1 w-12 bg-emerald-500 rounded-full mt-1" />
                 </div>
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase">New Quests</span>
                    <div className="h-1 w-12 bg-cyan-500 rounded-full mt-1" />
                 </div>
              </div>

              {/* Close Button */}
              <Button 
                onPress={onClose}
                className="mt-4 px-12 h-14 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-black text-xl rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all outline-none"
              >
                CONTINUE
              </Button>
            </div>

            {/* Particle Overlay (Simple CSS) */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-20"
                    style={{ 
                      top: `${Math.random() * 100}%`, 
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 3}s`
                    }}
                  />
                ))}
            </div>

          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
