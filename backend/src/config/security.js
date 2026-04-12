import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "./redis.js";

export default function applySecurity(app) {
  app.use(helmet()); // secure headers
  app.use(express.json());
  app.use(morgan("dev"));

  // Rate limit compiler API using Redis (fallback to Memory if Redis down)
  const limiterOptions = {
    windowMs: 60 * 1000, // 1 min
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, try again later." },
  };

  if (redisClient.isOpen) {
    limiterOptions.store = new RedisStore({
      // @ts-expect-error - Known issue with rate-limit-redis typing
      sendCommand: (...args) => redisClient.sendCommand(args),
    });
    console.log("🛡️  Rate limiter using Redis store");
  } else {
    console.log("🛡️  Rate limiter using Memory store (Redis not connected)");
  }

  const compilerLimiter = rateLimit(limiterOptions);
  app.use("/api/compiler", compilerLimiter);
}