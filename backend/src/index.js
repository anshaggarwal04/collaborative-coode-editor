// src/index.js
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { startServer } from "./config/server.js";
import { initSocket } from "./sockets/index.js";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

initSocket(io);

const PORT = process.env.PORT || 5010;
if (process.env.NODE_ENV !== "test") {
  startServer(server, PORT, io);
}

export default app; // 👈 still export for tests