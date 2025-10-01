import prisma from "../../config/db.js";

// ✅ Join room
export async function handleJoinRoom(io, socket, { roomId }) {
  try {
    const { id: userId, username } = socket.user;

    console.log(`${username} attempting to join room ${roomId}`);

    // 1. Check if room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    // 2. Check if RoomUser record exists
    const existing = await prisma.roomUser.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (existing) {
      // Reactivate if previously inactive
      await prisma.roomUser.update({
        where: { roomId_userId: { roomId, userId } },
        data: { isActive: true, leftAt: null, lastSeen: new Date() },
      });
    } else {
      // First-time join
      await prisma.roomUser.create({
        data: { userId, roomId, isActive: true },
      });
    }

    // 3. Add user to socket.io room
    socket.join(roomId);
    console.log(`👥 ${username} joined ${room.name}`);

    // 4. Fetch **latest codeChange event**
    const lastCode = await prisma.roomHistory.findFirst({
      where: { roomId, event: "codeChange" },
      orderBy: { timestamp: "desc" },
    });

    if (lastCode) {
      // Send last saved code only to this user
      socket.emit("codeUpdate", lastCode.payload);
    }

    // 5. Broadcast updated active users in this room
    const usersInRoom = await prisma.roomUser.findMany({
      where: { roomId, isActive: true },
      include: { user: { select: { id: true, username: true } } },
    });

    io.to(roomId).emit("roomUsers", {
      room,
      users: usersInRoom.map((u) => u.user),
    });

    // 6. Confirm to this socket
    socket.emit("joinedRoom", { room, userId });
  } catch (err) {
    console.error("Join room error details:", err);
    socket.emit("error", { message: err.message || "Failed to join room" });
  }
}

// ✅ Leave room
export async function handleLeaveRoom(io, socket, { roomId }) {
  try {
    const { id: userId, username } = socket.user;

    // 1. Mark inactive instead of deleting
    await prisma.roomUser.update({
      where: { roomId_userId: { roomId, userId } },
      data: { isActive: false, leftAt: new Date() },
    });

    // 2. Fetch remaining active users
    const usersInRoom = await prisma.roomUser.findMany({
      where: { roomId, isActive: true },
      include: { user: { select: { id: true, username: true } } },
    });

    if (usersInRoom.length === 0) {
      console.log(`Room ${roomId} is now empty`);
      // Optional: cleanup logic if no one is left
    } else {
      io.to(roomId).emit("roomUsers", {
        roomId,
        users: usersInRoom.map((u) => u.user),
      });
    }

    // 3. Leave socket.io room
    socket.leave(roomId);
    console.log(`${username} left room ${roomId}`);
  } catch (err) {
    console.error("Leave room error:", err);
    socket.emit("error", { message: "Failed to leave room" });
  }
}