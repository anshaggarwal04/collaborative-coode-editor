"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { initSocket, getSocket } from "@/lib/socket";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function RoomPage() {
  const { id } = useParams(); // roomId from URL
  useAuthContext();
  const [note, setNote] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = initSocket(token);

    // 👇 Join the room
    socket.emit("joinRoom", { roomId: String(id) });

    // 👂 Load persisted history
    socket.on(
      "roomHistory",
      (history: Array<{ event: string; payload?: string }>) => {
        if (history.length > 0) {
          // find the latest codeChange event
          const lastCode = [...history]
            .reverse()
            .find((h) => h.event === "codeChange" && h.payload)?.payload;

          if (lastCode) {
            setNote(lastCode);
          }
        }
      }
    );

    // 👂 Live updates
    socket.on("codeUpdate", (newCode: string) => {
      setNote(newCode);
    });

    return () => {
      socket.emit("leaveRoom", { roomId: String(id) });
      socket.off("roomHistory");
      socket.off("codeUpdate");
    };
  }, [id]);

  // ✅ Broadcast code changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNote(text);

    try {
      const socket = getSocket();
      socket.emit("codeChange", { roomId: String(id), code: text });
    } catch {
      toast.error("Socket not connected");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shared Notepad 📝</h1>

      <textarea
        value={note}
        onChange={handleChange}
        className="textarea textarea-bordered w-full h-[500px]"
        placeholder="Start typing..."
      />
    </div>
  );
}