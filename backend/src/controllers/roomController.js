import prisma from "../config/db.js";

// ✅ Create Room
export async function createRoom(req, res, next) {
  try {
    const { name } = req.body;

    const room = await prisma.room.create({
      data: {
        name,
        createdBy: req.user.id,
      },
    });

    return res.json({
      success: true,
      message: `Room '${name}' created successfully`,
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

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }

    const roomUser = await prisma.roomUser.create({
      data: {
        userId: req.user.id,
        roomId: room.id,
      },
    });

    return res.json({
      success: true,
      message: `Joined room '${room.name}' successfully`,
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

// Get all rooms
export async function getAllRooms(req, res, next) {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        participants: {
          include: { user: true }
        }
      }
    });
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
}

// Get rooms current user has joined

