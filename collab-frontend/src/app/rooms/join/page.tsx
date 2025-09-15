"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export default function JoinRoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinRoomName, setJoinRoomName] = useState("");
  const [joining, setJoining] = useState(false);

  // Fetch rooms user already joined
  const fetchMyRooms = async () => {
    try {
      const res = await api.get("/rooms/my");
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  // Join by typing room name
  const handleJoinByName = async () => {
    if (!joinRoomName.trim()) return toast.error("Enter a room name");

    setJoining(true);
    try {
      const res = await api.post("/rooms/join", { roomName: joinRoomName });
      toast.success(`Joined room "${res.data.room.name}" 🎉`);
      router.push(`/rooms/${res.data.room.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to join room");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Your Rooms</h1>

      {rooms.length === 0 ? (
        <p className="text-center opacity-70">You haven’t joined any rooms yet 🚪</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="card bg-base-100 shadow-md p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/rooms/${room.id}`)}
            >
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <p className="text-sm opacity-70">
                Created: {new Date(room.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Join by typing room name */}
      <div className="card bg-base-100 shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Join by Room Name</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter room name"
            value={joinRoomName}
            onChange={(e) => setJoinRoomName(e.target.value)}
            className="input input-bordered flex-1"
          />
          <button
            onClick={handleJoinByName}
            className="btn btn-primary"
            disabled={joining}
          >
            {joining ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}