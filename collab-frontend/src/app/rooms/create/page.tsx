"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import {AxiosError} from "axios";

export default function CreateRoomPage() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return toast.error("Room name is required");

    setCreating(true);
    try {
      const res = await api.post("/rooms", { roomName });
      toast.success(`Room "${res.data.room.name}" created!`);
      setRoomName("");

      // redirect user directly to the created room
      router.push(`/room/${res.data.room.id}`);
    } catch (err) {
        const error = err as AxiosError<{ error?: string }>;
        console.error(error);
        toast.error(error.response?.data?.error || "Failed to create room");
      } finally {
        setCreating(false);
      }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
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
            <button className="btn" onClick={() => router.push("/dashboard")}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateRoom}
              disabled={creating}
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}