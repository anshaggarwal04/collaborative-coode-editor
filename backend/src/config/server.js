import { Server } from "socket.io";
import prisma from "./db.js";
import { initSocket } from "../sockets/index.js";
import {startCleanupJob} from "./cleanup.js";

export async function startServer(httpServer, PORT) {
  const io = new Server(httpServer, { cors: { origin: "*" } });
  initSocket(io);

  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    startCleanupJob(io);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}