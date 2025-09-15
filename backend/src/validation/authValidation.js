import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

//Login can be either username OR email
export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6),
  }).refine((data) => data.username || data.email, {
    message: "Either username or email is required",
    path: ["username"], // attaches error to username if both are missing
  }),
});