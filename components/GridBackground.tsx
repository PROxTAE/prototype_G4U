import React from "react";

export default function GridBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none transition-colors bg-slate-50 dark:bg-[#050505]">
      <svg className="absolute inset-0 w-full h-full opacity-60 dark:opacity-100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="g4u-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            {/* Grid Lines */}
            <path
              d="M 0 25 L 50 25 M 25 0 L 25 50"
              fill="none"
              className="stroke-slate-200 dark:stroke-zinc-800/80 transition-colors"
              strokeWidth="1"
            />
            {/* Crosshairs at intersections */}
            <path
              d="M 21 25 L 29 25 M 25 21 L 25 29"
              fill="none"
              className="stroke-slate-400 dark:stroke-zinc-600 transition-colors"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g4u-grid)" />
      </svg>

      {/* Edge Fades & Gradients */}
      {/* Vertical fade to blend with nav bar */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-white via-gray-300/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent transition-colors" />
      <div className="absolute inset-x-0 top-0 h-[15%] bg-gradient-to-b from-white via-gray-300/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent transition-colors" />

      {/* Vignette effect (radial blur fading the outer edges) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(255,255,255,0.8)_100%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.8)_100%)] transition-colors" />
    </div>
  );
}
