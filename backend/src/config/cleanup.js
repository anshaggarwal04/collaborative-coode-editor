// src/config/cleanup.js
import prisma from "../config/db.js";

export function startCleanupJob(io) {
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - 10000); // 10s ago
      const staleRoomUsers = await prisma.roomUser.findMany({
        where: { lastSeen: { lt: cutoff } },
      });

      for (const participant of staleRoomUsers) {
        await prisma.roomUser.delete({ where: { id: participant.id } });

        const usersInRoom = await prisma.roomUser.findMany({
          where: { roomId: participant.roomId },
        });

        const room = await prisma.room.findUnique({
          where: { id: participant.roomId },
        });

        if (room) {
          if (usersInRoom.length === 0) {
            await prisma.room.delete({ where: { id: room.id } });
            console.log(`🗑️ Deleted empty room: ${room.name}`);
          } else {
            io.to(room.name).emit("roomUsers", { room: room.name, users: usersInRoom });
            console.log(`🧹 Cleaned up ghost user from ${room.name}`);
          }
        }
      }
    } catch (err) {
      console.error("❌ Cleanup job error:", err);
    }
  }, 10000);
}