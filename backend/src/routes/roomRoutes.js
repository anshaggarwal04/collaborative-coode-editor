import express from "express";
import { createRoom, joinRoom, getMyRooms,getRoomById } from "../controllers/roomController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a room
router.post("/create", authMiddleware, createRoom);

// Join a room
router.post("/join", authMiddleware, joinRoom);


// Get my joined rooms
router.get("/my", authMiddleware, getMyRooms);

// new route
router.get("/:id",authMiddleware, getRoomById); 


export default router;