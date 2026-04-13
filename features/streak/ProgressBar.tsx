"use client";
import { motion } from "framer-motion";

interface Props {
  progress: number;
  target: number;
}

export default function ProgressBar({ progress, target }: Props) {
  const percent = Math.min(100, (progress / target) * 100);

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex justify-between items-end">
        <span className="text-white font-black text-xl italic tracking-tight">
          {progress.toLocaleString()} <span className="text-white/40 text-sm not-italic">/ {target.toLocaleString()}</span>
        </span>
        <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
          {Math.floor(percent)}%
        </span>
      </div>
      
      <div className="relative h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
        />
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
