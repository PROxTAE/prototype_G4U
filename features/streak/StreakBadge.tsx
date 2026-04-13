"use client";
import { motion } from "framer-motion";

interface Props {
  count: number;
}

export default function StreakBadge({ count }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-900/40 rounded-[2rem] border border-white/5 backdrop-blur-md relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
      
      {/* Fire Icon Container */}
      <motion.div 
        animate={{ 
          scale: count > 0 ? [1, 1.1, 1] : 1,
          rotate: count > 0 ? [0, -5, 5, 0] : 0
        }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="relative"
      >
        <div className={`
          w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500
          ${count > 0 
            ? "bg-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.5)]" 
            : "bg-zinc-800 border border-white/10"
          }
        `}>
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,2C12,2 10,7.5 10,10.5C10,12.43 11.57,14 13.5,14C15.43,14 17,12.43 17,10.5C17,8 14.5,5.5 12,2Z" opacity="0.5" />
            <path d="M10.5,22C8,22 6,19.5 6,17C6,14 8,10 12,5C11,8.5 10.5,12 10.5,12.5C10.5,13.88 11.62,15 13,15C14.38,15 15.5,13.88 15.5,12.5C15.5,12 15,10 13,8.5C16.5,10 18.5,13 18.5,16C18.5,19 16,22 13.5,22H10.5Z" />
          </svg>
        </div>
      </motion.div>

      <div className="mt-4 text-center">
        <h3 className="text-2xl font-black text-white leading-none">
          {count} <span className="text-xs italic font-black uppercase tracking-tighter ml-1">days</span>
        </h3>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1.5">Steps streak</p>
      </div>
    </div>
  );
}
