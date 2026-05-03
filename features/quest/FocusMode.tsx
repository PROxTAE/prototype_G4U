"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Play, Pause, CheckCircle2, Zap, Coins, Timer,
  Target, ListChecks, ShieldCheck, Sparkles, ChevronRight
} from "lucide-react";
import { createPortal } from "react-dom";
import type { Task } from "@/types";

interface FocusModeProps {
  task: Task;
  onComplete: (task: Task) => void;
  onClose: () => void;
}

type Phase = "focus" | "completing" | "reward";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function CircularProgress({ progress, size = 220, stroke = 6 }: { progress: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - progress * circ;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      {/* Track */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
      />
      {/* Progress */}
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke="url(#focusGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-1000 ease-linear"
      />
      <defs>
        <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Particle({ delay }: { delay: number }) {
  const angle = Math.random() * 360;
  const distance = 80 + Math.random() * 160;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      animate={{ opacity: 0, scale: 0, x, y }}
      transition={{ duration: 1.2 + Math.random() * 0.8, delay, ease: "easeOut" }}
      className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
      style={{ boxShadow: "0 0 6px 2px rgba(34,211,238,0.6)" }}
    />
  );
}

export default function FocusMode({ task, onComplete, onClose }: FocusModeProps) {
  const totalSeconds = (task.estimated_minutes || 25) * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>("focus");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mounted, setMounted] = useState(false);

  const exp = task.exp ?? 10;
  const coin = Math.floor(exp * 0.5);

  useEffect(() => {
    setMounted(true);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "focus" || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, isPaused]);

  const progress = 1 - remaining / totalSeconds;
  const isOvertime = remaining === 0;

  const handleDone = useCallback(() => {
    setPhase("completing");
    setTimeout(() => {
      setPhase("reward");
    }, 1500);
  }, []);

  const handleCollect = useCallback(() => {
    onComplete(task);
  }, [task, onComplete]);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        {/* ═══ Background ═══ */}
        <div className="absolute inset-0 bg-[#050510]">
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Ambient glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-rose-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
            }}
          />
        </div>

        {/* ═══ Close Button ═══ */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 flex items-center justify-center text-white/40 hover:text-white transition-all backdrop-blur-sm group"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* ═══ FOCUS PHASE ═══ */}
        {phase === "focus" && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto px-6 w-full"
          >
            {/* ─── Timer Ring ─── */}
            <div className="relative mb-8">
              <CircularProgress progress={progress} />
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={remaining}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className={`text-5xl font-black tracking-tighter font-mono ${
                    isOvertime
                      ? "text-rose-400 animate-pulse"
                      : remaining < 60
                        ? "text-amber-400"
                        : "text-white"
                  }`}
                  style={{
                    textShadow: isOvertime
                      ? "0 0 30px rgba(244,63,94,0.5)"
                      : "0 0 30px rgba(34,211,238,0.3)",
                  }}
                >
                  {isOvertime ? "OT" : formatTime(remaining)}
                </motion.span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">
                  {isOvertime ? "Keep going!" : isPaused ? "Paused" : "Focusing"}
                </span>
              </div>
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow: `0 0 60px rgba(34,211,238,${0.05 + progress * 0.15}), inset 0 0 60px rgba(168,85,247,${0.02 + progress * 0.08})`,
                }}
              />
            </div>

            {/* ─── Pause/Resume ─── */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-500/30 text-white/50 hover:text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] transition-all mb-10 backdrop-blur-sm group"
            >
              {isPaused ? (
                <>
                  <Play size={12} className="fill-current group-hover:text-cyan-400" />
                  Resume
                </>
              ) : (
                <>
                  <Pause size={12} className="group-hover:text-cyan-400" />
                  Pause
                </>
              )}
            </button>

            {/* ─── Task Title ─── */}
            <div className="w-full mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/30" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500/60">
                  Current Objective
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/30" />
              </div>
              <h1
                className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight"
                style={{ textShadow: "0 0 40px rgba(34,211,238,0.2)" }}
              >
                {task.title}
              </h1>
            </div>

            {/* ─── Micro Action Card ─── */}
            {task.micro_action && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-white/[0.03] border border-cyan-500/20 rounded-2xl p-5 mb-4 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/40 transition-colors"
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-fuchsia-500/30 rounded-br-2xl" />
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ListChecks size={14} className="text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400/80 block mb-1.5">
                      Micro Action
                    </span>
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium">
                      {task.micro_action}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Verification Card ─── */}
            {task.verification && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="w-full bg-white/[0.02] border border-fuchsia-500/15 rounded-2xl p-5 mb-8 backdrop-blur-sm relative overflow-hidden hover:border-fuchsia-500/30 transition-colors"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-fuchsia-500/30 rounded-tl-2xl" />
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck size={14} className="text-fuchsia-400" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-fuchsia-400/80 block mb-1.5">
                      Verification
                    </span>
                    <p className="text-sm text-white/60 leading-relaxed font-medium">
                      {task.verification}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Rewards Preview ─── */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
                <Zap size={12} className="text-fuchsia-400 fill-fuchsia-400" />
                <span className="text-xs font-black text-fuchsia-300">+{exp} EXP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Coins size={12} className="text-amber-400" />
                <span className="text-xs font-black text-amber-300">+{coin} Gold</span>
              </div>
            </div>

            {/* ─── DONE Button ─── */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDone}
              className="relative w-full max-w-xs h-14 rounded-2xl font-black text-base uppercase tracking-[0.25em] text-white overflow-hidden group"
            >
              {/* Button BG */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500" />
              {/* Shine sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {/* Glow */}
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3),0_0_60px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.5),0_0_80px_rgba(168,85,247,0.3)] transition-shadow" />
              {/* Text */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                Mission Complete
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* ═══ COMPLETING PHASE (Burst Animation) ═══ */}
        {phase === "completing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex items-center justify-center"
          >
            {/* Particle burst */}
            <div className="relative">
              {Array.from({ length: 24 }).map((_, i) => (
                <Particle key={i} delay={i * 0.03} />
              ))}
              {/* Central flash */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-16 h-16 rounded-full bg-cyan-400"
                style={{ boxShadow: "0 0 80px 40px rgba(34,211,238,0.4)" }}
              />
            </div>
            {/* Text flash */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", damping: 15 }}
              className="absolute"
            >
              <h2
                className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter"
                style={{ textShadow: "0 0 60px rgba(34,211,238,0.6), 0 0 120px rgba(168,85,247,0.3)" }}
              >
                Cleared!
              </h2>
            </motion.div>
          </motion.div>
        )}

        {/* ═══ REWARD PHASE ═══ */}
        {phase === "reward" && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto px-6"
          >
            {/* Trophy Icon */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative mb-6"
            >
              <div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center border border-cyan-500/30"
                style={{ boxShadow: "0 0 60px rgba(34,211,238,0.2), 0 0 120px rgba(168,85,247,0.1)" }}
              >
                <Sparkles size={40} className="text-cyan-400" />
              </div>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-cyan-500/20"
              />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-2"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400/60">
                ✦ Objective Cleared ✦
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-black text-white uppercase tracking-tight mb-8 line-clamp-2"
              style={{ textShadow: "0 0 30px rgba(34,211,238,0.2)" }}
            >
              {task.title}
            </motion.h2>

            {/* Reward Cards */}
            <div className="flex gap-4 mb-10">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-2 bg-white/[0.03] border border-fuchsia-500/20 rounded-2xl p-5 min-w-[120px] hover:border-fuchsia-500/40 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 flex items-center justify-center"
                  style={{ boxShadow: "0 0 20px rgba(168,85,247,0.2)" }}
                >
                  <Zap size={22} className="text-fuchsia-400 fill-fuchsia-400" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="text-2xl font-black text-white"
                >
                  +{exp}
                </motion.span>
                <span className="text-[9px] font-black text-fuchsia-400/60 uppercase tracking-widest">
                  Experience
                </span>
              </motion.div>

              <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-2 bg-white/[0.03] border border-amber-500/20 rounded-2xl p-5 min-w-[120px] hover:border-amber-500/40 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center"
                  style={{ boxShadow: "0 0 20px rgba(245,158,11,0.2)" }}
                >
                  <Coins size={22} className="text-amber-400" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="text-2xl font-black text-white"
                >
                  +{coin}
                </motion.span>
                <span className="text-[9px] font-black text-amber-400/60 uppercase tracking-widest">
                  Gold
                </span>
              </motion.div>
            </div>

            {/* Collect Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCollect}
              className="relative w-full max-w-xs h-14 rounded-2xl font-black text-base uppercase tracking-[0.25em] text-white overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-fuchsia-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-shadow" />
              <div className="relative z-10 flex items-center justify-center gap-2">
                <ChevronRight size={18} />
                Collect
              </div>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
