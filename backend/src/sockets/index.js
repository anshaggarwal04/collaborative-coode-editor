import { initRoomSocket } from "./room/roomSocket.js";
import { initCodeSocket } from "./code/codeSocket.js";
import { initHeartbeat } from "./heartbeat.js";
import { socketAuth } from "./auth/socketAuth.js";

export function initSocket(io) {
    // 🔹 Apply JWT auth middleware
  socketAuth(io);


    io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // Modular socket inits
    initRoomSocket(io, socket);
    initCodeSocket(io, socket);
    initHeartbeat(io, socket);

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}