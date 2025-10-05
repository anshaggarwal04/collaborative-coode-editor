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
  createdBy: string;
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
      whileHover={{
        scale: 1.03,
        boxShadow:
          "0 0 30px rgba(16,185,129,0.25), 0 0 12px rgba(255,255,255,0.08)",
      }}
      onClick={handleJoin}
      className="p-6 rounded-2xl cursor-pointer border border-white/10 
                 bg-[#121417]/80 backdrop-blur-xl 
                 shadow-[0_0_25px_rgba(0,0,0,0.4)] 
                 hover:border-emerald-400/40 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold mb-2 text-white">
        {name}
      </h3>

      <div className="text-sm text-gray-400 space-y-1">
        <p>
          👤 Created by{" "}
          <span className="text-emerald-400 font-medium">{createdBy}</span>
        </p>
        <p className="flex items-center gap-2">
          <Users size={14} className="text-cyan-400" />
          {participants.length} participant{participants.length !== 1 && "s"}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={14} className="text-emerald-300" />
          Created on {formattedDate}
        </p>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleJoin();
          }}
          className="px-5 py-2.5 text-sm rounded-lg font-medium text-white 
                     bg-emerald-600 hover:bg-emerald-500 
                     shadow-[0_0_20px_rgba(16,185,129,0.3)] 
                     transition-all duration-300 active:scale-95"
        >
          Join
        </button>
      </div>
    </motion.div>
  );
}