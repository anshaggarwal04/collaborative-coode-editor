import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function socketAuth(io) {
  // prevent applying middleware multiple times
  if (io._authMiddlewareApplied) return;
  io._authMiddlewareApplied = true;

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach decoded payload to socket (id, username, etc.)
      socket.user = decoded;

      next();
    } catch (err) {
      console.error("❌ Socket auth error:", err.message);
      next(new Error("Authentication error: Invalid or expired token"));
    }
  });
}