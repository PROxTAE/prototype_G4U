import { Home, Anchor, Crosshair, Wrench, Layers } from "lucide-react";

export default function BottomNav() {
  const tabs = [
    { icon: <Home size={32} />, label: "HOME", active: true },
    { icon: <Anchor size={32} />, label: "PORT", active: false },
    { icon: <Crosshair size={32} />, label: "BATTLE", active: false },
    { icon: <Wrench size={32} />, label: "DEVELOP", active: false },
    { icon: <Layers size={32} />, label: "CARDS", active: false, alert: true },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl flex shadow-[0_-10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.5)] border-t border-slate-100 dark:border-zinc-800 transition-colors" style={{ clipPath: "polygon(0 15px, 15px 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 0 100%)" }}>
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          className={`relative flex-1 flex flex-col items-center justify-center gap-1 group overflow-hidden ${
            tab.active 
              ? "bg-slate-100/50 dark:bg-zinc-100 text-slate-900 border-t-4 border-cyan-500 dark:border-cyan-400" 
              : "text-slate-400 hover:text-slate-800 hover:bg-slate-50/50 dark:text-zinc-500 dark:hover:bg-zinc-800 transition-colors"
          } ${i < tabs.length - 1 ? "border-r border-slate-100 dark:border-white/5" : ""}`}
          style={{
            clipPath: tab.active ? "polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px)" : "none"
          }}
        >
          {/* Hexagon pattern background for active */}
          {tab.active && (
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)", backgroundSize: "20px 20px" }}></div>
          )}
          
          <div className={`relative z-10 ${tab.active ? 'text-black' : 'group-hover:text-slate-700 dark:group-hover:text-zinc-300'}`}>
            {tab.icon}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest relative z-10 ${tab.active ? 'text-black' : 'group-hover:text-slate-700 dark:group-hover:text-zinc-300'}`}>
            {tab.label}
          </span>
          
          {tab.alert && (
            <div className="absolute top-4 right-1/4 w-3 h-3 bg-red-500 rounded-full border border-white dark:border-black flex items-center justify-center shadow-md">
              <span className="text-[6px] text-white font-black">!</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
