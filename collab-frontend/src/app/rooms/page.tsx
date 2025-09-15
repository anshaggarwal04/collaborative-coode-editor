"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import RoomCard from "@/components/room/RoomCard";
import CreateRoomModal from "@/components/room/CreateRoomModal";
import { useAuth } from "@/hooks/useAuth";

interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export default function RoomsPage() {
  const { isAuthenticated, loading } = useAuth(true); // ✅ auto-redirect if not logged in
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const router = useRouter();

  // 🔹 Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data.rooms || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load rooms");
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 🔹 Handle room creation
  const handleCreateRoom = async (roomName: string) => {
    try {
      const res = await api.post("/rooms", { roomName });
      toast.success(`Room "${res.data.room.name}" created!`);

      // ✅ Redirect directly into room
      router.push(`/rooms/${res.data.room.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create room");
    }
  };

  if (loading || loadingRooms) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Rooms</h1>
        <CreateRoomModal onCreate={handleCreateRoom} />
      </div>

      {rooms.length === 0 ? (
        <p className="text-center opacity-70">No rooms available yet 🚪</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      )}
    </div>
  );
}