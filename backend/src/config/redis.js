import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 0) {
        return new Error("Redis connection failed"); // Stop retrying after 1 failure
      }
      return 1000;
    }
  }
});

redisClient.on("error", (err) => {
  if (err.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
    // Suppress verbose stack trace for expected local connection failures
    return;
  }
  console.error("❌ Redis Client Error:", err);
});
redisClient.on("connect", () => console.log("✅ Redis connected"));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (err) {
      console.warn("⚠️ Redis could not connect. Falling back to in-memory state for this session.");
    }
  }
}

export default redisClient;
