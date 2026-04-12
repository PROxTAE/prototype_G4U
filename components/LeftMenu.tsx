"use client";
import { Settings, Image as ImageIcon, User, ClipboardList, Mail, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function LeftMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  const menuItems = [
    { icon: <ImageIcon className="text-zinc-600 dark:text-zinc-400" size={24} />, id: "gallery" },
    { icon: <User className="text-zinc-600 dark:text-zinc-400" size={24} />, id: "profile", alert: true },
    { icon: <ClipboardList className="text-zinc-600 dark:text-zinc-400" size={24} />, id: "tasks" },
    { icon: <Mail className="text-zinc-600 dark:text-zinc-400" size={24} />, id: "mail" },
  ];

  return (
    <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 sm:gap-4 z-10 scale-90 sm:scale-100 origin-left">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="relative bg-white dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 w-12 h-12 rounded-full flex items-center justify-center border-2 border-zinc-300 dark:border-zinc-700 shadow-lg transition-all backdrop-blur-sm"
      >
        {mounted && (theme === 'dark' ? <Sun className="text-yellow-400" size={24} /> : <Moon className="text-zinc-600" size={24} />)}
      </button>

      {menuItems.map((item) => (
        <button
          key={item.id}
          className="relative bg-white dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 w-12 h-12 rounded-full flex items-center justify-center border-2 border-zinc-300 dark:border-zinc-700 shadow-lg transition-colors backdrop-blur-sm"
        >
          {item.icon}
          {item.alert && (
            <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">!</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

