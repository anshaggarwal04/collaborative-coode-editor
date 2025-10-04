"use client";

import { Share2, LogOut, Play, ChevronDown } from "lucide-react";

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
    <header className="flex items-center justify-between px-4 border-b border-[#141b22] bg-[#0e131a]/80 backdrop-blur-sm">
      {/* Left: Room chip */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Room:</span>
        <span className="text-xs bg-[#121a23] border border-[#1b2430] px-2 py-1 rounded-md text-blue-300">
          {roomId}
        </span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={lang.id}
            onChange={(e) => {
              const picked = langs.find((l) => l.id === Number(e.target.value)) || lang;
              onLangChange(picked);
            }}
            className="appearance-none bg-[#0d141c] text-xs border border-[#1b2430] rounded-md px-2 py-1 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {langs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <button
          onClick={onRun}
          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 active:translate-y-px text-white text-xs px-3 py-1 rounded-md transition"
        >
          <Play size={14} /> Run
        </button>

        <button
          onClick={onShare}
          className="inline-flex items-center gap-1 bg-[#0d141c] hover:bg-[#121a23] border border-[#1b2430] text-gray-200 text-xs px-3 py-1 rounded-md transition"
        >
          <Share2 size={14} /> Share
        </button>

        <button
          onClick={onLeave}
          className="inline-flex items-center gap-1 bg-[#2a1113] hover:bg-[#3a171b] border border-[#3f1b1e] text-red-200 text-xs px-3 py-1 rounded-md transition"
        >
          <LogOut size={14} /> Leave
        </button>
      </div>
    </header>
  );
}