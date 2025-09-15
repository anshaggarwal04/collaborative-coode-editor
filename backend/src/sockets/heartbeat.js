///Users/anshaggarwal/Desktop/project_2/backend/src/sockets/heartbeat.js

import prisma from "../config/db.js";

export function initHeartbeat(io, socket) {
  socket.on("heartbeat", async (userId) => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { lastSeen: new Date() },
      });
    } catch {
      console.log(`⚠️ Failed heartbeat for user: ${userId}`);
    }
  });
}