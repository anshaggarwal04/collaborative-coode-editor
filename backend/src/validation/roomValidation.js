import { z } from "zod";

export const createRoomSchema = z.object({
  body: z.object({
    roomName: z
      .string()
      .min(3, "Room name must be at least 3 characters long")
      .max(50, "Room name must be at most 50 characters long")
      .regex(/^[a-zA-Z0-9-_]+$/, "Room name can only contain letters, numbers, - and _"),
  }),
});