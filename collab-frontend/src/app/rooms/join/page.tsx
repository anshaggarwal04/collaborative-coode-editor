"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

interface RoomsResponse {
  rooms: Room[];
}

interface JoinRoomResponse {
  room: Room;
}

export default function JoinRoomPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  // Fetch rooms user already joined
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

  const handleJoinByName = async () => {
    if (!roomName.trim()) return toast.error("Please enter a room name");

    try {
      const res = await api.post<JoinRoomResponse>("/rooms/join", { roomName });
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

      {/* Join by typing room name */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter room Id"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="input input-bordered w-full"
        />
        <button className="btn btn-primary" onClick={handleJoinByName}>
          Join
        </button>
      </div>

      {/* List of rooms user already joined */}
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
                <p className="text-sm opacity-70">
                  Created: {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}