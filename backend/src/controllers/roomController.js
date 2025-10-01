import prisma from "../config/db.js";

// Create Room
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

    // Automatically add creator as participant
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

// Join Room

export async function joinRoom(req, res, next) {
  try {
    const roomId = req.body.roomId || req.body.id;

    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if user already has a record
    const existing = await prisma.roomUser.findUnique({
      where: {
        roomId_userId: {
          roomId: room.id,
          userId: req.user.id,
        },
      },
    });

    let roomUser;
    if (existing) {
      if (!existing.isActive) {
        // Reactivate the user
        roomUser = await prisma.roomUser.update({
          where: {
            roomId_userId: { roomId: room.id, userId: req.user.id },
          },
          data: { isActive: true, leftAt: null, lastSeen: new Date() },
        });
      } else {
        // already active
        return res.json({
          success: true,
          message: `You are already in '${room.name}'`,
          room,
          roomUser: existing,
        });
      }
    } else {
      // First time joining
      roomUser = await prisma.roomUser.create({
        data: {
          userId: req.user.id,
          roomId: room.id,
          isActive: true,
        },
      });
    }

    return res.json({
      success: true,
      message: `Joined room '${room.name}' successfully`,
      room,
      roomUser,
    });
  } catch (err) {
    next(err);
  }
}
// Get rooms the current user is actively in
// Get all rooms the user has ever joined (active or inactive)
export async function getMyRooms(req, res, next) {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        participants: {
          some: { userId: req.user.id }, // user was part of this room
        },
      },
      include: {
        participants: {
          where: { isActive: true }, // include only active participants for display
          include: {
            user: { select: { id: true, username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" }, // newest first
    });

    res.json({ rooms });
  } catch (err) {
    console.error("🔥 Error fetching user’s rooms:", err);
    next(err);
  }
}
// Get rooms current user has joined

// Get room by ID with current user status
export async function getRoomById(req, res, next) {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        participants: {
          include: { user: true },
        },
      },
    });

    if (!room) return res.status(404).json({ error: "Room not found" });

    // Find current user’s participation record
    const myStatus = await prisma.roomUser.findUnique({
      where: {
        roomId_userId: {
          roomId: id,
          userId: req.user.id,
        },
      },
      select: {
        isActive: true,
        leftAt: true,
      },
    });

    res.json({
      room,
      myStatus: myStatus
        ? myStatus
        : { isActive: false, leftAt: null }, // default if never joined
    });
  } catch (err) {
    next(err);
  }
}

// ✅ Leave Room
export async function leaveRoom(req, res, next) {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    // Mark as inactive
    const updated = await prisma.roomUser.updateMany({
      where: { roomId, userId: req.user.id },
      data: { isActive: false, leftAt: new Date() },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: "You were not in this room" });
    }

    return res.json({ success: true, message: "Left room successfully" });
  } catch (err) {
    next(err);
  }
}