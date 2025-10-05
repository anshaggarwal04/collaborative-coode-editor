"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { Users, PlusCircle, Code2, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

import InteractiveGlow from "@/components/InteractiveGlow";
import CommandPalette from "@/components/CommandPalette";
//import DashboardDock from "@/components/DashboardDock";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const { rooms, loading } = useRooms();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-[#0b0d10] text-white">
      {/* ✨ Ambient Glow */}
      <InteractiveGlow color="amber" intensity={0.07} size={700} />

      {/* 🪶 Subtle backdrop texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.03),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(0,255,198,0.05),transparent_70%)]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-7xl w-full mx-auto text-center px-6 py-24"
      >
        {/* Header */}
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-[#00ffc6] drop-shadow-[0_0_30px_rgba(0,255,198,0.25)]">
          Welcome back, {user?.username || "Developer"} 👋
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-20 leading-relaxed">
          Your creative playground — join rooms, start new projects, and
          collaborate seamlessly.
        </p>

        {/* ⚡ Quick Actions */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.button
            whileHover={{
              scale: 1.04,
              y: -4,
              boxShadow: "0 0 60px rgba(0,255,198,0.15)",
            }}
            onClick={() => router.push("/rooms/join")}
            className="p-10 rounded-3xl bg-[#111315]/80 backdrop-blur-2xl border border-white/10 text-left shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-3 text-[#00ffc6]">
              <Users size={32} />
              <h2 className="text-2xl font-semibold">Join a Room</h2>
            </div>
            <p className="text-gray-400 text-base leading-relaxed">
              Connect instantly with your peers and code in real-time.
            </p>
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.04,
              y: -4,
              boxShadow: "0 0 60px rgba(255,200,150,0.15)",
            }}
            onClick={() => router.push("/rooms/create")}
            className="p-10 rounded-3xl bg-[#111315]/80 backdrop-blur-2xl border border-white/10 text-left shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-3 text-[#ffc96b]">
              <PlusCircle size={32} />
              <h2 className="text-2xl font-semibold">Create a Room</h2>
            </div>
            <p className="text-gray-400 text-base leading-relaxed">
              Start a new collaborative workspace and invite teammates.
            </p>
          </motion.button>
        </div>

        {/* 🧩 Recent Rooms */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-left max-w-5xl mx-auto"
        >
          <h3 className="text-2xl font-semibold text-[#ffc96b] flex items-center gap-2 mb-6">
            <FolderOpen size={22} /> Recent Rooms
          </h3>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading your rooms...</p>
          ) : rooms.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent rooms found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {rooms.slice(0, 6).map((room) => (
                <motion.div
                  key={room.id}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 40px rgba(0,255,198,0.1)",
                  }}
                  className="p-5 rounded-2xl bg-[#111315]/80 border border-white/10 hover:border-[#00ffc6]/40 transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/rooms/${room.id}`)}
                >
                  <h4 className="text-lg font-semibold text-[#00ffc6] truncate">
                    {room.name}
                  </h4>
                  <p className="text-gray-400 text-sm mt-1">
                    👤 {room.createdBy || "You"}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 💫 Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-24 flex flex-col items-center text-gray-500 text-sm space-y-2"
        >
          <Code2 size={18} className="text-[#00ffc6]" />
          <p>Built for dreamers who turn ideas into code ⚡</p>
        </motion.div>
      </motion.div>

      {/* 🧭 Dock + Command Palette */}
      
      <CommandPalette />
    </div>
  );
}