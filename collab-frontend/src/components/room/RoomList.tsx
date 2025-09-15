"use client";

import RoomCard from "./RoomCard";
import { useRooms } from "@/hooks/useRooms";
import CreateRoomModal from "./CreateRoomModal";

export default function RoomList() {
  const { rooms, loading, fetchRooms } = useRooms();

  if (loading) {
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
        <button
          className="btn btn-primary"
          onClick={() =>
            (document.getElementById("createRoomModal") as HTMLDialogElement).showModal()
          }
        >
          + Create Room
        </button>
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

      <CreateRoomModal onRoomCreated={fetchRooms} />
    </div>
  );
}