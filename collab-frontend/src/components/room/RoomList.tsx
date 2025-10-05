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
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16">
      {/* ───────────────────────────── Header ───────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-4xl font-extrabold text-transparent bg-clip-text 
                     bg-gradient-to-r from-white/90 to-white/70 tracking-tight"
        >
          Available Rooms
        </motion.h1>

        <motion.button
          whileHover={{
            scale: 1.04,
            boxShadow:
              "0 0 25px rgba(16,185,129,0.3), 0 0 10px rgba(255,255,255,0.1)",
          }}
          whileTap={{ scale: 0.96 }}
          onClick={() => router.push("/rooms/create")}
          className="mt-5 sm:mt-0 flex items-center gap-2 px-6 py-3 rounded-xl
                     bg-[#1a1d1f] text-white font-medium border border-white/10
                     hover:bg-[#1f2225] hover:border-emerald-400/30 transition-all duration-300"
        >
          <PlusCircle size={18} /> Create Room
        </motion.button>
      </div>

      {/* ───────────────────────────── Rooms Grid ───────────────────────────── */}
      {rooms.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center text-gray-400 mt-24 text-lg"
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-emerald-300"
          >
            No rooms available yet 🌱
          </motion.span>
        </motion.p>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.25 },
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