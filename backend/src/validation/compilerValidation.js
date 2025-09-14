import { z } from "zod";

export const runCodeSchema = z.object({
  body: z.object({
    language_id: z.number().int("Language ID must be an integer"),
    source_code: z.string().min(1, "Source code cannot be empty"),
    stdin: z.string().optional(),
    roomName: z.string().optional(), // required only if tied to rooms
  }),
});