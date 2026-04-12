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
      whileHover={{ 
        borderColor: "rgba(255,255,255,0.15)",
        backgroundColor: "rgba(255,255,255,0.01)" 
      }}
      onClick={handleJoin}
      className="group relative p-8 rounded-none border border-white/5 bg-[#0a0a0a] transition-all cursor-pointer overflow-hidden flex flex-col gap-8"
    >
      {/* 📡 Signal Status Indicator */}
      <div className="absolute top-0 right-0 p-4 flex items-center gap-2">
         <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live_Signal</span>
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      </div>

      {/* Node Header */}
      <div className="space-y-1">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-blue-400 transition-colors truncate">
          {name}
        </h3>
        <div className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em]">Node_Identity // Verified</div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-y-6 pt-6 border-t border-white/5">
        <div className="flex flex-col">
           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">Architect</span>
           <span className="text-[11px] font-bold text-gray-400 font-mono tracking-tight truncate pr-4">{createdBy}</span>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">Peer_Count</span>
           <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 font-mono tracking-tight">{participants.length}x</span>
              <Users size={12} className="text-gray-700" />
           </div>
        </div>
        <div className="flex flex-col">
           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">Timestamp</span>
           <div className="flex items-center gap-2">
              <Calendar size={12} className="text-gray-700" />
              <span className="text-[11px] font-bold text-gray-500 font-mono tracking-tight uppercase">{formattedDate}</span>
           </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">FragmentID</span>
           <span className="text-[10px] font-bold text-gray-600 font-mono tracking-tight">#{id.slice(0, 8)}</span>
        </div>
      </div>

      {/* Action Sequence */}
      <div className="mt-4 pt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleJoin();
          }}
          className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] bg-white text-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          Initialize_Link
        </button>
      </div>
    </motion.div>
  );
}