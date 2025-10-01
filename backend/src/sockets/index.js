import { initRoomSocket } from "./room/roomSocket.js";
import { initCodeSocket } from "./code/codeSocket.js";
import { initHeartbeat } from "./heartbeat.js";
import { socketAuth } from "./auth/socketAuth.js";

export function initSocket(io) {
  console.log("🔁 initSocket CALLED");

  if (!io._authMiddlewareApplied) {
    socketAuth(io);
    io._authMiddlewareApplied = true;
  }


  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // 🔹 Modular socket logic
    initRoomSocket(io, socket);
    initCodeSocket(io, socket);
    initHeartbeat(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}