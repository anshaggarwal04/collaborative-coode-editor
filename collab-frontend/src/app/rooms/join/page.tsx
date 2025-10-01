"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AxiosError } from "axios";

interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  participants?: { user: { id: string; username: string } }[];
}

interface RoomsResponse {
  rooms: Room[];
}

export default function JoinRoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState("");

  // 🔹 Fetch rooms user has already joined
  const fetchRooms = async () => {
    try {
      const res = await api.get<RoomsResponse>("/rooms/my");
      setRooms(res.data.rooms || []);
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>;
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to load your rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Join a Room</h1>

      {/* Join by ID */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Paste Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="input input-bordered w-full"
        />
        <button className="btn btn-primary" onClick={handleJoinById}>
          Join
        </button>
      </div>

      {/* Past rooms */}
      <h2 className="text-xl font-semibold mb-4">Your Rooms</h2>
      {loading ? (
        <p>Loading...</p>
      ) : rooms.length === 0 ? (
        <p className="opacity-70">You haven’t joined any rooms yet 🚪</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="card bg-base-200 shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/rooms/${room.id}`)}
            >
              <div className="card-body">
                <h3 className="font-bold">{room.name}</h3>
                <p className="text-sm opacity-70">Room ID: {room.id}</p>
                <p className="text-sm">
                  Participants: {room.participants?.length ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}