// src/sockets/heartbeat.js
import prisma from "../config/db.js";

export function initHeartbeat(io, socket) {
  socket.on("heartbeat", async (userId) => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastSeen: new Date() }, // ✅ now valid
      });
      socket.emit("heartbeatAck", { userId, at: new Date() });
    } catch (err) {
      console.error(`❌ Failed heartbeat for user ${userId}:`, err.message);
    }
  });
}