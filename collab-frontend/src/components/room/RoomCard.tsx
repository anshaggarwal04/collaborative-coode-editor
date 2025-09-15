"use client";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface RoomCardProps {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
}

export default function RoomCard({ id, name, createdBy }: RoomCardProps) {
  const router = useRouter();

  const handleJoin = async () => {
    try {
      await api.post("/rooms/join", { roomId: id });
      toast.success(`Joined room "${name}"`);
      router.push(`/rooms/${id}`); // ✅ Go inside room
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to join room");
    }
  };

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p className="text-sm opacity-70">Created by: {createdBy}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-outline" onClick={handleJoin}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}