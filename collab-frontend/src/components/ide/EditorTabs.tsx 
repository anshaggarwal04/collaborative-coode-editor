"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface Tab {
  id: string;
  name: string;
}

interface Props {
  tabs: Tab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export default function EditorTabs({ tabs, activeId, onSelect, onClose }: Props) {
  return (
    <div className="flex items-center bg-[#0d1117] border-b border-white/10 overflow-x-auto">
      {tabs.map((tab) => (
        <motion.div
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition
            ${activeId === tab.id ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
        >
          <span>{tab.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
            className="hover:text-red-400"
          >
            <X size={12} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}