"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import InteractiveGlow from "@/components/InteractiveGlow";
import CreateRoomModal from "@/components/room/CreateRoomModal";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { initSocket, getSocket } from "@/lib/socket"; // ✅ use new socket system

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);
  const [socketReady, setSocketReady] = useState(false);

  // ✨ Floating particles background
  useEffect(() => {
    if (typeof window === "undefined") return;
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }))
    );
  }, []);

  // ✅ Initialize socket once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const socket = initSocket(token);

    socket.on("connect", () => {
      setSocketReady(true);
      console.log("✅ Socket connected on create-room:", socket.id);
    });

    socket.on("disconnect", () => setSocketReady(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  // 🧩 Create room API + Socket Join
  const handleCreateRoom = async () => {
    if (!roomName.trim()) return toast.error("Room name is required");
    setCreating(true);

    try {
      const res = await api.post("/rooms/create", { roomName });
      const roomId = res.data.room.id;
      const socket = getSocket();

      // ✅ Auto join new room after creation
      socket.emit("joinRoom", { roomId });

      toast.success(`Room "${res.data.room.name}" created!`);
      router.push(`/rooms/${roomId}`);
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

      {/* ✨ Floating Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-emerald-400/40"
          initial={{ x: p.x, y: p.y, opacity: 0.3, scale: 0.8 }}
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

      {/* 🪩 Glass Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-xl rounded-3xl border border-white/10 bg-white/[0.03]
                   backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.45)] p-10 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-extrabold mb-4 text-emerald-300"
        >
          Create a Room
        </motion.h1>

        <p className="text-gray-400 mb-8">
          Bring your team together — one workspace at a time 🌿
        </p>

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
              disabled={creating || !socketReady}
              className={`btn ${
                socketReady
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-gray-700 cursor-not-allowed"
              } text-white border-0 transition-all duration-300`}
            >
              {creating
                ? "Creating..."
                : socketReady
                ? "Create Room"
                : "Connecting..."}
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

      <CreateRoomModal onRoomCreated={() => console.log("Room Created")} />
    </div>
  );
}