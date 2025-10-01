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

    // 2. Upsert roomUser record
    const existing = await prisma.roomUser.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (existing) {
      await prisma.roomUser.update({
        where: { roomId_userId: { roomId, userId } },
        data: { isActive: true, leftAt: null, lastSeen: new Date() },
      });
    } else {
      await prisma.roomUser.create({
        data: { userId, roomId, isActive: true },
      });
    }

    // 3. Add user to socket.io room
    socket.join(roomId);
    console.log(`👥 ${username} joined ${room.name}`);

    // 4. Fetch last code from DB
    const lastCode = await prisma.roomHistory.findFirst({
      where: { roomId, event: "codeChange" },
      orderBy: { timestamp: "desc" },
    });

    if (lastCode) {
      socket.emit("codeUpdate", lastCode.payload);
    }

    // 5. Broadcast updated active users
    const usersInRoom = await prisma.roomUser.findMany({
      where: { roomId, isActive: true },
      include: { user: { select: { id: true, username: true } } },
    });

    io.to(roomId).emit("roomUsers", {
      room,
      users: usersInRoom.map((u) => u.user),
    });

    // 6. Confirm join
    socket.emit("joinedRoom", { room, userId });

    // 7. 🆕 Ask others to send their latest code (sync)
    socket.to(roomId).emit("requestLatestCode", { newUserId: userId });
  } catch (err) {
    console.error("Join room error details:", err);
    socket.emit("error", { message: err.message || "Failed to join room" });
  }
}

// ✅ Leave room
export async function handleLeaveRoom(io, socket, { roomId }) {
  try {
    const { id: userId, username } = socket.user;

    await prisma.roomUser.update({
      where: { roomId_userId: { roomId, userId } },
      data: { isActive: false, leftAt: new Date() },
    });

    const usersInRoom = await prisma.roomUser.findMany({
      where: { roomId, isActive: true },
      include: { user: { select: { id: true, username: true } } },
    });

    if (usersInRoom.length === 0) {
      console.log(`Room ${roomId} is now empty`);
    } else {
      io.to(roomId).emit("roomUsers", {
        roomId,
        users: usersInRoom.map((u) => u.user),
      });
    }

    socket.leave(roomId);
    console.log(`${username} left room ${roomId}`);
  } catch (err) {
    console.error("Leave room error:", err);
    socket.emit("error", { message: "Failed to leave room" });
  }
}