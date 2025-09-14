import prisma from "../config/db.js";

// ✅ Create Room
export async function createRoom(req, res, next) {
  try {
    const { roomName } = req.body;

    const room = await prisma.room.create({
      data: {
        name: roomName,
        createdBy: req.user.id,
      },
    });

    return res.json({
      message: `Room '${roomName}' created successfully`,
      room,
    });
  } catch (err) {
    next(err);
  }
}

// ✅ Join Room
export async function joinRoom(req, res, next) {
  try {
    const { roomId } = req.body;

    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Add entry to RoomUser (junction table)
    const roomUser = await prisma.roomUser.create({
      data: {
        userId: req.user.id,
        roomId: room.id,
      },
    });

    return res.json({
      message: `Joined room '${room.name}' successfully`,
      roomUser,
    });
  } catch (err) {
    next(err);
  }
}