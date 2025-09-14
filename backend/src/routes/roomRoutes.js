import express from "express";
import { createRoom, joinRoom } from "../controllers/roomController.js";
import validate from "../middlewares/validate.js";
import { createRoomSchema } from "../validation/roomValidation.js";

const router = express.Router();

// ✅ RESTful & clean
router.post("/", validate(createRoomSchema), createRoom);   // POST /api/rooms
router.post("/join", joinRoom);                             // POST /api/rooms/join

export default router;