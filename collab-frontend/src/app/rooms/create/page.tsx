"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { initSocket, getSocket } from "@/lib/socket";
import { Plus, Terminal, Shield, Cpu, ChevronRight } from "lucide-react";

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  // ✅ Initialize socket once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const socket = initSocket(token);

    socket.on("connect", () => {
      setSocketReady(true);
    });

    socket.on("disconnect", () => setSocketReady(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return toast.error("Room name is required");
    setCreating(true);

    try {
      const res = await api.post("/rooms/create", { roomName });
      const roomId = res.data.room.id;
      const socket = getSocket();

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
    <div className="relative min-h-screen flex items-center justify-center bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* 🧩 Background Elements */}
      <div className="absolute inset-0 z-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl px-6"
      >
        <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-black mb-6">
                <Plus size={24} strokeWidth={3} />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">New Environment</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Initialize a secure collaborative workspace</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-px bg-white/5 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
            {/* Main Form */}
            <div className="bg-[#0a0a0a] p-10">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2">
                           System / Namespace
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Project-Alpha-Refactor"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 px-5 text-sm font-mono text-white placeholder-gray-700 outline-none focus:border-white/10 focus:bg-white/[0.04] transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="flex-1 px-6 py-4 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/[0.02] transition-all"
                        >
                            Abort Session
                        </button>
                        <button
                            onClick={handleCreateRoom}
                            disabled={creating || !socketReady}
                            className="flex-[2] px-6 py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
                        >
                            {creating ? "Processing..." : "Commit Workspace"} <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="bg-white/[0.02] p-8 flex flex-col justify-between border-l border-white/5">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                            <Shield size={12} /> Encrypted
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-bold">End-to-end encrypted collaboration layer active by default.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-widest">
                            <Cpu size={12} /> Sync Ready
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-bold">Yjs CRDT protocol initialized for real-time synchronization.</p>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center gap-2 text-gray-600 font-black text-[9px] uppercase tracking-widest">
                       <Terminal size={12} /> Status
                    </div>
                    <div className={`mt-2 text-[10px] font-mono ${socketReady ? "text-emerald-500" : "text-amber-500"}`}>
                        {socketReady ? "> NETWORK_READY" : "> CONNECTING..."}
                    </div>
                </div>
            </div>
        </div>

        {/* Global Registry Label */}
        <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-gray-800 uppercase tracking-[0.5em]">Global Session Registry v2.0</p>
        </div>
      </motion.div>
    </div>
  );
}