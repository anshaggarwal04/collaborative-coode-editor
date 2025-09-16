import prisma from "../config/db.js";

// ✅ Create Room
export async function createRoom(req, res, next) {
  try {
    const { roomName } = req.body;

    // Create room
    const room = await prisma.room.create({
      data: {
        name: roomName,
        createdBy: req.user.id,
      },
    });

    // ✅ Automatically add creator as participant
    await prisma.roomUser.create({
      data: {
        userId: req.user.id,
        roomId: room.id,
      },
    });

    return res.json({
      success: true,
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

    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

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
      room,
      roomUser,
    });
  } catch (err) {
    next(err);
  }
}

// ✅ Get rooms the current user has joined
export async function getMyRooms(req, res, next) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        participants: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true },
            },
          },
        },
      },
    });

    res.json({ rooms });
  } catch (err) {
    next(err);
  }
}



// Get rooms current user has joined

export async function getRoomById(req, res, next) {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: true }
        }
      }
    });

    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({ room });
  } catch (err) {
    next(err);
  }
}