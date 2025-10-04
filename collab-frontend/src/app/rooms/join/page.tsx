"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import { DoorOpen } from "lucide-react";
import JoinBackground from "@/components/join/JoinBackground";
import RoomList from "@/components/room/RoomList";

export default function JoinRoomPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  // 🔹 Join new room by ID
  const handleJoinById = async () => {
    if (!roomId.trim()) return toast.error("Please enter a Room ID");

    try {
      const res = await api.post("/rooms/join", { roomId });
      toast.success(`Joined room "${res.data.room.name}"`);
      router.push(`/rooms/${res.data.room.id}`);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to join room");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0f172a] text-white px-6 py-12">
      {/* Futuristic Background */}
      <JoinBackground />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg mb-12">
          Join a Room
        </h1>

        {/* Join by ID */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="input input-bordered w-full px-4 py-3 rounded-xl bg-[#111827]/90 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
            onClick={handleJoinById}
          >
            <DoorOpen size={18} /> Join
          </button>
        </div>

        {/* Past Rooms (now using RoomList) */}
        <RoomList />
      </div>
    </div>
  );
}