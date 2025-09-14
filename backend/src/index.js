import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import applySecurity from "./config/security.js";
import errorHandler from "./middlewares/errorHandler.js";
import roomRoutes from "./routes/roomRoutes.js";
import compilerRoutes from "./routes/compilerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { startServer } from "./config/server.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import {initSocket} from "./sockets/index.js";
dotenv.config();

const app = express();


// 🔹 Core middlewares
app.use(express.json());        // ✅ Parse JSON body
app.use(express.urlencoded({ extended: true })); // Optional, for form-data


// 🔹 Apply security + logging
applySecurity(app);

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", authMiddleware,roomRoutes);
app.use("/api/compiler", compilerRoutes);

// 🔹 Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});

// 🔹 Global error handler
app.use(errorHandler);

// 🔹 Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server);

// 🔹 Initialize sockets
initSocket(io);

// 🔹 Start server
const PORT = process.env.PORT || 5010;
startServer(server, PORT);