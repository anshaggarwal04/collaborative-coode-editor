"use client";

import RoomCard from "./RoomCard";
import { useRooms } from "@/hooks/useRooms";
import CreateRoomModal from "./CreateRoomModal";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

export default function RoomList() {
  const { rooms, loading, fetchRooms } = useRooms();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-purple-400"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text 
                     bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 
                     drop-shadow-lg"
        >
          Available Rooms
        </motion.h1>

        <button
          className="mt-4 sm:mt-0 flex items-center gap-2 px-5 py-3 rounded-xl 
                     bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                     font-semibold shadow-md hover:scale-105 transition"
          onClick={() =>
            (document.getElementById("createRoomModal") as HTMLDialogElement).showModal()
          }
        >
          <PlusCircle size={18} /> Create Room
        </button>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 mt-20"
        >
          No rooms available yet 🚪
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
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            >
              <RoomCard {...room} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Room Modal */}
      <CreateRoomModal onRoomCreated={fetchRooms} />
    </div>
  );
}