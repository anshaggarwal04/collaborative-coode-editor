import express from "express";
import { createRoom, joinRoom, getAllRooms, getMyRooms } from "../controllers/roomController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a room
router.post("/", authMiddleware, createRoom);

// Join a room
router.post("/join", authMiddleware, joinRoom);

// Get all rooms
router.get("/", getAllRooms);

// Get my joined rooms
router.get("/my", authMiddleware, getMyRooms);

export default router;