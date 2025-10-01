// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import applySecurity from "./config/security.js";
import errorHandler from "./middlewares/errorHandler.js";
import roomRoutes from "./routes/roomRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();

// Core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security + CORS
applySecurity(app);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", authMiddleware, roomRoutes);
app.use("/api/compiler", compilerRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

// Global error handler
app.use(errorHandler);

export default app;