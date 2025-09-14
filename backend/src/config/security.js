import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import rateLimit from "express-rate-limit";

export default function applySecurity(app) {
  app.use(helmet()); // secure headers
  app.use(cors({ origin: "*" })); // restrict later to your frontend
  app.use(express.json());
  app.use(morgan("dev"));

  // Rate limit compiler API
  const compilerLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 10,
    message: { error: "Too many requests, try again later." },
  });
  app.use("/api/compiler", compilerLimiter);
}