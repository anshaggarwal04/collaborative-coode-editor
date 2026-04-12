"use client";

import RoomCard from "./RoomCard";
import { useRooms } from "@/hooks/useRooms";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoomList() {
  const { rooms, loading } = useRooms();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-emerald-400"></span>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-10">
      {/* ───────────────────────────── Registry Header ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-end mb-16 border-b border-white/5 pb-10 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
             <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Nodes // Discovery_Active</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none"
          >
            Active_<span className="text-gray-600">Registry.</span>
          </motion.h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Authorized Environment Observation Layer</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/rooms/create")}
          className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
        >
          <PlusCircle size={16} strokeWidth={2.5} /> Initialize_New_Node
        </motion.button>
      </div>

      {/* ───────────────────────────── Node Grid ───────────────────────────── */}
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/5 bg-white/[0.01]">
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.6em] animate-pulse">
               Empty_History_Fragment
            </span>
            <span className="mt-4 text-[8px] font-mono text-gray-800 uppercase tracking-widest">Waiting for incoming synchronization...</span>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          className="grid gap-px bg-white/5 border border-white/5"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <RoomCard {...room} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}