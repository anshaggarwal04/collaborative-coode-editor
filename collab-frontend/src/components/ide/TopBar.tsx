"use client";

import { motion } from "framer-motion";
import { Play, Share2, LogOut, Terminal, Cpu } from "lucide-react";
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
    setTimeout(() => setRunning(false), 1800);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative z-20 flex items-center justify-between h-[56px] px-6 border-b border-white/10 
                 bg-[#0c0f13]/90 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.05)]"
    >
      {/* Left — Room Info */}
      <div className="flex items-center gap-3">
        <Cpu size={18} className="text-gray-400" />
        <h1 className="text-sm md:text-base font-semibold text-white tracking-wide">
          Room: <span className="text-gray-400 font-normal">{roomId.slice(0, 8)}...</span>
        </h1>

        {/* Language Select */}
        <select
          value={lang.id}
          onChange={(e) => {
            const selected = langs.find((l) => l.id === Number(e.target.value));
            if (selected) onLangChange(selected);
          }}
          className="ml-4 bg-[#101317] border border-white/10 text-sm text-gray-300 rounded-md px-3 py-1.5 
                     focus:ring-1 focus:ring-cyan-400/50 focus:outline-none hover:bg-[#14181f] transition"
        >
          {langs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {/* Center — Run Status */}
      <motion.div
        animate={{
          opacity: running ? [0.6, 1, 0.6] : 1,
          scale: running ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 1, repeat: running ? Infinity : 0 }}
        className="hidden md:flex items-center gap-2 text-sm text-gray-400"
      >
        <Terminal size={14} />
        {running ? (
          <span className="text-cyan-400">Running...</span>
        ) : (
          <span className="text-gray-500">Idle</span>
        )}
      </motion.div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleRun}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-white 
                     hover:bg-white/[0.08] hover:border-cyan-400/40 transition duration-200"
        >
          <Play size={14} className="text-cyan-400" /> Run
        </button>

        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-white 
                     hover:bg-white/[0.08] hover:border-gray-400/40 transition duration-200"
        >
          <Share2 size={14} /> Share
        </button>

        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-white 
                     hover:bg-white/[0.08] hover:border-red-400/40 transition duration-200"
        >
          <LogOut size={14} className="text-red-400" /> Leave
        </button>
      </div>
    </motion.header>
  );
}