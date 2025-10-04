"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);

  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return toast.error("Room name is required");

    setCreating(true);
    try {
      const res = await api.post("/rooms/create", { roomName });
      toast.success(`Room "${res.data.room.name}" created!`);
      setRoomName("");

      router.push(`/rooms/${res.data.room.id}`);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden text-white bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]">
      {/* 🌈 Animated Neon Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          ref={blob1Ref}
          className="absolute w-[900px] h-[900px] rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 opacity-60 blur-[180px] mix-blend-screen animate-pulse"
          style={{ top: "-200px", left: "-300px" }}
        />
        <div
          ref={blob2Ref}
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 opacity-60 blur-[180px] mix-blend-screen animate-pulse"
          style={{ bottom: "-200px", right: "-300px" }}
        />
      </div>

      {/* 🚀 Create Room Card */}
      <div className="card w-full max-w-md shadow-2xl bg-black/80 backdrop-blur-xl border border-white/10 relative z-10">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Create a New Room
          </h2>

          <input
            type="text"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="input input-bordered w-full mb-4"
          />

          <div className="flex justify-end gap-3">
            <button
              className="btn"
              onClick={() => router.push("/dashboard")}
              disabled={creating}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary bg-gradient-to-r from-pink-500 to-cyan-500 border-0 hover:scale-105 transition"
              onClick={handleCreateRoom}
              disabled={creating}
            >
              {creating ? "Creating..." : "✨ Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}