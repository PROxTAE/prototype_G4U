import { X } from "lucide-react";

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Panel({ isOpen, onClose, children }: PanelProps) {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md transition-colors" onClick={onClose} />
      <div className="relative w-full h-full max-w-4xl bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-700 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row overflow-hidden transform-gpu scale-100 animate-in zoom-in-95 duration-200 transition-colors">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 bg-slate-100 dark:bg-black text-slate-500 dark:text-zinc-400 rounded-xl border border-slate-200 dark:border-zinc-800 hover:text-white dark:hover:text-white hover:bg-red-500 dark:hover:bg-red-500 hover:border-red-500 transition-colors"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
