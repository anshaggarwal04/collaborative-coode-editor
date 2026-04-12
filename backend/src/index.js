// src/index.js
import http from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import app from "./app.js";
import applySecurity from "./config/security.js";
import { startServer } from "./config/server.js";
import { initSocket } from "./sockets/index.js";
import { connectRedis } from "./config/redis.js";
import redisClient from "./config/redis.js";
import { initYjs } from "./config/yjs.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000", methods: ["GET", "POST"], credentials: true },
});

const PORT = process.env.PORT || 5010;

// Connect to Redis and setup adapter before starting server
async function start() {
  if (process.env.NODE_ENV !== "test") {
    try {
      await connectRedis();
      
      if (redisClient.isOpen) {
        applySecurity(app);
        const pubClient = redisClient.duplicate();
        const subClient = redisClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));
        console.log("✅ Redis adapter for Socket.io attached");
      } else {
        // Fallback for local development if Redis is not running
        applySecurity(app); 
        console.warn("⚠️  Skipping Redis adapter (Redis not available). Using default in-memory adapter.");
      }
    } catch (err) {
      console.error("❌ Unexpected error during Redis setup", err);
      applySecurity(app); // Ensure security is at least applied in memory mode
    }
  }

  // Setup Yjs Server
  initYjs(server);
  
  // Setup classic socket.io
  initSocket(io);

  if (process.env.NODE_ENV !== "test") {
    startServer(server, PORT, io);
    console.log(`🚀 BACKEND READY: http://localhost:${PORT}`);
    console.log(`🔗 API BASE URL: http://localhost:${PORT}/api`);
  }
}

start();

export default app; // 👈 still export for tests