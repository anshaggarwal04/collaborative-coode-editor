import prisma from "./db.js";
import { startCleanupJob } from "./cleanup.js";

export async function startServer(httpServer, PORT, io) {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // optional: cleanup logic that uses io
    startCleanupJob(io);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    if (process.env.NODE_ENV === "test") {
      throw err; // let Jest handle
    } else {
      process.exit(1); // kill app normally
    }
  }

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}