"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { LogIn, Search, Globe, Shield, Terminal as TerminalIcon } from "lucide-react";
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
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-20">
      {/* 🧩 Refined Layout Background Layers */}
      <div className="absolute inset-0 z-0 bg-noise pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-grid pointer-events-none opacity-40" />
      
      {/* 🔦 Top Focal Glow */}
      <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[1000px] h-[600px] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12"
      >
        {/* Network discovery header integrated via RoomList, 
            but we add the Direct Access Protocol here at the top layer */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-end">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Registry // Global_Discovery_Active</span>
                </div>
                <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">Discovery_<span className="text-gray-600">Protocol.</span></h1>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.3em] max-w-md">Initialize a secure connection to existing collaborative environment nodes via direct ID or public registry.</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2">
                      <TerminalIcon size={12} /> Direct_Access_Link
                    </label>
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Type: UUID/Hash</span>
                </div>
                <div className="flex bg-white/[0.01] border border-white/5 focus-within:border-white/20 transition-all">
                    <input
                        type="text"
                        placeholder="Node_Identification_Sequence..."
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="flex-1 bg-transparent py-5 px-6 text-sm font-mono text-white placeholder-gray-800 outline-none"
                    />
                    <button
                        onClick={handleJoinById}
                        className="px-8 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95"
                    >
                        Hook_Node
                    </button>
                </div>
            </div>
        </div>

        {/* The Node Registry List */}
        <div className="mt-12">
            <div className="h-px w-full bg-gradient-to-r from-white/5 via-white/5 to-transparent mb-12" />
            <RoomList />
        </div>

        {/* System Metadata Footer */}
        <footer className="mt-32 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-12 text-[8px] font-black uppercase tracking-[0.4em] text-gray-800">
            <div className="flex gap-12">
                <span>Protocol: RTC-Sync-v4</span>
                <span>Security: AES-256 GCM</span>
                <span>Discovery: Global_Relay</span>
            </div>
            <span>v2.4.9-Stable_Build // System_Ready</span>
        </footer>
      </motion.div>
    </div>
  );
}