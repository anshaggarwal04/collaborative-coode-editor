"use client";

import { Wifi, Code2, Radiation, Share2, Layers } from "lucide-react";

interface StatusBarProps {
  roomId: string;
  language: string;
}

export default function StatusBar({ roomId, language }: StatusBarProps) {
  return (
    <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-medium select-none z-50">
      <div className="flex items-center h-full">
        <div className="flex items-center gap-1.5 px-2 hover:bg-white/10 h-full cursor-pointer transition-colors">
          <Radiation size={12} className="rotate-12" />
          <span className="font-bold tracking-tighter uppercase">Remote-Layer</span>
        </div>
        <div className="h-3 w-px bg-white/20 mx-1" />
        <div className="flex items-center gap-2 px-2 hover:bg-white/10 h-full cursor-pointer transition-colors">
          <Wifi size={12} className="text-white/80" />
          <span>Connected</span>
        </div>
        <div className="flex items-center gap-2 px-2 hover:bg-white/10 h-full cursor-pointer transition-colors">
          <Layers size={12} className="text-white/80" />
          <span className="truncate max-w-[100px] opacity-70">Room: {roomId.slice(0, 8)}...</span>
        </div>
      </div>

      <div className="flex items-center h-full">
        <div className="flex items-center gap-2 px-3 hover:bg-white/10 h-full cursor-pointer transition-colors">
           <span>Ln 1, Col 1</span>
        </div>
        <div className="flex items-center gap-2 px-3 hover:bg-white/10 h-full cursor-pointer transition-colors uppercase tracking-widest text-[9px]">
           <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2 px-3 hover:bg-white/10 h-full cursor-pointer transition-colors">
          <Code2 size={12} />
          <span>{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2 px-3 hover:bg-white/10 h-full cursor-pointer transition-colors">
          <Share2 size={12} />
          <span>Sync v2.1</span>
        </div>
      </div>
    </footer>
  );
}
