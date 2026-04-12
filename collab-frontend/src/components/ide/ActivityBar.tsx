"use client";

import { motion } from "framer-motion";
import { Files, Search, Settings, User, Bell, Cpu } from "lucide-react";

interface ActivityBarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function ActivityBar({ activeView, onViewChange }: ActivityBarProps) {
  const items = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "engine", icon: Cpu, label: "Engine Status" },
  ];

  return (
    <aside className="w-12 h-full bg-[#0d0d0d] border-r border-white/5 flex flex-col items-center justify-between py-4 z-50">
      <div className="flex flex-col items-center gap-4 w-full">
        {items.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="relative w-full flex items-center justify-center py-2 group focus:outline-none"
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-[2px] h-6 bg-white"
                />
              )}
              <item.icon
                size={22}
                className={`transition-colors duration-200 ${
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <button className="text-gray-500 hover:text-gray-300 transition-colors py-2">
          <Bell size={20} />
        </button>
        <button className="text-gray-500 hover:text-gray-300 transition-colors py-2">
          <User size={20} />
        </button>
        <button className="text-gray-500 hover:text-gray-300 transition-colors py-2">
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
}
