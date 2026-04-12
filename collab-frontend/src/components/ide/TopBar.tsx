"use client";

import { motion } from "framer-motion";
import { Play, Share2, LogOut, Terminal, Cpu, ChevronRight, Activity } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  roomId: string;
  langs: { id: number; label: string; monaco: string }[];
  lang: { id: number; label: string; monaco: string };
  onLangChange: (lang: { id: number; label: string; monaco: string }) => void;
  onRun: () => void;
  onShare: () => void;
  onLeave: () => void;
}

export default function TopBar({
  roomId,
  langs,
  lang,
  onLangChange,
  onRun,
  onShare,
  onLeave,
}: TopBarProps) {
  const [running, setRunning] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    onRun();
    setTimeout(() => setRunning(false), 2000);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-50 flex items-center justify-between h-14 px-4 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5"
    >
      {/* Left — Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1 px-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu size={14} />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Node <ChevronRight size={10} /> <span className="text-gray-300">Cluster-Alpha</span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-white/10 mx-2" />

        {/* Language Select */}
        <div className="flex items-center gap-2 group">
          <span className="text-[10px] uppercase font-black text-gray-600 tracking-tighter">Env</span>
          <select
            value={lang.id}
            onChange={(e) => {
              const selected = langs.find((l) => l.id === Number(e.target.value));
              if (selected) onLangChange(selected);
            }}
            className="bg-transparent text-[11px] font-bold text-gray-300 focus:outline-none cursor-pointer hover:text-white transition-colors"
          >
            {langs.map((l) => (
              <option key={l.id} value={l.id} className="bg-[#0a0a0a]">
                {l.label.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center — Status */}
      <div className="hidden lg:flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border bg-white/[0.02] transition-colors duration-500 ${running ? "border-cyan-500/30" : "border-white/5"}`}>
          <Activity size={10} className={running ? "text-cyan-400 animate-pulse" : "text-gray-600"} />
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${running ? "text-cyan-400" : "text-gray-500"}`}>
            {running ? "Process Executing" : "Engine Idle"}
          </span>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play size={12} className="fill-current" /> Run
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-widest text-gray-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <Share2 size={12} /> Share
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-1" />

        <button
          onClick={onLeave}
          className="p-2 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </motion.header>
  );
}