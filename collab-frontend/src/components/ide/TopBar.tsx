"use client";

import { ChevronDown, Play, Share2, LogOut, Code2 } from "lucide-react";
import { motion } from "framer-motion";

type Lang = { id: number; label: string; monaco: string };

export default function TopBar({
  roomId,
  langs,
  lang,
  onLangChange,
  onRun,
  onShare,
  onLeave,
}: {
  roomId: string;
  langs: Lang[];
  lang: Lang;
  onLangChange: (l: Lang) => void;
  onRun: () => void;
  onShare: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.header
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="
        flex items-center justify-between
        px-6 h-[56px]
        bg-[#0b0f16]/70 backdrop-blur-md
        border-b border-white/10
        shadow-[0_1px_6px_rgba(0,0,0,0.4)]
        sticky top-0 z-50
      "
    >
      {/* Left section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Code2 size={18} className="text-purple-400" />
          <span className="text-sm text-gray-400">Room ID:</span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 py-1 text-xs font-medium bg-[#151b24] border border-[#1c2430]
                     rounded-lg text-indigo-400 hover:text-indigo-300 cursor-pointer select-all"
        >
          {roomId}
        </motion.span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative">
          <select
            value={lang.id}
            onChange={(e) =>
              onLangChange(
                langs.find((l) => l.id === Number(e.target.value)) || lang
              )
            }
            className="appearance-none bg-[#151b24] text-sm text-gray-200
                       border border-[#1c2430] rounded-md px-3 py-1 pr-8
                       focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          >
            {langs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Buttons */}
        <button
          onClick={onRun}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium
                     rounded-md bg-gradient-to-r from-emerald-500 to-green-500
                     hover:from-emerald-400 hover:to-green-400 text-white
                     transition-all shadow-lg hover:shadow-emerald-500/20"
        >
          <Play size={15} /> Run
        </button>

        <button
          onClick={onShare}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium
                     rounded-md bg-gradient-to-r from-indigo-500 to-purple-500
                     hover:from-indigo-400 hover:to-purple-400 text-white
                     transition-all shadow-lg hover:shadow-purple-500/20"
        >
          <Share2 size={15} /> Share
        </button>

        <button
          onClick={onLeave}
          className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium
                     rounded-md bg-gradient-to-r from-red-600 to-pink-600
                     hover:from-red-500 hover:to-pink-500 text-white
                     transition-all shadow-lg hover:shadow-red-500/20"
        >
          <LogOut size={15} /> Leave
        </button>
      </div>
    </motion.header>
  );
}