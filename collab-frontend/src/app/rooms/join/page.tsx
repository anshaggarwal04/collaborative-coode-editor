"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { DoorOpen } from "lucide-react";
import InteractiveGlow from "@/components/InteractiveGlow";
import RoomList from "@/components/room/RoomList";
import { motion } from "framer-motion";

export default function JoinRoomPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const handleJoinById = async () => {
    if (!roomId.trim()) return toast.error("Please enter a Room ID");

    try {
      const res = await api.post("/rooms/join", { roomId });
      toast.success(`Joined room "${res.data.room.name}"`);
      router.push(`/rooms/${res.data.room.id}`);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      toast.error(error.response?.data?.error || "Failed to join room");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0c0e] text-white">
      {/* ✨ Interactive Glow */}
      <div className="fixed inset-0 z-0">
        <InteractiveGlow color="emerald" intensity={0.18} size={800} />
      </div>

      {/* 🟢 Subtle emerald-toned background */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#0c1114] via-[#111618] to-[#171c1f]" />

      {/* 💫 Glass container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-5xl rounded-3xl border border-white/10 
                   bg-white/[0.03] backdrop-blur-2xl 
                   shadow-[0_0_70px_rgba(16,185,129,0.08)] 
                   px-8 md:px-16 py-16 overflow-hidden"
      >
        {/* 🏷️ Header */}
        <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent 
                       bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">
          Join a Room
        </h1>

        {/* 🔹 Input + Join Button */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-14 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="input input-bordered w-full px-5 py-3 text-base rounded-xl 
                       bg-[#111317]/80 border border-white/10 text-white 
                       placeholder:text-gray-500 focus:outline-none 
                       focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
          />
          <motion.button
            onClick={handleJoinById}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(16,185,129,0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2
                       bg-emerald-600 hover:bg-emerald-500 
                       transition-all duration-300 active:scale-[0.97]"
          >
            <DoorOpen size={18} /> Join
          </motion.button>
        </div>

        {/* 🔸 Room List */}
        <RoomList />
      </motion.div>
    </div>
  );
}