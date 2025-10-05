"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import InteractiveGlow from "@/components/InteractiveGlow";
import CreateRoomModal from "@/components/room/CreateRoomModal";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  // ✨ Floating particles
  useEffect(() => {
    if (typeof window === "undefined") return;
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }))
    );
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return toast.error("Room name is required");
    setCreating(true);
    try {
      const res = await api.post("/rooms/create", { roomName });
      toast.success(`Room "${res.data.room.name}" created!`);
      router.push(`/rooms/${res.data.room.id}`);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      toast.error(error.response?.data?.error || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07080b] text-white">
      {/* 🌈 Cursor-follow glow */}
      <InteractiveGlow color="emerald" intensity={0.22} size={700} />

      {/* 🪶 Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#041a13] via-[#071c18] to-[#102020] opacity-80" />

      {/* 🌌 Floating Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-emerald-400/40"
          initial={{
            x: p.x,
            y: p.y,
            opacity: 0.3,
            scale: 0.8,
          }}
          animate={{
            y: [p.y, p.y - 120],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 🪩 Glass Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-xl rounded-3xl border border-white/10 bg-white/[0.03]
                   backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.45)] p-10 text-center"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent"
        >
          Create a Room
        </motion.h1>
        <p className="text-gray-400 mb-8">
          Bring your team together — one workspace at a time 🌿
        </p>

        {/* Input Form */}
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="input input-bordered w-full bg-[#0f1114]/80 border border-emerald-400/30 
                       text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-500/50"
          />

          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/dashboard")}
              className="btn bg-gray-800/60 border border-gray-600 hover:bg-gray-700/80 text-gray-200"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(16,185,129,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateRoom}
              disabled={creating}
              className="btn bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 
                         text-white border-0 hover:opacity-90 transition-all duration-300"
            >
              {creating ? "Creating..." : "Create Room"}
            </motion.button>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-10 text-xs text-gray-500"
        >
          Every great project begins with a single room. Start yours now 🌍
        </motion.p>
      </motion.div>

      {/* 💬 Optional hidden modal (shared component, future use) */}
      <CreateRoomModal onRoomCreated={() => console.log("Room Created")} />
    </div>
  );
}