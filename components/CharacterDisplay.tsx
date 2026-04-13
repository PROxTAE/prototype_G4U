import Image from "next/image";

export default function CharacterDisplay() {
   return (
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-24 pointer-events-none z-0">

         {/* Title / Banner */}
         <div className="absolute top-20 sm:top-28 right-4 sm:right-8 md:right-16 lg:right-24 flex flex-col items-end opacity-90 pointer-events-auto scale-75 sm:scale-100 origin-top-right transition-colors z-10">
            <div className="text-slate-400 dark:text-zinc-400 tracking-[0.3em] text-[10px] flex items-center gap-2 font-bold mb-1">
               ✨ PRODUCTIVITY QUEST
            </div>
            <div className="text-5xl font-black text-slate-800 dark:text-zinc-300 tracking-tighter uppercase italic drop-shadow-md dark:drop-shadow-2xl" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
               G4U
            </div>

            <div className="relative w-56 h-12 border border-slate-200 dark:border-zinc-700 rounded-tr-[1.5rem] bg-white/70 dark:bg-zinc-900/80 backdrop-blur-md mt-1 overflow-hidden shadow-lg dark:shadow-2xl flex items-center transition-colors">
               <div className="absolute left-3 flex gap-1.5 opacity-50">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-300 dark:bg-zinc-400 rounded-full" />)}
               </div>
               <div className="absolute right-0 top-0 bottom-0 border-l border-slate-200 dark:border-zinc-700 bg-gradient-to-b from-cyan-400 to-blue-500 dark:from-cyan-300 dark:to-purple-400 flex items-center justify-center px-4 font-black text-white dark:text-black text-2xl" style={{ clipPath: "polygon(15px 0, 100% 0, 100% 100%, 0% 100%)" }}>
                  <span className="ml-2">42<span className="text-sm">%</span></span>
               </div>
            </div>
         </div>

         {/* Character Image */}
         <div className="relative w-[90%] sm:w-[70%] max-w-[800px] h-[55vh] sm:h-[65vh] lg:h-[75vh] 2xl:h-[80vh] mt-auto mb-24 sm:mb-20 transition-all duration-500 origin-bottom">
            {/* Floor Shadow */}
            <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 w-[60%] max-w-[400px] h-6 sm:h-12 bg-slate-300/40 dark:bg-black/90 blur-xl rounded-[100%] pointer-events-none transition-colors" />
            {/* Subtle Glow behind character */}
            <div className="absolute inset-0 bg-transparent dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none transition-colors" />

            <Image
               src="/character/Logos.webp"
               alt="Character"
               fill
               className=" translate-y-2/10 md:translate-y-2/5 scale-200 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto"
               priority
            />
         </div>

      </div>
   );
}
