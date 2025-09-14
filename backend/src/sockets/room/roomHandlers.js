import prisma from "../../config/db.js";

export async function handleJoinRoom(io, socket, { roomName }) {
  try {
    const username = socket.user.username;
    const userId = socket.user.id;

    console.log(`👤 ${username} attempting to join ${roomName}`);

    let room = await prisma.room.findUnique({ where: { name: roomName } });
    if (!room) {
      room = await prisma.room.create({ data: { name: roomName } });
    }

    const existingUser = await prisma.user.findFirst({
      where: { id: userId, roomId: room.id },
    });
    if (existingUser) {
      socket.emit("error", { message: "Already in this room" });
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: { roomId: room.id },
    });

    socket.join(roomName);
    console.log(`👥 ${username} joined ${roomName}`);

    const usersInRoom = await prisma.user.findMany({
      where: { roomId: room.id },
      select: { id: true, username: true },
    });

    io.to(roomName).emit("roomUsers", { room: roomName, users: usersInRoom });
    socket.emit("joinedRoom", { room, userId });
  } catch (err) {
    console.error("❌ Join room error:", err);
    socket.emit("error", { message: "Failed to join room" });
  }
}

export async function handleLeaveRoom(io, socket, { roomName }) {
  try {
    const userId = socket.user.id;

    await prisma.user.update({
      where: { id: userId },
      data: { roomId: null },
    });

    const room = await prisma.room.findUnique({ where: { name: roomName } });
    if (!room) return;

    const usersInRoom = await prisma.user.findMany({
      where: { roomId: room.id },
      select: { id: true, username: true },
    });

    if (usersInRoom.length === 0) {
      // 🔹 Delete empty room
      await prisma.room.delete({ where: { id: room.id } });
      console.log(`🗑️ Deleted empty room: ${room.name}`);
    } else {
      io.to(roomName).emit("roomUsers", { room: roomName, users: usersInRoom });
    }

    socket.leave(roomName);
    console.log(`👤 ${socket.user.username} left ${roomName}`);
  } catch (err) {
    console.error("❌ Leave room error:", err);
  }
}