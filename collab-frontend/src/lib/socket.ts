"use client";

import { io, Socket } from "socket.io-client";

// Minimal shape for Judge0 result payloads your server emits
export type CodeResult = {
  stdout: string | null;
  time: string | null;
  memory: number | null;
  stderr: string | null;
  compile_output: string | null;
  status?: { id: number; description: string } | null;
};

// Server -> Client events
interface ServerToClientEvents {
  roomUsers: (data: { room: string; users: { id: string; username: string }[] }) => void;
  joinedRoom: (data: { room: any; userId: string }) => void;
  codeUpdate: (code: string) => void;
  codeResult: (result: any) => void;
  error: (data: { message: string }) => void;

  // ✅ Add this so TS knows about roomHistory
  roomHistory: (history: Array<{ event: string; payload?: string }>) => void;
}
// Client -> Server events
interface ClientToServerEvents {
  joinRoom: (data: { roomId: string }) => void;
  leaveRoom: (data: { roomId: string }) => void;

  codeChange: (data: { roomId: string; code: string }) => void;
  noteChange: (data: { roomId: string; text: string }) => void;

  runCode: (data: {
    roomId: string;
    language_id: number;
    source_code: string;
    stdin?: string;
  }) => void;

  heartbeat: (userId: string) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function initSocket(token: string) {
  if (!socket) {
    socket = io("http://localhost:5010", {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚡ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection failed:", err.message);
    });

    socket.on("error", (err) => {
      console.error("Socket error (server-side):", err?.message || err);
    });
  }
  return socket;
}

export function getSocket() {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket(token) first.");
  }
  return socket;
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket fully disconnected");
  }
};