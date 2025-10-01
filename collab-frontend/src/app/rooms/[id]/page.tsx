"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { initSocket, getSocket } from "@/lib/socket";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

// Import new layout
import { VSCodeLayout } from "@/components/editor";

export default function RoomPage() {
  const { id } = useParams();
  useAuthContext();
  const [code, setCode] = useState("");

  useEffect(() => {
    // socket setup here...
  }, [id]);

  const handleChange = (newCode: string) => {
    setCode(newCode);
    try {
      const socket = getSocket();
      socket.emit("codeChange", { roomId: String(id), code: newCode });
    } catch {
      toast.error("Socket not connected");
    }
  };

  // 👇 this return was missing in your version
  return (
    <VSCodeLayout
      roomId={id as string}
      code={code}
      setCode={handleChange}
    />
  );
}