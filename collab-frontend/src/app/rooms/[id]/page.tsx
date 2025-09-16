"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuthContext } from "@/context/AuthContext";

interface Room {
  id: string;
  name: string;
}

let socket: Socket | null = null;

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthContext();

  const [room, setRoom] = useState<Room | null>(null);
  const [code, setCode] = useState("// Start coding here 🚀");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in first");
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // ✅ Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.room);
      } catch {
        toast.error("Room not found");
        router.push("/rooms/join");
      }
    };
    fetchRoom();
  }, [id, router]);

  // ✅ Setup socket connection
  useEffect(() => {
    if (!id || !user) return;

    const token = localStorage.getItem("token");
    socket = io("http://localhost:5010", {
      auth: { token },
    });

    socket.emit("joinRoom", { roomName: room?.name, userId: user.id });

    socket.on("codeUpdate", (newCode: string) => setCode(newCode));
    socket.on("codeResult", (result: any) => {
      setOutput(result.stdout || result.stderr || "Execution finished.");
    });

    return () => {
      socket?.disconnect();
    };
  }, [id, room?.name, user]);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
    socket?.emit("codeChange", { roomName: room?.name, code: value });
  };

  const handleRunCode = () => {
    if (!socket) return;
    socket.emit("runCode", {
      roomName: room?.name,
      language_id: 63, // JavaScript by default
      source_code: code,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Room: {room?.name || "Loading..."}
      </h1>

      {/* Code Editor */}
      <Editor
        height="60vh"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleCodeChange}
      />

      <div className="flex gap-4 mt-4">
        <button className="btn btn-primary" onClick={handleRunCode}>
          Run Code
        </button>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select select-bordered"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Output */}
      <div className="mt-6 p-4 bg-base-200 rounded">
        <h2 className="font-bold mb-2">Output</h2>
        <pre className="whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}