// src/components/room/CreateRoomModal.tsx
"use client";

import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface Props {
  onRoomCreated: () => void; // callback to refresh rooms
}

export default function CreateRoomModal({ onRoomCreated }: Props) {
  const [newRoom, setNewRoom] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!newRoom.trim()) return toast.error("Room name is required");

    setCreating(true);
    try {
      const res = await api.post("/rooms", { name: newRoom }); // ✅ FIX: backend expects "name"
      toast.success(`Room "${res.data.room.name}" created!`);
      setNewRoom("");
      (document.getElementById("createRoomModal") as HTMLDialogElement).close();
      onRoomCreated();
    } catch (err) {
        const error = err as AxiosError<{ error?: string }>;
        console.error(error);
        toast.error(error.response?.data?.error || "Failed to create room");
      } finally {
        setCreating(false);
      }
  };

  return (
    <dialog id="createRoomModal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create a New Room</h3>
        <input
          type="text"
          placeholder="Enter room name"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <div className="modal-action">
          <button
            className="btn"
            onClick={() =>
              (document.getElementById("createRoomModal") as HTMLDialogElement).close()
            }
          >
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
    </dialog>
  );
}