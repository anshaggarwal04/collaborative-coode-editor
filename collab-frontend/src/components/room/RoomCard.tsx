"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface RoomCardProps {
  id: string;
  name: string;
  createdBy: string; // ✅ assume this is already a username, not ID
  createdAt: string;
  participants?: { user: { id: string; username: string } }[];
}

export default function RoomCard({
  id,
  name,
  createdBy,
  createdAt,
  participants = [],
}: RoomCardProps) {
  const router = useRouter();

  const handleJoin = async () => {
    try {
      await api.post("/rooms/join", { roomId: id });
      toast.success(`Joined room "${name}"`);
      router.push(`/rooms/${id}`);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to join room");
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-[#111827]/80 border border-gray-700 
                 shadow-md hover:shadow-purple-500/20 
                 transition-all duration-200 p-5 cursor-pointer"
      onClick={handleJoin}
    >
      <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>

      <div className="text-sm text-gray-400 space-y-1">
        <p>
          👤 Created by <span className="text-purple-400">{createdBy}</span>
        </p>
        <p className="flex items-center gap-2">
          <Users size={14} className="text-cyan-400" />
          {participants.length} participant{participants.length !== 1 && "s"}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={14} className="text-pink-400" />
          Created on {formattedDate}
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            handleJoin();
          }}
          className="px-4 py-2 text-sm rounded-lg font-medium 
                     bg-gradient-to-r from-indigo-500 to-purple-600 
                     text-white shadow hover:scale-105 transition"
        >
          Join
        </button>
      </div>
    </motion.div>
  );
}